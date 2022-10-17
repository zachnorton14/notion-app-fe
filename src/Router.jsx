import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom'
import './css/App.css';
import Home from './components/Home'
import NotFound from './NotFound';
import Dashboard from './components/Dashboard';
import NoteView from './components/NoteView';
import Login from './components/Login';
import Signup from './components/SignUp';
import CurrentUserProvider from './contexts/CurrentUser';
import Profile from './components/Profile';
import FolderView from './components/FolderView';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faArrowLeft, faPlus, faFolder, faFile, faTriangleExclamation, faFolderOpen, faChevronRight, faFileLines} from '@fortawesome/free-solid-svg-icons'

  library.add(fab, faArrowLeft, faPlus, faFolder, faFile, faTriangleExclamation, faFolderOpen, faChevronRight, faFileLines)

function App() {

  useParams()

  return (
    <CurrentUserProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/profile/:userId" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/folder/:folderId" element={<FolderView />} />
          <Route path="dashboard/folder/:folderId/note/:noteId" element={<NoteView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CurrentUserProvider>
  );
}

export default App;
