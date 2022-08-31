
import './css/login.css'
import './css/base.css'
import './css/signup.css'
import './css/navbar.css'
import './css/home.css'
import './css/post.css'
import './css/stories.css'
import './css/postdetail.css'
import './css/comment.css'
import './css/report.css'
import './css/profile.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Login from "./users/Login"
import Layout from "./hocs/Layout"
import { Provider } from 'react-redux'
import store  from "./store"
import Homepage from './containers/Home';
import Storycreate from './users/Storycreate'
import Profile from './users/Profile'
import Story from "./containers/Story"
import Storyuser from './containers/Storyuser'
import File from './containers/File'
import Mediathread from './containers/Mediathread'
import Filethread from './containers/Filethread'
import Homefriend from './containers/friends/Home'
import Listfriend from './containers/friends/List'
import InvitationFriend from './containers/friends/Requests'
import Suggestions from './containers/friends/Suggestions'
const Appstore=()=>{ 
  return(
        <Provider store={store}>
                <BrowserRouter>
                        <Layout>
                                <Routes>
                                        <Route exact path="/" element={<Homepage/>}/>
                                        <Route exact path="photo" element={<File/>}/>
                                        <Route exact path="/friends" element={<Homefriend/>}/>
                                        <Route exact path="/friends/suggestions" element={<Suggestions/>}/>
                                        <Route exact path="/friends/requests" element={<InvitationFriend/>}/>
                                        <Route exact path="/friends/list" element={<Listfriend/>}/>
                                        <Route exact path="/:username" element={<Profile/>}/>
                                        <Route exact path="/stories" element={<Story/>}/>
                                        <Route exact path="/message_media" element={<Mediathread/>}/>
                                        <Route exact path="/message_file" element={<Filethread/>}/>
                                        <Route exact path="/stories/:id" element={<Storyuser/>}/>
                                        <Route exact path="/stories/create" element={<Storycreate/>}/>
                                        <Route exact path="/login" element={<Login/>}/>
                      
                                </Routes>
                        </Layout>
                </BrowserRouter>
        </Provider>
          )
  }
export default Appstore

