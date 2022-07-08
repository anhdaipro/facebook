import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { headers, showactionport } from '../actions/auth';
import {dataURLtoFile,generateString,listitem} from "../constants"
import Inputsearch from '../hocs/Inputsearch';
import Addtags from './Addtag';
import { actionpostURL } from '../urls';
import {connect} from "react-redux"
const SetViewer=(props)=>{
    const {setviewer,viewer,listexcept,listspecific,setaction,post,actiondata,id,
    setlistspecific,setlistexcept,showactionport}=props
    const [state,setState]=useState({text:""})
    const [viewerdata,setViewerdata]=useState()
    useEffect(()=>{
        if(viewer){
            setViewerdata(viewer)
        }
    },[viewer])
    console.log(listexcept)
    
    return(
        <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
            <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
            <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
                <form className="tiktok-si5yni-FormPost ex8pc610">
                <div className="tiktok-i17c8h-DivFormHeader ex8pc612">  
                    {post=='create'?  
                    <div onClick={e=>{
                        setaction(actiondata=='editviewer'?'addviewer':'')
                        setState({...state,option:false})
                        }} aria-label="Quay lại" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tv7at329 thwo4zme tdjehn4e" role="button" tabindex="0">
                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-21px -46px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                    </div>:''}
                    <h4 data-e2e="report-card-title" class="tiktok-f8vded-H4FormTitle ex8pc615">{actiondata=='editviewer'?viewerdata?viewerdata.value=='3'?'Bạn bè ngoại trừ...':viewerdata.value=='5'?'Bạn bè cụ thể':'Chọn đối tượng':'':viewer.value=='3'?'Bạn bè ngoại trừ...':viewer.value=='5'?'Bạn bè cụ thể':'Chọn đối tượng'}</h4>
                    {post!='create'?
                    <div onClick={e=>setaction('')} data-e2e="report-card-cancel" class="tiktok-78z7l6-DivCloseButton ex8pc614">
                        <svg width="14" height="14" viewBox="0 0 9 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path></svg>
                    </div>:''}
                    
                </div>
               {state.option?
               <Addtags
                tags={viewerdata.value=='3'?listexcept:listspecific}
                object={viewerdata.value=='3'?'except':'specific'}
                setaction={(value)=>setaction(value)}
                action={actiondata}
                setviewer={(e,item)=>setviewer(e,item)}
                viewerdata={viewerdata}
                id={id}
                showactionport={data=>showactionport(data)}
                settags={data=>viewerdata.value=='3'?setlistexcept(data):setlistspecific(data)}
                listexcept={listexcept}
                listspecific={listspecific}
                setexcept={data=>setlistexcept(data)}
                setspecific={data=>setlistspecific(data)}
               />
                :
                <div className="tiktok-1n0ni8r-DivRadioWrapper ex8pc616">
                    {listitem.map(item=>
                        <div key={item.value} onClick={e=>{
                            if(!item.option){
                                setviewer(e,item)
                                setaction('')
                                if(id){
                                    let form=new FormData()
                                    form.append('action','editviewer')
                                    form.append('viewer',item.value)
                                    axios.post(`${actionpostURL}/${id}`,form,headers)
                                    .then(res=>{
                                        showactionport({id:id,viewer:item.value,action:''})
                                    })
                                }
                            }
                            else{
                                setaction('editviewer')
                                setViewerdata(item)
                                setState({...state,option:true})
                            }
                        }} data-visualcompletion="ignore-dynamic" style={{paddingLeft: '8px', paddingRight: '8px'}}>
                            <div aria-checked="true" aria-current="page" class="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb btwxx1t3 abiwlrkh p8dawk7l lzcic4wl ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi a8c37x1j i224opu6" role="radio" tabindex="0">
                                <div class="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 hpfvmrgz qt6c0cv9 jb3vyjys l9j0dhe7 du4w35lb bp9cbjyn btwxx1t3 dflh9lhu scb9dxdr nnctdnn4">
                                    <div class="j83agx80 cbu4d94t tvfksri0 aov4n071 bi6gxh9e l9j0dhe7 nqmvxvec">
                                        <div class="s45kfl79 emlxlaya bkmhp75w spb7xbtv bp9cbjyn rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv pq6dq46d taijpn5t l9j0dhe7 tdjehn4e cb02d2ww ljni7pan">
                                            <img class="hu5pjgll lzf7d6o1" src={item.src} alt="" height="24" width="24"/>
                                        </div>
                                    </div>
                                    <div class="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb bp9cbjyn btwxx1t3 l9j0dhe7">
                                        <div class="gs1a9yip ow4ym5g4 auili1gw rq0escxv j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz rz4wbd8a a8nywdso l9j0dhe7 du4w35lb rj1gh0hx pybr56ya f10w8fjw">
                                            <div class="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                                <div class="qzhwtbm6 knvmm38d">
                                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr ekzkrbhg oo9gr5id hzawbc8m" dir="auto">{item.name}</span>
                                                </div>
                                                <div class="qzhwtbm6 knvmm38d">
                                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw m9osqain hzawbc8m" dir="auto">{item.option && viewer.value==item.value?listexcept.length>0 &&  viewer.value=='3'?<>Bạn bè: Ngoại trừ {listexcept.map((friend,i)=><>{friend.name}{i<listexcept.length-2?', ':i==listexcept.length-2?' và ':''}</>)}</>:listspecific.length>0 ?<>{listspecific.map((friend,i)=><>{friend.name}{i<listspecific.length-2?', ':i==listspecific.length-2?' và ':''}</>)}</>:item.info:item.info}</span>
                                                </div>
                                            
                                            </div>
                                        </div>
                                        <div  class="n851cfcs ozuftl9m n1l5q3vz l9j0dhe7 o8rfisnq">
                                            <div  class="bp9cbjyn j83agx80 btwxx1t3">
                                                {!item.option?
                                                <i  data-visualcompletion="css-img" class="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: `${viewer && viewer.value==item.value?'-126px':'-147px'} -71px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                :<i data-visualcompletion="css-img" class="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '-133px -13px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>}
                </form>
            </div>
        </div>    
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,report:state.report,
    post:state.postaction
});
  
export default connect(mapStateToProps,{showactionport})(SetViewer);


