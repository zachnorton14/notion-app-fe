
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CurrentUser } from '../contexts/CurrentUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NavBar(props) {

    const { currentUser } = useContext(CurrentUser)

    const navigate = useNavigate()
    
    const logout = async () => {
        sessionStorage.removeItem("user");
        window.location.reload()
    }

    const back = () => {
        navigate(`${props.action}`, { state: props.state})
    }

    let backbutton = (
        <div className="backbutton">
            <button onClick={back}><FontAwesomeIcon icon="fa-solid fa-arrow-left" />  Back</button>
        </div>
    )

    if (props.action === undefined){
        backbutton = <div></div>
    }

    let loginActions;

    if (currentUser) {
        const redirect = () => {
            navigate(`/profile/${currentUser._id['$oid']}/`, {state: { user: currentUser }})
        }
        loginActions = (
            <div className="navbarbuttonscontainer">
                <div className="navprofilebuttons" onClick={redirect}>
                    <img className="pnavrofilepicture" src={currentUser?.profile_picture} style={{width: '30px', height: '30px'}} alt={`${currentUser?.username}'s avatar`}></img>
                    <p style={{ margin: 0 }}>{currentUser.username}</p>
                </div>
                <button className="logoutbutton" onClick={logout}>Logout</button>
            </div>
        )
    }

    return (
        <nav>
            {backbutton}
            {loginActions}
        </nav>
    )
}

export default NavBar