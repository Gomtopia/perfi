import React from 'react';
import ReactDOM from 'react-dom';
import {UpdateEntryList} from './Entry.js';

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
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.fetchAccounts();
    }

    fetchAccounts() {
        fetch('api/accounts/')
            .then(response => response.json())
            .then(responseJson => this.setState({accounts: responseJson}))
            .catch((error) => console.error(error));
    }

    handleUpdate(entry) {
        const index = this.state.draftEntries.indexOf(entry);
        const draftEntries = this.state.draftEntries;
        draftEntries.splice(index, 1);
        this.setState({draftEntries: draftEntries});
    }

    render() {
        return (
            <div>
                <UploadFile onDraftEntriesChanged={(draftEntries) => this.setState({draftEntries: draftEntries})} />
                <UpdateEntryList
                    key={this.state.draftEntries}
                    entries={this.state.draftEntries}
                    accounts={this.state.accounts}
                    handleUpdate={this.handleUpdate} />
            </div>);
    }
}

const import_entries = document.getElementById('import_entries')
if (import_entries) {
    ReactDOM.render(<ImportEntries />, import_entries);
}
