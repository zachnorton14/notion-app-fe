import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CurrentUser } from '../contexts/CurrentUser'
import EditProfile from './EditProfile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import httpClient from '../httpClient'

function Profile() {

  const { currentUser } = useContext(CurrentUser)

  const [editMode, setEditMode] = useState(false)

  const navigate = useNavigate()

  const location = useLocation()

  const user = location.state.user
  let username = location.state.user.username
  
  const editProfile = () => {
    setEditMode(!editMode)
  }
  
  const cancelEdit = () => {
    setEditMode(false)
  }
  
  const deleteAccount = async () => {
    try {
      const response = await httpClient.delete(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/users/${user?._id['$oid']}/`)
      if (response.status === 200) {
        console.log(response.data.message)
        navigate('/dashboard')
        window.location.reload()
      } 
    } catch (error) {
      if (error.response.status === 401) {
        throw error
      }  
      
    }
  }

  let editProfileButton;

  let deleteAccountButton;

  if (username === currentUser?.username){
    editProfileButton = <button className="signupbutton" onClick={editProfile}> Edit profile </button> 
    deleteAccountButton = <button className="logoutbutton" onClick={deleteAccount}>Delete Account</button>
  }
  
  const profileView = (
    <div className="profileview">
      <img src={user?.profile_picture} alt={`${user?.username}`}></img>
      <div className="userheader">
        <h1>{user?.username}</h1>
        <h3>{user?.bio}</h3>
      </div>
    </div>
  )

  return (
    <div className="container">
      <div className="backbutton">
        <a href="/dashboard"><button><FontAwesomeIcon icon="fa-solid fa-arrow-left" />  Back</button></a>
      </div>
      <div className="profilecontainer">
        {editMode ? <EditProfile user={user}/> : profileView}
        <div className="profileprefbuttons">
          {editMode ? <button className="signupbutton" onClick={cancelEdit}>Cancel</button> : editProfileButton }
          {editMode ? <div></div> : deleteAccountButton }
        </div>
      </div>
  </div>
  )
}

export default Profile