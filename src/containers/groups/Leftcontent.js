import { Link, Navigate,useNavigate } from "react-router-dom"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios"
import { listfrienduserURL,listfriendURL,listinvitationURL,originurl } from "../../urls"
import { headers } from "../../actions/auth"
import styles from "./sibar.module.css"
import {debounce} from 'lodash';
const listitem=[
    {name:'Bảng feed của bạn',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/uwKAcWRCsCf.png',position:'0px -251px',url:'/groups/feed'},
    {name:'Khám phá',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/uwKAcWRCsCf.png',position:'0px -125px',url:'/groups/discover'}
]
const Leftcontent=()=>{
    const [groups,setGroups]=useState([])
    const setkeyword=(e)=>{
        const value=e.target.value
        setKeyword(value)
        fetchkeyword(value)
    }

    const navigate=useNavigate()
    const [count,setCount]=useState(0)
    const [keyword,setKeyword]=useState()
    const setlistitem=useCallback((data)=>{
        setGroups(data)
    },[groups])

    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const url=value!=''?`${listfrienduserURL}?keyword=${value}`:listfrienduserURL
                const res = await axios.get(url,headers)
                setGroups(res.data.listfriend)
                setCount(res.data.count)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[])
    return(
        <div className="wrapper-l sibar-wrapper">
            <div className="item-space mt-1 p-1_2">
                <div className={styles.title}>Nhóm</div>
                <div className="icon-setting">
                    <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/wi7d5lDooXC.png)`, backgroundPosition: `0px -394px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: `inline-block`}}></i>
                </div>
            </div>
            <div className="search">
                <div className="search__icon">
                    <i data-visualcompletion="css-img" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png)`, backgroundPosition: `-153px -174px`, backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                </div>
                <input onChange={e=>setkeyword(e)} value={keyword} className="search__input" placeholder="Tìm kiếm bạn bè" type="text"/>
            </div>
            <div className={styles.list_item}>
                {listitem.map(item=>
                <Link to={`${item.url}`}>
                    <div key={item.id} className={styles.item}>
                        <div className="flex flex-center">
                            <div className={`${styles.icon} ${window.location.pathname==item.url?`icon-active`:''}`}>
                                <i data-visualcompletion="css-img" class={`gneimcpu ${window.location.pathname==item.url?'active':''}`} style={{backgroundImage: `url(${item.src})`, backgroundPosition: `${item.position}`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: `inline-block`}}></i>
                            </div>
                            <div className={styles.name}>{item.name}</div>
                        </div>
                    </div>
                </Link>
                )}
            </div>
            <div onClick={()=>navigate('/groups/create')} className={`btn-action-friend btn-add-friend`}>
                <i data-visualcompletion="css-img" class={`gneimcpu text-primary mr-8`} style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/1i7g2g9A6lZ.png)`, backgroundPosition: `0px -540px`, backgroundSize: `auto`, width: `16px`, height: `16px`, backgroundRepeat: `no-repeat`, display: `inline-block`}}></i>                                        
                <span className={`text-primary`}>Tạo nhóm mới</span>
            </div>
            <div className="separator"></div>
            <div className="body-wrapper">
                <div className={`${styles.sibar_header} mb-4`}><div className={styles.title}>Nhóm bạn đã tham gia</div></div>
                <div className={styles.list_item}>
                    <div className={`${styles.item}`}>
                        <div className="flex flex-center">
                            <div className={`${styles.avatar}`}>
                                <img src={`https://scontent.fsgn2-1.fna.fbcdn.net/v/t31.18172-8/13613686_587569758090258_1710290716272059514_o.jpg?stp=c19.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=111&ccb=1-7&_nc_sid=70495d&_nc_ohc=9_WAssFmcd8AX_03F60&_nc_ht=scontent.fsgn2-1.fna&oh=00_AT9zuKIvpfWvsvmqboRVHglopsgX4-WecCZ7AjIdx3C3Cg&oe=633A3452`} className={styles.avatar__image}/>
                            </div>    
                            <div className={`${styles.name} t7p7dqev`}>item.name</div>
                        </div>
                        <div className="icon-action">
                            <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/kG0xgpgNaUn.png&quot;)`, backgroundPosition: `0px -38px`, backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Leftcontent