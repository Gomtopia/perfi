import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSuccess: false,
            error: null
        }
        this.username = React.createRef();
        this.password = React.createRef();
        this.signUp = this.signUp.bind(this);
    }

    signUp(event) {
        fetch('/api/user/',
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  credentials: 'same-origin',
                  body: JSON.stringify({
                      username: this.username.current.value,
                      password: this.password.current.value
                  })
              })
            .then(
                res => {
                    if (res.status === 200) this.setState({isSuccess: true})
                    else {
                        res.json().then(json => this.setState({error: json.error}))
                    }
                },
                error => console.log('An error occurred.', error)
            )
    }

    render() {
        if (this.props.loggedIn) return (<Redirect to='/' />)
        if (this.state.isSuccess) return (<Redirect to='/login' />)

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
                        {this.state.error && <div className="text-danger m-2">{this.state.error}</div>}
                        <div>
                            <button type="button" className="btn btn-primary m-3" onClick={this.signUp}>Sign Up</button>
                        </div>
                        <Link to="/login">Log in instead?</Link>
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

export default connect(mapStateToProps, null)(SignUpForm)
