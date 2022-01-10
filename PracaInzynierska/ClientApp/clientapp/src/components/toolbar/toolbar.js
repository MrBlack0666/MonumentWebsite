import React from 'react';
import DrawerButton from '../sidedrawer/drawerbutton';
import { Link, withRouter } from 'react-router-dom'

import './toolbar.css';

const toolbar = withRouter(({ history, ...props }) => (
    <header className="toolbar fixed-top">
        <nav className="toolbar-nav">
            <div className="toolbar-button">
                <DrawerButton click={props.drawerClick} />
            </div>
            <div className="toolbar-logo"><Link to="/">Zabytki Info</Link></div>
            <div className="toolbar-nav-items">
                <ul>
                    <li><Link to="/monumentslist">Lista zabytków</Link></li>
                    <li><Link to="/monumentsmap">Mapa zabytków</Link></li>
                    <li><Link to="/tripslist">Wycieczki</Link></li>
                </ul>
            </div>
            <div className="spacer"></div>
            <div className="toolbar-nav-items">
                <ul>
                    {props.isAuthenticated ?
                    <>
                        <li><Link to="/account">Profil</Link></li>
                        <li><Link to="/" className="logout" style={{cursor: "pointer"}}
                            onClick={() => {
                                props.logOut();
                                history.push('/');
                                    console.log(history);
                                    
                            }}>
                                Wyloguj</Link></li>
                    </>
                        :
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Rejestracja</Link></li>
                    </>}
                    
                </ul>
            </div>
        </nav>
    </header>
));

export default toolbar;