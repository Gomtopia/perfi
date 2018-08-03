import React from 'react';

const StaticEntry = ({expand='', entry, actions}) => (
    <tr>
        <td key="expand">{expand}</td>
        <td key="date">{entry.date}</td>
        <td key="desc">{entry.description}</td>
        <td key="debit">{entry.debit}</td>
        <td key="credit">{entry.credit}</td>
        <td key="amount">{entry.amount}</td>
        <td key="action">
            {actions}
        </td>
    </tr>
)

export default StaticEntry
