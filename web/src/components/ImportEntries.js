import React from 'react';
import ReactDOM from 'react-dom';
import {EntryListHeader, EditableEntry} from './Entry.js';

class UploadFile extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
    }

    handleSubmit(e) {
        e.preventDefault();

        const file = this.input.current.files[0];
        const formData = new FormData();
        formData.append('file', file);

        fetch('api/entries/drafts', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(responseJson => this.props.onDraftEntriesChanged(responseJson))
            .catch((error) => console.error(error));
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='uploadFile' />
                    <input type='file' className='form-control-file' id='uploadFile' ref={this.input} />
                </div>

                <div className='text-center'>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                </div>
            </form>
        );
    }
}

class ImportEntries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draftEntries: [],
            accounts: [],
        }
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
                    const index = this.state.draftEntries.indexOf(entry);
                    const draftEntries = this.state.draftEntries;
                    draftEntries.splice(index, 1);
                    this.setState({draftEntries: draftEntries});
                })
                .catch((error) => console.error(error));
        })
    }

    render() {
        const body = this.state.draftEntries.map((entry, key) =>
            <EditableEntry key={entry.id} accounts={this.state.accounts} entry={entry} handleChange={(updatedEntry) => this.handleChange(key, updatedEntry)} />);

        return (
            <div>
                <UploadFile onDraftEntriesChanged={(draftEntries) => this.setState({draftEntries: draftEntries})} />
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
            </div>);
    }
}

const import_entries = document.getElementById('import_entries')
if (import_entries) {
    ReactDOM.render(<ImportEntries />, import_entries);
}
