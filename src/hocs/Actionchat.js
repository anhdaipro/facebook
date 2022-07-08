import Inputsearch from "./Inputsearch"
import axios from 'axios';
import React, {useState, useEffect,useCallback,useRef,useMemo} from 'react'
import {conversationsURL,listtagURL,listThreadlURL,uploadfileURL,createmessageURL,filemessageURL, originurl, createthreadURL} from "../urls"
import { connect } from 'react-redux';
import { headers,expiry,actionchat} from '../actions/auth';
const Actionchat=(props)=>{
    const {user,tags,settags,data,setdatachat,datachat}=props
    const [state, setState] = useState({text:''})
    const [listuser, setListuser] = useState([])
    const [show,setShow]=useState(false)
    const [action,setAction]=useState()
    const [members,setMembers]=useState([])
    const [thread,setThread]=useState()
    useEffect(()=>{
        if(datachat){
            setShow(datachat.show)
            setAction(datachat.action)
            setMembers(datachat.members)
            setThread(datachat.thread)
        }
    },[datachat])

    const submit=(e)=>{
        (async ()=>{
            let form=new FormData()
            const res= await axios.post(createthreadURL,form,user)
        })()
    }
    return(
        <>
        {show?
        <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
            <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
            <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
                <form className="tiktok-si5yni-FormPost ex8pc610">
                    <div className="tiktok-i17c8h-DivFormHeader ex8pc612">
                        <h4 data-e2e="report-card-title" class="tiktok-f8vded-H4FormTitle ex8pc615">{action=='forward'?"Chuyển tiếp tin nhắn":''}</h4>
                        <div onClick={()=>setShow(false)} data-e2e="report-card-cancel" class="tiktok-78z7l6-DivCloseButton ex8pc614">
                            <svg width="14" height="14" viewBox="0 0 9 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path></svg>
                        </div>
                        
                    </div>
                    <div className="tiktok-1n0ni8r-DivRadioWrapper ex8pc616">
                        
                        <div className="tiktok-1vwgyq9-DivInputAreaContainer e1npxakq2">
                        <div className={`${listuser.length==0?'item-center flex p-8':'p-4-16'}`}>
                            <span  dir="auto">
                                {listuser.length>0?'Tìm kiếm' :'Không tìm thấy người nào'}
                            </span>
                        </div>
                        
                        {listuser.map(mention=>
                            <div onClick={()=>{
                                settags([...tags,mention])
                                setListuser([])
                                setState({...state,text:''})
                            }} key={mention.id} data-e2e="comment-at-list" className="tiktok-d4c6zy-DivItemBackground ewopnkv6">
                                <div className="tiktok-1rn2hi8-DivItemContainer ewopnkv5 item-space">
                                    <span shape="circle" className="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{flex: '0 0 40px', width: '40px', height: '40px'}}>
                                        <img loading="lazy" src={originurl+mention.avatar} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                    </span>
                                    <div className="tiktok-4f7266-DivInfoContainer ewopnkv7">
                                        <p className="tiktok-15s5y80-PMentionInfoLine ewopnkv8">
                                            <span data-e2e="comment-at-nickname" className="tiktok-evv4sm-SpanInfoNickname ewopnkv9">{mention.name}</span>
                                                <span className="tiktok-14bueqa-SpanInfoVerify ewopnkv12">
                                                <svg className="tiktok-shsbhf-StyledVerifyBadge e1aglo370" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#20D5EC"></circle><path fillRule="evenodd" clipRule="evenodd" d="M37.1213 15.8787C38.2929 17.0503 38.2929 18.9497 37.1213 20.1213L23.6213 33.6213C22.4497 34.7929 20.5503 34.7929 19.3787 33.6213L10.8787 25.1213C9.70711 23.9497 9.70711 22.0503 10.8787 20.8787C12.0503 19.7071 13.9497 19.7071 15.1213 20.8787L21.5 27.2574L32.8787 15.8787C34.0503 14.7071 35.9497 14.7071 37.1213 15.8787Z" fill="white"></path></svg>
                                            </span>
                                        </p>
                                        <p className="tiktok-15s5y80-PMentionInfoLine ewopnkv8">
                                            <span data-e2e="comment-at-uniqueid" className="tiktok-ny41l3-SpanInfoUniqueId ewopnkv10">Bạn bè</span>
                                        </p>
                                    </div>
                                    <div onClick={(e)=>submit(e)} className="btn-action-chat">
                                        <div className="btn-submit">Gửi</div>
                                    </div>
                                </div>
                                
                            </div>
                        )}
                        </div>
                    </div>
                </form> 
            </div>
        </div>:''}
        </> 
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,
    datachat:state.datachat
});
export default connect(mapStateToProps,{actionchat})(Actionchat);
