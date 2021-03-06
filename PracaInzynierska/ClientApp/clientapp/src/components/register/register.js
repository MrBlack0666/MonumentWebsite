import React from 'react'
import { Redirect } from 'react-router-dom'

import './register.css'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            userNameError: 0,
            emailError: 0,
            passwordError: false,
            confirmPasswordError: false,
            shouldRedirect: false,
            enableButton: false,
            isSubmitting: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({
            [name]: value
        });

        if(name === "password") {
            if(value.length < 5 && value.length > 0) {
                this.state.passwordError = true;
            }
            else {
                this.state.passwordError = false;
            }
        }
        else if(name === "confirmPassword") {
            if(this.state.password != value && value.length > 0) {
                this.state.confirmPasswordError = true;
            }
            else {
                this.state.confirmPasswordError = false;
            }
        }
        else if(name === "userName") {
            let temp = value;
            temp = temp.toLowerCase();
            if(temp.indexOf("admin") != -1)
            {
                this.state.userNameError = 3;
            }
            else {
                if(value.length < 5) {
                    this.state.userNameError = 1;
                }
                else {
                    this.state.userNameError = 0;
                }
            }
        }
    }

    async handleSubmit(event){
        event.preventDefault();
        
        if(this.state.userName.length >= 5 && this.state.email !== "" &&
            this.state.password != "" && this.state.confirmPassword !== "" &&
            this.state.password === this.state.confirmPassword) {

            this.setState({
                isSubmitting: true
            });


            let error = true;

            let response = await fetch("https://localhost:44357/api/auth/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: this.state.userName,
                    email: this.state.email,
                    password: this.state.password
                })
            }).then(resp => resp.json())
            .then(data => {
                if(data === 1) {
                    error = false;
                    alert("Konto zosta??o pomy??lnie utworzone");
                }
                else if(data === 0) {
                    alert("Co?? posz??o nie tak");
                    this.setState({
                        isSubmitting: false
                    });
                }
                else {
                    this.setState({
                        isSubmitting: false,
                        userNameError: (data === -1 || data === -3) ? 2 : 0,
                        emailError: (data < -1) ? 2 : 0
                    })
                }
            })


            if(error === false) {
                    let response2 = await fetch("https://localhost:44357/api/auth/login", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userName: this.state.userName,
                        password: this.state.password
                    })
                });

                if (response2.status === 200) {
                    let token = await response2.text();
                    this.props.logIn(token);
                    this.setState({
                        shouldRedirect: true
                    });
                }
                else {
                    alert('Dodano konto, lecz nast??pi?? problem z zalogowaniem si??.')
                    this.setState({
                        isSubmitting: true
                    });
                }
            }
        }
    }

    render() {
        let userNameMessage = "";
        let emailMessage = "";
        if(this.state.userNameError === 1) {
            userNameMessage = "Nazwa uzytkownika musi zawiera?? co najmniej 5 znak??w";
        }
        else if(this.state.userNameError === 2) {
            userNameMessage = "U??ytkownik o takiej nazwie ju?? istnieje"
        }
        else if(this.state.userNameError === 3) {
            userNameMessage = "Nazwa u??ytkownika zawiera niedozwolon?? fraz??"
        }
        else {
            userNameMessage = "";
        }

        if(this.state.emailError === 1) {
            emailMessage = "Nieprawid??owy adres e-mail";
        }
        else if(this.state.emailError === 2) {
            emailMessage = "U??ytkownik o takim e-mailu ju?? istnieje"
        }
        else {
            emailMessage = "";
        }

        return (
            <>
                {!this.state.shouldRedirect ?
                    <>
                        {this.props.isAuthenticated ?
                            <div style={{ marginTop: "70px", fontSize: "32px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>Ju?? jeste?? zalogowany</div>
                            :
                            <div className="wrapper zero-raduis" >
                                <div id="formContent">
                                    <div>
                                        <h2 className="my-4" style={{color: "black", fontWeight: "500"}}>REJESTRACJA</h2>
                                    </div>
                                    <form onSubmit={this.handleSubmit}>
                                        <input
                                            type="userName"
                                            id="userName"
                                            className="zero-raduis"
                                            name="userName"
                                            placeholder="Nazwa u??ytkownika"
                                            onChange={this.handleChange}
                                            value={this.state.userName} />
                                        <label className="error-message">{userNameMessage}</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="zero-raduis"
                                            name="email"
                                            placeholder="Email: nazwa@poczta.pl"
                                            onChange={this.handleChange}
                                            value={this.state.email} />
                                            <label className="error-message">{emailMessage}</label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="zero-raduis"
                                            name="password"
                                            placeholder="Has??o"
                                            onChange={this.handleChange}
                                            value={this.state.password} />
                                        {this.state.passwordError && <label className="error-message">Has??o musi zawiera?? co najmniej 5 znak??w</label>}
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            className="zero-raduis"
                                            name="confirmPassword"
                                            placeholder="Potwierd?? has??o"
                                            style={{marginBottom: "20px"}}
                                            onChange={this.handleChange}
                                            value={this.state.confirmPassword} />
                                        {this.state.confirmPasswordError && <label className="error-message">Has??a musz?? by?? takie same</label>}
                                        <input disabled={this.state.isSubmitting} type="submit" className="button button-apply-filter zero-raduis" style={{width: "85%!important", padding: "15px", marginTop: "20px"}} value="STW??RZ KONTO" />
                                    </form>
                                </div>
                            </div>
                        }
                    </>
                    : <Redirect to="/"></Redirect>
                }
            </>
        )
    }
}

export default Register;