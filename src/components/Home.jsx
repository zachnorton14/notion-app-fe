import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CurrentUser } from '../contexts/CurrentUser'
import NavBar from './NavBar'

function Home() {

    const { currentUser } = useContext(CurrentUser)

    return (
        <main className="homecontainer">
            <NavBar />
            <div className="homesplash">
                <div className="hometitlecontainer">
                    <h1>iArchive</h1>
                    <h3>The world's filing cabinet. Store, share, save.</h3>
                </div>
                <div className="enterbuttoncontainer">
                    <div className="enterbutton">
                        <Link to="/dashboard"><button>Enter</button></Link>
                    </div>
                    <div className="entertext">
                        <p>Go to you dashboard and explore the endless possibilities of public note-taking</p>
                    </div>
                </div>
            </div>
            <section className="aboutsection">
                <h2>About</h2>
                <p>iArchive is an app where you can create folders of notes that can be published for anyone to see. It utilizes the React Quill plugin to add a free-feeling text editor. Also, almost everything is dynamic, meaning you can view other profiles and notes without even having to be logged in.</p>
                <hr/>
                <p style={{marginTop: '16px'}}>What better way to showcase what was learnt in a web development course other than by making a website?</p>
                <p>When this project first started it was literally going to do that. The plan was to showoff notes taken over the span of the course. But, instead it made more sense to make an entire app around note taking.</p>
                <p style={{color: '#696969', fontSize: '14px'}}>You can find the link to the github repository of this app <a href="https://github.com/zachnorton14/Notion-App/tree/master">here</a></p>
            </section>
            
        </main>
    )
}

export default Home