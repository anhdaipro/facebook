import React,{useState,useEffect,useRef,useCallback} from 'react'
import { connect } from 'react-redux';
import { expiry, headers, login,logout } from '../actions/auth';
import {debounce} from 'lodash';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Tooltip from "../hocs/Tooltip"
import { checkDay,timeago,listemoji } from '../constants';
import {countnotifiURL,originurl,notifycationURL,actionfriendURL,actionNotificationURL} from '../urls';
const actionnotifi=[{name:'Đánh dấu đã đọc',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png',position:'-105px -46px',action:'read'},
{name:'Tắt thông báo',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png',position: '0px -1300px',action:'turnoff'},
{name:'Gỡ thông báo',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png', position: '0px -775px',action:'remove'}]
const Notify=(props)=>{
    const [show,setShow]=useState(false)
    const [action,setAction]=useState()
    const {item,socket,user,setnotifi,setlistnotify,listnotify}=props
    const navigate=useNavigate()
    const deletenotifi=(e)=>{
        ( async()=>{
            try{
                const data={notification_type:5,id:item.user.id,sender_id:user.id}
                e.preventDefault()
                const res=await axios.post(actionNotificationURL,JSON.stringify(data),headers)
                setlistnotify(listnotify.filter(notifi=>notifi.id!=item.id))
            }
            catch(e){
                console.log(e)
            }
        })()
    }
    console.log(user)
    console.log(item)
    const submit=(e)=>{
        (async()=>{
            try{
            e.preventDefault()
            const data={action:'accept friend request',receiver_id:item.user.id}
            const res=await axios.post(actionfriendURL,JSON.stringify(data),headers)
            const listusers=[{notification_type:7,receiver_id:item.user.id,...user}]
            socket.current.emit("sendNotifi",listusers)
            setnotifi(e,item,'accept',true)
            }
            catch(e){
                console.log(e)
            }
        })()
    }
    return(
        <Link to={`/${item.user.username}/post/${item.post}`} data-e2e="inbox-list-item" class="tiktok-10p993c-DivItemContainer exfus50">
            <div className="notification-container notification-navbar">
                <div className="notification-body flex-center">
                    <div className="notification-body-avatar">
                        <svg aria-hidden="true" class="pzggbiyp" data-visualcompletion="ignore-dynamic" role="none" style={{height: '56px', width: '56px'}}><mask id="jsc_c_8e"><circle cx="28" cy="28" fill="white" r="28"></circle><circle cx="48" cy="48" data-visualcompletion="ignore" fill="black" r="9"></circle></mask><g mask="url(#jsc_c_8e)"><image x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlinkHref={item.user.avatar} style={{height: '56px', width: '56px'}}></image><circle class="mlqo0dh0 georvekb s6kb5r3f" cx="28" cy="28" r="28"></circle></g>
                        </svg>
                        <div class="notification-body-icon" style={{backgroundColor: 'transparent'}}>
                            {item.notification_type==1?
                            <img class="hu5pjgll bixrwtb6" src={listemoji.find(emoji=>emoji.emoji==item.text_preview).src} alt="" style={{height: '28px', width: '28px'}}/>:
                            <i data-visualcompletion="css-img" class="hu5pjgll bixrwtb6" style={{height: '28px', width: '28px', backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/0WudJbeIJ5t.png)`, backgroundPosition: `0px ${item.notification_type==5 || item.notification_type==7?-812:item.notification_type==2?-725:-1653}px`, backgroundSize: 'auto', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            }
                        </div> 
                    </div>
                    <div className="notification-info mr-8">
                        <div className="mb-8"><strong>{item.user.name}</strong>{item.notification_type==5?' đã gửi lời mời kết bạn cho bạn':item.notification_type==7?' đã chấp nhận lời mời kết bạn của bạn':item.notification_type==4?' đã nhắc đến bạn trong bình luận':item.notification_type==2?' đã bình luận về bài viết của bạn':item.notification_type==1?item.story?` đã ${item.text_preview=='like'?'thích':'bày tỏ cảm xúc'} về tin của bạn`:item.post?` đã ${item.text_preview=='like'?'thích':'bày tỏ cảm xúc'} về bài viết của bạn`:item.comment?` đã ${item.text_preview=='like'?'thích':'bày tỏ cảm xúc'} về bình luận của bạn`:'':item.story?' đã thêm vào tin của mình':' đã thêm bài viết mới'}</div>
                        <div className="notification-time"><span className="q66pz984">{timeago(item.date)} ago</span></div>
                    </div> 
                </div>
                {item.notification_type==5?
                <div className="notification-fotter">
                    <div className="fotter-wrapper">
                        {item.accept?
                        <div className="tvfksri0 tw6a2znq">
                            <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi b1v8xokw m9osqain" dir="auto">Đã chấp nhận lời mời kết bạn</span>
                        </div>:<>
                        <div onClick={e=>submit(e)} className="p-4-8 border-6 nhd2j8a9 bwm1u5wc s1i5eluu mr-8">Xác nhận</div>
                        <div onClick={e=>deletenotifi(e)} className="p-4-8 border-6 nhd2j8a9 a57itxjd tdjehn4e">Xóa</div>
                        </>}
                    </div>
                </div>
                :''}
            </div>
        </Link>
    )
}

const Notifications=(props)=>{
    const {notify,setnotify,socket,user}=props
    const [listnotify,setListnotify]=useState([])
    const [show,setShow]=useState(false)
    const [state,setState]=useState()
    const [loading,setLoading]=useState(false)
    const notifiref=useRef()
    const [count,setCount]=useState(0)
    const updatenotify=(e)=>{
        (async ()=>{
            try{
            e.preventDefault()
            setShow(true)
            if(listnotify.length==0){
            const [obj1, obj2] = await axios.all([
                axios.get(notifycationURL,headers),
                axios.get(countnotifiURL,headers)
            ])
            setListnotify(obj1.data)
            setCount(obj2.data.count)
            setnotify(0)
            setLoading(true)
            }
            }
            catch(e){
                console.log(e)
            }
        })()
    }

    
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const handleClick = (event) => {
        const { target } = event
        if(notifiref.current){
            if (!notifiref.current.contains(target)) {
                setShow(false)
            }
        }
    }
    const setnotifi=(e,itemchoice,name,value)=>{
        const data=listnotify.map(item=>{
            if(item.id==itemchoice.id){
                return({...item,[name]:value})
            }
            return({...item})
        })
        setListnotify(data)
    }
    const addnotifi=(e)=>{
        
        const rects = e.currentTarget.getBoundingClientRect();
        console.log(e.currentTarget.scrollHeight)
        console.log(e.currentTarget.scrollTop+rects.height)
        if(loading && e.currentTarget.scrollTop+rects.height >= e.currentTarget.scrollHeight-50 && listnotify.length<count){
            setLoading(false)
            axios.get(`${notifycationURL}?from_item=${listnotify.length}`,headers)
            .then(res=>{
                const data=res.data
                setLoading(true)
                const datanotifi=[...listnotify,...data]
                setListnotify(datanotifi)
            })
        }
        else{
            setLoading(true)
        }
    }
    return(
        <li ref={notifiref} class="navbar__link--notification navbar__link navbar__link--hoverable navbar__link--tappable">
            <div onClick={(e)=>updatenotify(e)} class="navbar__link--icon">
                <a aria-label="Thông báo" class="oajrlxb2 qu0x051f" href="/notifications/" role="link" tabindex="0">
                    <svg viewBox="0 0 28 28" alt="" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 rs22bh7c" fill="currentColor" height="20" width="20"><path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path></svg>
                    <div class="i09qtzwb n7fi1qx3 spb7xbtv" data-visualcompletion="ignore"></div>
                </a>
                {notify>0?
                <div className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl pmk7jnqg tkr6xdv7 evds00iz sgn1ogh8">
                    <span class="s45kfl79 emlxlaya bkmhp75w spb7xbtv pq6dq46d e9vueds3 ekzkrbhg omvj5yrc jiuqdcnw d82f96u3 gky8063y"><span class="bp9cbjyn bwm1u5wc pq6dq46d datstx6m taijpn5t jb3vyjys jxrgncrl qt6c0cv9 qnrpqo6b k4urcfbm">{notify}</span></span>
                </div>:''}       
            </div>
            {show?
                <div className={`${!show?'tiktok-1pyd9ev-DivHeaderInboxWrapper':'tiktok-1t1sirr-DivHeaderInboxWrapper'} e18kkhh49`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(255, 255, 255, 1.0)" viewBox="0 0 24 8" width="24" height="8" className="tiktok-e0rxz1-StyledArrow e18kkhh48"><path d="M0 8c7 0 10-8 12-8s5 8 12 8z"></path></svg>
                    <div data-e2e="inbox-notifications" className="tiktok-vubwh3-DivInboxContainer e32s1fi0">
                        <div className="jsx-585722981 inbox-content-header">
                            <h4 className="jsx-585722981 inbox-content-notification">Thông báo</h4>
                            <div data-e2e="inbox-bar" className="jsx-585722981 group-wrap">
                                <span data-e2e="all" className="jsx-585722981 selected">Tất cả</span>
                                <span data-e2e="mentions" className="jsx-585722981">Nhắc đến</span>
                                <span data-e2e="followers" className="jsx-585722981">Lời mời kết bạn</span>
                            </div>
                        </div>
                        <div onScroll={e=>addnotifi(e)} data-e2e="inbox-list" className="tiktok-o6y5r-DivInboxContentContainer e11z9zg00">
                            {listnotify.some(item=>checkDay(item.date)=="Today")?<>
                            <p class="tiktok-mikffl-PTimeGroupTitle e11z9zg01">Today</p>
                            {listnotify.filter(item=>checkDay(item.date)=="Today").map(item=>
                            <Notify
                            item={item}
                            socket={socket}
                            listnotify={listnotify}
                            user={user}
                            setlistnotify={data=>setListnotify(data)}
                            setnotifi={(e,itemchoice,name,value)=>setnotifi(e,itemchoice,name,value)}
                            />
                            )}</>:''}
                            {listnotify.some(item=>checkDay(item.date)!="Today")?<>
                            <p class="tiktok-mikffl-PTimeGroupTitle e11z9zg01">This Week</p>
                            {listnotify.filter(item=>checkDay(item.date)!="Today").map(item=>
                            <Notify
                            item={item}
                            socket={socket}
                            setlistnotify={data=>setListnotify(data)}
                            user={user}
                            listnotify={listnotify}
                            setnotifi={(e,itemchoice,name,value)=>setnotifi(e,itemchoice,name,value)}
                            />
                            )}</>:''}
                        </div>
                    </div>
                </div>
            :''}
        </li>
    )
}

export default Notifications