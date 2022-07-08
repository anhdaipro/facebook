import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { headers } from '../actions/auth';
import {dataURLtoFile,generateString,listitem} from "../constants"
import Addtags from "../users/Addtag"
const Settingstory=(props)=>{
    const {user,setviewer,setaction,dataviewer,listexcept,listspecific,action,setlistexcept,setlistspecific}=props
    const [viewer,setViewer]=useState({name:"Công khai",info:"Mọi người trên hoặc ngoài Facebook",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/uaBHGktnPxt.png",option:false})
    useEffect(()=>{
        setViewer(dataviewer)
    },[dataviewer])
    return(
        <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
            <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
            <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
                <form className="tiktok-si5yni-FormPost ex8pc610">
                    <div className="tiktok-i17c8h-DivFormHeader ex8pc612">
                        <h4 data-e2e="report-card-title" class="tiktok-f8vded-H4FormTitle ex8pc615">Quyền riêng tư của tin</h4>
                    </div>
                    {viewer.value=='3'?
                    <Addtags
                        tags={viewer.value=='3'?listexcept:listspecific}
                        object={viewer.value=='3'?'except':'specific'}
                        setaction={(value)=>setaction(value)}
                        action={action}
                        setviewer={(e,item)=>setviewer(e,item)}
                        viewerdata={viewer}
                        settags={data=>viewer.value=='3'?setlistexcept(data):setlistspecific(data)}
                        listexcept={listexcept}
                        listspecific={listspecific}
                        setexcept={data=>setlistexcept(data)}
                        setspecific={data=>setlistspecific(data)}
                    />:
                    <div className="tiktok-1n0ni8r-DivRadioWrapper ex8pc616">
                        {listitem.filter(item=>item.story).map(item=>
                        <div onClick={e=>setViewer(item)} data-visualcompletion="ignore-dynamic" style={{paddingLeft: '8px', paddingRight: '8px'}}>
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
                                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v b1v8xokw m9osqain hzawbc8m" dir="auto">{item.info}</span>
                                                </div>
                                            
                                            </div>
                                        </div>
                                        <div  class="n851cfcs ozuftl9m n1l5q3vz l9j0dhe7 o8rfisnq">
                                            <div  class="bp9cbjyn j83agx80 btwxx1t3">
                                                {!item.option?
                                                <i  data-visualcompletion="css-img" class="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: `${viewer && viewer.name==item.name?'-126px':'-147px'} -71px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
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
                    {viewer.value=='3'?'':
                    <div class="rq0escxv p-8 l9j0dhe7 du4w35lb j83agx80 pfnyh3mw bkfpd7mw gs1a9yip owycx6da btwxx1t3 d1544ag0 tw6a2znq discj3wi dlv3wnog rl04r1d5 enqfppq2 muag1w35">
                        <div className="p-8">
                            <div onClick={e=>setaction()} className="border-6 btn btn-light p-0-20">
                                <span class="a8c37x1j knomaqxo  ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5 ojkyduve">Hủy</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div onClick={e=>{
                                setviewer(viewer)
                                setaction()
                            }} className="btn-primary btn p-0-20 border-6">
                                <span class="a8c37x1j bwm1u5wc ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5 ojkyduve">Lưu</span>
                            </div>
                        </div>
                    </div>  }               
                </form>
            </div>
        </div>
    )

}
export default Settingstory