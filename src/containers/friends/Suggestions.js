import Navbar from "../Navbar"
import Sibar from "./Sibar"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import { listfriendsuggestURL,listfriendURL,listinvitationURL,originurl } from "../../urls"
import { headers } from "../../actions/auth"
import Empty from "./ContentEmty"
const Suggestions=()=>{
    const [listfriendsuggest,setListfriendsuggest]=useState([])
    useEffect(()=>{
        ( async ()=>{
            const res = await axios.get(listfriendsuggestURL,headers)
            setListfriendsuggest(res.data)
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
export default Suggestions