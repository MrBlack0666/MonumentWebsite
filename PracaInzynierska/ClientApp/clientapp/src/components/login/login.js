import React from 'react'
import { Redirect } from 'react-router-dom'

import './login.css'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            userName: "",
            password: "",
            userNameOrPasswordError: 0,
            isSubmitting: false,
            shouldRedirect: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.userName !== "" && this.state.password !== "") {
            this.setState({
                isSubmitting: true
            })
            let response = await fetch("https://localhost:44357/api/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: this.state.userName,
                    password: this.state.password
                })
            });

            if (response.status === 200) {
                let token = await response.text();
                this.props.logIn(token);
                this.setState({
                    shouldRedirect: true
                });
            }
            else {
                if (response.status === 401) {
                    this.setState({
                        userNameOrPasswordError: 2,
                    });

                }
                else {
                    alert("Coś poszło nie tak po stronie serwera")
                }

                this.setState({
                    isSubmitting: false
                });
            }
        } else {
            this.setState({
                userNameOrPasswordError: 1,
                isSubmitting: false
            })
        }
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    render() {
        let errorMessage = "";
        if (this.state.userNameOrPasswordError === 1) {
            errorMessage = "Nazwa użytkownika i hasło nie mogą być puste";
        }
        else if (this.state.userNameOrPasswordError === 2) {
            errorMessage = "Zła nazwa użytkownika bądź hasło"
        }
        else {
            errorMessage = "";
        }
        let redirectTo = this.props.location.state !== undefined ? this.props.location.state.from : "/"
        return (
            <>
                {!this.state.shouldRedirect ?
                    <>
                        {this.props.isAuthenticated ?
                            <div style={{ marginTop: "70px", fontSize: "32px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>Już jesteś zalogowany</div>
                            :
                            <div className="wrapper zero-raduis">
                                <div id="formContent">
                                    <div>
                                        <h2 className="my-4" style={{color: "black", fontWeight: "500"}}>LOGOWANIE</h2>
                                    </div>
                                    <form onSubmit={this.handleSubmit}>
                                        <input
                                            type="userName"
                                            id="userName"
                                            className="zero-raduis"
                                            name="userName"
                                            placeholder="Nazwa użytkownika"
                                            onChange={this.handleChange}
                                            value={this.state.userName} />
                                        <input
                                            type="password"
                                            id="password"
                                            className="zero-raduis"
                                            name="password"
                                            placeholder="Hasło"
                                            onChange={this.handleChange}
                                            value={this.state.password} />
                                        <label className="error-message">{errorMessage}</label>
                                        <input disabled={this.state.isSubmitting} type="submit" className="button button-apply-filter zero-raduis" style={{width: "85%!important", padding: "15px", marginTop: "20px"}} value="ZALOGUJ SIĘ" />
                                    </form>
                                </div>
                            </div>
                        }
                    </>

                    : <Redirect to={redirectTo} />
                }
            </>
        )
    }
}

export default Login;