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

export class EditableEntry extends React.Component {
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

export class EntryListHeader extends React.Component {
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

class EntryList extends React.Component {
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

class AddEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: undefined,
            description: "",
            debit: undefined,
            credit: undefined,
            amount: 0,
            accountOptions: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('api/accounts/')
            .then(response => response.json())
            .then(responseJson => {
                let options = responseJson.map(function(d){
                    return <option key={d.name}>{d.name}</option>
                });
                this.setState({accountOptions: options})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getInputField(inputType, id, label) {
        return (
                <div className='form-group col-md'>
                <label htmlFor={id}>{label}</label>
                <input type={inputType} className='form-control' id={id} name={id} onChange={this.handleChange} required/>
                </div>
        );
    }

    getAccountSelectField(id, label) {
        return (<div className='form-group col-md'>
                <label htmlFor='debit'>Debit</label>
                <select id="debit" className="form-control" name={id} onChange={this.handleChange} required>
                <option value="">Choose...</option>
                {this.state.accountOptions}
                </select>
                </div>
               );
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();

        const {date, description, debit, credit, amount} = this.state;
        const input = {date, description, debit, credit, amount};
        fetch('api/entries/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        })
            .then(response => this.props.fetchEntries())
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        const dateField = this.getInputField('date', 'date', 'Date');
        const descField = this.getInputField('text', 'description', 'Description');
        const debitField = this.getAccountSelectField('debit', 'Debit');
        const creditField = this.getAccountSelectField('credit', 'Credit');
        const amountField = this.getInputField('number', 'amount', 'Amount');

        return (
                <form className='form' onSubmit={this.handleSubmit}>
                    <div className='form-row'>
                        {dateField}{descField}{debitField}{creditField}{amountField}
                    </div>
                    <div className='text-center'>
                        <button type='submit' className='btn btn-primary'>Add</button>
                    </div>
                </form>
        );
    }
}

class RootComponent extends React.Component {
    constructor(props) {
        super(props);
        this.fetchEntries = this.fetchEntries.bind(this);
        this.state = {
            entries: [],
        }
    }

    componentDidMount() {
        this.fetchEntries();
    }

    fetchEntries() {
        fetch('api/entries/')
            .then(response => response.json())
            .then(responseJson => this.setState({entries: responseJson}))
            .catch((error) => {
                console.error(error);
            })
    }

    render() {
        return (
            <div>
                <AddEntry fetchEntries={this.fetchEntries} />
                <EntryList entries={this.state.entries} />
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
