import React from 'react'
import { Redirect, Link, withRouter } from 'react-router-dom'
import $ from 'jquery';
import MultiSelect from "@khanacademy/react-multi-select";
import StarRatings from 'react-star-ratings';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChurch, faCross, faLandmark, faMonument, faPlaceOfWorship, faStore, faHome, faTree, faArrowDown, faArrowUp, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from '@fortawesome/free-brands-svg-icons';
import Accordion from 'react-bootstrap/Accordion';
import Card from "react-bootstrap/Card";
import ReactLoading from 'react-loading';
import accountService from '../../services/accountService'

import './monumentslist.css'

class MonumentsList extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            monuments: [],
            blockNumber: -1,
            allBlocks: 1,

            cities: [],
            types: [],

            //filters
            name: "",
            citiesIds: [],
            minAverageMark: 0,
            monumentTypes: [],
            onlyFree: false,
            sortingName: "",
            descending: false,

            sort: "none",

            isFilterOpen: false,

            isAuthenticated: accountService.isAuthenticated(),
            isLoading: false
        }

        this.getMonumentsBlock = this.getMonumentsBlock.bind(this);
        this.getMonumentsWithfilter = this.getMonumentsWithfilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkboxChange = this.checkboxChange.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
        this.getMonumentTypes();
        this.getCities();
        this.getMonumentsBlock();
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

    async getMonumentTypes() {
        await fetch("https://localhost:44357/api/monument/getmonumenttypestoselect")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    types: data
                })
            })
    }

    async getMonumentsBlock() {
        if (!this.state.isLoading && this.state.blockNumber + 1 < this.state.allBlocks) {

            this.setState({ isLoading: true })

            let response = await fetch("https://localhost:44357/api/monument/getmonuments", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lastBlockNumber: this.state.blockNumber,
                    name: this.state.name,
                    citiesIds: this.state.citiesIds,
                    minAverageMark: this.state.minAverageMark,
                    monumentTypes: this.state.monumentTypes,
                    onlyFree: this.state.onlyFree,
                    sortingName: this.state.sortingName,
                    descending: this.state.descending
                })
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data == null) {
                        this.setState({
                            monuments: [],
                            isLoading: false
                        })
                    }
                    else {
                        this.setState({
                            blockNumber: data.blockNumber,
                            allBlocks: data.allBlocks
                        })
                        if (data.monuments == null || data.monuments.length <= 0) {
                            this.setState({
                                isLoading: false
                            })
                        }
                        else {
                            this.setState({
                                monuments: this.state.monuments.concat(data.monuments),
                                isLoading: false
                            })
                        }
                    }
                })
        }
    }

    onScroll() {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            this.getMonumentsBlock();
        }
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value
        });

        if (name === "sort") {
            if (value === "nameAsc") {
                this.setState({
                    sortingName: "name",
                    descending: false
                })
            }
            else if (value === "nameDesc") {
                this.setState({
                    sortingName: "name",
                    descending: true
                })
            }
            else if (value === "markAsc") {
                this.setState({
                    sortingName: "averagemark",
                    descending: false
                })
            }
            else if (value === "markDesc") {
                this.setState({
                    sortingName: "averagemark",
                    descending: true
                })
            }
            else if (value === "cityAsc") {
                this.setState({
                    sortingName: "city",
                    descending: false
                })
            }
            else if (value === "cityDesc") {
                this.setState({
                    sortingName: "city",
                    descending: true
                })
            }
            else {
                this.setState({
                    sortingName: "",
                    descending: false
                })
            }
        }
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

    getMonumentsWithfilter() {

        this.setState({
            blockNumber: -1,
            allBlocks: 1,
            monuments: []
        },
            this.getMonumentsBlock
        )
    }

    displayDetails(id) {
        this.props.history.push("monumentdetails", id)
    }

    getIcon(type) {
        let typeName = "";
        let icon = null;
        this.state.types.map(t => {
            if (t.value === type) {
                typeName = t.label
            }
        })

        //0 - Cmentarz,
        //1 - Kościół,
        //2 - Muzeum,
        //3 - Pałac,
        //4 - Park,
        //5 - Pomnik,
        //6 - Rynek,
        //7 - Zamek,
        //8 - Inny

        switch (type) {
            case 0:
                icon = faCross;
                break;
            case 1:
                icon = faChurch;
                break;
            case 2:
                icon = faLandmark;
                break;
            case 3:
                icon = faPlaceOfWorship;
                break;
            case 4:
                icon = faTree;
                break;
            case 5:
                icon = faMonument;
                break;
            case 6:
                icon = faStore;
                break;
            case 7:
                icon = faFortAwesome;
                break;
            case 8:
                icon = faHome;
                break;
        }

        return <div>
            <ReactTooltip place="left" />
            <FontAwesomeIcon icon={icon} data-tip={typeName} />
        </div>
    }

    isAccordionOpen = () => {
        this.setState({
            isFilterOpen: !this.state.isFilterOpen
        })
    }


    render() {
        return (
            <div className="center-content" style={{ marginTop: "70px" }}>
                <div style={{ margin: "0 10px" }}>
                    {this.state.isAuthenticated &&
                        <div style={{ float: "right", width: "60px", }}>
                            <div style={{ marginLeft: "1px" }}>
                                <Link to="/addmonument">
                                    <div style={{ marginTop: "-3px" }}>
                                        <FontAwesomeIcon icon={faPlusSquare} data-tip="Dodaj zabytek" color="#2b2b2b" style={{ width: "57px", height: "57px" }} />
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
                                                    <div className="filter-column">
                                                        <div>
                                                            <label>Sortuj</label>
                                                        </div>
                                                        <div>
                                                            <select className="select-style" id="selectSort" name="sort" onChange={this.handleChange}>
                                                                <option value="none">Bez sortowania</option>
                                                                <option value="nameAsc">Po nazwie rosnąco</option>
                                                                <option value="nameDesc">Po nazwie malejąco</option>
                                                                <option value="markAsc">Po ocenie rosnąco</option>
                                                                <option value="markDesc">Po ocenie malejąco</option>
                                                                <option value="cityAsc">Po nazwie miejscowości rosnąco</option>
                                                                <option value="cityDesc">Po nazwie miejscowości malejąco</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-md-4">
                                                    <div className="filter-column-checkbox">
                                                        <label className="margin-top-45 checkbox-container">Tylko bezpłatne zabytki
                                                            <input type="checkbox" name="onlyFree" onClick={this.checkboxChange} />
                                                            <span className="checkmark"></span>
                                                        </label>
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
                    <div style={{ clear: "both" }}>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div>

                        </div>
                    </div>
                    <div className="row">
                        {this.state.monuments.map((monument, index) => {
                            return (
                                <div key={index} className="col-sm-6 col-md-4 col-lg-3">
                                    <a>
                                        <div className="thecard" style={{ height: "430px" }} onClick={() => this.displayDetails(monument.id)}>
                                            <div className="card-img">
                                                <img className="card-img-top" src={"data:image/jpeg;base64," + monument.mainPhoto} alt="Card image cap" style={{ height: "100%" }} />
                                            </div>
                                            <div className="card-caption" style={{ position: "relative" }}>
                                                <div style={{ width: "100%" }}>
                                                    <div className="monument-header">{monument.name}</div>
                                                </div>
                                                <span className="date">{monument.city.name}</span>

                                                <div style={{ display: "flex", alignContent: "center" }}>
                                                    <div>Średnia ocen: </div>

                                                    <div data-tip={monument.averageMark} style={{ marginTop: "-5px", marginLeft: "5px" }}>
                                                        <StarRatings
                                                            rating={monument.averageMark}
                                                            starRatedColor="#bfbf00"
                                                            starDimension="19px"
                                                            starSpacing="2px"
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ position: "absolute", right: 0, bottom: 0, width: "30px", height: "30px" }}>
                                                    {this.getIcon(monument.monumentType)}
                                                </div>
                                            </div>
                                            <div className="card-outmore" style={{ bottom: 0 }}>
                                                <h5 style={{ fontSize: "16px", marginTop: "9px" }}>Szczegóły zabytku</h5>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {this.state.blockNumber + 1 < this.state.allBlocks && <ReactLoading type={"spinningBubbles"} color={"#2b2b2b"} height={50} width={50} />}
                </div>
            </div>
        )
    }
}

export default MonumentsList;