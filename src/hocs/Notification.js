
import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify,showreport } from "../actions/auth";
import { actioncommentURL, actionfriendURL, actionNotificationURL, commentreplyURL, originurl } from "../urls";
import { number,timeago,listemoji,listaction } from "../constants";
import io from "socket.io-client"
const Notification=(props)=>{
    const {user}=props
    const [time,setTime]=useState(4)
    const [show,setShow]=useState(true)
    const [notification,setNotification]=useState()
    const socket=useRef()
    useEffect(() => { 
        socket.current=io.connect('https://server-socket-123.herokuapp.com')
        socket.current.on('notifi',listusers=>{
            setShow(true)
            console.log(listusers)
            if(user){
            setNotification(listusers.find(item=>item.receiver_id==user.id)) 
            }
        })
        return () => socket.current.disconnect()
    },[notification,user])
   
    useEffect(() => {
        if(notification){
            const timer=setInterval(()=>{
                setShow(false)
                setNotification()
            },6000)
            return () => clearInterval(timer)
        }
    }, [notification])
    console.log(show)
    const deletenotifi=(e)=>{
        ( async()=>{
            try{
                const res=await axios.delete(`${actionNotificationURL}/${notification.id}`,{},headers)
                setShow(false)
            }
            catch(e){
                console.log(e)
            }
        })()
    }
    console.log(user)
    console.log(notification)
    const submit=(e)=>{
        (async()=>{
            try{
            const data={action:'accept friend request',receiver_id:notification.user_id}
            const res=await axios.post(actionfriendURL,JSON.stringify(data),headers)
            socket.current.emit("sendNotifi",res.data.listnotifications)
            setShow(false)
            }
            catch(e){
                console.log(e)
            }
        })()
    }
    return(
        <>
        {notification && show  && (notification.notification_type==4 || notification.notification_type==1|| notification.notification_type==7  || notification.notification_type==5)?
        <div className="" style={{position:'fixed',bottom:'20px',left:'20px'}}>  
            
            <div className="notification-container">
                <div className="notification-header">
                    <div className="notification-header-title">Th??ng b??o m???i</div>
                    <div onClick={()=>setShow(false)} aria-label="????ng" class="notification-header-close border-50" role="button" tabindex="0">
                        
                        <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-39px -126px', backgroundSize: 'auto', width:'12px', height: '12px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>           
                        
                    </div> 
                </div>
                <div className="notification-body flex-center">
                    <div className="notification-body-avatar">
                        <svg aria-hidden="true" class="pzggbiyp" data-visualcompletion="ignore-dynamic" role="none" style={{height: '56px', width: '56px'}}><mask id="jsc_c_8e"><circle cx="28" cy="28" fill="white" r="28"></circle><circle cx="48" cy="48" data-visualcompletion="ignore" fill="black" r="9"></circle></mask><g mask="url(#jsc_c_8e)"><image x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlinkHref={originurl+notification.avatar} style={{height: '56px', width: '56px'}}></image><circle class="mlqo0dh0 georvekb s6kb5r3f" cx="28" cy="28" r="28"></circle></g>
                        </svg>
                        <div class="notification-body-icon" style={{backgroundColor: 'transparent'}}>
                        {notification.notification_type==1?
                        <img class="hu5pjgll bixrwtb6" src={listemoji.find(emoji=>emoji.emoji==notification.text_preview).src} alt="" style={{height: '28px', width: '28px'}}/>:
                            <i data-visualcompletion="css-img" class="hu5pjgll bixrwtb6" style={{height: '28px', width: '28px', backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/0WudJbeIJ5t.png)`, backgroundPosition: `0px ${notification.notification_type==5 || notification.notification_type==7?-812:notification.comment?-725:-1653}px`, backgroundSize: 'auto', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        }
                        </div> 
                    </div>
                    <div className="notification-info mr-8">
                    <div className="mb-8"><strong>{notification.name}</strong> {notification.notification_type==5?' ???? g???i l???i m???i k???t b???n cho b???n':notification.notification_type==7?' ???? ch???p nh???n l???i m???i k???t b???n c???a b???n':notification.notification_type==4?' ???? nh???c ?????n b???n trong b??nh lu???n':notification.notification_type==1?notification.story?`???? ${notification.text_preview=='like'?'th??ch':'b??y t??? c???m x??c'} v??? tin c???a b???n`:notification.post?` ???? ${notification.text_preview=='like'?'th??ch':'b??y t??? c???m x??c'} v??? b??i vi???t c???a b???n`:notification.comment?`???? ${notification.text_preview=='like'?'th??ch':'b??y t??? c???m x??c'} v??? b??nh lu???n c???a b???n`:'':'???? ???????c g???n th??? trong b??i vi???t'}</div>
                        <div className="notification-time"><span className="q66pz984">V??i gi??y tr?????c</span></div>
                    </div>
                    <div class="notifi-new s1i5eluu border-50" role="presentation" tabindex="0">
                        <span class="s1i5eluu notifi-new" data-visualcompletion="ignore"></span>
                    </div>
                </div>
                {notification.notification_type==5?
                <div className="notification-fotter">
                    <div className="fotter-wrapper">
                        <div onClick={(e)=>submit(e)} className="p-4-8 border-6 nhd2j8a9 bwm1u5wc s1i5eluu mr-8">X??c nh???n</div>
                        <div onClick={e=>deletenotifi(e)} className="p-4-8 border-6 nhd2j8a9 a57itxjd tdjehn4e">X??a</div>
                    </div>
                </div>:''}
            </div>
                      
        </div>:''}     
        </>   
    )
}

export default Notification