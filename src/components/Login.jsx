import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CurrentUser } from '../contexts/CurrentUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import httpClient from "../httpClient"

function Login(){

    // const { setCurrentUser } = useContext(CurrentUser)
    
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    
    const [message, setMessage] = useState('')
    const [anError, setAnError] = useState(false)
    
    const navigate = useNavigate()
    
    async function handleSubmit(e){
        e.preventDefault()

        try {
            const response = await httpClient.post("http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/authentication", credentials)
            if (response.status === 200) {
                setMessage(response.data.message)
                // setCurrentUser(response.data.user)
                const user = JSON.stringify(response.data.user)
                sessionStorage.setItem('user', user)
                navigate('/dashboard')
            }
        } catch (error){
            if (error.response.status === 401) {
                console.error(error)
                setMessage(error)
                setAnError(true)
                throw "Invalid credentials"
            }
        }
    }
        

    return(
        <div className="container">
            <div className="backbutton">
                <a href="/dashboard"><button><FontAwesomeIcon icon="fa-solid fa-arrow-left"/>  Back</button></a>
            </div>
            <main className="logincontainer">
                <h1>Login</h1>
                <div className="loginformcontainer">
                    <form onSubmit={handleSubmit}>
                        <div className="logininputcontainer">
                            <label htmlFor="email"></label>
                            <input 
                                type="email"
                                required
                                value={credentials.email}
                                onChange={e => setCredentials({...credentials, email: e.target.value})}
                                id="email"
                                name="email"
                                placeholder='Email'
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
                                placeholder="Password"
                                className="logininput"
                            />
                        </div>
                        <div className="loginsubmitcontainer">
                            <input type="submit" value="Log in" className="loginbutton" id="submit"/>
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
                <p>Don't have an account? Sign up <a href="/signup">here</a></p>
            </main>
        </div>
    )
}

export default Login;