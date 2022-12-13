import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify,showreport } from "../actions/auth";
import { actioncommentURL, actionfilepostURL, actionpostURL, listcommenfileposttURL, listcommentURL, originurl } from "../urls";
import { number,timeago,listemoji } from "../constants";
import "../css/comment.css"
import {Link} from "react-router-dom"
import Tooltip from "../hocs/Tooltip";
import {connect} from "react-redux"
import Actioncomment from '../hocs/Actioncomment';
import Addcomment from '../containers/Addcomment';

const Comment=({user,report,item,setitem,setcommentreply,url,actioncomment,onlineUsers,
    showreport,comment,settag,setlistcomment,listcomment,socket,setactioncomment})=>{  
    const [listemotions,setListemotions]=useState(null)
    const [state,setState]=useState({emotion_comment:false,edit:false})
    const [video,setVideo]=useState({play:false,show_video:false,muted:true,fullscreen:false})
    const [volume,setVolume]=useState(0)
    const videoref=useRef(null)
    const seekbarref=useRef(null)
    const [time,setTime]=useState({seconds:0,minutes:0})
    const [drag,setDrag]=useState({time:false,volume:false})
    const replycomment=(e)=>{
        const rects = e.currentTarget.closest('.parent');
        console.log(rects)
        setcommentreply()
        settag(e,comment.user)
        setactioncomment('reply')
        console.log(rects.top)
        const viewheight=Math.max(document.documentElement.clientHeight,window.innerHeight||0)
        window.scroll({
            top:rects.offsetTop+rects.offsetHeight-viewheight/2,
            behavior:'smooth'
        })
        
    }
    console.log(actioncomment)
    useEffect(()=>{
        if(videoref.current){
            if(video.play){
                videoref.current.play()
            }
            else{
                videoref.current.pause()
            }
        }
    },[video.play])

    useEffect(()=>{
        if(videoref.current){
            const timer=setTimeout(()=>{
            videoref.current.volume=volume
            setTime(()=>{return{seconds:videoref.current.currentTime % 60,minutes:Math.floor((videoref.current.currentTime) / 60) % 60}})
            },200)
            return ()=>clearTimeout(timer)
        }
    },[volume,videoref,time])

    useEffect(()=>{
        if(report && report.type=='comment' && report.id==comment.id){
            const data=listcomment.map(item=>{
                if(item.id==comment.id){
                    return({...item,reported:true})
                }
                return({...item})
            })
            setlistcomment(data)
        }
    },[report])

    const setshowemotions=useCallback((e,emoji)=>{
        (async()=>{
            try{ 
                const res = await axios.get(`${actioncommentURL}/${comment.id}`,headers)
                setListemotions(res.data)
            }
            catch{
            }
        })()
        
    },[comment?comment.id:comment])

    const setemojicomment=(e,emoji)=>{
        (async()=>{
            try{
                e.stopPropagation()
                let form=new FormData()
                form.append('emoji',emoji)
                if(url==listcommentURL){
                    form.append('post_id',item.id)
                }
                if(url==listcommenfileposttURL){
                    form.append('filepost_id',item.id)
                }
                
                form.append('action','emotion')
                const res =await axios.post(`${actioncommentURL}/${comment.id}`,form,headers)
                if(!comment.emotioned && !state.emotion_comment && user.id!=comment.user.id){
                    socket.current.emit('sendNotifi',res.data.listnotifications)
                }
                setState({...state,emotion_comment:true})
                const datacomment=listcomment.map(item=>{
                    if(item.id==comment.id){
                        return({...item,count_express_emotions:item.express_emotions?item.count_express_emotions:item.count_express_emotions+1,list_emoji:res.data.list_emoji,emotioned:true,express_emotions:emoji})
                    }
                    return({...item})
                })
                const datacomments={listcomment:datacomment,id:item.id}
                socket.current.emit('addComment',datacomments)
            }
            catch{
            }
        })()
    }

    console.log(actioncomment)
    const setdefaultemojicomment=(e,value)=>{
            e.stopPropagation()
            console.log(value)
            let form=new FormData()
            form.append('action','emotion')
            if(value){
                form.append('emoji','like')
            }
            if(url==listcommentURL){
                form.append('post_id',item.id)
            }
            if(url==listcommenfileposttURL){
                form.append('filepost_id',item.id)
            }
            axios.post(`${actioncommentURL}/${comment.id}`,form,headers)
            .then(res=>{
            console.log(res.data)
            const datacomment=listcomment.map(item=>{
                if(item.id==comment.id){
                    return({...item,list_emoji:res.data.list_emoji,emotioned:true,count_express_emotions:value?comment.count_express_emotions+1:comment.count_express_emotions-1,express_emotions:value})
                }
                return({...item})
            })
            const datacomments={listcomment:datacomment,id:item.id}
            socket.current.emit('addComment',datacomments)
            if(!comment.emotioned && user.id!=comment.user.id){
                socket.current.emit('sendNotifi',res.data.listnotifications)
            }
        })
            
    }

    const settimevideo=(e)=>{
       e.stopPropagation()
        const rects = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rects.left;
        const times=(x/rects.width)*comment.fileupload.duration
        console.log(x)
        videoref.current.currentTime=times
       console.log(times)
        console.log( videoref.current.currentTime)
    }
    
    useEffect(()=>{
        if(video.muted){
            setVolume(0)
        }
    },[video.muted])
    const setVolumevideo=(e)=>{
        e.stopPropagation() 
        const rects = seekbarref.current.getBoundingClientRect();
        console.log(rects)
        const y = e.clientY - rects.top;
        console.log(y)
        const value=(1-y/rects.height)>=0 && (1-y/rects.height)<=1?(1-y/rects.height):(1-y/rects.height)>=1?1:0
        if((1-y/rects.height)>0){
            setVideo({...video,muted:false})
            
        }
        else{
            setVideo({...video,muted:true})
        }
        setVolume(value)
    }
    const parent=useRef()
    function openFullscreen(e) {
        e.stopPropagation()
        const elem=parent.current
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
        }
      }
      
    console.log(comment)
    return(
        
        <div  key={comment.id} className="tiktok-qgh4f0-DivCommentContentContainer ejs0ekz0 flex" id="Comment_Box" value ="1"> 
            <a href="#">
                <div className="profile-images comment-PI">
                    <img src={comment.user.avatar}/>
                    <div className={`${onlineUsers.some(user=>user.userId==comment.user.id)?'online-icon':'offline_icon'} o_F-CPI`}></div>
                </div>
            </a>
            {state.edit?
            <li className="children">
            <div className="flex" style={{width:'100%'}}>
                <a href="#"><div className="profile-images comment-PI">
                    <img src={user.avatar}/>
                        <div className={`online-icon o_F-CPI`}></div>
                    </div>
                </a>
                <Addcomment
                    comment={comment}
                    item={item}
                    parent={null}
                    setactioncomment={data=>setactioncomment(data)}
                    actioncomment={actioncomment}
                    setitem={(value)=>setitem(value)}
                    setstate={(data)=>setState({...state,...data})}
                    listcomment={listcomment}
                    setlistcomment={(data)=>setlistcomment(data)}
                />
                <div className="mt-8  cancel-edit-comment" onClick={()=>setState({...state,edit:false})}>Nhán esc để hủy</div>   
            </div>
            </li>
            :
            <div className="comment-detail">
                <div className="flex flex-center">
                    <div className="comment-show">
                        <div>
                            <h1>
                                <a href="#" id="Profile_Name">{comment.user.name}</a>
                            </h1>
                            <p id="Comment_Output">
                                {JSON.parse(comment.body).map(cap=>{
                                    if(cap.type=='tag'){
                                        return(
                                            <Link className="tiktok-1ukssyi-StyledUserLinkContent egb0wes10" to={`/${cap.text}`}>@{cap.text}</Link>
                                            )
                                        }
                                        else{
                                            return(
                                                <span>{cap.text}</span>
                                            )
                                        }
                                    }
                                )}
                            </p>
                        </div>
                        
                        {comment.list_emoji && comment.list_emoji.length>0?
                        <div onMouseEnter={(e)=>setshowemotions(e)}  className={`${comment.text_preview && JSON.parse(comment.text_preview).blocks[0].text.length>30?'count-comment-ab':'comment-count-icon'}`}>
                            <Tooltip
                            content={
                                listemotions!=null?<ul > 
                                    {listemotions.filter(item=>item.count>0).map(item=>
                                    
                                    <div className="flex flex-center p-4">
                                        <img width='16' src={listemoji.find(emoji=>emoji.emoji==item.emotion).src}/>
                                        <span className="count-emoji"> {item.count}</span>
                                    </div>
                                    )}
                                    
                                </ul>:<div className="item-center flex">
                                    <div className="loader"></div>
                                </div>}
                                position='bottom'
                            
                            >
                            <ul className="list_emoji-comment">
                                {comment.list_emoji.map(emoji=>
                                <li className="angry-count-icon">
                                    <img src={listemoji.find(emojichoice=>emojichoice.emoji==emoji.emotion).src}/>
                                </li>
                                )}
                                <div className="count-emoji-emotion">
                                    <a href="#" id="like-count-value">{comment.count_express_emotions}</a>
                                </div>
                            </ul>
                            </Tooltip>
                        </div>:''}
                    </div>
                    
                    <Actioncomment
                    comment={comment}
                    user={user}
                    statedata={state}
                    setactioncomment={data=>setactioncomment(data)}
                    showreport={data=>showreport(data)}
                    settag={(e,data)=>settag(e,data)}
                    listcomment={listcomment}
                    setstate={data=>setState({...state,...data})}
                    setlistcomment={data=>setlistcomment(data)}
                    />
                </div>
                {comment.fileupload?
                <div  onMouseLeave={(e)=>setVideo({...video,show_video:true})} onMouseLeave={(e)=>setVideo({...video,show_video:false})} className="coment-file"> 
                    
                    {comment.fileupload.file_preview?
                    <div  className="k4urcfbm hpfvmrgz g5gj957u buofh1pr mg4g778l">
                    <div className="e72ty7fz qlfml3jp inkptoze qmr60zad q9uorilb tvmbv18p d2edcug0 ni8dbmo4 stjgntxs l9j0dhe7 sf5mxxl7">
                    <div className="i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">
                    <div  className="datstx6m l9j0dhe7 k4urcfbm">
                        <div ref={parent} className="k4urcfbm hwddc3l5 datstx6m">
                            <video ref={videoref} className="k4urcfbm datstx6m a8c37x1j" autoplay='' preload="auto" muted={video.muted && volume<=0?true:false} playsInline loop  src={comment.fileupload.file} style={{display: 'block'}}></video>
                            <div data-instancekey="id-vpuid-ffb1ce9ab72d74">
                                <div className="k4urcfbm kr520xx4 pmk7jnqg datstx6m" data-visualcompletion="ignore">
                                    
                                    <i onClick={(e)=>setVideo({...video,play:!video.play})} className={`s45kfl79 emlxlaya bkmhp75w spb7xbtv nhd2j8a9 rdkrh8wx jtnsf9zi cxmmr5t8 oygrvhab kw0a5h6o pmk7jnqg kfkz5moi rk01pc8j orwu60u2  ${!video.play?'':'kr9hpln1 b5wmifdl'}`}>
                                        <div aria-label="Phát video" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                            <i data-visualcompletion="css-img" className="" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/TOr1QPw1amR.png)`, backgroundPosition: '0px 0px', backgroundSize:'auto', width: '72px', height: '72px', bacckgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                        </div>
                                    </i>
                                    <div className="i09qtzwb pmk7jnqg dpja2al7 pnx7fd3z e4zzj2sf k4urcfbm tghn160j bp9cbjyn jeutjz8y j83agx80 btwxx1t3">
                                        <div className="kpb67iw4 i09qtzwb qu8okrzs pmk7jnqg dpja2al7 pnx7fd3z e4zzj2sf k4urcfbm enjifjd9 pedkr2u6"></div>
                                        <div className="bp9cbjyn j83agx80 btwxx1t3 pfnyh3mw owycx6da jb3vyjys jxrgncrl qt6c0cv9 qnrpqo6b pedkr2u6">
                                            <span className="aovydwv3 j83agx80 dbpd2lw6" style={{marginTop: '0px'}}>
                                                <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                    <span className="aovydwv3 j83agx80 dbpd2lw6" style={{paddingTop: '0px'}}>
                                                    <div onClick={(e)=>setVideo({...video,play:!video.play})} aria-label="Phát" className="oajrlxb2 rq0escxv p7hjln8o i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d nhd2j8a9 q9uorilb jnigpg78 qjjbsfad fv0vnmcu w0hvl6rk ggphbty4 byekypgc jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i2p6rm4e lzcic4wl" role="button" tabindex="0">
                                                        <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/TOr1QPw1amR.png)`, backgroundPosition: `-${video.play?21:42}px -219px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                    </div>
                                                    
                                                </span>
                                            </span>
                                        </span>
                                        <div className="pzggbiyp ekzrdaps oqcyycmt j9fc33cd hnxzwevs qq4y78aw ejgyrxq3 q6iep4d8 sq6gx45u q9uorilb ljqsnud1">
                                            <span className="odlk74j0 lrazzd5p">{('0'+time.minutes).slice(-2)}:{('0'+Math.round(time.seconds)).slice(-2)}</span>
                                            <span> / </span>
                                            <span>{('0'+Math.floor(comment.fileupload.duration / 60) % 60).slice(-2)}:{('0'+Math.floor(comment.fileupload.duration) % 60).slice(-2)}</span>
                                            
                                        </div>
                                    </div>
                                    <div className="bp9cbjyn j83agx80 btwxx1t3 pfnyh3mw owycx6da buofh1pr pedkr2u6">
                                        <div className="tojvnm2t a6sixzi8 k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y l9j0dhe7 iyyx5f41 a8s20v7p">
                                            <div onClick={(e)=>settimevideo(e)}
                                                    onMouseUp={e=>setDrag({...drag,time:false})}
                                                    onMouseDown={e=>setDrag({...drag,time:true})}
                                                    onMouseMove={e=>{
                                                        e.preventDefault()
                                                        if(!drag.time){
                                                            return
                                                        }
                                                    settimevideo(e)
                                                    }}  aria-label="Change Position" aria-orientation="horizontal" aria-valuemax="300" aria-valuemin="0" aria-valuenow="3.064224" className="k4urcfbm abiwlrkh l9j0dhe7 a8nywdso sj5x9vvc rz4wbd8a cxgpxx05 nhd2j8a9" role="slider" tabindex="0">
                                                <div 
                                                    className="abiwlrkh fanpytvw pmqtw6m8 aqt0y8ln b6jg2yqc hp05c5td bn9qtmzc s8bnoagg ha302278">
                                                    <div className="pmk7jnqg pmqtw6m8 r4vyqqch" data-visualcompletion="ignore" style={{width: `100%`}}></div>
                                                        <div className="br3lixkv s8bnoagg bn9qtmzc hp05c5td b6jg2yqc pmqtw6m8 pmk7jnqg abiwlrkh" data-visualcompletion="ignore" style={{width: `${(time.minutes*60+time.seconds)/comment.fileupload.duration*100}%`}}>
                                                            <div className="q2y6ezfg ga43b7bk qhmrp3oz n67ffngd dhcip3kl s45kfl79 emlxlaya bkmhp75w spb7xbtv mk0f9b7h mkhogb32 t6na6p9t g8vbk1u7 muag1w35 pmk7jnqg kwrap0ej c9rrlmt1 tkr6xdv7" ></div>
                                                        </div>
                                                        <div className="pmk7jnqg lhzng9rx" style={{width:'8px',height:'8px',left: `${(time.minutes*60+time.seconds)/comment.fileupload.duration*100}%`}}></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                   
                                        <div className="bp9cbjyn j83agx80 btwxx1t3 pfnyh3mw owycx6da jb3vyjys qt6c0cv9 qnrpqo6b rz4wbd8a pedkr2u6">
                                            <span className="aovydwv3 j83agx80 dbpd2lw6" style={{marginTop: '0px'}}>
                                                <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                    <span className="aovydwv3 j83agx80 dbpd2lw6" style={{paddingTop: '0px'}}>
                                                        <div onClick={(e)=>{
                                                                
                                                                if(video.fullscreen){ document.exitFullscreen()}else{openFullscreen(e)}
                                                                setVideo({...video,fullscreen:!video.fullscreen})
                                                                }} aria-label="Chuyển sang toàn màn hình" className="oajrlxb2 rq0escxv p7hjln8o i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d nhd2j8a9 q9uorilb jnigpg78 qjjbsfad fv0vnmcu w0hvl6rk ggphbty4 byekypgc jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i2p6rm4e lzcic4wl" role="button" tabindex="0">
                                                            <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/TOr1QPw1amR.png)`, backgroundPosition: '-42px -240px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                        </div>
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                        <div className="bp9cbjyn j83agx80 btwxx1t3 pfnyh3mw owycx6da jb3vyjys jxrgncrl qt6c0cv9 a8nywdso pedkr2u6">
                                            <div className="l9j0dhe7 pcp91wgn iuny7tx3 p8fzw8mz discj3wi o7xrwllt q9uorilb nhd2j8a9">
                                                <div className="k4urcfbm j9ispegn pmk7jnqg pcp91wgn iuny7tx3 p8fzw8mz ipjc6fyt rq0escxv pqc7ok08">
                                                    <div className="tojvnm2t a6sixzi8 k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y l9j0dhe7 iyyx5f41 a8s20v7p">
                                                        <div ref={seekbarref} onClick={(e)=>setVolumevideo(e)}
                                                            onMouseUp={e=>setDrag({...drag,volume:false})}
                                                            onMouseDown={e=>setDrag({...drag,volume:true})}
                                                            onMouseMove={e=>{
                                                                e.preventDefault()
                                                                if(!drag.volume){
                                                                    return
                                                                }
                                                                setVolumevideo(e)
                                                                }}    
                                                            aria-label="Thay đổi âm lượng" aria-orientation="vertical" aria-valuemax="1" aria-valuemin="0" aria-valuenow="0.30104166666666665" className="nhd2j8a9 cb02d2ww l9j0dhe7 dpja2al7 art1omkt e4zzj2sf bsnbvmp4 du4w35lb pedkr2u6 mrt03zmi" role="slider" tabindex="0">
                                                            <div className="c9rrlmt1 ax37mqq2 pmk7jnqg cb02d2ww i09qtzwb qttc61fc ihh4hy1g kdgqqoy6 jk6sbkaj eyh9y8gv">
                                                                <div className="k4urcfbm pmk7jnqg i09qtzwb qttc61fc ihh4hy1g kdgqqoy6 jk6sbkaj bogkn74s" style={{height: `${volume*100/1}%`}}>
                                                                    <div className="l9j0dhe7 mrj0gjlo i1afo9ck">
                                                                        <div className="q2y6ezfg ga43b7bk qhmrp3oz n67ffngd dhcip3kl s45kfl79 emlxlaya bkmhp75w spb7xbtv mk0f9b7h t6na6p9t g8vbk1u7 muag1w35 pmk7jnqg kwrap0ej c9rrlmt1 tkr6xdv7 a8c37x1j"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="aovydwv3 j83agx80 dbpd2lw6" style={{marginTop: '0px'}}>
                                                    <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                        <span className="aovydwv3 j83agx80 dbpd2lw6" style={{paddingTop: '0px'}}>
                                                            <div onClick={()=>{
                                                                setVolume(video.muted?0.2:0)
                                                                setVideo({...video,muted:!video.muted})

                                                        }} aria-label="Bật tiếng" className="oajrlxb2 rq0escxv p7hjln8o i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d nhd2j8a9 q9uorilb jnigpg78 qjjbsfad fv0vnmcu w0hvl6rk ggphbty4 byekypgc jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i2p6rm4e lzcic4wl" role="button" tabindex="0">
                                                                <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/TOr1QPw1amR.png)`, backgroundPosition: `${video.muted?'-42px -135px':'-46px -110px'}`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                            </div>
                                                        </span>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        
                    </div>
                    <div className="d2edcug0" style={{paddingBottom: '165.6%',width: '250px'}}></div>
                    <div className="t51s4qs2 bv6zxntz qc3rp1z7 rj06g9kl e72ty7fz qlfml3jp inkptoze qmr60zad goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 hzruof5a i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4"></div>
                    </div>
                    
                    </div>
                    :<img height="210" width="210" alt="Không có mô tả ảnh." referrerpolicy="origin-when-cross-origin" src={`${comment.fileupload.file_preview?comment.fileupload.file_preview:comment.fileupload.file}`}/>}
                </div>:''}
                <div className="comment-list-btn">
                    <ul>
                        <li style={{color:`${comment.express_emotions?listemoji.find(emoji=>emoji.emoji==comment.express_emotions).color:''}`}} onClick={e=>setdefaultemojicomment(e,comment.express_emotions!=null?null:'like')} className="comment-like-btn">
                            <span >{comment.express_emotions?listemoji.find(emoji=>emoji.emoji==comment.express_emotions).name:'Thích'}</span>
                        
                            <div className="hover-window-like">
                                <ul>
                                    {listemoji.map(emoji=>
                                    <li onClick={e=>setemojicomment(e,emoji.emoji)} className="like-gif-img">
                                        <Tooltip
                                        content={emoji.name}
                                        position='top'
                                        >
                                        <img src={emoji.src}/> 
                                        </Tooltip>
                                    </li>
                                    )}
                                    
                                </ul>
                            </div>
                        </li>
                        {user.id!=comment.user.id?
                        <li onClick={(e)=>replycomment(e)}>Reply</li>:''}
                        
                        <li className="comment-uplode-time">{timeago(comment.date)}</li>
                    </ul>
                </div>
            </div>}
        </div>
        
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,report:state.report
});
export default connect(mapStateToProps)( Comment);

  
