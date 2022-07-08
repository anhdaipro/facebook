import { listemojipost } from "../constants"
import React,{useState,useEffect,useRef,useCallback} from 'react'
const Emotionpost=(props)=>{
    const {setaction,setemotion,emotion}=props
    const [state, setstate] = useState('')
    const [listitem,setListiem]=useState(listemojipost)
    
    return(
        <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
            <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
            <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
                <div className="tiktok-si5yni-FormPost ex8pc610">
                    <div className="tiktok-i17c8h-DivFormHeader ex8pc612">    
                        <div onClick={e=>setaction()} aria-label="Quay lại" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tv7at329 thwo4zme tdjehn4e" role="button" tabindex="0">
                            <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-21px -46px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                        </div>
                        <h4 data-e2e="report-card-title" class="tiktok-f8vded-H4FormTitle ex8pc615">Bạn đang cảm thấy thế nào?</h4>
                        <div  data-e2e="report-card-cancel" class="tiktok-78z7l6-DivCloseButton ex8pc614">
                            <svg width="14" height="14" viewBox="0 0 9 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path></svg>
                        </div>
                        
                    </div>
                    <div className="p-4-16">
                    <div class="k4urcfbm">
                        <div class="k4urcfbm j83agx80 bp9cbjyn">
                            <label class="lzcic4wl gs1a9yip br7hx15l h2jyy9rg n3ddgdk9 owxd89k7 rq0escxv j83agx80 a5nuqjux l9j0dhe7 k4urcfbm rz7trki1 b3i9ofy5">
                                <span class="ijkhr0an pvl4gcvk sgqwj88q bp9cbjyn j83agx80 g0qnabr5 hzruof5a h4z51re5">
                                    <svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 py1f6qlh gl3lb2sf hhz5lgdu"><g fill-rule="evenodd" transform="translate(-448 -544)"><g fill-rule="nonzero"><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg>
                                </span>
                                <input onChange={(e)=>setstate(e.target.value)} dir="ltr" aria-label="Tìm kiếm" role="textbox" placeholder="Tìm kiếm" autocomplete="off" spellcheck="false" aria-invalid="false" class="oajrlxb2 f1sip0of hidtqoto e70eycc3 hzawbc8m ijkhr0an pvl4gcvk sgqwj88q b1f16np4 hdh3q7d8 dwo3fsh8 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz br7hx15l h2jyy9rg n3ddgdk9 owxd89k7 rq0escxv oo9gr5id mg4g778l buofh1pr g5gj957u ihxqhq3m jq4qci2q hpfvmrgz lzcic4wl l9j0dhe7 iu8raji3 l60d2q6s p8fzw8mz hwnh5xvq pcp91wgn tv7at329 aj8hi1zk kd8v7px7 r4fl40cc m07ooulj mzan44vs" type="search" value={state.text}/>
                            </label>
                        </div>
                    </div>
                    </div>
                    <div className="facebook-DivRadioWrapper">
                    <ul className="facebook-list-emoji">
                        {listemojipost.filter(item=>item.name.indexOf(state)> -1).map((item,i)=>
                        <li onClick={e=>{
                            setemotion(item)
                            setaction('')
                        }} key={i} className="facebook-emoji">
                            <div className="facebook-item-emoji">
                                <div className="facebook-emoji-image"><img width='20' src={item.src}/></div>
                                <div className="facebook-emoji-name">{item.name}</div>
                            </div>
                        </li>
                        )}
                    </ul>
                    </div> 
                </div>
            </div>
        </div>
    )
}
export default Emotionpost