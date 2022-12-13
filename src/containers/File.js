import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify,showreport,showactionport } from "../actions/auth";
import { filepostURL,listfriendURL, originurl,actionfilepostURL,listcommentURL, actionpostURL, listcommenfileposttURL } from "../urls";
import { number,timeago,listemoji,listaction,listitem } from "../constants";
import { useNavigate,Link,useParams,useSearchParams } from 'react-router-dom';
import Navbar from "./Navbar"
import {debounce} from 'lodash';
import Tooltip from "../hocs/Tooltip";
import Actionpost from "../hocs/Actionpost";
import io from "socket.io-client"
import { connect } from 'react-redux';
import Listcomment from './Listcomment';
import EmojiPicker from '../hocs/EmojiPicker';
const listactionfile=[
{name:'Phóng to',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/WLNld78cruo.png',position:'0px -246px',action:'zoom-out'},
{name:'Thu nhỏ',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/WLNld78cruo.png',position:'0px -267px',action:'zoom-in'},
{name:'Gắn thẻ bạn bè',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png',position:'0px -1237px',action:'tag',author:true},
{name:'Chuyển sang toàn màn hình',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/TOr1QPw1amR.png',position:'-42px -240px',action:'fullscream'}

]
const File=(props)=>{
    const {user,showactionport,showreport,isAuthenticated}=props
    const [file,setFile]=useState()
    const [params, setSearchParams] = useSearchParams();
    const [listtags,setListtags]=useState([])
    const [state,setState]=useState({edit:false,disabled:false,paly:false})
    const [searchitem,setSearchitem]=useState({keyword:new URLSearchParams(document.location.search).get('keyword')})
    const search=Object.fromEntries([...params])
    console.log(params.get('post_id'))
    const socket=useRef()
    const [index,setIndex]=useState(0)
    const [listuser,setListuser]=useState([])
    const [text,setText]=useState('')
    const [key,setKey]=useState('')
    const [onlineUsers,setOnlineUsers]=useState([])
    const [scale, setScale] = useState(1)
    const [action,setAction]=useState()
    const [addtagfile,setAddtagfile]=useState()
    const [tagupdate,setTagupdate]=useState([])
    const [item,setItem]=useState()
    const videoref=useRef()
    const parent=useRef()
    const [showemoji,setShowemoji]=useState(false)
    const navigate=useNavigate()
    useEffect(() => { 
        socket.current=io.connect('https://web-production-e133.up.railway.app')
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
             users
            );
        });
       
        return () => socket.current.disconnect()
    },[])

    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const handleClick = (event) => {
        const { target } = event
        if(parent.current!=null){
            if (!parent.current.contains(target)) {
                setAddtagfile()
            }
        }
    }
    console.log(onlineUsers)
    useEffect(()=>{
        (async ()=>{
            await isAuthenticated
            const res =await axios.get(`${filepostURL}?${params}`,headers)
            setFile(res.data)
            if(res.data.list_file.length>1){
                setItem(res.data)
            }
            const dataitem=res.data.list_file.length>1?res.data:{...res.data,id:params.get('thread_id')}
            setItem(dataitem)
            if(res.data.tags){
            setIndex(res.data.list_file.indexOf(res.data.id))
            setListtags(JSON.parse(res.data.tags))
            setTagupdate(JSON.parse(res.data.tags))
            }
        })()
    },[params])
    
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const res = await axios.get(`${listfriendURL}?keyword=${value}`,headers)
                const datauser=res.data.filter(item=>tagupdate.every(mention=>mention.id!=item.id))
                setListuser(datauser)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[])

   
    const setindex=(value)=>{ 
        const i=value>file.list_file.length-1?0:value<0?file.list_file.length-1:value
        setIndex(i)
        setSearchParams({...params,post_id:params.get('post_id'),id:file.list_file[i]})
    }
    const settagupdate=(e,item)=>{
        e.stopPropagation()
        const itempost=item
        const data={...addtagfile,...itempost}
        setTagupdate([...tagupdate,data])
        setAddtagfile()
        setText('')
        setListuser([])
    }
    const removetag=(e,itemchoice)=>{
        e.stopPropagation()
        const data=tagupdate.filter(item=>item.id!=itemchoice.id)
        setTagupdate(data)
    }
    
    const setaddtagfile=(e)=>{
        if(action=='tag'){
        const rects = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rects.left;
        const y=e.clientY-rects.top
        setAddtagfile({top:y*100/rects.height,left:x*100/rects.width})
        console.log(y*100/rects.height)
        }     
    }
    
    const settag=(e,itemchoice,name,value)=>{
        const datatags=tagupdate.map(item=>{
            if(item.id==itemchoice.id){
                return({...item,[name]:value})
            }
            return({...item})
        })
        setTagupdate(datatags)
    }
    const updatelisttags=(data)=>{
        setTagupdate(data)
    }
    
    const submitlisttags=(e)=>{
        setListtags(tagupdate)
        let form =new FormData()
        form.append('id',params.get('id'))
        form.append('tagfile',JSON.stringify(tagupdate))
        axios.post(`${filepostURL}`,form,headers)
        .then(res=>{
            setAction('')
        })
    }
   
    const setaddkey=(e,value)=>{
        setKey(key+value)
    }
    
    const setaction=(e,action)=>{
        e.stopPropagation()
        setAction(action)
            if(action=='zoom-in'){
                setScale(scale-0.2<=1?1:scale-0.2)
            }
            else if(action=='zoom-out'){
                setScale(scale+0.2>=2?2:scale+0.2)
            }
            else{
                const elem=parent.current
                if (elem.requestFullscreen) {
                elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
                }
            }
        
    }
    const seteditnote=(e)=>{
        let form =new FormData()
        form.append('id',params.get('id'))
        form.append('note',key)
        axios.post(filepostURL,form,headers)
        .then(res=>{
            setFile({...file,note:key})
            setState({...state,editnote:false})
        })
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
                {item && user?
                <div className="flex container-file">
                    <div className="home-file-wrapper buofh1pr relative"> 
                        <div className="p01isnhg facebook-edit-file-wrap">
                            <div  className="facebook-edit-file">
                                {!file.file_preview?
                                <div ref={parent} onClick={e=>setaddtagfile(e)} style={{transform: `translate(0px, 0px) scale(${scale})`}} className="tn0ko95a facebook-edit-image">
                                    <img
                                        alt="Crop image"
                                        className="ji94ytn4 d2edcug0 r9f5tntg r0294ipz"
                                        src={file.file}
                                        
                                    />
                                    {addtagfile?<>
                                    <div className="file-tag-position" style={{position:'absolute',top:`calc(${addtagfile.top}% - 50px)`,left:`${addtagfile.left}%`,transform:`translate(-50%, 0px)`}}></div>
                                    <div className="facebook-add-tag-file" style={{position:'absolute',top:`calc(${addtagfile.top}% + 60px)`,left:`${addtagfile.left}%`,transform:`translate(-50%, 0px)`}}>
                                        <div onClick={e=>e.stopPropagation()} className="facebook-input-tag">
                                            <div className="flex flex-center">
                                                <div>
                                                    <i data-visualcompletion="css-img" className="hu5pjgll mr-4 cwsop09l" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-51px -109px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                </div>
                                                <input spellCheck={false} onChange={e=>{setText(e.target.value)
                                                    const value=e.target.value
                                                    fetchkeyword(value)
                                                }} value={text} />
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <ul className="facebook-file-tags">
                                                {listuser.map((item,i)=><>
                                                
                                                <li onClick={(e)=>settagupdate(e,item)} key={i} className="facebook-tag">
                                                    <div className="facebook-tag-avatar">
                                                        <img width='36' src={item.avatar}/>
                                                    </div>
                                                    <div>{item.name}</div>
                                                </li></>
                                                )}
                                            </ul>
                                        </div>
                                    </div></>
                                    :""}
                                    
                                    {tagupdate.map((item,i)=><div onMouseLeave={e=>{
                                            if(action!='tag'){
                                            settag(e,item,'showtag',false)
                                            }}} onMouseEnter={e=>{
                                                if(action!='tag'){
                                                settag(e,item,'showtag',true)
                                                }
                                            }}>

                                        <div  className="file-tag-position tag-post-file" style={{position:'absolute',top:`calc(${item.top}% - 50px)`,left:`${item.left}%`,transform:`translate(-50%, 0px)`}}></div>
                                        <div key={i} className={`${item.showtag ||action=='tag'?'':'d-none'} facebook-tag-user-file`} style={{position:'absolute',top:`calc(${item.top}% + 60px)`,left:`${item.left}%`,transform:`translate(-50%, 0px)`}}>
                                            <div className="flex flex-center item-space">
                                                <div className="mr-4">{item.name}</div>
                                                <div onClick={(e)=>removetag(e,item)} className="facebook-item-close">
                                                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '0px -92px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                </div>
                                            </div>
                                            <div className="d06cv69u cdcbzqsl goun2846 ccm00jje s44p3ltw mk2mc5f4 tl61u9r6 bcctvi4p gcjuebxg kvs4odcb hzruof5a pmk7jnqg et4y5ytx np69z8it bssd97o4 n4j0glhw h9efg1rk" style={{transform: `translate(0px, 7px) rotate(-45deg)`}}></div>
                                        </div></div>
                                    )}
                                </div>
                                :
                                <div  className="apxknhg1">
                                    <video ref={videoref} style={{display: 'block'}} className="k4urcfbm r0294ipz datstx6m"  controls={true}  src={file.file}></video>    
                                </div>
                            }
                            </div>
                            {file.list_file.length>1?<>
                                <div onClick={()=>{setindex(index-1)}} className={`bnt-action btn-preview`}>
                                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: '0px -100px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                                <div onClick={()=>setindex(index+1)} className={`bnt-action bnt btn-next`}>
                                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-83px -13px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            </div></>:''}
                        </div>
                        {action=='tag'?
                        <div class="__fb-dark-mode cjfnh4rs ff7izwzc aovydwv3 kpb67iw4 i09qtzwb j83agx80 fdipuqhw taijpn5t jfpizvyy hzruof5a pmk7jnqg k4urcfbm">
                            <div class="pmk7jnqg kfkz5moi cj5g2342">
                                <div class="bp9cbjyn j83agx80 rv4hoivh">
                                    <div class="ihqw7lf3">
                                        <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v ekzkrbhg oo9gr5id" dir="auto">
                                            <span class="a8c37x1j ni8dbmo4 color-white stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Nhấp vào ảnh để bắt đầu gắn thẻ</span>
                                        </span>
                                    </div>
                                </div>
                                <div class="oqq733wu flex">
                                    <div onClick={e=>submitlisttags(e)} aria-label="Gắn thẻ xong" class="mr-8 oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                                        <div class="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq s1i5eluu tv7at329">
                                            <div class="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                <div class="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p bwm1u5wc" dir="auto">
                                                        <span class="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Gắn thẻ xong</span>
                                                    </span>
                                                </div>
                                            </div>
                                        
                                        </div>
                                    </div>
                                    <div onClick={e=>{setTagupdate(listtags)
                                        setAction('')
                                    }} aria-label="Hủy" class="ml-8 oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab  jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                                        <div class="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329">
                                            <div class="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                <div class="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p" dir="auto">
                                                        <span class="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Hủy</span>
                                                    </span>
                                                </div>
                                            </div>
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>:''}
                        <div className="list-action-file">
                        {listactionfile.map((item,i)=>{
                        if(item.action=='tag'){
                            if(user.id==file.user.id){
                            return(
                            <div key={i} aria-label={item.name} onClick={e=>setAction(item.action)} className={`${action=='tag'?'disabled':''} oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tv7at329 thwo4zme d6rk862h ljqsnud1`} role="button" tabindex="0">                 
                                <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(${item.src})`, backgroundPosition: item.position, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>    
                            </div>
                            )}
                        }
                        else{
                            return(
                            <div key={i} aria-label={item.name} onClick={e=>setaction(e,item.action)} className={`${(action=='tag') || (item.action=='zoom-in' && scale<=1) || (item.action=='zoom-out' && scale>=2)?'disabled':''} oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tv7at329 thwo4zme d6rk862h ljqsnud1`} role="button" tabindex="0">                 
                                <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(${item.src})`, backgroundPosition: item.position, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>    
                            </div>
                            )
                        }
                        })} 
                        
                        </div>
                    </div>
                    
                    <div className="content-right rq0escxv buofh1pr pt-50 l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0  hybvsw6c gitj76qy dp1hu0rb kelwmyms dzul8kyi e69mrdg2">       
                        <div className="content-body-file">
                            <div className="relative flex flex-center">
                                <a href="#">
                                    <div className="profile-images">
                                        <img src={file.user.avatar}/>
                                        <div className={`${onlineUsers.some(user=>user.userId==file.user.id)?'online-icon':'offline_icon'}`}></div>
                                    </div>
                                </a>
                                
                                <div className="ml-8">
                                    <div className="profile-name-text mb-8">
                                        <a href="#" id="Profile_Name">{file.user.name}</a>

                                        <div className="profile-name-hover">
                                        
                                            <a href="#"><div className="profile-images">
                                                <img src={file.user.avatar}/>
                                                <div className={`${onlineUsers.some(user=>user.userId==file.user.id)?'online-icon':'offline_icon'}`}></div>
                                            </div></a>

                                            <h2>
                                                <a href="#" id="Profile_Name">{file.user.name}</a>
                                            </h2>

                                            <p>
                                                <span className="fas fa-briefcase pn-hover-icon"></span>
                                                <span>সাধারণ ছেলে, at </span> 
                                                <a href="#">Facebook App</a>
                                            </p>

                                            <p>
                                                <span className="fas fa-home pn-hover-icon"></span>
                                                <span>Lives in </span>
                                                <a href="#">Dhaka, Bangladesh</a>
                                            </p>

                                            <ul>
                                                <a href="#"><li className="add-storry-btn">
                                                    <i className="fas fa-plus-circle"></i>
                                                    Add to Storry
                                                </li></a>
                                                <li className="edit-profile-btn">
                                                    <i className="fas fa-pen"></i>
                                                    Edite Profile
                                                </li>
                                                <li className="three-dot-btn">
                                                    <i className="fas fa-ellipsis-h"></i>
                                                </li>
                                            </ul>

                                        </div>

                                    </div>
                                    <div className='flex'>
                                        <div>
                                            <a href="#" className="Post_upload_date">August 16 
                                                <span className="uplode-Date_Hover">
                                                    Monday, 16 August, 2021 at 8:30 PM
                                                </span>
                                            </a>
                                        </div>
                                        <div className="jpp8pzdo">
                                            <span className="rfua0xdk pmk7jnqg stjgntxs ni8dbmo4 ay7djpcl q45zohi1">&nbsp;</span>
                                            <span aria-hidden="true"> · </span>
                                        </div>
                                            
                                        <div className="flex flex-center">
                                            <Tooltip
                                                content={
                                                    <>
                                                    {listitem.find(em=>em.value==file.viewer).name}
                                                    </>
                                                }
                                                position='top'
                                                >
                                                <div onClick={(e)=>{
                                                    e.stopPropagation()
                                                    if(user.id==file.user.id){
                                                    axios.get(`${actionpostURL}/${file.id}`,headers)
                                                    .then(res=>{
                                                        showactionport({viewer:{value:file.viewer},id:file.id,listspecific:res.data.listspecific,listexcept:res.data.listexcept,action:'addviewer'})
                                                    })
                                                    
                                                    }
                                                    }} className="flex">
                                                    <img className="hu5pjgll m6k467ps" src={listitem.find(em=>em.value==file.viewer).src} alt="Bạn bè" height="12" width="12"/>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <Actionpost
                                post={file}
                                user={user}
                                showactionport={data=>showactionport(data)}
                                />

                            </div> 
                            <div className="flex flex-center pt-1_2">
                            {tagupdate.map(item=>
                                <div className="">
                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw oo9gr5id" dir="auto">
                                        <span>—&nbsp;</span>với 
                                        <strong>
                                            <a className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gpro0wi8 oo9gr5id lrazzd5p" href={item.username} role="link" tabindex="0">
                                                <span className="nc684nl6"><span> {item.name}</span>
                                                </span>
                                            </a>
                                        
                                        </strong>.
                                    </span>
                                </div>
                            )}
                            </div>
                            {file.note?<div class="a8nywdso j7796vcc rz4wbd8a l29c1vbm"><span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw oo9gr5id" dir="auto">{file.note}</span></div>:''}
                            <div className="flex flex-center">
                                {!state.editnote?
                                <div onClick={e=>setState({...state,editnote:true})} className="btn-light border-6 my-1_2 nhd2j8a9 flex item-center">
                                    <span>Chỉnh sửa</span>
                                </div>:
                                <div className="relative box-input-file">
                                   <div className="j83agx80 k4urcfbm mb-1">
                                        <div className="g5ia77u1 buofh1pr d2edcug0 hpfvmrgz l9j0dhe7">
                                            <textarea spellCheck={false} onChange={e=>
                                                setKey(e.target.value)}
                                             value={key} placeholder={'bắt đầu nhập'} dir="ltr" aria-invalid="false" id="jsc_c_c7" className="oajrlxb2 f1sip0of hidtqoto g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv oo9gr5id j83agx80 jagab5yi p-8 knj5qynh fo6rh5oj lzcic4wl ni8dbmo4 stjgntxs hv4rvrfc dati1w0a ieid39z1 k4urcfbm" rows="4" style={{overflowY: 'auto',resize:'none'}}></textarea>
                                         </div>
                                    </div>
                                    <div style={{position:'absolute',top:'10px',right:0}}>
                                        <EmojiPicker
                                        showemoji={showemoji}
                                        setaddkey={(e,text)=>setaddkey(e,text)}
                                        setshowemoji={data=>setShowemoji(data)}
                                        />
                                    </div>
                                    <div className="flex flex-center">
                                        <div onClick={(e)=>{setState({...state,editnote:false})
                                        setKey(file.note)
                                    }} className="btn-light btn mr-8">Hủy</div>
                                        <div onClick={(e)=>seteditnote(e)} className="btn-primary btn">Lưu</div>
                                    </div>
                                </div>}
                            </div>
 
                        </div>
                        <Listcomment
                            item={item}
                            socket={socket}
                            user={user}
                            url={file.list_file.length==1?actionpostURL:actionfilepostURL}
                            onlineUsers={onlineUsers}
                            setitem={data=>setFile(data)}
                            urlcomment={file.list_file.length==1?listcommentURL:listcommenfileposttURL}
                        />
                        
                    </div>  
                </div>:''}
            </div>
        </div>
                                                                                                                                                            
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,actionpost:state.postaction
});
  
export default connect(mapStateToProps,{showreport,showactionport})( File);
