import Navbar from "../Navbar"
import Sibar from "./Sibar"
import styles from "./friend.module.css"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import { listfriendsuggestURL,listinvitationURL,originurl } from "../../urls"
import { headers } from "../../actions/auth"
import { originweb } from "../../constants"
const Homefriend=()=>{
    const [listfriendsuggest,setListfriendsuggest]=useState([])
    const [listinvitation,setListinvitation]=useState([])
    useEffect(()=>{
        
        ( async ()=>{
            const [obj1,obj2]=await axios.all([
                axios.get(listfriendsuggestURL,headers),
                axios.get(listinvitationURL,headers)
            ])
            setListfriendsuggest(obj1.data)
            setListinvitation(obj2.data)
        })()
    },[])
    return(
        <div>
            <Navbar/>
            <div class="container">
                <Sibar/>
                <div className={styles.body_container}>
                    {listinvitation.length>0?
                    <div className={styles.wrapper}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Lời mời kết bạn</h1>
                            <button className="btn-link">Xem tất cả</button>
                        </div>
                        <div className={styles.list_item}>
                            {listinvitation.map(item=>
                            <div className={styles.item_wrapper}>
                            <div key={item.user_id} className={styles.item}>
                                <a className="link-account">
                                    <img className={styles.avatar} src={originurl+item.avatar}/>
                                </a>
                                <div className='p-12'>
                                    <a className={styles.name}>
                                        <span className={styles.name}>{item.name}</span>
                                        
                                    </a>
                                    <div className="my-1">
                                        <button className="btn-primary btn-large">Xác nhận</button>
                                    </div>
                                    <div>
                                        <button className="btn-light btn-large">Xóa</button>
                                    </div>
                                
                                </div>
                                
                            </div>
                            </div>
                            )}
                        </div>
                    </div>:''}
                    {listfriendsuggest.length>0?
                    <div className={styles.wrapper}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Những người bạn có thể biết</h1>
                            <button className="btn-link">Xem tất cả</button>
                        </div>
                        <div className={styles.list_item}>
                            {listfriendsuggest.map(item=>
                            <div className={styles.item_wrapper}>
                            <div key={item.user_id} className={styles.item}>
                                <a className="link-account">
                                    <img className={styles.avatar} src={originurl+item.avatar}/>
                                </a>
                                <div className='p-12'>
                                    <a className={styles.name}>
                                        <span className={styles.name}>{item.name}</span>
                                        
                                    </a>
                                    <div className="my-1">
                                        <button className={`btn btn-large ${item.friend_invitation?'btn-second':'btn-add-friend'}`}>
                                            <span className={`${item.friend_invitation?'text-normal':'text-primary'}`}>{item.friend_invitation?'Hủy':'Thêm bạn bè'}</span> 
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn-light btn-second btn-large">Xóa</button>
                                    </div>
                                
                                </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>:''}
                </div>
            </div>
        </div>
    )
}
export default Homefriend