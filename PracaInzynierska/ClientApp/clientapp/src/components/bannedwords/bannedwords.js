import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faWindowClose, faCaretSquareLeft, faCaretSquareRight } from "@fortawesome/free-solid-svg-icons";
import Accordion from 'react-bootstrap/Accordion';
import Card from "react-bootstrap/Card";

import './bannedwords.css'

class BannedWords extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            newWord: "",
            oldPasswordError: 0,
            newWordError: false,
            isSubmitting: false,

            word: "",
            descending: false,
            words: [],
            page: 1,
            allPages: 0,

            isFilterOpen: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filter = this.filter.bind(this);
        this.getWords = this.getWords.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentDidMount() {
        this.getWords();
    }



    async getWords() {
        this.setState({
            words: []
        })
        if (this.state.page === "")
            return;
        await fetch("https://localhost:44357/api/bannedword/getbannedwords?renderPageNumber=" + this.state.page + "&name=" + this.state.word + "&descending=" + this.state.descending)
            .then(response => response.json())
            .then(data => {
                if (data == null || data.bannedWords == null) {
                    this.setState({
                        words: []
                    })
                }
                else {
                    this.setState({
                        words: data.bannedWords,
                        page: data.pageNumber,
                        allPages: data.allPages
                    })
                }
            })
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;


        if (name === "page") {
            if (value < 1 || value > this.state.allPages) {
                return;
            }
        }

        this.setState({
            [name]: value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.state.newWord !== "") {
            this.setState({
                isSubmitting: true
            })
            let response = await fetch("https://localhost:44357/api/bannedword/addbannedword", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    word: this.state.newWord
                })
            });

            if (response.status === 200) {

                this.setState({
                    newWord: "",
                    newWordError: false,
                    isSubmitting: false
                });
                this.getWords();
                alert("Dodano słowo " + this.state.newWord)
            } else if (response.status === 401) {
                this.setState({
                    newWordError: true,
                    isSubmitting: false
                });
            }
        }

        else {
            this.setState({
                isSubmitting: false
            })
        }
    }

    async handleDelete(word) {
        let response = await fetch("https://localhost:44357/api/bannedword/deletebannedword", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                word: word
            })
        });
        if (response.status === 200) {
            this.setState({
                newWordError: false,
                isSubmitting: false
            });
            this.getWords();
            alert("Usunięto słowo: " + word)
        }
    }

    renderTableData() {
        return this.state.words.map((item, index) => {
            return (
                <tr key={index} style={{ borderBottom: "1px solid #4e4e4e" }}>
                    <td className="ellpsis">
                        <span style={{ marginLeft: "10px" }}>
                            {item.word}
                        </span>
                    </td>
                    <td style={{ width: "50px" }}>
                        <div onClick={() => this.handleDelete(item.word)} style={{ float: "left", cursor: "pointer", height: "35px" }}>
                            <FontAwesomeIcon icon={faWindowClose} style={{ width: "35px", height: "35px" }} />
                        </div>
                    </td>
                </tr>
            )
        })
    }

    async filter() {
        this.setState({
            page: 1
        }, this.getWords);

    }

    changePage(page) {
        this.setState({
            page: page
        }, this.getWords)
    }

    isAccordionOpen = () => {
        this.setState({
            isFilterOpen: !this.state.isFilterOpen
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div style={{ margin: "5px" }}>
                        <div className="add-word-input-container">
                            <input
                                type="text"
                                id="newWord"
                                className="zero-raduis form-control"
                                name="newWord"
                                placeholder="Zbanowane słowo"
                                onChange={this.handleChange}
                                value={this.state.newWord} />
                        </div>
                        <div className="add-word-button-container">
                            <div style={{ marginLeft: "15px" }}>
                                <input disabled={this.state.isSubmitting} type="submit" className="button add-word zero-raduis" style={{ width: "100%" }} value="DODAJ" />
                            </div>
                        </div>
                        <div style={{ clear: "both", marginBottom: "30px" }}>
                            {this.state.newWordError && <label className="error-message">Słowo już jest zbanowane</label>}
                        </div>
                    </div>
                </form>
                <div style={{ margin: "0 5px 20px 5px" }}>
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
                                                            <label>Szukaj słowo</label>
                                                        </div>
                                                        <div>
                                                            <input className="form-control" type="text" name="word" value={this.state.word} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="filter-column">
                                                        <div>
                                                            <label>Sortuj:</label>
                                                        </div>
                                                        <div>
                                                            <select id="selectSort" name="descending" onChange={this.handleChange}>
                                                                <option value="false">Rosnąco</option>
                                                                <option value="true">Malejąco</option>
                                                            </select>
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
                </div>
                <div style={{ margin: "0 5px" }}>
                    {this.state.words == null || this.state.words.length <= 0 ?
                        <div>Nie dodano jesszce żadnego słowa</div>
                        :
                        <table className="banned-words-table">
                            <tbody>
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    }
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
                                <input type="number" className="page-input" name="page" value={this.state.page} onChange={this.handleChange} onBlur={this.getWords} />
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

export default BannedWords;