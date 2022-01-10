import React from 'react'
import logo from '../../images/zabytki_info_logo.jpg'
import monuments_list from '../../images/lista_zabytkow.jpg'
import monuments_map from '../../images/mapa_zabytkow.jpg'
import trips from '../../images/wycieczki.jpg'
import { Link, withRouter } from 'react-router-dom'

import './home.css'
import accountService from '../../services/accountService';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            isAuthenticated: accountService.isAuthenticated()
        }
    }

    goToMonumentsList() {
        this.props.history.push("monumentslist")
    }

    goToMonumentsMap() {
        this.props.history.push("monumentsmap")
    }

    goToTripsList() {
        this.props.history.push("tripslist")
    }

    render(){
        return (
            <div className="center-content" style={{marginTop: "70px"}}>
                <div className="container-fluid">
                    <div className="row">
                        <div className=" col-sm-5 col-md-4">
                            <img className="card-img-top" src={logo} alt="Logo" style={{ maxHeight: "300px", maxWidth: "300px" }}/>
                        </div>
                        <div className="col-sm-7 col-md-8">
                            <div>
                                <span style={{fontSize: "20px", fontWeight: "bold"}}>Witamy na stronie Zabytki Info</span>
                            </div>
                            <div>
                                <span>Stona poświęcona jest zabytkom i atrakcjom turystycznym znajdującym się na terenie Polski. Baza zabytków tworzona jest przez administratorów oraz 
                                    <span style={{fontWeight: "bold"}}> użytkowników</span>. Na stronie znajduje się lista oraz mapa zabytków. Użytkownicy mogą także tworzyć przeróżne trasy wycieczek.
                                </span>
                            </div>
                            {!accountService.isAuthenticated() && <div>
                                <span>Pomóż nam w tworzeniu bazy zabytków. <Link to="/login" className="width-none">Zaloguj się</Link> bądź <Link to="/register" className="width-none">zarejestruj</Link>.</span>
                            </div>}
                        </div>
                    </div>
                    <hr style={{border: "1px solid rgba(0, 0, 0, 0.6)"}}/>
                    <div className="row">
                        <div className="col-sm-7 col-md-8">
                            <div>
                                <span style={{fontSize: "20px", fontWeight: "bold"}}>Lista zabytków</span>
                            </div>
                            <div>
                                <span>Możemy tutaj znaleźć przeróżne zabytki. Strona zapewnia także różne możliwości filtrowania takie jak: po nazwie, ocenie, miejscowości, typie zabytku, oraz bezpłatnych zabytkach. Dodatkowo możemy samemu dodawać zabytki do bazy. Jednakże nasz zabytek musi byc zweryfikowany przez administratora.</span>
                            </div>
                        </div>
                        <div className="col-sm-5 col-md-4">
                            <div className="image-container" onClick={() => this.goToMonumentsList()}>
                                <img className="card-img-top" src={monuments_list} alt="Lista zabytków" style={{ display: "block", width: "250px", height: "200px"}}/>
                                <div className="image-overlay">
                                    <div className="image-overlay-text">Lista zabytków</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr style={{border: "1px solid rgba(0, 0, 0, 0.6)"}}/>
                    <div className="row">
                        <div className="col-sm-7 col-md-8">
                            <div>
                                <span style={{fontSize: "20px", fontWeight: "bold"}}>Mapa zabytków</span>
                            </div>
                            <div>
                                <span>Mapa zawiera lokalizację wszystkich zabytków znajdujących się w bazie oraz zwieryfikowanych przez administratora. Mamy możliwość filtrowania zabytków w taki sam sposób jak w liście zabytków. Po naciśnięciu na znacznik wyskoczy nam okienko z krótką informacją o danym zabytku. By przejść do szczegółów zabytku wystarczy nacisnąć na okienko.</span>
                            </div>
                        </div>
                        <div className="col-sm-5 col-md-4">
                            <div className="image-container" onClick={() => this.goToMonumentsMap()}>
                                <img className="card-img-top" src={monuments_map} alt="Mapa zabytków" style={{ display: "block", width: "250px", height: "200px"}}/>
                                <div className="image-overlay">
                                    <div className="image-overlay-text">Mapa zabytków</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr style={{border: "1px solid rgba(0, 0, 0, 0.6)"}}/>
                    <div className="row">
                        <div className="col-sm-7 col-md-8">
                            <div>
                                <span style={{fontSize: "20px", fontWeight: "bold"}}>Wycieczki</span>
                            </div>
                            <div>
                                <span>Strona ta zawiera trasy wycieczek dodane przez użytkowników.</span>
                            </div>
                        </div>
                        <div className="col-sm-5 col-md-4">
                            <div className="image-container" onClick={() => this.goToTripsList()}>
                                <img className="card-img-top" src={trips} alt="Wycieczki" style={{ display: "block", width: "250px", height: "200px"}}/>
                                <div className="image-overlay">
                                    <div className="image-overlay-text">Wycieczki</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr style={{border: "1px solid rgba(0, 0, 0, 0.6)"}}/>
                    <div style={{width: "50%", maxWidth: "500px", margin: "0px auto 50px auto"}}>
                        <div style={{fontSize: "20px", fontWeight: "bold"}}><label>Kontakt</label></div>
                        <div><label style={{fontWeight: "bold"}}>Email:</label> admin.adminowski@ad.min</div>
                        <div><label style={{fontWeight: "bold"}}>Telefon:</label> 123456789</div>
                        <div><label style={{fontWeight: "bold"}}>Placówka:</label> ul. Nieznanego Człowieka 99, Nieznane Miasto</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;