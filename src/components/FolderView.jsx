import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CurrentUser } from '../contexts/CurrentUser'
import httpClient from '../httpClient'
import EditFolder from './EditFolder'
import NavBar from './NavBar'

function FolderView() {

    const { currentUser } = useContext(CurrentUser)

    const [ notes, setNotes ] = useState([])
    const [ editMode, setEditMode ] = useState(false)

    const navigate = useNavigate()

    const location = useLocation()

    const user = location?.state.user

    const folder = location.state.folder
    let foldercreator = folder.creator
    let folder_id = folder._id['$oid']

    const noteSection = notes.map((item, index) => {
        const redirect = () => {
            navigate(`/dashboard/folder/${folder_id}/note/${item._id['$oid']}}`, {state: { note: item, folder: folder }})
        }
            return (
                <div className={`note${index + 1}`} key={index} id="note">
                    <FontAwesomeIcon icon="fa-solid fa-file" />
                    <button onClick={redirect}>{item.name}</button>
                </div>
            )
    })

    const back = () => {
        navigate('/dashboard')
    }

    const createNote = async () => {
        try {
            const response = await httpClient.post(`https://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/folder/${folder_id}/note`, user)
            if (response.status === 200) {
                console.log(response.data.message)
                window.location.reload()
            }
        } catch (error){
            if (error.response.status === 401) {
                throw error
            }
        }
    }

    const getProfile = async () => {
        try { 
            const response = await httpClient.get(`https://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/users/${folder.creator}`)
            if (response.status === 200) {
                console.log(response.data.message)
                navigate(`/profile/${response.data.user._id['$oid']}`, { state: { user: response.data.user }})
            }
        } catch (error){
            if (error.response.status === 401) {
                throw error
            }
        }
    }

  useEffect(() => {
    const getNotes = async () => {
        try {
            const response = await httpClient.get(`https://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/folder/${folder_id}/note`)
            if (response.status === 200) {
              	console.log(response.data.message)
				setNotes(response.data.notes)
            } 
        } catch (error) {
            if (error.response.status === 401) {
                throw error
            }  
            
        }
    }
    getNotes()
  	}, [])

	const editFolder = () => {
		setEditMode(true)
	}

	const deleteFolder = async () => {
		try {
            const response = await httpClient.delete(`https://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/folder/${folder_id}`)
            if (response.status === 200) {
              	console.log(response.data.message)
				navigate('/dashboard')
            } 
        } catch (error) {
            if (error.response.status === 401) {
                throw error
            }  
            
        }
	}

    const publishFolder = async () => {
		try {
            const response = await httpClient.post(`https://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/folder/${folder_id}`)
            if (response.status === 200) {
              	console.log(response.data.message)
				navigate('/dashboard')
            } 
        } catch (error) {
            if (error.response.status === 401) {
                throw error
            }  
            
        }
	}

    const cancelEdit = () => {
        setEditMode(false)
    }

	let editButton;
	let deleteButton;
    let noNotesWarning;
    let createNoteButton;

    let publishSection;

	if (currentUser?.username === foldercreator){
		editButton = <button className="signupbutton" style={{ float: 'center'}} onClick={editFolder}>Edit</button>
		deleteButton = <button className="logoutbutton" style={{ float: 'center'}} onClick={deleteFolder}>Delete</button>
        noNotesWarning = <p>You haven't created any notes in this folder yet, hit the plus to create one now.</p>
        createNoteButton = (
            <div className="createfoldercontainer">
                { notes.length === 0 ? <div></div> : <div className="createbuttonspacer"></div> }
                <div className="createfolderbutton" onClick={createNote}><FontAwesomeIcon icon="fa-solid fa-plus"/>Create a new note</div>
            </div>
        )
        if (folder.is_published === false){
            publishSection = (
                <div className="publishsection">
                    <button className="loginbutton" onClick={publishFolder}>Publish</button>
                    <div>
                        <p>
                            <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
                            Publishing your folder makes it public to the world!
                        </p>
                    </div>
                </div>
            )
        }
    }
    
  return (
    <div className="container">
        <NavBar action={'/dashboard'}/>
        <div className="sitepositionindicator">
            <p><span onClick={back}>Dashboard</span></p>
            <div><FontAwesomeIcon icon="fa-solid fa-chevron-right" /> </div>
            <p>Folder: {folder.name}</p>
        </div>
        <div className="folderviewcontainer">
            <div className="foldertitle">
                <div className="foldername">
                    <div><FontAwesomeIcon icon="fa-solid fa-folder-open" /></div>
                    { editMode ? <EditFolder user={user} folder={folder}/> : <h1>{folder.name}</h1> }
                    
                </div>
                <div className="folderprefbuttons">
                    { editMode ? <button className="signupbutton" onClick={cancelEdit}>Cancel</button> : editButton }
                    { editMode ? <div style={{ float: 'center'}}></div> : deleteButton }
                </div>
            </div>
            <h2 onClick={getProfile}>{folder.creator}</h2>
        	{folder.is_published ? <h3>Published Folder</h3> : <h3>Draft Folder</h3>}
                <div className='notedisplay' style={{overflowY: "auto"}}>
                    {notes.length === 0 ? noNotesWarning : noteSection}
                    {createNoteButton}
                </div>
            { publishSection }
        </div>
    </div>
  )
}

export default FolderView