import React from 'react'
import { Redirect } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import accountService from '../../services/accountService'
import MultiSelect from "@khanacademy/react-multi-select";
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import { Map, Marker, Popup, TileLayer, Routing } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet-routing-machine';


import './addtrip.css'
import RoutingMachine from '../routingmachine/routingmachine';

class AddTrip extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        if (props.location.state == null) {
            this.state = {
                id: 0,
                name: "",
                description: "",
                sightseeingTimes: [],
                sightseeingTimeSelected: "",

                monuments: [],
                monumentsIdsSelected: [],

                monumentsDetails: [],

                nameError: false,
                descriptionError: false,
                sightseeingTypeError: false,
                monumentError: false,

                shouldRedirect: false,

                userName: accountService.getUserName(),
                charLimit: 2000,
                isSubmitting: false,
            }
        }
        else {
            this.state = {
                id: props.location.state.id,
                name: props.location.state.name,
                description: props.location.state.description,
                sightseeingTimes: [],
                sightseeingTimeSelected: props.location.state.sightseeingTime,

                monuments: [],
                monumentsIdsSelected: props.location.state.monumentsIdsSelected,

                monumentsDetails: [],


                nameError: false,
                descriptionError: false,
                sightseeingTypeError: false,
                monumentError: false,

                shouldRedirect: false,

                userName: accountService.getUserName(),
                charLimit: 2000 - props.location.state.description.length,
                isSubmitting: false
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.selectedChanged = this.selectedChanged.bind(this);
        this.handleRLDDChange = this.handleRLDDChange.bind(this);
        this.getWayPoints = this.getWayPoints.bind(this);
    }

    componentDidMount() {
        this.getSightseeingTimes();
        this.getMonumentsDetails();
    }

    async getMonumentsDetails() {
        await fetch("https://localhost:44357/api/monument/getmonumentstoaddtrip")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    monuments: data
                }, () => {
                    if (this.props.location.state != null) {
                        this.selectedChanged(this.state.monumentsIdsSelected);
                    }
                })
            })
    }

    async getSightseeingTimes() {
        await fetch("https://localhost:44357/api/trip/getsightseeingtimes")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    sightseeingTimes: data
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
                nameError: value.length === 0
            })

            if (value.length > 40) {
                this.setState({
                    [name]: value.substring(0, 40)
                })
                return;
            }
        }
        else if (name === "sightseeingTimeSelected") {
            this.setState({
                sightseeingTypeError: false
            })
        }

        this.setState({
            [name]: value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.name !== "" || this.state.description != ""
            || this.state.sightseeingTimeSelected !== "" || this.state.monumentsDetails.length > 0) {

            this.setState({
                isSubmitting: true
            })

            let errorName = true;
            let errorNameMessage = "";
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

            if (errorName || errorDescription) {
                let newLine = "\r\n";
                let message = "Znaleziono zbanowane słowa w:" + newLine;
                message += errorName ? "Nazwie: " + errorNameMessage + newLine : "";
                message += errorDescription ? "Opisie: " + errorDescriptionMessage + newLine : "";
                alert(message);
            }
            else {
                let list = [];

                this.state.monumentsDetails.forEach((monument, index) => {
                    list.push({ monumentId: monument.id, position: index })
                });

                if (this.state.id === 0) {

                    let response = await fetch("https://localhost:44357/api/trip/addtrip", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: this.state.name,
                            sightseeingTime: this.state.sightseeingTimeSelected,
                            description: this.state.description,
                            userName: this.state.userName,
                            monuments: list
                        })
                    });

                    if (response.status === 200) {
                        alert("Dodano wycieczkę");
                        this.setState({
                            isSubmitting: false,
                            shouldRedirect: true
                        })
                    }

                    else {
                        alert("Coś poszło nie tak")
                        this.setState({
                            isSubmitting: false
                        })
                    }
                }
                else {
                    let response = await fetch("https://localhost:44357/api/trip/edittrip", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            tripId: this.state.id,
                            name: this.state.name,
                            sightseeingTime: this.state.sightseeingTimeSelected,
                            description: this.state.description,
                            userName: this.state.userName,
                            monuments: list
                        })
                    });

                    if (response.status === 200) {
                        alert("Edytowano wycieczkę");
                        this.setState({
                            isSubmitting: false,
                            shouldRedirect: true
                        })
                    }

                    else {
                        alert("Coś poszło nie tak")
                        this.setState({
                            isSubmitting: false
                        })
                    }
                }

            }

            this.setState({
                isSubmitting: false
            })
        }

        else {
            if (this.state.sightseeingTimeSelected === "") {
                this.setState({
                    sightseeingTypeError: true
                })
            }

            if (this.state.description.length <= 0) {
                this.setState({
                    descriptionError: true
                })
            }

            if (this.state.name.length <= 0) {
                this.setState({
                    nameError: true
                })
            }

            if (this.state.monumentsDetails.length <= 0) {
                this.setState({
                    monumentError: true
                })
            }

            this.setState({
                isSubmitting: false
            })
        }

    }

    selectedChanged(selected) {

        this.setState({
            monumentsIdsSelected: selected,
            monumentError: false
        })

        let list = [];

        this.state.monuments.forEach(mon => {
            if (selected.some(s => s === mon.id)) {
                list.push(mon);
            }
        })
        this.setState({
            monumentsDetails: list,
        })

    }

    handleRLDDChange(newItems) {
        this.setState({ monumentsDetails: newItems });
    }

    getWayPoints() {
        var waypoints = [];
        this.state.monumentsDetails.forEach(monument => {
            waypoints.push({ lat: monument.latitude, lng: monument.longitude })
        })

        return waypoints;
    }

    render() {
        let startPosition = this.state.monumentsDetails.length <= 0 ? [52.22, 21.01] : [this.state.monumentsDetails[0].latitude, this.state.monumentsDetails[0].longitude];

        return (
            <>
            { this.state.shouldRedirect ?
                <Redirect to="tripslist" />
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
                                            <label className="label-input">Nazwa wycieczki</label>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                id="name"
                                                className="zero-raduis form-control"
                                                name="name"
                                                style={{ border: this.state.nameError ? "1px solid red" : "" }}
                                                onChange={this.handleChange}
                                                value={this.state.name} />
                                            {this.state.nameError && <label className="error-message">Nazwa nie może być pusta</label>}
                                        </div>
                                    </div>
                                    <div className="margin-bottom-15">
                                        <div>
                                            <label className="label-input">Czas zwiedzania</label>
                                        </div>
                                        <div>
                                            <div style={{ border: this.state.sightseeingTypeError ? "1px solid red" : "", borderRadius: "5px" }}>
                                                <select
                                                    value={this.state.sightseeingTimeSelected}
                                                    id="sightseeingTimeSelected"
                                                    name="sightseeingTimeSelected"
                                                    onChange={this.handleChange}>
                                                    {
                                                        this.state.sightseeingTimes.map((type, index) => {
                                                            return <option value={type.value} key={index}>{type.label.replace(/_/g, " ")}</option>
                                                        })
                                                    }
                                                    <option value=""
                                                        selected
                                                        hidden>
                                                        Wybierz czas zwiedzania
                                                </option>
                                                </select>
                                            </div>
                                            {this.state.sightseeingTypeError && <label className="error-message">Nie wybrano czasu zwiedzania</label>}
                                        </div>
                                        <div className="margin-bottom-15">
                                            <div>
                                                <label className="label-input">Opis wycieczki</label>
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
                                                {this.state.descriptionError && <label className="error-message">Opis nie może być pusty</label>}
                                            </div>
                                        </div>
                                        <div className="margin-bottom-15">
                                            <div>
                                                <label className="label-input">Dodaj zabytki</label>
                                            </div>
                                            <div style={{ width: "100%" }}>
                                                <div style={{ border: this.state.monumentError ? "1px solid red" : "", borderRadius: "5px" }}>
                                                    <MultiSelect
                                                        options={this.state.monuments}
                                                        selected={this.state.monumentsIdsSelected}
                                                        onSelectedChanged={(selected) => this.selectedChanged(selected)}

                                                        overrideStrings={{
                                                            selectSomeItems: "Zaznacz zabytki",
                                                            allItemsAreSelected: "Wszystkie zabytki zaznaczone",
                                                            selectAll: "Zaznacz wszystko",
                                                            search: "Szukaj",
                                                        }}
                                                    />
                                                </div>
                                                {this.state.monumentError && <label className="error-message">Nie dodano żadnego zabytku</label>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <Map className="leaflet-container5" center={startPosition} zoom={8} style={{ zIndex: "0" }}>
                                        <TileLayer
                                            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                        />
                                        {this.state.monumentsDetails.map((mon, index) => {
                                            return (
                                                <Marker key={index} position={[mon.latitude, mon.longitude]}>
                                                    <Popup>
                                                        <div style={{ marginTop: "5px", fontSize: "14px", fontWeight: "bold" }}>
                                                            {mon.label}
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            )
                                        })}
                                    </Map>
                                </div>
                            </div>
                            <div style={{ margin: "20px 0 40px 0" }}>
                                <div>
                                    <label className="label-input">Zmień pozycje zabytków</label>
                                </div>
                                <div style={{ border: "2px solid black", background: "#757575", width: "100%", padding: "5px" }}>
                                    {this.state.monumentsDetails.length <= 0 ?
                                        <div style={{ color: "white" }}>Nie zanzaczono żadnego zabytku</div>
                                        :
                                        <RLDD
                                            items={this.state.monumentsDetails}
                                            itemRenderer={(item, index) => {
                                                return (
                                                    <div className="draggable-item" style={{ marginBottom: index === this.state.monumentsDetails.length - 1 ? "0px" : "5px", display: "table", width: "100%" }}>
                                                        <div style={{ display: "table-row" }}>
                                                            <div style={{ display: "table-cell" }}>
                                                                <div style={{ paddingLeft: "5px", fontSize: "16px", fontWeight: "bold" }}>
                                                                    Nazwa: {item.label}
                                                                </div>
                                                                <div style={{ paddingLeft: "5px" }}>
                                                                    Miasto: {item.cityName}
                                                                </div>
                                                            </div>
                                                            <div style={{ display: "table-cell", width: "150px", textAlign: "right" }}>
                                                                <div style={{ marginRight: "15px" }}>
                                                                    Pozycja: {index + 1}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                            onChange={this.handleRLDDChange}
                                        />
                                    }
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

export default AddTrip;