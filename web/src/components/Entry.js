import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux'

import {fetchAccountList} from '../actions/account';
import {addEntry, fetchEntryList} from '../actions/entry';
import {store} from '../store';
import EntryListHeader from './EntryListHeader';
import EntryListTable from './EntryListTable';
import EditableEntry from './EditableEntry';

class RootComponent extends React.Component {
    componentDidMount() {
        this.props.fetchEntryList();
        this.props.fetchAccountList();
    }

    render() {
        const accountOptions = this.props.accounts.map((account) => <option key={account.name}>{account.name}</option>);
        const entry = {}, inputRefs = {};

        return (
            <div>
                <form onSubmit={e => {
                        e.preventDefault();
                        this.props.addEntry({
                            date: inputRefs.date.value,
                            description: inputRefs.description.value.trim(),
                            debit: inputRefs.debit.value,
                            credit: inputRefs.credit.value,
                            amount: inputRefs.amount.value
                        });
                        inputRefs.date.value = inputRefs.description.value = inputRefs.debit.value = inputRefs.credit.value = inputRefs.amount.value = "";
                }}>
                    <table className='table mt-3'>
                        <EntryListHeader />
                        <tbody>
                            <EditableEntry
                                entry={entry}
                                accounts={this.props.accounts}
                                inputRefs={inputRefs} />
                        </tbody>
                    </table>
                    <div className='text-center'>
                        <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
                </form>

                <EntryListTable
                    entries={this.props.entries}
                    accounts={this.props.accounts}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.account.accountList,
        entries: state.entry.entries
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAccountList: () => dispatch(fetchAccountList()),
        fetchEntryList: () => dispatch(fetchEntryList()),
        addEntry: (entry) => dispatch(addEntry(entry)),
    }
}

RootComponent = connect(mapStateToProps, mapDispatchToProps)(RootComponent)

const entry = document.getElementById('entry')
if (entry) {
    ReactDOM.render(
        <Provider store={store}>
            <RootComponent />
        </Provider>,
        entry);
}
