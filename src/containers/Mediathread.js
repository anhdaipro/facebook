import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify,showreport,showactionport } from "../actions/auth";
import { filepostURL,listfriendURL, originurl,mediathreadURL, actionpostURL, listcommenfileposttURL } from "../urls";
import { number,timeago,listemoji,listaction,listitem } from "../constants";
import { useNavigate,Link,useParams,useSearchParams } from 'react-router-dom';
import Navbar from "./Navbar"
import {debounce} from 'lodash';
import Tooltip from "../hocs/Tooltip";
import Actionpost from "../hocs/Actionpost";
import io from "socket.io-client"
import { connect } from 'react-redux';

const Mediathread=(props)=>{
    const {user,showactionport,showreport,isAuthenticated}=props
    const [file,setFile]=useState()
    const [listfile,setListfile]=useState([])
    const [length,setLength]=useState(0)
    const [params, setSearchParams] = useSearchParams();
    const [listtags,setListtags]=useState([])
    const [state,setState]=useState({edit:false,disabled:false,paly:false})
    const [searchitem,setSearchitem]=useState({keyword:new URLSearchParams(document.location.search).get('keyword')})
    const search=Object.fromEntries([...params])
    console.log(params.get('thread_id'))
    const socket=useRef()
    const [index,setIndex]=useState(0)
    const [onlineUsers,setOnlineUsers]=useState([])
    const videoref=useRef()
    const parent=useRef()
    const navigate=useNavigate()
    useEffect(() => { 
        socket.current=io.connect('https://server-socket-123.herokuapp.com')
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
             users
            );
        });
       
        return () => socket.current.disconnect()
    },[])

    console.log(onlineUsers)
    useEffect(()=>{
        (async ()=>{
            await isAuthenticated
            const res =await axios.get(`${mediathreadURL}?${params}`,headers)
            setFile(res.data)
            setLength(res.data.list_file.length)
            setListfile(res.data.list_file)
            
        })()
    },[params])
    

    const setindex=(value)=>{ 
        const i=value>=length-1?0:value<0?length-1:value
        
        setIndex(i)
        setFile(listfile[i])
        if(i==length-1){
            axios.get(`${mediathreadURL}?item=${listfile[i].id}`)
        }
    }
   
    return(   
        <div id="main">
            <Navbar/>
            <div class="ehxjyohh kr520xx4 j9ispegn poy2od1o dhix69tm byvelhso buofh1pr j83agx80 rq0escxv bp9cbjyn">
                <div aria-hidden="false" class="pedkr2u6 pmk7jnqg kp4lslxn ms05siws pnx7fd3z nf1dmkjp s0qqerhg">
                    <span class="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                        <div aria-label="Đóng" class="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 qypqp5cg q676j6op d6rk862h ljqsnud1" role="button" tabindex="0">
                            <i data-visualcompletion="css-img" class="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/51oxzk6A9dq.png)`, backgroundPosition: `-105px -67px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            
                        </div>
                    </span>
                </div>
                <a aria-label="Facebook" class="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l q9uorilb lzcic4wl pedkr2u6 ms05siws pnx7fd3z nf1dmkjp s0qqerhg" href="/" role="link" tabindex="0">
                    <svg viewBox="0 0 36 36" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 kzkm17cn" fill="url(#jsc_s_9)" height="40" width="40"><defs><linearGradient x1="50%" x2="50%" y1="97.0782153%" y2="0%" id="jsc_s_9"><stop offset="0%" stop-color="#0062E0"></stop><stop offset="100%" stop-color="#19AFFF"></stop></linearGradient></defs><path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path><path class="p361ku9c" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"></path></svg>
                </a>

            </div>
            <div className="hybvsw6c home-file-container pt-16">
                {file && user?
                <div className="container-file" style={{height:'100%'}}>
                    <div className="home-file-wrapper buofh1pr relative"> 
                        <div className="p01isnhg facebook-edit-file-wrap">
                            <div  className="facebook-edit-file">
                                {!file.file_preview?
                                <div ref={parent} className="tn0ko95a facebook-edit-image">
                                    <img
                                        alt="Crop image"
                                        className="ji94ytn4 d2edcug0 r9f5tntg r0294ipz"
                                        src={file.file}
                                        
                                    />
                                  
                                </div>
                                :
                                <div  className="apxknhg1">
                                    <video ref={videoref} style={{display: 'block'}} className="k4urcfbm r0294ipz datstx6m"  controls={true}  src={file.file}></video>    
                                </div>
                            }
                            </div>
                            {length>1?<>
                                <div onClick={()=>{setindex(index-1)}} className={`bnt-action btn-preview`}>
                                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: '0px -100px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                                <div onClick={()=>setindex(index+1)} className={`bnt-action bnt btn-next`}>
                                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-83px -13px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            </div></>:''}
                        </div>
                        <div className="list-file-chat flex">
                        {listfile.map(item=>
                            <div onClick={()=>setFile(item)} className={`file-chat beltcj47 p86d2i9g aot14ch1 kzx2olss q9uorilb pfnyh3mw ni8dbmo4 stjgntxs tv7at329 thwo4zme fv0vnmcu ggphbty4 ${file.id===item.id?'active':''} border-6`} key={item.id}>
                                <img className="datstx6m bixrwtb6 k4urcfbm" src={`${item.file_preview?item.file_preview:item.file}`} />
                            </div>
                        )}
                    </div>  
                    </div>
                    
                </div>:''}
            </div>
        </div>
                                                                                                                                                            
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,actionpost:state.postaction
});
  
export default connect(mapStateToProps,{showreport,showactionport})( Mediathread);
