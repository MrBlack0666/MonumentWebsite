import React from 'react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import accountService from '../../services/accountService';

import './tripdetails.css'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import RoutingMachine from '../routingmachine/routingmachine';

class TripDetails extends React.Component {

    map = React.createRef();

    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            id: props.location.state,
            trip: null,
            isLoaded: false,

            userName: accountService.getUserName(),
            isUserAdmin: accountService.isInRole("Admin"),
            pageError: false,

            sightseeingTimes: [],
        }
        this.editTrip = this.editTrip.bind(this);
        this.deleteTrip = this.deleteTrip.bind(this);
    }

    componentDidMount() {
        this.getSightseeingTimes();
        this.getTripDetails();
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

    async getTripDetails() {
        try {
            await fetch("https://localhost:44357/api/trip/gettripdetails/" + this.state.id)
            .then(response => response.json())
            .then(data => {
                if (data != null && data.name != undefined) {
                    this.setState({
                        trip: data,
                        isLoaded: true
                    })
                }
            })
        }
        catch (error) {
            this.setState({
                pageError: true
            })
        }
    }

    displayMonumentDetails(id) {
        this.props.history.push("monumentdetails", id)
    }

    editTrip() {
        let monumentsIds = []
        this.state.trip.monuments.sort((a, b) => a.position - b.position).forEach((mon => {
            monumentsIds.push(mon.monumentId);
        }))

        const data = {
            id: this.state.trip.id,
            name: this.state.trip.name,
            description: this.state.trip.description,
            sightseeingTime: this.state.trip.sightseeingTime,
            monumentsIdsSelected: monumentsIds
        }
        this.props.history.push("addtrip", data)
    }

    openDeleteTrip = (id) => {
        confirmAlert({
            title: 'Usuń wycieczkę',
            message: 'Czy na pewno chcesz usunąć wycieczkę',
            buttons: [
                {
                    label: 'Tak',
                    onClick: () => this.deleteTrip(id)
                },
                {
                    label: 'Nie',
                }
            ]
        });
    };

    async deleteTrip(id) {
        this.setState({
            isSubmitting: true
        })
        let response = await fetch("https://localhost:44357/api/trip/deletetrip", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tripId: id,
                username: this.state.userName
            })
        });

        if (response.status === 200) {
            alert("Usunięto wyieczkę")
            this.props.history.push("tripslist")
        }
        else {
            alert("Coś poszło nie tak")
        }

        this.setState({
            isSubmitting: false
        })
    }

    getWayPoints() {
        var waypoints = [];
        this.state.trip.monuments.forEach(mon => {
            waypoints.push({ lat: mon.monument.latitude, lng: mon.monument.longitude })
        })

        return waypoints;
    }

    render() {
        let startPosition = this.state.trip == null || this.state.trip.monuments.length <= 0 ? [52.22, 21.01] : [this.state.trip.monuments[0].monument.latitude, this.state.trip.monuments[0].monument.longitude];;

        return (
            <div className="center-content">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
                    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                    crossOrigin="" />
                {!this.state.pageError ?
                    <>
                        {this.state.isLoaded &&
                            <div className="center-content" style={{ marginTop: "70px" }}>
                                <div style={{margin: "0 20px"}}>
                                    <div>
                                        <div style={{float: "left"}}>
                                            <div>
                                                <label style={{fontSize: "24px", fontWeight: "bold"}}>{this.state.trip.name}</label>
                                            </div>
                                            <div>
                                                <label><label style={{fontWeight: "bold"}}>Czas zwiedzania:</label> {this.state.sightseeingTimes.map((time, index) => {
                                                    if (time.value === this.state.trip.sightseeingTime) {
                                                        return time.label;
                                                    }
                                                })}</label>
                                            </div>
                                            <div>
                                                <label><label style={{fontWeight: "bold"}}>Dodana przez:</label> {this.state.trip.creator.userName}</label>
                                            </div>
                                        </div>
                                        {((this.state.trip.creator != null && this.state.userName === this.state.trip.creator.userName) || this.state.isUserAdmin) &&
                                            <div>
                                                <ReactTooltip place="left" />
                                                <div className="pull-right">
                                                    <div onClick={() => this.openDeleteTrip(this.state.trip.id)} style={{ float: "right", cursor: "pointer", marginLeft: "5px" }}>
                                                        <FontAwesomeIcon icon={faWindowClose} data-tip="Usuń wycieczkę" style={{ width: "40px", height: "40px" }} />
                                                    </div>
                                                    <div onClick={() => this.editTrip()} style={{ float: "right", cursor: "pointer" }}>
                                                        <FontAwesomeIcon icon={faPenSquare} data-tip="Edytuj wycieczkę" style={{ width: "40px", height: "40px" }} />
                                                    </div>
                                                </div>
                                            </div>}
                                    </div>
                                    <div style={{clear: "both", border: "2px solid #2b2b2b", padding: "10px", borderRadius: "10px"}}>
                                        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                                            Opis wycieczki
                                        </div>
                                        <div style={{wordBreak: "break-word"}}>
                                            {this.state.trip.description}
                                        </div>
                                    </div>
                                    <div style={{marginTop: "20px"}}>
                                        <div style={{ border: "2px solid black", borderRadius: "10px", padding: "10px" }}>
                                            <div>
                                                <label><label style={{fontWeight: "bold"}}>Ilość zabytków:</label> {this.state.trip.monuments.length}</label>
                                            </div>
                                            <div style={{ overflowX: "auto", display: "flex" }}>
                                                {this.state.trip.monuments.sort((a, b) => a.position - b.position).map((mon, index) => {
                                                    return (
                                                        <div key={index} style={{ border: "1px solid black", margin: index != 0 ? "5px" : "5px 5px 5px 0", cursor: "pointer", width: "200px" }} onClick={() => this.displayMonumentDetails(mon.monumentId)}>
                                                            <div >
                                                                <img className="card-img-top" src={"data:image/jpeg;base64," + mon.monument.mainPhoto} alt="Card image cap" style={{ width: "198px", height: "198px" }} />
                                                            </div>
                                                            <div style={{ marginLeft: "5px", fontWeight: "bold", whiteSpace: "normal", wordBreak: "break-word" }}>{mon.monument.name}</div>
                                                            <div style={{ marginLeft: "5px", fontSize: "12px", whiteSpace: "normal", wordBreak: "break-word" }}>Miasto: {mon.monument.city.name}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{margin: "20px 0 40px 0"}}>
                                        <div style={{fontWeight: "bold", marginBottom: "10px"}}>Mapa</div>
                                        <Map ref={this.map} className="leaflet-container3" center={startPosition} zoom={8} style={{ zIndex: "0" }}>
                                            <TileLayer
                                                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                            />
                                            <RoutingMachine
                                                color="#ff0000"
                                                map={this.map}
                                                road={this.getWayPoints()}
                                            />
                                            {this.state.trip.monuments.map((mon, index) => {
                                                return (
                                                    <Marker key={index} position={[mon.monument.latitude, mon.monument.longitude]}>
                                                        <Popup>
                                                            <div onClick={() => this.displayMonumentDetails(mon.monument.id)} style={{ cursor: "pointer" }}>
                                                                <div>
                                                                    <img className="card-img-top" src={"data:image/jpeg;base64," + mon.monument.mainPhoto} alt="Card image cap" style={{ width: "200px", height: "200px" }} />
                                                                </div>
                                                                <div style={{ marginTop: "5px", fontSize: "14px", fontWeight: "bold", width: "200px", wordBreak: "normal" }}>
                                                                    {mon.monument.name}
                                                                </div>
                                                                <div>
                                                                    {mon.monument.city.name + ", " + mon.monument.address}
                                                                </div>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                )
                                            })}
                                        </Map>
                                    </div>
                                </div>
                            </div>}
                    </>
                    :
                    <div style={{marginTop: "70px", fontSize: "32px", fontWeight: "bold", display: "flex", justifyContent: "center"}}>Nie odnaleziono wycieczki</div>
                }

            </div>
        )
    }
}

export default TripDetails;