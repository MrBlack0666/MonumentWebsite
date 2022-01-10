import React from 'react'
import MultiSelect from "@khanacademy/react-multi-select";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChurch, faCross, faLandmark, faMonument, faPlaceOfWorship, faStore, faHome, faTree, faArrowDown, faArrowUp, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from '@fortawesome/free-brands-svg-icons';
import Accordion from 'react-bootstrap/Accordion';
import Card from "react-bootstrap/Card";

import './monumentsmap.css'


class MonumentsMap extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            monuments: [],
            xs:[],

            cities: [],
            types: [],

            //filters
            name: "",
            citiesIds: [],
            minAverageMark: 0,
            monumentTypes: [],
            onlyFree: false,

            isFilterOpen: false,

            isLoading: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.getAllMonuments = this.getAllMonuments.bind(this);
        this.checkboxChange = this.checkboxChange.bind(this);
        this.getMonumentsWithfilter = this.getMonumentsWithfilter.bind(this);
    }

    componentDidMount() {
        this.getAllMonuments()
        this.getCities();
        this.getMonumentTypes();
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

    async getMonumentTypes() {
        await fetch("https://localhost:44357/api/monument/getmonumenttypestoselect")
        .then(response => response.json())
        .then(data => {
            this.setState({
                types: data
            })
        })
    }

    async getAllMonuments() {
        let response = await fetch("https://localhost:44357/api/monument/getallmonumentsformap", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.name,
                    citiesIds: this.state.citiesIds,
                    minAverageMark: this.state.minAverageMark,
                    monumentTypes: this.state.monumentTypes,
                    onlyFree: this.state.onlyFree
                })
            }).then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    monuments: data
                })
            })
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({
            [name]: value
        });
    }

    checkboxChange() {
        console.log(this.state.citiesIds)
        if(this.state.onlyFree) {
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

    getMonumentsWithfilter() {
        
        this.setState({
            monuments: []
        },
        this.getAllMonuments
        )
    }

    displayDetails(id) {
        this.props.history.push("monumentdetails", id)
    }

    isAccordionOpen = () => {
        this.setState({
            isFilterOpen: !this.state.isFilterOpen
        })
    }

    render() {
        const startPosition = [52.22, 21.01];

        return (
            <div className="center-content" style={{marginTop: "70px"}}>
                 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
                    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                    crossorigin="" />
                <div>
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
                                                <div className="col-sm-6 col-md-4">
                                                    <div className="filter-column form-group">
                                                        <div>
                                                            <label>Nazwa zabytku</label>
                                                        </div>
                                                        <div>
                                                            <input className="form-control" type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-md-4">
                                                    <div className="filter-column">
                                                        <div>
                                                            <label>Minimalna ocena:</label>
                                                        </div>
                                                        <div>
                                                            <select id="selectMinMark" name="minAverageMark" onChange={this.handleChange}>
                                                                <option value="0">Brak</option>
                                                                <option value="2">>= 2</option>
                                                                <option value="3">>= 3</option>
                                                                <option value="4">>= 4</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-md-4">
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
                                                <div className="col-sm-6 col-md-4">
                                                    <div className="filter-column" style={{ height: this.state.isTypeDropdownOpen ? "380px" : "80px" }}>
                                                        <div>
                                                            <label>Typy zabytków</label>
                                                        </div>
                                                        <div>
                                                            <MultiSelect
                                                                options={this.state.types}
                                                                selected={this.state.monumentTypes}
                                                                onSelectedChanged={selected => this.setState({ monumentTypes: selected })}
                                                                overrideStrings={{
                                                                    selectSomeItems: "Zaznacz typy zabytków",
                                                                    allItemsAreSelected: "Wszystkie zabytki zaznaczone",
                                                                    selectAll: "Zaznacz wszystko",
                                                                    search: "Szukaj",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-md-4">
                                                    <div className="filter-column-checkbox">
                                                        <label className="margin-top-45 checkbox-container">Tylko bezpłatne zabytki
                                                        <input type="checkbox" name="onlyFree" onClick={this.checkboxChange} />
                                                            <span class="checkmark"></span></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    {this.state.isLoading ?
                                                        <button disabled className="button button-apply-filter" onClick={this.getMonumentsWithfilter}>Filtruj</button>
                                                        :
                                                        <button className="button button-apply-filter" onClick={this.getMonumentsWithfilter}>Filtruj</button>
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
                <div>
                        <Map center={startPosition} zoom={10} style={{zIndex: "0"}}>
                            <TileLayer
                                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                            />

                            {this.state.monuments.map((monument, index) => {
                                return (
                                    <Marker key={index} position={[monument.latitude, monument.longitude]}>
                                        <Popup>
                                            <div onClick={() => this.displayDetails(monument.id)} style={{cursor: "pointer"}}>
                                                <div>
                                                    <img className="card-img-top" src={"data:image/jpeg;base64," + monument.mainPhoto} alt="Card image cap" style={{ width: "200px", height: "200px" }} />
                                                </div>
                                                <div style={{marginTop: "5px", fontSize: "14px", fontWeight: "bold", width: "200px"}}>
                                                    {monument.name}
                                                </div>
                                                <div>
                                                    {monument.cityName + ", " + monument.address}
                                                </div>
                                                <div>
                                                    Rodzaj: {this.state.types.map(type => {
                                                        
                                                        if(type.value === monument.monumentType) {
                                                            return type.label
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                        </Map>
                </div>
            </div>
        )
    }
}

export default MonumentsMap;