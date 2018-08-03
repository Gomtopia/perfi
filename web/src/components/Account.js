import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux'

import {fetchAccountList} from '../actions/account';
import {store} from '../store';

const AccountTableHeader = () => (
    <thead className='thead-bordered'>
        <tr key="header">
            <th scope='col' key='name'>Name</th>
            <th scope='col' key='type'>Type</th>
        </tr>
    </thead>
)

let AccountListTable = ({accountList}) => (
    <table className='table'>
        <AccountTableHeader />
        <tbody>
            {accountList.map((account) => (
                <tr key={account.name}>
                    <td key={account.name}>{account.name}</td>
                    <td key={account.account_type}>{account.account_type}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

class Account extends React.Component {
    componentDidMount() {
        this.props.fetchAccountList()
    }

    render() {
        return (
            <AccountListTable accountList={this.props.accountList} />
        );
    }
}

const mapStateToProps = state => {
    return {
        accountList: state.account.accountList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAccountList: () => dispatch(fetchAccountList())
    }
}

Account = connect(mapStateToProps, mapDispatchToProps)(Account)

const account = document.getElementById('account')
if (account) {
    ReactDOM.render(
        <Provider store={store}>
            <Account />
        </Provider>,
        account);
}
