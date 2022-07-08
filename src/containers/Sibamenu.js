
import React,{useState,useEffect, useRef} from 'react';
import {Link} from "react-router-dom"
import { listfriendURL,originurl } from '../urls';
const listitem=[
{name:"Friends",src:"https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/S0U5ECzYUSu.png",url:"/friends"},
{name:"Live",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yu/r/AisrwUSvQf8.png",url:"/watch/live"},
{name:"Groups",src:"https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/PrjLkDYpYbH.png",url:"/groups"},
{name:"Marketplace",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/D2y-jJ2C_hO.png",url:"/marketplace"},
{name:"Watch",src:"https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/duk32h44Y31.png",url:"/watch"},
{name:"Kỷ niệm",src:"https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/he-BkogidIc.png",url:"/memories"},
{name:"Đã lưu",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/lVijPkTeN-r.png",url:"/saved"},
{name:"Messager",src:"https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/4Y9Xi2D3hJv.png",url:"/messages"},
{name:"Sự kiện",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yu/r/eXC82ZeepQ7.png",url:"/event"},
{name:"Trang",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/kyCAf2jbZvF.png",url:"/pages"},
{name:"Yêu thích",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/mAnT0r8GSOm.png",url:"/favorites"},
]
const Sibamenu=(props)=>{
    const {user}=props
    const [state,setState]=useState({show_all:false})
    return(
        <div class="left-panel">
        <ul>
            {user!=null?
            <li>
                <span class="profile">
                    <img width='100%' src={originurl+user.avatar}/>
                </span>
                <p>{user.name}</p>
            </li>:''}
            
            {/*---add---*/}
            {listitem.map((item,index)=>{
                if(index<5){
                    return(
                    <li key={index}>
                        <div style={{paddingLeft: '8px', paddingRight: '8px'}}>
                            <Link to={item.url}>
                                <div className="flex flex-center">
                                    <img class="hu5pjgll bixrwtb6" src={item.src} alt="" style={{height: '36px', width: '36px'}}/>
                                    <p>{item.name}</p>
                                </div>
                                
                            </Link>
                        </div>
                    </li>
                )}
                if(index>=5 && state.show_all){
                    return(
                        <li key={index}>
                            <div style={{paddingLeft: '8px', paddingRight: '8px'}}>
                                <Link to={item.url}>
                                    <div className="flex flex-center">
                                        <img class="hu5pjgll bixrwtb6" src={item.src} alt="" style={{height: '36px', width: '36px'}}/>
                                        <p>{item.name}</p>
                                    </div>
                                    
                                </Link>
                            </div>
                        </li>
                    ) 
                }
            }
            )}
             
        </ul>
        <div className="add-item">
            <div className="flex-center flex" onClick={e=>setState({...state,show_all:!state.show_all})}>
                <div class="s45kfl79 emlxlaya bkmhp75w tdjehn4e tv7at329 thwo4zme">
                    <svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 rs22bh7c jnigpg78 odw8uiq3"><g fill-rule="evenodd" transform="translate(-448 -544)"><path fill-rule="nonzero" d="M452.707 549.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L456 552.586l-3.293-3.293z"></path></g></svg>
                </div>
                <div>Xem thêm</div>
            </div>
        </div>
        <div class="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Advance</a>
            <a href="#">More</a>
        </div>
    </div>
    )
}
export default Sibamenu