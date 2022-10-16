import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from '../httpClient'

export default function EditFolder(props) {

    const currentUser = props.currentUser

    let navigate = useNavigate()

    const folder = props.folder
    let folder_id = folder._id['$oid']

    const [folderPrefs, setFolderPrefs] = useState({
        name: `${folder.name}`,
      })

    let editName = (
        <div>
          <input
            type="text"
            defaultValue={folder.name}
            onChange={e => setFolderPrefs({...folderPrefs, name: e.target.value})}
            id="editFolderName"
            name="editFolderName"
            placeholder="New Folder Name"
          >
          </input>
        </div>
      )

    const confirmEdit = async (e) => {
        e.preventDefault()
    
        console.log(folderPrefs.profile_picture)
    
        try {
          const response = await httpClient.put(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/folder/${folder_id}`, folderPrefs)
            if (response.status === 200) {
                console.log(response.data.message)
                navigate(`/dashboard/folder/${folder._id['$oid']}`, {state: { folder: folder, user: currentUser }})
                window.location.reload()
            }
        } catch (error){
            if (error.response.status === 401) {
                console.error(error)
                throw "Could not update folder"
            }
    }
      }

  return (
    <div className="editingfoldername">
        {editName}
        <button className="loginbutton" onClick={confirmEdit}>Confirm</button>
    </div>
  )
}