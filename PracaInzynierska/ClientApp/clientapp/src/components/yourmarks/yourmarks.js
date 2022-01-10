import React from 'react'
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import { Modal } from 'react-bootstrap'
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import ReactLoading from 'react-loading';
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChurch, faCross, faLandmark, faMonument, faPlaceOfWorship, faStore, faHome, faTree, faArrowDown, faArrowUp, faPlusSquare, faPenSquare, faEdit, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from '@fortawesome/free-brands-svg-icons';

import accountService from '../../services/accountService';

import './yourmarks.css'

class YourMarks extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            marks: [],
            userName: accountService.getUserName(),

            showEditMark: false,
            rating: 0,
            editedMarkId: 0,
            comment: "",
            charCommentLimit: 500,

            isSubmitting: false,

            numberOfMarksRendered: 3,

            isLoading: true
        }
        this.loadMoreComments = this.loadMoreComments.bind(this);
        this.getYourMarks = this.getYourMarks.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeRating = this.changeRating.bind(this);
        this.editMark = this.editMark.bind(this);
        this.deleteMark = this.deleteMark.bind(this);
        this.displayAddOrEditMark = this.displayAddOrEditMark.bind(this);
    }

    componentDidMount() {
        console.log('x', this.state.userName);
        this.getYourMarks();
    }

    async getYourMarks() {
        await fetch("https://localhost:44357/api/mark/getyourmarks?userName=" + this.state.userName)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    marks: data
                })
            })
        this.setState({
            isLoading: false
        })
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        if (name === "comment") {
            this.setState({
                charCommentLimit: 500 - value.length
            })
        }

        this.setState({
            [name]: value
        })
    }

    changeRating(newRating, name) {
        this.setState({
            rating: newRating
        });
    }

    returnDate(date) {
        return moment(date)
            .local()
            .format("DD.MM.YYYY HH:mm:ss")
    }

    showMonument(id) {
        this.props.hist.push("monumentdetails", id);
    }

    displayAddOrEditMark(close, mark) {
        if (!close) {
            this.setState({
                showEditMark: true,
                editedMarkId: mark.id,
                comment: mark.comment,
                rating: mark.grade,
                charCommentLimit: 500 - mark.comment.length
            })
        }
        else {
            this.setState({
                showEditMark: false,
                editedMarkId: 0,
                comment: "",
                charCommentLimit: 500
            })
        }
    }

    async editMark() {
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
                if (this.state.editedMarkId > 0) {
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
                        this.displayAddOrEditMark(true)
                        this.setState({
                            isSubmitting: false
                        });

                        this.getYourMarks();
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
            this.getYourMarks();
            alert("Usunięto ocenę");
        }
        else {
            this.setState({
                isSubmitting: false
            });
        }
    }

    loadMoreComments() {
        this.setState({
            numberOfMarksRendered: this.state.numberOfMarksRendered + 50
        })
    }

    renderContent() {
        if (this.state.isLoading) {
            return (
                <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ReactLoading type={"spinningBubbles"} color={"#2b2b2b"} height={50} width={50} />
                </div>
            )
        }
        else {
            if (this.state.marks.length <= 0) {
                return (
                    <h5>Nie dodałeś jeszce żadnej oceny!</h5>
                )
            }
            else {
                return (
                    this.state.marks.sort((a, b) => moment(b.creationDate).valueOf() - moment(a.creationDate).valueOf()).map((mark, index) => {
                        if (index < this.state.numberOfMarksRendered) {
                            return (
                                <div key={index} style={{ border: "2px solid #2b2b2b", borderRadius: "5px", marginBottom: "10px", padding: "5px", width: "100%" }}>
                                    <div>
                                        <div className="mark-monument-name" style={{ float: "left" }}>
                                            <label>Zabytek: <label style={{ cursor: "pointer" }} onClick={() => this.showMonument(mark.monument.id)}>{mark.monument.name}</label></label>
                                        </div>
                                        <div className="mark-date" style={{ float: "right" }}>
                                            <label>{this.returnDate(mark.creationDate)}</label>
                                        </div>
                                    </div>
                                    <div style={{ clear: "both" }}>
                                        <div>
                                            <div style={{ float: "right" }}>
                                                <ReactTooltip place="left" />
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
                                                <label style={{}}>Ocena: </label>
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
                            )
                        }
                    })
                )
            }
        }
    }

    render() {
        return (
            <div>
                {this.renderContent()}
                <Modal
                    show={this.state.showEditMark}
                    onHide={() => this.displayAddOrEditMark(true, null)}
                    dialogClassName="modal-edit-mark"
                    aria-labelledby="example-custom-modal-styling-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Edytuj ocenę
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
                            {(this.state.rating == null || this.state.rating == 0) &&
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
                            <button className="button load-more-marks" onClick={this.editMark}> {this.state.editedMarkId > 0 ? "Edytuj" : "Dodaj"}</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <div>
                    {this.state.numberOfMarksRendered < this.state.marks.length &&
                        <button className="button load-more-marks" onClick={() => this.loadMoreComments()}>
                            Wczytaj więcej ocen
                        </button>
                    }
                </div>
            </div>
        )
    }
}

export default YourMarks;