
import React,{useState,useEffect, useRef} from 'react';
import axios from 'axios';
import { headers,expiry,showchat,uploadpost } from '../actions/auth';
import { connect } from 'react-redux';
import Navbar from "./Navbar"
import Sibamenu from './Sibamenu';
import { listfriendURL,chatgroupURL, originurl ,liststoryfriendURL,listpostURL, conversationsURL, countpostURL} from '../urls';
import RoomchatCreate from './Roomchat';
import { Navigate,useNavigate } from 'react-router';
import { listbackground, timeago } from '../constants';
import Postdetail from './Post';
import io from "socket.io-client"
const Homepage=(props)=>{
    const {user, isAuthenticated,post,showchat,datachat,uploadpost}=props
    const navigate =useNavigate()
    const [listfriend,setListfriend]=useState([])
    const [listgroup,setListgroup]=useState([])
    const [state,setState]=useState({addpost:false,addfile:false})
    const [liststories,setListstories]=useState([])
    const [listpost,setListpost]=useState([])
    const [count,setCount]=useState(0)
    const [loading,setLoading]=useState(false)
    const [actionchat,setActionchat]=useState()
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket =useRef()
    console.log(post)
    useEffect(() => { 
        socket.current=io.connect('https://server-socket-123.herokuapp.com')
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
             users
            );
        });
       
        return () => socket.current.disconnect()
    },[])
    console.log(onlineUsers)
    
    useEffect(()=>{
        if(datachat){
            setActionchat(datachat)
        }
    },[datachat])
    console.log(datachat)
    
    useEffect(()=>{
        (async ()=>{
            try{
                await isAuthenticated
                const [obj1, obj2,obj3,obj4,obj5] = await axios.all([
                    axios.get(listfriendURL,headers),
                    axios.get(liststoryfriendURL,headers),
                    axios.get(listpostURL,headers),
                    axios.get(countpostURL,headers),
                    axios.get(chatgroupURL,headers),
                ])
                setListfriend(obj1.data)
                setListstories(obj2.data)
                const data=obj3.data.map(item=>{
                    return({...item,show_share:false,show_action:false,emotioned:item.express_emotions?true:false})
                })
                setLoading(true)
                setListpost(data)
                setListgroup(obj5.data)
                setCount(obj4.data.count)
            }
            catch{

            }
        })()
    },[])


    window.onscroll=()=>{
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if(clientHeight + scrollTop >= scrollHeight-300 && loading && listpost.length<count){
            setLoading(false)
            axios(`${listpostURL}?from_item=${listpost.length}`,headers)
            .then(res=>{
                setLoading(true)
                let data=res.data
                const datapost=[...listpost,...data]
                setListpost(datapost)
            })
        }
    }
     
    const setstate=(data)=>{
        setState(data)
    }
    
    const setlistpost=(data)=>{
        setListpost(data)
    }
    const  setshowchat=(e,item)=>{
        e.preventDefault()
        let data={member:item.id!=user.id?[item.id,user.id]:[user.id],thread:null}
        showchat(data)
    } 

    const showchatgroup=(e,thread)=>{
        (async()=>{
            try{
                const res =await axios.get(`${conversationsURL}/${thread.id}`,headers)
                const datachat={thread:{id:thread.id,count_message:thread.count_message},members:thread.members,show:true,messages:res.data}
                showchat(datachat)
            }
            catch(e){
                console.log(e)
            }
        })()  
    } 
    return(
    <>
   
        <div id="main">
            <Navbar
           
            />
            {user?
            <div class="container">
                    <Sibamenu
                    user={user}
                />
                <div class="middle-panel">
                    <div className="flex-center flex-col">
                        <div class="story-section">
                            <div onClick={e=>navigate('/stories/create')} class="story create">
                                <div class="dp-image">
                                    <img src={originurl+user.avatar} alt="Profile pic"/>
                                </div>
                                <span class="dp-container">
                                    <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 ljqsnud1 jnigpg78 odw8uiq3"><g fill-rule="evenodd" transform="translate(-446 -350)"><g fill-rule="nonzero"><path d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z" transform="translate(354.5 159.5)"></path><path d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z" transform="translate(354.5 159.5)"></path></g></g></svg>
                                </span>
                                <div className="cwj9ozl2 j83agx80 pfnyh3mw taijpn5t dhxd5tqv hv4rvrfc f10w8fjw dati1w0a l9j0dhe7">
                                    <span class='d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn iv3no6db e9vueds3 j5wam9gi lrazzd5p oo9gr5id oqcyycmt'>Create Story</span>
                                </div>
                            </div>

                            {liststories.map(story=>
                                <div onClick={()=>navigate(`/stories/${story.user_id}`)} key={story.id} class="story">
                                    <img src={story.file?originurl+story.file:listbackground.find(item=>item.index==JSON.parse(story.caption).id).src} alt="Anuska's story"/>
                                    <div class="dp-container">
                                        <img src={originurl+story.avatar} alt=""/>
                                    </div>
                                    <p class="name">{story.name}</p>
                                </div>
                            )}
                        
                        </div>
                        <div class="post create">
                            <div class="post-top">
                                <div class="dp">
                                    <img src={originurl+ user.avatar} alt=""/>
                                </div>
                                <div className="div-input" onClick={(e)=>{
                                    const data={show:true}
                                    uploadpost(data)
                                    }}>
                                    <input type="text" placeholder={`What's on your mind, ${user.name}?`} />
                                </div>
                            </div>
                            
                            <div class="post-bottom">
                                <div class="action flex flex-center">
                                    <span class="pq6dq46d kb5gq1qc pfnyh3mw oi9244e8">
                                        <svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 fxtw5amg rgmg9uty b73ngqbp"><g fill-rule="evenodd" transform="translate(-444 -156)"><g><path d="M113.029 2.514c-.363-.088-.746.014-1.048.234l-2.57 1.88a.999.999 0 0 0-.411.807v8.13a1 1 0 0 0 .41.808l2.602 1.901c.219.16.477.242.737.242.253 0 .508-.077.732-.235.34-.239.519-.65.519-1.065V3.735a1.25 1.25 0 0 0-.971-1.22m-20.15 6.563c.1-.146 2.475-3.578 5.87-3.578 3.396 0 5.771 3.432 5.87 3.578a.749.749 0 0 1 0 .844c-.099.146-2.474 3.578-5.87 3.578-3.395 0-5.77-3.432-5.87-3.578a.749.749 0 0 1 0-.844zM103.75 19a3.754 3.754 0 0 0 3.75-3.75V3.75A3.754 3.754 0 0 0 103.75 0h-10A3.754 3.754 0 0 0 90 3.75v11.5A3.754 3.754 0 0 0 93.75 19h10z" transform="translate(354 158.5)"></path><path d="M98.75 12c1.379 0 2.5-1.121 2.5-2.5S100.129 7 98.75 7a2.503 2.503 0 0 0-2.5 2.5c0 1.379 1.121 2.5 2.5 2.5" transform="translate(354 158.5)"></path></g></g></svg>
                                    </span>
                                    <span>Live video</span>
                                </div>
                                <div onClick={(e)=>{
                                    const data={show:true,addfile:true}
                                    uploadpost(data)
                                    }} class="action flex flex-center">
                                    <span class="pq6dq46d kb5gq1qc pfnyh3mw oi9244e8">
                                        <svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 j58f7537 rgmg9uty b73ngqbp"><g fill-rule="evenodd" transform="translate(-444 -156)"><g><path d="m96.968 22.425-.648.057a2.692 2.692 0 0 1-1.978-.625 2.69 2.69 0 0 1-.96-1.84L92.01 4.32a2.702 2.702 0 0 1 .79-2.156c.47-.472 1.111-.731 1.774-.79l2.58-.225a.498.498 0 0 1 .507.675 4.189 4.189 0 0 0-.251 1.11L96.017 18.85a4.206 4.206 0 0 0 .977 3.091s.459.364-.026.485m8.524-16.327a1.75 1.75 0 1 1-3.485.305 1.75 1.75 0 0 1 3.485-.305m5.85 3.011a.797.797 0 0 0-1.129-.093l-3.733 3.195a.545.545 0 0 0-.062.765l.837.993a.75.75 0 1 1-1.147.966l-2.502-2.981a.797.797 0 0 0-1.096-.12L99 14.5l-.5 4.25c-.06.674.326 2.19 1 2.25l11.916 1.166c.325.026 1-.039 1.25-.25.252-.21.89-.842.917-1.166l.833-8.084-3.073-3.557z" transform="translate(352 156.5)"></path><path fill-rule="nonzero" d="m111.61 22.963-11.604-1.015a2.77 2.77 0 0 1-2.512-2.995L98.88 3.09A2.77 2.77 0 0 1 101.876.58l11.603 1.015a2.77 2.77 0 0 1 2.513 2.994l-1.388 15.862a2.77 2.77 0 0 1-2.994 2.513zm.13-1.494.082.004a1.27 1.27 0 0 0 1.287-1.154l1.388-15.862a1.27 1.27 0 0 0-1.148-1.37l-11.604-1.014a1.27 1.27 0 0 0-1.37 1.15l-1.387 15.86a1.27 1.27 0 0 0 1.149 1.37l11.603 1.016z" transform="translate(352 156.5)"></path></g></g></svg>
                                    </span>
                                    <span>Photo/Video</span>
                                </div>
                                <div onClick={(e=>{
                                    const data={addemotion:true,show:true}
                                    uploadpost(data)
                                    })} class="action flex flex-center">
                                    <span class="pq6dq46d kb5gq1qc pfnyh3mw oi9244e8">
                                        <svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 mu8pnim0 rgmg9uty b73ngqbp"><g fill-rule="evenodd" transform="translate(-444 -156)"><g><path d="M107.285 13c.49 0 .841.476.712.957-.623 2.324-2.837 4.043-5.473 4.043-2.636 0-4.85-1.719-5.473-4.043-.13-.48.222-.957.712-.957h9.522z" transform="translate(353.5 156.5)"></path><path fill-rule="nonzero" d="M114.024 11.5c0 6.351-5.149 11.5-11.5 11.5s-11.5-5.149-11.5-11.5S96.173 0 102.524 0s11.5 5.149 11.5 11.5zm-2 0a9.5 9.5 0 1 0-19 0 9.5 9.5 0 0 0 19 0z" transform="translate(353.5 156.5)"></path><path d="M99.524 8.5c0 .829-.56 1.5-1.25 1.5s-1.25-.671-1.25-1.5.56-1.5 1.25-1.5 1.25.671 1.25 1.5m8.5 0c0 .829-.56 1.5-1.25 1.5s-1.25-.671-1.25-1.5.56-1.5 1.25-1.5 1.25.671 1.25 1.5m-.739 4.5h-9.522c-.49 0-.841.476-.712.957.623 2.324 2.837 4.043 5.473 4.043 2.636 0 4.85-1.719 5.473-4.043.13-.48-.222-.957-.712-.957m-2.165 2c-.667.624-1.592 1-2.596 1a3.799 3.799 0 0 1-2.596-1h5.192" transform="translate(353.5 156.5)"></path></g></g></svg>
                                    </span>
                                    <span>Feeling/Activity</span>
                                </div>
                            </div>
                        </div>
                        
                        <RoomchatCreate
                            user={user}
                            listfriend={listfriend}
                        />
                        <img class="j1lvzwm4" height="18" role="presentation" src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" width="18"/>
                        <div className="list-post">
                            {listpost.map(item=>
                            <Postdetail
                                post={item}
                                user={user}
                                onlineUsers={onlineUsers}
                            />
                            )}
                        </div>  
                    </div>
                </div>
                <div class="right-panel">
                    <div class="friends-section relative">
                        <h4>Ng?????i li??n h???</h4>
                        <div>
                        {listfriend.map(item=>
                            <a onClick={e=>setshowchat(e,item)} key={item.id} class='friend' href="#">
                                <div class="dp">
                                    <img src={originurl+item.avatar} alt=""/>
                                    {onlineUsers.some(user=>user.userId==item.id)?
                                    <div style={{bottom: '5px',right: '5px',transform: 'translate(50%, 50%)'}} className="s45kfl79 emlxlaya bkmhp75w spb7xbtv pmk7jnqg kavbgo14">                           
                                        <span class="status-online" data-visualcompletion="ignore"></span>            
                                    </div>:
                                    <div style={{bottom: '5px',right: '5px',transform: 'translate(50%, 50%)'}} className="s45kfl79 emlxlaya bkmhp75w spb7xbtv pmk7jnqg kavbgo14">
                                        <span class="status-offline" data-visualcompletion="ignore"></span>
                                    </div>}
                                </div>
                                <p class="name">{item.name}</p>
                            </a>
                        )} 
                        </div>                   
                    </div>
                    <div class="re5koujm pmk7jnqg ay7djpcl cypi58rs qee0rdz8 pwoa4pd7"></div>
                    <div class="group-section py-1">
                        <h4>Cu???c tr?? chuy???n nh??m</h4>
                        <div>
                        {listgroup.map(item=>
                            <div onClick={e=>showchatgroup(e,item)} key={item.id} class='friend flex-center flex' href="#">
                                <div class="dp flex">
                                    {item.members.find(member=>member.user_id!=user.id)?
                                    item.members.filter(member=>member.user_id!=user.id).map((member,i)=><>
                                    {i<2?
                                    <div className={`pmk7jnqg ${i==0?'i09qtzwb j9ispegn':'n7fi1qx3 kr520xx4'}`}>
                                        <img src={originurl+member.avatar} height='24' width='24' alt=""/>
                                    </div>:''}</>):<div><img src={originurl+user.avatar} height='48' width='48' alt=""/></div>}
                                    <div style={{bottom: '5px',right: '5px',transform: 'translate(50%, 50%)'}} className="s45kfl79 emlxlaya bkmhp75w spb7xbtv pmk7jnqg kavbgo14">                           
                                        <span class="status-online" data-visualcompletion="ignore"></span>            
                                    </div>
                                </div>
                                <span class="name">
                                {item.members.find(member=>member.user_id!=user.id)?
                                item.members.filter(member=>member.user_id!=user.id).map((member,i)=>`${member.name}${i<item.members.filter(member=>member.user_id!=user.id).length-2?', ':i==item.members.filter(member=>member.user_id!=user.id).length-2?' v?? ':''}`):user.name}
                                </span>
                            </div>
                        )} 
                        </div>  
                        <div>
                            <div className="flex flex-center">
                                <div class="j83agx80 cbu4d94t tvfksri0 aov4n071 bi6gxh9e l9j0dhe7 nqmvxvec m6uieof3 icc0peqn hx8drtub j13r6fgp nddp3pr2">
                                    <div class="s45kfl79 emlxlaya bkmhp75w spb7xbtv bp9cbjyn rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv pq6dq46d taijpn5t l9j0dhe7 tdjehn4e tv7at329 thwo4zme">
                                        <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage:`url('https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/9TwAIBugiaE.png')`,backgroundPosition:`0 -1006px`,backgroundSize:'auto',width:'20px',height:'20px',backgroundRepeat:'no-repeat',display:'inline-block'}}></i>
                                    </div>
                                </div>
                                <div class="qzhwtbm6 knvmm38d"><span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v ekzkrbhg oo9gr5id hzawbc8m" dir="auto">T???o nh??m m???i</span></div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>:''}
        </div>
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,
    datachat:state.datachat
});
  
export default connect(mapStateToProps,{showchat,uploadpost})( Homepage);
