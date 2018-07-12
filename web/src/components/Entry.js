import React from 'react';
import ReactDOM from 'react-dom';

class EntryList extends React.Component {
    render() {
        const data = this.props.jsonData;
        if (data.length > 0) {
            var listelems = data.map(function(d){
                return (<tr key={d.date + '_row'}>
                        <td key={d.date}>{d.date}</td>
                        <td key={d.description}>{d.description}</td>
                        <td key={d.debit + '_debit'}>{d.debit}</td>
                        <td key={d.credit + '_credit'}>{d.credit}</td>
                        <td key={d.amount}>{d.amount}</td>
                        </tr>);
            })

            return (<table className='table mt-3'>
                    <thead className='thead-bordered'>
                    <tr key="header">
                    <th scope='col' key='date'>Date</th>
                    <th scope='col' key='desc'>Description</th>
                    <th scope='col' key='debit'>Debit</th>
                    <th scope='col' key='credit'>Credit</th>
                    <th scope='col' key='amount'>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listelems}
                    </tbody>
                    </table>);
        } else {
            return <div>there is no data</div>;
        }

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
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                {this.props.accountOptions}
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
            .then(response => this.props.handleSubmit())
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        const dateField = this.getInputField('datetime-local', 'date', 'Date');
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

class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entryJsonData: [],
            accountOptions: [],
        }
    }

    componentDidMount() {
        this.updateEntryList();
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

    updateEntryList() {
        fetch('api/entries/')
            .then(response => response.json())
            .then(responseJson => this.setState({entryJsonData: responseJson}))
            .catch((error) => {
                console.error(error);
            })
    }

    render() {
        const response = this.state.entryJsonData;
        return (
            <div>
                <AddEntry accountOptions={this.state.accountOptions} handleSubmit={() => this.updateEntryList()}/>
                <EntryList jsonData={response} />
            </div>
        );
    }
}

const entry = document.getElementById('entry')
if (entry) {
    ReactDOM.render(<Entry />, entry);
}
