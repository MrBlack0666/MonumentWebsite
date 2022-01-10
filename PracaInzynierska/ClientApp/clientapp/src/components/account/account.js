import React from 'react'
import ChangePassword from '../changepassword/changepassword';
import BannedWords from '../bannedwords/bannedwords';
import YourMarks from '../yourmarks/yourmarks';
import UnverifiedMonuments from '../unverifiedmonuments/unverifiedmonuments';
import YourUnverifiedMonuments from '../yourunverifiedmonuments/yourunverifiedmonuments';

import accountService from '../../services/accountService';

import 'bootstrap/dist/css/bootstrap.min.css';
import './account.css'
import Users from '../users/users';

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            showChangePassword: false,
            showYourMarks: !accountService.isInRole("Admin"),
            showYourUnverifiedMonuments: false,
            showBannedWords: false,
            showUnverifiedMonuments: accountService.isInRole("Admin"),
            showUsers: false
        }
        this.openChangePassword = this.openChangePassword.bind(this);
        this.openYoursComments = this.openYoursComments.bind(this);
        this.openYoursUnverifiedMonuments = this.openYoursUnverifiedMonuments.bind(this);
        this.openBannedWords = this.openBannedWords.bind(this);
        this.openUnverifiedMonuments = this.openUnverifiedMonuments.bind(this);
        this.openUsers = this.openUsers.bind(this);
    }

    openChangePassword() {
        this.setState({
            showChangePassword: true,
            showYourMarks: false,
            showYourUnverifiedMonuments: false,
            showBannedWords: false,
            showUnverifiedMonuments: false,
            showUsers: false
        })
    }

    openYoursComments() {
        this.setState({
            showChangePassword: false,
            showYourMarks: true,
            showYourUnverifiedMonuments: false,
            showBannedWords: false,
            showUnverifiedMonuments: false,
            showUsers: false
        })
    }

    openYoursUnverifiedMonuments() {
        this.setState({
            showChangePassword: false,
            showYourMarks: false,
            showYourUnverifiedMonuments: true,
            showBannedWords: false,
            showUnverifiedMonuments: false,
            showUsers: false
        })
    }

    openBannedWords() {
        this.setState({
            showChangePassword: false,
            showYourMarks: false,
            showYourUnverifiedMonuments: false,
            showBannedWords: true,
            showUnverifiedMonuments: false,
            showUsers: false
        })
    }

    openUnverifiedMonuments() {
        this.setState({
            showChangePassword: false,
            showYourMarks: false,
            showYourUnverifiedMonuments: false,
            showBannedWords: false,
            showUnverifiedMonuments: true,
            showUsers: false
        })
    }
    openUsers() {
        this.setState({
            showChangePassword: false,
            showYourMarks: false,
            showYourUnverifiedMonuments: false,
            showBannedWords: false,
            showUnverifiedMonuments: false,
            showUsers: true
        })
    }

    render() {
        return (
            <div className="center-content" style={{marginTop: "70px"}}>
                <div className="container-fluid">
                    <div className="row no-gutters">
                        {accountService.isInRole("Admin") ? 
                        <div className="col-md-3">
                            <div className="full-width">
                                <div>
                                    <button className="button-item account-button account-button-style" style={{background: this.state.showUnverifiedMonuments && "#4e4e4e"}} onClick={this.openUnverifiedMonuments}>Niezweryfikowane zabytki</button>
                                </div>
                                <div>
                                    <button className="button-item account-button account-button-style" style={{background: this.state.showYourMarks && "#4e4e4e"}} onClick={this.openYoursComments}>Zobacz swoje oceny</button>
                                </div>
                                <div >
                                    <button className="button-item account-button account-button-style" style={{background: this.state.showChangePassword && "#4e4e4e"}} onClick={this.openChangePassword}>Zmień hasło</button>
                                </div>
                                <div >
                                    <button className="button-item account-button account-button-style" style={{background: this.state.showBannedWords && "#4e4e4e"}} onClick={this.openBannedWords}>Zbanowane słowa</button>
                                </div>
                                {accountService.getUserName() === "admin" &&
                                    <div >
                                        <button className="button-item account-button account-button-style" style={{background: this.state.showUsers && "#4e4e4e"}} onClick={this.openUsers}>Użytkownicy</button>
                                    </div>
                                }
                            </div>
                        </div>
                        :
                        <div className="col-md-3">
                            <div>
                                <button className="button-item account-button account-button-style" style={{background: this.state.showYourMarks && "#4e4e4e"}} onClick={this.openYoursComments}>Zobacz swoje oceny</button>
                            </div>
                            <div>
                                <button className="button-item account-button account-button-style" style={{background: this.state.showChangePassword && "#4e4e4e"}} onClick={this.openChangePassword}>Zmień hasło</button>
                            </div>
                            <div>
                                <button className="button-item account-button account-button-style" style={{background: this.state.showYourUnverifiedMonuments && "#4e4e4e"}} onClick={this.openYoursUnverifiedMonuments}>Zobacz swoje niezweryfikowane zabytki</button>
                            </div>
                        </div>
                        }
                        <div className="col-md-9">
                            <div className="margin-content">
                                {this.state.showChangePassword && <ChangePassword />}
                                {this.state.showBannedWords && <BannedWords />}
                                {this.state.showYourMarks && <YourMarks hist={this.props.history}/>}
                                {this.state.showUnverifiedMonuments && <UnverifiedMonuments hist={this.props.history}/>}
                                {this.state.showYourUnverifiedMonuments && <YourUnverifiedMonuments hist={this.props.history}/>}
                                {this.state.showUsers && <Users />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Account;