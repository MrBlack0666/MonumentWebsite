import React from 'react'
import { Modal } from 'react-bootstrap'
import 'react-confirm-alert/src/react-confirm-alert.css'
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import accountService from '../../services/accountService';
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faWindowClose, faCaretSquareLeft, faCaretSquareRight, faPenSquare } from "@fortawesome/free-solid-svg-icons";

import './monumentdetails.css'

class MonumentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        if (props.location.state == null) {
            this.state = {
                pageError: true
            }
        }
        else {
            this.state = {
                id: props.location.state,

                monument: null,

                isLoaded: false,
                monumentTypes: [],
                isDue: "Nie wiadomo",

                showAddNewPhoto: false,
                showOldNewPhoto: false,
                image: null,
                imageError: 0,
                toDisplay: false,
                imageSource: "",
                date: null,

                showAddOrEditTitbit: false,
                editedTitbitId: 0,
                titbitName: "",
                titbitDescription: "",
                displayTitbitDetails: false,
                titbitNameError: false,
                titbitDescriptionError: false,

                titbitPage: 1,
                titbitAllPages: 0,

                titbitNameDisplayed: "",
                titbitDescriptionDisplayed: "",

                isSubmitting: false,
                charTitbitLimit: 2000,

                showAddOrEditMark: false,
                rating: 0,
                ratingError: false,
                editedMarkId: 0,
                comment: "",
                charCommentLimit: 500,

                numberOfMarksRendered: 5,

                isAuthenticated: accountService.isAuthenticated(),
                isUserAdmin: accountService.isInRole("Admin"),
                userName: accountService.getUserName(),
                canUserAddNewMark: false,

                pageError: false
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.handleCloseAddNewPhoto = this.handleCloseAddNewPhoto.bind(this);
        this.handleOpenAddNewPhoto = this.handleOpenAddNewPhoto.bind(this);
        this.handleCloseAddOldPhoto = this.handleCloseAddOldPhoto.bind(this);
        this.handleOpenAddOldPhoto = this.handleOpenAddOldPhoto.bind(this);
        this.addNewPhoto = this.addNewPhoto.bind(this);
        this.addOldPhoto = this.addOldPhoto.bind(this);
        this.getMonumentDetails = this.getMonumentDetails.bind(this);
        this.showPhotos = this.showPhotos.bind(this);
        this.displayAddOrEditTitbit = this.displayAddOrEditTitbit.bind(this);
        this.closeAddOrEditTitbit = this.closeAddOrEditTitbit.bind(this);
        this.addOrEditTitbit = this.addOrEditTitbit.bind(this);
        this.deleteTitbit = this.deleteTitbit.bind(this);
        this.displayAddOrEditMark = this.displayAddOrEditMark.bind(this);
        this.checkIfUserAddedMarkBefore = this.checkIfUserAddedMarkBefore.bind(this);
        this.changeRating = this.changeRating.bind(this);
        this.addOrEditMark = this.addOrEditMark.bind(this);
        this.deleteMark = this.deleteMark.bind(this);
        this.showTitbitDetails = this.showTitbitDetails.bind(this);
        this.deleteMonument = this.deleteMonument.bind(this);
    }

    componentDidMount() {
        if (!this.state.pageError) {
            this.getMonumentTypes();
            this.getMonumentDetails();
        }
    }

    async getMonumentTypes() {
        await fetch("https://localhost:44357/api/monument/getmonumenttypes")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    monumentTypes: data
                })
            })
    }

    async getMonumentDetails() {
        try {
            await fetch("https://localhost:44357/api/monument/getmonumentdetails/" + this.state.id)
                .then(response => response.json())
                .then(data => {
                    if (data == null) {
                        this.setState({
                            monument: null,
                        })
                    }
                    else {
                        this.setState({
                            monument: data,
                            isLoaded: true,
                            canUserAddNewMark: !this.checkIfUserAddedMarkBefore(data.marks)
                        })

                        if (data.isDue === true) {
                            this.setState({
                                isDue: "Tak"
                            })
                        }
                        else if (data.isDue === false) {
                            this.setState({
                                isDue: "Nie"
                            })
                        }
                        else {
                            this.setState({
                                isDue: "Nie wiadomo"
                            })
                        }

                        var page;
                        var allPages;
                        if (data.titbits == null) {
                            page = 0;
                            allPages = 0;
                            this.setState({
                                titbitPage: 0,
                                titbitAllPages: 0
                            })
                        }
                        else {
                            page = 1;
                            allPages = Math.ceil(data.titbits.length / 10);
                            this.setState({
                                titbitPage: 1,
                                titbitAllPages: Math.ceil(data.titbits.length / 10)
                            })
                        }
                    }
                })
        }
        catch (error) {
            this.setState({
                pageError: true
            })
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        if (name === "titbitDescription") {
            this.setState({
                charTitbitLimit: 2000 - value.length
            })

            if(value.length > 0) {
                this.setState({
                    titbitDescriptionError: false
                })
            }
        }

        if (name === "comment") {
            this.setState({
                charCommentLimit: 500 - value.length
            })
        }

        if (name === "titbitName") {
            if(value.length > 0) {
                this.setState({
                    titbitNameError: false
                })
            }

            if (value.length > 40) {
                this.setState({
                    [name]: value.substring(0, 40)
                })
                return;
            }
        }

        if (name === "titbitPage") {
            if (value != "" && (value < 1 || value > this.state.titbitAllPages)) {
                return;
            }
        }

        this.setState({
            [name]: value
        })
    }

    handleOpenAddNewPhoto() {
        this.setState({
            showAddNewPhoto: true
        })
    }

    handleCloseAddNewPhoto() {
        this.setState({
            showAddNewPhoto: false,
            isSubmitting: false,
            shouldRedirect: true,
            imageSource: "",
            imageError: 0,
            image: null,
            toDisplay: false,
            date: null
        })
    }

    handleOpenAddOldPhoto() {
        this.setState({
            showAddOldPhoto: true
        })
    }

    handleCloseAddOldPhoto() {
        this.setState({
            showAddOldPhoto: false,
            isSubmitting: false,
            shouldRedirect: true,
            imageSource: "",
            image: null,
            imageError: 0,
            toDisplay: false,
            date: null
        })
    }

    handleClick() {
        this.refs.uploadFile.click();
    }

    handleImage = (e) => {
        if (e.target.files != null || e.target.files[0] != null) {
            this.setState({
                image: e.target.files[0],
                toDisplay: true
            });

            if (e.target.files && e.target.files[0]) {
                if (e.target.files.size > 8388608) {
                    this.setState({
                        image: null,
                        toDisplay: false,
                        imageError: 2
                    })
                    return;
                }
                var reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById("image").setAttribute('src', e.target.result);
                    document.getElementById("image").style.display = 'block'

                    this.setState({
                        imageError: 0
                    })
                }
                reader.readAsDataURL(e.target.files[0]);
            }
            else {
                this.setState({
                    image: null,
                    toDisplay: false
                });
            }
        }

        else {
            console.log("Nie ma żadnego pliku");
        }
    }

    async addNewPhoto() {
        if (this.state.image !== null) {

            this.setState({
                isSubmitting: true
            })

            const img = document.getElementById("imageF");
            var data1 = new FormData()
            data1.append('newPhoto', img.files[0]);
            data1.append('monumentId', this.state.monument.id);
            data1.append('source', this.state.imageSource);


            let response = await fetch("https://localhost:44357/api/photo/addnewphoto", {
                method: "POST",
                body: data1
            });

            if (response.status === 200) {
                this.setState({
                    isSubmitting: false,
                    shouldRedirect: true,
                    showAddNewPhoto: false,
                    imageSource: "",
                    image: null,
                    toDisplay: false
                })
                this.getMonumentDetails();
                alert("Dodano współczesne zdjęcie");
            }
            else {
                this.setState({
                    isSubmitting: false
                })
            }
        }

        else {
            if (this.state.image == null) {
                this.setState({
                    imageError: 1
                })
            }

            this.setState({
                isSubmitting: false
            })
        }
    }

    async addOldPhoto() {
        if (this.state.image !== null) {

            this.setState({
                isSubmitting: true
            })

            const img = document.getElementById("imageF");
            var data1 = new FormData()
            data1.append('oldPhoto', img.files[0]);

            if (this.state.date !== null && this.state.date != "") {
                data1.append('date', this.state.date)
            }
            data1.append('monumentId', this.state.monument.id);
            data1.append('source', this.state.imageSource);


            let response = await fetch("https://localhost:44357/api/photo/addoldphoto", {
                method: "POST",
                body: data1
            });

            if (response.status === 200) {
                this.setState({
                    isSubmitting: false,
                    shouldRedirect: true,
                    showAddOldPhoto: false,
                    imageSource: "",
                    image: null,
                    toDisplay: false,
                    date: null
                })
                this.getMonumentDetails();
                alert("Dodano stare zdjęcie");
            }
            else {
                this.setState({
                    isSubmitting: false
                })
            }
        }

        else {
            if (this.state.image == null) {
                this.setState({
                    imageError: 1
                })
            }

            this.setState({
                isSubmitting: false
            })
        }
    }

    showPhotos(isOldPhotos) {
        const data = {
            monumentId: this.state.monument.id,
            monumentName: this.state.monument.name,
            isOldPhotos: isOldPhotos
        }
        this.props.history.push("gallery", data);
    }

    displayAddOrEditTitbit(titbit) {

        if (titbit === null) {
            this.setState({
                showAddOrEditTitbit: true,
                editedTitbitId: 0,
                titbitDescription: "",
                titbitName: "",
                charTitbitLimit: 2000
            })
        }
        else {
            this.setState({
                showAddOrEditTitbit: true,
                editedTitbitId: titbit.id,
                titbitDescription: titbit.description,
                titbitName: titbit.name,
                charTitbitLimit: 2000 - titbit.description.length
            })
        }
    }

    closeAddOrEditTitbit() {
        this.setState({
            showAddOrEditTitbit: false,
            editedTitbitId: 0,
            titbitDescription: "",
            titbitName: ""
        })
    }

    showTitbitDetails(show, name, description) {
        this.setState({
            displayTitbitDetails: show,
            titbitNameDisplayed: name,
            titbitDescriptionDisplayed: description
        })
    }

    changeTitbitPage(page) {
        this.setState({
            titbitPage: page
        })
    }

    async addOrEditTitbit() {
        if (this.state.titbitDescription.length > 0 && this.state.titbitName.length > 0) {
            let errorTitbit = true;
            let errorTitbitMessage = "";
            let errorTitbitName = true;
            let errorTitbitNameMessage = "";

            let responseTitbitName = await fetch("https://localhost:44357/api/bannedword/doestextcontainsbannedwords", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: this.state.titbitName
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == null || data.length <= 0) {
                        errorTitbitName = false
                    }
                    else {
                        errorTitbitName = true
                        errorTitbitNameMessage = ""
                        data.map((word, index) => {
                            errorTitbitNameMessage += word.word
                            if (index < data.length - 1) {
                                errorTitbitNameMessage += ", "
                            }
                        })
                    }
                })

            let responseTitbit = await fetch("https://localhost:44357/api/bannedword/doestextcontainsbannedwords", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: this.state.titbitDescription
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == null || data.length <= 0) {
                        errorTitbit = false
                    }
                    else {
                        errorTitbit = true
                        errorTitbitMessage = ""
                        data.map((word, index) => {
                            errorTitbitMessage += word.word
                            if (index < data.length - 1) {
                                errorTitbitMessage += ", "
                            }
                        })
                    }
                })

            if (errorTitbit || errorTitbitName) {
                let newLine = "\r\n";
                let message = "Znaleziono zbanowane słowa w:" + newLine;
                message += errorTitbitName ? "Nazwie:" + errorTitbitNameMessage : "";
                message += errorTitbit ? "Opisie:" + errorTitbitMessage : "";

                alert(message);
            }
            else {
                if (this.state.editedTitbitId === 0) {
                    this.setState({
                        isSubmitting: true
                    })

                    let response = await fetch("https://localhost:44357/api/titbit/addtitbit", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: this.state.titbitName,
                            description: this.state.titbitDescription,
                            monumentId: this.state.monument.id,
                            creatorId: this.state.userName
                        })
                    });

                    if (response.status === 200) {
                        this.setState({
                            showAddOrEditTitbit: false,
                            editedTitbitId: 0,
                            titbitDescription: "",
                            titbitName: "",
                            isSubmitting: false
                        });
                        this.getMonumentDetails();
                        alert("Dodano ciekawostkę");
                    }
                    else {
                        this.setState({
                            isSubmitting: false
                        });
                    }
                }
                else if (this.state.editedTitbitId > 0) {
                    this.setState({
                        isSubmitting: true
                    })

                    let response = await fetch("https://localhost:44357/api/titbit/edittitbit", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: this.state.titbitName,
                            description: this.state.titbitDescription,
                            id: this.state.editedTitbitId,
                            creatorId: this.state.userName
                        })
                    });

                    if (response.status === 200) {
                        this.setState({
                            showAddOrEditTitbit: false,
                            editedTitbitId: 0,
                            titbitDescription: "",
                            titbitName: "",
                            isSubmitting: false
                        });
                        this.getMonumentDetails();
                        alert("Pomyślnie edytowano ciekawostkę");
                    }
                    else {
                        this.setState({
                            isSubmitting: false
                        });
                    }
                }
            }
        }
        else {
            if(this.state.titbitName.length === 0) {
                this.setState({
                    titbitNameError: true
                })
            }

            if(this.state.titbitDescription.length === 0) {
                this.setState({
                    titbitDescriptionError: true
                })
            }
        }
    }

    openDeleteTitbit = (id) => {
        confirmAlert({
            title: 'Usuń ciekwostkę',
            message: 'Czy na pewno chcesz usunąć ciekawostkę?',
            buttons: [
                {
                    label: 'Tak',
                    onClick: () => this.deleteTitbit(id)
                },
                {
                    label: 'Nie',
                }
            ]
        });
    };

    async deleteTitbit(id) {
        this.setState({
            isSubmitting: true
        })
        let response = await fetch("https://localhost:44357/api/titbit/deletetitbit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                username: this.state.userName
            })
        });

        if (response.status === 200) {
            this.setState({
                isSubmitting: false
            });
            this.getMonumentDetails();
            alert("Usunięto ciekawostkę");
        }
        else {
            this.setState({
                isSubmitting: false
            });
        }
    }

    checkIfUserAddedMarkBefore(marks) {
        if (this.state.userName == null) {
            return true;
        }
        else {
            let temp = false;
            marks.map((mark) => {
                if (mark.user.userName === this.state.userName) {
                    temp = true
                }
            })

            return temp;
        }
    }

    displayAddOrEditMark(close, mark) {
        if (!close) {
            if (mark === null) {
                this.setState({
                    showAddOrEditMark: true,
                    editedMarkId: 0,
                    comment: "",
                    ratingError: false,
                    rating: 0,
                    charCommentLimit: 500
                })
            }
            else {
                this.setState({
                    showAddOrEditMark: true,
                    editedMarkId: mark.id,
                    comment: mark.comment,
                    ratingError: false,
                    rating: mark.grade,
                    charCommentLimit: 500 - mark.comment.length
                })
            }
        }
        else {
            this.setState({
                showAddOrEditMark: false,
                editedMarkId: 0,
                comment: "",
                ratingError: false,
                rating: 0,
                charCommentLimit: 500
            })
        }
    }

    changeRating(newRating, name) {
        this.setState({
            rating: newRating
        });
    }

    async addOrEditMark() {
        if (this.state.rating > 0 && this.state.rating <= 5) {

            let errorComment = true;
            let errorCommentMessage = "";

            let responseComment = await fetch("https://localhost:44357/api/bannedword/doestextcontainsbannedwords", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: this.state.comment
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == null || data.length <= 0) {
                        errorComment = false
                    }
                    else {
                        errorComment = true
                        errorCommentMessage = ""
                        data.map((word, index) => {
                            errorCommentMessage += word.word
                            if (index < data.length - 1) {
                                errorCommentMessage += ", "
                            }
                        })
                    }
                })

            if (errorComment) {
                let newLine = "\r\n";
                let message = "Znaleziono zbanowane słowa w opinii:" + newLine;
                message += errorComment ? errorCommentMessage : "";
                alert(message);
            }
            else {
                if (this.state.editedMarkId === 0) {
                    this.setState({
                        isSubmitting: true
                    })

                    let response = await fetch("https://localhost:44357/api/mark/addmark", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            grade: this.state.rating,
                            comment: this.state.comment,
                            monumentId: this.state.monument.id,
                            userName: this.state.userName
                        })
                    });

                    if (response.status === 200) {
                        this.displayAddOrEditMark(true, null);
                        this.setState({
                            numberOfMarksRendered: this.state.numberOfMarksRendered + 1,
                            isSubmitting: false
                        });
                        this.getMonumentDetails();
                        alert("Dodano ocenę");
                    }
                    else {
                        this.setState({
                            isSubmitting: false
                        });
                    }
                }
                else if (this.state.editedMarkId > 0) {
                    this.setState({
                        isSubmitting: true
                    })

                    let response = await fetch("https://localhost:44357/api/mark/editmark", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            markId: this.state.editedMarkId,
                            grade: this.state.rating,
                            comment: this.state.comment,
                            userName: this.state.userName
                        })
                    });

                    if (response.status === 200) {
                        this.displayAddOrEditMark(true, null)
                        this.setState({
                            isSubmitting: false
                        });

                        this.getMonumentDetails();
                        alert("Pomyślnie edytowano ocenę");
                    }
                    else {
                        this.setState({
                            isSubmitting: false
                        });
                    }
                }
            }
        }
        else {
            if (this.state.rating <= 0 || this.state.rating > 5) {
                this.setState({
                    ratingError: true
                })
            }
        }
    }

    openDeleteMark = (id) => {
        confirmAlert({
            title: 'Usuń ocenę',
            message: 'Czy na pewno chcesz usunąć ocenę?',
            buttons: [
                {
                    label: 'Tak',
                    onClick: () => this.deleteMark(id)
                },
                {
                    label: 'Nie',
                }
            ]
        });
    };

    async deleteMark(id) {
        this.setState({
            isSubmitting: true
        })
        let response = await fetch("https://localhost:44357/api/mark/deletemark", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                markId: id,
                userName: this.state.userName
            })
        });

        if (response.status === 200) {
            this.setState({
                isSubmitting: false
            });
            this.getMonumentDetails();
            alert("Usunięto ocenę");
        }
        else {
            this.setState({
                isSubmitting: false
            });
        }
    }

    returnDate(date) {
        return moment(date)
            .local()
            .format("DD.MM.YYYY HH:mm:ss")
    }

    loadMoreComments() {
        this.setState({
            numberOfMarksRendered: this.state.numberOfMarksRendered + 10
        })
    }

    editMonument() {
        const data = {
            id: this.state.monument.id,
            name: this.state.monument.name,
            creationDate: this.state.monument.creationDate,
            monumentType: this.state.monument.monumentType,
            isDue: this.state.monument.isDue,
            description: this.state.monument.description,
            mainPhoto: this.state.monument.mainPhoto,
            city: this.state.monument.city.name,
            address: this.state.monument.address,
            latitude: this.state.monument.latitude,
            longitude: this.state.monument.longitude
        }
        this.props.history.push("addmonument", data);
    }

    openDeleteMonument = (id) => {
        confirmAlert({
            title: 'Usuń zabytek',
            message: 'Czy na pewno chcesz usunąć zabytek?',
            buttons: [
                {
                    label: 'Tak',
                    onClick: () => this.deleteMonument(id)
                },
                {
                    label: 'Nie',
                }
            ]
        });
    };

    async deleteMonument(id) {
        this.setState({
            isSubmitting: true
        })
        let response = await fetch("https://localhost:44357/api/monument/deletemonument", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                monumentId: id,
                userName: this.state.userName
            })
        });

        if (response.status === 200) {
            this.setState({
                isSubmitting: false
            });
            alert("Usunięto zabytek");
            this.props.history.push("monumentslist");
        }
        else {
            alert("Coś poszło nie tak");
            this.setState({
                isSubmitting: false
            });
        }
    }

    render() {
        let errorImageMessage = "";

        if (this.state.imageError === 1) {
            errorImageMessage = "Zdjęcie jest wymagane!"
        }
        else {
            errorImageMessage = "Za duży rozmiar zdjęcia!"
        }

        return (
            <>
                {this.state.pageError ?
                    <div style={{ marginTop: "70px", fontSize: "32px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>Nie odnaleziono zabytku</div>
                    :
                    <div className="center-content">
                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
                            integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                            crossOrigin="" />
                        {this.state.isLoaded &&
                            <div className="container-fluid">
                                <div className="row" style={{ marginTop: "60px" }}>
                                    <div className="col-md-6">
                                        <img className="card-img-top img" style={{ maxHeight: "700px", maxWidth: "700px", marginBottom: "20px" }} src={"data:image/jpeg;base64," + this.state.monument.mainPhoto} alt="Card image cap" />
                                        {this.state.monument.isVerified &&
                                            <>
                                                <div style={{ border: "2px solid #2b2b2b", borderRadius: "5px" }}>
                                                    <div style={{ float: "right", margin: "5px 10px 0 10px" }}>
                                                        {this.state.isAuthenticated &&
                                                            <div style={{ marginTop: "-3px" }} onClick={this.handleOpenAddNewPhoto} style={{ cursor: "pointer" }}>
                                                                <ReactTooltip place="left" />
                                                                <FontAwesomeIcon icon={faPlusSquare} data-tip="Dodaj zdjęcie" color="#2b2b2b" style={{ width: "40px", height: "40px" }} />
                                                            </div>
                                                        }
                                                    </div>
                                                    <div style={{ margin: "5px 10px 0 10px", fontSize: "18px", fontWeight: "bold" }}>Współczesne zdjęcia</div>
                                                    {this.state.monument.newPhotos === null || this.state.monument.newPhotos.length <= 0 ?
                                                        <div style={{ fontSize: "16px", fontWeight: "600", clear: "both", margin: "10px" }}>Brak zdjęć do wyświetlenia</div>
                                                        :
                                                        <div onClick={() => this.showPhotos(false)} style={{ cursor: "pointer", clear: "both" }}>
                                                            {this.state.monument.newPhotos.map((photo, index) => {
                                                                if (index < 1)
                                                                    return <div key={index} style={{ margin: "10px", width: "150px", float: "left" }}><img className="card-img-top img" src={"data:image/jpeg;base64," + photo.picture} alt="new image" style={{ width: "150px", height: "150px" }} /> </div>
                                                                else if (index == 1) {
                                                                    return <div key={index} style={{ margin: "10px", width: "150px", height: "150px", float: "left", background: "#2b2b2b", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>+{this.state.monument.newPhotos.length - 1}</div>
                                                                }
                                                            })
                                                            }

                                                        </div>
                                                    }
                                                    <div style={{ clear: "both", marginBottom: "10px" }}></div>
                                                    <Modal
                                                        show={this.state.showAddNewPhoto}
                                                        onHide={() => this.handleCloseAddNewPhoto()}
                                                        dialogClassName="modal-add-new-photo"
                                                        aria-labelledby="example-custom-modal-styling-title"
                                                    >
                                                        <Modal.Header closeButton>
                                                            <Modal.Title id="example-custom-modal-styling-title">
                                                                Dodaj współczesne zdjęcie
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <div>
                                                                <div className="margin-bottom-15">
                                                                    <div>
                                                                        <label className="label-input">Zdjęcie</label>
                                                                    </div>
                                                                    <div className="imageFieldv2" onClick={this.handleClick}>
                                                                        {!this.state.toDisplay ?
                                                                            <label className="customLabelv2" style={{ cursor: "pointer", border: this.state.imageError > 0 ? "1px solid red" : "" }}>Dodaj zdjęcie {"(max. 8 MB)"}</label>
                                                                            :
                                                                            <img id="image" src={this.state.image} style={{ width: "100%", height: "300px", display: "none" }} />
                                                                        }
                                                                        <input id="imageF" type="file" ref="uploadFile" style={{ display: "none" }} onChange={this.handleImage} />
                                                                    </div>
                                                                    {this.state.imageError !== 0 &&
                                                                        <div className="error-message">
                                                                            <label>{errorImageMessage}</label>
                                                                        </div>
                                                                    }
                                                                </div>
                                                                <div className="margin-bottom-15">
                                                                    <div>
                                                                        <label className="label-input">Źródło</label>
                                                                    </div>
                                                                    <div>
                                                                        <input
                                                                            type="text"
                                                                            id="imageSource"
                                                                            className="zero-raduis form-control"
                                                                            name="imageSource"
                                                                            onChange={this.handleChange}
                                                                            value={this.state.imageSource} />
                                                                    </div>
                                                                </div>
                                                                <button className="button load-more-marks" onClick={this.addNewPhoto}>Dodaj zdjęcie</button>
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
                                                </div>
                                                <div style={{ border: "2px solid #2b2b2b", borderRadius: "5px", marginTop: "20px" }}>
                                                    <div style={{ float: "right", margin: "5px 10px 0 10px" }}>
                                                        {this.state.isAuthenticated &&
                                                            <div style={{ marginTop: "-3px" }} onClick={this.handleOpenAddOldPhoto} style={{ cursor: "pointer" }}>
                                                                <ReactTooltip place="left" />
                                                                <FontAwesomeIcon icon={faPlusSquare} data-tip="Dodaj zdjęcie" color="#2b2b2b" style={{ width: "40px", height: "40px" }} />
                                                            </div>
                                                        }
                                                    </div>
                                                    <div style={{ margin: "5px 10px 0 10px", fontSize: "18px", fontWeight: "bold", float: "left" }}>Historyczne zdjęcia</div>
                                                    {this.state.monument.oldPhotos === null || this.state.monument.oldPhotos.length <= 0 ?
                                                        <div style={{ fontSize: "16px", fontWeight: "600", clear: "both", margin: "10px" }}>Brak zdjęć do wyświetlenia</div>
                                                        :
                                                        <div onClick={() => this.showPhotos(true)} style={{ cursor: "pointer", clear: "both" }}>
                                                            {this.state.monument.oldPhotos.map((photo, index1) => {
                                                                if (index1 < 1)
                                                                    return <div key={index1} style={{ margin: "10px", width: "150px", float: "left" }}><img className="card-img-top img" src={"data:image/jpeg;base64," + photo.picture} alt="old image" style={{ width: "150px", height: "150px" }} /></div>
                                                                else if (index1 == 1)
                                                                    return <div key={index1} style={{ margin: "10px", width: "150px", height: "150px", float: "left", background: "#2b2b2b", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>+{this.state.monument.oldPhotos.length - 1}</div>

                                                            })
                                                            }
                                                        </div>
                                                    }
                                                    <div style={{ clear: "both", marginBottom: "10px" }}></div>
                                                    <Modal
                                                        show={this.state.showAddOldPhoto}
                                                        onHide={() => this.handleCloseAddOldPhoto()}
                                                        dialogClassName="modal-add-new-photo"
                                                        aria-labelledby="example-custom-modal-styling-title"
                                                    >
                                                        <Modal.Header closeButton>
                                                            <Modal.Title id="example-custom-modal-styling-title">
                                                                Dodaj stare zdjęcie
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <div>
                                                                <div className="margin-bottom-15">
                                                                    <div>
                                                                        <label className="label-input">Zdjęcie</label>
                                                                    </div>
                                                                    <div className="imageFieldv2" onClick={this.handleClick}>
                                                                        {!this.state.toDisplay ?
                                                                            <label className="customLabelv2" style={{ cursor: "pointer", border: this.state.imageError > 0 ? "1px solid red" : "" }}>Dodaj zdjęcie {"(max. 8 MB)"}</label>
                                                                            :
                                                                            <img id="image" src={this.state.image} style={{ width: "100%", height: "300px", display: "none" }} />
                                                                        }
                                                                        <input id="imageF" type="file" ref="uploadFile" style={{ display: "none" }} onChange={this.handleImage} />
                                                                    </div>
                                                                    {this.state.imageError !== 0 &&
                                                                        <div className="error-message">
                                                                            <label>{errorImageMessage}</label>
                                                                        </div>
                                                                    }
                                                                </div>
                                                                <div className="margin-bottom-15">
                                                                    <div>
                                                                        <label className="label-input">Źródło</label>
                                                                    </div>
                                                                    <div>
                                                                        <input
                                                                            type="text"
                                                                            id="imageSource"
                                                                            className="zero-raduis form-control"
                                                                            name="imageSource"
                                                                            onChange={this.handleChange}
                                                                            value={this.state.imageSource} />
                                                                    </div>
                                                                </div>
                                                                <div className="margin-bottom-15">
                                                                    <div>
                                                                        <label className="label-input">Rok fotografii</label>
                                                                    </div>
                                                                    <div>
                                                                        <input
                                                                            type="number"
                                                                            id="date"
                                                                            className="zero-raduis form-control"
                                                                            name="date"
                                                                            onChange={this.handleChange}
                                                                            value={this.state.date} />
                                                                    </div>
                                                                </div>

                                                                <button className="button load-more-marks" onClick={this.addOldPhoto}>Dodaj zdjęcie</button>
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
                                                </div>

                                            </>
                                        }
                                        {this.state.monument.isVerified &&
                                            <div style={{ marginTop: "20px", border: "2px solid #2b2b2b", borderRadius: "5px" }}>
                                                {this.state.isAuthenticated &&
                                                    <div style={{ float: "right", margin: "5px 10px 0 10px" }}>
                                                        <div style={{ marginTop: "-3px" }} onClick={() => this.displayAddOrEditTitbit(null)} style={{ cursor: "pointer" }}>
                                                            <ReactTooltip place="left" />
                                                            <FontAwesomeIcon icon={faPlusSquare} data-tip="Dodaj ciekawostkę" color="#2b2b2b" style={{ width: "40px", height: "40px" }} />
                                                        </div>
                                                        <Modal
                                                            show={this.state.showAddOrEditTitbit}
                                                            onHide={() => this.closeAddOrEditTitbit()}
                                                            dialogClassName="modal-add-new-photo"
                                                            aria-labelledby="example-custom-modal-styling-title">
                                                            <Modal.Header closeButton>
                                                                <Modal.Title id="example-custom-modal-styling-title">
                                                                    {this.state.editedTitbitId === 0 ? "Dodaj ciekawostkę" : "Edytuj ciekawostkę"}
                                                                </Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <div>
                                                                    <div className="margin-bottom-15">
                                                                        <div>
                                                                            <label className="label-input">Nazwa ciekawostki</label>
                                                                        </div>
                                                                        <div>
                                                                            <input
                                                                                type="text"
                                                                                id="titbitName"
                                                                                className="zero-raduis form-control"
                                                                                name="titbitName"
                                                                                style={{border: this.state.titbitNameError > 0 ? "1px solid red" : ""}}
                                                                                onChange={this.handleChange}
                                                                                value={this.state.titbitName} />
                                                                        </div>
                                                                        {this.state.titbitNameError &&
                                                                            <div className="error-message">
                                                                                <label>Nazwa nie może być pusta!</label>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <div className="margin-bottom-15">
                                                                        <label className="label-input">Opis ciekawostki</label>
                                                                        <textarea id="titbitDescription"
                                                                            className="add-description"
                                                                            name="titbitDescription"
                                                                            defaultValue={this.state.titbitDescription}
                                                                            maxLength="2000"
                                                                            style={{ wordWrap: "break-word", border: this.state.titbitDescriptionError ? "2px solid red" : "" }}
                                                                            onChange={this.handleChange}>
                                                                        </textarea>
                                                                        {this.state.titbitDescriptionError &&
                                                                            <div className="error-message">
                                                                                <label>Opis nie może być pusty!</label>
                                                                            </div>
                                                                        }
                                                                        <div>
                                                                            <label>Dostępne znaki: {this.state.charTitbitLimit}</label>
                                                                        </div>
                                                                    </div>
                                                                    <button className="button load-more-marks" onClick={this.addOrEditTitbit}> {this.state.editedTitbitId > 0 ? "Edytuj" : "Dodaj"}</button>
                                                                </div>
                                                            </Modal.Body>
                                                        </Modal>
                                                    </div>
                                                }
                                                <div style={{ margin: "5px 10px 0 10px", fontSize: "18px", fontWeight: "bold" }}>
                                                    Ciekawostki
                                                </div>
                                                <div style={{ margin: "5px 10px 0 10px" }}>
                                                    <table className="banned-words-table">
                                                        <thead>
                                                            <tr className="titbits-header">
                                                                <th style={{ padding: "5px" }}>
                                                                    Nazwa
                                                                </th>
                                                                {this.state.isAuthenticated &&
                                                                    <th></th>
                                                                }
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <Modal
                                                                show={this.state.displayTitbitDetails}
                                                                onHide={() => this.showTitbitDetails(false, "", "")}
                                                                dialogClassName="modal-add-new-photo"
                                                                aria-labelledby="example-custom-modal-styling-title">
                                                                <Modal.Header closeButton>
                                                                    <Modal.Title id="example-custom-modal-styling-title">
                                                                        <div style={{ wordBreak: "break-word" }}>
                                                                            {this.state.titbitNameDisplayed}
                                                                        </div>
                                                                    </Modal.Title>
                                                                </Modal.Header>
                                                                <Modal.Body>
                                                                    <div>
                                                                        <div>
                                                                            <label className="label-input">Opis ciekawostki</label>
                                                                        </div>
                                                                        <div style={{ border: "2px solid #2b2b2b", borderRadius: "10px", padding: "10px", wordBreak: "break-word" }}>
                                                                            {this.state.titbitDescriptionDisplayed}
                                                                        </div>
                                                                    </div>
                                                                </Modal.Body>
                                                            </Modal>
                                                            {this.state.monument.titbits !== null && this.state.monument.titbits.length > 0 ?
                                                                this.state.monument.titbits.map((titbit, index) => {
                                                                    if (index >= (this.state.titbitPage - 1) * 10 && index < this.state.titbitPage * 10) {
                                                                        return (
                                                                            <tr key={index} style={{ borderBottom: "1px solid #4e4e4e" }}>
                                                                                <td className="ellpsis">
                                                                                    <span className="titbit-name" onClick={() => this.showTitbitDetails(true, titbit.name, titbit.description)}>
                                                                                        {titbit.name}
                                                                                    </span>
                                                                                </td>
                                                                                {this.state.isAuthenticated &&
                                                                                    <td style={{ width: "85px" }}>
                                                                                        {((titbit.creator !== null && this.state.userName === titbit.creator.userName) || this.state.isUserAdmin) &&
                                                                                            <>
                                                                                                <div onClick={() => this.displayAddOrEditTitbit(titbit)} style={{ float: "left", cursor: "pointer", width: "35px", height: "35px" }}>
                                                                                                    <FontAwesomeIcon icon={faPenSquare} data-tip="Edytuj" style={{ width: "35px", height: "35px" }} />
                                                                                                </div>
                                                                                                <div onClick={() => this.openDeleteTitbit(titbit.id)} style={{ float: "left", cursor: "pointer", width: "35px", height: "35px", marginLeft: "5px" }}>
                                                                                                    <FontAwesomeIcon icon={faWindowClose} data-tip="Usuń" style={{ width: "35px", height: "35px" }} />
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                    </td>
                                                                                }
                                                                            </tr>
                                                                        )
                                                                    }
                                                                })
                                                                :
                                                                <tr>
                                                                    <td>Nie dodano jeszcze żadnej ciekawostki</td>
                                                                    {this.state.isAuthenticated && <td></td>}
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                    <div style={{ width: "100%", display: "flex", height: "100px", justifyContent: "center", alignItems: "center" }}>
                                                        <div>
                                                            {this.state.titbitPage == null || this.state.titbitPage <= 1 ?
                                                                <div id="leftButton" style={{ float: "left", cursor: "pointer", height: "50px", marginTop: "1px" }}>
                                                                    <FontAwesomeIcon color="#666666" icon={faCaretSquareLeft} style={{ width: "45px", height: "45px" }} />
                                                                </div>
                                                                :
                                                                <div id="leftButton" onClick={() => this.changeTitbitPage(this.state.titbitPage - 1)} style={{ float: "left", cursor: "pointer", height: "50px", marginTop: "1px" }}>
                                                                    <FontAwesomeIcon icon={faCaretSquareLeft} style={{ width: "45px", height: "45px" }} />
                                                                </div>
                                                            }
                                                            <div style={{ float: "left", fontSize: "24px", margin: "0 10px" }}>
                                                                <input type="number" className="page-input" name="titbitPage" value={this.state.titbitPage} onChange={this.handleChange} />
                                                                <text> / </text>{this.state.titbitAllPages}
                                                            </div>
                                                            {this.state.titbitPage >= this.state.titbitAllPages ?
                                                                <div id="rightButton" style={{ float: "left", cursor: "pointer", height: "50px", marginTop: "1px" }}>
                                                                    <FontAwesomeIcon color="#666666" icon={faCaretSquareRight} style={{ width: "45px", height: "45px" }} />
                                                                </div>
                                                                :
                                                                <div id="rightButton" onClick={() => this.changeTitbitPage(this.state.titbitPage + 1)} style={{ float: "left", cursor: "pointer", height: "50px", marginTop: "1px" }}>
                                                                    <FontAwesomeIcon icon={faCaretSquareRight} style={{ width: "45px", height: "45px" }} />
                                                                </div>
                                                            }

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className="col-md-6">
                                        <div>
                                            <label className="monument-details-header">{this.state.monument.name}</label>
                                            <div>
                                                <label><label style={{ fontWeight: "bold" }}>Miejscowość:</label> {this.state.monument.city.name}</label>
                                            </div>
                                            <div>
                                                <label><label style={{ fontWeight: "bold" }}>Ulica:</label> {this.state.monument.address}</label>
                                            </div>
                                            <div>
                                                <label><label style={{ fontWeight: "bold" }}>Data stworzenia zabytku:</label> {this.state.monument.creationDate}</label>
                                            </div>
                                            <div>
                                                <label><label style={{ fontWeight: "bold" }}>Typ zabytku:</label> {this.state.monumentTypes.map((type, index) => {
                                                    if (index === this.state.monument.monumentType) {
                                                        return type;
                                                    }
                                                })}</label>
                                            </div>
                                            <div>
                                                <label><label style={{ fontWeight: "bold" }}>Płatność:</label> {this.state.isDue}</label>
                                            </div>
                                            <div>
                                                <label><label style={{ fontWeight: "bold" }}>Dodane przez:</label> {this.state.monument.creator === null ? "Nie wiadomo" : this.state.monument.creator.userName}</label>
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", marginBottom: "10px" }}>
                                                <div>
                                                    <label style={{ fontWeight: "bold" }}>Średnia ocena:</label>
                                                </div>
                                                <div style={{ marginTop: "-3px", marginLeft: "5px" }}>
                                                    <StarRatings
                                                        rating={this.state.monument.averageMark}
                                                        starRatedColor="#bfbf00"
                                                        starDimension="30px"
                                                        starSpacing="5px"
                                                    />
                                                </div>
                                            </div>
                                            {((this.state.monument.creator !== null && this.state.userName === this.state.monument.creator.userName) || this.state.isUserAdmin) &&
                                                <div style={{ width: "100%", height: "44px" }}>
                                                    {this.state.isUserAdmin &&
                                                        <div onClick={() => this.openDeleteMonument(this.state.monument.id)} style={{ float: "right", cursor: "pointer", marginLeft: "5px" }}>
                                                            <FontAwesomeIcon icon={faWindowClose} data-tip="Usuń zabytek" style={{ width: "40px", height: "40px" }} />
                                                        </div>
                                                    }
                                                    <div onClick={() => this.editMonument(this.state.monument)} style={{ float: "right", cursor: "pointer" }}>
                                                        <FontAwesomeIcon icon={faPenSquare} data-tip="Edytuj zabytek" style={{ width: "40px", height: "40px" }} />
                                                    </div>
                                                </div>

                                            }
                                            <div style={{ clear: "both", border: "2px solid #2b2b2b", padding: "10px", borderRadius: "10px", marginTop: "10px" }}>
                                                <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                                                    Opis
                                                </div>
                                                <div style={{ wordBreak: "break-word" }}>
                                                    {this.state.monument.description}
                                                </div>
                                            </div>
                                            <div style={{ margin: "20px 0 10px 0", fontWeight: "bold", }}>
                                                Lokalizacja
                                            </div>
                                            <div>
                                                <Map className="leaflet-container4" center={[this.state.monument.latitude, this.state.monument.longitude]} zoom={10} style={{ zIndex: "0" }}>
                                                    <TileLayer
                                                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                                    />
                                                    <Marker position={[this.state.monument.latitude, this.state.monument.longitude]}>
                                                    </Marker>
                                                </Map>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.monument.isVerified &&
                                    <div className="row" style={{ marginTop: "20px" }}>
                                        <div className="col-md-12">
                                            <div style={{ float: "right" }}>
                                                {this.state.isAuthenticated && this.state.canUserAddNewMark &&
                                                    <div style={{ marginTop: "-3px" }} onClick={() => this.displayAddOrEditMark(false, null)} style={{ cursor: "pointer" }}>
                                                        <ReactTooltip place="left" />
                                                        <FontAwesomeIcon icon={faPlusSquare} data-tip="Dodaj ocenę" color="#2b2b2b" style={{ width: "40px", height: "40px" }} />
                                                    </div>
                                                }
                                                <Modal
                                                    show={this.state.showAddOrEditMark}
                                                    onHide={() => this.displayAddOrEditMark(true, null)}
                                                    dialogClassName="modal-add-new-photo"
                                                    aria-labelledby="example-custom-modal-styling-title">
                                                    <Modal.Header closeButton>
                                                        <Modal.Title id="example-custom-modal-styling-title">
                                                            {this.state.editedMarkId === 0 ? "Dodaj ocenę" : "Edytuj ocenę"}
                                                        </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div>
                                                            <div className="mark-monument-name" style={{ display: "flex", alignContent: "center" }}>
                                                                <label>Ocena: </label>
                                                                <div style={{ marginTop: "-4px", marginLeft: "10px" }}>
                                                                    <StarRatings
                                                                        rating={this.state.rating}
                                                                        starRatedColor="#bfbf00"
                                                                        starDimension="30px"
                                                                        starSpacing="5px"
                                                                        changeRating={this.changeRating}
                                                                        numberOfStars={5}
                                                                        name='rating'
                                                                    />
                                                                </div>
                                                            </div>
                                                            {this.state.ratingError &&
                                                                <div>
                                                                    <label className="error-message">Nie podano oceny!</label>
                                                                </div>
                                                            }
                                                            <div className="mark-monument-name">
                                                                <label>Opinia</label>
                                                            </div>
                                                            <textarea id="comment"
                                                                className="add-description"
                                                                name="comment"
                                                                defaultValue={this.state.comment}
                                                                maxLength="500"
                                                                style={{ wordWrap: "break-word" }}
                                                                onChange={this.handleChange}>
                                                            </textarea>
                                                            <div className="margin-bottom-15">
                                                                <label>Dostępne znaki: {this.state.charCommentLimit}</label>
                                                            </div>
                                                            <button className="button load-more-marks" onClick={this.addOrEditMark}> {this.state.editedMarkId > 0 ? "Edytuj" : "Dodaj"}</button>
                                                        </div>
                                                    </Modal.Body>
                                                </Modal>
                                            </div>
                                            <div>
                                                        <label className="marks-header">Oceny wraz z opiniami {"(Ilość ocen: " + this.state.monument.marks.length +")"}</label>
                                            </div>
                                            <div style={{ clear: "both" }}></div>
                                        </div>
                                        {this.state.monument.marks.length <= 0 ?
                                            <div style={{ marginLeft: "15px", width: "100%", fontWeight: "bold" }}>Nie dodano jeszcze żadnej oceny</div>
                                            :
                                            this.state.monument.marks.sort((a, b) => moment(b.creationDate).valueOf() - moment(a.creationDate).valueOf()).map((mark, index) => {
                                                if (index < this.state.numberOfMarksRendered) {
                                                    return (
                                                        <div key={index} className="col-md-12" style={{ margin: "10px 0" }}>
                                                            <div style={{ border: "2px solid #2b2b2b", borderRadius: "5px", padding: "5px", width: "100%" }}>
                                                                <div>
                                                                    <div className="mark-monument-name" style={{ float: "left" }}>
                                                                        <label>Dodany przez: {mark.user.userName}</label>
                                                                    </div>
                                                                    <div className="mark-date" style={{ float: "right" }}>
                                                                        <label>{this.returnDate(mark.creationDate)}</label>
                                                                    </div>
                                                                </div>
                                                                <div style={{ clear: "both" }}>
                                                                    <div>
                                                                        <div style={{ float: "right" }}>
                                                                            {
                                                                                (this.state.isUserAdmin || this.state.userName === mark.user.userName) &&
                                                                                <>
                                                                                    <div onClick={() => this.displayAddOrEditMark(false, mark)} style={{ float: "left", cursor: "pointer", width: "30px", height: "30px" }}>
                                                                                        <FontAwesomeIcon icon={faPenSquare} data-tip="Edytuj" style={{ width: "25px", height: "25px" }} />
                                                                                    </div>
                                                                                    <div onClick={() => this.openDeleteMark(mark.id)} style={{ float: "left", cursor: "pointer", width: "30px", height: "30px" }}>
                                                                                        <FontAwesomeIcon icon={faWindowClose} data-tip="Usuń" style={{ width: "25px", height: "25px" }} />
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                        </div>
                                                                        <div className="mark-monument-name" style={{ float: "left", display: "flex", alignContent: "center" }}>
                                                                            <label>Ocena: </label>
                                                                            <div style={{ marginTop: "-4px", marginLeft: "10px" }}>
                                                                                <StarRatings
                                                                                    rating={mark.grade}
                                                                                    starRatedColor="#bfbf00"
                                                                                    starDimension="30px"
                                                                                    starSpacing="5px"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div style={{ clear: "both" }}>
                                                                        {mark.comment !== "" && <label>{mark.comment}</label>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        <div style={{ marginBottom: "40px", marginLeft: "15px", width: "100%" }}>
                                            {this.state.numberOfMarksRendered < this.state.monument.marks.length &&
                                                <button className="button load-more-marks" onClick={() => this.loadMoreComments()}>
                                                    Wczytaj więcej kometarzy
                                                </button>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                }
            </>
        )
    }
}

export default MonumentDetails;