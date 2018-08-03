import React from 'react';

const UploadFile = ({onSubmit}) => {
    let fileInput;

    return (
        <div className='form-group'>
            <input type='file' className='form-control-file' ref={node=>{fileInput=node}} />
            <div className='text-center'>
                <button type='button' className='btn btn-primary' onClick={()=>(onSubmit(fileInput.files[0]))}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default UploadFile
