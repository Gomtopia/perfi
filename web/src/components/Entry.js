import React from 'react';
import ReactDOM from 'react-dom';

class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entry: this.props.entry,
            isEditing: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.onActionTriggered = this.onActionTriggered.bind(this);
    }

    handleChange(updatedEntry) {
        console.log(updatedEntry);
        this.setState({entry: updatedEntry});
    }

    remove() {
        fetch('api/entries/' + this.state.entry.id + '/',
              {
                  method: 'DELETE',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(this.state.entry),
              })
            .then(response => {
                console.log(
                    this.props.onEntryRemoved);
                this.props.onEntryRemoved();
            })
            .catch((error) => console.error(error));
    }

    update() {
        this.setState({isEditing: false});
        fetch('api/entries/' + this.state.entry.id + '/',
              {
                  method: 'PUT',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(this.state.entry),
              })
            .then(response => response.json())
            .then(responseJson => this.handleChange(responseJson))
            .catch((error) => console.error(error));
    }

    onActionTriggered(action) {
        if (action == "update") {
            this.update();
        }
    }

    render() {
        const entry = this.state.entry;
        if (this.state.isEditing) {
            return (
                <EditableEntry
                    key={entry.id}
                    entry={entry}
                    accounts={this.props.accounts}
                    supported_actions={["update"]}
                    onChanged={this.handleChange}
                    onActionTriggered={this.onActionTriggered}
                />
            );
        } else {
            return (
                <StaticEntry
                    key={entry.id}
                    entry={entry}
                    support_actions="true"
                    handleEditBtnClick={() => this.setState({isEditing: true})}
                    handleRemoveBtnClick={() => this.remove(entry.id)} />
            );
        }
    }
}

class StaticEntry extends React.Component {
    constructor(props) {
        super(props);
        this.handleEditBtnClick = this.handleEditBtnClick.bind(this);
        this.handleRemoveBtnClick = this.handleRemoveBtnClick.bind(this);
    }

    handleEditBtnClick(e) {
        e.preventDefault();
        this.props.handleEditBtnClick();
    }

    handleRemoveBtnClick(e) {
        e.preventDefault();
        this.props.handleRemoveBtnClick();
    }

    render() {
        const entry = this.props.entry;
        return (
            <tr>
                <td key='date'>{entry.date}</td>
                <td key='desc'>{entry.description}</td>
                <td key='debit'>{entry.debit}</td>
                <td key='credit'>{entry.credit}</td>
                <td key='amount'>{entry.amount}</td>
                {this.props.support_actions &&
                 <td key='edit'>
                     <button type="button" className="btn btn-primary" onClick={this.handleEditBtnClick}>Edit</button>
                     <button type="button" className="btn btn-danger ml-2" onClick={this.handleRemoveBtnClick}>Remove</button>
                 </td>
                }
            </tr>
        );
    }
}

class MultipleEditableEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [{'id': 0}],
        }
        this.handleChange = this.handleChange.bind(this);
        this.onActionTriggered = this.onActionTriggered.bind(this);
        this.lastId = 0;
    }

    handleChange(index, updatedEntry) {
        this.setState((prevState) => {
            var newEntries = prevState.entries;
            newEntries[index] = updatedEntry;
            return {entries: newEntries};
        });
    }

    onActionTriggered(index, action) {
        if (action == "add") {
            this.setState((prevState) => {
                this.lastId += 1;
                var newEntries = prevState.entries;
                newEntries[prevState.entries.length] = {'id': this.lastId};
                console.log(newEntries);
                return {entries: newEntries};
            });
        } else if (action == "remove") {
            this.setState((prevState) => {
                var newEntries = prevState.entries;
                newEntries.splice(index,1)
                return {entries: newEntries};
            });
        }
    }

    render() {
        const editableEntries = this.state.entries.map((entry, index) => {
            const isLastEntry = (index == (this.state.entries.length - 1));
            const supportedActions = [];
            if (isLastEntry) {
                supportedActions.push("add");
            }
            if (this.state.entries.length != 1) {
                supportedActions.push("remove");
            }
            console.log(this.props.parentKey + ":" + entry.id);
            return (<EditableEntry
                        entry={entry}
                        accounts={this.props.accounts}
                        nested="true"
                        supported_actions={supportedActions}
                        onChanged={(updatedEntry) => this.handleChange(index, updatedEntry)}
                        onActionTriggered={(action) => this.onActionTriggered(index, action)} />
            )
        });
        return editableEntries;
    }
}

class EditableEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.entry.id,
            date: this.props.entry.date,
            description: this.props.entry.description,
            debit: this.props.entry.debit,
            credit: this.props.entry.credit,
            amount: this.props.entry.amount,
            expanded: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleExpandBtnClick = this.handleExpandBtnClick.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value},
                      () => this.props.onChanged(this.state));
    }

    handleExpandBtnClick(e) {
        this.setState((prevState, props) => {
            return {expanded: !(prevState.expanded)}
        })
    }

    render() {
        const {date, description, amount} = this.state;
        const accountOptions = this.props.accounts.map((account) => <option key={account.name}>{account.name}</option>);
        const updateActionSupported = this.props.supported_actions && this.props.supported_actions.indexOf('update') != -1;
        const addActionSupported = this.props.supported_actions && this.props.supported_actions.indexOf('add') != -1;
        const removeActionSupported = this.props.supported_actions && this.props.supported_actions.indexOf('remove') != -1;
        const expandButton = (
            <button type='button' onClick={this.handleExpandBtnClick}>
                {this.state.expanded && "-"}
                {!this.state.expanded && "+"}
            </button>
        );
        const multipleEditableEntry = this.state.expanded && (
            <MultipleEditableEntry
                parentKey={this.props.entry.id}
                accounts={this.props.accounts}  />);
        return [(
            <tr key={this.props.entry.id}>
                {this.props.expandable && (
                     <td>
                         {expandButton}
                     </td>
                )}
                {this.props.nested &&
                 (<td></td>)}
                <td key="date"><input type='date' className='form-control' name='date' defaultValue={date} onChange={this.handleChange} required/></td>
                <td key="desc"><input type='text' className='form-control' name='description' defaultValue={description} onChange={this.handleChange} required/></td>
                <td key="debit">
                    <select className='form-control' name='debit' onChange={this.handleChange} required>
                        <option value=''>Choose...</option>
                        {accountOptions}
                    </select>
                </td>
                <td key="credit">
                    <select className='form-control' name='credit' onChange={this.handleChange} required>
                        <option value=''>Choose...</option>
                        {accountOptions}
                    </select>
                </td>
                <td key="amount"><input type='number' className='form-control' name='amount' defaultValue={amount} onChange={this.handleChange} required/></td>
                {this.props.supported_actions &&
                 <td key='edit'>
                     {updateActionSupported &&
                      <button type="button" className="btn btn-danger ml-2" onClick={(e) => this.props.onActionTriggered('update')}>Update</button>}
                     {removeActionSupported &&
                      <button type="button" className="btn btn-primary ml-2" onClick={(e) => this.props.onActionTriggered('remove')}>-</button>}
                     {addActionSupported &&
                      <button type="button" className="btn btn-primary ml-2" onClick={(e) => this.props.onActionTriggered('add')}>+</button>}
                 </td>}
            </tr>
        ),
                this.state.expanded && multipleEditableEntry
        ];
    }
}

class EntryListHeader extends React.Component {
    render() {
        return (
            <thead className='thead-bordered'>
                <tr key="header">
                    {this.props.expandable && <th scope='col' key='expand'></th>}
                    <th scope='col' key='date'>Date</th>
                    <th scope='col' key='desc'>Description</th>
                    <th scope='col' key='debit'>Debit</th>
                    <th scope='col' key='credit'>Credit</th>
                    <th scope='col' key='amount'>Amount</th>
                    {this.props.support_actions && <th scope='col' key='actions'></th>}
                </tr>
            </thead>
        );
    }
}

class EntryListTable extends React.Component {
    render() {
        const entries = this.props.entries;
        if (entries.length == 0) {
            return <div>there is no data</div>;
        }

        var body = entries.map(
            (entry) =>
                <Entry
                    key={entry.id}
                    entry={entry}
                    accounts={this.props.accounts}
                    onEntryRemoved={this.props.handleUpdate}
                    support_actions="true" />)
        return (
            <table className='table mt-3'>
                <EntryListHeader support_actions="true" />
                <tbody>
                    {body}
                </tbody>
            </table>
        );
    }
}

export class UpdateEntryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draftEntries: this.props.entries,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(index, updatedEntry) {
        const draftEntries = this.state.draftEntries;
        draftEntries[index] = updatedEntry;
        this.setState({draftEntries: draftEntries});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.state.draftEntries.map((entry) => {
            const {date, description, debit, credit, amount} = entry;
            const input = {date, description, debit, credit, amount};
            fetch('api/entries/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            })
                .then(response => {
                    this.props.handleUpdate(entry);
                })
                .catch((error) => console.error(error));
        })
    }

    render() {
        const entries = this.state.draftEntries;
        if (entries.length == 0) {
            return <div>there is no entries to update</div>;
        }

        const body = entries.map((entry, key) =>
            <EditableEntry
                key={entry.id}
                entry={entry}
                accounts={this.props.accounts}
                expandable={this.props.expandable}
                onChanged={(updatedEntry) => this.handleChange(key, updatedEntry)} />);

        return (
            <form onSubmit={this.handleSubmit}>
                <table className='table mt-3'>
                    <EntryListHeader
                        expandable={this.props.expandable} />
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
}

class RootComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            emptyEntry: {id: 1},
            accounts: [],
        }

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.fetchEntries();
        this.fetchAccounts();
    }

    fetchEntries() {
        fetch('api/entries/')
            .then(response => response.json())
            .then(responseJson => this.setState({entries: responseJson}))
            .catch((error) => console.error(error))
    }

    fetchAccounts() {
        fetch('api/accounts/')
            .then(response => response.json())
            .then(responseJson => this.setState({accounts: responseJson}))
            .catch((error) => console.error(error));
    }

    handleUpdate() {
        this.fetchEntries();
        this.state.emptyEntry.id += 1;
    }

    render() {
        return (
            <div>
                <UpdateEntryList
                    key={this.state.emptyEntry.id}
                    entries={[this.state.emptyEntry]}
                    accounts={this.state.accounts}
                    handleUpdate={this.handleUpdate} />
                <EntryListTable
                    entries={this.state.entries}
                    accounts={this.state.accounts}
                    handleUpdate={this.handleUpdate} />
            </div>
        );
    }
}

const entry = document.getElementById('entry')
if (entry) {
    ReactDOM.render(
        <RootComponent />,
        entry);
}
