
import React, {useState,useCallback,useEffect,useRef} from 'react'
import {useNavigate,useSearchParams} from 'react-router-dom'
import axios from 'axios'
import { headers } from '../actions/auth'
const Tabs=(props)=>{
    const {url,setdata,choice,loading,setloading,setcount,listchoice,setchoice}=props
    const [params, setSearchParams] = useSearchParams();
    const tabs_ink =useRef()
    const parent =useRef()
    const children=useRef()
    const [left,setLeft]=useState(0)
    const [width,setWidth]=useState(0)
    useEffect(()=>{
        if(loading){
        setWidth(children.current.offsetWidth)
        
        }
    },[loading])
    return(
        <div className="tabs__nav px-1">  
            <div className="tabs__nav-warp">
                <div ref={parent} className="tabs__nav-tabs flex-1" style={{transform: 'translateX(0px)'}}>
                    {listchoice.map(item=>
                    <div ref={children} onClick={(e)=>{
                        setWidth(e.currentTarget.offsetWidth)
                        setLeft(e.currentTarget.offsetLeft)
                        setchoice(item.value)
                    }
                    } key={item.value} className={`tabs__nav-tab item-center flex-1 ${choice==item.value?'active':''}`} style={{whiteSpace: 'normal'}}>{item.name}</div>
                    )}
                </div> 
                <div ref={tabs_ink} className="tabs__ink-bar" style={{width: `${width}px`, transform: `translateX(${left}px)`}}></div>
                <div className="separator_nab"></div>
            </div> 
        </div> 
    )
}
export default Tabs