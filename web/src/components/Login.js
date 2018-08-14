import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import {login} from '../actions/user';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.username = React.createRef();
        this.password = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.login(this.username.current.value, this.password.current.value)
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: "/" } };

        if (this.props.loggedIn) return <Redirect to={from} />

        return (
            <div className="row justify-content-center">
                <div className="col-4">
                    <label className="col-form-label">Username</label>
                    <div>
                        <input type="text" className="form-control" name="username" ref={this.username} required/>
                    </div>
                    <label className="col-form-label">Password</label>
                    <div>
                        <input type="password" className="form-control" name="password" ref={this.password} required/>
                    </div>
                    <div className="text-center">
                        <button type="button" className="btn btn-primary m-3" onClick={this.handleSubmit}>Login</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.user.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => dispatch(login(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
