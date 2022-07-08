import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { headers,expiry,updatenotify } from '../actions/auth';
import {uploadfileURL,originurl,uploadstoryURL, notifycationURL} from "../urls"

import {dataURLtoFile,generateString} from "../constants"
import Text from '../hocs/Text';
import Editor from '@draft-js-plugins/editor';
import {connect} from "react-redux"
import { EditorState,convertToRaw,Modifier } from 'draft-js';
import Draggable from "../hocs/useDraggable";
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';
import Cropper from 'react-cropper'; 
import Addword from "./Addword"
import 'cropperjs/dist/cropper.css';
import Storytext from "../hocs/Storytext"
import * as htmlToImage from 'html-to-image';
import Navbar from "../containers/Navbar"
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import io from "socket.io-client"
import Settingstory from '../hocs/Settingstory';
const Storycreate=(props)=>{
    const {user,updatenotify,count_notify_unseen}=props
    const [file,setFile]=useState({file:null,image:null})
    const inputfile=useRef(null)
    const [state,setState]=useState({edit:false,addtext:false,text:''})
    const [action,setAction]=useState()
    const navigate=useNavigate();
    const ref=useRef(null)
    const img=useRef()
    const socket =useRef()
    const [choice,setChoice]=useState()
    const textstory=useRef()
    const [notify,setNotify]=useState(0)
    const [listexcept,setListexcept]=useState([])
    const [listspecific,setListspecific]=useState([])
    const [viewer,setViewer]=useState({value:'1',name:"Công khai",info:"Mọi người trên hoặc ngoài Facebook",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/uaBHGktnPxt.png",option:false})
    const imgtext=useRef()
    const [listeditorState, setListeditorState] = useState([])
    const [styletext,setStyletext]=useState({id:0,name:"Gọn Gàng",color:"rgb(255, 255, 255)",font:"Facebook Stencil Viet App",src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089937/51653719_241165293466285_9014132538842546176_n_xggt4d.jpg'})
    const [offset, setOffset] = useState({ dx: 0, dy: 0,scale:1,rotate:0 });
    useEffect(() => { 
        socket.current=io.connect('https://server-socket-123.herokuapp.com')
        
        return () => socket.current.disconnect()
    },[count_notify_unseen,state,file])
    console.log(notify)
    console.log(count_notify_unseen)
    const previewFile=(e)=>{
        [].forEach.call(e.target.files, function(file) {
            if ((/image\/.*/.test(file.type))){
                setFile({...file,file:file,image:(window.URL || window.webkitURL).createObjectURL(file)})
            }
        })
    }
    
    const setstate=(data)=>{
        setState({...state,...data})
    }
    const setviewer=(data)=>{
        setViewer({...viewer,...data})
    }
    const setstyle=(data)=>{
        setStyletext({...styletext,...data})
    }
    const setoffset=(data)=>{
        const {dx,dy,scale}=data
		const scales={scale:scale<=0.2?0.2:scale>=2.2?2.2:scale}
        setOffset({...offset,...data,...scales})
    }

    const submit=(e)=>{
        (async ()=>{
            let form =new FormData()
            form.append('viewer',viewer.value)
            if(file.file!=null){
                parent.current.style.width='241.42px'
                htmlToImage.toCanvas(parent.current)
                .then(function(canvas) {
                    let image = canvas.toDataURL("image/png");
                    let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
                    form.append('file',file_preview)
                    form.append('duration',0)
                    axios.post(uploadstoryURL,form,headers)
                    .then(res=>{ 
                        const listusers=[{...res.data,...user}]
                        socket.current.emit("sendNotifi",listusers)
                    })
                });
            }
            else{
                htmlToImage.toCanvas(imgtext.current)
                .then(function(canvas) {
                const caption=JSON.stringify({'caption':state.text,'font':styletext.font,'id':styletext.id.toString()})
                form.append('caption',caption)
                let image = canvas.toDataURL("image/png");
                let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
                form.append('file',file_preview)
                form.append('duration',0)
                axios.post(uploadstoryURL,form,headers)
                .then(res=>{
                        const listusers=[{...res.data,...user}]
                        socket.current.emit("sendNotifi",listusers)
                    })
                })
            }
        })()
    }

    const addeditorState=(e)=>{
        setState({...state,addtext:true})
        setListeditorState([...listeditorState,{editorState:EditorState.createEmpty(),color:styletext.color,font:styletext.font,choice:true,name:"Gọn Gàng"}])
    }
    console.log(listeditorState)
    const setlisteditor=(data)=>{
        setListeditorState(data)
    }

    const setoffsetedit=(e)=>{
        setState({...state,edit:true})
        const data=listeditorState.map(editor=>{
            return({...editor,choice:false})
        })
        setListeditorState(data)
        
    }
    const parent=useRef()
    const setscale=(e)=>{
        const rects = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rects.left+10;
        const scale=(x/rects.width)*2.2<=0.2?0.2:(x/rects.width)*2.2>=2.2?2.2:(x/rects.width)*2.2
        
        setOffset({...offset,scale:scale})
        
    }
    console.log(styletext)
    return(
        <>
        <Navbar
        notify={notify}
        />
        <div className="kr520xx4 j9ispegn poy2od1o n7fi1qx3 i09qtzwb qsy8amke">
            <div className="j83agx80 cbu4d94t h3gjbzrl l9j0dhe7 du4w35lb qsy8amke" role="dialog">
                <div className="qypqp5cg poy2od1o byvelhso flex flex-center re5koujm kr520xx4 q676j6op tkr6xdv7">
                    <div onClick={()=>navigate(-1)} aria-label="Đóng" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 qypqp5cg q676j6op tdjehn4e" role="button" tabindex="0">
                        <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/c1SM8kb7vI5.png)`, backgroundPosition: '-126px -67px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                    </div>
                </div>
                
                <div className="rq0escxv pfnyh3mw jifvfom9 gs1a9yip owycx6da btwxx1t3 j83agx80 buofh1pr dp1hu0rb l9j0dhe7 du4w35lb">
                    <div aria-label="Dạng của quy trình tạo tin" role="navigation" className="rq0escxv l9j0dhe7 j83agx80 cbu4d94t d2edcug0 hpfvmrgz pfnyh3mw dp1hu0rb rek2kq2y o36gj0jk tkr6xdv7 hlyrhctz">
                        <div className="hybvsw6c cjfnh4rs j83agx80 cbu4d94t dp1hu0rb l9j0dhe7 kr520xx4 o36gj0jk spg0vajj aip8ia32 so2p5rfc hxa2dpaq">
                            <div className="q0erg9cb pfnyh3mw byvelhso"></div>
                            <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw i1fnvgqd bp9cbjyn owycx6da btwxx1t3 jei6r52m wkznzc2l n851cfcs dhix69tm">
                                <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t d2edcug0 hpfvmrgz rj1gh0hx buofh1pr g5gj957u">
                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw i1fnvgqd bp9cbjyn owycx6da btwxx1t3">
                                        <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz g5gj957u kud993qy buofh1pr">
                                            <div className="rq0escxv l9j0dhe7 du4w35lb qzhwtbm6">
                                                <div aria-label="Breadcrumb" role="navigation">
                                                    <div className="j83agx80 cbu4d94t mysgfdmx hddg9phg">
                                                        <div className="w0hvl6rk qjjbsfad">
                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr b1v8xokw oo9gr5id hzawbc8m" dir="auto"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="j83agx80 cbu4d94t q9se6cdp p984guvr">
                                                <div className="px9k8yfb hk9dxy2p">
                                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 qg6bub1s iv3no6db o0t2es00 f530mmz5 hnhda86s oo9gr5id hzawbc8m" dir="auto">
                                                        <h1 className="gmql0nx0 l94mrbxd p1ri9a11 lzcic4wl" tabindex="-1">Tin của bạn</h1>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div onClick={e=>setAction('addviewer')} aria-label="cài đặt" className="border-50 tv7at329 thwo4zme tdjehn4e flex flex-center item-center" role="button" tabindex="0">
                                            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yL/r/pGssOvcZiHe.png)`, backgroundPosition: '-21px -224px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>                                 
                                        </div>  
                                    </div>
                                </div>
                            </div>
                            <div className="rpm2j7zs k7i0oixp gvuykj2m j83agx80 cbu4d94t ni8dbmo4 du4w35lb q5bimw55 ofs802cu pohlnb88 dkue75c7 mb9wzai9 d8ncny3e buofh1pr g5gj957u tgvbjcpo l56l04vs r57mb794 kh7kg01d eg9m0zos c3g1iek1 l9j0dhe7 k4xni2cv">
                                <div className="j83agx80 cbu4d94t buofh1pr l9j0dhe7">
                                    <div className="ay7djpcl b5wmifdl hzruof5a pmk7jnqg rfua0xdk kr520xx4"></div>
                                    <div className="aov4n071 j83agx80 cbu4d94t buofh1pr">
                                        <div aria-label="Tin" className="buofh1pr cbu4d94t j83agx80" role="form">
                                            <div data-visualcompletion="ignore-dynamic" style={{paddingLeft: '8px', paddingRight: '8px'}}>
                                                <div className="ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi a8c37x1j">
                                                    <div className="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 hpfvmrgz qt6c0cv9 jb3vyjys l9j0dhe7 du4w35lb bp9cbjyn btwxx1t3 dflh9lhu scb9dxdr nnctdnn4">
                                                        <div className="j83agx80 cbu4d94t tvfksri0 aov4n071 bi6gxh9e l9j0dhe7 nqmvxvec">
                                                            <div className="q9uorilb l9j0dhe7 pzggbiyp du4w35lb">
                                                                <svg aria-hidden="true" className="pzggbiyp" data-visualcompletion="ignore-dynamic" role="none" style={{height: '60px', width: '60px'}}><mask id="jsc_c_r4"><circle cx="30" cy="30" fill="white" r="30"></circle></mask><g mask="url(#jsc_c_r4)"><image x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlinkHref={user?originurl+ user.avatar:''} style={{height: '60px', width: '60px'}}></image></g></svg>
                                                            </div>
                                                        </div>
                                                        <div className="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb bp9cbjyn btwxx1t3 l9j0dhe7">
                                                            <div className="gs1a9yip ow4ym5g4 auili1gw rq0escxv j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz rz4wbd8a a8nywdso l9j0dhe7 du4w35lb rj1gh0hx pybr56ya f10w8fjw">
                                                                
                                                                <div className="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                                                    <div className="qzhwtbm6 knvmm38d">
                                                                        <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr ekzkrbhg oo9gr5id hzawbc8m" dir="auto">{user?user.name:''}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="jei6r52m ay7djpcl bfjqzvhc"></div>
                                            <div className="k4urcfbm dati1w0a hv4rvrfc jifvfom9 g5gj957u buofh1pr cbu4d94t rj1gh0hx j83agx80 rq0escxv">
                                                {file.file!=null || choice=='text'?
                                                <div>
                                                    {file.file!=null?
                                                    <div onClick={e=>addeditorState(e)} className="oajrlxb2 g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl bp9cbjyn ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi e5d9fub0 jifvfom9 aov4n071 k4urcfbm" role="button" tabindex="0">
                                                        <div className="bp9cbjyn b3i9ofy5 br7hx15l h2jyy9rg n3ddgdk9 owxd89k7 j83agx80 qypqp5cg taijpn5t h676nmdw l9j0dhe7 q676j6op">
                                                            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/I-tqQnJ8R-d.png)`, backgroundPosition: '0px -85px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                        </div>
                                                        <div className="ozuftl9m l9j0dhe7">
                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr lrazzd5p oo9gr5id" dir="auto">Thêm văn bản</span>
                                                        </div>
                                                        <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                                                    </div>
                                                    :
                                                    <Storytext
                                                    setstate={data=>setstate(data)}
                                                    styletext={styletext}
                                                    setstyle={setstyle}
                                                    state={state}
                                                    />
                                                    }
                                                </div>
                                                :''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pwoa4pd7 mkhogb32 n7fi1qx3 datstx6m b5wmifdl pmk7jnqg kr520xx4 qgmjvhk0 art1omkt nw2je8n7 hhz5lgdu pyaxyem1" data-visualcompletion="ignore" data-thumb="1" style={{display: 'none', right: '0px', height: '541px'}}></div>
                                <div className="rq0escxv mkhogb32 n7fi1qx3 b5wmifdl jb3vyjys ph5uu5jm qt6c0cv9 b3onmgus hzruof5a pmk7jnqg kr520xx4 enuw37q7 dpja2al7 art1omkt nw2je8n7 hhz5lgdu" data-visualcompletion="ignore" data-thumb="1" style={{display: 'block', right: '0px', height: '0px'}}>
                                    <div className="oj68ptkr jk6sbkaj kdgqqoy6 ihh4hy1g qttc61fc datstx6m k4urcfbm"></div>
                                </div>
                            </div>
                            {file.file==null && choice!="text"?
                            <div className="c0wkt4kp kr520xx4 pmk7jnqg hzruof5a rm3jng1j i09qtzwb ie5zihkj sl8jk4me kd0sc8dh"></div>
                            :
                            <div className="tw6a2znq d1544ag0 i1fnvgqd rdkrh8wx btwxx1t3 j83agx80 kmp5kqmu cwj9ozl2 bp9cbjyn">
                                <div className="kkf49tns cgat1ltu qypqp5cg buofh1pr">
                                    <div aria-label="Bỏ" onClick={()=>{
                                        setFile({...file,file:null,image:null})
                                        setListeditorState([])
                                        setChoice('')
                                        setState({...state,text:'',addtext:false})
                                        setOffset({dx: 0, dy: 0,scale:1,rotate:0})
                                        }} className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                                        <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329">
                                            <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p a57itxjd" dir="auto">
                                                        <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Bỏ</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="kkf49tns cgat1ltu qypqp5cg buofh1pr">
                                    <div onClick={(e)=>submit(e)} aria-label="Chia sẻ lên tin" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                                        <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq s1i5eluu tv7at329">
                                            <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p bwm1u5wc" dir="auto">
                                                        <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Chia sẻ lên tin</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>    
                    </div>
                    
            
                    <div aria-label="Xem trước quy trình tạo tin" role="main" className="rq0escxv l9j0dhe7 du4w35lb cbu4d94t d2edcug0 hpfvmrgz rj1gh0hx buofh1pr g5gj957u j83agx80 dp1hu0rb">
                        <div className="j83agx80 cbu4d94t buofh1pr dp1hu0rb hpfvmrgz l9j0dhe7 du4w35lb">
                            <div className="dp1hu0rb d2edcug0 taijpn5t j83agx80 gs1a9yip">
                                <div className="k4urcfbm dp1hu0rb d2edcug0 cbu4d94t j83agx80 bp9cbjyn taijpn5t" role="main">
                                    {file.file==null&&choice!='text'?
                                    <div className="j83agx80 i1fnvgqd k4urcfbm" style={{maxWidth: '460px'}}>
                                        <input ref={inputfile} onChange={(e)=>previewFile(e)} accept="image/*,image/heif,image/heic" className="mkhogb32" type="file"/>
                                        <div aria-label="Tải ảnh lên" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql l9j0dhe7 abiwlrkh p8dawk7l lzcic4wl f86282pt" role="button" tabindex="0">
                                            <div onClick={e=>inputfile.current.click()} className="do00u71z l9j0dhe7 k4urcfbm" style={{paddingTop: '151.376%'}}>
                                                <div className="gs1a9yip ow4ym5g4 auili1gw j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">
                                                    <div className="bp9cbjyn i09qtzwb j83agx80 n7fi1qx3 cbu4d94t taijpn5t jm1wdb64 pmk7jnqg j9ispegn kr520xx4">
                                                        <div className="do00u71z k4urcfbm i09qtzwb n7fi1qx3 pmk7jnqg j9ispegn kr520xx4 ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi ni8dbmo4 stjgntxs" style={{paddingTop: '150%'}}>
                                                            <div className="gs1a9yip ow4ym5g4 auili1gw j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">
                                                                <i data-visualcompletion="css-img" className="i09qtzwb n7fi1qx3 pmk7jnqg j9ispegn kr520xx4" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/YH2hhKBxjWN.png)`, backgroundPosition: '0px 0px', backgroundSize: 'auto', width: '220px', height: '330px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                            </div>
                                                        </div>
                                                        <div className="bp9cbjyn o8rfisnq cwj9ozl2 s45kfl79 emlxlaya bkmhp75w spb7xbtv sz7gx65s j83agx80 qu8okrzs taijpn5t bi6gxh9e l9j0dhe7 eim337gk">
                                                            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/JP4tPjvtsBB.png)`, backgroundPosition: '0px -1039px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                        </div>
                                                        <div className="rq0escxv ljqsnud1 j83agx80 qo0gs2wv n3ffmt46 taijpn5t gl4o1x5y lt9micmv l9j0dhe7 oqcyycmt k4urcfbm">Tạo tin ảnh</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore" style={{borderRadius: '8px'}}></div>
                                        </div>
                                        <div onClick={()=>setChoice('text')} className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl f86282pt" role="button" tabindex="0">
                                            <div className="do00u71z l9j0dhe7 k4urcfbm" style={{paddingTop: '151.376%'}}>
                                                <div className="gs1a9yip ow4ym5g4 auili1gw j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">
                                                    <div className="bp9cbjyn i09qtzwb j83agx80 n7fi1qx3 cbu4d94t taijpn5t pmk7jnqg j9ispegn kr520xx4">
                                                        <div className="ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi datstx6m ni8dbmo4 stjgntxs pmk7jnqg k4urcfbm">
                                                            <div className="do00u71z l9j0dhe7 k4urcfbm" style={{paddingTop: '151.376%'}}>
                                                                <div className="gs1a9yip ow4ym5g4 auili1gw j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">
                                                                    <i data-visualcompletion="css-img" className="" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/YH2hhKBxjWN.png)`, backgroundPosition: '0px -331px', backgroundSize: 'auto', width: '220px', height: '330px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bp9cbjyn cwj9ozl2 s45kfl79 emlxlaya bkmhp75w spb7xbtv sz7gx65s j83agx80 qu8okrzs taijpn5t bi6gxh9e l9j0dhe7 eim337gk">
                                                            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y4/r/qgX_4AJkzdZ.png)`, backgroundPosition: '0px -50px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                        </div>
                                                        <div className="rq0escxv ljqsnud1 j83agx80 qo0gs2wv n3ffmt46 taijpn5t gl4o1x5y lt9micmv l9j0dhe7 oqcyycmt k4urcfbm">Tạo tin dạng văn bản</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore" style={{borderRadius: '8px'}}></div>
                                        </div>
                                    </div>
                                    :
                                    <div aria-label="Xem trước" className="cwj9ozl2 ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi kmp5kqmu rq0escxv j83agx80 cbu4d94t buofh1pr g5gj957u datstx6m gupp8or6 nzypyw8j frluczxc rdhfdfv2 tgvbjcpo ng3hk9f3 k9knd09w" role="region">
                                        <div className="taijpn5t j83agx80 bp9cbjyn">
                                            <div className="g5gj957u buofh1pr rj1gh0hx">
                                                <div className="l9j0dhe7 du4w35lb rq0escxv j83agx80 cbu4d94t pfnyh3mw d2edcug0 e5nlhep0 aodizinl">
                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo">
                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hv4rvrfc dati1w0a">
                                                            <div className="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                                                <div className="qzhwtbm6 knvmm38d">
                                                                    <h2 className="gmql0nx0 l94mrbxd p1ri9a11 lzcic4wl d2edcug0 hpfvmrgz" dir="auto">
                                                                        <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p oo9gr5id hzawbc8m" dir="auto">
                                                                            <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7" style={{ display: '-webkit-box'}}>Xem trước</span>
                                                                        </span>
                                                                    </h2>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                       
                                        <div className="stjgntxs dhix69tm sjgh65i0 wkznzc2l tr9rh885 buofh1pr rj1gh0hx j83agx80 jcgfde61 afxsp9o4 ed0hlay0 frvqaej8 mk2mc5f4 s44p3ltw ccm00jje goun2846 l82x9zwi uo3d90p7 pw54ja7n ue3kfks5 rj06g9kl qc3rp1z7 bv6zxntz t51s4qs2" tabindex="-1">
                                            <div className="j83agx80 l9j0dhe7 k4urcfbm buofh1pr">
                                                <div className="rq0escxv l9j0dhe7 du4w35lb qsy8amke io0zqebd m5lcvass fbipl8qg nwvqtn77 k4urcfbm ni8dbmo4 stjgntxs" style={{borderRadius: 'max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px'}}>
                                                    <div className="eg9m0zos ni8dbmo4 datstx6m">
                                                        <div  className="datstx6m">
                                                            {file.file!=null?
                                                                <div className="facebook-story-file-container">
                                                                    <div className="facebook-story-file-wrap">
                                                                        <div ref={parent} onClick={e=>setoffsetedit(e)} className="facebook-story-file" style={{width:`${state.edit?332:242}px`}}>
                                                                        
                                                                                <div  class="k4urcfbm pmk7jnqg stjgntxs ni8dbmo4 datstx6m" style={{width: `242px`}}><div class="k4urcfbm datstx6m" style={{backgroundImage: `linear-gradient(rgb(172, 150, 142) 0%, rgb(188, 144, 133) 100%)`}}></div></div>
                                                                                <Draggable 
                                                                                        classname="datstx6m pmk7jnqg"
                                                                                        offset={offset}
                                                                                        setoffset={(data)=>setoffset(data)}
                                                                                        children={
                                                                                            <div aria-label="Công cụ kéo hình ảnh đã tải lên" className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl datstx6m pmk7jnqg" role="button" tabindex="0">
                                                                                                <img alt="" style={{maxWidth:'auto'}} ref={img} class="datstx6m pmk7jnqg kfkz5moi cj5g2342" referrerpolicy="origin-when-cross-origin" src={file.image}/>
                                                                                            </div>
                                                                                        }
                                                                                />
                                                                                <div  class="facebbok-text-story">
                                                                                    {listeditorState.map((item,index)=>
                                                                                    <Addword
                                                                                            item={item}
                                                                                            index={index}
                                                                                            setoffset={(data)=>setoffset(data)}
                                                                                            setstate={data=>setstate(data)}
                                                                                            listeditorState={listeditorState}
                                                                                            setlisteditor={data=>setlisteditor(data)}
                                                                                            />
                                                                                        )}
                                                                                </div>
                                                                                
                                                                                <div class="pmk7jnqg hzruof5a datstx6m"><div class="hzruof5a datstx6m" style={{width: `242px`,margin:'auto'}}><div class="pmk7jnqg datstx6m rq0escxv ddn55etz todgtsvd mher9iwd okr6w53f l82x9zwi uo3d90p7 pw54ja7n ue3kfks5" style={{width: `242px`}}></div></div></div>
                                                                                <div className="pmk7jnqg hzruof5a" style={{width: `242px`,height: '100%'}}>
                                                                                    <div class="datstx6m pmk7jnqg k4urcfbm"></div>
                                                                                    <div class="datstx6m npl0935n du70xcb2 esmgwfdi g17sfo2o hzruof5a pmk7jnqg kfkz5moi cj5g2342 k4urcfbm" style={{borderLeft: `175.625px solid rgba(24, 25, 26, 0.5)`, borderRight: `175.625px solid rgba(24, 25, 26, 0.5)`, borderTop: `16px solid rgba(24, 25, 26, 0.5)`}}></div>
                                                                                </div>
                                                                        </div>
                                                                    <div className="facebook-story-action" style={{height: '52px'}}>
                                                                        <div  className={`scb9dxdr  sj5x9vvc dflh9lhu cxgpxx05 flex`}>
                                                                            <div onClick={()=>setOffset({...offset,scale:offset.scale/1.2})} aria-label="thu nhỏ hình ảnh" className={`oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi ${offset.scale<=0.2?'disabled':''} tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl`} role="button" tabindex="0">
                                                                                <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/FaIUvr-pXMT.png)`, backgroundPosition: '0px -17px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="k4urcfbm" style={{width: '193px'}}>
                                                                            <div 
                                                                                onMouseDown={e=>setState({...state,drag:true})} 
                                                                                onMouseUp={e=>setState({...state,drag:false})} 
                                                                                onMouseMove={e=>{
                                                                                    e.preventDefault()
                                                                                    if(!state.drag){
                                                                                        return
                                                                                    }
                                                                                    setscale(e)}
                                                                                }  
                                                                                onClick={(e)=>{
                                                                                    e.preventDefault()
                                                                                    setscale(e)
                                                                                }} 
                                                                                className="tojvnm2t a6sixzi8 k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y l9j0dhe7 iyyx5f41 a8s20v7p">
                                                                                <div className="cjfnh4rs nhd2j8a9 q9uorilb mw227v9j sj5x9vvc cxgpxx05 l9j0dhe7 gokke00a k4urcfbm" role="none">
                                                                                    <div className="pwoa4pd7 s8bnoagg bn9qtmzc hp05c5td b6jg2yqc a8c37x1j mw227v9j pmk7jnqg k4urcfbm"></div>
                                                                                    <div className="is6700om s8bnoagg bn9qtmzc hp05c5td b6jg2yqc a8c37x1j mw227v9j pmk7jnqg" style={{left: '0%', width: `${(offset.scale-0.2)/2*100>=100?100:offset.scale==0.2?0:(offset.scale-0.2)/2*100}%`}}></div>
                                                                                    <div className="o3lre8g0 gu00c43d sv5sfqaa l9j0dhe7">
                                                                                        <div aria-label="Thu phóng" aria-orientation="horizontal" aria-valuemax="2" aria-valuemin="0.2" aria-valuenow="1" aria-valuetext="1" className="oajrlxb2 gs1a9yip nhd2j8a9 j83agx80 mg4g778l cbu4d94t pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of du4w35lb q2y6ezfg qbxu24ho bxzzcbxg lxuwth05 h2mp5456 s45kfl79 emlxlaya bkmhp75w spb7xbtv goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 i09qtzwb ibrqsekg rq0escxv jnigpg78 e5bbllhu lzcic4wl pmk7jnqg kr520xx4 odw8uiq3" id="jsc_c_430" role="slider" tabindex="0" style={{left: `${(offset.scale-0.2)/2*100>=100?100:offset.scale==0.2?0:(offset.scale-0.2)/2*100}%`}}></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div  className={`scb9dxdr sj5x9vvc dflh9lhu cxgpxx05 flex`}>
                                                                            <div onClick={()=>setOffset({...offset,scale:offset.scale*1.2})} aria-label="phóng to hình ảnh" className={`oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l ${offset.scale>=2.2?'disabled':''} lzcic4wl`} role="button" tabindex="0">
                                                                                <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/3M5Zv5RmvSt.png)`, backgroundPosition: '0px -1203px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="h676nmdw">
                                                                            <div onClick={()=>setOffset({...offset,rotate:offset.rotate+90})} aria-label="Xoay" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                                                                                <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329">
                                                                                    <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                                                            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/I-tqQnJ8R-d.png)`, backgroundPosition: '0px -68px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                        </div>
                                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p a57itxjd" dir="auto">
                                                                                                <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Xoay</span>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                   
                                                                    </div>
                                                                </div>  
                                                            </div>:
                                                            <div  class="k4urcfbm kr520xx4 j9ispegn pmk7jnqg taijpn5t datstx6m cbu4d94t j83agx80 tqsryivl bp9cbjyn">
                                                                <div class="k4urcfbm kr520xx4 j9ispegn pmk7jnqg datstx6m tltl5a5h"></div>
                                                                <div ref={imgtext} class="dzlist6r msbwk0y7 pnx7fd3z ms05siws l9j0dhe7 stjgntxs ni8dbmo4 puxov6c6 r893ighp n1l5q3vz n851cfcs datstx6m btwxx1t3 j83agx80 l82x9zwi uo3d90p7 pw54ja7n ue3kfks5 g5ia77u1" style={{width: '266px'}}>
                                                                    <div class="r4lidvzm i09qtzwb n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">
                                                                        <img alt="" class="datstx6m k4urcfbm" crossorigin="anonymous" src={styletext.src}/>
                                                                            <div ref={textstory} class="j83agx80 buofh1pr iix1gpk6 taijpn5t l9j0dhe7 abiwlrkh czywrmwm datstx6m jb3vyjys kj0jemqk qt6c0cv9 d8o5xnl0 font-story" style={{fontFamily:styletext.font,position:'absolute',top:0}}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="j83agx80 iix1gpk6 taijpn5t l9j0dhe7 abiwlrkh czywrmwm datstx6m jb3vyjys kj0jemqk qt6c0cv9 d8o5xnl0 font-story" style={{font:styletext.font,color: 'rgb(255, 255, 255)'}}>
                                                                        <div class="oqq733wu d2edcug0 j83agx80">
                                                                                <div class="datstx6m taijpn5t km676qkl ad2k81qe myj7ivm5 f9o22wc5 stjgntxs jm1wdb64 ii04i59q k4urcfbm ssixshrq j83agx80 cbu4d94t ni8dbmo4 l9j0dhe7 c1et5uql">
                                                                                {state.text.trim()==""?"Bắt đầu nhập":
                                                                                <div class="pedkr2u6 oqcyycmt">{state.text}</div>}
                                                                                <div class="fdg1wqfs pfnyh3mw"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div id="modal">
            {state.addtext?
            <Text
                styletext={styletext}
                setstate={data=>setstate(data)}
                listeditorState={listeditorState}
                setlisteditor={data=>setlisteditor(data)}
            />:''}

            {action=='addviewer'?
            <Settingstory
            user={user}
            action={action}
            setaction={data=>setAction(data)}
            setstate={data=>setstate(data)}
            listexcept={listexcept}
            listspecific={listspecific}
            setviewer={data=>setviewer(data)}
            dataviewer={viewer}
            setlistspecific={(data)=>setListspecific(data)}
            setlistexcept={(data)=>setListexcept(data)}
            />:""}
        </div>
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,count_notify_unseen:state.count_notify_unseen
});
export default connect(mapStateToProps,{updatenotify})(Storycreate);
