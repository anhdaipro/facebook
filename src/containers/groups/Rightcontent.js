import { useState,useEffect } from "react"
import { headers,uploadpost } from "../../actions/auth"
import { actionfriendURL } from "../../urls"
import axios from "axios"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import styles from "./groups.module.css"
import { listfrienduserURL,listfriendURL,listinvitationURL,originurl } from "../../urls"
const Rightcontent=(props)=>{
    const {user}=props
    const [listgroupsuggest,setListgroupsuggest]=useState([])
    const [translate,setTranslate]=useState(0)
    const setactionfriend=(e,itemchoice,action)=>{
        ( async ()=>{
            e.preventDefault()
            const data={receiver_id:itemchoice.user_id,action:action}
			const res= await axios.post(actionfriendURL,JSON.stringify(data),headers)
			if(action=='hide-suggested'){
                setListgroupsuggest(listgroupsuggest.filter(item=>item.user_id!=itemchoice.user_id))
            }
            else{
                setListgroupsuggest(current=>current.map(item=>{
                    if(item.user_id==itemchoice.user_id){
                    return({...item,friend_invitation:!item.friend_invitation})
                    }
                    return({...item})
                }))
            }
        })() 
    }

    return (
        <div className={styles.body}>
            <div className="suggested_container">
            {listgroupsuggest.length>0?
                <div className="facebook-friends-suggested">
                    <div className="item-space friends-suggested-header">
                        <div className="title">Những người bạn có thể biết</div>
                        <div className="dot-icon">
                            <span class="item-center flex three-dot" id="three-dot-btn-click">
                                <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" class=""><g fill-rule="evenodd" transform="translate(-446 -350)"><path d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path></g></svg>
                            </span>
                        </div>
                    </div>
                    <div className="friends-suggested-wrapper">
                        <div className="list-item">
                            <ul className="list-friends-suggested" style={{transform:`translate(${translate}px,0px)`,transition: `all 500ms ease 0s`,width:`250%`}}>
                                {listgroupsuggest.map(item=>
                                    <li key={item.user_id} className="friend-suggested" style={{width:`268px`,padding:0}}>
                                        <Link to={item.username}>
                                            <div className="friend-suggested-container">
                                                <div style={{backgroundImage:`url(${originurl}${item.avatar})`,backgroundSize:'contain',backgroundRepeat:'no-repeat',width:'100%'}}></div>
                                                    <a className="friend-suggested-name">{item.name}</a>
                                                    {item.mutual_friends?
                                                    <div className="friend-suggested-avatar">
                                                        {item.mutual_friends.listgroup.map(avatar=>
                                                        <img key={avatar} src={originurl+avatar}/>
                                                    )}   
                                                    </div>:''}
                                                <div className={`btn-action-friend ${item.friend_invitation?'btn-second':'btn-add-friend'}`}>
                                                    <span className={`${item.friend_invitation?'text-normal':'text-primary'}`}>{item.friend?'Bạn bè':item.friend_invitation?'Hủy yêu cầu':'Thêm Bạn bè'}</span>
                                                </div> 
                                                <i onClick={e=>setactionfriend(e,item,'hide-suggested')} setactionfriend class="icon modal__close">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.85355339,1.98959236 L8.157,7.29314575 L13.4601551,1.98959236 C13.6337215,1.81602601 13.9031459,1.79674086 14.098014,1.93173691 L14.1672619,1.98959236 C14.362524,2.18485451 14.362524,2.501437 14.1672619,2.69669914 L14.1672619,2.69669914 L8.864,8.00014575 L14.1672619,13.3033009 C14.362524,13.498563 14.362524,13.8151455 14.1672619,14.0104076 C13.9719997,14.2056698 13.6554173,14.2056698 13.4601551,14.0104076 L8.157,8.70714575 L2.85355339,14.0104076 C2.67998704,14.183974 2.41056264,14.2032591 2.2156945,14.0682631 L2.14644661,14.0104076 C1.95118446,13.8151455 1.95118446,13.498563 2.14644661,13.3033009 L2.14644661,13.3033009 L7.45,8.00014575 L2.14644661,2.69669914 C1.95118446,2.501437 1.95118446,2.18485451 2.14644661,1.98959236 C2.34170876,1.79433021 2.65829124,1.79433021 2.85355339,1.98959236 Z"></path></svg>
                                                </i>                                                  
                                            </div>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {listgroupsuggest.length>2?<>
                        <div onClick={()=>setTranslate(translate+400)} className="arrow arrow-left" style={{visibility:`hidden`}}>
                        <svg fill="currentColor" viewBox="0 0 20 20" width="24" height="24" class="b6ax4al1 m4pnbp5e somyomsx ahndzqod gnhxmgs4 mwtcrujb mx6bq00g"><path d="M12.2 4.53 6.727 10l5.47 5.47a.75.75 0 0 1-1.061 1.06l-6-6a.751.751 0 0 1 0-1.06l6-6A.75.75 0 1 1 12.2 4.53z"></path></svg>
                        </div>
                                    
                        <div onClick={()=>setTranslate(translate-400)} className="arrow arrow-right" style={{visibility:'visible'}}>
                        <svg fill="currentColor" viewBox="0 0 20 20" width="24" height="24" class="b6ax4al1 m4pnbp5e somyomsx ahndzqod gnhxmgs4 mwtcrujb mx6bq00g"><path d="M7.8 4.53 13.273 10 7.8 15.47a.75.75 0 0 0 1.061 1.06l6-6a.751.751 0 0 0 0-1.06l-6-6A.75.75 0 0 0 7.8 4.53z"></path></svg>
                        </div></>:
                        ''}
                    </div>
                </div>:''}
            </div>
            <div className={styles.list_post}>
                <div className={styles.post}>
                    <div>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,
});
  
export default connect(mapStateToProps,{uploadpost})( Rightcontent);
