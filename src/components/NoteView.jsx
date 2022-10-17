import { useLocation, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { CurrentUser } from '../contexts/CurrentUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import httpClient from '../httpClient'
import TextEditor from './TextEditor'
import NavBar from './NavBar'


function NoteView() {

    const { currentUser } = useContext(CurrentUser)
    
    const [ editMode, setEditMode ] = useState(false)
    const [ editingContent, setEditingContent ] = useState(false)
    const [ redirect, setRedirect ] = useState({

    })
    
    const navigate = useNavigate()
    
    const location = useLocation()
    
    let note = location.state.note
    let folder = location.state.folder

    const [editPrefs, setEditPrefs] = useState({
        name: `${note.name}`,
        description: `${note.description}`,
    })

    const back = async(conditional) => {
        try { 
            const response = await httpClient.get(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/users/${note.creator}`)
            if (response.status === 200) {
                console.log(response.data.message)
                if (conditional === true ) {
                    setRedirect({ note: note, folder: folder, user: response.data.user })
                } else {
                    navigate(`/dashboard/folder/${folder._id['$oid']}`, {state: { note: note, folder: folder, user: response.data.user }})
                }
            }
        } catch (error){
            if (error.response.status === 401) {
                throw error
            }
        }
        
    }

    useEffect(() => {
        back(true)
    }, [])
    
    const dashboard = () => {
        navigate('/dashboard')
    }

    const getProfile = async () => {
        try { 
            const response = await httpClient.get(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/users/${note.creator}`)
            console.log(response.data)
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

    let editName = (
        <input
            type="text"
            defaultValue={note.name}
            onChange={e => setEditPrefs({...editPrefs, name: e.target.value})}
            id="editUserName"
            name="editUserName"
            placeholder="Username"
        >
        </input>
    )

    let editDescription = (
        <input
            type="text"
            defaultValue={note.description}
            onChange={e => setEditPrefs({...editPrefs, description: e.target.value})}
            id="editUserName"
            name="editUserName"
            placeholder="Username"
        >
        </input>
    )

    const confirmEdit = async() => {
        try {
            const response = await httpClient.put(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/note/${note._id['$oid']}`, editPrefs)
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

    const deleteNote = async () => {
        try {
            const response = await httpClient.delete(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/note/${note._id['$oid']}`)
            if (response.status === 200) {
              console.log(response.data.message)
              back()
            } 
          } catch (error) {
            if (error.response.status === 401) {
              throw error
            }  
            
          }
    }

    const htmlObject = document.createElement('div')
    htmlObject.innerHTML = note.content

    const editContent = () => {
        if (currentUser?.username === note.creator){
            setEditingContent(true)
        }
    }
    
    const cancelEditingContent = () => {
        setEditingContent(false)
    }

    const editNote = () => {
        setEditMode(true)
    }

    const cancelEdit = () => {
        setEditMode(false)
    }
    
    let editButton;
    let deleteButton;
    let dynamicStyling;


    if (currentUser?.username === note.creator){
        editButton = <button className="signupbutton" onClick={editNote}>Edit</button>
        deleteButton = <button className="logoutbutton" onClick={deleteNote}>Delete</button>
    }

    if (currentUser?.username !== note.creator){
        dynamicStyling = {
            backgroundColor: 'white'
        }
    }

    let notecontent = (
        <div style={dynamicStyling} onClick={editContent} className="notecontent" dangerouslySetInnerHTML={{__html: note.content}}></div>
    )

    if ( note.content === ''){
        notecontent = <p className="notecontent" style={{ boxShadow: 'none', textAlign: 'center', dynamicStyling}} onClick={editContent}>Nothing has been jotted down yet...</p>
    }

    return (
        <div className="container">
            <NavBar action={`/dashboard/folder/${folder._id['$oid']}`} state={redirect} />
            <div className="sitepositionindicator">
                <p><span onClick={dashboard}>Dashboard</span></p>
                <div><FontAwesomeIcon icon="fa-solid fa-chevron-right" /> </div>
                <p><span onClick={back}>Folder: {folder.name}</span></p>
                <div><FontAwesomeIcon icon="fa-solid fa-chevron-right" /> </div>
                <p>Note: {note.name}</p>
            </div>
            <div className="noteviewcontainer">
                <div className="noteheader">
                    <div className="notename">
                        <div><FontAwesomeIcon icon="fa-solid fa-file-lines" /></div>
                        {editMode ? editName : <h1>{note.name}</h1>}
                    </div>
                    <div className="noteprefbuttons">
                        {editMode ? <button className='signupbutton' onClick={cancelEdit}>Cancel</button> : editButton}
                        {editMode ? <button className='loginbutton' onClick={confirmEdit}>Confirm</button> : deleteButton}
                    </div>
                </div>
                <h5>{folder.name}</h5>
                <h2 onClick={getProfile}>{note.creator}</h2>
                <div className="descriptioncontainer">
                    <div className="spacer"><div className="verticalbar"></div></div>
                    {editMode ? editDescription : <h4>{note.description}</h4>}
                </div>
                <hr/>
                <div className="notecontentcontainer">
                    <div className="contentheader">
                        {note.content === '' ? <div></div> : note.name}
                        <div>{editingContent ? <p onClick={cancelEditingContent}>Cancel Edit</p> : <div></div>}</div>
                    </div>
                    {editingContent ? <TextEditor note={note}/> : notecontent }
                </div>
            </div>
        </div>
    )
}

export default NoteView