import React from 'react'

import AccountService from '../../services/accountService'

import './changepassword.css'

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            userName: AccountService.getUserName(),
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            oldPasswordError: 0,
            newPasswordError: false,
            confirmPasswordError: false,
            isSubmitting: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();


        if (this.state.oldPassword !== "" && this.state.newPassword !== "" && this.state.confirmPassword !== "" &&
            this.state.confirmPassword === this.state.newPassword) {
            this.setState({
                isSubmitting: true
            })
            let response = await fetch("https://localhost:44357/api/auth/changepassword", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: this.state.userName,
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword,
                })
            });

            if (response.status === 200) {
                this.setState({
                    isSubmitting: false
                });
            } else if (response.status === 401) {
                this.setState({
                    oldPasswordError: 2,
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

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value
        });

        if (name === "newPassword") {
            if (value.length < 5 && value.length > 0) {
                this.state.newPasswordError = true;
            }
            else {
                this.state.newPasswordError = false;
            }
        }
        else if (name === "confirmPassword") {
            if (this.state.newPassword != value && value.length > 0) {
                this.state.confirmPasswordError = true;
            }
            else {
                this.state.confirmPasswordError = false;
            }
        }
        else if (name === "oldPassword") {
            if (value.length > 0) {
                this.state.oldPasswordError = 0;
            }
            else {
                this.state.oldPasswordError = 1;
            }
        }
    }

    render() {
        let oldPasswordMessage = "";
        if (this.state.oldPasswordError === 1) {
            oldPasswordMessage = "Obecne hasło nie może być puste"
        }
        else if (this.state.oldPasswordError === 2) {
            oldPasswordMessage = "Złe obecene hasło"
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div style={{marginBottom: "10px"}}>
                        <div className="margin-left-5">
                            <label className="label-input">Obecne hasło</label>
                        </div>
                        <div style={{margin: "5px"}}>
                            <input
                                type="password"
                                id="oldPassword"
                                className="zero-raduis form-control"
                                name="oldPassword"
                                style={{width: "100%", textAlign: "left", margin: 0}}
                                onChange={this.handleChange}
                                value={this.state.oldPassword} />
                        </div>
                        <div className="margin-left-5">
                            {this.state.oldPasswordError > 0 && <label className="error-message">{oldPasswordMessage}</label>}
                        </div>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <div className="margin-left-5">
                            <label className="label-input">Nowe hasło</label>
                        </div>
                        <div style={{margin: "5px"}}>
                            <input
                                type="password"
                                id="newPassword"
                                className="zero-raduis form-control"
                                name="newPassword"
                                style={{width: "100%", textAlign: "left", margin: 0}}
                                onChange={this.handleChange}
                                value={this.state.newPassword} />
                        </div>
                        <div className="margin-left-5">
                            {this.state.newPasswordError && <label className="error-message">Hasło powinno mieć co najmniej 5 znaków</label>}
                        </div>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <div className="margin-left-5">
                            <label className="label-input">Potwierdzone nowe hasło</label>
                        </div>
                        <div style={{margin: "5px"}}>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="zero-raduis form-control"
                                name="confirmPassword"
                                style={{width: "100%", textAlign: "left", margin: 0}}
                                onChange={this.handleChange}
                                value={this.state.confirmPassword} />
                        </div>
                        <div className="margin-left-5">
                            {this.state.confirmPasswordError && <label className="error-message">Hasła muszą być takie same</label>}
                        </div>
                    </div>
                    <div style={{margin: "0 5px"}}>
                        <input disabled={this.state.isSubmitting} type="submit" className="button button-apply-filter zero-raduis submit-button change-password-button" value="ZAKTUALIZUJ HASŁO" />
                    </div>
                </form>
            </div>
        )
    }
}

export default ChangePassword;