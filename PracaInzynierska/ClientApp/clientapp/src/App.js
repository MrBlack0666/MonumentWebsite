import React from 'react';
import Toolbar from './components/toolbar/toolbar';
import SideDrawer from './components/sidedrawer/sidedrawer';
import Backdrop from './components/backdrop/backdrop';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/home/home';
import Login from './components/login/login';
import Register from './components/register/register';
import accountService from './services/accountService';
import Account from './components/account/account';
import MonumentsList from './components/monumentslist/monumentslist';
import AddMonument from './components/addmonument/addmonument';
import MonumentsMap from './components/monumentsmap/monumentsmap';
import MonumentDetails from './components/monumentdetails/monumentdetails'
import Gallery from './components/gallery/gallery';
import YourMarks from './components/yourmarks/yourmarks';
import TripsList from './components/tripslist/tripslist';
import AddTrip from './components/addtrip/addtrip';
import TripDetails from './components/tripdetails/tripdetails'

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sideDrawerOpen: false,
      isAuthenticated: accountService.isAuthenticated()
    }
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    accountService.logOut();
    this.setState({
      isAuthenticated: false
    })
  }

  logIn(token) {
    accountService.logIn(token);
    this.setState({
      isAuthenticated: true
    })
  }

  drawerClickHandler = () => {
    this.setState((prevState) => {
      return {sideDrawerOpen: !prevState.sideDrawerOpen};
    })
  };

  backdropClickHandler = () => {
    this.setState({sideDrawerOpen: false});
  };

  render(){
    const PrivateRoute = ({ component: Component, ...rest }) => {
      return (
        <Route {...rest} render={props => (
          accountService.isAuthenticated() ?
            <Component {...props} />
            : <Redirect to="/login" />
        )} />
      );
    };
    
    let backdrop;
    if(this.state.sideDrawerOpen)
    {
      backdrop = <Backdrop click={this.backdropClickHandler}/>
    }
    return (
      <div>
        <Router>
          <Toolbar drawerClick={this.drawerClickHandler} logOut={this.logOut} isAuthenticated={this.state.isAuthenticated} style={{position: "fixed"}}/>
          <SideDrawer show={this.state.sideDrawerOpen} close={this.backdropClickHandler} logOut={this.logOut} isAuthenticated={this.state.isAuthenticated} />
          {backdrop}
          <div style={{marginTop: "50px"}}>
          <Switch>
            <Route
              exact
              path="/"
              component={Home}/>
            <Route
              path="/register"
              render={(props) => <Register {...props} isAuthenticated={this.state.isAuthenticated} logIn={this.logIn}/>} />
            <Route
            path="/login"
            render={(props) => <Login {...props} isAuthenticated={this.state.isAuthenticated} logIn={this.logIn}/>} />
            <PrivateRoute
              path="/account"
              isAuthenticated={this.state.isAuthenticated}
              component={Account} />
            <Route
              path="/monumentslist"
              component={MonumentsList} />
            <PrivateRoute
              path="/addmonument"
              isAuthenticated={this.state.isAuthenticated}
              component={AddMonument} />
            <Route
              path="/monumentsmap"
              component={MonumentsMap} />
            <Route
              path="/monumentdetails"
              component={MonumentDetails} />
            <Route
              path="/gallery"
              component={Gallery} />
            <PrivateRoute
              path="/yourmarks"
              isAuthenticated={this.state.isAuthenticated}
              component={YourMarks} />
            <Route
              path="/tripslist"
              component={TripsList} />
            <PrivateRoute
              path="/addtrip"
              isAuthenticated={this.state.isAuthenticated}
              component={AddTrip} />
              <Route
              path="/tripdetails"
              component={TripDetails} />
          </Switch>
          </div>
        </Router>
        
      </div>
    );
  }
}


export default App;
