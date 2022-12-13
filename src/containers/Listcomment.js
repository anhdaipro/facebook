import Addcomment from "./Addcomment";
import Comment from "./Comment";
import { listemoji, listitem, number } from "../constants"
import { originurl,listcommentURL, commentreplyURL } from "../urls"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import { connect } from 'react-redux';
import { expiry, headers,showreport,showactionport } from '../actions/auth';
import Tooltip from "../hocs/Tooltip";
import Actionsharepost from "../hocs/Actionsharepost";
import axios from 'axios';
import { EditorState,convertToRaw,Modifier, KeyBindingUtil,getDefaultKeyBinding } from 'draft-js';
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';
import io from "socket.io-client"
const Listcomment=(props)=>{
    const {user,setitem,url,urlcomment,
    item,onlineUsers}=props
    const [commentreply,setCommentreply]=useState()
    const [childcommentreply,setchildCommentreply]=useState()
    const [tags,setTags]=useState(null)
    const [actioncomment,setActioncomment]=useState('add-comment')
    const [replyer,setReplyer]=useState([])
    const [state,setState]=useState({emotion_post:false})
    const [listemotions,setListemotions]=useState([])
    const [emojichoice,setEmojichoice]=useState()
    const [listcomment,setListcomment]=useState([])
    const socket=useRef()
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    
    useEffect(() => { 
        socket.current=io.connect('https://server-socket-123.herokuapp.com')
        socket.current.on("comment", (data) => {
            if(data.id && data.id==item.id){
            setListcomment(data.listcomment)
            }
        });
        return () => socket.current.disconnect()
    },[listcomment])
    
    useEffect(() => { 
        socket.current.on("post", (data) => {
            const expess_emotion_user=item.express_emotions
            console.log(data)
            if(data.id && data.id==item.id){
                const expess_emotion={express_emotions:user.id!=data.user_id?expess_emotion_user:data.express_emotions}
                setitem({...data,...expess_emotion})
            }
        });
    },[item])

    const stateWithEntity = editorState.getCurrentContent().createEntity(
        'mention',
        'SEGMENTED',
        {
          mention: replyer,
        },
    )
    const entityKey = stateWithEntity.getLastCreatedEntityKey()
    const stateWithText = Modifier.insertText(stateWithEntity, editorState.getSelection(), replyer?replyer.name:null, null, entityKey)
    const settag=useCallback((e,value)=>{
        setReplyer(value)
    },[replyer])
    const setdefaultemojipost=(e,value)=>{
        (async()=>{
            try{
                e.stopPropagation()
                let form=new FormData()
                form.append('emoji','like')
                form.append('action','emotion')
                const res=await item.express_emotions!=null?axios.post(`${url}/${item.id}`,JSON.stringify({action:'emotion'}),headers):axios.post(`${url}/${item.id}`,form,headers)
                if(!item.emotioned && user.id!=item.user.id){
                    socket.current.emit('sendNotifi',res.data.listnotifications)
                }
                const datapost={...item,list_emoji:res.data.list_emoji,user_id:user.id,count_express_emotions:item.express_emotions?item.count_express_emotions-1:item.count_express_emotions+1,express_emotions:item.express_emotions?null:'like',id:item.id}
                socket.current.emit('actionPost',datapost)
            }
            catch{

            }
        })()
    }
    
    const setemojipost=(e,emoji)=>{ 
        (async()=>{
            try{
                e.stopPropagation()
                let form=new FormData()
                form.append('emoji',emoji)
                form.append('action','emotion')
                const res =await axios.post(`${url}/${item.id}`,form,headers)
                if(!item.emotioned && !state.emotion_post && user.id!=item.user.id){
                    socket.current.emit('sendNotifi',res.data.listnotifications)
                }
                setState({...state,emotion_post:true})
                const datapost={...item,list_emoji:res.data.list_emoji,user_id:user.id,emotioned:true,express_emotions:emoji,id:item.id}
                socket.current.emit('actionPost',datapost)
            }
            catch{

            }
        })()
    }

    const setshowuser=(e,emoji)=>{
        (async()=>{
            try{
               const res = await axios.get(`${url}/${item.id}?emoji=${emoji}`,headers)
               setListemotions(res.data)
               setEmojichoice(emoji)
            }
            catch{
            }
        })()
    }
    
    const setlistcomment=useCallback((data)=>{
        setListcomment(data)
    },[listcomment])

    const setcomment=useCallback((e,commentchoice,name,value,name_choice,value_choice)=>{
        const comments=listcomment.map(item=>{
            if(item.id==commentchoice.id){
                if(name_choice!=undefined){
                    return ({...item,[name]:value,[name_choice]:value_choice})
                }
                return ({...item,[name]:value})
            }
            return ({...item})
        })
        setListcomment(comments)
    },[listcomment])

    console.log(listcomment)
    const showcomment=(e)=>{
        (async()=>{
            try{
                e.stopPropagation()
                const res = await axios.get(`${urlcomment}/${item.id}`,headers)
                const data=res.data.map(item=>{
                    return({...item,show_action:false,emotioned:item.express_emotions?true:false})
                })
                setListcomment(data)
            }
            catch{
                console.log('err')
            }
        })()
    }
    
    return(
        <>
            <div className="post-react-show">
                <div className="like-count-and-icon">
                    <ul>
                        {item.express_emotions?
                        <li onMouseEnter={e=>setshowuser(e,item.express_emotions)} className="love-count-icon">
                            <Tooltip
                            content={emojichoice==item.express_emotions?<ul> 
                                {listemotions.map(emoji=>
                                <li>{emoji.name}</li>
                                )}
                                
                            </ul>:<div className="item-center flex">
                                <div className="loader"></div>
                            </div>}
                            position='bottom'
                            >
                            <img height='18' src={listemoji.find(emojis=>emojis.emoji==item.express_emotions).src}/>
                            </Tooltip>
                        </li>
                        :''}
                        {item.list_emoji?<>
                        {item.list_emoji.filter(emoji =>emoji.emotion!=item.express_emotions).map(emoji=>
                        <li onMouseEnter={e=>setshowuser(e,emoji.emotion)} className="love-count-icon">
                            <Tooltip
                            content={emojichoice==emoji.emotion?<ul> 
                                {listemotions.map(emoji=>
                                <li>{emoji.name}</li>
                                )}
                                
                            </ul>:<div className="item-center flex">
                                <div className="loader"></div>
                            </div>}
                            position='bottom'
                            >
                            <img height='18' src={listemoji.find(emojis=>emojis.emoji==emoji.emotion).src}/>
                            </Tooltip>
                        </li>
                        )}</>
                        :''}
                        
                        <div className="like-count-div">
                            <Tooltip
                            content={<ul>
                                {item.express_emotions?<li>{user.name}</li>:''}
                                {item.list_emoji?<>
                                {item.list_emotioner.filter(users =>users!=user.name).map(users=>
                                <li>{users}</li>
                                )}</>:''}
                                {item.count_express_emotions>10?<li>và {item.count_express_emotions-item.list_emotioner.length} người khác</li>:''}
                            </ul>}
                            position='bottom'
                        >
                            {item.count_express_emotions>0 || item.express_emotions?<a href="#" id="like-count-value">{item.express_emotions&&item.count_express_emotions>1?`Bạn và ${number(item.count_express_emotions-1)} người khác`:item.express_emotions?user.name:`${number(item.count_express_emotions)}`}</a>:''}
                            </Tooltip>
                        </div>
                        
                    </ul>
                </div>

                <div className="comment-and-share-count">
                    <ul>
                        {item.count_comment>0?<li className="comment-count">{number(item.count_comment)} bình luận</li>:''}
                        {item.count_share>0?<li className="share-count">{number(item.count_share)} chia sẻ</li>:''}
                    </ul>
                </div>
            </div>

            <div className="button-site">
                <div className="like-btn comment-btn" id="Like-Button">
                    
                    <div onClick={(e)=>setdefaultemojipost(e,'like')} className="item-center flex" id="like_lite_button">
                        <div className="icon-match comment-pose flex item-center">
                        {item.express_emotions!=null?
                        <img alt="Thương thương" className="" height="18" src={listemoji.find(emoji=>emoji.emoji==item.express_emotions).src}/>:
                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url('https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/wC-PkLKHXz3.png')`, backgroundPosition: '0px -322px', backgroundSize: 'auto', width: '18px', height: '18px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        }
                        </div>
                        <span style={{color:`${item.express_emotions?listemoji.find(emoji=>emoji.emoji==item.express_emotions).color:''}`}}>{item.express_emotions?listemoji.find(emoji=>emoji.emoji==item.express_emotions).name:'Like'}</span>
                    </div>

                    

                    <div className="hover-window-like">
                        <ul>
                            
                            {listemoji.map((emoji,i)=>
                            <li onClick={e=>setemojipost(e,emoji.emoji)} className="like-gif-img">
                            <Tooltip
                                content={emoji.name}
                                position='top'
                                style={{marginRight:`${i<listemoji.length-1?12:0}px`}}
                            >
                            
                                <img src={emoji.src}/>
                            
                            </Tooltip>
                            </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="comment-btn" id="Comment-btn">
                    <div onClick={(e)=>showcomment(e)} className="comment-center-div" id="comment-btn">
                        <div className="icon-match comment-pose flex item-center">
                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/wC-PkLKHXz3.png)`, backgroundPosition: '0px -284px', backgroundSize: 'auto', width: '18px', height: '18px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                        <span>Comment</span>
                    </div>
                </div>

            <Actionsharepost
            post={item}
            user={user}
            />

                <div className="share-btn2">
                    <div className="share-center-div" id="share-btn">
                        <div className="icon-match share-pose">
                            <img src="images/icon/icon.png"/>
                        </div>
                        <span>Share</span>
                    </div>
                </div>
            </div>
            <div className="all-comment-show">
                <div className="hader-comment-div">
                    <span className="comment-count-show">
                        View <span id="comment-count-value">1</span> more comment
                    </span>
                    <span className="comment-count-filter">
                        <span id="comment-filter">All Comments</span>
                        <i className="fas fa-caret-down"></i>
            
                    </span>
                </div>
                <div className="treeview js-treeview">    
                {listcomment.filter(item=>item.parent==null).map(parent=>
                    <ul  className="parent">
                        <li className="children">
                            <Comment
                                setlistcomment={data=>setlistcomment(data)}
                                socket={socket}
                                listcomment={listcomment}
                                tags={tags}
                                comment={parent}
                                url={urlcomment}
                                item={item}
                                onlineUsers={onlineUsers}
                                setcommentreply={()=>setCommentreply(parent)}
                                commentreply={commentreply}
                                actioncomment={actioncomment}
                                setactioncomment={(data)=>setActioncomment(data)}
                                settag={(e,commentchoice)=>settag(e,commentchoice)}
                                setcomment={(e,parent,name,value,name_choice,value_choice)=>setcomment(e,parent,name,value,name_choice,value_choice)}
                            />
                            {commentreply || listcomment.filter(item=>item.parent==parent.id).length>0?
                                <ul  className="tiktok-zn6r1p-DivReplyContainer e192jtdb1 parent">
                                    {listcomment.filter(item=>item.parent==parent.id).map(children=>
                                    <li  className="children">
                                        <Comment 
                                        comment={children}
                                        socket={socket}
                                        parent={parent}
                                        item={item}
                                        url={urlcomment}
                                        setactioncomment={(data)=>setActioncomment(data)}
                                        listcomment={listcomment}
                                        actioncomment={actioncomment}
                                        onlineUsers={onlineUsers}
                                        commentreply={childcommentreply}
                                        
                                        setcommentreply={()=>setchildCommentreply(children)}
                                        setlistcomment={data=>setlistcomment(data)}
                                        setcomment={(e,children,name,value,name_choice,value_choice)=>setcomment(e,children,name,value,name_choice,value_choice)}
                                        tags={tags}
                                        settag={(e,commentchoice)=>settag(e,commentchoice)}
                                        />
                                        {childcommentreply || listcomment.filter(item=>item.parent==children.id).length>0?
                                        <ul className="parent tiktok-zn6r1p-DivReplyContainer e192jtdb1 mb-8">
                                            {listcomment.filter(item=>item.parent==children.id).map(grandchildren=>
                                            <li className="children">
                                                <Comment
                                                    setlistcomment={data=>setlistcomment(data)}
                                                    socket={socket}
                                                    listcomment={listcomment}
                                                    tags={tags}
                                                    parent={children}
                                                    item={item}
                                                    grandfather={parent}
                                                    url={urlcomment}
                                                    onlineUsers={onlineUsers}
                                                    commentreply={childcommentreply}
                                                    setcommentreply={()=>setchildCommentreply(children)}
                                                    comment={grandchildren}
                                                    actioncomment={actioncomment}
                                                    setactioncomment={(data)=>setActioncomment(data)}
                                                    settag={(e,commentchoice)=>settag(e,commentchoice)}
                                                    setcomment={(e,parent,name,value,name_choice,value_choice)=>setcomment(e,parent,name,value,name_choice,value_choice)}
                                                />
                                            </li>
                                            )}
                                            {childcommentreply && childcommentreply.id==children.id?
                                            <li className="children">
                                                <div className="flex mb-8">
                                                    <a href="#"><div className="profile-images comment-PI">
                                                        <img src={originurl + user.avatar}/>
                                                            <div className={`${onlineUsers.some(user=>user.userId==item.user.id)?'online-icon':'offline_icon'} o_F-CPI`}></div>
                                                        </div>
                                                    </a>
                                                    <Addcomment
                                                    socket={socket}
                                                    item={item}
                                                    actioncomment={actioncomment}
                                                    parent={childcommentreply}    
                                                    setitem={(value)=>setitem(value)}
                                                    user={user}
                                                    url={url}
                                                    setactioncomment={data=>setActioncomment(data)}
                                                    setcommentreply={()=>setchildCommentreply()}
                                                    replyer={replyer}
                                                    stateWithText={stateWithText}
                                                    listcomment={listcomment}
                                                    setlistcomment={(data)=>setlistcomment(data)}
                                                    /></div>
                                                </li>:''}
                                        </ul>:''}
                                    </li>
                                )}
                                {commentreply && commentreply.id==parent.id?
                                <li className="children">
                                    <div className="flex mb-8">
                                    <a href="#"><div className="profile-images comment-PI">
                                        <img src={originurl + user.avatar}/>
                                            <div className={`${onlineUsers.some(user=>user.userId==item.user.id)?'online-icon':'offline_icon'} o_F-CPI`}></div>
                                        </div>
                                    </a>
                                    <Addcomment
                                    socket={socket}
                                    item={item}
                                    actioncomment={actioncomment}
                                    parent={commentreply}   
                                    setitem={(value)=>setitem(value)}
                                    user={user}
                                    url={url}
                                    setactioncomment={data=>setActioncomment(data)}
                                    setcommentreply={()=>setCommentreply()}
                                    replyer={replyer}
                                    stateWithText={stateWithText}
                                    listcomment={listcomment}
                                    setlistcomment={(data)=>setlistcomment(data)}
                                    />
                                    </div>
                                    </li>:''}
                            </ul>:''}
                        </li>
                    </ul>
                )}
            
                </div>
            </div>
        
            <div className="comment-input-aria" id="Comment_Aria">
                <div className="flex" style={{width:'100%'}}>
                    <a href="#">
                        <div className="profile-images comment-PI">
                            <img src={user.avatar}/>
                            <div className={`online-icon o_F-CPI`}></div>
                        </div>
                    </a>
                    <Addcomment
                        socket={socket}
                        actioncomment={actioncomment}
                        item={item}
                        setitem={(value)=>setitem(value)}
                        parent={null}
                        url={url}
                        user={user}
                        tags={tags}
                        listcomment={listcomment}
                        setactioncomment={data=>setActioncomment(data)}
                        setlistcomment={(data)=>setlistcomment(data)}
                    />
                </div>
            </div> 
        </>
    )
}
export default Listcomment