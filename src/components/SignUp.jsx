import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import httpClient from '../httpClient'

function Signup(){

    const navigate = useNavigate()

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        email: ''
    })

    const [message, setMessage] = useState('')
    const [anError, setAnError] = useState(false)
    
    async function handleSubmit(e){
        e.preventDefault()

        const response = await httpClient.post(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/users/`, credentials )

        if (response.status === 200) {        
            navigate('/dashboard')
        } else {
            setMessage(response.data.error)
            setAnError(true)
        }
    }

    return(
        <div className="container">
            <div className="backbutton">
                <a href="/dashboard"><button><FontAwesomeIcon icon="fa-solid fa-arrow-left"/>  Back</button></a>
            </div>
            <main className="logincontainer">
                <h1>Sign up</h1>
                <div className="loginformcontainer">
                    <form onSubmit={handleSubmit} className="signupform">
                        <div className="logininputcontainer">
                            <label htmlFor="userName"></label>
                            <input 
                                type="text"
                                required
                                value={credentials.username}
                                onChange={e => setCredentials({...credentials, username: e.target.value})}
                                id="userName"
                                name="userName"
                                placeholder='Username'
                                autoFocus
                                className="logininput"
                            />
                            <label htmlFor="password"></label>
                            <input 
                                type="password"
                                required
                                value={credentials.password}
                                onChange={e => setCredentials({...credentials, password: e.target.value})}
                                id="password"
                                name="password"
                                placeholder='New password'
                                className="logininput"
                            />
                            <label htmlFor="email"></label>
                            <input 
                                type="email"
                                required
                                value={credentials.email}
                                onChange={e => setCredentials({...credentials, email: e.target.value})}
                                id="email"
                                name="email"
                                placeholder='Email'
                                className="logininput"
                            />
                        </div>
                        <div className="loginsubmitcontainer">
                            <input type="submit" value="Sign up" className="signupbutton"/>
                        </div>
                    </form>
                </div>
                {anError === true
                    ? (
                        <div style={{ float: 'center' }}>
                            {message}
                        </div>
                    )
                    : null
                }
                <p>Already have an account? Log in <a href="/login">here</a></p>
            </main>
        </div>
    )
}

export default Signup