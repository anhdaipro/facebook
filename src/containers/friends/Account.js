import Navbar from "../Navbar"
import Sibar from "./Sibar"
import styles from "./sibar.module.css"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import { actionfriendURL,listinvitationURL,originurl } from "../../urls"
import { headers,showchat } from "../../actions/auth"
import { connect } from 'react-redux'
import Empty from "./ContentEmty"
import {Link} from "react-router-dom"

const Account=(props)=>{
    const [show,setShow]=useState(false)
    const {item,listitem,setlistitem,showchat,user}=props
    const btnref=useRef()
    const listaction=useMemo(()=>{
        return [
            {name:'Nhắn tin',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png',position:'-100px -86px',action:'message'},
            {name:`${item.follow?'Bỏ theo dõi':'Theo dõi'}`,src:`${item.follow?'https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/258MsptFNEE.png':'https://static.xx.fbcdn.net/rsrc.php/v3/yL/r/WBOx95Hq6eR.png'}`,position:`0px -${item.follow?1397:172}px`,info:`${item.follow?'Dừng xem bài viết nhưng vẫn là bạn bè':'Xem bài viết'}`,action:'follow'},
            {name:'Chặn trang cá nhân',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/9TSKechz36A.png',position:'0px -346px',info:'Không thể nhìn thấy hoặc liên hệ với bạn',action:'block'},
            {name:'Hủy kết bạn',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/eFPqTBNFT8D.png',position:'-0px -63px',info:'Hủy kết bạn',action:'unfriend'},
        ]
    },[item])
    const dropref=useRef()
    const setactionfriend=(action)=>{
        (async ()=>{
                const data={action:action,receiver_id:item.id}
                const res =await axios.post(actionfriendURL,JSON.stringify(data),headers)
                const listdata=listitem.map(itemchoice=>{
                    if(itemchoice.id==item.id){
                        return({...itemchoice,...res.data.action})
                    }
                    return({...itemchoice})
                })
                setlistitem(listdata)
        })()
    }
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const handleClick = (event) => {
        const { target } = event
        if(dropref.current && btnref.current){
            if (!dropref.current.contains(target) && !btnref.current.contains(target)) {
                setShow(false)
            }
        }
    }
    const  setshowchat=(e)=>{
        e.preventDefault()
        let data={member:item.id!=user.id?[item.id,user.id]:[user.id],thread:null}
        showchat(data)
    } 
    return(
        <div key={item.id} className={styles.item}>
            <div className="flex flex-center">
                <div className={`avatar`}>
                    <img src={item.avatar} className="avatar__image"/>
                </div>
                <div className={styles.name}>{item.name}</div>
            </div>
            {item.friend?                  
            <div ref={btnref} onClick={e=>setShow(!show)} class="alzwoclg">
                <i data-visualcompletion="css-img" class="gneimcpu oee9glnz" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png)`, backgroundPosition: `-119px -174px`, backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
            </div>:
            <button onClick={()=>setactionfriend('friend_invitation')} className={`btn btn-l ${item.friend_invitation?'btn-second':'btn-add-friend'}`}>
                <span className={`${item.friend_invitation?'text-normal':'text-primary'}`}>{item.friend_invitation?'Hủy':'Thêm bạn bè'}</span> 
            </button>}
            {show?
            <div ref={dropref} className="drop-down" style={{width:'340px',marginTop:'8px',position:'absolute',left:`${btnref.current.offsetLeft-18}px`,top:`${btnref.current.offsetTop+20}px`}}>
                <div className="list-item p-8">
                        {listaction.map((item,i)=>
                        <div onClick={(e)=>{if(item.action!='message'){
                            setactionfriend(item.action)}
                            else{
                                setshowchat(e)
                            }
                            setShow(false)
                        }} key={i} className={styles.item}>
                            <div className="flex flex-center">
                                <div className={`${styles.icon}`}>
                                    
                                    <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(${item.src})`, backgroundPosition: item.position, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                    
                                </div>
                                <div>
                                    <div style={{fontSize:'14px'}} className={`${styles.name} text-normal ${item.info?'my-5':''}`}>
                                        {item.name}
                                    </div>
                                    {item.info?
                                    <div className={styles.info}>
                                        {item.info}
                                    </div>:''}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div class="d06cv69u cdcbzqsl goun2846 ccm00jje s44p3ltw mk2mc5f4 tl61u9r6 bcctvi4p gcjuebxg kvs4odcb hzruof5a pmk7jnqg et4y5ytx np69z8it bssd97o4 n4j0glhw j9ispegn" style={{transform: `translate(20px, 7px) rotate(-45deg)`}}></div>
            </div>:''}                      
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,
    count_notify_unseen:state.count_notify_unseen,
    count_message_unseen:state.count_message_unseen
});
export default connect(mapStateToProps, {showchat })(Account);
