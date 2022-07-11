import { listemoji, listitem, number,checkDay,weekday } from "../constants"
import { originurl,actionpostURL,listcommentURL, commentreplyURL } from "../urls"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import { connect } from 'react-redux';
import { expiry, headers,showreport,showactionport,uploadpost } from '../actions/auth';
import Tooltip from "../hocs/Tooltip";
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Actionpost from "../hocs/Actionpost";
import Listcomment from "./Listcomment";
const Postdetail=(props)=>{
    const {post,user,actionpost,showactionport,onlineUsers,uploadpost,showreport}=props
    console.log(actionpost)
    const [state,setState]=useState({emotion_post:false})
    const [item,setItem]=useState(null)
    console.log(onlineUsers)
    useEffect(()=>{
        setItem(post)
        },[post])
    
    const setitem=useCallback((value)=>{
        setItem(value)
    },[item])
    
   
    useEffect(()=>{
        if(actionpost && actionpost.action=='' && post.id==actionpost.id){
            setItem({...item,...actionpost})
        }
    },[actionpost])
    console.log(actionpost)
    return(
        <>
        {item?
        <section className="section-div">
            <div className="post-hader flex flex-center">
                <a href="#">
                    <div className="profile-images">
                        <img src={originurl+item.user.avatar}/>
                        <div className={`${onlineUsers.some(user=>user.userId==item.user.id) || item.user.id==user.id?'online-icon':'offline_icon'}`}></div>
                    </div>
                </a>
                
                <div className="ml-8">
                    <div className="profile-name-text mb-8">
                        <a href="#" id="Profile_Name">{item.user.name}</a>
                        <div className="profile-name-hover">
                            <a href="#"><div className="profile-images">
                                <img src={originurl+item.user.avatar}/>
                                <div className={`${onlineUsers.some(user=>user.userId==item.user.id)?'online-icon':'offline_icon'}`}></div>
                            </div></a>

                            <h2>
                                <a href="#" id="Profile_Name">{item.user.name}</a>
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
                            <a href="#" className="Post_upload_date">{checkDay(new Date(item.posted))=="Today"?`${("0" + new Date(item.posted).getHours()).slice(-2)}:${("0" + new Date(item.posted).getMinutes()).slice(-2)}`:checkDay(new Date(item.posted))=="Yesterday"?`Yesterday, ${("0" + new Date(item.posted).getHours()).slice(-2)}:${("0" + new Date(item.posted).getMinutes()).slice(-2)}`:new Date(item.posted).getFullYear()<new Date().getFullYear()?`${("0" + new Date(item.posted).getDate()).slice(-2)} Tháng ${("0"+(new Date(item.posted).getMonth()+1)).slice(-2)}, ${new Date(item.posted).getFullYear()}`:`${("0" + new Date(item.posted).getDate()).slice(-2)} Tháng ${(new Date(item.posted).getMonth()+1)} lúc ${("0" + new Date(item.posted).getHours()).slice(-2)}:${("0" + new Date(item.posted).getMinutes()).slice(-2)}`}
                                <span className="uplode-Date_Hover">
                                {`${weekday[new Date(item.posted).getDay()]}, ${("0" + new Date(item.posted).getDate()).slice(-2)} Tháng ${(new Date(item.posted).getMonth()+1)}, ${new Date(item.posted).getFullYear()} lúc ${("0" + new Date(item.posted).getHours()).slice(-2)}:${("0" + new Date(item.posted).getMinutes()).slice(-2)}`}
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
                                    {listitem.find(em=>em.value==item.viewer).name}
                                    </>
                                }
                                position='top'
                                >
                                <div onClick={(e)=>{
                                    e.stopPropagation()
                                    if(user.id==item.user.id){
                                    axios.get(`${actionpostURL}/${item.id}`,headers)
                                    .then(res=>{
                                        showactionport({viewer:{value:item.viewer},id:item.id,listspecific:res.data.list_specific,listexcept:res.data.list_except,action:'addviewer'})
                                    })
                                    
                                    }
                                    }} className="flex">
                                    <img class="hu5pjgll m6k467ps" src={listitem.find(em=>em.value==item.viewer).src} alt="Bạn bè" height="12" width="12"/>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    
                </div>
                <Actionpost
                post={item}
                user={user}
                showreport={data=>showreport(data)}
                setitem={(data)=>setitem(data)}
                uploadpost={data=>uploadpost(data)}
                showactionport={data=>showactionport(data)}
                />

            </div>

            <div className="k4urcfbm">
                {JSON.parse(item.caption).background?
                <div className="post-image-background">
                    <div style={{height:'100%',backgroundSize: 'cover',backgroundImage:`url(${JSON.parse(item.caption).background.src})`}} className="flex item-center">
                        <div className="sfj4j7ms pvbba8z0 rqr5e5pd dy7m38rt j7igg4fr" id="jsc_c_n7" style={{color: `rgb(255, 255, 255)`, fontSize: '30px', fontStyle: 'normal', fontWeight: 'bold', textAlign: 'center'}}>
                            <div className="kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x c1et5uql">{JSON.parse(item.caption).caption}</div>
                        </div>
                        
                    </div>
                </div>
                :
                <div className="post-text">
                    {JSON.parse(item.caption).caption}
                </div>
                }
            </div>
            {item.fileupload.length>0?
            <div className="list-file">
                <div className="l9j0dhe7" style={{position:'relative',height:`500px`,display:'flex',flexWrap: 'wrap' ,flexDirection: 'row'}}>
                    {item.fileupload.map((file,i)=>
                        <Link to={`/photo?id=${file.id}&post_id=${item.id}`}>
                            <div key={i} className="stjgntxs ni8dbmo4 taijpn5t j83agx80 bp9cbjyn" style={{cursor:'pointer',position:'relative',height:`${item.count_file==1?500:250}px`,width:`${item.count_file==1?500:250}px`}}>                       
                                <div className="" style={{height: '100%',left: '0%',width: '100%'}}>
                                    <img draggable="false" alt="7e00ec5cd27164a1fc2d76e2ea568cbc_tn.jpg" className="datstx6m bixrwtb6 k4urcfbm" referrerpolicy="origin-when-cross-origin" src={`${originurl}${file.file_preview?file.file_preview:file.file}`}/>
                                    {item.count_file>4 && i==3?
                                        <div className="kr520xx4 j9ispegn pmk7jnqg taijpn5t cbu4d94t n7fi1qx3 j83agx80 i09qtzwb sx5rzos5 bp9cbjyn">
                                        <div className="oqcyycmt lrazzd5p mhxlubs3 qrtewk5h">+{item.count_file-4}</div>
                                    </div>
                                    :''}
                                </div>                      
                            </div>
                        </Link>
                    )}
                </div>
            </div>:''}
            <Listcomment
                item={item}
                url={actionpostURL}
                user={user}
                onlineUsers={onlineUsers}
                setitem={data=>setitem(data)}
                urlcomment={listcommentURL}
            />

        </section>:''}
   
    </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,actionpost:state.postaction
});
  
export default connect(mapStateToProps,{showreport,showactionport,uploadpost})( Postdetail);
