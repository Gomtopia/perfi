import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {login, clearData} from '../actions/user';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.username = React.createRef();
        this.password = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.clearData();
    }

    handleSubmit(event) {
        this.props.login(this.username.current.value, this.password.current.value)
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: "/" } };

        if (this.props.loggedIn) return (<Redirect to={from} />)

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
                        {this.props.error && <div className="text-danger m-2">{this.props.error}</div>}
                        <div>
                            <button type="button" className="btn btn-primary m-3" onClick={this.handleSubmit}>Log In</button>
                        </div>
                        <Link to="/signup">Sign up instead?</Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.user.isAuthenticated,
        error: state.user.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => dispatch(login(username, password)),
        clearData: () => dispatch(clearData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
