import React from 'react';
import ReactDOM from 'react-dom';

class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
        }
    }

    componentDidMount() {
        fetch('api/entries/')
            .then(response => response.json())
            .then(responseJson => this.setState({response: responseJson}))
            .catch((error) => {
                console.error(error);
            })
    }

    render() {
        const response = this.state.response;

        if (response.length > 0) {
            var listelems = response.map(function(d){
                return (<tr key={d.date + '_row'}>
                        <td key={d.date}>{d.date}</td>
                        <td key={d.description}>{d.description}</td>
                        <td key={d.debit}>{d.debit}</td>
                        <td key={d.credit}>{d.credit}</td>
                        <td key={d.amount}>{d.amount}</td>
                        </tr>);
            })

            return (<table className='table'>
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

const entry = document.getElementById('entry')
if (entry) {
    ReactDOM.render(<Entry />, entry);
}
