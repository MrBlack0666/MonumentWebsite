import React from 'react'
import { Redirect } from 'react-router-dom'
import accountService from '../../services/accountService'

import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChurch, faCross, faLandmark, faMonument, faPlaceOfWorship, faStore, faHome, faTree, faArrowDown, faArrowUp, faPlusSquare, faPenSquare, faEdit, faWindowClose, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from '@fortawesome/free-brands-svg-icons';

import './yourunverifiedmonuments.css'

class YourUnverifiedMonuments extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            monuments: [],
            isSubmitting: false,
            numberOfMonumentsRendered: 10,
            isLoading: true,
            userName: accountService.getUserName()

        }
        this.handleChange = this.handleChange.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.getYourUnverifiedMonuments();
    }

    async getYourUnverifiedMonuments() {
        this.setState({
            isLoading: true
        })
        await fetch("https://localhost:44357/api/monument/getyourunverifiedmonuments?userName=" + this.state.userName)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    monuments: data
                })
            })

        this.setState({
            isLoading: false
        })
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    showMonument(id) {
        this.props.hist.push("monumentdetails", id);
    }

    loadMore() {
        this.setState({
            numberOfMonumentsRendered: this.state.numberOfMonumentsRendered + 10
        })
    }

    editMonument(monument) {
        const data = {
            id: monument.id,
            name: monument.name,
            creationDate: monument.creationDate,
            monumentType: monument.monumentType,
            isDue: monument.isDue,
            description: monument.description,
            mainPhoto: monument.mainPhoto,
            city: monument.city.name,
            address: monument.address,
            latitude: monument.latitude,
            longitude: monument.longitude
        }
        this.props.hist.push("addmonument", data);
    }

    renderContent() {
        if (this.state.isLoading) {
            return (
                <div>Wczytywanie</div>
            )
        }
        else {
            if (this.state.monuments <= 0) {
                return (
                    <div>Nie znaleziono niezwerifikownych zabytków</div>
                )
            }
            else {
                return (
                    this.state.monuments.map((monument, index) => {
                        if (index < this.state.numberOfMonumentsRendered) {
                            return (
                                <div key={index} style={{ border: "2px solid #2b2b2b", borderRadius: "5px", marginBottom: "10px", padding: "5px", width: "100%" }}>
                                    <div style={{ float: "left" }}>
                                        <div style={{ float: "left", cursor: "pointer" }} onClick={() => this.showMonument(monument.id)}>
                                            <img className="card-img-top" src={"data:image/jpeg;base64," + monument.mainPhoto} alt="image" style={{ maxWidth: "250px", maxHeight: "250px", marginBottom: "5px"}} />
                                        </div>
                                        <div style={{ float: "left", marginLeft: "10px" }}>
                                            <div>
                                                <h4 style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => this.showMonument(monument.id)}>{monument.name}</h4>
                                            </div>
                                            <div>
                                                <label><label style={{fontWeight: "bold"}}>Dodany przez:</label> {monument.creator == null ? 'Nie wiadomo' : monument.creator.userName}</label>
                                            </div>
                                            <div>
                                                <label><label style={{fontWeight: "bold"}}>Miejscowość:</label> {monument.city.name}</label>
                                            </div>
                                            <div>
                                                <label><label style={{fontWeight: "bold"}}>Ulica:</label> {monument.address}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ float: "right" }}>
                                        <div className="pull-right">
                                            <ReactTooltip place="left" />
                                            <div onClick={() => this.editMonument(monument)} style={{ float: "left", cursor: "pointer", width: "45px", height: "45px" }}>
                                                <FontAwesomeIcon icon={faPenSquare} data-tip="Edytuj" style={{ width: "40px", height: "40px" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{clear: "both"}}></div>
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
                <div>
                    {this.state.numberOfMonumentsRendered < this.state.monuments.length &&
                        <button onClick={() => this.loadMore()}>
                            Wczytaj więcej kometarzy
                        </button>
                    }
                </div>

            </div>
        )
    }
}

export default YourUnverifiedMonuments;