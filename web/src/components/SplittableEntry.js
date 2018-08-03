import React from 'react';
import {connect} from 'react-redux';
import {requestSplit, cancelSplit, addSubEntry, removeSubEntry} from '../actions/draft';

import EditableEntry from './EditableEntry';
import StaticEntry from './StaticEntry';

let SplittableEntry = ({entry, accounts, inputRefsList, requestSplit, cancelSplit, addSubEntry, removeSubEntry}) => {
    const accountOptions = accounts.map((account) => <option key={account.name}>{account.name}</option>);

    if (entry.isSpliting) {
        const subEntries = entry.subEntries.map((subEntry, index) => {
            const isLastEntry = (index == (entry.subEntries.length - 1));
            let actions;
            if (isLastEntry) {
                actions = (
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary" onClick={()=>addSubEntry(entry.id)}>+</button>
                        <button type="button" className="btn btn-danger" onClick={()=>removeSubEntry(entry.id)}>-</button>
                    </div>)
            }

            return (
                <EditableEntry
                    key={subEntry.id}
                    entry={subEntry}
                    accounts={accounts}
                    actions={actions}
                    inputRefs={inputRefsList[index]}
                />
            )
        });

        const expand = (<button type="button" className="btn btn-secondary" onClick={()=>cancelSplit(entry.id)}>-</button>);
        return [<StaticEntry key={entry.id} entry={entry} expand={expand} />, subEntries];
    } else {
        const expand = (<button type="button" className="btn btn-secondary" onClick={()=>requestSplit(entry.id)}>+</button>);
        return <EditableEntry key={entry.id} entry={entry} accounts={accounts} inputRefs = {inputRefsList[0]} expand={expand} />
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestSplit: (id) => dispatch(requestSplit(id)),
        cancelSplit: (id) => dispatch(cancelSplit(id)),
        addSubEntry: (id) => dispatch(addSubEntry(id)),
        removeSubEntry: (id) => dispatch(removeSubEntry(id)),
    }
}

SplittableEntry = connect(null, mapDispatchToProps)(SplittableEntry)

export default SplittableEntry
