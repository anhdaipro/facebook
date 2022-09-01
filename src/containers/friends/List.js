import Navbar from "../Navbar"
import Sibar from "./Sibar"
import styles from "./sibar.module.css"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import { listfrienduserURL,listfriendURL,listinvitationURL,originurl } from "../../urls"
import { headers } from "../../actions/auth"
import { originweb } from "../../constants"
import Empty from "./ContentEmty"
import {Link} from "react-router-dom"
import Account from "./Account"
import {debounce} from 'lodash';
const Listfriend=()=>{
    const [listfriend,setListfriend]=useState([])
    const [keyword,setKeyword]=useState()
    const [count,setCount]=useState(0)
    useEffect(()=>{
        ( async ()=>{
            const res = await axios.get(listfrienduserURL,headers)
            setListfriend(res.data.listfriend)
            setCount(res.data.count)
        })()
    },[])
    const setkeyword=(e)=>{
        const value=e.target.value
        setKeyword(value)
        fetchkeyword(value)
    }
    const setlistitem=useCallback((data)=>{
        setListfriend(data)
    },[listfriend])

    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const url=value!=''?`${listfrienduserURL}?keyword=${value}`:listfrienduserURL
                const res = await axios.get(url,headers)
                setListfriend(res.data.listfriend)
                setCount(res.data.count)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[])
    return(
        <div>
            <Navbar/>
            <div class="container">
                <div className="sibar-wrapper">
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
                            <h1 className={styles.title}>Tất cả bạn bè</h1>
                        </div>
                        
                    </div>
                    <div className="search">
                        <div className="search__icon">
                            <i data-visualcompletion="css-img" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png)`, backgroundPosition: `-153px -174px`, backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                        <input onChange={e=>setkeyword(e)} value={keyword} className="search__input" placeholder="Tìm kiếm bạn bè" type="text"/>
                    </div>
                    <div className="separator"></div>
                    <div className="body-wrapper">
                        <div className={`${styles.sibar_header} mb-4`}>{count} bạn chung</div>
                        <div className="list-account">
                            {listfriend.map(item=>
                                <Account
                                item={item}
                                listitem={listfriend}
                                setlistitem={data=>setlistitem(data)}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <Empty/>  
            </div>
        </div>
    )
}
export default Listfriend