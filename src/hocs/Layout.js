import React, { useEffect,useState,useRef,useCallback } from 'react';
import { connect } from 'react-redux';
import { checkAuthenticated,login,expiry,headers} from '../actions/auth';
import {updateuseronlineURL} from "../urls"
import Message from "../containers/Chat" 
import Notification from "./Notification" 
import Report from '../containers/Report';
import axios from "axios"
import Turnoff from './Turnoff';
import SetViewer from '../users/Addviewer';
import Formpost from '../users/Formpost';
import Actionpostdetail from './Actionpostdetail';
import Actionchat from './Actionchat';
const Layout = ({children,checkAuthenticated,isAuthenticated,user,report,dataturnoff,post}) => {
    
    const [turnoff,setTurnoff]=useState()
    const [reportitem,setReport]=useState()
    const [viewer,setViewer]=useState()
    const [action,setAction]=useState()
    const [listexcept,setListexcept]=useState([])
    const [listspecific,setListspecific]=useState([])
    useEffect(()=>{
        if(report){
            setReport(report)
        }
    },[report])

    useEffect(()=>{
        if(post){
            setAction(post.action)
            if(post.action=='addviewer'){
            setListexcept(post.listexcept)
            setListspecific(post.listspecific)
            setViewer(post.viewer)
            }
        }
    },[post])

    useEffect(()=>{
        if(dataturnoff){
            setTurnoff(dataturnoff)
        }
    },[dataturnoff])

    const setreport=(data)=>{
        setReport(data)
    }
    const setviewer=(data)=>{
        setViewer(data)
    }
    useEffect(() => {
        (async ()=>{
            if(localStorage.token!='null'){
                checkAuthenticated()
            }
        })() 
       
    }, []);

    const onUnload=(e)=>{
        (async ()=>{
            if(expiry>0 && localStorage.token!='null'){
                let form =new FormData()
                form.append('online',false)
                axios.post(updateuseronlineURL,form,headers)
            }
        })()
    }
    

    const setaction=useCallback((data)=>{
        setAction(data)
    },[action])
    
    return (
        <>  
            {children}
            <div id="model"> 
                <Formpost
                />                                
                <Notification
                    user={user}
                />
                {reportitem && reportitem.show?
                <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
                    <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
                    <Report
                    data={reportitem}
                    setreport={(data=>setreport(data))}
                    />
                </div>
                :''}
                {turnoff && turnoff.show?
                <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
                    <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
                    <Turnoff
                    data={turnoff}
                    setturnoff={(data=>setTurnoff({...turnoff,...data}))}
                    />
                </div>
                :''}
            </div>
            {action=='addviewer' || action=='editviewer'?
                <SetViewer
                    viewer={viewer}
                    actiondata={action}
                    id={post.id}
                    setaction={(value)=>setaction(value)}
                    setviewer={(e,data)=>setviewer(e,data)}
                    setlistspecific={(data)=>setListspecific(data)}
                    setlistexcept={(data)=>setListexcept(data)}
                    listexcept={listexcept}
                    listspecific={listspecific}
                    post={'update'}
            />:''}

            {action=='post'?
            <Actionpostdetail
                setaction={(value)=>setaction(value)}
                datapost={post}
            />
            :''}
            <Message
            /> 
            
            <Actionchat/>
        </>
        
    );
};
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,report:state.report,
    dataturnoff:state.dataturnoff,post:state.postaction
});
export default connect(mapStateToProps,{checkAuthenticated})(Layout);
