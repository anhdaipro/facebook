import Navbar from "../Navbar"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import {Link} from "react-router-dom"
import { listfriendsuggestURL,actionfriendURL,originurl } from "../../urls"
import { headers } from "../../actions/auth"
import styles from "./sibar.module.css"
import Empty from "./ContentEmty"
const Suggestions=()=>{
    const [listfriendsuggest,setListfriendsuggest]=useState([])
    useEffect(()=>{
        ( async ()=>{
            const res = await axios.get(listfriendsuggestURL,headers)
            setListfriendsuggest(res.data)
        })()
    },[])
    const setactionfriend=(action,itemchoice)=>{
        (async ()=>{
                const data={action:action,receiver_id:itemchoice.user_id}
                const res =await axios.post(actionfriendURL,JSON.stringify(data),headers)
                const listdata=action=='hide_suggested'?listfriendsuggest.filter(item=>item.id!=itemchoice.id):
                listfriendsuggest.map(item=>{
                    if(itemchoice.id==item.id){
                        return({...item,...res.data.action})
                    }
                    return({...item})
                })
                setListfriendsuggest(listdata)
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
                            <h1 className={styles.title}>Gợi ý</h1>
                        </div>
                    </div>
                    
                    <div className="separator"></div>
                    <div className="body-wrapper">
                        <div className={`${styles.sibar_header} mb-4`}>Những người bạn có thể biết</div>
                        <div className="list-account">
                            {listfriendsuggest.map(item=>
                                <div key={item.id} className={styles.item}>
                                    <div className="flex flex-center">
                                        <div className={`avatar`}>
                                            <img src={item.avatar} className="avatar__image"/>
                                        </div>
                                        <div>
                                            <div className={styles.name}>{item.name}</div>
                                            {!item.friend_invitation?
                                            <div className="flex flex-center">
                                                <button onClick={()=>setactionfriend('friend_invitation',item)} className={`btn btn-l mr-1 btn-add-friend`}>
                                                    <span className={`${item.friend_invitation?'text-normal':'text-primary'}`}>Thêm bạn bè</span> 
                                                </button>
                                                <button onClick={()=>setactionfriend('hide_suggested',item)} className={`btn btn-l btn-second`}>
                                                    <span className={`text-normal`}>Xóa, gỡ bỏ</span> 
                                                </button> 
                                            </div>:<div className={styles.item__info}>Đã gửi lời mời</div>}
                                        </div>     
                                    </div>
                                    {item.friend_invitation?                  
                                    <button onClick={()=>setactionfriend('friend_invitation')} className={`btn btn-l ${item.friend_invitation?'btn-second':'btn-add-friend'}`}>
                                        <span className={`${item.friend_invitation?'text-normal':'text-primary'}`}>{item.friend_invitation?'Hủy':'Thêm bạn bè'}</span> 
                                    </button>:''}           
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Empty/>  
            </div>
        </div>
    )
}
export default Suggestions