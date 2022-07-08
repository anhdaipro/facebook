import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { headers } from '../actions/auth';
import {dataURLtoFile,generateString,listitem} from "../constants"
import {listfriendURL,actionpostURL, originurl,uploadfileURL, listcategoriesURL} from "../urls"
import {debounce} from 'lodash';
const Inputsearch=(props)=>{
    const {mentions,setlistuser,state,setstate}=props
    const setkeyword=(e)=>{
        const value=e.target.value
        setstate({...state,text:value})
        if(value.trim()!==''){
        fetchkeyword(value)}
    }
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const res = await axios.get(`${listfriendURL}?keyword=${value}`,headers)
                const datauser=mentions?res.data.filter(item=>mentions.every(mention=>mention.id!=item.id)):res.data
                setlistuser(datauser)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[mentions])
    return(
    
        <div className="bp9cbjyn r64x2ps9 j83agx80 pi1r6xr4 hv4rvrfc dati1w0a">
            <div className="k4urcfbm">
                <div className="k4urcfbm j83agx80 bp9cbjyn">
                <label className="lzcic4wl gs1a9yip br7hx15l h2jyy9rg n3ddgdk9 owxd89k7 rq0escxv j83agx80 a5nuqjux l9j0dhe7 k4urcfbm rz7trki1 b3i9ofy5">
                    <span className="ijkhr0an pvl4gcvk sgqwj88q bp9cbjyn j83agx80 g0qnabr5 hzruof5a h4z51re5">
                        <svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" className="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 py1f6qlh gl3lb2sf hhz5lgdu"><g fill-rule="evenodd" transform="translate(-448 -544)"><g fill-rule="nonzero"><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg>
                    </span>
                    <input onChange={(e)=>setkeyword(e)} dir="ltr" aria-label="Tìm kiếm bạn bè" role="textbox" placeholder="Tìm kiếm bạn bè" autocomplete="off" spellcheck="false" aria-invalid="false" className="oajrlxb2 f1sip0of hidtqoto e70eycc3 hzawbc8m ijkhr0an pvl4gcvk sgqwj88q b1f16np4 hdh3q7d8 dwo3fsh8 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz br7hx15l h2jyy9rg n3ddgdk9 owxd89k7 rq0escxv oo9gr5id mg4g778l buofh1pr g5gj957u ihxqhq3m jq4qci2q hpfvmrgz lzcic4wl l9j0dhe7 iu8raji3 l60d2q6s p8fzw8mz hwnh5xvq pcp91wgn tv7at329 aj8hi1zk kd8v7px7 r4fl40cc m07ooulj mzan44vs" type="text" value={state.text}/>
                </label>
                
            </div>
        </div>
    </div> 
     
    )
}
export  default Inputsearch