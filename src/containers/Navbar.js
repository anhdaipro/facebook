﻿import React,{useState,useEffect,useRef,useCallback} from 'react'
import { connect } from 'react-redux';
import { expiry, headers, login,logout,showchat } from '../actions/auth';
import {debounce} from 'lodash';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Tooltip from "../hocs/Tooltip"
import { checkDay } from '../constants';
import { topsearchURL ,listtagURL,originurl,listThreadlURL,listsearchURL} from '../urls';
import io from "socket.io-client"
import Notifications from './ListNotifications';
import Threads from './Threads';
const listitemaction=[{name:'Cài đặt và quyền riêng tư',src:"https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/6X6w7W0DgpT.png",position:'-21px -249px',option:true,action:'setting'},
{name:'Trợ giúp và hỗ trợ',src:"https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/WSkqPvPd4Li.png",position:'-21px -226px',option:true,action:'help'},
{name:'Đóng góp ý kiến',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/QnBF2xVFFiX.png',position:'0px -25px',action:''},
{name:'Đăng xuất',src:"https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/QnBF2xVFFiX.png",position: '0px -46px',action:'logout'},
]
const Navbar=(props)=>{
    const {isAuthenticated,logout,count_notify_unseen,user,hidesearch,
        count_message_unseen,showchat,className}=props
    const [state,setState]=useState({show_info:false,text:'',notifi:true})
    const [notify,setNotify]=useState()
    const [notifimessage,setNotifimesaage]=useState(0)
    const navigate=useNavigate()
    const [suggestions, setSuggestions] = useState([]);
    const [search,setSearch]=useState(false)
    const socket =useRef()
    const [showinfo,setShowinfo]=useState(false)
    const [listseach, setListsearch] = useState([]);
    
    console.log(count_notify_unseen)
    const searchref=useRef()
    useEffect(()=>{
        setNotify(count_notify_unseen)
        setNotifimesaage(count_message_unseen)
    },[count_notify_unseen])

    useEffect(()=>{
        if(!localStorage.token ||  expiry<0){
            window.location.href="/login"
        }
    },[])
       
    
    console.log(isAuthenticated)
    useEffect(() => { 
       
        socket.current=io.connect('https://web-production-e133.up.railway.app')
        socket.current.on('notifi',listusers=>{
            if(listusers.some(item=>item.receiver_id==user.id && (item.notification_type!=5 ||(item.notification_type==5 && state.notifi)))){ 
                setNotify(current=>(current+1))
            }  
            if(listusers.some(item=>item.receiver_id==user.id && item.notification_type==5)){ 
                setState(current=>{return{...current,notifi:false}})
            }  
        })
        return () => socket.current.disconnect()
    
    },[user,state])
    
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    useEffect(() => { 
        if(user){
            socket.current.emit("addUser", user.id);
        }
    },[user])
    
    const handleClick = (event) => {
        const { target } = event
        if(searchref.current!=null){
            if (!searchref.current.contains(target)) {
                setSearch(false)
            }
        }
    }
    
    useEffect(()=>{
        (async ()=>{
            if(search){
            const res = await axios.get(listsearchURL,headers)
            setListsearch(res.data)
            }
        })()
    },[search])
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const [obj1, obj2] = await axios.all([
                    axios.get(`${listtagURL}?keyword=${value}`,headers),
                    axios.get(`${topsearchURL}?keyword=${value}`,headers),
                ])
                setSuggestions([...obj1.data,...obj2.data])
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[])

    const addsearch=(e,value)=>{
        (async()=>{
            try{
                const data=value.id?{   
                    user_id:value.id
                }:{keyword:value}
                const res = await axios.post(listsearchURL,JSON.stringify(data),headers)
                if(value.id){
                navigate(`/${value.username}`)
                }
                else{
                    navigate(`/search/top?key=${value}`)  
                }
            }
            catch(e){
                console.log(e)
            }
        })()
    }
    const searchitem=(e,item)=>{
        e.preventDefault()
        if(item.user){
            navigate(`/${item.user.username}`)
        }
        else{
            navigate(`/search/top?key=${item.keyword}`)
        }
    }
    const setlistsearch=(e,itemchoice)=>{
        (async()=>{
            try{
                e.stopPropagation()
                const res = await axios.post(listsearchURL,JSON.stringify({search_id:itemchoice.id}),headers)
                setListsearch(listseach.filter(item=>item.id!=itemchoice.id))
            }
            catch(e){
                console.log(e)
            }
        })()
    }
    const setactionitem=(e,item)=>{
        if(item.action=='logout'){
            logout()
            window.location="/login"
        }
    }
    
    return(
        <div>
        
        <div className="header-logo ehxjyohh kr520xx4 j9ispegn poy2od1o byvelhso buofh1pr j83agx80 rq0escxv bp9cbjyn">
            {search?'':
            <Link aria-label="Facebook" class="oajrlxb2 gs1a9yip g5ia77u1" to="/" role="link" tabindex="0">
                <svg viewBox="0 0 36 36" class="" fill="url(#jsc_s_21)" height="40" width="40"><defs><linearGradient x1="50%" x2="50%" y1="97.0782153%" y2="0%" id="jsc_s_21"><stop offset="0%" stop-color="#0062E0"></stop><stop offset="100%" stop-color="#19AFFF"></stop></linearGradient></defs><path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path><path class="p361ku9c" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"></path></svg>
            </Link>}
            {hidesearch?'':
            <div ref={searchref} class="flex l9j0dhe7 ml-1 flex-center">
                <div onClick={e=>setSearch(true)} className={`flex flex-center ${search?'search-input':'input1'}`}>
                    <span class="flex flex-center header-icon-search">
                        <svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" class="a8c37x1j  py1f6qlh gl3lb2sf hhz5lgdu"><g fill-rule="evenodd" transform="translate(-448 -544)"><g fill-rule="nonzero"><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg>
                    </span>
                    <input
                    onKeyDown={e=>{
                        if(e.keyCode===13){
                        addsearch(e,e.target.value)}}}
                     onChange={e=>{
                        const value=e.target.value
                        setState({...state,text:e.target.value})
                        fetchkeyword(value)
                        }}  value={state.text} type="text" onfocus="hideIcon(this);" placeholder="Search in Facebook"/>
                </div> 
                {search?
                <div className="drop-down">
                    <div className="search-wrapper"> 
                        <ul className="list-search-input">
                            {state.text.trim()==''?<>
                            
                            <li className="flex p-4-8 item-space">
                               <div className="search-recently">
                                    <span class="a5q79mjw g1cxx5fr lrazzd5p oo9gr5id">Tìm kiếm gần đây</span>
                                  
                                </div>     
                               <div className="search-edit p-4-8 border-6">
                                   <Link to={`/${user.username}/allactivity/key=search`}>
                                        <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh jq4qci2q a3bd9o3v b1v8xokw py34i1dx">Chỉnh sửa</span>
                                   </Link>
                                </div>     
                            </li>
                            {listseach.map(item=>
                            <li onClick={(e)=>searchitem(e,item)} key={item.id} className="search-item">
                                {item.user?
                                <div className="search-item-avatar"> 
                                    <img src={item.user.avatar}/>
                                </div>:
                                <div class="search-item-keyword">
                                    <i data-visualcompletion="css-img" class="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: `0px -649px`, backgroundSize: `auto`, width: `20px`, height: `20px`, backgroundRepeat: `no-repeat`, display: `inline-block`}}></i>
                                </div>}
                                <div className="search-item-name">
                                    <span>{item.user?item.user.name:item.keyword}</span>
                                </div>
                                <div onClick={e=>setlistsearch(e,item)} className="icon-svg">
                                    <i data-visualcompletion="css-img" class="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-39px -126px', backgroundSize: `auto`, width: '12px', height: '12px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                            </li>
                            )}</>:
                            
                            <>
                            
                            {suggestions.map(item=>
                                <li onClick={e=>addsearch(e,item)} key={item.id} className="search-item">
                                    {item.avatar?
                                    <div className="search-item-avatar"> 
                                        <img src={item.avatar}/>
                                    </div>:
                                    <div class="search-item-keyword">
                                        <i data-visualcompletion="css-img" class="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: `-51px -109px`, backgroundSize: `auto`, width: `16px`, height: `16px`, backgroundRepeat: `no-repeat`, display: `inline-block`}}></i>
                                    </div>
                                    }
                                    <div className="search-item-name">
                                        <span>{item.avatar?item.name:item.keyword}</span>
                                    </div>
                                    
                                </li>
                            )}
                            <li className="search-item">
                                <div class="search-item-keyword is6700om">
                                    <i data-visualcompletion="css-img" class="eb18blue hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: `0px -649px`, backgroundSize: `auto`, width: `20px`, height: `20px`, backgroundRepeat: `no-repeat`, display: `inline-block`}}></i>
                                </div>  
                               <div className="search-edit p-4-8 border-6">
                                  
                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh jq4qci2q a3bd9o3v b1v8xokw py34i1dx">Tìm kiếm {state.text}</span>
                                  
                                </div>     
                            </li>
                            </>}
                        </ul>
                    </div>
                </div>:''}
            </div>}
        </div>
        <div class={`${className || 'header'}`}>
            
            <ul className="header-list-item item-center">
                <li class="buofh1pr to382e16 flex item-center o5zgeu5y dawyy4b1 jrc8bbd0 hw7htvoc">
                    <span class="iyyx5f41">
                        <div class="bp9cbjyn j83agx80 ">
                            <div class="s1i5eluu  tt24zdws ms05siws flx89l3n b7h9ocf4 jav28p83"></div>
                            <Link aria-current="page" aria-label="Trang chủ" class="oajrlxb2 g5ia77u1  taijpn5t l9j0dhe7 k4urcfbm" to="/" role="link" tabindex="0">
                                <span class="l9j0dhe7">
                                    <svg viewBox="0 0 28 28" class="a8c37x1j  py1f6qlh ms05siws l3qrxjdp b7h9ocf4 g28tu32o" fill="currentColor" height="28" width="28"><path d="M25.825 12.29C25.824 12.289 25.823 12.288 25.821 12.286L15.027 2.937C14.752 2.675 14.392 2.527 13.989 2.521 13.608 2.527 13.248 2.675 13.001 2.912L2.175 12.29C1.756 12.658 1.629 13.245 1.868 13.759 2.079 14.215 2.567 14.479 3.069 14.479L5 14.479 5 23.729C5 24.695 5.784 25.479 6.75 25.479L11 25.479C11.552 25.479 12 25.031 12 24.479L12 18.309C12 18.126 12.148 17.979 12.33 17.979L15.67 17.979C15.852 17.979 16 18.126 16 18.309L16 24.479C16 25.031 16.448 25.479 17 25.479L21.25 25.479C22.217 25.479 23 24.695 23 23.729L23 14.479 24.931 14.479C25.433 14.479 25.921 14.215 26.132 13.759 26.371 13.245 26.244 12.658 25.825 12.29"></path></svg>
                                    <span class="pmk7jnqg h5g66v2i nezaghv5"></span>
                                </span>
                            </Link>
                        </div>
                    </span>
                </li>
                <li class="buofh1pr flex item-center to382e16 o5zgeu5y ">
                    <span class="  iyyx5f41">
                        <div class="bp9cbjyn j83agx80 ">
                            <div class="s1i5eluu akjuzmll"></div>
                            <Link aria-label="Watch, 25 thông báo" class="oajrlxb2 nhd2j8a9 p7hjln8o kvgmc6g5  k4urcfbm" to="/watch/?ref=tab" role="link" tabindex="0">
                                <span class="l9j0dhe7">
                                    <svg viewBox="0 0 28 28" class="a8c37x1j  py1f6qlh" fill="currentColor" height="28" width="28"><path d="M8.75 25.25C8.336 25.25 8 24.914 8 24.5 8 24.086 8.336 23.75 8.75 23.75L19.25 23.75C19.664 23.75 20 24.086 20 24.5 20 24.914 19.664 25.25 19.25 25.25L8.75 25.25ZM17.163 12.846 12.055 15.923C11.591 16.202 11 15.869 11 15.327L11 9.172C11 8.631 11.591 8.297 12.055 8.576L17.163 11.654C17.612 11.924 17.612 12.575 17.163 12.846ZM21.75 20.25C22.992 20.25 24 19.242 24 18L24 6.5C24 5.258 22.992 4.25 21.75 4.25L6.25 4.25C5.008 4.25 4 5.258 4 6.5L4 18C4 19.242 5.008 20.25 6.25 20.25L21.75 20.25ZM21.75 21.75 6.25 21.75C4.179 21.75 2.5 20.071 2.5 18L2.5 6.5C2.5 4.429 4.179 2.75 6.25 2.75L21.75 2.75C23.821 2.75 25.5 4.429 25.5 6.5L25.5 18C25.5 20.071 23.821 21.75 21.75 21.75Z"></path></svg>
                                    <span class="pmk7jnqg h5g66v2i nezaghv5">
                                        <span class="pq6dq46d ">
                                            <span class="bp9cbjyn bwm1u5wc pq6dq46d datstx6m taijpn5t jb3vyjys jxrgncrl qt6c0cv9 qnrpqo6b k4urcfbm">9+</span>
                                        </span>
                                    </span>
                                </span>
                                <div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore" style={{borderRadius:'8px',bottom:'4px',left:0,right:0,top:'4px'}}></div>
                            </Link>
                        </div>
                    </span>
                </li>
                <li class="buofh1pr flex item-center to382e16 o5zgeu5y ">
                    <span class="  iyyx5f41">
                        <div class="bp9cbjyn j83agx80 ">
                            <div class="s1i5eluu akjuzmll">
                            </div>
                            <Link aria-label="Marketplace, 1 thông báo" class="oajrlxb2 nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl bp9cbjyn j83agx80 cbu4d94t datstx6m taijpn5t l9j0dhe7 k4urcfbm" to="/marketplace/?ref=app_tab" role="link" tabindex="0">
                                <span class="l9j0dhe7">
                                    <svg viewBox="0 0 28 28" class="a8c37x1j  py1f6qlh" fill="currentColor" height="28" width="28"><path d="M17.5 23.75 21.75 23.75C22.164 23.75 22.5 23.414 22.5 23L22.5 14 22.531 14C22.364 13.917 22.206 13.815 22.061 13.694L21.66 13.359C21.567 13.283 21.433 13.283 21.34 13.36L21.176 13.497C20.591 13.983 19.855 14.25 19.095 14.25L18.869 14.25C18.114 14.25 17.382 13.987 16.8 13.506L16.616 13.354C16.523 13.278 16.39 13.278 16.298 13.354L16.113 13.507C15.53 13.987 14.798 14.25 14.044 14.25L13.907 14.25C13.162 14.25 12.439 13.994 11.861 13.525L11.645 13.35C11.552 13.275 11.419 13.276 11.328 13.352L11.155 13.497C10.57 13.984 9.834 14.25 9.074 14.25L8.896 14.25C8.143 14.25 7.414 13.989 6.832 13.511L6.638 13.351C6.545 13.275 6.413 13.275 6.32 13.351L5.849 13.739C5.726 13.84 5.592 13.928 5.452 14L5.5 14 5.5 23C5.5 23.414 5.836 23.75 6.25 23.75L10.5 23.75 10.5 17.5C10.5 16.81 11.06 16.25 11.75 16.25L16.25 16.25C16.94 16.25 17.5 16.81 17.5 17.5L17.5 23.75ZM3.673 8.75 24.327 8.75C24.3 8.66 24.271 8.571 24.238 8.483L23.087 5.355C22.823 4.688 22.178 4.25 21.461 4.25L6.54 4.25C5.822 4.25 5.177 4.688 4.919 5.338L3.762 8.483C3.729 8.571 3.7 8.66 3.673 8.75ZM24.5 10.25 3.5 10.25 3.5 12C3.5 12.414 3.836 12.75 4.25 12.75L4.421 12.75C4.595 12.75 4.763 12.69 4.897 12.58L5.368 12.193C6.013 11.662 6.945 11.662 7.59 12.193L7.784 12.352C8.097 12.609 8.49 12.75 8.896 12.75L9.074 12.75C9.483 12.75 9.88 12.607 10.194 12.345L10.368 12.2C11.01 11.665 11.941 11.659 12.589 12.185L12.805 12.359C13.117 12.612 13.506 12.75 13.907 12.75L14.044 12.75C14.45 12.75 14.844 12.608 15.158 12.35L15.343 12.197C15.989 11.663 16.924 11.663 17.571 12.197L17.755 12.35C18.068 12.608 18.462 12.75 18.869 12.75L19.095 12.75C19.504 12.75 19.901 12.606 20.216 12.344L20.38 12.208C21.028 11.666 21.972 11.666 22.62 12.207L23.022 12.542C23.183 12.676 23.387 12.75 23.598 12.75 24.097 12.75 24.5 12.347 24.5 11.85L24.5 10.25ZM24 14.217 24 23C24 24.243 22.993 25.25 21.75 25.25L6.25 25.25C5.007 25.25 4 24.243 4 23L4 14.236C2.875 14.112 2 13.158 2 12L2 9.951C2 9.272 2.12 8.6 2.354 7.964L3.518 4.802C4.01 3.563 5.207 2.75 6.54 2.75L21.461 2.75C22.793 2.75 23.99 3.563 24.488 4.819L25.646 7.964C25.88 8.6 26 9.272 26 9.951L26 11.85C26 13.039 25.135 14.026 24 14.217ZM16 23.75 16 17.75 12 17.75 12 23.75 16 23.75Z"></path></svg>
                                    <span class="pmk7jnqg h5g66v2i nezaghv5">
                                        <span class="s45kfl79 emlxlaya bkmhp75w spb7xbtv pq6dq46d e9vueds3 ekzkrbhg omvj5yrc jiuqdcnw d82f96u3 gky8063y">
                                            <span class="bp9cbjyn bwm1u5wc pq6dq46d datstx6m taijpn5t jb3vyjys jxrgncrl qt6c0cv9 qnrpqo6b k4urcfbm">1</span>
                                        </span>
                                    </span>
                                </span>
                                <div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore" style={{borderRadius:'8px',bottom:'4px',left:0,right:0,top:'4px'}}></div>
                            </Link>
                        </div>
                    </span>
                </li>
                <li class="buofh1pr flex item-center to382e16 o5zgeu5y ">
                    <span class="  iyyx5f41">
                    <div class="bp9cbjyn j83agx80 ">
                        <div class="s1i5eluu akjuzmll"></div>
                            <Link aria-label="Nhóm" class="oajrlxb2 nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl bp9cbjyn j83agx80 cbu4d94t datstx6m taijpn5t l9j0dhe7 k4urcfbm" to="/groups/feed" role="link" tabindex="0">
                                <span class="l9j0dhe7">
                                    <svg viewBox="0 0 28 28" class="a8c37x1j  py1f6qlh" fill="currentColor" height="28" width="28"><path d="M25.5 14C25.5 7.649 20.351 2.5 14 2.5 7.649 2.5 2.5 7.649 2.5 14 2.5 20.351 7.649 25.5 14 25.5 20.351 25.5 25.5 20.351 25.5 14ZM27 14C27 21.18 21.18 27 14 27 6.82 27 1 21.18 1 14 1 6.82 6.82 1 14 1 21.18 1 27 6.82 27 14ZM7.479 14 7.631 14C7.933 14 8.102 14.338 7.934 14.591 7.334 15.491 6.983 16.568 6.983 17.724L6.983 18.221C6.983 18.342 6.99 18.461 7.004 18.578 7.03 18.802 6.862 19 6.637 19L6.123 19C5.228 19 4.5 18.25 4.5 17.327 4.5 15.492 5.727 14 7.479 14ZM20.521 14C22.274 14 23.5 15.492 23.5 17.327 23.5 18.25 22.772 19 21.878 19L21.364 19C21.139 19 20.97 18.802 20.997 18.578 21.01 18.461 21.017 18.342 21.017 18.221L21.017 17.724C21.017 16.568 20.667 15.491 20.067 14.591 19.899 14.338 20.067 14 20.369 14L20.521 14ZM8.25 13C7.147 13 6.25 11.991 6.25 10.75 6.25 9.384 7.035 8.5 8.25 8.5 9.465 8.5 10.25 9.384 10.25 10.75 10.25 11.991 9.353 13 8.25 13ZM19.75 13C18.647 13 17.75 11.991 17.75 10.75 17.75 9.384 18.535 8.5 19.75 8.5 20.965 8.5 21.75 9.384 21.75 10.75 21.75 11.991 20.853 13 19.75 13ZM15.172 13.5C17.558 13.5 19.5 15.395 19.5 17.724L19.5 18.221C19.5 19.202 18.683 20 17.677 20L10.323 20C9.317 20 8.5 19.202 8.5 18.221L8.5 17.724C8.5 15.395 10.441 13.5 12.828 13.5L15.172 13.5ZM16.75 9C16.75 10.655 15.517 12 14 12 12.484 12 11.25 10.655 11.25 9 11.25 7.15 12.304 6 14 6 15.697 6 16.75 7.15 16.75 9Z"></path></svg>
                                    <span class="pmk7jnqg h5g66v2i nezaghv5"></span>
                                </span>
                                <div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore" style={{borderRadius:'8px',bottom:'4px',left:0,right:0,top:'4px'}}></div>
                            </Link>
                        </div>
                    </span>
                </li>
            </ul>
        </div>
         <ul class="navbar__links">
            <li class="navbar__link--setting navbar__link navbar__link--hoverable navbar__link--tappable">
                <div aria-label="Tạo" class="navbar__link--icon" role="button" tabindex="0">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 rs22bh7c jnigpg78 odw8uiq3"><g fill-rule="evenodd" transform="translate(-446 -350)"><g fill-rule="nonzero"><path d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z" transform="translate(354.5 159.5)"></path><path d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z" transform="translate(354.5 159.5)"></path></g></g></svg>
                    <div class="i09qtzwb n7fi1qx3 b5wmifdl" data-visualcompletion="ignore"></div>
                </div>
            </li>
            <Threads
                user={user}
                socket={socket}
                notify={notifimessage}
                showchat={data=>showchat(data)}
                setnotify={data=>setNotifimesaage(data)}
            />
            <Notifications
                notify={notify}
                socket={socket}
                user={user}
                setnotify={data=>setNotify(data)}
            />
         
            <li  class="navbar__link--profile navbar__link navbar__link--hoverable navbar__link--tappable">
                <div onClick={()=>setShowinfo(!showinfo)} aria-label="Trang cá nhân của bạn" class="navbar__link--icon" role="button" tabindex="0">
                    {user?
                    <img class="profile" src={user.avatar} />:''}
                </div>
                {showinfo?
                <div className="drop-down p-8" style={{width:'300px'}}>
                    <div className="profile-info scb9dxdr nnctdnn4">
                        <div className="flex flex-center nhd2j8a9">
                            <div className="border-50 mr-1_2" style={{height: '36px', width: '36px'}}>
                                <img height='36' width='36' src={user.avatar}/></div>
                            <div className="name">{user.name}</div>
                            
                        </div>
                        <div><span>Xem trang cá nhân của bạn</span></div>
                    </div>
                    <div className="dot"></div>
                    <div className="list-item">
                        {listitemaction.map(item=>
                            <div onClick={e=>setactionitem(e,item)} key={item.action} className="flex flex-center nhd2j8a9 scb9dxdr nnctdnn4">
                                <div class="mr-1">
                                    <div class="s45kfl79 emlxlaya bkmhp75w spb7xbtv bp9cbjyn rt8b4zig n8ej3o3l">
                                        <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(${item.src})`, backgroundPosition:item.position, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                    </div>
                                </div>
                                
                                <div class="gs1a9yip ow4ym5g4 auili1gw rq0escxv j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz rz4wbd8a a8nywdso l9j0dhe7 du4w35lb rj1gh0hx pybr56ya f10w8fjw">
                                    <div class="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                        <div class="qzhwtbm6 knvmm38d">
                                            <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v ekzkrbhg oo9gr5id hzawbc8m" dir="auto">{item.name}</span>
                                        </div>
                                    </div>
                                </div>
                                {item.option?
                                <div class="n851cfcs ozuftl9m n1l5q3vz l9j0dhe7 nqmvxvec">
                                    <div class="bp9cbjyn j83agx80 btwxx1t3">
                                        <div class="j83agx80">
                                            <i data-visualcompletion="css-img" class="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/JP4tPjvtsBB.png)`, backgroundPosition: '0px -133px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                        </div>
                                    </div>
                                </div>:''}
                                
                            </div>
                        )}
                     
                    </div>
                </div>:''}
            </li>
        </ul>
     </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,
    count_notify_unseen:state.count_notify_unseen,
    count_message_unseen:state.count_message_unseen
});
export default connect(mapStateToProps, { logout,showchat })(Navbar);

