import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import Account from "./Account";
import Entry from "./Entry";
import ImportEntries from "./ImportEntries";
import Statistics from "./Statistics";

const App = () => (
    <Router>
        <div className="container">
            <div className="navbar navbar-expand-sm navbar-light">
                <a className="navbar-brand" href="#">PERFI</a>
                <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="/statistics">Statistics</Link>
                    <Link className="nav-item nav-link" to="/entry">Bookkeeping</Link>
                    <Link className="nav-item nav-link" to="/import">Import</Link>
                    <Link className="nav-item nav-link" to="/account">Account</Link>
                </div>

            </div>
            <Route path="/statistics" component={Statistics} />
            <Route path="/entry" component={Entry} />
            <Route path="/import" component={ImportEntries} />
            <Route path="/account" component={Account} />
        </div>
    </Router>
)

export default App
