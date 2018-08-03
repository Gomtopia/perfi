import React from 'react';
import {connect} from 'react-redux';

import {startEdit, deleteEntry, updateEntry} from '../actions/entry';
import EntryListHeader from './EntryListHeader';
import EditableEntry from './EditableEntry';
import StaticEntry from './StaticEntry';

let EntryListTable = ({entries, accounts, onEditBtnClick, onRemoveBtnClick, onUpdateBtnClick}) => (
    <table className='table mt-3'>
        <EntryListHeader />
        <tbody>
            {Object.keys(entries).map((id) => {
                 const entry = entries[id];
                 if (entry.isEditing) {
                     let inputRefs = {};
                     let actions = (<button type="button" className="btn btn-primary" onClick={() => onUpdateBtnClick(entry.id, inputRefs)}>Update</button>);
                     return <EditableEntry
                                key={entry.id}
                                entry={entry}
                                accounts={accounts}
                                actions={actions}
                                inputRefs={inputRefs} />
                 } else {
                     let actions = (
                         <div className="btn-group">
                             {<button type="button" className="btn btn-primary" onClick={() => onEditBtnClick(entry)}>Edit</button>}
                             {<button type="button" className="btn btn-danger ml-2" onClick={() => onRemoveBtnClick(entry)}>Remove</button>}
                         </div>
                     );
                     return <StaticEntry
                                key={entry.id}
                                entry={entry}
                                actions={actions} />
                 }
            })}
        </tbody>
    </table>
)

const getEntryFromRefs = (id, inputRefs) => {
    return {
        id: id,
        date: inputRefs.date.value,
        description: inputRefs.description.value.trim(),
        debit: inputRefs.debit.value,
        credit: inputRefs.credit.value,
        amount: inputRefs.amount.value
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onEditBtnClick: (entry) => dispatch(startEdit(entry)),
        onRemoveBtnClick: (entry) => dispatch(deleteEntry(entry)),
        onUpdateBtnClick: (id, inputRefs) => dispatch(updateEntry(getEntryFromRefs(id, inputRefs)))
    }
}

EntryListTable = connect(null, mapDispatchToProps)(EntryListTable)

export default EntryListTable
