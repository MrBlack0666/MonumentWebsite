import React from 'react'
import { Modal } from 'react-bootstrap'
import Geocode from "react-geocode";
import accountService from '../../services/accountService'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { Redirect } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from '@fortawesome/free-brands-svg-icons';

import './addmonument.css'

class AddMonument extends React.Component {
    constructor(props) {
        super(props);
        Geocode.setApiKey("***");
        Geocode.setLanguage("pl");
        Geocode.setRegion("pl");
        this.props = props;
        if (props.location.state == null) {
            this.state = {
                id: 0,
                name: "",
                creationDate: "",
                description: "",
                monumentTypes: [],
                monumentType: "",
                isDue: 0,

                address: "",
                city: "",
                latitude: -5000,
                longitude: -5000,

                image: null,

                toDisplay: false,
                showLocalization: false,

                nameError: 0,
                creationDateError: false,
                descriptionError: false,
                monumentTypeError: false,
                localizationError: false,
                imageError: 0,
                cityError: false,

                isLocalizationSelected: false,
                addressError: false,

                shouldRedirect: false,

                userName: accountService.getUserName(),
                charLimit: 2000,
                isSubmitting: false
            }
        }
        else {
            let temp = 0;
            if (props.location.state.isDue == null) {
                temp = 0;
            }
            else if (props.location.state.isDue === false) {
                temp = 1;
            }
            else {
                temp = 2;
            }

            this.state = {
                id: props.location.state.id,
                name: props.location.state.name,
                creationDate: props.location.state.creationDate,
                description: props.location.state.description,
                monumentTypes: [],
                monumentType: props.location.state.monumentType,
                isDue: temp,

                address: props.location.state.address,
                city: props.location.state.city,
                latitude: props.location.state.latitude,
                longitude: props.location.state.longitude,

                image: props.location.state.mainPhoto,

                toDisplay: true,
                showLocalization: false,

                nameError: 0,
                creationDateError: false,
                descriptionError: false,
                monumentTypeError: false,
                localizationError: false,
                cityError: false,
                imageError: 0,

                isLocalizationSelected: true,
                addressError: false,

                shouldRedirect: false,

                userName: accountService.getUserName(),
                charLimit: 2000 - props.location.state.description.length,
                isSubmitting: false
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.handleClickOnMap = this.handleClickOnMap.bind(this);
        this.getAddress = this.getAddress.bind(this);
    }

    componentDidMount() {
        this.getMonumentTypes();
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

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        if (name === "description") {
            this.setState({
                charLimit: 2000 - value.length,
                descriptionError: value.length === 0
            })
        }

        else if (name === "name") {

            this.setState({
                nameError: value.length === 0 ? 1 : 0
            })

            if (value.length > 40) {
                this.setState({
                    [name]: value.substring(0, 40)
                })
                return;
            }
        }
        else if (name === "creationDate") {

            this.setState({
                creationDateError: value.length === 0
            })

            if (value.length > 30) {
                this.setState({
                    [name]: value.substring(0, 30)
                })
                return;
            }
        }
        else if (name === "monumentType") {
            if (value !== "") {
                this.setState({
                    monumentTypeError: false
                })
            }
            else {
                this.setState({
                    monumentTypeError: false
                })
            }
        }

        this.setState({
            [name]: value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.name !== "" && this.state.creationDate !== "" && this.state.description !== ""
            && this.state.monumentType !== "" && this.state.image != null
            && this.state.latitude !== -5000 && this.state.longitude !== -5000) {

            this.setState({
                isSubmitting: true
            })


            let cityName = "";
            let streetName = "";
            if (!this.state.addressError) {
                let address = await this.getAddress(this.state.latitude, this.state.longitude);

                let addressArray = address.split(", ");

                if (addressArray.length < 2) {
                    this.setState({
                        isSubmitting: false,
                        localizationError: true,
                        addressError: true
                    })
                    return;
                }

                let street = addressArray[0];

                streetName = street;
                this.setState({
                    address: street
                })


                let city = "";
                let getCity = addressArray[1].split(" ");
                if (getCity.length > 1) {
                    city = getCity[1];
                    if (city === "") {
                        this.setState({
                            isSubmitting: false,
                            localizationError: true,
                            addressError: true
                        })
                        return;
                    }
                    else {
                        cityName = city;
                    }
                }
                else {
                    this.setState({
                        isSubmitting: false,
                        localizationError: true,
                        addressError: true
                    })
                    return;
                }
            }
            else {
                streetName = this.state.address;
                cityName = this.state.city;
            }

            if (cityName === "") {
                this.setState({
                    cityError: true,
                    isSubmitting: false
                })
                return;
            }

            if (streetName === "") {
                streetName = "Nieznana"
            }

            let errorName = true;
            let errorNameMessage = "";
            let errorCreationDate = true;
            let errorCreationDateMessage = "";
            let errorDescription = true;
            let errorDescriptionMessage = "";

            let responseName = await fetch("https://localhost:44357/api/bannedword/doestextcontainsbannedwords", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: this.state.name
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == null || data.length <= 0) {
                        errorName = false
                    }
                    else {
                        errorName = true
                        errorNameMessage = ""
                        data.map((word, index) => {
                            errorNameMessage += word.word
                            if (index < data.length - 1) {
                                errorNameMessage += ", "
                            }
                        })
                    }
                })

            let responseCretaionDate = await fetch("https://localhost:44357/api/bannedword/doestextcontainsbannedwords", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: this.state.creationDate
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == null || data.length <= 0) {
                        errorCreationDate = false
                    }
                    else {
                        errorCreationDate = true
                        errorCreationDateMessage = ""
                        data.map((word, index) => {
                            errorCreationDateMessage += word.word
                            if (index < data.length - 1) {
                                errorCreationDateMessage += ", "
                            }
                        })
                    }
                })

            let responseDescription = await fetch("https://localhost:44357/api/bannedword/doestextcontainsbannedwords", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: this.state.description
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == null || data.length <= 0) {
                        errorDescription = false
                    }
                    else {
                        errorDescription = true
                        errorDescriptionMessage = ""
                        data.map((word, index) => {
                            errorDescriptionMessage += word.word
                            if (index < data.length - 1) {
                                errorDescriptionMessage += ", "
                            }
                        })
                    }
                })

            if (errorName || errorCreationDate || errorDescription) {
                let newLine = "\r\n";
                let message = "Znaleziono zbanowane słowa w:" + newLine;
                message += errorName ? "Nazwie: " + errorNameMessage + newLine : "";
                message += errorCreationDate ? "Dacie: " + errorCreationDateMessage + newLine : "";
                message += errorDescription ? "Opisie: " + errorDescriptionMessage + newLine : "";
                alert(message);
                this.setState({
                    isSubmitting: false
                })
            }
            else {
                if (this.state.id === 0) {
                    const img = document.getElementById("imageF");
                    var data1 = new FormData()
                    data1.append('picture', img.files[0]);
                    data1.append('name', this.state.name);
                    data1.append('creationDate', this.state.creationDate);
                    data1.append('longitude', this.state.longitude);
                    data1.append('latitude', this.state.latitude);
                    data1.append('description', this.state.description);
                    data1.append('monumentType', this.state.monumentType);
                    data1.append('isDue', this.state.isDue);
                    data1.append('address', streetName);
                    data1.append('cityName', cityName);
                    data1.append('userName', this.state.userName);

                    console.log(this.state.isDue)
                    console.log(data1)

                    let response = await fetch("https://localhost:44357/api/monument/addmonument", {
                        method: "POST",
                        body: data1
                    });

                    if (response.status === 200) {
                        alert("Dodano zabytek");
                        this.setState({
                            shouldRedirect: true
                        })
                    }
                    else if(response.status === 204) {
                        this.setState({
                            isSubmitting: false,
                            nameError: 2
                        })
                    }
                    else {
                        this.setState({
                            isSubmitting: false
                        })
                    }
                }
                else {
                    const img = document.getElementById("imageF");
                    var data1 = new FormData();

                    data1.append('id', this.state.id);
                    data1.append('picture', this.state.image);
                    data1.append('name', this.state.name);
                    data1.append('creationDate', this.state.creationDate);
                    data1.append('longitude', this.state.longitude);
                    data1.append('latitude', this.state.latitude);
                    data1.append('description', this.state.description);
                    data1.append('monumentType', this.state.monumentType);
                    data1.append('isDue', this.state.isDue);
                    data1.append('address', streetName);
                    data1.append('cityName', cityName);
                    data1.append('userName', this.state.userName);
                    console.log(this.state.isDue)
                    let response = await fetch("https://localhost:44357/api/monument/editmonument", {
                        method: "POST",
                        body: data1
                    });

                    if (response.status === 200) {
                        alert("Edytwano zabytek");
                        this.setState({
                            shouldRedirect: true
                        })
                    }
                    else if(response.status === 204) {
                        this.setState({
                            isSubmitting: false,
                            nameError: 2
                        })
                    }
                    else {
                        this.setState({
                            isSubmitting: false
                        })
                        alert("Coś poszło nie tak");
                    }
                }

            }
        }

        else {
            if (this.state.monumentType === "") {
                this.setState({
                    monumentTypeError: true
                })
            }

            if (this.state.longitude === -5000 || this.state.latitude === -5000) {
                this.setState({
                    localizationError: true
                })
            }
            else {
                this.setState({
                    localizationError: false
                })
            }

            if (this.state.description.length <= 0) {
                this.setState({
                    descriptionError: true
                })
            }

            if (this.state.name.length <= 0) {
                this.setState({
                    nameError: 1
                })
            }

            if (this.state.creationDate.length <= 0) {
                this.setState({
                    createDateError: true
                })
                this.setState({
                    creationDateError: true
                })
            }

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
                if(e.target.files[0].size > 8388608) {
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

    handleShowLocalization() {
        this.setState({
            showLocalization: true
        })
    }

    handleCloseLocalization() {
        this.setState({
            showLocalization: false
        })
    }

    async getAddress(lat, lng) {
        let addr = Geocode.fromLatLng(lat, lng).then(
            response => {
                const address = response.results[0].formatted_address;
                return address;
            },
            error => {
                console.error(error);
                return "Brak";
            }
        );

        return addr
    }

    handleClickOnMap(e) {
        console.log(e.latlng)
        this.setState({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            isLocalizationSelected: true
        })
    }

    render() {
        let startPosition = this.state.id === 0 ? [52.22, 21.01] : [this.state.latitude, this.state.longitude];

        let errorImageMessage = "";
        let errorNameMessage = "";

        if(this.state.imageError === 1) {
            errorImageMessage = "Zdjęcie jest wymagane!"
        }
        else {
            errorImageMessage = "Za duży rozmiar zdjęcia!"
        }

        if(this.state.nameError === 1) {
            errorNameMessage = "Nazwa nie może być pusta!"
        }
        else if(this.state.nameError === 2) {
            errorNameMessage = "Nazwa jest już zajęta!"
        }

        return (
            <>
                {this.state.shouldRedirect ?
                    <Redirect to="monumentslist" />
                    :
                    <div className="center-content" style={{ marginTop: "70px" }}>
                        <div className="container-fluid">
                            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
                                integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                                crossOrigin="" />
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="margin-bottom-15">
                                            <div>
                                                <label className="label-input">Nazwa zabytku</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className="zero-raduis form-control"
                                                    name="name"
                                                    style={{border: this.state.nameError > 0 ? "1px solid red" : ""}}
                                                    onChange={this.handleChange}
                                                    value={this.state.name} />
                                                {this.state.nameError > 0 && <label className="error-message">{errorNameMessage}</label>}
                                            </div>
                                        </div>
                                        <div className="margin-bottom-15">
                                            <div>
                                                <label className="label-input">Data stworzenia zabytku</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    id="creationDate"
                                                    className="zero-raduis form-control"
                                                    name="creationDate"
                                                    style={{border: this.state.creationDateError ? "1px solid red" : ""}}
                                                    onChange={this.handleChange}
                                                    value={this.state.creationDate} />
                                                {this.state.creationDateError && <label className="error-message">Data nie może być pusta!</label>}
                                            </div>
                                        </div>
                                        <div className="margin-bottom-15">
                                            <div>
                                                <label className="label-input">Typ obiektu</label>
                                            </div>
                                            <div>
                                                <div style={{border: this.state.monumentTypeError ? "1px solid red" : "", borderRadius: "5px"}}>
                                                <select
                                                    value={this.state.monumentType}
                                                    id="monumentType"
                                                    name="monumentType"
                                                    defaultValue={this.state.monumentType}
                                                    onChange={this.handleChange}>
                                                    {
                                                        this.state.monumentTypes.map((type, index) => {
                                                            return <option value={index} key={index}>{type.replace(/_/g, " ")}</option>
                                                        })
                                                    }
                                                    {this.state.id === 0 && <option value=""
                                                        selected
                                                        hidden>
                                                        Wybierz typ
                                                    </option>}
                                                </select>
                                                </div>
                                                {this.state.monumentTypeError && <label className="error-message">Nie wybrano typ zabytku!</label>}
                                            </div>
                                        </div>
                                        <div className="margin-bottom-15">
                                            <div>
                                                <label className="label-input">Czy płatny</label>
                                            </div>
                                            <div>
                                                <select id="isDue" name="isDue" defaultValue={this.state.isDue} onChange={this.handleChange}>
                                                    <option value="0">Nie wiadomo</option>
                                                    <option value="1">Bezpłatny</option>
                                                    <option value="2">Płatny</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 margin-bottom-15">
                                        <div>
                                            <label className="label-input">Zdjęcie</label>
                                        </div>
                                        <div className="imageFieldv2" onClick={this.handleClick}>
                                            {!this.state.toDisplay ?
                                                <label className="customLabelv2" style={{ cursor: "pointer", border: this.state.imageError > 0 ? "1px solid red" : ""}}>Dodaj zdjęcie {"(max. 8 MB)"}</label>
                                                :
                                                <img className="add-image" id="image" src={"data:image/jpeg;base64," + this.state.image} style={{ display: this.state.id === 0 ? "none" : "block", cursor: "pointer" }} />
                                            }
                                            <input id="imageF" type="file" ref="uploadFile" style={{ display: "none" }} onChange={this.handleImage} />
                                        </div>
                                        {this.state.imageError !== 0 &&
                                            <div className="error-message">
                                                <label>{errorImageMessage}</label>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div>
                                            <label className="label-input">Lokalizacja</label>
                                        </div>
                                        <Map className="leaflet-container2 margin-bottom-15" center={startPosition} zoom={10} style={{ zIndex: "0" }} onClick={this.handleClickOnMap}>
                                            <TileLayer
                                                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                            />
                                            {this.state.isLocalizationSelected && <Marker position={[this.state.latitude, this.state.longitude]}>
                                            </Marker>}
                                        </Map>
                                        <div className="margin-bottom-15">
                                            <div>
                                                Szerokość geograficzna: {this.state.latitude === -5000 ? "Brak" : this.state.latitude}
                                            </div>
                                            <div>
                                                Długość geograficzna: {this.state.longitude === -5000 ? "Brak" : this.state.longitude}
                                            </div>
                                            {this.state.localizationError && <div className="error-message"><label>Niekompletna lokalizacja! Nie podano lokalizacji bądź nie znaleziono miejscowości i ulicy!</label></div>}
                                        </div>
                                    </div>
                                </div>
                                {this.state.addressError &&
                                    <>
                                        <div className="col-md-6">
                                            <div className="margin-bottom-15">
                                                <div>
                                                    <label className="label-input">Miejscowość</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        className="zero-raduis form-control"
                                                        name="city"
                                                        style={{border: this.state.cityError ? "1px solid red" : ""}}
                                                        onChange={this.handleChange}
                                                        value={this.state.city} />
                                                    {this.state.cityError && <label className="error-message">Nazwa miejscowości nie może być pusta!</label>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6"></div>
                                        <div className="col-md-6">
                                            <div className="margin-bottom-15">
                                                <div>
                                                    <label className="label-input" style={{marginRight: "5px"}}>Ulica</label>
                                                    <ReactTooltip place="right" />
                                                    <FontAwesomeIcon icon={faQuestionCircle} data-tip="Pole może pozostać puste"/>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        className="zero-raduis form-control"
                                                        name="address"
                                                        onChange={this.handleChange}
                                                        value={this.state.address} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className="row">
                                    <div className="col-md-12 margin-bottom-15">
                                        <div>
                                            <label className="label-input">Opis zabytku</label>
                                        </div>
                                        <div>
                                            <textarea id="description"
                                                name="description"
                                                className="add-description"
                                                defaultValue={this.state.description}
                                                maxLength="2000"
                                                style={{ wordWrap: "break-word", border: this.state.descriptionError ? "2px solid red" : "" }}
                                                onChange={this.handleChange}>
                                            </textarea>
                                        </div>
                                        <div>
                                            <label>Dostępne znaki: {this.state.charLimit}</label>
                                        </div>
                                        <div>
                                            {this.state.descriptionError && <label className="error-message">Opis nie może być pusty!</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <input disabled={this.state.isSubmitting} type="submit" className="button button-apply-filter zero-raduis submit-button" value={this.state.id === 0 ? "DODAJ" : "EDYTUJ"} />
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default AddMonument;