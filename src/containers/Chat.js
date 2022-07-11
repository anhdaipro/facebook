
import axios from 'axios';
import React, {useState, useEffect,useCallback,useRef,useMemo} from 'react'
import {conversationsURL,listtagURL,listThreadlURL,uploadfileURL,checkthreadURL,filemessageURL, originurl, createthreadURL} from "../urls"
import { connect } from 'react-redux';
import { headers,expiry, actionchat} from '../actions/auth';
import "../css/chat.css"
import { number,timeago,listemoji,dataURLtoFile,timevalue,checkDay, listactionchat } from "../constants";
import Chatbody from '../hocs/Chatbody';
import {debounce} from 'lodash';
import { NimblePicker } from "emoji-mart";
import data from '@emoji-mart/data'

import { Navigate,useNavigate } from 'react-router';
const style={backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}

const listemojis=Object.keys(data.emojis).map(item=>{
    return(data.emojis[item])
})
console.log(listemojis)
const Message=(props)=>{
    const {showchat,members,messages,thread,isAuthenticated,user,actionchat,datachat}=props
    const [state, setState] = useState({loading_more:false,loading:true,text:'',zoomin:false});
    const [list_messages,setListmessages]=useState([]);
    const[listthread,setListThread]=useState([])
    const [messagegroup,setMessagegroup]=useState([]);
    const [listmembergroup,setListmembergroup]=useState([])
    const [showaction,setShowaction]=useState(false)
    const [show, setShow] = useState(false);
    const [threadgroup,setThreadgroup]=useState();
    const [action,setAction]=useState()
    const [listmember,setListmember]=useState([])
    const [listuser,setListuser]=useState([]);
    const [listtags,setListtags]=useState([]);
    const navigate=useNavigate()
    const contentchat=useRef()
   
    //list thread
    useEffect(() =>  {
        if(showchat){
        setListmember(members)
        setShow(showchat)
        setState({...state,zoomin:false})
        setListmessages(messages.reverse())
        }
    }, [thread,members,messages,showchat]);

    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    
    const handleClick = (event) => {
        const { target } = event
        if(contentchat.current!=null){
            if (!contentchat.current.contains(target)) {
                setShowaction(false)
            }
        }
    }

    const setlistmessage=(data)=>{
        if(action=='create-group'){
        setListmessages(data)
        }
        else{
            setMessagegroup(data)
        }
    }
    const setmessage=(e,item,name,value)=>{
        const listmessages=action=='create-group'
        const datamessage=list_messages.map(message=>{
            if(message.id==item.id){
                return({...message,[name]:value})
            }
            return({...message})
        })
        setListmessages(datamessage)
    }
    console.log(listmember)
    const setactionchat=(e,item)=>{
        setAction(item.action)
        if(item.action=='create-group'){
           setState({...state,addgroup:true})
            const datamembers=listmember.filter(item=>item.user_id!=user.id).map(item=>{
                return({id:item.user_id,name:item.name,avatar:item.avatar})
            })
            console.log(datamembers)
            setListtags([...listtags,...datamembers])
            setShowaction(false)
        }
        else if(item.action=="view-profile"){
            setState({...state,addgroup:false})
            setShowaction(false)
            setShow(false)
            navigate(`/${listmember.find(item=>item.id!=user.id)?listmember.find(item=>item.id!=user.id).username:user.username}`)
        }
        else{
            const data={show:true,thread:thread,members:listmember,action:item.action}
            actionchat(data)
        }
    }
    useEffect(()=>{
    (async()=>{
        try{
            if(listtags.length>1){
                const members=listtags.map(item=>{
                    return(item.id)
                })
                const data={member:[...members,user.id],group:true}
                const res=await axios.post(checkthreadURL,JSON.stringify(data),headers)
                if(res.data.exists){
                    setThreadgroup(res.data.thread)
                    setMessagegroup(res.data.messages)
                    setListmembergroup(res.data.members)
                }  
            }
        }
        catch(e){

        }
    })()
        
    },[listtags])

    const onChange=(e)=>{      
        const value=e.target.value
        setState({...state,text:value})
        fetchkeyword(value)
    }
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
               if(value.trim()!=''){
                const res = await axios.get(`${listtagURL}?keyword=${value}`,headers)
                const datauser=res.data.filter(item=>listtags.every(mention=>mention.id!=item.id))
                setListuser(datauser)
               }
               else{
                   setListuser([])
               }
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[listtags])
    // show actio
    const direact=listmember.find(member=>member.user_id!=user.id)
    const addgroup=(e)=>{
        const members=listtags.map(item=>{
            return(item.id)
        })
        const data={member:[...members,user.id]}
        axios.post(createthreadURL,JSON.stringify(data),headers)
    }
    return(
        <>
        
        <div id="mini-chat-embedded" style={{position: 'fixed', right: '8px', bottom: '0px', zIndex: 999}}>
            {show?
            state.zoomin?
            <div className="j83agx80 bp9cbjyn taijpn5t tmrshh9y m7zwrmfr oud54xpy" style={{transform: `translateY(-58px)`}}>
                <div onMouseLeave={e=>setState({...state,showicon:false})} onMouseEnter={e=>setState({...state,showicon:true})} className="s45kfl79 emlxlaya bkmhp75w spb7xbtv akv41dx8 eb3gnj61 afxn4irw il7rb8sk j1l0snac h9pa7xm5 bnyrfe0q mqussk9c">
                    <div onClick={e=>setState({...state,zoomin:false})} className="l9j0dhe7 nhd2j8a9" style={{height: '48px', width: '48px'}}>
                        <img className="k4urcfbm datstx6m s45kfl79 emlxlaya bkmhp75w spb7xbtv pzggbiyp bixrwtb6" src={`${originurl}${direact?direact.avatar:user.avatar}`} alt=""/>
                        <div aria-hidden="true" className="b5wmifdl qpbg1qsm"></div>
                        <div className="pmk7jnqg" style={{bottom: '7px', right: '7px', transform: `translate(50%, 50%)`}}></div>
                        <div className="mkhogb32 pmk7jnqg jllm4f4h c9rrlmt1 t6na6p9t iruzoqzv n8v90iwk qx7ju95k m8of71z0 i09qtzwb n7fi1qx3 s45kfl79 emlxlaya bkmhp75w spb7xbtv"></div>
                    </div>
                    <div onClick={e=>{
                        setShow(false)
                        setState({...state,zoomin:false})
                    }} aria-label="Đóng đoạn chat" className={`${state.showicon?'':'b5wmifdl'} nhd2j8a9 pixltzyo aew9gpjp bkmhp75w oajrlxb2 pmk7jnqg pixltzyo aew9gpjp j83agx80 bp9cbjyn taijpn5t odw8uiq3 jnigpg78 qpbg1qsm bybyf9sm pnx7fd3z nred35xi s45kfl79 emlxlaya bkmhp75w spb7xbtv`} role="button" tabindex="0">
                        <svg className="pcgkmkmd ditlmg2l arzshmzb nvdbi5me" width="16px" height="16px" viewBox="0 0 24 24"><g stroke-linecap="round" stroke-width="2" stroke="#333"><line x1="6" x2="18" y1="6" y2="18"></line><line x1="6" x2="18" y1="18" y2="6"></line></g></svg>
                    </div>
                    {state.showicon && list_messages.length>0?
                    <div style={{right:'64px'}} class="ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi clwgnc31 rq0escxv j83agx80 cbu4d94t dlpeemhq jgsskzai pmk7jnqg i09qtzwb nred35xi h4z51re5 rv4hoivh e5d9fub0">
                        <div class="buofh1pr"></div>
                        <div aria-hidden="true">
                            <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p oo9gr5id" dir="auto">
                                <span class="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">{listmember.find(member=>member.user_id==list_messages[list_messages.length-1].user_id).name}</span>
                            </span>
                        </div>
                        <div class="buofh1pr"></div>
                        <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v knj5qynh m9osqain" dir="auto">
                            <span class="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">{list_messages[list_messages.length-1].user_id==user.id?'Bạn':listmember.find(member=>member.user_id==list_messages[list_messages.length-1].user_id).name}{list_messages[list_messages.length-1].filetype=='image'?` đã gửi ${list_messages[list_messages.length-1].list_file.length} ảnh`:list_messages[list_messages.length-1].filetype=='video'?' đã gửi 1 video':list_messages[list_messages.length-1].filetype=='pdf'?' đã gửi một file':`: ${list_messages[list_messages.length-1].message}`}</span>
                        </span> 
                        <div class="buofh1pr"></div>
                        <div class="hcy7w5mv s2hgh8fk gl3lb2sf pmk7jnqg b5fwa0m3 hhz5lgdu rvdht4aw" style={{transform: `rotate(45deg)`}}></div> 
                    </div>:''}
                </div>
            </div>:
            <div className="chat-container">
                <div className="chat-header">
                    <div className="operator-wrapper">
                        <div onClick={e=>{
                            e.stopPropagation()
                            setShowaction(!showaction)}} className="operator-wrapper-info flex flex-center">
                            <div className="oparator-avatar flex item-center flex-center">
                                <img className="avatar-image" src={`${originurl}${direact?direact.avatar:user.avatar}`}/>
                                <div style={{bottom: '5px',right: '5px',transform: 'translate(50%, 50%)'}} className="s45kfl79 emlxlaya bkmhp75w spb7xbtv pmk7jnqg kavbgo14">
                                    {direact && direact.online || direact==undefined?
                                    <span className="status-online" data-visualcompletion="ignore">
                                        </span>:<span className="status-offline" data-visualcompletion="ignore">
                                    </span>}
                                </div>
                            </div>
                            <div className="oparator-user">
                                <div className="oparator-username">{direact?direact.name:user.name}</div>
                                <div className="oparator-online">{direact?direact.online?direact.online:timeago(direact.is_online):''}</div>
                            </div>
                            <div className='oparator-dropdown'>
                                <i className="_3kEAcT1Mk5 chat-hide-dialog">
                                    <svg className="h676nmdw" width="10px" height="10px" viewBox="0 0 18 10"><path fill="var(--disabled-icon)" fill-rule="evenodd" clip-rule="evenodd" d="M1 2.414A1 1 0 012.414 1L8.293 6.88a1 1 0 001.414 0L15.586 1A1 1 0 0117 2.414L9.707 9.707a1 1 0 01-1.414 0L1 2.414z"></path></svg>
                                </i>
                            </div>
                        </div>
                    </div>
                    <div className="operator-items">
                        <div className="operator-item-wrapper">                            
                            <svg role="presentation" width="26px" height="26px" viewBox="-5 -5 30 30"><path d="M10.952 14.044c.074.044.147.086.22.125a.842.842 0 001.161-.367c.096-.195.167-.185.337-.42.204-.283.552-.689.91-.772.341-.078.686-.105.92-.11.435-.01 1.118.174 1.926.648a15.9 15.9 0 011.713 1.147c.224.175.37.43.393.711.042.494-.034 1.318-.754 2.137-1.135 1.291-2.859 1.772-4.942 1.088a17.47 17.47 0 01-6.855-4.212 17.485 17.485 0 01-4.213-6.855c-.683-2.083-.202-3.808 1.09-4.942.818-.72 1.642-.796 2.136-.754.282.023.536.17.711.392.25.32.663.89 1.146 1.714.475.808.681 1.491.65 1.926-.024.31-.026.647-.112.921-.11.35-.488.705-.77.91-.236.17-.226.24-.42.336a.841.841 0 00-.368 1.161c.04.072.081.146.125.22a14.012 14.012 0 004.996 4.996z" fill="var(--disabled-icon)"></path><path d="M10.952 14.044c.074.044.147.086.22.125a.842.842 0 001.161-.367c.096-.195.167-.185.337-.42.204-.283.552-.689.91-.772.341-.078.686-.105.92-.11.435-.01 1.118.174 1.926.648.824.484 1.394.898 1.713 1.147.224.175.37.43.393.711.042.494-.034 1.318-.754 2.137-1.135 1.291-2.859 1.772-4.942 1.088a17.47 17.47 0 01-6.855-4.212 17.485 17.485 0 01-4.213-6.855c-.683-2.083-.202-3.808 1.09-4.942.818-.72 1.642-.796 2.136-.754.282.023.536.17.711.392.25.32.663.89 1.146 1.714.475.808.681 1.491.65 1.926-.024.31-.026.647-.112.921-.11.35-.488.705-.77.91-.236.17-.226.24-.42.336a.841.841 0 00-.368 1.161c.04.072.081.146.125.22a14.012 14.012 0 004.996 4.996z" stroke="var(--disabled-icon)" fill="none"></path></svg>                            
                        </div>
                        <div className="operator-item-wrapper">                            
                            <svg role="presentation" width="26px" height="26px" viewBox="-5 -5 30 30"><path d="M19.492 4.112a.972.972 0 00-1.01.063l-3.052 2.12a.998.998 0 00-.43.822v5.766a1 1 0 00.43.823l3.051 2.12a.978.978 0 001.011.063.936.936 0 00.508-.829V4.94a.936.936 0 00-.508-.828zM10.996 18A3.008 3.008 0 0014 14.996V5.004A3.008 3.008 0 0010.996 2H3.004A3.008 3.008 0 000 5.004v9.992A3.008 3.008 0 003.004 18h7.992z" fill="var(--disabled-icon)"></path></svg>                           
                        </div>
                        <div onClick={e=>setState({...state,zoomin:true})} className="operator-item-wrapper">                           
                            <svg width="26px" height="26px" viewBox="-4 -4 24 24"><line x1="2" x2="14" y1="8" y2="8" stroke-linecap="round" stroke-width="2" stroke="var(--disabled-icon)"></line></svg>                          
                        </div>
                        <div onClick={()=>{setShow(false)}} className="operator-item-wrapper">                           
                            <svg className="pcgkmkmd ditlmg2l arzshmzb nvdbi5me" width="24px" height="24px" viewBox="0 0 24 24"><g stroke-linecap="round" stroke-width="2" stroke="var(--disabled-icon)"><line x1="6" x2="18" y1="6" y2="18"></line><line x1="6" x2="18" y1="18" y2="6"></line></g></svg>                           
                        </div>                       
                    </div>
                </div>
                <Chatbody
                    datalistmember={listmember}
                    thread={thread}
                    user={user}
                    action={action}
                    setaction={data=>setAction(data)}
                    setshow={data=>setShow(data)}
                    height={348}
                    datamessages={list_messages}
                />
            </div>:''}
        </div>
        {showaction?
        <div ref={contentchat} style={{position: 'fixed', right: '352px', bottom: '60px', zIndex: 999}}>
            <div className="container-chat-action">
                <div className="chat-action-wrapper">
                    <ul className="chat-action-items">
                        {listactionchat.map((item,i)=>
                        <>
                        <li key={i} onClick={e=>setactionchat(e,item)} className="chat-action-item">
                            <div className="chat-action-icon">
                                {item.src?
                                <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(${item.src})`, backgroundPosition: `${item.position}`,...style}}></i>
                                :<svg viewBox="0 0 20 20" data-testid="mw_edit_theme_svg:Honey" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4" fill="url(#jsc_c_16r)" height="20" width="20"><defs><linearGradient gradientTransform="rotate(90)" id="jsc_c_16r"><stop stop-color="#faaf00" offset="0%"></stop><stop stop-color="#faaf00" offset="100%"></stop></linearGradient></defs><defs><mask id="jsc_c_16q"><rect width="100%" height="100%" fill="white"></rect><circle cx="10" cy="10" r="3" fill="black"></circle></mask></defs><circle cx="10" cy="10" r="10" mask="url(#jsc_c_16q)"></circle></svg>
                                }
                                
                            </div>
                            <div className="chat-action-name">
                                {item.name}
                            </div>
                        </li>
                        {item.dot?
                        <hr className="aov4n071 dhix69tm wkznzc2l bi6gxh9e pwoa4pd7"/>:''}</>
                        )}
                    </ul>
                </div>
                <div className="cdcbzqsl goun2846 ccm00jje s44p3ltw mk2mc5f4 jgf7e1nu tl61u9r6 bcctvi4p gcjuebxg kvs4odcb hzruof5a icon-arrow j7g94pet et4y5ytx jxfglsfo lu1ps8bl kr520xx4" style={{transform: `translate(-6px, 16px) rotate(-45deg)`}}></div>
            </div>
        </div>:''}
        {state.addgroup?
        <div style={{position: 'fixed', right: '352px', bottom: '0px', zIndex: 999}}>
            <div className="chat-container">
                <div className="chat-add-group">
                    <div>
                        <div className="oparator-wrapper flex item-space p-8">
                            <div >Tin nhắn mới</div>
                            <div onClick={()=>{setState({...state,addgroup:false})
                            setListtags([])
                        }} className="operator-item-wrapper">      
                                <svg className="pcgkmkmd ditlmg2l arzshmzb nvdbi5me" width="24px" height="24px" viewBox="0 0 24 24"><g stroke-linecap="round" stroke-width="2" stroke="var(--disabled-icon)"><line x1="6" x2="18" y1="6" y2="18"></line><line x1="6" x2="18" y1="18" y2="6"></line></g></svg>      
                            </div>
                        </div>
                        
                    </div>
                    <div className="item-base-line mb-1_2 pl-1">
                        <label onClick={e=>addgroup(e)} for="" className="form-item__label">
                            Gửi đến
                        </label>
                        
                        <div className='list-member-tag'>
                            {listtags.map(tag=>
                                <div key={tag.id} className="chat-tag m-4 border-6">
                                    <div className="chat-name">{tag.name}</div>
                                    <div onClick={()=>setListtags(
                                        listtags.filter(item=>item.id!=tag.id)
                                        
                                    )} className="chat-icon-tag">
                                        <i data-visualcompletion="css-img" className="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: `-39px -126px`, backgroundSize: `auto`, width: `12px`, height: '12px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                    </div>
                                </div>)}
                            </div>
                            
                            
                        </div>
                        <div className="serach-input-tag ml-1">
                            <input placeholder='nhập tên' onChange={e=>onChange(e)} type='text' value={state.text}/>
                        </div>
                </div>
                <Chatbody
                    datalistmember={listmembergroup}
                    thread={threadgroup}
                    user={user}
                    listuserdata={listuser}
                    action={action}
                    setaction={data=>setAction(data)}
                    setthreadgroup={data=>setThreadgroup(data)}
                    listtags={listtags}
                    setlisttags={data=>setListtags(data)}
                    datamessages={messagegroup}
                    height={320}
                />
            </div>
        </div>:''}
    </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,showchat:state.showchat,
    messages:state.messages,thread:state.thread,members:state.members,datachat:state.datachat
});
export default connect(mapStateToProps,{actionchat})(Message);
