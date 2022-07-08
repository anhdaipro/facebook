
import React,{useState,useEffect, useRef,useCallback} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Navbar from "./Navbar"
import Sibamenu from './Sibamenu';
import { liststoryemotionURL,storyinfouserURL, originurl,liststoriesURL,storiesuserURL, liststoryfriendURL, actionstoryURL, createthreadURL, conversationsURL } from '../urls';

import { Link, Navigate, useNavigate,useParams } from 'react-router-dom';
import { headers,updatenotify,showreport, showturnoff } from '../actions/auth';
import { listbackground,listemoji,timeago } from '../constants';
import Addword from '../users/Addword';
import Editor from '@draft-js-plugins/editor';
import { EditorState,convertToRaw,Modifier,KeyBindingUtil,getDefaultKeyBinding } from 'draft-js';
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';
import Tooltip from '../hocs/Tooltip';
import io from "socket.io-client"
import EmojiPicker from '../hocs/EmojiPicker';
const actionstory=[
    {name:'Tắt tin',position:'0px -775px',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png',action:'turnoff',author:false},
    {name:'Xóa tin',position:'0px -1279px',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png',action:'error',author:true},
    {name:'Tìm hoặc báo cáo',position:'0px -25px',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/YzVATefNh7Y.png',action:'report',author:false},
    
]
const Story=(props)=>{
    const {user,story,storyfriend,isAuthenticated,loadingdata,showreport,showturnoff}=props
    const [liststories,setListstories]=useState([])
    const [state,setState]=useState({play:true,loading:true})
    const [show,setShow]=useState(false)
    const [animation,setAnimation]=useState(false)
    const [listfriend,setListfriend]=useState([])
    const [emojichoice,setEmojichoice]=useState()
    const [listemotions,setListemotions]=useState([])
    const [index,setIndex]=useState()
    const [indexstory,setIndexstory]=useState(0)
    const [showemoji,setShowemoji]=useState(false)
    const [thread,setThread]=useState()
    const [showaction,setShowaction]=useState(false)
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const ref=useRef()
    const socket =useRef(null)
    const onChange = (editorState) => {
        setEditorState(editorState);
        console.log(editorState)
    }
    const {id}=useParams()
    console.log(id)
    useEffect(() => { 
        socket.current=io.connect('https://server-socket-123.herokuapp.com')
        return () => socket.current.disconnect()
    },[])
    
    useEffect(()=>{
        (async ()=>{
            try{
                if(user){
                    const [obj1, obj2] = await axios.all([
                        axios.get(storyinfouserURL,headers),
                        id?axios.get(`${liststoryfriendURL}/${id}`,headers):undefined
                    ])
                    const userinfo=obj1.data.filter(item=>item.id==user.id)
                    const friendinfo=obj1.data.filter(item=>item.id!=user.id)
                    const listuser=[...userinfo,...friendinfo]
                    setListfriend(listuser)
                    if(id){
                        const datastory=obj2.data.reverse().map((item,i)=>{
                            return({...item,time:10,view:false})
                        })
                        setShow(true)
                        setListstories(datastory)
                        setIndex(listuser.findIndex(item=>item.id==datastory[indexstory].user.id))
                    }
                }
            }
            catch(e){
                console.log(e)
            }
        })()
    },[user])

    useEffect(()=>{
        if(state.play && show && liststories.some(item=>item.time>0)){
            const timer = setTimeout(() => {
                const data= liststories.map(item=>{
                    if(item.id==liststories[indexstory].id){
                        if(!item.view && item.time>0 &&user.id!=liststories[indexstory].user.id){
                            axios.post(`${actionstoryURL}/${item.id}`,JSON.stringify({action:'view'}),headers)
                            .then(res=>{  
                                
                            })
                            return({...item,view:true,time:item.time})
                        }
                        return({...item,time:item.time>0?item.time-0.1:0})
                    }
                    return({...item})
                })
                setListstories(data)
                if(liststories[indexstory].time==0){
                    setIndexstory(indexstory+1)
                    if(indexstory+1>liststories.length-1 && index<listfriend.length){
                        setIndex(index+1)
                    }
                }
            }, 100);
            return ()=>clearTimeout(timer)
        }
    },[liststories,show,state,user,indexstory,index])
    console.log(indexstory)
    console.log(liststories)
    console.log(index)
    console.log(listfriend)
    useEffect(()=>{
        if(liststories.every(item=>item.time<=0) && listfriend.length>1){ 
            console.log('add')
            if(index<listfriend.length-1){
                setindexstoryfriend(index+1)
            }
            else{
                setIndex(listfriend.length)
            }
        }      
    },[liststories,index,indexstory,listfriend])

    const setindexstoryfriend=(value)=>{
        console.log(value)
        setShow(false)
        axios.get(`${liststoryfriendURL}/${listfriend[value].id}`,headers)
        .then(res=>{
            const datastory=res.data.reverse().map((item,i)=>{
            return({...item,time:10,view:false})
            })
            setListstories(datastory)
            setIndexstory(0)
            setShow(true)
            setState({...state,loading:true,show_detail:false,play:true})
            setIndex(value)
        })
    }

    const setlisststory=(e,value)=>{
        if(value>liststories.length-1){
            setState({...state,show_detail:false})
        }
        const data= liststories.map((item,i)=>{
            if(item.id==liststories[indexstory].id){
            return({...item,time:value<=indexstory?10:0})
            }
            if(value==liststories.indexOf(item)){
                return({...item,time:10})
            }
            return({...item})
        })
        setListstories(data)
        setIndexstory(value<=0?0:value>liststories.length-1?0:value)
        if((value<0 && index>0) ||(value>liststories.length-1 && index<listfriend.length-1)){
            setindexstoryfriend(value<0 && index>0?index-1:index+1)
        }
        if(value>liststories.length-1 && index==listfriend.length-1){
            setIndex(listfriend.length)
        }
    }
    
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    
    const myKeyBindingFn=(e)=>{
        const { hasCommandModifier } = KeyBindingUtil;
        if (e.keyCode === 13 && !hasCommandModifier(e)) {
            sendmessage(e)
        }
        else{
            if(e.keyCode === 27){
                setempty() 
            }
        }
        return getDefaultKeyBinding(e);
    }

    const setaddkey=(e,text)=>{  
        setEditorState(insertText(text, editorState));
    }
    
    const setempty=()=>{
        setEditorState(EditorState.createEmpty())
    }
    
    const setshowemoji=(data)=>{
       setShowemoji(data)
   }

    const sendmessage=(e)=>{
        const data={member:[liststories[indexstory].user.id,user.id]}
        axios.post(createthreadURL,JSON.stringify(data),headers)
        .then(res=>{
            setThread(res.data.thread)
            let form =new FormData()
            form.append('message',rawContentState.blocks[0].text)
            form.append('action','create-message')
            form.append('story_id',liststories[indexstory].id)
            axios.post(`${conversationsURL}/${res.data.thread.id}`,form,headers)
            .then(res=>{
                const messages={message:res.data,thread_id:thread.id,send_by:user.id}
                socket.current.emit("sendData",messages)
                setempty()
            })
        })
    }

    const insertText = (text, editorValue) => {
        const currentContent = editorValue.getCurrentContent();
        const currentSelection = editorValue.getSelection();
        const newContent = Modifier.replaceText(
        currentContent,
        currentSelection,
        text
    );
        const newEditorState = EditorState.push(
        editorValue,
        newContent,
        "insert-characters"
        );
        return EditorState.forceSelection(
        newEditorState,
        newContent.getSelectionAfter()
        );
    };
    
    const setchoicestory=(e,itemchoice,i)=>{
        (async ()=>{
            try{
                if(i!=indexstory){
                setIndexstory(i)
                const data= liststories.map((item,index)=>{
                    if(index<i){
                    return({...item,time:0})
                    }
                    return({...item,time:10})
                })
                setListstories(data)
                const res =await axios.get(`${liststoryemotionURL}/${itemchoice.id}`,headers)
                setListemotions(res.data)
                }
            }
            catch(e){
                console.log(e)
            }
        })()  
    }

    const setchoicestoryfriend=(e,item,i)=>{
        (async ()=>{
            try{
                const res=await axios.get(`${liststoryfriendURL}/${item.id}`,headers)
                const datastory=res.data.reverse().map((item,i)=>{
                    return({...item,time:10,view:false})
                })
                setShow(true)
                setListstories(datastory)
                setState({...state,loading:true,show_detail:false,play:true})
                if(res.data.length>0){
                   setIndexstory(0)
                }
                setIndex(i)
            }
            catch(e){
                console.log(e)
            }
        })()
    }

    const setstoryemoji=(e,item)=>{
        if(!animation){
            let form =new FormData()
            form.append('emoji',item.emoji)
            form.append('action','emotion')
            setAnimation(true)
            setEmojichoice(item) 
            if(!liststories[indexstory].express_emotions){
                socket.current.emit("sendNotifi",[{notification_type:1,receiver_id:liststories[indexstory].user.id,story:true,...user}])
            }
            const liststory=liststories.map(story=>{
                if(story.id==liststories[indexstory].id){
                    return({...story,express_emotions:true})
                }
                return({...story})
            })
            setListstories(liststory)
           
            axios.post(`${actionstoryURL}/${liststories[indexstory].id}`,form,headers)
            .then(res=>{  
                setTimeout(()=>{
                    setAnimation(false)  
                },1000)
                            
            })
        }
    }

    const setshowdetail=(e)=>{
        (async ()=>{
            try{
                const res =await axios.get(`${liststoryemotionURL}/${liststories[indexstory].id}`,headers)
                setState({...state,play:false,show_detail:true})
                setListemotions(res.data)
            }
            catch{

            }
        })()
        
    }

    const setactionstory=(e,action)=>{
        e.stopPropagation()
        if(action=='delete'){
            axios.delete(`${actionstoryURL}/${liststories[indexstory].id}`,headers)
            .then(res=>{
                const data =liststories.filter(item=>item.id!=liststories[indexstory].id)
                setListstories(data)
            })
        }
        else if(action=='report'){
            const data={id:liststories[indexstory].id,type:'story',show:true}
            setShowaction(false)
            showreport(data)
        }
        else if(action=='turnoff'){
            const data={show:true,type:'story',id:liststories[indexstory].user.id,name:liststories[indexstory].user.name}
            setShowaction(false)
            showturnoff(data)
        }
    }

    return(
        <div id="main">
            <Navbar/>
            {user?
            <div className="i09qtzwb j83agx80 n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">
                <div className="k4urcfbm jgljxmt5 j83agx80">
                    <div className="kr520xx4 j9ispegn pmk7jnqg hzruof5a byvelhso n7fi1qx3 bfjqzvhc"></div>
                    <div className="o36gj0jk datstx6m hybvsw6c">
                        <div className="hybvsw6c i09qtzwb e9vueds3 idiwt2bm eg9m0zos poy2od1o be9z9djy iyyx5f41" role="navigation">
                            <div data-pagelet="StoriesNavPane">
                                <div className="k4urcfbm datstx6m">
                                    <div className="eg9m0zos d76ob5m9">
                                        <div className="dhix69tm n851cfcs wkznzc2l n1l5q3vz i1fnvgqd j83agx80 oo9gr5id a6y00v3l">
                                            <div className="n3ffmt46 ou4ep6bq">Tin</div>
                                        </div>
                                        <div className="tw6a2znq d1544ag0 ofv0k9yr j83agx80 bp9cbjyn">
                                            <div className="j83agx80 bp9cbjyn">
                                                <a className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l q9uorilb lzcic4wl" href="/profile.php?id=100081673677422&amp;sk=archive" role="link" tabindex="0" target="_blank">
                                                    <div className="qnrpqo6b qt6c0cv9 jxrgncrl jb3vyjys taijpn5t btwxx1t3 j83agx80 bp9cbjyn">
                                                        <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw q66pz984" dir="auto">Kho lưu trữ</span>
                                                    </div>
                                                </a>
                                                <span className="m9osqain">
                                                    <span className="rfua0xdk pmk7jnqg stjgntxs ni8dbmo4 ay7djpcl q45zohi1">&nbsp;</span>
                                                    <span aria-hidden="true"> · </span>
                                                </span>
                                                <div className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw q66pz984" dir="auto">Cài đặt</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hy1o8qpp">
                                            <div className="l9j0dhe7 du4w35lb rq0escxv j83agx80 cbu4d94t pfnyh3mw d2edcug0 ofv0k9yr cwj9ozl2">
                                                <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo muag1w35 enqfppq2">
                                                    <div className="qzhwtbm6 knvmm38d">
                                                        <h2 className="ml-1 gmql0nx0 l94mrbxd p1ri9a11 lzcic4wl d2edcug0 hpfvmrgz" dir="auto" tabindex="-1">
                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db a5q79mjw g1cxx5fr lrazzd5p oo9gr5id hzawbc8m" dir="auto">
                                                                <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ojkyduve" style={{display: '-webkit-box'}}>Tin của bạn</span>
                                                            </span>
                                                        </h2>
                                                    </div>
                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p">                                                         
                                                        <div className="l9j0dhe7">
                                                            {listfriend.filter(item=>item.id==user.id).map((item,i)=>
                                                            <div key={item.id} aria-labelledby="jsc_c_52" className="oajrlxb2 rq0escxv p7hjln8o f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh lzcic4wl g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz gmql0nx0 nhd2j8a9 ihxqhq3m l94mrbxd aenfhxwr kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h myohyog2 bj9fd4vl ksdfmwjs gofk2cf1 a8c37x1j k4urcfbm tm8avpzi" role="button" tabindex="0">
                                                                <div onClick={e=>setchoicestoryfriend(e,item,0)} className="j83agx80 qu0x051f esr5mh6w e9989ue4 r7d6kgcz beltcj47 p86d2i9g aot14ch1 kzx2olss nhd2j8a9 ihxqhq3m kvgmc6g5 oi9244e8 oygrvhab h676nmdw hzawbc8m cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr pdl3lqly gfay22hk">
                                                                    <div className="tvfksri0 taijpn5t j83agx80 ll8tlv6m">
                                                                        <div className="q9uorilb l9j0dhe7 pzggbiyp du4w35lb">
                                                                            <svg aria-hidden="true" className="pzggbiyp" data-visualcompletion="ignore-dynamic" role="none" style={{height: '60px', width: '60px'}}><mask id="jsc_c_53"><circle cx="30" cy="30" fill="white" r="30"></circle><circle cx="30" cy="30" fill="transparent" r="25.5" stroke="black" stroke-width="3"></circle></mask><g mask="url(#jsc_c_53)"><image x="6" y="6" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlinkHref={originurl+ item.avatar} style={{height: '48px', width: '48px'}}></image><circle className="mlqo0dh0 georvekb s6kb5r3f" cx="30" cy="30" r="30"></circle><circle className="m74jz5tg ggutxrqb" cx="30" cy="30" fill="transparent" r="28.5" stroke="var(--accent)" stroke-width="3"></circle></g></svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className="hpfvmrgz g5gj957u buofh1pr rj1gh0hx o8rfisnq">
                                                                        <div id="jsc_c_52">
                                                                            <div className="stjgntxs ni8dbmo4 hhnejfq7">
                                                                                <div className="k4urcfbm sf5mxxl7 hzawbc8m a8nywdso e5nlhep0 rz4wbd8a ecm0bbzt q9uorilb" dir="auto">
                                                                                    <div className="rq0escxv du4w35lb q45zohi1 ema1e40h ay7djpcl ni8dbmo4 stjgntxs pmk7jnqg rfua0xdk">Tin của {item.name}</div>                                                                                    
                                                                                    <div aria-hidden="true">
                                                                                        <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7" style={{display: '-webkit-box'}}>{item.name}</span>                                                                                        
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex">
                                                                                    {item.count_new_story>0?<span>{item.count_new_story} </span>:''}
                                                                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw m9osqain" dir="auto">1 giờ</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            )}
                                                            <div className={`bp9cbjyn j83agx80 ${listfriend.find(item=>item.id==user.id)?'i09qtzwb cypi58rs pmk7jnqg kr520xx4':'ml-1'}`}>
                                                                <Link aria-label="Thêm vào tin" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l q9uorilb lzcic4wl" to="/stories/create" role="link" tabindex="0">
                                                                    <div className="bp9cbjyn b3i9ofy5 gcieejh5 bn081pho humdl8nn izx4hr6d s45kfl79 emlxlaya bkmhp75w spb7xbtv j83agx80 pfnyh3mw cb02d2ww taijpn5t ljni7pan">
                                                                        <i data-visualcompletion="css-img" className="" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/jb4CwPYd6eX.png)`, backgroundPosition: '-61px -105px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                    </div>
                                                                </Link>
                                                                {listfriend.find(item=>item.id==user.id)?'':
                                                                <div className="hpfvmrgz g5gj957u buofh1pr rj1gh0hx o8rfisnq">
                                                                    <div id="jsc_c_52">
                                                                        <div className="stjgntxs ni8dbmo4 hhnejfq7">
                                                                            <div className="k4urcfbm sf5mxxl7 hzawbc8m a8nywdso e5nlhep0 rz4wbd8a ecm0bbzt q9uorilb" dir="auto">
                                                                                
                                                                                <div aria-hidden="true">           
                                                                                    <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7" style={{display: '-webkit-box'}}>Tạo tin</span>                                                                                            
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex">
                                                                                <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw m9osqain" dir="auto">Bạn có thể chia sẻ ảnh hoặc viết gì đó</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {listfriend.find(item=>item.id!=user.id)?
                                       
                                        <div className="hy1o8qpp">
                                            <div className="l9j0dhe7 du4w35lb rq0escxv j83agx80 cbu4d94t pfnyh3mw d2edcug0 ofv0k9yr cwj9ozl2">
                                                <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo muag1w35 enqfppq2">
                                                    <div className="qzhwtbm6 knvmm38d">
                                                        <h2 className="ml-1 gmql0nx0 l94mrbxd p1ri9a11 lzcic4wl d2edcug0 hpfvmrgz" dir="auto" tabindex="-1">
                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db a5q79mjw g1cxx5fr lrazzd5p oo9gr5id hzawbc8m" dir="auto">
                                                                <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ojkyduve" style={{display: '-webkit-box'}}>Tất cả tin</span>
                                                            </span>
                                                        </h2>
                                                    </div>
                                
                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p">
                                                        
                                                        <div className="l9j0dhe7">
                                                            {listfriend.map((item,i)=>{
                                                                if(item.id!=user.id){
                                                                    return(
                                                                    <div key={item.id} aria-labelledby="jsc_c_52" className="oajrlxb2 rq0escxv p7hjln8o f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh lzcic4wl g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz gmql0nx0 nhd2j8a9 ihxqhq3m l94mrbxd aenfhxwr kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h myohyog2 bj9fd4vl ksdfmwjs gofk2cf1 a8c37x1j k4urcfbm tm8avpzi" role="button" tabindex="0">
                                                                        <div onClick={e=>setchoicestoryfriend(e,item,i)} className="j83agx80 qu0x051f esr5mh6w e9989ue4 r7d6kgcz beltcj47 p86d2i9g aot14ch1 kzx2olss nhd2j8a9 ihxqhq3m kvgmc6g5 oi9244e8 oygrvhab h676nmdw hzawbc8m cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr pdl3lqly gfay22hk">
                                                                            <div className="tvfksri0 taijpn5t j83agx80 ll8tlv6m">
                                                                                <div className="q9uorilb l9j0dhe7 pzggbiyp du4w35lb">
                                                                                    <svg aria-hidden="true" className="pzggbiyp" data-visualcompletion="ignore-dynamic" role="none" style={{height: '60px', width: '60px'}}><mask id="jsc_c_53"><circle cx="30" cy="30" fill="white" r="30"></circle><circle cx="30" cy="30" fill="transparent" r="25.5" stroke="black" stroke-width="3"></circle></mask><g mask="url(#jsc_c_53)"><image x="6" y="6" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlinkHref={originurl+ item.avatar} style={{height: '48px', width: '48px'}}></image><circle className="mlqo0dh0 georvekb s6kb5r3f" cx="30" cy="30" r="30"></circle><circle className="m74jz5tg ggutxrqb" cx="30" cy="30" fill="transparent" r="28.5" stroke="var(--accent)" stroke-width="3"></circle></g></svg>
                                                                                </div>
                                                                            </div>
                                                                            <div className="hpfvmrgz g5gj957u buofh1pr rj1gh0hx o8rfisnq">
                                                                                <div id="jsc_c_52">
                                                                                    <div className="stjgntxs ni8dbmo4 hhnejfq7">
                                                                                        <div className="k4urcfbm sf5mxxl7 hzawbc8m a8nywdso e5nlhep0 rz4wbd8a ecm0bbzt q9uorilb" dir="auto">
                                                                                            <div className="rq0escxv du4w35lb q45zohi1 ema1e40h ay7djpcl ni8dbmo4 stjgntxs pmk7jnqg rfua0xdk">Tin của {item.name}</div>
                                                                                            <div aria-hidden="true">
                                                                                                
                                                                                                <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7" style={{display: '-webkit-box'}}>{item.name}</span>
                                                                                                
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex">
                                                                                            {item.count_new_story>0?<span>{item.count_new_story} </span>:''}
                                                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw m9osqain" dir="auto">1 giờ</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                return(<></>)
                                                            })}                                                                
                                                        </div>                                                       
                                                    </div>
                                                </div>
                                            </div>
                                        </div>: <div class="sxpk6l6v"><div class="dhix69tm oygrvhab wkznzc2l tr9rh885 jq4qci2q m9osqain">When friends, groups, and pages post stories their stories will show up here.</div></div>}
                                        
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="l9j0dhe7 buofh1pr">
                    <div aria-hidden="false" className="pedkr2u6 pmk7jnqg kp4lslxn ms05siws pnx7fd3z nf1dmkjp s0qqerhg">
                        <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                            <div aria-label="Đóng" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 qypqp5cg q676j6op d6rk862h ljqsnud1" role="button" tabindex="0">
                                <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/WzzTPPN68Uj.png)`, backgroundPosition: '0px -92px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3 s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                            </div>
                        </span>
                    </div>
                    <div data-pagelet="StoriesContentPane">
                        <div className="kr520xx4 j9ispegn pmk7jnqg stjgntxs ni8dbmo4 taijpn5t n7fi1qx3 j83agx80 i09qtzwb tqsryivl bp9cbjyn">
                            {!show || liststories.length==0?
                            <div className="k4urcfbm ni8dbmo4 q10oee1b taijpn5t datstx6m cbu4d94t j83agx80 qsy8amke bp9cbjyn">
                                <div className="gm7ombtx jbae33se gpl4oick bjjx79mm taijpn5t cbu4d94t j83agx80 bp9cbjyn">
                                    <div className="sej5wr8e">
                                        <img className="hu5pjgll" height="112" src="https://www.facebook.com/images/comet/empty_states_icons/media/null_states_media_gray_wash.svg" width="112" alt=""/>
                                    </div>
                                    <div className="j83agx80 cbu4d94t mysgfdmx hddg9phg">
                                        <div className="w0hvl6rk qjjbsfad">
                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 ns63r2gh iv3no6db o3w64lxj b2s5l15y hnhda86s m9osqain oqcyycmt" dir="auto">Chọn tin để mở.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                            :
                            <div className="kr520xx4 j9ispegn pmk7jnqg stjgntxs ni8dbmo4 taijpn5t n7fi1qx3 j83agx80 i09qtzwb tqsryivl bp9cbjyn">
                                
                                <div className="qiw3t3sk j83agx80 datstx6m k4urcfbm i1mrkscp dpja2al7 flx89l3n msbwk0y7 ejg0drik">
                                    <div className="k4urcfbm kr520xx4 j9ispegn pmk7jnqg taijpn5t datstx6m cbu4d94t j83agx80 bp9cbjyn"> 
                                        <div className="k4urcfbm taijpn5t datstx6m btwxx1t3 j83agx80 bp9cbjyn">
                                            <div className="nhd2j8a9 l9j0dhe7" style={{height: '100%', width: '50%'}}>
                                                {indexstory==0 && index==0?'':
                                                <div className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl datstx6m k4urcfbm" role="button" tabindex="-1">
                                                    
                                                    <div className="s45kfl79 emlxlaya bkmhp75w spb7xbtv ny22rvp7 l8rlqa9s pmk7jnqg rk01pc8j ke6wolob ms05siws pnx7fd3z msbwk0y7 ejg0drik" style={{marginLeft: '0px', marginRight: '40px', right: '0px'}}>
                                                        <div onClick={e=>setlisststory(e,indexstory-1)} aria-label="Nút thẻ trước đó" class={`oajrlxb2 ${indexstory==0 && index==0?'disabled':''} qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn cwj9ozl2 t51s4qs2 bv6zxntz qc3rp1z7 rj06g9kl s45kfl79 emlxlaya bkmhp75w spb7xbtv goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 rq0escxv m9osqain j83agx80 m7zwrmfr taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tmrshh9y`} role="button" tabindex="0">
                                                            <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/B-rOLWGj0Di.png)`, backgroundPosition: '0px -73px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                        </div>
                                                        <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                    </div>
                                                </div>}
                                            </div>
                                            <div className="l9j0dhe7 taijpn5t datstx6m cbu4d94t j83agx80 bp9cbjyn">
                                                <div className="dzlist6r msbwk0y7 pnx7fd3z ms05siws l9j0dhe7 stjgntxs ni8dbmo4 puxov6c6 r893ighp n1l5q3vz n851cfcs btwxx1t3 j83agx80 l82x9zwi uo3d90p7 pw54ja7n ue3kfks5 g5ia77u1" style={{gap: '105px', height: '521px', width: '293px', transformOrigin: 'center center'}}>
                                                    <div className="k4urcfbm l9j0dhe7 ggxiycxj hihg3u9x datstx6m">
                                                        <div className="k4urcfbm l9j0dhe7 ggxiycxj hihg3u9x datstx6m">
                                                            {liststories.some(item=>item.time>0 && item.time<10) || index<listfriend.length-1?<>
                                                            <div className="r4lidvzm i09qtzwb n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">    
                                                                <img alt="" className="datstx6m k4urcfbm" referrerpolicy="origin-when-cross-origin" src={liststories[indexstory].caption?listbackground.find(item=>item.index==JSON.parse(liststories[indexstory].caption).id).src:originurl+liststories[indexstory].file}/>      
                                                            </div>
                                                            {liststories[indexstory].caption?
                                                            <div className="j83agx80 iix1gpk6 os6ic53g taijpn5t b2wla6dc kj0jemqk ofv0k9yr d8o5xnl0 l9j0dhe7 abiwlrkh czywrmwm" style={{color: 'rgb(255, 255, 255)', fontFamily: 'FacebookNarrowViet-Regular, Helvetica, Arial, sans-serif', visibility: 'visible'}}>
                                                                <div className=" oqq733wu d2edcug0 j83agx80">
                                                                    <div className="datstx6m taijpn5t km676qkl ad2k81qe myj7ivm5 f9o22wc5 stjgntxs jm1wdb64 ii04i59q k4urcfbm ssixshrq j83agx80 cbu4d94t ni8dbmo4 l9j0dhe7 c1et5uql">
                                                                        <div className="pedkr2u6 oqcyycmt">{JSON.parse(liststories[indexstory].caption).caption}</div>
                                                                        <div className="fdg1wqfs pfnyh3mw"></div>
                                                                    </div>
                                                                </div>
                                                            </div>:''}</>:''}
                                                            <div className="p1z4y1cs k4urcfbm kr520xx4 j9ispegn pmk7jnqg ggxiycxj hihg3u9x datstx6m n7fi1qx3 i09qtzwb agkhgkm8 pedkr2u6">
                                                                {liststories.some(item=>item.time>0) || (index<listfriend.length-1 && listfriend.length>1)?
                                                                <div className="kr520xx4 pmk7jnqg j83agx80 bp9cbjyn">
                                                                    <div className="l9j0dhe7" style={{top: '521px', width: '293px'}}>
                                                                        <div className="k4urcfbm l9j0dhe7 rwvkw9s7 i09qtzwb"></div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="bp9cbjyn cwj9ozl2 ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi j83agx80 cbu4d94t datstx6m taijpn5t oqk3gwch k4urcfbm" style={{gap: '105px', height: '577px', width: '325px', transformOrigin: 'calc(213.094px - ((100vw - 345px + 320px) / 2)) calc(28px)'}}>
                                                                    <div className="l9j0dhe7 du4w35lb rq0escxv j83agx80 cbu4d94t pfnyh3mw j30p9oib oqcyycmt dmwoc352">
                                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 bp9cbjyn aahdfvyu tvmbv18p">
                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 bp9cbjyn aahdfvyu tvmbv18p">
                                                                        <div className="q346qzrl pmk7jnqg t6snl0w5 pe61uq6d">
                                                                            <i data-visualcompletion="css-img" className="" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/jb4CwPYd6eX.png)`, backgroundPosition: '0px -288px', backgroundSize: 'auto', width: '60px', height: '60px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                        </div>
                                                                        <div className="__fb-light-mode cjfnh4rs hwddc3l5 ff7izwzc ama3r5zh mwd26vqw">
                                                                            <div className="k4urcfbm datstx6m">
                                                                                <div className="l9j0dhe7">
                                                                                    <Link aria-label="Tạo tin" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 tdjehn4e fni8adji hgaippwi fykbt5ly ns4ygwem goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 sbcfpzgs rq0escxv a8c37x1j kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x ni8dbmo4 stjgntxs jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h k4urcfbm du4w35lb lsqurvkf" to="/stories/create" role="link" tabindex="0">
                                                                                        <div className="k4urcfbm l9j0dhe7 stjgntxs ni8dbmo4 do00u71z l82x9zwi uo3d90p7 pw54ja7n ue3kfks5" style={{paddingTop: '177.778%'}}>
                                                                                            <div className="kr520xx4 j9ispegn pmk7jnqg n7fi1qx3 i09qtzwb">
                                                                                                <div className="j83agx80 cbu4d94t datstx6m l9j0dhe7">
                                                                                                    <div className="datstx6m ni8dbmo4 stjgntxs fi2e5rcv ebpj63zs flx89l3n sgqwj88q">
                                                                                                        <img alt="" className="datstx6m bixrwtb6 k4urcfbm" referrerpolicy="origin-when-cross-origin" src="https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?stp=dst-png_p160x160&amp;_nc_cat=1&amp;ccb=1-7&amp;_nc_sid=7206a8&amp;_nc_ohc=fjkGHU96g0cAX8iKRWV&amp;_nc_ht=scontent.fsgn2-1.fna&amp;oh=00_AT_Zd6xtw90VftsSZ4qPZ1F68zQFlTWpGlALpKNcNiS_og&amp;oe=62CA77F8"/>
                                                                                                    </div>
                                                                                                    <div className="mm8kr34x i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4"></div>
                                                                                                    <div className="cwj9ozl2 j83agx80 pfnyh3mw taijpn5t dhxd5tqv hv4rvrfc f10w8fjw dati1w0a l9j0dhe7">
                                                                                                        <div className="bp9cbjyn cwj9ozl2 qavdm89g gsh9l1b6 lwukve8w jpyiy761 j83agx80 qypqp5cg taijpn5t pmk7jnqg hc5seken q676j6op">
                                                                                                                <div className="bp9cbjyn is6700om qavdm89g gsh9l1b6 lwukve8w jpyiy761 j83agx80 k7cz35w2 taijpn5t bsnbvmp4">
                                                                                                                    <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" className="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 ljqsnud1 jnigpg78 odw8uiq3"><g fill-rule="evenodd" transform="translate(-446 -350)"><g fill-rule="nonzero"><path d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z" transform="translate(354.5 159.5)"></path><path d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z" transform="translate(354.5 159.5)"></path></g></g></svg>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="hzruof5a">
                                                                                                                <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p oo9gr5id oqcyycmt" dir="auto">
                                                                                                                    <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7" style={{display: '-webkit-box'}}>Tạo tin</span>
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Link>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rkwpkyys pmk7jnqg jejevqzb t41jdizh">
                                                                                <i data-visualcompletion="css-img" className="" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/jb4CwPYd6eX.png)`, backgroundPosition: '0px -227px', backgroundSize: 'auto', width: '60px', height: '60px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                            </div>
                                                                            <div className="q346qzrl pmk7jnqg ewnmkx9y cl885m5q">
                                                                                <i data-visualcompletion="css-img" className="" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/jb4CwPYd6eX.png)`, backgroundPosition: '0px -166px', backgroundSize: 'auto', width: '60px', height: '60px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                            </div>
                                                                            <div className="pmk7jnqg e9ggjtsh htftu7yx lo7qbyfk">
                                                                                <i data-visualcompletion="css-img" className="" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/jb4CwPYd6eX.png)`, backgroundPosition: '0px -105px', backgroundSize: 'auto', width: '60px', height: '60px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                            </div>
                                                                        </div>
                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p">
                                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 ns63r2gh iv3no6db o3w64lxj b2s5l15y hnhda86s qrtewk5h oqcyycmt" dir="auto">Tiếp tục tạo tin</span>
                                                                        </div>
                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 bp9cbjyn aahdfvyu tvmbv18p cxgpxx05">
                                                                            <div className="eq70wtua">
                                                                                <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr b1v8xokw qrtewk5h" dir="auto">Bạn bè đang mong bạn lắm đấy. Hãy chia sẻ khoảnh khắc gần đây để họ biết tình hình hiện tại của bạn nhé.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p discj3wi">
                                                                            <div className="k4urcfbm datstx6m">
                                                                                <Link aria-label="Tạo tin" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" to="/stories/create" role="link" tabindex="0">
                                                                                    <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq s1i5eluu tv7at329"><div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p bwm1u5wc" dir="auto">
                                                                                                <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Tạo tin</span>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore">
                                                                                    </div>
                                                                                </div>
                                                                            </Link>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                            </div>
                                                            {liststories.some(item=>item.time>0 ) && liststories[indexstory].user?
                                                            <>
                                                            <div>
                                                                <div className="k996pnph kr520xx4 j9ispegn pmk7jnqg hzruof5a d23ldmr1 tut9u0nx"></div>
                                                                <div className="bp9cbjyn j83agx80 pmk7jnqg rnx8an3s o8bxvmiv nkeuobq6">
                                                                    <div className="nqmvxvec j83agx80 cbu4d94t">
                                                                        <a className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 gpro0wi8" href="https://www.facebook.com/profile.php?id=100081673677422&amp;__tn__=-R" role="link" tabindex="0">
                                                                            <img height="40" width="40" alt="Nguyễn Trãi" className="q9iuea42 qs4al1v0 eprw1yos a4d05b8z sibfvsnu px9q9ucb j2ut9x2k p4hiznlx a8c37x1j qypqp5cg bixrwtb6 q676j6op" referrerpolicy="origin-when-cross-origin" src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?stp=cp0_dst-png_p40x40&amp;_nc_cat=106&amp;ccb=1-7&amp;_nc_sid=7206a8&amp;_nc_ohc=fjkGHU96g0cAX8iKRWV&amp;_nc_ht=scontent.fsgn2-3.fna&amp;oh=00_AT8UwLrx5blE_poc_EQZEZKtqZ3dhs4GxkXJDT3lPCwQMQ&amp;oe=62CA77F8"/>
                                                                        </a>
                                                                    </div>
                                                                    <div className="j83agx80 cbu4d94t gzy3xfl0">
                                                                        <div className="kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tw6a2znq lc1rz9xl a6y00v3l j83agx80 btwxx1t3">
                                                                            <div className="rqz36ts4">
                                                                                <div className="qrtewk5h j83agx80 btwxx1t3 kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x e72ntyah l3itjdph">
                                                                                    <a className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l q9uorilb lzcic4wl d2edcug0" href="https://www.facebook.com/profile.php?id=100081673677422&amp;__tn__=-R" role="link" tabindex="0">
                                                                                        <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p qrtewk5h" dir="auto">
                                                                                            <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">{liststories[indexstory].user.name}</span>
                                                                                        </span>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="qrtewk5h kkf49tns e72ntyah">
                                                                                <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn iv3no6db e9vueds3 j5wam9gi b1v8xokw qrtewk5h" dir="auto">
                                                                                    <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5 ojkyduve">{timeago(liststories[indexstory].created)}</span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="miomc0xe pmk7jnqg cgat1ltu n7fi1qx3 j83agx80">
                                                                <div className="tojvnm2t a6sixzi8 k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y l9j0dhe7 iyyx5f41 a8s20v7p">
                                                                    <div aria-label="Phát" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                                        <div onClick={e=>setState({...state,play:!state.play})} className="h676nmdw oygrvhab oi9244e8 kvgmc6g5 nhd2j8a9">
                                                                            <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(${state.play?'https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/hfKr4cklfQ4.png':'https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/hfKr4cklfQ4.png'})`, backgroundPosition: `${state.play?'0px -100px':'0px -150px'}`, backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="tojvnm2t a6sixzi8 k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y l9j0dhe7 iyyx5f41 a8s20v7p">
                                                                    <div aria-label="Hiện" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                                        <div  className="h676nmdw oygrvhab oi9244e8 kvgmc6g5 nhd2j8a9">
                                                                        
                                                                            <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url('https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/t9JVIiUTysb.png')`, backgroundPosition: `0px -25px`, backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                               
                                                                <div className="tojvnm2t a6sixzi8 k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y l9j0dhe7 iyyx5f41 a8s20v7p">
                                                                    <div onClick={e=>{
                                                                        setState({...state,play:!state.play})
                                                                        setShowaction(!showaction)}} aria-label="Nút menu" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                                        <div className="h676nmdw oygrvhab oi9244e8 kvgmc6g5 nhd2j8a9">
                                                                            <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/wQl2Y1MWWpw.png)`, backgroundPosition: '-158px -13px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                        </div>
                                                                        {showaction?
                                                                            <div className="drop-down" style={{width:'200px',marginTop:'8px'}}>
                                                                                <div className="p-8">
                                                                                    <div className="">
                                                                                        {user.id==liststories[indexstory].user.id?<>
                                                                                        {actionstory.filter(item=>item.author).map((item,i)=>
                                                                                        <div key={i} onClick={(e)=>setactionstory(e,item.action)} class="item-story oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz p7hjln8o esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 rq0escxv nhd2j8a9 j83agx80 btwxx1t3 pfnyh3mw opuu4ng7 kj2yoqh6 kvgmc6g5 oygrvhab l9j0dhe7 i1ao9s8h du4w35lb bp9cbjyn cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr" role="menuitem" tabindex="0">
                                                                                            <div class="bp9cbjyn tiyi1ipj j83agx80 taijpn5t tvfksri0">
                                                                                                <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(${item.src})`, backgroundPosition: `${item.position}`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                            </div>
                                                                                            <div class="bp9cbjyn j83agx80 btwxx1t3 buofh1pr i1fnvgqd hpfvmrgz">
                                                                                                <div class="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                                                                                    <div class="qzhwtbm6 knvmm38d">
                                                                                                        <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v ekzkrbhg oo9gr5id hzawbc8m" dir="auto">{item.name}</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore" style={{borderRadius: '4px'}}></div>
                                                                                        </div>
                                                                                        )}</>:
                                                                                        <>
                                                                                        {actionstory.filter(item=>!item.author).map((item,i)=>
                                                                                        <div key={i} onClick={(e)=>setactionstory(e,item.action)} class="item-story oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz p7hjln8o esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 rq0escxv nhd2j8a9 j83agx80 btwxx1t3 pfnyh3mw opuu4ng7 kj2yoqh6 kvgmc6g5 oygrvhab l9j0dhe7 i1ao9s8h du4w35lb bp9cbjyn cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr" role="menuitem" tabindex="0">
                                                                                            <div class="bp9cbjyn tiyi1ipj j83agx80 taijpn5t tvfksri0">
                                                                                                <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(${item.src})`, backgroundPosition: `${item.position}`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                            </div>
                                                                                            <div class="bp9cbjyn j83agx80 btwxx1t3 buofh1pr i1fnvgqd hpfvmrgz">
                                                                                                <div class="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                                                                                    <div class="qzhwtbm6 knvmm38d">
                                                                                                        <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v ekzkrbhg oo9gr5id hzawbc8m" dir="auto">{item.name}</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore" style={{borderRadius: '4px'}}></div>
                                                                                        </div>
                                                                                    )}</>
                                                                                    }
                                                                                </div>
                                                                                <div class="d06cv69u cdcbzqsl goun2846 ccm00jje s44p3ltw mk2mc5f4 tl61u9r6 bcctvi4p gcjuebxg kvs4odcb hzruof5a pmk7jnqg et4y5ytx np69z8it bssd97o4 n4j0glhw j9ispegn" style={{transform: `translate(170px, 7px) rotate(-45deg)`}}></div>
                                                                            </div>
                                                                        </div>:''}
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                            <div className="kv0qyzoi kr520xx4 pmk7jnqg ozuftl9m n851cfcs tvfksri0 n1l5q3vz mw227v9j j83agx80">
                                                                {liststories.map(item=>
                                                                <div className="l9j0dhe7 datstx6m hhnejfq7 q9uorilb p4hiznlx j2ut9x2k px9q9ucb sibfvsnu ouam3tkm cgat1ltu">
                                                                    <div className="m96f97by sibfvsnu px9q9ucb j2ut9x2k p4hiznlx datstx6m mb8dcdod sk63wpmh sgqwj88q ttbfdpzt l3d94uoy" data-visualcompletion="ignore" style={{transitionDuration: '0.1s', width: `${(10-item.time)*1000/100}%`}}></div>
                                                                </div>
                                                                )}
                                                                
                                                            </div>
                                                            {user && indexstory<liststories.length && user.id==liststories[indexstory].user.id && indexstory<=liststories.length-1?
                                                            <div className="auggtxa1 i09qtzwb n7fi1qx3 d23ldmr1 pmk7jnqg j9ispegn">
                                                                <div onClick={(e)=>setshowdetail(e)} className="nhd2j8a9 gubt14e3 n7fi1qx3 gfu8pxt1 pmk7jnqg j9ispegn tkr6xdv7">
                                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 ll8tlv6m hv4rvrfc dati1w0a">
                                                                        <div className="kkf49tns">
                                                                            <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" aria-label="Hiển thị thêm" role="img" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/hfKr4cklfQ4.png)`, backgroundPosition: '0px 0px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                        </div>
                                                                    </div>
                                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 ll8tlv6m hv4rvrfc dati1w0a">
                                                                        <div className="aovydwv3 j83agx80 qrtewk5h kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x">
                                                                            <div className="bp9cbjyn j83agx80 rj1gh0hx buofh1pr g5gj957u jifvfom9">
                                                                                <div className="bp9cbjyn j83agx80">
                                                                                    <span className="a5q79mjw n3ffmt46 g1cxx5fr gtad4xkn">{liststories[indexstory].count_express_emotions>0?`${liststories[indexstory].count_express_emotions} người xem`:'Chưa có người xem'}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="cubx1xtm ay7djpcl h676nmdw aahdfvyu gjzvkazv">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>:''}
                                                            {emojichoice?
                                                            <div className="i09qtzwb j83agx80 cbu4d94t owycx6da bkfpd7mw hzruof5a pmk7jnqg j9ispegn qdd6qp5p k4urcfbm agkhgkm8 qgmjvhk0 flx89l3n">
                                                                <div className="dbpd2lw6 ozuftl9m n851cfcs tvfksri0 kvgmc6g5 j83agx80 rq0escxv">
                                                                    <div className="j83agx80">
                                                                        <div className="bp9cbjyn j83agx80 hcukyx3x">
                                                                            <img className="" height="18" src={emojichoice.src} width="18"/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="g0qnabr5 ltmttdrg hzawbc8m rnx8an3s l9j0dhe7 d1544ag0 stjgntxs ni8dbmo4 h2rfc5pd jq4qci2q qrtewk5h">Đã gửi cho {liststories[indexstory].user.name}</div>
                                                                </div>
                                                            </div>:''}
                                                            </>:''}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/*show detail*/}
                                                {state.show_detail?<>
                                                <div aria-label="Đóng" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi n7fi1qx3 lc891dc2 pmk7jnqg j9ispegn fcg2cn6m c5ndavph art1omkt ot9fgl3s tkr6xdv7 g5ia77u1" role="button" tabindex="0">
                                                    <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore">
                                                    </div>
                                                </div>
                                                <div className="cwj9ozl2 ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi labbqbtg n7fi1qx3 ni8dbmo4 stjgntxs ph5uu5jm e5nlhep0 b3onmgus eluhq753 pmk7jnqg j9ispegn o60ks4k0 kavbgo14">
                                                    <div className="k4urcfbm datstx6m">
                                                        <div className="cwj9ozl2 j83agx80 datstx6m k4urcfbm">
                                                            <div className="rpm2j7zs k7i0oixp gvuykj2m j83agx80 cbu4d94t ni8dbmo4 du4w35lb q5bimw55 ofs802cu pohlnb88 dkue75c7 mb9wzai9 l56l04vs r57mb794 l9j0dhe7 kh7kg01d eg9m0zos c3g1iek1 datstx6m k4urcfbm">
                                                                <div className="j83agx80 cbu4d94t buofh1pr l9j0dhe7">
                                                                    <div className="ay7djpcl oygrvhab"></div>
                                                                    <span>
                                                                        <div className="e9vueds3 guvg9d06">
                                                                        <div className="jb3vyjys ozuftl9m oygrvhab tvfksri0 kvgmc6g5 g1cxx5fr n3ffmt46 a5q79mjw j83agx80 m9hp224e aovydwv3">Chi tiết về tin</div>
                                                                            <div className="ejg0drik heur4gxb flx89l3n dpja2al7 l9j0dhe7 tw6a2znq jbae33se d1544ag0 bjjx79mm py5xhhw8 j83agx80 bp9cbjyn" style={{transform: `translateX(${indexstory<liststories.length?-indexstory*78:0}px)`}}>
                                                                                
                                                                                {liststories.map((item,i)=>
                                                                                <div key={item.id} onClick={(e)=>setchoicestory(e,item,i)} className="tvfksri0">
                                                                                    <div aria-label="thẻ tin của chính mình" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                                                        <div className="jk6sbkaj kdgqqoy6 ihh4hy1g qttc61fc nhd2j8a9 j83agx80 g3eujd1d ni8dbmo4 stjgntxs fh5enmmv kmdw4o4n pnx7fd3z heur4gxb abiwlrkh jsl0ic47 pedkr2u6" style={{height: `${liststories[indexstory].id==item.id?152.001:133}px`, width: `${liststories[indexstory].id==item.id?114:99}px`}}>
                                                                                            <img className="k4urcfbm bixrwtb6 datstx6m q9uorilb" src={item.file!=null?originurl+item.file:listbackground.find(color=>color.index==JSON.parse(item.caption).id).src} alt="Không có mô tả ảnh."/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                )}
                                                                                
                                                                                <div className="tvfksri0">
                                                                                    <Link aria-label="Tạo tin" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l q9uorilb lzcic4wl" to="/stories/create" role="link" tabindex="0">
                                                                                        <div className="taijpn5t cbu4d94t j83agx80 nhd2j8a9 l82x9zwi uo3d90p7 pw54ja7n ue3kfks5 qsy8amke bp9cbjyn" style={{height: '132px', width: '99px'}}>
                                                                                            <div className="oeao4gh3 taijpn5t e5d9fub0 j83agx80 p4hiznlx j2ut9x2k px9q9ucb sibfvsnu cwj9ozl2 bp9cbjyn">
                                                                                                <i data-visualcompletion="css-img" className="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/sE_192AwTXC.png)`, backgroundPosition: '0px -308px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                            </div>
                                                                                            <div className="ku2m03ct j5wam9gi e9vueds3 m9osqain">Tạo tin</div>
                                                                                        </div>
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ozuftl9m oygrvhab tvfksri0 kvgmc6g5 ay7djpcl pwoa4pd7"></div>
                                                                            <div className="aovydwv3 m9hp224e j83agx80 tr9rh885 tvfksri0 oygrvhab ozuftl9m">
                                                                                <div className="bp9cbjyn j83agx80 rj1gh0hx buofh1pr g5gj957u jifvfom9">
                                                                                    <div className="bp9cbjyn j83agx80">
                                                                                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/hfKr4cklfQ4.png)`, backgroundPosition: '0px -50px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                        <span className="a5q79mjw n3ffmt46 g1cxx5fr gtad4xkn">{liststories[indexstory].count_express_emotions>0?`${liststories[indexstory].count_express_emotions} người xem`:'Chưa có người xem'}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {liststories[indexstory].count_express_emotions==0?
                                                                            <div className="ozuftl9m oygrvhab tvfksri0 tr9rh885 a3bd9o3v jq4qci2q m9osqain">Thông tin chi tiết về những người xem tin của bạn sẽ hiển thị ở đây.</div>:
                                                                            <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 e5nlhep0 ecm0bbzt">
                                                                                {listemotions.map(item=>
                                                                                <div className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l j83agx80 lzcic4wl" role="button" tabindex="0">
                                                                                    <div className="j83agx80 k4urcfbm hzawbc8m scb9dxdr sj5x9vvc dflh9lhu cxgpxx05 kkf49tns oygrvhab cgat1ltu kvgmc6g5 ihxqhq3m gfay22hk pdl3lqly b7h9ocf4 sa0u98s2 ms05siws nhd2j8a9 kzx2olss aot14ch1 p86d2i9g beltcj47 r7d6kgcz e9989ue4 esr5mh6w qu0x051f">
                                                                                        <div className="tvfksri0 taijpn5t j83agx80 ll8tlv6m">
                                                                                            <div className="q9uorilb l9j0dhe7 pzggbiyp du4w35lb">
                                                                                                <svg aria-hidden="true" className="pzggbiyp" data-visualcompletion="ignore-dynamic" role="none" style={{height: '36px', width: '36px'}}><mask id="jsc_c_11"><circle cx="18" cy="18" fill="white" r="18"></circle></mask><g mask="url(#jsc_c_11)"><image x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlinkHref={originurl+item.user.avatar} style={{height: '36px', width: '36px'}}></image><circle className="mlqo0dh0 georvekb s6kb5r3f" cx="18" cy="18" r="18"></circle></g></svg>
                                                                                            </div>
                                                                                        </div>
                                                                                            <div className="hpfvmrgz g5gj957u buofh1pr rj1gh0hx o8rfisnq">
                                                                                                <div className="cbu4d94t j83agx80">
                                                                                                    <div className="tvmbv18p j83agx80 bp9cbjyn">
                                                                                                        <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p oo9gr5id" dir="auto">
                                                                                                            <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">{item.user.name}</span>
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <div className="j5wam9gi e9vueds3 m9osqain">
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ozuftl9m taijpn5t cbu4d94t j83agx80">
                                                                                            <div className="j83agx80">
                                                                                                <div className="j83agx80 kkf49tns">
                                                                                                    {item.list_emoji?
                                                                                                    <div className="j83agx80">
                                                                                                        {item.list_emoji.split(',').map(emoji=>{
                                                                                                        if(emoji!=''){
                                                                                                            return(
                                                                                                            <div className={`bp9cbjyn j83agx80 hcukyx3x kkf49tns`}>
                                                                                                                <img className="" height="18" src={listemoji.find(item=>item.emoji==emoji).src} width="18"/>
                                                                                                            </div>)}
                                                                                                            })}
                                                                                                    </div>:''}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>)}
                                                                            </div>}
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                                <div className="pwoa4pd7 mkhogb32 n7fi1qx3 datstx6m b5wmifdl pmk7jnqg kr520xx4 qgmjvhk0 art1omkt nw2je8n7 hhz5lgdu pyaxyem1" data-visualcompletion="ignore" data-thumb="1" style={{display: 'none', right: '0px', height: '480px'}}></div>
                                                                    <div className="rq0escxv mkhogb32 n7fi1qx3 b5wmifdl jb3vyjys ph5uu5jm qt6c0cv9 b3onmgus hzruof5a pmk7jnqg kr520xx4 enuw37q7 dpja2al7 art1omkt nw2je8n7 hhz5lgdu" data-visualcompletion="ignore" data-thumb="1" style={{display: 'block', right: '0px', height: '0px'}}>
                                                                        <div className="oj68ptkr jk6sbkaj kdgqqoy6 ihh4hy1g qttc61fc datstx6m k4urcfbm"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="swmj3c3o pmk7jnqg fcg2cn6m">
                                                            <div onClick={()=>setState({...state,show_detail:false,play:true})} className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 pq6dq46d kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 pzggbiyp pkj7ub1o bqnlxs5p kkg9azqs c24pa1uk ln9iyx3p fe6kdd0r ar1oviwq l10q8mi9 sq40qgkc s8quxz6p pdjglbur" role="button" tabindex="0">
                                                                <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" aria-label="Đóng" role="img" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/WzzTPPN68Uj.png)`, backgroundPosition: '0px -92px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                            <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3 s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore" style={{inset: '-8px'}}>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                </>:''}
                                            </div>
                                            <div className="nhd2j8a9 l9j0dhe7" style={{height: '100%', width: '50%'}}>
                                                <div className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl datstx6m k4urcfbm" role="button" tabindex="-1">
                                                    {index>listfriend.length-1?'':
                                                    <div className="s45kfl79 emlxlaya bkmhp75w spb7xbtv ny22rvp7 l8rlqa9s pmk7jnqg rk01pc8j ke6wolob ms05siws pnx7fd3z msbwk0y7 ejg0drik" style={{left: '0px', marginLeft: '40px', marginRight: '0px'}}>
                                                        <div onClick={e=>setlisststory(e,indexstory+1)} aria-label="Nút Tin tiếp theo" className={`oajrlxb2 qu0x051f ${indexstory>liststories.length-1?'disabled':''} esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn cwj9ozl2 t51s4qs2 bv6zxntz qc3rp1z7 rj06g9kl s45kfl79 emlxlaya bkmhp75w spb7xbtv goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 rq0escxv m9osqain j83agx80 m7zwrmfr taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tmrshh9y`} role="button" tabindex="0">
                                                            <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/wQl2Y1MWWpw.png)`, backgroundPosition: '-108px -13px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                        </div>
                                                        <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="n851cfcs nnctdnn4 l9j0dhe7 pcmqbax4">
                                            {user && liststories[indexstory].user  && liststories.some(item=>item.time>0)&& user.id!=liststories[indexstory].user.id?
                                            <div className="emoij-bottom flex flex-center">
                                                <div className={`draft-text item-space ${rawContentState.blocks[0].text.trim()==''?'':'draf-text-full'}`}>
                                                    <div onClick={(e) =>{
                                                        e.stopPropagation()
                                                        setState({...state,play:false})
                                                        ref.current.focus()       
                                                        }}  
                                                        className="_5rp7 r62gjns8">
                                                        <div className="_1p1t _1p1u">
                                                                {rawContentState.blocks[0].text.trim()==''?<div className="_1p1v " id="placeholder-bpbjf" style={{whiteSpace: 'pre-wrap'}}>Reply {liststories[indexstory].user.name}</div>:''}
                                                        </div>
                                                        <div className="_5rpb">
                                                            <Editor
                                                                editorKey={'editor'}
                                                                editorState={editorState}
                                                                onChange={onChange}
                                                                ref={ref}
                                                                
                                                                keyBindingFn={myKeyBindingFn}
                                                            />
                                                        </div>
                                                        
                                                    </div>
                                                    <EmojiPicker
                                                        showemoji={showemoji}
                                                        setshowemoji={(data)=>setShowemoji(data)}
                                                        setaddkey={(e,text)=>setaddkey(e,text)}
                                                    />
                                                    {rawContentState.blocks[0].text.trim()==''?'':
                                                    <div class="ml-4">
                                                       <div onClick={(e)=>sendmessage(e)} class="chat-send-tooltip flex flex-center">
                                                           <i class="_3kEAcT1Mk5 chat-index__button">
                                                               <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="chat-icon"><path d="M4 14.497v3.724L18.409 12 4 5.779v3.718l10 2.5-10 2.5zM2.698 3.038l18.63 8.044a1 1 0 010 1.836l-18.63 8.044a.5.5 0 01-.698-.46V3.498a.5.5 0 01.698-.459z"></path></svg>
                                                            </i>
                                                        </div>
                                                    </div>}
                                                </div>
                                                {rawContentState.blocks[0].text.trim()==''?
                                                <div style={{width:'300px'}} className="gu00c43d taijpn5t j83agx80">
                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p">
                                                        <div className="flex flex-center">
                                                            {listemoji.map(item=>
                                                            <Tooltip
                                                            content={`${item.name}`}
                                                            position='top'
                                                            >
                                                            <div onMouseLeave={()=>setState({...state,play:true})} onMouseEnter={()=>setState({...state,play:false})} key={item.emoji} className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t d2edcug0 hpfvmrgz rj1gh0hx buofh1pr g5gj957u">
                                                                <div onClick={(e)=>setstoryemoji(e,item)} className="cgat1ltu kkf49tns" style={{height: '32px', width: '32px'}}>
                                                                    <div className="emoji-item flame">
                                                                        <img width='32' height='32' src={item.src}/>
                                                                        
                                                                    </div>
                                                                    {emojichoice!=null && animation && emojichoice.emoji==item.emoji?
                                                                
                                                                    <div className="emoji-item flame animate">
                                                                        <img width='32' height='32' src={item.src}/>
                                                                    </div>
                                                                    :''}
                                                                </div>                  
                                                            </div>
                                                            </Tooltip>
                                                            )}
                                                            
                                                        </div>
                                                    </div>
                                                </div>:''}
                                            </div>:''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }    
                                    
                        </div>
                    </div>
                </div>
                </div>
            </div>:''} 
        </div>
    )
}


const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,count_notify_unseen:state.count_notify_unseen
});
  
export default connect(mapStateToProps,{showreport,showturnoff})( Story);
