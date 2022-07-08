import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { headers, showactionport } from '../actions/auth';
import {dataURLtoFile,generateString,listitem} from "../constants"
import { actionpostURL } from '../urls';
import {connect} from "react-redux"
import Timeoffer from "./Timeoffer"
const Actionpostdetail=(props)=>{
    const {setaction,id,datapost,showactionport}=props
    const [state,setState]=useState({addcollection:false,text:''})
    const [choice,setChoice]=useState()
    const [date,setDate]=useState({time:new Date(),hours:new Date().getHours(),minutes:new Date().getMinutes()})
    console.log(datapost)
    
    useEffect(()=>{
        if(datapost.type=='editday'){
            setDate({time:new Date(datapost.date),hours:new Date(datapost.date).getHours(),minutes:new Date(datapost.date).getMinutes()})
        }
    },[datapost])

    const addcollection=(e)=>{
        let form=new FormData()
        form.append('folder',state.text)
        form.append('action',datapost.type)
        axios.post(`${actionpostURL}/${datapost.id}`,form,headers)
        .then(res=>{
            setaction('')
            showactionport({saved:true,action:'',id:datapost.id})
        })
    }
    const setday=(name,value)=>{
        setDate({...date,[name]:value}); 
    }
    const savepost=(e)=>{
        let form=new FormData()
        form.append('save_id',choice)
        form.append('action',datapost.type)
        axios.post(`${actionpostURL}/${datapost.id}`,form,headers)
        .then(res=>{
            setaction('')
            showactionport({saved:true,action:'',id:datapost.id})
        })
    }
    const editday=(e)=>{
        if(new Date(date.time.toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).substr(0,10)+' '+('0'+date.hours).slice(-2)+':'+("0"+date.minutes).slice(-2)).getTime()>new Date().getTime()){
            alert("Vui lòng chọn thời gian nhỏ hơn thời gian hiện tại")
        }
        else{
            let form=new FormData()
            form.append('date',date.time.toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).substr(0,10)+' '+('0'+date.hours).slice(-2)+':'+("0"+date.minutes).slice(-2))
            form.append('action',datapost.type)
            axios.post(`${actionpostURL}/${datapost.id}`,form,headers)
            .then(res=>{
                setaction('')
                showactionport({posted:date.time.toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).substr(0,10)+' '+('0'+date.hours).slice(-2)+':'+("0"+date.minutes).slice(-2),action:'',id:datapost.id})
            })
        }
    }
    return(
        <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
            <div className="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
            <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
                <form className="tiktok-si5yni-FormPost ex8pc610">
                <div className="tiktok-i17c8h-DivFormHeader ex8pc612 linmgsc8">  
                    <h4 data-e2e="report-card-title" className="tiktok-f8vded-H4FormTitle ex8pc615">{datapost.type=='savepost'?"Luu vao":'Chỉnh sửa ngày'}</h4>
                    <div onClick={e=>setaction('')} data-e2e="report-card-cancel" className="tiktok-78z7l6-DivCloseButton ex8pc614">
                        <svg width="14" height="14" viewBox="0 0 9 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path></svg>
                    </div>
                </div>
                <div className={`tiktok-1n0ni9r-DivRadioWrapper ex8pc616`}>
                    
                        {datapost.type=='savepost'?<>
                        <div className="linmgsc8">
                        {datapost.collections.map(item=>
                        <div onClick={e=>setChoice(item.id)} key={item.id} data-visualcompletion="ignore-dynamic" style={{paddingLeft: '8px', paddingRight: '8px'}}>
                            <div aria-checked="true" aria-current="page" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb btwxx1t3 abiwlrkh p8dawk7l lzcic4wl ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi a8c37x1j i224opu6" role="radio" tabindex="0">
                                <div className="flex-center ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 hpfvmrgz qt6c0cv9 jb3vyjys l9j0dhe7 du4w35lb bp9cbjyn btwxx1t3 dflh9lhu scb9dxdr nnctdnn4">
                                    <div className="j83agx80 cbu4d94t tvfksri0 aov4n071 bi6gxh9e l9j0dhe7 nqmvxvec">
                                        <div className="s45kfl79 emlxlaya bkmhp75w spb7xbtv bp9cbjyn rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv pq6dq46d taijpn5t l9j0dhe7 tdjehn4e cb02d2ww ljni7pan">
                                            <img className="hu5pjgll lzf7d6o1" src={item.src} alt="" height="24" width="24"/>
                                        </div>
                                    </div>
                                    <div className="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb bp9cbjyn btwxx1t3 l9j0dhe7">
                                        <div className="gs1a9yip ow4ym5g4 auili1gw rq0escxv j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz rz4wbd8a a8nywdso l9j0dhe7 du4w35lb rj1gh0hx">
                                            <div className="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                                <div className="qzhwtbm6 knvmm38d">
                                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr ekzkrbhg oo9gr5id hzawbc8m" dir="auto">{item.folder}</span>
                                                </div>
                                                <div className="d3f4x2em iv3no6db qzhwtbm6 knvmm38d">
                                                    <span className="">
                                                   
                                                   
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                        {item.viewer=='4'?
                                                        <g xmlns="http://www.w3.org/2000/svg"><path d="M500,108c148.8,0,269.5,120.7,269.5,269.5h98C867.5,174.5,703,10,500,10c-203,0-367.5,164.5-367.5,367.5h98C230.5,228.7,351.2,108,500,108z"/><path d="M879.8,408.1H120.2c-27.1,0-49,21.9-49,49V941c0,27.1,21.9,49,49,49h759.5c27.1,0,49-21.9,49-49V457.1C928.8,430.1,906.8,408.1,879.8,408.1z M426.3,841.7l42.1-159.7c-21.2-11.4-35.8-33.4-35.8-59.2c0-37.2,30.1-67.4,67.4-67.4c37.2,0,67.4,30.2,67.4,67.4c0,25.7-14.6,47.8-35.7,59.1l42.1,159.8H426.3z"/><path d="M500,500"/></g>:
                                                        <g><path d="M602.4,558.7H397.6C222.2,558.7,80,708.5,80,892.9v21.5c0,75.5,142.1,75.6,317.6,75.6h204.9c175.3,0,317.6-2.8,317.6-75.6v-21.5C920,708.5,777.8,558.7,602.4,558.7L602.4,558.7z M251.9,264.8c0-33.4,6.4-66.7,18.9-97.5c12.4-30.8,30.8-59.1,53.8-82.6C347.5,61,375,42.1,405,29.4c30-12.8,62.5-19.4,95-19.4c32.5,0,64.9,6.6,95,19.4c30,12.7,57.5,31.6,80.5,55.2c23,23.6,41.3,51.8,53.8,82.6c12.4,30.8,18.9,64.2,18.9,97.5s-6.4,66.7-18.9,97.5c-12.4,30.8-30.8,59.1-53.8,82.6c-23,23.6-50.5,42.5-80.5,55.2c-30,12.8-62.5,19.4-95,19.4c-32.5,0-64.9-6.7-95-19.4c-30-12.8-57.5-31.6-80.5-55.2c-23-23.5-41.3-51.8-53.8-82.6C258.3,331.4,251.9,298.1,251.9,264.8L251.9,264.8z"/></g>
                                                        }
                                                    </svg>
                                                    <span class="ggphbty4">Chỉ {item.viewer=='4'?'Mình tôi':'người đóng góp'}</span>
                                                    </span>
                                                
                                                </div>
                                            </div>
                                        </div>
                                        <div  className="n851cfcs ozuftl9m n1l5q3vz l9j0dhe7 o8rfisnq">
                                            <div  className="bp9cbjyn j83agx80 btwxx1t3"> 
                                                <i  data-visualcompletion="css-img" className="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: `${choice==item.id?'-126px':'-147px'} -71px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                        </div>
                        {!state.addcollection?
                        <div data-visualcompletion="ignore-dynamic" style={{paddingLeft: '8px', paddingRight: '8px'}}>
                            <div onClick={e=>setState({...state,addcollection:true})} aria-checked="true" aria-current="page" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb btwxx1t3 abiwlrkh p8dawk7l lzcic4wl ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi a8c37x1j i224opu6" role="radio" tabindex="0">
                                <div className="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 hpfvmrgz qt6c0cv9 jb3vyjys l9j0dhe7 du4w35lb bp9cbjyn btwxx1t3 dflh9lhu scb9dxdr nnctdnn4">
                                    <div className="j83agx80 cbu4d94t tvfksri0 aov4n071 bi6gxh9e l9j0dhe7 nqmvxvec">
                                    <div className="ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi bp9cbjyn rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv pq6dq46d taijpn5t l9j0dhe7 tdjehn4e m7zwrmfr tmrshh9y"><i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/ovRvY1IFzAV.png)`, backgroundPosition: '0px -225px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i></div>
                                    </div>
                                    <div className="flex-center ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb bp9cbjyn btwxx1t3 l9j0dhe7">
                                        <div className="gs1a9yip ow4ym5g4 auili1gw rq0escxv j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz rz4wbd8a a8nywdso l9j0dhe7 du4w35lb rj1gh0hx pybr56ya f10w8fjw">
                                            <div className="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                                <div className="qzhwtbm6 knvmm38d">
                                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr ekzkrbhg oo9gr5id hzawbc8m" dir="auto">Bộ sưu tập mới</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>:
                        <div className="l9j0dhe7 dati1w0a f10w8fjw hv4rvrfc pybr56ya">
                            <label className="jq4qci2q oo9gr5id">
                                <div className="ae35evdt mb-8 l94mrbxd a8c37x1j gmql0nx0">Tên</div>
                                <input onChange={e=>setState({...state,text:e.target.value})} dir="ltr" minLength='3' maxLength="40" placeholder="Đặt tên cho bộ sưu tập của bạn..." aria-invalid="false" className="oajrlxb2 f1sip0of hidtqoto e70eycc3 lzcic4wl b3i9ofy5 l6v480f0 maa8sdkg s1tcr66n aypy0576 beltcj47 p86d2i9g aot14ch1 kzx2olss rq0escxv oo9gr5id l94mrbxd ekzkrbhg cxgpxx05 d1544ag0 sj5x9vvc tw6a2znq k4urcfbm o8yuz56k duhwxc4d bs68lrl8 f56r29tw e16z4an2 ei4baabg b4hei51z ehryuci6 hzawbc8m tv7at329" type="text" value={state.text}/>
                            </label>
                            <div className="jktsbyx5 gl3lb2sf"></div>
                            <div aria-hidden="true" className="flex item-end l6v480f0 ">
                                <div onClick={(e)=>addcollection(e)} aria-disabled="true" aria-label="Tạo" className={`${state.text.length<3?'disabled':''} btn-primary border-6 mr-8 flex-center item-center`} role="button" tabindex="-1">    
                                    <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Tạo</span>
                                </div>            
                                <div onClick={()=>setState({...state,addcollection:false})} aria-label="Hủy" className="flex flex-center item-center border-6 btn-light" role="button" tabindex="0">
                                <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Huy</span>
                                </div>
                            </div>
                        </div>}
                        </>:
                        <div style={{height:'60vh'}}>
                            <div>Nội dung này sẽ xuất hiện ở đâu trên dòng thời gian của bạn?</div>
                            <Timeoffer
                                date={date}
                                setday={(name,value)=>setday(name,value)}
                            />
                        </div>}
                    </div>
                    {state.addcollection?'':
                    <div className='p-1'>
                    <div aria-hidden="true" className="flex item-end l6v480f0">
                        <div onClick={(e)=>{
                            if(datapost.type=='savepost'){
                                savepost(e)
                            }
                            else{
                                editday(e)
                            }
                        }} aria-disabled="true" aria-label="Tạo" className={`${choice || (datapost.type=='editday' && new Date(datapost.date).getTime()!==new Date(date.time.toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).substr(0,10)+' '+('0'+date.hours).slice(-2)+':'+("0"+date.minutes).slice(-2)).getTime())? '':'disabled'} btn-primary border-6 flex-center item-center`} role="button" tabindex="-1">    
                            <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Xong</span>
                        </div>                   
                    </div>
                    </div>}
                </form>
            </div>
        </div>    
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,
    post:state.postaction
});
  
export default connect(mapStateToProps,{showactionport})(Actionpostdetail);


