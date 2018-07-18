import React from 'react';
import ReactDOM from 'react-dom';

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
        }
    }

    componentDidMount() {
        fetch('api/accounts/')
            .then(response => response.json())
            .then(responseJson => this.setState({response: responseJson}))
            .catch((error) => console.error(error))
    }

    render() {
        const response = this.state.response;

        if (response.length > 0) {
            var listelems = response.map(function(d){
                return (
                    <tr key={d.name + '_row'}>
                        <td key={d.name}>{d.name}</td>
                        <td key={d.account_type}>{d.account_type}</td>
                    </tr>
                );
            })

            return (
                <table className='table'>
                    <thead className='thead-bordered'>
                        <tr key="header">
                            <th scope='col' key='name'>Name</th>
                            <th scope='col' key='type'>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listelems}
                    </tbody>
                </table>
            );
        } else {
            return <div>there is no data</div>;
        }
    }
}

const account = document.getElementById('account')
if (account) {
    ReactDOM.render(<Account />, account);
}
