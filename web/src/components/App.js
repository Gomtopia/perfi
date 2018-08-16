import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Login from "./Login";
import Signup from "./Signup";
import Account from "./Account";
import Entry from "./Entry";
import ImportEntries from "./ImportEntries";
import Statistics from "./Statistics";
import {fetchUser, logout} from "../actions/user";

let PrivateRoute = ({component: Component, path, loggedIn}) => (
    <Route path={path}
           render={props => loggedIn ? (<Component />) :
                          (<Redirect to={{
                              pathname: "/login", state: { from: props.location }
                          }}/>)
           }/>
)

PrivateRoute = withRouter(connect((state) => ({loggedIn: state.user.isAuthenticated}))(PrivateRoute))

class App extends React.Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <Router>
                <div className="container">
                    <div className="navbar navbar-expand-sm navbar-light">
                        <Link className="navbar-brand" to="/">PERFI</Link>
                        <div className="navbar-nav mr-auto">
                            <Link className="nav-item nav-link" to="/statistics">Statistics</Link>
                            <Link className="nav-item nav-link" to="/entry">Bookkeeping</Link>
                            <Link className="nav-item nav-link" to="/import">Import</Link>
                            <Link className="nav-item nav-link" to="/account">Account</Link>
                        </div>
                        {this.props.loggedIn &&
                         <button type="button" className="btn btn-primary" onClick={()=>this.props.logout()}>Logout</button>
                        }
                    </div>
                    <PrivateRoute path="/statistics" component={Statistics} />
                    <PrivateRoute path="/entry" component={Entry} />
                    <PrivateRoute path="/import" component={ImportEntries} />
                    <PrivateRoute path="/account" component={Account} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                </div>
            </Router>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.user.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUser: () => dispatch(fetchUser()),
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
