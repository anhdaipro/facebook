
import React,{useState,useEffect,useRef,useCallback} from 'react'
import { connect } from 'react-redux';
import { expiry, headers, login,logout, showchat } from '../actions/auth';
import {debounce} from 'lodash';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Tooltip from "../hocs/Tooltip"
import { checkDay,timeago } from '../constants';
import { listThreadlURL,countThreadURL,originurl,conversationsURL } from '../urls';
const Threads=(props)=>{
    const {user,setnotifi,notifi,showchat}=props
    const notifiref=useRef()
    const [show,setShow]=useState(false)
    const [loading,setLoading]=useState(false)
    const [count,setCount]=useState(0)
    const [threads,setThreads]=useState([]);
    const showthread=(e)=>{
        (async ()=>{
            try{
            e.preventDefault()
            setShow(true)
            if(threads.length==0){
            const [obj1, obj2] = await axios.all([
                axios.get(listThreadlURL,headers),
                axios.get(countThreadURL,headers)
            ])
            
            const sortedAsc = obj1.data.sort(
                (objA, objB) => Number(new Date(objB.message_last.date_created)) - Number(new Date(objA.message_last.date_created)),
            );
            setThreads(sortedAsc)
            setCount(obj2.data.count)
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
    const addthread=(e)=>{
        const rects = e.currentTarget.getBoundingClientRect();
        if(loading && e.currentTarget.scrollTop+rects.height >= e.currentTarget.scrollHeight-50 && threads.length<count){
            setLoading(false)
            axios.get(`${listThreadlURL}?from_item=${threads.length}`,headers)
            .then(res=>{
                const data=res.data
                setLoading(true)
                const datathreads=[...threads,...data]
                setThreads(datathreads)
            })
        }
        else{
            setLoading(true)
        }
    }

    const setshowchat=(e,thread)=>{
        (async()=>{
            try{
                const res =await axios.get(`${conversationsURL}/${thread.id}`,headers)
                const datachat={thread:{id:thread.id,count_message:thread.count_message},members:thread.members,show:true,messages:res.data}
                showchat(datachat)
                setShow(false)
            }
            catch(e){
                console.log(e)
            }
        })()
        
    } 
    return(
        <li ref={notifiref} onClick={(e)=>showthread(e)} class="navbar__link--message navbar__link navbar__link--hoverable navbar__link--tappable">
            <div class="navbar__link--icon">
                <a aria-label="Thông báo" class="oajrlxb2 qu0x051f" href="/notifications/" role="link" tabindex="0">
                <svg viewBox="0 0 28 28" alt="" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 rs22bh7c" fill="currentColor" height="20" width="20"><path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path></svg>
                    <div class="i09qtzwb n7fi1qx3 spb7xbtv" data-visualcompletion="ignore"></div>
                </a>
                <div aria-hidden="true" aria-label="Thông báo" class="oajrlxb2 gs1a9yip g5ia77u1" role="button" tabindex="-1">
                    <div class="i09qtzwb n7fi1qx3 b5wmifdl " data-visualcompletion="ignore"></div>
                </div>
                        
            </div>
            {show?
                <div className={`${!show?'tiktok-1pyd9ev-DivHeaderInboxWrapper':'tiktok-1t1sirr-DivHeaderInboxWrapper'} e18kkhh49`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(255, 255, 255, 1.0)" viewBox="0 0 24 8" width="24" height="8" className="tiktok-e0rxz1-StyledArrow e18kkhh48"><path d="M0 8c7 0 10-8 12-8s5 8 12 8z"></path></svg>
                    <div data-e2e="inbox-notifications" className="tiktok-vubwh3-DivInboxContainer e32s1fi0">
                        <div className="jsx-585722981 inbox-content-header">
                            <h4 className="jsx-585722981 inbox-content-notification">Thông báo</h4>
                            
                        </div>
                        <div onScroll={e=>addthread(e)} data-e2e="inbox-list" className="tiktok-o6y5r-DivInboxContentContainer e11z9zg00">
                            {threads.map(thread=>
                            <div key={thread.id} onClick={e=>setshowchat(e,thread)} className="notification-container notification-navbar">
                                <div className="notification-body flex-center">
                                    <div className="rq0escxv l9j0dhe7 du4w35lb e5d9fub0 oeao4gh3 notification-body-avatar">
                                        {thread.members.length>0?<>
                                        {thread.members.filter(member=>member.user_id!=user.id).map(member=>
                                        <img alt="Phạm Đại" class="a8c37x1j d2edcug0 sn7ne77z bixrwtb6" referrerpolicy="origin-when-cross-origin" src={member.avatar}/>
                                        )}</>:
                                        <img alt="Phạm Đại" class="a8c37x1j d2edcug0 sn7ne77z bixrwtb6" referrerpolicy="origin-when-cross-origin" src={user.avatar}/>}
                                    </div>
                                    <div className="notification-info mr-8">
                                        <div className="mb-8">
                                        {thread.members.find(member=>member.user_id!=user.id)?<>
                                        {thread.members.filter(member=>member.user_id!=user.id).map((member,i)=>
                                        <span>{i<thread.members.filter(member=>member.user_id!=user.id).length-1?`${member.name}, `:member.name}</span>)}</>:<span>{user.name}</span>}</div>
                                        {thread.message_last?
                                        <div data-testid="threadlist-last-message" class="bp9cbjyn j83agx80 m9osqain frgo5egb">
                                            <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn iv3no6db e9vueds3 j5wam9gi b1v8xokw m9osqain" dir="auto">
                                                <span class="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5 ojkyduve">{thread.message_last.user_id==user.id?"Bạn ":thread.members.find(member=>member.user_id==thread.message_last.user_id).name}:{thread.message_last.filetype=='video'?' đã gửi một video':thread.message_last.filetype=='image'?' đã gửi hình ảnh':thread.message_last.filetype=='pdf'?' đã gửi một file': thread.message_last.text}</span>
                                                </span>
                                                <span class="kvgmc6g5 kady6ibp oygrvhab dwxx2s2f">
                                                    <span class="rfua0xdk pmk7jnqg stjgntxs ni8dbmo4 ay7djpcl q45zohi1">&nbsp;</span>
                                                    <span aria-hidden="true"> · </span>
                                                </span>
                                            <span data-testid="timestamp" class="g0qnabr5">{timeago(thread.message_last.date_created)}</span>
                                        </div>:''}
                                    </div> 
                                </div>
                                
                            </div>
                            )} 
                        </div>
                    </div>
                </div>
            :''}
        </li>
    )
}
export default Threads