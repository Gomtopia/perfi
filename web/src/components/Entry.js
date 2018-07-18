import React from 'react';
import ReactDOM from 'react-dom';

class Entry extends React.Component {
    render() {
        const entry = this.props.entry;
        return (
            <tr>
                <td key='date'>{entry.date}</td>
                <td key='desc'>{entry.description}</td>
                <td key='debit'>{entry.debit}</td>
                <td key='credit'>{entry.credit}</td>
                <td key='amount'>{entry.amount}</td>
            </tr>
        );
    }
}

class EditableEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.entry.id,
            date: this.props.entry.date,
            description: this.props.entry.description,
            debit: undefined,
            credit: undefined,
            amount: this.props.entry.amount
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value},
                      () => this.props.handleChange(this.state));
    }

    render() {
        const {date, description, amount} = this.state;
        const accountOptions = this.props.accounts.map((account) => <option key={account.name}>{account.name}</option>);

        return (
            <tr>
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
            </tr>
        );
    }
}

class EntryListHeader extends React.Component {
    render() {
        return (
            <thead className='thead-bordered'>
                <tr key="header">
                    <th scope='col' key='date'>Date</th>
                    <th scope='col' key='desc'>Description</th>
                    <th scope='col' key='debit'>Debit</th>
                    <th scope='col' key='credit'>Credit</th>
                    <th scope='col' key='amount'>Amount</th>
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

        var body = entries.map((entry) => <Entry key={entry.id} entry={entry} />)
        return (
                <table className='table mt-3'>
                    <EntryListHeader />
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
            accounts: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('api/accounts/')
            .then(response => response.json())
            .then(responseJson => this.setState({accounts: responseJson}))
            .catch((error) => console.error(error));
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
            <EditableEntry key={entry.id} entry={entry} accounts={this.state.accounts} handleChange={(updatedEntry) => this.handleChange(key, updatedEntry)} />);

        return (
            <form onSubmit={this.handleSubmit}>
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
}

class RootComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            emptyEntry: {id: 1}
        }

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.fetchEntries();
    }

    fetchEntries() {
        fetch('api/entries/')
            .then(response => response.json())
            .then(responseJson => this.setState({entries: responseJson}))
            .catch((error) => console.error(error))
    }

    handleUpdate() {
        this.fetchEntries();
        this.state.emptyEntry.id += 1;
    }

    render() {
        return (
            <div>
                <UpdateEntryList entries={[this.state.emptyEntry]} key={this.state.emptyEntry.id} handleUpdate={this.handleUpdate} />
                <EntryListTable entries={this.state.entries} />
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
