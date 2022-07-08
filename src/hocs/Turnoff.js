import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { headers, showreport } from '../actions/auth'
import {connect} from "react-redux"
import { actioncommentURL, actionpostURL,actionstoryURL } from '../urls'

const Turnoff=(props)=>{
    const {setturnoff,data}=props
    const submit=(e)=>{
        e.preventDefault()
        let form=new FormData()
        form.append('user_id',data.id)
        form.append('action','turnoff')
        axios.post(`${data.type=='comment'?actioncommentURL:data.type=='post'?actionpostURL:actionstoryURL}/${data.id}`,form,headers)
        .then(res=>{
            setturnoff({show:false})
        })      
    }
    return(
        <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
            <div className="tiktok-si5yni-FormPost ex8pc610">
                <div className="tiktok-i17c8h-DivFormHeader ex8pc612">
                   
                    <h4 data-e2e="report-card-title" class="tiktok-f8vded-H4FormTitle ex8pc615">Tắt tin của {data.name}?</h4>
                    <div onClick={()=>setturnoff({show:false})} data-e2e="report-card-cancel" class="tiktok-78z7l6-DivCloseButton ex8pc614">
                        <svg width="14" height="14" viewBox="0 0 9 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path></svg>
                    </div>
                    
                </div>
                <div className="p-16 flex flex-center ex8pc616">
                    Bạn sẽ không thấy tin của họ nữa nhưng vẫn là bạn bè.
                </div>
                <div className="bottom-fotter">
                    <div className="fotter-wrapper">
                        <div onClick={(e)=>submit(e)} className="p-4-8 border-6 nhd2j8a9 bwm1u5wc s1i5eluu mr-8">Tắt</div>
                        <div onClick={()=>setturnoff({show:false})} className="p-4-8 border-6 nhd2j8a9 a57itxjd tdjehn4e">Hủy</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Turnoff