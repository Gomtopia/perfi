import React from 'react';

let EditableEntry = ({expand='', entry, accounts, inputRefs, actions}) => {

    const accountOptions = accounts.map((account) => <option key={account.name}>{account.name}</option>);

    return (
        <tr>
            <td key="expand">{expand}</td>
            <td key="date">
                <input type='date' className='form-control' name='date' defaultValue={entry.date} ref={node=>{inputRefs.date=node}} required/>
            </td>
            <td key="desc">
                <input type='text' className='form-control' name='description' defaultValue={entry.description} ref={node=>{inputRefs.description=node}} required/>
            </td>
            <td key="debit">
                <select className='form-control' name='debit' defaultValue={entry.debit} ref={node=>{inputRefs.debit=node}} required>
                    <option value=''>Choose...</option>
                    {accountOptions}
                </select>
            </td>
            <td key="credit">
                <select className='form-control' name='credit' defaultValue={entry.credit} ref={node=>{inputRefs.credit=node}} required>
                    <option value=''>Choose...</option>
                    {accountOptions}
                </select>
            </td>
            <td key="amount"><input type='number' className='form-control' name='amount' step="0.01" defaultValue={entry.amount} ref={node=>{inputRefs.amount=node}} required/></td>
            <td key="action">
                {actions}
            </td>
        </tr>
    )
}

export default EditableEntry
