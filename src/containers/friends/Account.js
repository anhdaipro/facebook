import Navbar from "../Navbar"
import Sibar from "./Sibar"
import styles from "./sibar.module.css"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import { listfriendsuggestURL,listfriendURL,listinvitationURL,originurl } from "../../urls"
import { headers } from "../../actions/auth"
import { listitem, originweb,actionfriend } from "../../constants"
import Empty from "./ContentEmty"
import {Link} from "react-router-dom"
const listaction=[
    {name:'Nhắn tin',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png',position:'-100px -86px'},
    {name:'Bỏ theo dõi',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/258MsptFNEE.png',position:'0px -1397px',info:'Dừng xem bài viết nhưng vẫn là bạn bè'},
    {name:'Chặn trang cá nhân',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/9TSKechz36A.png',position:'0px -346px',info:'Không thể nhìn thấy hoặc liên hệ với bạn'},
    {name:'Hủy kết bạn',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/eFPqTBNFT8D.png',position:'-0px -63px',info:'Hủy kết bạn'},
]
const Account=(props)=>{
    const [show,setShow]=useState(false)
    const btnref=useRef()
    const dropref=useRef()
    useEffect(()=>{
        
    },[])
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
    const {item}=props
    return(
        <div key={item.id} className={styles.item}>
            <div className="flex flex-center">
                <div className={`avatar`}>
                    <img src={originurl+item.avatar} className="avatar__image"/>
                </div>
                <div className={styles.name}>{item.name}</div>
            </div>                    
            <div ref={btnref} onClick={e=>setShow(!show)} class="alzwoclg">
                <i data-visualcompletion="css-img" class="gneimcpu oee9glnz" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png)`, backgroundPosition: `-119px -174px`, backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
            </div>
            {show?
            <div ref={dropref} className="drop-down" style={{width:'340px',marginTop:'8px',position:'absolute',left:`${btnref.current.offsetLeft-18}px`,top:`${btnref.current.offsetTop+20}px`}}>
                <div className="list-item p-8">
                        {listaction.map((item,i)=>
                        <div key={i} className={styles.item}>
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
export default Account