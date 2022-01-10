import React from 'react'
import { Redirect, Link, withRouter } from 'react-router-dom'
import $ from 'jquery';
import MultiSelect from "@khanacademy/react-multi-select";
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import Accordion from 'react-bootstrap/Accordion';
import Card from "react-bootstrap/Card";
import ReactLoading from 'react-loading';
import accountService from '../../services/accountService'


import 'bootstrap/dist/css/bootstrap.min.css';
import './tripslist.css'

class TripsList extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            trips: [],
            blockNumber: -1,
            allBlocks: 1,

            cities: [],
            sightseeingTimes: [],

            //filters
            name: "",
            citiesIds: [],
            sightseeingTimesSelected: [],
            onlyFree: false,
            isAuthenticated: accountService.isAuthenticated(),

            isFilterOpen: false,

            isLoading: false
        }

        this.getTripsBlock = this.getTripsBlock.bind(this);
        this.getTripsWithfilter = this.getTripsWithfilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkboxChange = this.checkboxChange.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
        this.getTripsBlock();
        this.getCities();
        this.getSightseeingTimes();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    async getCities() {
        await fetch("https://localhost:44357/api/city/getcities")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    cities: data
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

    async getTripsBlock() {
        if (!this.state.isLoading && this.state.blockNumber + 1 < this.state.allBlocks) {
            this.setState({
                isLoading: true
            })

            let response = await fetch("https://localhost:44357/api/trip/gettrips", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lastBlockNumber: this.state.blockNumber,
                    name: this.state.name,
                    citiesIds: this.state.citiesIds,
                    sightseeingTimes: this.state.sightseeingTimesSelected,
                    onlyFree: this.state.onlyFree,
                })
            }).then(response => response.json())
                .then(data => {
                    console.log("data", data)
                    if (data == null || data.trips == null) {
                        this.setState({
                            trips: [],
                            blockNumber: 0,
                            allBlocks: 1
                        })
                    }
                    else {

                        this.setState({
                            trips: this.state.trips.concat(data.trips),
                            blockNumber: data.blockNumber,
                            allBlocks: data.allBlocks
                        })
                    }
                })

            this.setState({
                isLoading: false
            })
        }
    }

    onScroll = () => {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            this.getTripsBlock();
        }
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    checkboxChange() {
        if (this.state.onlyFree) {
            this.setState({
                onlyFree: false
            })
        }
        else {
            this.setState({
                onlyFree: true
            })
        }
    }

    getTripsWithfilter() {

        this.setState({
            blockNumber: -1,
            allBlocks: 1,
            trips: []
        },
            this.getTripsBlock
        )
    }

    displayDetails(id) {
        this.props.history.push("tripdetails", id)
    }

    isAccordionOpen = () => {
        this.setState({
            isFilterOpen: !this.state.isFilterOpen
        })
    }

    render() {
        return (
            <div className="center-content">
                <div style={{ margin: "70px 20px 0 20px" }}>
                    <div style={{ marginBottom: "20px" }}>
                        {this.state.isAuthenticated &&
                            <div style={{ float: "right", width: "60px", }}>
                                <div style={{ marginLeft: "1px" }}>
                                    <Link to="/addtrip">
                                        <div style={{ marginTop: "-3px" }}>
                                            <FontAwesomeIcon icon={faPlusSquare} data-tip="Dodaj wycieczkę" color="#2b2b2b" style={{ width: "57px", height: "57px" }} />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        }
                        <div>
                            <Accordion className="accordion-style">
                                <Card className="card-style">
                                    <Accordion.Toggle as={Card.Header} eventKey="0" className="accordion-header-style" onClick={() => this.isAccordionOpen()}>
                                        <div style={{ float: "right" }}>{this.state.isFilterOpen ? <FontAwesomeIcon icon={faArrowUp} style={{ marginRight: "0px" }} /> : <FontAwesomeIcon icon={faArrowDown} style={{ marginRight: "0px" }} />}</div>
                                        <div style={{ float: "left" }}>Filtry</div>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0" className="accordion-collapse-style">
                                        <Card.Body style={{ padding: "10px" }}>
                                            <div className="container-fluid">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="filter-column form-group">
                                                            <div>
                                                                <label>Nazwa wycieczki</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-control" type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="filter-column">
                                                            <div>
                                                                <label>Miasta</label>
                                                            </div>
                                                            <div>
                                                                <MultiSelect
                                                                    options={this.state.cities}
                                                                    selected={this.state.citiesIds}
                                                                    onSelectedChanged={selected => this.setState({ citiesIds: selected })}
                                                                    overrideStrings={{
                                                                        selectSomeItems: "Zaznacz miasta",
                                                                        allItemsAreSelected: "Wszystkie miasta zaznaczone",
                                                                        selectAll: "Zaznacz wszystko",
                                                                        search: "Szukaj",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="filter-column" style={{ height: this.state.isTypeDropdownOpen ? "380px" : "80px" }}>
                                                            <div>
                                                                <label>Czasy trwania wycieczki</label>
                                                            </div>
                                                            <div>
                                                                <MultiSelect
                                                                    options={this.state.sightseeingTimes}
                                                                    selected={this.state.sightseeingTimesSelected}
                                                                    onSelectedChanged={selected => this.setState({ sightseeingTimesSelected: selected })}
                                                                    overrideStrings={{
                                                                        selectSomeItems: "Zaznacz czasy trwania wycieczki",
                                                                        allItemsAreSelected: "Wszystkie czasy trwania wycieczki zaznaczone",
                                                                        selectAll: "Zaznacz wszystko",
                                                                        search: "Szukaj",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="filter-column-checkbox">
                                                            <label className="margin-top-45 checkbox-container">Tylko wycieczki z bezpłatnymi zabytkami
                                                                <input type="checkbox" name="onlyFree" onClick={this.checkboxChange} />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        {this.state.isLoading ?
                                                            <button disabled className="button button-apply-filter" onClick={this.getTripsWithfilter}>Filtruj</button>
                                                            :
                                                            <button className="button button-apply-filter" onClick={this.getTripsWithfilter}>Filtruj</button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            {this.state.trips.map((trip, index) => {
                                return (
                                    <div key={index} className="col-md-12" onClick={() => this.displayDetails(trip.id)} style={{ border: "2px solid #2b2b2b", borderRadius: "5px", marginBottom: "10px", padding: "5px", width: "100%", cursor: "pointer"}}>
                                        <div >
                                            <div >
                                                <div style={{ float: "left" }}>
                                                    <div style={{ width: "100%" }}>
                                                        <label style={{ fontSize: "24px", fontWeight: "bold" }}>{trip.name}</label>
                                                    </div>
                                                    <div>
                                                        <label><label style={{ fontWeight: "bold" }}>Czas wycieczki:</label> {this.state.sightseeingTimes.map((s) => {
                                                            if (s.value === trip.sightseeingTime) {
                                                                return s.label
                                                            }
                                                        })}</label>
                                                    </div>
                                                    <div style={{ width: "100%" }}>
                                                        <label><label style={{ fontWeight: "bold" }}>Dodana przez:</label> {trip.creator}</label>
                                                    </div>
                                                    <div style={{ width: "100%" }}>
                                                        <label><label style={{ fontWeight: "bold" }}>Zwiedzane miasta:</label> {trip.cityNames}</label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ float: "right" }}>
                                                        {
                                                            trip.monuments.map((monument, index1) => {
                                                                return (
                                                                    <div key={index1} style={{ float: "left", margin: "5px", border: "1px solid #2b2b2b", width: "120px", height: "120px" }}>
                                                                        <img className="card-img-top" src={"data:image/jpeg;base64," + monument.mainPhoto} alt="Card image cap" style={{ height: "118px", width: "118px" }} />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        {trip.monuments.length < trip.numberOfMonuments &&
                                                            <div style={{ float: "left", background: "#2b2b2b", margin: "5px", border: "1px solid #2b2b2b", width: "120px", height: "120px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                                                <div style={{ color: "white", fontSize: "20px" }}>+{trip.numberOfMonuments - trip.monuments.length}</div>

                                                            </div>
                                                        }
                                                    </div>
                                                    <div style={{ clear: "both" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {this.state.blockNumber + 1 < this.state.allBlocks && <ReactLoading type={"spinningBubbles"} color={"#2b2b2b"} height={50} width={50} />}
                    </div>
                </div>
            </div>
        )
    }
}

export default TripsList;