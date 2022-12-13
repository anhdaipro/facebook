import Navbar from "../Navbar"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import {Link} from "react-router-dom"
import { listfriendsuggestURL,actionfriendURL,originurl,listinvitationURL } from "../../urls"
import { headers } from "../../actions/auth"
import styles from "./sibar.module.css"
import Empty from "./ContentEmty"
const InvitationFriend=()=>{
    const [listinvitation,setListinvitation]=useState([])
    useEffect(()=>{
        ( async ()=>{
            const res = await axios.get(listinvitationURL,headers)
            setListinvitation(res.data)
        })()
    },[])
    const setactionfriend=(action,itemchoice)=>{
        (async ()=>{
                const data={action:action,receiver_id:itemchoice.user_id}
                const res =await axios.post(actionfriendURL,JSON.stringify(data),headers)
                const listdata=action=='hide_suggested'?listinvitation.filter(item=>item.id!=itemchoice.id):
                listinvitation.map(item=>{
                    if(itemchoice.id==item.id){
                        return({...item,...res.data.action})
                    }
                    return({...item})
                })
                setListinvitation(listdata)
        })()
    }
    return(
        <div>
            <Navbar/>
            <div class="container">
            <div className="sibar-wrapper wrapper-l">
                    <div className={`flex-center flex m-1`}>
                        <div className={`link--icon`}>
                            <Link to="/friends">
                                <i data-visualcompletion="css-img" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png)`, backgroundPosition: `-142px -86px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            </Link>
                        </div>
                        <div>
                            <div className="my-1_2">
                                <Link className="" to="/friends" className={`link`}>
                            
                                    <span className="link__text">Bạn bè</span>
                                </Link>
                            </div>
                            <h1 className={styles.title}>Lời mời kết bạn</h1>
                        </div>
                    </div>
                    
                    <div className="separator"></div>
                    <div className="body-wrapper">
                        <div className={`${styles.sibar_header} font-l`}>Lời mời kết bạn</div>
                        <div className={`${styles.sibar_header} text-blue my-1_2`}>Xem lời mời đã gửi</div>
                        {listinvitation.length==0?<div className={`${styles.sibar_header} ${styles.info} my-1`}>Không có yêu cầu mới</div>:
                        <div className="list-account">
                            {listinvitation.map(item=>
                                <div key={item.id} className={styles.item}>
                                    <div className="flex flex-center">
                                        <div className={`avatar`}>
                                            <img src={item.avatar} className="avatar__image"/>
                                        </div>
                                        <div>
                                            <div className={styles.name}>{item.name}</div>
                                            
                                            <div className="flex flex-center">
                                                <button onClick={()=>setactionfriend('accept_friend',item)} className={`btn btn-l mr-1 btn-add-friend`}>
                                                    <span className={`${item.friend_invitation?'text-normal':'text-primary'}`}>Chấp nhận</span> 
                                                </button>
                                                <button onClick={()=>setactionfriend('hide_suggested',item)} className={`btn btn-l btn-second`}>
                                                    <span className={`text-normal`}>Xóa</span> 
                                                </button> 
                                            </div>
                                        </div>     
                                    </div>         
                                </div>
                            )}
                        </div>}
                    </div>
                </div>
                <Empty/>  
            </div>
        </div>
    )
}
export default InvitationFriend