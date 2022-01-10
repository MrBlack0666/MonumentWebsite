import React from 'react'
import { Redirect } from 'react-router-dom'
import ReactLoading from 'react-loading';
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';

import './unverifiedmonuments.css'

class UnverifiedMonuments extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            monuments: [],
            isSubmitting: false,
            numberOfMonumentsRendered: 10,
            isLoading: true
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.verifyMonument = this.verifyMonument.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.getUnverifiedMonuments();
    }

    async getUnverifiedMonuments() {
        this.setState({
            isLoading: true
        })
        await fetch("https://localhost:44357/api/monument/getunverifiedmonuments")
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

    openVerifyMonument = (acceptation ,id) => {
        confirmAlert({
            title: acceptation ? 'Dodaj zabytek' : 'Usuń zabytek',
            message: acceptation ? 'Czy na pewno chcesz dodać zabytek?' : 'Czy na pewno chcesz usunąć zabytek?',
            buttons: [
                {
                    label: 'Tak',
                    onClick: () => this.verifyMonument(acceptation, id)
                },
                {
                    label: 'Nie',
                }
            ]
        });
    };

    async verifyMonument(acceptation, id) {
        this.setState({
            isSubmitting: true
        })

        let response = await fetch("https://localhost:44357/api/monument/acceptaddedmonument/" + id + "/" + acceptation, {
            method: "POST"
        });

        if(response.status === 200) {
            let message = acceptation ? "Dodano zabytek" : "Usunięto zabytek"
            this.getUnverifiedMonuments();
            alert(message);
        }
        else {
            alert("Coś poszło nie tak");
        }

        this.setState({
            isSubmitting: false
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        
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

    renderContent() {
        if(this.state.isLoading) {
            return (
                <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ReactLoading type={"spinningBubbles"} color={"#2b2b2b"} height={50} width={50} />
                </div>
            )
        }
        else {
            if(this.state.monuments <= 0) {
                return (
                    <h5>Nie znaleziono niezwerifikownych zabytków</h5>
                )
            }
            else {
                return (
                    this.state.monuments.map((monument, index) => {
                        if(index < this.state.numberOfMonumentsRendered) {
                            return (
                                <div key={index} style={{ border: "2px solid #2b2b2b", borderRadius: "5px", marginBottom: "10px", padding: "5px", width: "100%" }}>
                                    <div style={{float: "left"}}>
                                        <div style={{float: "left", cursor: "pointer"}} onClick={() => this.showMonument(monument.id)}>
                                            <img className="card-img-top" src={"data:image/jpeg;base64," + monument.mainPhoto} alt="image" style={{ maxWidth: "250px", maxHeight: "250px", marginBottom: "5px"}} />
                                        </div>
                                        <div style={{float: "left", marginLeft: "10px"}}>
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
                                    <div style={{float: "right"}}>
                                            <div className="pull-right">
                                                <ReactTooltip place="left" />
                                                <div onClick={() => this.openVerifyMonument(true, monument.id)} style={{ float: "left", cursor: "pointer", width: "45px", height: "45px"}}>
                                                    <FontAwesomeIcon icon={faCheckSquare} data-tip="Akceptuj" style={{width: "40px", height: "40px"}}/>
                                                </div>
                                                <div onClick={() => this.openVerifyMonument(false, monument.id)} style={{ float: "left", cursor: "pointer", width: "45px", height: "45px"}}>
                                                    <FontAwesomeIcon icon={faWindowClose} data-tip="Usuń" style={{width: "40px", height: "40px"}}/>
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
                        <button className="button load-more-marks" onClick={() => this.loadMore()}>
                            Wczytaj więcej zabytków
                        </button>
                    }
                </div>                
            </div>
        )
    }
}

export default UnverifiedMonuments;