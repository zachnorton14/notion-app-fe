import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import httpClient from '../httpClient';


export default function TextEditor(props) {

    const [value, setValue] = useState('')

    useEffect(() => {
      setValue(props.note.content)
    }, [])

    const submitEdit = async (e) => {
        e.preventDefault()

        try {
          const response = await httpClient.put(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/note/${props.note._id['$oid']}/content`, {edit: value})
            if (response.status === 200) {
                console.log(response.data.message)
                window.location.reload()
            }
        } catch (error){
            if (error.response.status === 401) {
                console.error(error)
                throw "An error occured whilst trying to create new note"
            }
        }
    } 

  return (
    <div className="texteditor">
        <button className="loginbutton" onClick={submitEdit}>Confirm</button>
        <ReactQuill theme="snow" value={value} onChange={setValue} />
    </div>
  )
  
}
