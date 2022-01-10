import React from 'react';
import { Link, withRouter } from 'react-router-dom'

import './sidedrawer.css';

const sideDrawer = withRouter(({ history, ...props }) => {
    let drawerClasses = 'side-drawer';
    if(props.show)
    {
        drawerClasses = 'side-drawer open';
    }
    return (
        <nav className={drawerClasses}>
            <ul className="side-drawer-items1">
                <li><Link to="/monumentslist" onClick={() => {props.close()}}>Lista zabytków</Link></li>
                <li><Link to="/monumentsmap" onClick={() => {props.close()}}>Mapa zabytków</Link></li>
                <li><Link to="/tripslist" onClick={() => {props.close()}}>Wycieczki</Link></li>
            </ul>
            <ul className="side-drawer-items2">
                {props.isAuthenticated ?
                    <>
                        <li><Link to="/account">Profil</Link></li>
                        <li><Link to="/" style={{cursor: "pointer"}}
                            onClick={() => {
                                props.logOut();
                                history.push('/');
                                props.close();
                            }}>
                            Wyloguj</Link></li>
                    </>
                    :
                    <>
                        <li><Link to="/login" onClick={() => {props.close()}}>Login</Link></li>
                        <li><Link to="/register" onClick={() => {props.close()}}>Rejestracja</Link></li>
                    </>}
            </ul>
        </nav>
    )
})



export default sideDrawer;