import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux'

import EntryListHeader from './EntryListHeader';
import SplittableEntry from './SplittableEntry';
import UploadFile from './UploadFile';
import {fetchAccountList} from '../actions/account';
import {getDraftFromFile} from '../actions/draft';
import {addEntry} from '../actions/entry';
import {store} from '../store';

const UpdateEntryList = ({accounts, entries, addEntry}) => {
    const totalRefsList = [];
    const body = Object.keys(entries).map((id) => {
        const entry = entries[id];
        let inputRefsList;
        if (entry.isSpliting) {
            inputRefsList = [];
            entry.subEntries.map(() => inputRefsList.push({}));
        } else {
            inputRefsList = [{}];
        }
        inputRefsList.map((refs) => totalRefsList.push(refs));

        return <SplittableEntry
                   key={entry.id}
                   entry={entry}
                   accounts={accounts}
                   inputRefsList={inputRefsList} />
    });

    return (
        <form onSubmit={(e) => {
                e.preventDefault();
                totalRefsList.map((refs) => {
                    addEntry({
                        date: refs.date.value,
                        description: refs.description.value.trim(),
                        debit: refs.debit.value,
                        credit: refs.credit.value,
                        amount: refs.amount.value
                    })
                })
        }}>
            <table className='table mt-3'>
                <EntryListHeader />
                <tbody>
                    {body}
                </tbody>
            </table>
            <div className='text-center'>
                <button type='submit' className='btn btn-primary'>Submit</button>
            </div>
        </form>
    );
}

class ImportEntries extends React.Component {
    componentDidMount() {
        this.props.fetchAccountList();
    }

    render() {
        return (
            <div>
                <UploadFile onSubmit={(file)=>this.props.getDraftFromFile(file)} />
                <UpdateEntryList
                    entries={this.props.draftEntries}
                    accounts={this.props.accounts}
                    addEntry={this.props.addEntry}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.account.accountList,
        draftEntries: state.draft.entries
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAccountList: () => dispatch(fetchAccountList()),
        getDraftFromFile: (file) => dispatch(getDraftFromFile(file)),
        addEntry: (entry) => dispatch(addEntry(entry))
    }
}

ImportEntries = connect(mapStateToProps, mapDispatchToProps)(ImportEntries);

const import_entries = document.getElementById('import_entries')
if (import_entries) {
    ReactDOM.render(
        <Provider store={store}>
            <ImportEntries />
        </Provider>,
        import_entries);
}
