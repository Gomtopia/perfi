import React from 'react';

const EntryListHeader = () => (
    <thead className='thead-bordered'>
        <tr key="header">
            <th scope='col' key='expand'></th>
            <th scope='col' key='date'>Date</th>
            <th scope='col' key='desc'>Description</th>
            <th scope='col' key='debit'>Debit</th>
            <th scope='col' key='credit'>Credit</th>
            <th scope='col' key='amount'>Amount</th>
            <th scope='col' key='actions'></th>
        </tr>
    </thead>
)

export default EntryListHeader
