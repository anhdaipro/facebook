import Navbar from "../Navbar"
import Sibar from "./Sibar"
import styles from "./friend.module.css"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import { listfriendsuggestURL,listfriendURL,listinvitationURL,originurl } from "../../urls"
import { headers } from "../../actions/auth"
import { originweb } from "../../constants"
import Empty from "./ContentEmty"
const Listfriend=()=>{
    const [listfriend,setListfriend]=useState([])
    useEffect(()=>{
        ( async ()=>{
            const res = await axios.get(listfriendURL,headers)
            setListfriend(res.data)
        })()
    },[])
    return(
        <div>
            <Navbar/>
            <div class="container">
                <Sibar/>
                <Empty/>  
            </div>
        </div>
    )
}
export default Listfriend