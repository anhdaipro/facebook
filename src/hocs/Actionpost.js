import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify,showreport, uploadpost } from "../actions/auth";
import { actioncommentURL,actionpostURL, listcommentreplyURL, commentreplyURL, originurl } from "../urls";
import { number,timeago,listemoji,listaction } from "../constants";
const style={backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}
const listactionpost=[
    {name:'Gim bài viết',style:{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/wa_Q-yYDB_6.png)`, backgroundPosition: '0px -200px',...style },action:'gim',author:true},
    {name:'Lưu bài viết',style:{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: '0px -439px', ...style},action:'savepost',author:true,viewer:true},
    {name:'Ai có thể bình luận về bài viết của bạn?',style:{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/wa_Q-yYDB_6.png)`, backgroundPosition: '0px -137px', ...style},action:'limit',author:true},
    {name:'Chỉnh sửa bài viết',style:{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/WqTMwWy4BYV.png)`, backgroundPosition: '0px -505px', ...style},action:'editpost',author:true}, 
    {name:'Chỉnh sửa đối tượng',action:'editviewer',author:true,src:'https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/TqZgqgZsIOi.png'},
    {name:'Tắt thông báo cho bài viết này',style:{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/7URhQzXI84n.png)`, backgroundPosition: '0px -232px', ...style},action:'turnoff',author:true,viewer:true},
    {name:'Chỉnh sửa ngày',style:{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: '0px -502px', ...style},action:'editday',author:true},
    {name:'Chuyển vào kho lưu trữ',style:{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y4/r/6X1iSiVg1RD.png)`, backgroundPosition: '0px 0px', ...style},author:true,action:'save'},
    {name:'Chuyển vào thùng rác',style:{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: '0px -1279px', ...style},author:true,action:'delete'},
    {name:'Báo cáo bài viêt',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/0lXA3kApbrr.png',action:'report',viewer:true}
]
const Actionpost=(props)=>{
    const {post,user,showactionport,uploadpost,setitem,showreport}=props
    const [state, setState] = useState({show_action:false})
    const actionref=useRef()
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [state])
    console.log(user)
    const handleClick = (event) => {
        const { target } = event
        if(actionref.current!=null){
            if (!actionref.current.contains(target)) {
                setState({...state,show_action:false})
            }
        }
    }
    const setactionpost=(e,value)=>{
        if(value=='turnoff'){
            let data={action:value}
            axios.post(`${actionpostURL}/${post.id}`,JSON.stringify(data),headers)
            .then(res=>{
                if(post.turnon){
                    alert('đã tắt thông báo cho bài viết này')
                }
                alert('đã bật thông báo cho bài viết này')
                setitem({...post,turnon:!post.turnon})
                setState({...state,show_action:false})
            })
        }
        else if(value=='report'){
            const data={id:post.id,type:'post',show:true}
            showreport(data)
        }
        else{
            axios.get(`${actionpostURL}/${post.id}?action=${value}`,headers)
            .then(res=>{
                if(value=='savepost'){
                    if(post.saved){
                        setitem({...post,saved:false})
                    }
                    else{
                        showactionport({action:'post',type:value,collections:res.data,id:post.id})
                    }
                }
                else if(value=='editpost'){
                    const data={addfile:true,...res.data,show:true}
                    uploadpost(data)
                }
                else if(value=='editday'){
                    const data={action:'post',type:value,date:post.posted,id:post.id}
                    showactionport(data)
                }
                
                else{
                    showactionport({viewer:{value:post.viewer},id:post.id,listspecific:res.data.list_specific,listexcept:res.data.list_except,action:'addviewer'})  
                }
            })
        }
        
    }
    return(
        
            <div ref={actionref}>
                <span onClick={(e)=>setState({...state,show_action:!state.show_action})} class="fas fa-ellipsis-h item-center flex three-dot" id="three-dot-btn-click">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" class=""><g fill-rule="evenodd" transform="translate(-446 -350)"><path d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path></g></svg>
                </span>
                {state.show_action?
                <div class="three-dot-div" id="three-dot-btn-show">
                    <ul>
                       
                        {listactionpost.map((item,i)=>{
                            if(user.id==post.user.id){
                                if(item.author){
                                    return(
                                    <>
                                        <li key={i} onClick={e=>setactionpost(e,item.action)}>
                                            {item.style?
                                            <i className="hu5pjgll lzf7d6o1 tvfksri0" style={post.saved && item.action=='savepost'?{...item.style,backgroundImage: `url("https://static.xx.fbcdn.net/rsrc.php/v3/ys/r/OQenRY7_MMr.png")`, backgroundPosition: `0px -274px`}:post.turnon && item.action=='turnoff'?{...item.style,backgroundImage: `url("https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/7URhQzXI84n.png")`, backgroundPosition: '0px -211px'}:item.style}></i>:
                                            <img class="hu5pjgll lzf7d6o1 tvfksri0" src={item.src} alt="Công khai" height="20" width="20"/>
                                            }
                                            {post.saved && item.action=='savepost'?'Bỏ lưu bài viết':item.name}

                                        </li>
                                        {i==1 || i==listactionpost.length-3?
                                        <hr class="list-hr-three-dot"/>:''}
                                    </>)
                                }
                                
                                return(<></>)
                                
                            }
                            else{
                                if(item.viewer){
                                    return(
                                        <>
                                            <li key={i} onClick={e=>setactionpost(e,item.action)}>
                                                {item.style?
                                                <i className="hu5pjgll lzf7d6o1 tvfksri0" style={post.saved && item.action=='savepost'?{...item.style,backgroundImage: `url("https://static.xx.fbcdn.net/rsrc.php/v3/ys/r/OQenRY7_MMr.png")`, backgroundPosition: `0px -274px`}:post.turnon && item.action=='turnoff'?{...item.style,backgroundImage: `url("https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/7URhQzXI84n.png")`, backgroundPosition: '0px -211px'}:item.style}></i>:
                                                <img class="hu5pjgll lzf7d6o1 tvfksri0" src={item.src} alt="Công khai" height="20" width="20"/>
                                                }
                                                {post.saved && item.action=='savepost'?'Bỏ lưu bài viết':!post.turnon && item.action=='turnoff'?'Bật thông báo cho bài viết này':item.name}
    
                                            </li>
                                            {i<listactionpost.length-1?
                                            <hr class="list-hr-three-dot"/>:''}
                                        </>)
                                }
                                return(<></>)
                            }
                        })}
                        
                    </ul>

                </div>:""}
            </div>
        )
    }
export default Actionpost