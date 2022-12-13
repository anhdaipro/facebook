import Navbar from "../Navbar"
import Sibar from "./Sibar"
import styles from "./friend.module.css"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import { listfriendsuggestURL,listinvitationURL,originurl,friendsBirthdayURL } from "../../urls"
import { headers } from "../../actions/auth"
import { groupBy, timeformat } from "../../constants"
import Tooltip from "../../hocs/Tooltip"
const FriendsBirthday=()=>{
    const [listfriendsuggest,setListfriendsuggest]=useState([])
    const [listinvitation,setListinvitation]=useState([])
    useEffect(()=>{
        ( async ()=>{
            const res=await axios.get(friendsBirthdayURL,headers)
            setListfriendsuggest(res.data)
        })()
    },[])
    const today=listfriendsuggest.find(item=>new Date().getDay()==new Date(item.date_of_birth).getDay() &&  new Date().getMonth()==new Date(item.date_of_birth).getMonth())
    const upcoming_birthday = listfriendsuggest.filter(item=>new Date().getDay()<new Date(item.date_of_birth).getDay() &&  new Date().getMonth()==new Date(item.date_of_birth).getMonth())
    const groups = listfriendsuggest.reduce(function (r, o) {
        var m = o.date_of_birth.split(('-'))[1];
        (r[m])? r[m].data.push(o) : r[m] = {group: m, data: [o]};
        return r;
    }, {});
    console.log(groups)
    const results = Object.keys(groups).map(k =>{ return groups[k] });
    console.log(results)
    return(
        <div>
            <Navbar/>
            <div class="container">
                <Sibar/>
                <div className={styles.body_container}>
                    <div className={styles.box}>
                        <div className={styles.header}>
                            <div className={styles.title}>Sinh nhật sắp tới</div>
                            
                        </div>
                        <div className="list-account">
                            {upcoming_birthday.map(item=>
                            <div key={item.id} className={`${styles.account} item-space`}>
                                <div className="flex flex-center">
                                    <div className={`avatar`}>
                                        <img src={originurl+item.avatar} className="avatar__image"/>
                                    </div>
                                    <div>
                                        <div className={styles.name}>{item.name}</div>
                                        
                                        <div className={styles.date_of_birth}>{timeformat(item.date_of_birth)}</div>
                                    </div>     
                                </div>
                                <div>{new Date().getFullYear()-new Date(item.date_of_birth).getFullYear()} tuổi</div>        
                            </div>
                            )}
                        </div>
                    </div>
                    {results.map(month=>
                        <div className={styles.box}>
                            <div className={styles.header}>
                                <div>
                                <div className={styles.title}>Sinh nhật Tháng {month.group}</div>
                                <div className="list_name">
                                    {month.data.map((item,i)=><a key={item.id} className={`${styles.name} ${styles.name_account}`}>{item.name} {i==0 && month.data.length>1?', ':''}</a>)}
                                    {month.data.length>2?<span className={styles.info}>và {month.data.length} người khác</span>:''}
                                </div>
                                </div>
                            </div>
                            <div className="list-account flex">
                                {month.data.map(item=>
                                    <Tooltip
                                        position='bottom'
                                        content={<div>{new Date(item.date_of_birth).getDay()} Tháng {('0'+(new Date(item.date_of_birth).getMonth()+1)).slice(-2)} là sinh nhật của {item.name}</div>}
                                    >
                                        <div key={item.id} className={`avatar`}>
                                            <img src={originurl+item.avatar} className="avatar__image"/>
                                        </div>      
                                    </ Tooltip>  
                                )}
                            </div>
                        </div>
                    
                    )}
                </div>
                
            </div>
        </div> 
    )
}
export default FriendsBirthday