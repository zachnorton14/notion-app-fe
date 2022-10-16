import NavBar from "./NavBar"
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CurrentUser } from '../contexts/CurrentUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import httpClient from "../httpClient"

function Dashboard() {

    const { currentUser } = useContext(CurrentUser)
    // const currentUser = console.log(JSON.parse(sessionStorage.getItem('user')))

    const [ personalPublishedFolders, setPersonalPublishedFolders ] = useState([])
    const [ personalDraftFolders, setPersonalDraftFolders ] = useState([])
    const [ allPublicFolders, setAllPublicFolders ] = useState([])

    // const location = useLocation()

    // const currentUser = location.state?.currentUser

    const navigate = useNavigate()

    let noDraftFolders = <p className="nodraftfolders">You don't have any draft folders. Click the plus to get started.</p>
    let noPublishedFolders = <p className="nopublishedfolders">You haven't published any folders yet. To do so, view the draft folder you would like to publish.</p>
    let noPublicFolders = <p className="nopublicfolders">Hmmm... it appears there's no folders to display here.</p>

   
    // const user_id = currentUser._id['$oid']
    // let user_id;

    const user_id = JSON.parse(sessionStorage.getItem('user'))?._id['$oid']

    let dynamicHeader = (
        <div className="notloggedinheader">
            <h1>Your dashboard</h1>
            <div className="notloggedin">
                <h4>You are not currently logged in.</h4>
                <p>In order to view or create your personal folders and notes you must be logged in. You can still view publicly published folders below.</p>
                <a href="/login"><button className="loginbutton">Log in</button></a>
                <a href="/signup"><button className="signupbutton">Sign up</button></a>
            </div>
        </div>
    ) 

    let dynamicDash = (
        <div className="notloggedindash">
            <h2>Personal Folders</h2>
            <p>Log in to create your own folders and notes.</p>
        </div>
    )

    const publicFolders = allPublicFolders.map((item, index) => {
        const redirect = async () => {
            try { 
                const response = await httpClient.get(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/users/${item.creator}`)
                if (response.status === 200) {
                    console.log(response.data.message)
                    navigate(`/dashboard/folder/${item._id['$oid']}`, {state: { folder: item, user: response.data.user }})
                }
            } catch (error){
                if (error.response.status === 401) {
                    console.error(error)
                    throw "An error occured whilst trying to get user"
                }
            }
            navigate(`/dashboard/folder/${item._id['$oid']}`, {state: { folder: item, user: currentUser }})
        }
            return (
                <div className={`publicfolder${index + 1}`} key={index} id="folder">
                    <FontAwesomeIcon icon="fa-solid fa-folder" />
                    <button onClick={redirect}>{item.name}<a style={{float: 'right', color: '#969696', marginRight: '10px'}}>{item.creator}</a></button>
                </div>
            )
        })

    const draftFolders = personalDraftFolders.map((item, index) => {
            const redirect = () => {
                navigate(`/dashboard/folder/${item._id['$oid']}`, {state: { folder: item, user: currentUser }})
            }
                return (
                    <div className={`draftfolder${index + 1}`} key={index} id="folder">
                        <FontAwesomeIcon icon="fa-solid fa-folder" />
                        <button onClick={redirect}>{item.name}</button>
                    </div>
                )
            })


    const publishedFolders = personalPublishedFolders.map((item, index) => {
        const redirect = () => {
            navigate(`/dashboard/folder/${item._id['$oid']}`, {state: { folder: item, user: currentUser }})
        }
            return (
                <div className={`publishedfolder${index + 1}`} key={index} id="folder">
                    <FontAwesomeIcon icon="fa-solid fa-folder" />
                    <button onClick={redirect}>{item.name}</button>
                </div>
            )
        })


    const createFolder = async () => {
        try {
            const response = await httpClient.post("http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/folder", currentUser)
            if (response.status === 200) {
                console.log(response.data.message)
                navigate(`/dashboard/folder/${response.data.folder._id['$oid']}`, {state: { folder: response.data.folder, user: currentUser }})
            }
        } catch (error){
            if (error.response.status === 401) {
                console.error(error)
                throw "An error occured whilst trying to create new note"
            }
        }
    }

    useEffect(() => {
        const getPublicFolders = async () => {
            try {
                const response = await httpClient.get("http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/folders/public")
                if (response.status === 200) {
                    console.log(response.data.message)
                    setAllPublicFolders(response.data.folders)
                } else {
                    console.log('no folders found')
                }
            } catch (error) {
                if (error.response.status === 401) {
                    console.error(error)
                    throw "Could not get public folders"
                } else { console.log(error) }
                
            }
        }
        getPublicFolders()
    }, [])

    useEffect(() => {
        const getUsersFolders = async () => {
            try {
                const response = await httpClient.get(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/user/${user_id}/folders`)
                if (response.status === 200) {
                    console.log(response.data.message)
                    setPersonalPublishedFolders(response.data.folders.filter(element => element.is_published))
                    setPersonalDraftFolders(response.data.folders.filter(element => element.is_published === false))
                } else {
                    console.log('no folders found')
                }
            } catch (error) {
                if (error.response.status === 401) {
                    console.error(error)
                    throw "Could not get user's folder's"
                } else { console.log(error) }
                
            }

        } 
        getUsersFolders()
    }, [])
        

    if (currentUser !== null){

        dynamicHeader = (
            <h1>{currentUser.username}'s dashboard</h1>
        )
        dynamicDash = (
            <div className="personalfolderscontainer">
                <h2>Your Folders</h2>
                <div className='folderscontainer' id="draft">
                    <h3>Draft folders</h3>
                    <p>These are your draft folders. They have not been published yet. View one to publish it.</p>
                    <div className='folderspace'>
                        <div className="folders">
                            {personalDraftFolders.length === 0 ? noDraftFolders : draftFolders}
                        </div>
                        <div className="createfoldercontainer">
                            { personalDraftFolders.length === 0 ? <div></div> : <div className="createbuttonspacer"></div> }
                            <div className="createfolderbutton"onClick={createFolder}><FontAwesomeIcon icon="fa-solid fa-plus"/><p>Create a new folder</p></div>
                        </div>
                    </div>
                </div>                
                <div className="folderscontainer" id="published">
                    <h3>Published folders</h3>
                    <div className="folderspace">
                        <div className="folders">
                            {personalPublishedFolders.length === 0 ? noPublishedFolders : publishedFolders}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <NavBar action={'/'}/>
            <div className="dashboardcontainer">
                <main>
                    <div className="dashboardtitlecontainer">
                        {dynamicHeader}
                        {dynamicDash}
                    </div>
                    <div className="publicfolderscontainer">
                        <h2>Public Folders</h2>

                        <div className="folderscontainer">
                            <p>View published folders and notes created by users on iArchive</p>
                            <div className="folderspace">
                                <div className="folders">
                                    {publicFolders.length === 0 ? noPublicFolders : publicFolders}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard