import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faArrowAltCircleUp, faArrowAltCircleDown, faCaretSquareLeft, faCaretSquareRight } from "@fortawesome/free-solid-svg-icons";
import Accordion from 'react-bootstrap/Accordion';
import Card from "react-bootstrap/Card";

import './users.css'

import 'react-confirm-alert/src/react-confirm-alert.css'
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { string } from 'prop-types';

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            users: [],

            isSubmitting: false,

            name: "",
            page: 1,
            allPages: 0,

            isFilterOpen: false
        }

        this.changeRole = this.changeRole.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filter = this.filter.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }



    async getUsers() {
        if(this.state.page === "")
            return;
        await fetch("https://localhost:44357/api/auth/getusers", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page: this.state.page,
                    name: this.state.name
                })
            }).then(response => response.json())
                .then(data => {
                    if (data == null) {
                        this.setState({
                            page: 1,
                            allPages: 0
                        })
                    }
                    else {
                        this.setState({
                            page: data.page,
                            allPages: data.allPages
                        })
                        if (data.users == null || data.users.length <= 0) {
                            this.setState({
                                users: []
                            })
                        }
                        else {
                            this.setState({
                                users: data.users
                            })
                        }
                    }
                })        
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({
            [name]: value
        });
    }

    openChangeRole = (userName, role) => {
        confirmAlert({
            title: 'Zmień rolę',
            message: 'Czy na pewno chcesz zmienić rolę użytkownika "' + userName + '" na "' + role + '"',
            buttons: [
                {
                    label: 'Tak',
                    onClick: () => this.changeRole(userName, role)
                },
                {
                    label: 'Nie',
                }
            ]
        });
    };

    async changeRole(userName, role) {
        this.setState({
            isSubmitting: true
        })
        let response = await fetch("https://localhost:44357/api/auth/addusertorole", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userName,
                role: role
            })
        });

        if (response.status === 200) {
            this.setState({
                isSubmitting: false
            });
            this.getUsers();
            alert('Zmieniono rolę użytkownika "' + userName + '" na "' + role + '"');
        }
        else {
            alert('Coś poszło nie tak')
            this.setState({
                isSubmitting: false
            });
        }
    }

    renderTableData() {
        return this.state.users.map((item, index) => {
            return (
                <tr key={index} style={{ borderBottom: "1px solid #4e4e4e" }}>
                    <td className="ellpsis" style={{height: "38px"}}>
                        <span style={{marginLeft: "5px"}}>
                            {item.userName + " (" + item.email + ")"}
                        </span>
                    </td>
                    <td style={{width: "110px"}}>
                        {item.userName != "admin" &&
                            <div onClick={() => this.openChangeRole(item.userName, item.isAdmin ? "User" : "Admin")} style={{cursor: "pointer", height: "35px", display: "flex", alignItems: "center" }}>
                                {item.isAdmin ?
                                <>
                                    <FontAwesomeIcon color="red" icon={faArrowAltCircleDown} style={{ width: "35px", height: "35px"}} />
                                    <text style={{marginLeft: "5px", fontSize: "18px", fontWeight: "bold"}}>{item.isAdmin ? 'User' : 'Admin'}</text>
                                </>
                                :
                                <>
                                    <FontAwesomeIcon color="green" icon={faArrowAltCircleUp} style={{ width: "35px", height: "35px"}} />
                                    <text style={{marginLeft: "5px", fontSize: "18px", fontWeight: "bold"}}>{item.isAdmin ? 'User' : 'Admin'}</text>
                                </>
                                }
                                
                            </div>
                        }
                    </td>
                </tr>
            )
        })
    }
    
    changePage(page) {
        this.setState({
            page: page
        }, this.getUsers)
    }

    async filter() {
        this.setState({
            page: 1
        },
        this.getUsers);

    }

    isAccordionOpen = () => {
        this.setState({
            isFilterOpen: !this.state.isFilterOpen
        })
    }

    render() {

        return (
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
                                                <div className="col-sm-6">
                                                    <div className="filter-column form-group">
                                                        <div>
                                                            <label>Szukaj użytkownika</label>
                                                        </div>
                                                        <div>
                                                            <input className="form-control" type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    {this.state.isSubmitting ?
                                                        <button disabled className="button button-apply-filter" onClick={this.filter}>Filtruj</button>
                                                        :
                                                        <button className="button button-apply-filter" onClick={this.filter}>Filtruj</button>
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
                <div style={{marginTop: "20px"}}>
                    <table className="banned-words-table">
                        <tbody>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                    <div style={{ width: "100%", display: "flex", height: "100px", justifyContent: "center", alignItems: "center" }}>
                        <div>
                            {this.state.page == null || this.state.page <= 1 ?
                                <div id="leftButton" style={{ float: "left", cursor: "pointer", height: "50px", marginTop: "1px" }}>
                                    <FontAwesomeIcon color="#666666" icon={faCaretSquareLeft} style={{ width: "45px", height: "45px" }} />
                                </div>
                                :
                                <div id="leftButton" onClick={() => this.changePage(this.state.page - 1)} style={{ float: "left", cursor: "pointer", height: "50px", marginTop: "1px" }}>
                                    <FontAwesomeIcon icon={faCaretSquareLeft} style={{ width: "45px", height: "45px" }} />
                                </div>
                            }
                            <div style={{ float: "left", fontSize: "24px", margin: "0 10px" }}>
                                <input type="number" className="page-input" name="page" value={this.state.page} onChange={this.handleChange} onBlur={this.getUsers} />
                                <text> / </text>{this.state.allPages}
                            </div>
                            {this.state.page >= this.state.allPages ?
                                <div id="rightButton" style={{ float: "left", cursor: "pointer", height: "50px", marginTop: "1px" }}>
                                    <FontAwesomeIcon color="#666666" icon={faCaretSquareRight} style={{ width: "45px", height: "45px" }} />
                                </div>
                                :
                                <div id="rightButton" onClick={() => this.changePage(this.state.page + 1)} style={{ float: "left", cursor: "pointer", height: "50px", marginTop: "1px" }}>
                                    <FontAwesomeIcon icon={faCaretSquareRight} style={{ width: "45px", height: "45px" }} />
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Users;