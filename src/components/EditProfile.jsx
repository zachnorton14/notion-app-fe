import React, { useState } from 'react'
import httpClient from '../httpClient'

export default function EditProfile(props) {

    const currentUser = props.user

    const [userProfile, setUserProfile] = useState({
        profile_picture: `${currentUser.profile_picture}`,
        username: `${currentUser.username}`,
        bio: `${currentUser.bio}`
      })

    let editProfilePicture = (
        <div className="editprofilepicturecontainer">
          <div>
            <img src={currentUser.profile_picture} alt={`${currentUser.username}`}></img>
          </div>
          <input
            type="url"
            defaultValue={currentUser.profile_picture}
            onChange={e => setUserProfile({...userProfile, profile_picture: e.target.value})}
            id="editProfilePicture"
            name="editProfilePicture"
            placeholder="Image URL"
          >
          </input>
        </div>
      )
    
      let editUsername = (
        <div className="editusernamecontainer">
          <input
            type="text"
            defaultValue={currentUser.username}
            onChange={e => setUserProfile({...userProfile, username: e.target.value})}
            id="editUserName"
            name="editUserName"
            placeholder="Username"
            className="editusername"
          >
          </input>
        </div>
      )
    
      let editBio = (
        <div className='editbiocontainer'>
          <input
            type="text"
            defaultValue={currentUser.bio}
            onChange={e => setUserProfile({...userProfile, bio: e.target.value})}
            id="editBio"
            name="editBio"
            placeholder="Bio"
            className="editbio"
          >
          </input>
        </div>
      )

    const confirmEdit = async (e) => {
        e.preventDefault()
    
        try {
          const response = await httpClient.put(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/users/${currentUser._id['$oid']}/`, userProfile)
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

  return (
    <div className="editprofileview">
        <div className="editprofile">
          {editProfilePicture}
          <div className="edituserheader">
            {editUsername}
            {editBio}
          </div>
        </div>
        <div className="confirmeditprofile">
          <button className="loginbutton" onClick={confirmEdit}>Confirm</button>
        </div>
    </div>
  )
}
