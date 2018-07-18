import React from 'react';
import ReactDOM from 'react-dom';

class Navigation extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-light">
                <a className="navbar-brand" href="#">PERFI</a>
                <div className="navbar-nav">
                    <a className="nav-item nav-link" href="entry">Bookkeeping</a>
                    <a className="nav-item nav-link" href="import">Import</a>
                    <a className="nav-item nav-link" href="account">Account</a>
                </div>
            </nav>
        );
    }
}

const nav = document.getElementById('navigation');
if (nav) {
    ReactDOM.render(<Navigation />, nav);
}
