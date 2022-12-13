import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { headers,uploadpost } from '../actions/auth';
import {dataURLtoFile,generateString, listbackgroundpost, listemojipost, listitem} from "../constants"
import Editor from '@draft-js-plugins/editor';
import { EditorState,convertToRaw,Modifier, ContentState } from 'draft-js';
import { actionpostURL, listfriendURL, originurl,uploadpostURL } from '../urls';
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';
import Addtags from './Addtag';
import Fileedit from './Editfile';
import SetViewer from './Addviewer';
import Emotionpost from '../hocs/Emotionpost';
import EmojiPicker from '../hocs/EmojiPicker';
import {connect} from "react-redux"
import io from "socket.io-client"
const Formpost=(props)=>{
    const {user,setstate,uploadpost,datapost}=props
    const [state,setState]=useState({edit:false,text:'',show_background:false})
    const ref=useRef(null)
    const socket=useRef()
    const[show,setShow]=useState(false)
    const [action,setAction]=useState('')
    const fileadd=useRef(null)
    const [tags,setTags]=useState([])
    const [emotion,setEmotion]=useState()
    const [background,setBackground]=useState()
    const [viewer,setViewer]=useState({value:'1',name:"Công khai",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/uaBHGktnPxt.png"})
    const fileinput=useRef(null)
    const [listfile,setListfile]=useState([])
    const [showemoji,setShowemoji]=useState(false)
    const [listexcept,setListexcept]=useState([])
    const [listspecific,setListspecific]=useState([])
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    useEffect(() => { 
        socket.current=io.connect('https://web-production-e133.up.railway.app')
    },[])

    useEffect(()=>{
        if(datapost){
            setShow(datapost.show)
            if(datapost.addemotion){
                setAction('emotion')
            }
            if(datapost.addfile){
                setState({...state,addfile:true})
            }
            if(datapost.listexcept){
                setListexcept(datapost.listexcept)
            }
            if(datapost.listspecific){
                setListspecific(datapost.listspecific)
            }
            if(datapost.fileupload){
                const listfilepost=datapost.fileupload.map(item=>{
                    return({...item,pre_note:item.note,listimages:[],tags:JSON.parse(item.tags),media:item.media,media_preview:item.media_preview?item.media_preview:null})
                })
                setListfile(listfilepost)
            }
            if(datapost.viewer){
                setViewer({value:datapost.viewer,src:listitem.find(item=>item.value==datapost.viewer).src,name:listitem.find(item=>item.value==datapost.viewer).name})
            }
            if(datapost.tags){
                setTags(datapost.tags)
            }
            if(datapost.emotion){
            setEmotion({src:datapost.emotion,name:listemojipost.find(item=>item.src==datapost.emotion).name})
            }
            if(datapost.caption){
                const initialContent = JSON.parse(datapost.caption).caption;
                setEditorState(EditorState.createWithContent(ContentState.createFromText(initialContent)))
                if(JSON.parse(datapost.caption).background){
                setBackground(JSON.parse(datapost.caption).background)
                }
            }
        }
    },[datapost])
    
    const setshowemoji=(data)=>{
        setShowemoji(data)
    }

    const setaddkey=(e,text)=>{  
        setEditorState(insertText(text, editorState));
    }
    const insertText = (text, editorValue) => {
        const currentContent = editorValue.getCurrentContent();
        const currentSelection = editorValue.getSelection();
        const newContent = Modifier.replaceText(
        currentContent,
        currentSelection,
        text
    );
        const newEditorState = EditorState.push(
        editorValue,
        newContent,
        "insert-characters"
        );
        return EditorState.forceSelection(
        newEditorState,
        newContent.getSelectionAfter()
        );
    };
    const { MentionSuggestions, plugins } = useMemo(() => {
        const mentionPlugin = createMentionPlugin({
          entityMutability: 'IMMUTABLE',
          supportWhitespace: true,
        });
        console.log(editorState)
        // eslint-disable-next-line no-shadow
        const { MentionSuggestions } = mentionPlugin;
        // eslint-disable-next-line no-shadow
        const plugins = [mentionPlugin];
            return { plugins, MentionSuggestions };
    }, []);

    const onChange = (editorState) => {
        setEditorState(editorState);
        console.log(editorState)
    }
    let list_video=[]
    let list_image=[]
  
    const previewFile=(e)=>{
        [].forEach.call(e.target.files, function(file) {
            if ((/image\/.*/.test(file.type))){  
                list_image.push({tags:[],note:"",filetype:'image',file:file,duration:0,
                media:(window.URL || window.webkitURL).createObjectURL(file)})
                const list_file=[...listfile,...list_image,...list_video]
                setListfile(list_file)
            }
            else{ 
               
                var url = (window.URL || window.webkitURL).createObjectURL(file);
                var video = document.createElement('video');
                var timeupdate = function() {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                    video.pause();
                  }
                };
                video.addEventListener('loadeddata', e =>{
                        
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                  }
                });
                let snapImage = function() {
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                let image = canvas.toDataURL("image/png");
                let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
                let success = image.length > 100000;
                if (success) {
                    list_video.push({tags:[],note:"",filetype:'video',listimages:[],
                    file:file,file_preview:file_preview,media:url,duration:video.duration,
                    media_preview:(window.URL || window.webkitURL).createObjectURL(file_preview)})
                    const list_file=[...listfile,...list_image,...list_video]
                    setListfile(list_file)
                }
                  return success;
                };
                video.addEventListener('timeupdate', timeupdate);
                video.preload = 'metadata';
                video.src = url;
                // Load video in Safari / IE11
                video.muted = true;
                video.playsInline = true;
                video.play();
                }
            })
        
        function remURL() {(window.URL || window.webkitURL).revokeObjectURL(this.src)}
    }

    const settags=(data)=>{
        setTags(data)
    }
    
    const setviewer=(e,data)=>{
        setViewer(data)
    }
    const setfiles=(data)=>{
        setListfile(data)
    }
    const setlistfile=useCallback((e,itemchoice,name,value)=>{
        const listfiles=listfile.map(item=>{
            if(item.media==itemchoice.media){
                return({...item,[name]:value})
            }
            return({...item})
        })
        setListfile(listfiles)
    },[listfile])

    const listtagfiles =listfile.filter(item=>item.tags && item.tags.length>0).reduce((result, value, i) => {
        let key = value.tags.map(item=>{
            return(item)
        })
        return [...result,...key]
    }, [])
    
    const listtagpost=tags.map(tag=>{
        return tag
    })
    
    const list_tags=[...listtagpost,...listtagfiles]
    const unique = [...new Map(list_tags.map(item =>[item['id'], item])).values()]
    console.log(unique)    
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const submit= async ()=>{
        let list_tag_notification=[]
        let form=new FormData()
        form.append('viewer',viewer.value)
        if(viewer.value=='3' || viewer.value=='6'){
            listexcept.map(item=>{
                form.append('except_id',item.id)
            })
        }
        if(viewer.value=='5' || viewer.value=='6'){
            listspecific.map(item=>{
                form.append('specific_id',item.id)
            })
        }
        listfile.map(item=>{ 
            if(item.id){
                form.append('fileupdate_id',item.id)
                if(item.file_preview){
                    form.append('filevideoupdate_id',item.id)
                    form.append('videoupdate',item.file_preview)
                }
                else{
                    form.append('notefileupdate',item.note)
                    form.append('tagfileupdate',JSON.stringify(item.tags))
                }
            }
            else{
                if(!item.file_preview){
                    form.append('image',item.file)
                    form.append('noteimage',item.note)
                    form.append('tagfile',JSON.stringify(item.tags))
                }
                if(item.file_preview){
                    form.append('video',item.file)
                    form.append('notevideo',item.note)
                    form.append('video_preview',item.file_preview)
                    form.append('duration',item.duration)
                }
            }
            const tagfile=item.tags
            if(tagfile&&tagfile.length>0){
                tagfile.map(tag=>{
                    form.append('tag',tag.id)
                    list_tag_notification.push({receiver_id:tag.id,notification_type:4,post:true,...user})
                })
            }
        })

        tags.map(item=>{
            form.append('tag',item.id)
            list_tag_notification.push({receiver_id:item.id,notification_type:4,post:true,...user})
        })
        const data={caption:rawContentState.blocks[0].text,background:background}
        form.append('caption',JSON.stringify(data))
        form.append('emotion',emotion?emotion.src:'')
        if(datapost.id){
            form.append('action','update')
        }
        const res= await axios.post(datapost.id?`${actionpostURL}/${datapost.id}`:uploadpostURL,form,headers)
        setShow(false)
        socket.current.emit('sendNotifi',list_tag_notification)
        
    }
    return(
        <>
        {show?
            <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
                <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
                <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">         
                    {action==''?
                    <form className="tiktok-si5yni-FormPost ex8pc610">  
                        <div className="j83agx80 cbu4d94t f0kvp8a6 mfofr4af l9j0dhe7 oh7imozk ij1vhnid smbo3krw">
                            <div>
                                <div className="l9j0dhe7">
                                    <div className="taijpn5t cb02d2ww j83agx80 rq0escxv linmgsc8 bp9cbjyn">
                                        <h2 className="gmql0nx0 l94mrbxd p1ri9a11 lzcic4wl d2edcug0 hpfvmrgz" dir="auto">
                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 ns63r2gh rwim8176 o3w64lxj b2s5l15y hnhda86s oo9gr5id" dir="auto" id="jsc_c_55">
                                                <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5 r8blr3vg">{action=='tags'?'':'Tạo bài viết'}</span>
                                            </span>
                                        </h2>
                                    </div>
                                    <div onClick={e=>setShow(false)} className="fcg2cn6m pmk7jnqg cypi58rs">
                                        <div aria-label="Đóng" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tv7at329 thwo4zme tdjehn4e" role="button" tabindex="0">
                                            <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '0px -92px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                            <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                                        </div>
                                    </div>
                                
                                </div>
                                <div className="a8nywdso ihqw7lf3 rz4wbd8a discj3wi dhix69tm wkznzc2l j83agx80 bp9cbjyn">
                                    <div className="g9en0fbe">
                                        <a aria-label="Dòng thời gian của Nguyễn Trãi" className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l lzcic4wl oo9gr5id q9uorilb" href="https://www.facebook.com/profile.php?id=100081673677422&amp;__tn__=%3C" role="link" tabindex="0">
                                            <div className="q9uorilb l9j0dhe7 pzggbiyp du4w35lb">
                                                <svg aria-hidden="true" className="pzggbiyp" data-visualcompletion="ignore-dynamic" role="none" style={{height: '40px', width: '40px',borderRadius:'50%',border:'1px solid gainsboro'}}><mask id="jsc_c_59"><circle cx="20" cy="20" fill="white" r="20"></circle></mask><g mask="url(#jsc_c_59)"><image x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlinkHref={user.avatar} style={{height: '40px', width: '40px',borderRadius:'50%',border:'1px solid gainsboro'}}></image></g></svg>
                                                <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="cbu4d94t j83agx80">
                                        
                                        <div class="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                            <div class="qzhwtbm6 knvmm38d">
                                                <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v ekzkrbhg oo9gr5id hzawbc8m" dir="auto">
                                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh jq4qci2q a3bd9o3v lrazzd5p oo9gr5id">
                                                        {user.name}
                                                        {emotion?<span> đang <span class="gwewmpg2 l9j0dhe7 cgat1ltu">
                                                        <img height="16" width="16" alt="" referrerpolicy="origin-when-cross-origin" src={emotion.src}/></span>cảm thấy 
                                                        <div class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gpro0wi8 oo9gr5id lrazzd5p" role="button" tabindex="0">
                                                        <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh jq4qci2q a3bd9o3v lrazzd5p oo9gr5id"> {emotion.name}</span>
                                                        </div></span>:''}
                                                        {unique.map((item,i)=><>
                                                        {i==0?' cùng với ':i>0 && i<unique.length-1?', ':i==unique.length-1?' và ':''}
                                                        <div key={item.id} class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gpro0wi8 oo9gr5id lrazzd5p" role="button" tabindex="0">
                                                            <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh jq4qci2q a3bd9o3v lrazzd5p oo9gr5id">{item.name}</span>
                                                        </div>
                                                        </>
                                                        )}
                                                    </span> 
                                                    
                                                </span>
                                            </div>
                                        </div>
                                        
                                        
                                        <div className="dbvibxzo">
                                            <div className="j83agx80 bp9cbjyn">
                                                <div className="taijpn5t pq6dq46d bp9cbjyn">
                                                    <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                        <div aria-label="Chỉnh sửa quyền riêng tư. Đang chia sẻ với Bạn bè của bạn. " className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi lrazzd5p oo9gr5id" dir="auto">
                                                                <div className="l9j0dhe7">
                                                                    <div className="tdjehn4e beltcj47 p86d2i9g aot14ch1 kzx2olss dflh9lhu scb9dxdr ecm0bbzt e5nlhep0 lzcic4wl">
                                                                        <div onClick={(e)=>{
                                                                            
                                                                            setAction('addviewer')}} className="bp9cbjyn j83agx80 taijpn5t">
                                                                            <div aria-hidden="true" className="taijpn5t pq6dq46d bp9cbjyn cgat1ltu">
                                                                                <img className="hu5pjgll lzf7d6o1" src={viewer.src} alt="Bạn bè" height="12" width="12"/>
                                                                            </div>
                                                                            <span className="l3itjdph cgat1ltu">{viewer.name}</span>
                                                                            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '-130px -130px', backgroundSize: 'auto', width: '12px', height: '12px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                                
                                </div>
                            </div>
                            <div className="rpm2j7zs k7i0oixp gvuykj2m ni8dbmo4 du4w35lb q5bimw55 ofs802cu pohlnb88 dkue75c7 mb9wzai9 l56l04vs r57mb794 l9j0dhe7 kh7kg01d eg9m0zos c3g1iek1 j83agx80 cbu4d94t buofh1pr">
                                <div className="j83agx80 cbu4d94t buofh1pr l9j0dhe7">
                                    <div style={{backgroundImage:`url(${background?background.src:''})`,minHeight: `${background?'295.833px':''}`}} className="o6r2urh6 buofh1pr datstx6m l9j0dhe7 k4urcfbm" role="presentation">
                                        <div className={`${background?'input-caption-div':'input-div'}`}> 
                                            <div onClick={()=>ref.current.focus()} data-e2e="comment-input" className="tiktok-1vwgyq9-DivInputAreaContainer e1npxakq2">    
                                                <div  data-e2e="comment-text" className="tiktok-qpucp9-DivInputEditorContainer e1npxakq3">
                                                    <Editor
                                                        editorKey={'editor'}
                                                        editorState={editorState}
                                                        onChange={onChange}
                                                        plugins={plugins}
                                                        ref={ref}
                                                        placeholder={`${user.name} ơi, bạn đang nghĩ gì thế?`}
                                                    />            
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="i09qtzwb rq0escxv rm21btxo d1544ag0 dati1w0a pmk7jnqg j9ispegn">
                                            {!state.addfile?
                                            <div className="k4urcfbm j83agx80 rq0escxv gs1a9yip">
                                                {!state.show_background?
                                                <div onClick={e=>{setState({...state,show_background:true})
                                                    setBackground()
                                                }} aria-label="Hiển thị các tùy chọn phông nền" className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                    <span className="hop8lmos rl04r1d5">
                                                        <img height="38" alt="" referrerpolicy="origin-when-cross-origin" src="https://www.facebook.com/images/composer/SATP_Aa_square-2x.png"/>
                                                    </span>
                                                </div>:
                                                <div className="flex flex-center">
                                                    
                                                    <div onClick={e=>setState({...state,show_background:false})} class="bsnbvmp4 taijpn5t k7cz35w2 j83agx80 l82x9zwi uo3d90p7 pw54ja7n ue3kfks5 g6srhlxm bp9cbjyn c87oxz0k">
                                                        <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-152px -88px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                    </div>
                                                    {listbackgroundpost.map(item=>
                                                    <div onClick={()=>setBackground(item)} className="ml-8" style={{minWidth:'32px',height:'32px'}}>
                                                    <div style={{backgroundImage:`url(${item.src})`}} className="j0d6stlx ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi k7cz35w2 bsnbvmp4"></div>
                                                    </div>
                                                    )}
                                                </div>}
                                            </div>:''}
                                        </div>
                                        <div className="rq0escxv du4w35lb j83agx80 pfnyh3mw i1fnvgqd gs1a9yip owycx6da btwxx1t3 i09qtzwb qpd6qd77 pmk7jnqg"><div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz">
                                            <div className="kgtf8isp">
                                                
                                                <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                        
                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz">      
                                                        <EmojiPicker
                                                        showemoji={showemoji}
                                                        setaddkey={(e,text)=>setaddkey(e,text)}
                                                        setshowemoji={data=>setshowemoji(data)}
                                                        />
                                                    </div>
                                                </span> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="scb9dxdr qt6c0cv9 dflh9lhu jb3vyjys">
                                    {state.addfile?
                                    <div onClick={()=>{
                                        if(fileinput.current){
                                        fileinput.current.click()}
                                        }} className="bp9cbjyn j83agx80 taijpn5t bcvklqu9 oi9244e8 oygrvhab h676nmdw ni8dbmo4 stjgntxs l9j0dhe7 dwg5866k ccnbzhu1 eip75gnj tr4kgdav ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi">
                                        <div onMouseLeave={(e)=>setState({...state,actionfile:false})} onMouseEnter={(e)=>setState({...state,actionfile:true})} className="l9j0dhe7 du4w35lb rq0escxv j83agx80 cbu4d94t d2edcug0 d8ncny3e buofh1pr g5gj957u tgvbjcpo cxgpxx05 sj5x9vvc">
                                            <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo muag1w35 enqfppq2">
                                                <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p dflh9lhu scb9dxdr">
                                                    {listfile.length==0?<>
                                                    <input ref={fileinput} onChange={(e)=>previewFile(e)} accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv" className="mkhogb32" multiple={true} style={{display:'none'}} type="file"/>
                                                    <div className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                        <div className="j83agx80 l9j0dhe7 k4urcfbm">
                                                            <div className="rq0escxv l9j0dhe7 du4w35lb i94ygzvd io0zqebd m5lcvass fbipl8qg nwvqtn77 k4urcfbm ni8dbmo4 stjgntxs ic9r50nj f85e0ade fuffjjn7" style={{borderRadius: 'max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px'}}>
                                                                <div className="l9j0dhe7 du4w35lb rq0escxv j83agx80 cbu4d94t pfnyh3mw d2edcug0 datstx6m">
                                                                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo muag1w35 enqfppq2 taijpn5t">
                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 bp9cbjyn aahdfvyu tvmbv18p">
                                                                            <div className="s45kfl79 emlxlaya bkmhp75w spb7xbtv bp9cbjyn rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv pq6dq46d taijpn5t l9j0dhe7 tdjehn4e qypqp5cg q676j6op">
                                                                                <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/jtYn6rnwzen.png)`, backgroundPosition: '0px -388px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                            </div>
                                                                        </div>
                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 bp9cbjyn aahdfvyu tvmbv18p">
                                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr ekzkrbhg oo9gr5id" dir="auto">Thêm ảnh/video</span>
                                                                        </div>
                                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 bp9cbjyn aahdfvyu tvmbv18p">
                                                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x sq6gx45u a3bd9o3v b1v8xokw m9osqain oqcyycmt" dir="auto">hoặc kéo và thả</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                                                    </div>
                                                    </>:
                                                    <div className="ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi ni8dbmo4 stjgntxs l9j0dhe7 k4urcfbm">
                                                        <div className="" style={{position:'relative',height:`466px`,display:'flex',flexWrap: 'wrap' ,flexDirection: 'row'}}>
                                                            {listfile.map((item,i)=>{
                                                                if(i<4){
                                                                    return(
                                                                    <div key={i} className="stjgntxs ni8dbmo4 taijpn5t j83agx80 bp9cbjyn" style={{flexBasis:`${listfile.length==1?100:50}%`}}>
                                                                        <div className="l9j0dhe7 jm1wdb64 k4urcfbm datstx6m">
                                                                            <img draggable="false" alt="7e00ec5cd27164a1fc2d76e2ea568cbc_tn.jpg" className="datstx6m bixrwtb6 k4urcfbm" referrerpolicy="origin-when-cross-origin" src={item.media_preview?item.media_preview:item.media}/>
                                                                            {listfile.length>4 && i==3?
                                                                            <div className="kr520xx4 j9ispegn pmk7jnqg taijpn5t cbu4d94t n7fi1qx3 j83agx80 i09qtzwb sx5rzos5 bp9cbjyn">
                                                                                <div className="oqcyycmt lrazzd5p mhxlubs3 qrtewk5h">+{listfile.length-4}</div>
                                                                            </div>
                                                                        :''}
                                                                        </div>
                                                                        
                                                                    </div>)
                                                                }}
                                                            )}
                                                        </div>

                                                        <div className="pybr56ya pmk7jnqg j9ispegn kr520xx4 k4urcfbm">
                                                            <input onChange={e=>previewFile(e)} ref={fileadd} accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv" className="mkhogb32" multiple={true} type="file"/>
                                                            <div className={`pybr56ya pmk7jnqg j9ispegn kr520xx4 k4urcfbm ${!state.actionfile?'b5wmifdl':''} mrt03zmi`}>
                                                                <div  className="rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw jifvfom9 gs1a9yip owycx6da btwxx1t3 d1544ag0 tw6a2znq jb3vyjys b5q2rw42 lq239pai mysgfdmx hddg9phg">
                                                                    <div  className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz p8fzw8mz pcp91wgn iuny7tx3 ipjc6fyt">
                                                                        <div onClick={(e)=>setAction('editfile')} aria-label="Chỉnh sửa tất cả" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                                                                            <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq q2y6ezfg __fb-light-mode  tv7at329">
                                                                                <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                                                    <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                                                        <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/3M5Zv5RmvSt.png)`, backgroundPosition: '0px -1169px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                    </div>
                                                                                    <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81"><span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p oo9gr5id" dir="auto">
                                                                                        <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Chỉnh sửa tất cả</span>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz p8fzw8mz pcp91wgn iuny7tx3 ipjc6fyt">
                                                                    <div aria-label="Thêm ảnh/video" onClick={e=>fileadd.current.click()} className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                                                                        <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq q2y6ezfg __fb-light-mode  tv7at329" style={{transform: 'none'}}>
                                                                            <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                                                <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                                                    <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/fzpi9XpCJQR.png)`, backgroundPosition: '0px -352px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                                </div>
                                                                                    <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                                                        <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p oo9gr5id" dir="auto">
                                                                                            <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Thêm ảnh/video</span>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div onClick={e=>{
                                            e.stopPropagation()
                                            listfile.length>0?setListfile([]):setState({...state,addfile:false})
                                            }} className="pmk7jnqg jk2qo03r oqnctjl6 fcg2cn6m">
                                            <div aria-label="Gỡ file đính kèm trong bài viết" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tv7at329 thwo4zme hn33210v m7msyxje m9osqain" role="button" tabindex="0">
                                                <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '0px -92px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                                            </div>
                                        </div>
                                    </div>
                                    :''}
                                </div>
                            </div>
                            <div className="pwoa4pd7 mkhogb32 n7fi1qx3 datstx6m b5wmifdl pmk7jnqg kr520xx4 qgmjvhk0 art1omkt nw2je8n7 hhz5lgdu pyaxyem1" data-visualcompletion="ignore" data-thumb="1" style={{display: 'none', right: '0px', height: '154px'}}></div>
                            <div className="rq0escxv mkhogb32 n7fi1qx3 b5wmifdl jb3vyjys ph5uu5jm qt6c0cv9 b3onmgus hzruof5a pmk7jnqg kr520xx4 enuw37q7 dpja2al7 art1omkt nw2je8n7 hhz5lgdu" data-visualcompletion="ignore" data-thumb="1" style={{display: 'block', right: '0px', height: '0px'}}>
                                <div className="oj68ptkr jk6sbkaj kdgqqoy6 ihh4hy1g qttc61fc datstx6m k4urcfbm"></div>
                            </div>
                        </div>
                        <div className="ihqw7lf3 discj3wi l9j0dhe7">
                            <div className="scb9dxdr sj5x9vvc dflh9lhu cxgpxx05 dhix69tm wkznzc2l i1fnvgqd j83agx80 rq0escxv ibutc8p7 l82x9zwi uo3d90p7 pw54ja7n ue3kfks5 tr4kgdav eip75gnj ccnbzhu1 dwg5866k cwj9ozl2 bp9cbjyn">
                                <div className="scb9dxdr qt6c0cv9 dflh9lhu jb3vyjys">
                                    <div aria-label="Thêm vào bài viết" className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                        <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p oo9gr5id" dir="auto">Thêm vào bài viết</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="j83agx80">
                                        <div className="dwxx2s2f dicw6rsg kady6ibp rs0gx3tq">
                                            <div>
                                                <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                    <div onClick={(e)=>setState({...state,addfile:true})} aria-label="Ảnh/Video" className={`${background?'disabled':''} oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h du4w35lb`} role="button" tabindex="0">
                                                        
                                                        <div className="tv7at329 l9j0dhe7 thwo4zme s45kfl79 emlxlaya bkmhp75w spb7xbtv">
                                                            <div className="iyyx5f41 l9j0dhe7 cebpdrjk bipmatt0 k5wvi7nf a8s20v7p k77z8yql qs9ysxi8 arfg74bv n00je7tq a6sixzi8 tojvnm2t">
                                                                <div className="bp9cbjyn j83agx80 taijpn5t l9j0dhe7 datstx6m k4urcfbm">
                                                                    <i data-visualcompletion="css-img" className="hu5pjgll bixrwtb6" style={{height: '24px', width: '24px', backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/jtYn6rnwzen.png)`, backgroundPosition: '0px -233px', backgroundSize: 'auto', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                                        
                                                            </div>
                                                        
                                                        </div>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="dwxx2s2f dicw6rsg kady6ibp rs0gx3tq">
                                            <div>
                                                <span onClick={(e)=>setAction('addtag')} className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                    <div aria-label="Gắn thẻ người khác" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h du4w35lb" role="button" tabindex="0">
                                                                        
                                                        <div className="tv7at329 l9j0dhe7 thwo4zme s45kfl79 emlxlaya bkmhp75w spb7xbtv">
                                                            <div className="iyyx5f41 l9j0dhe7 cebpdrjk bipmatt0 k5wvi7nf a8s20v7p k77z8yql qs9ysxi8 arfg74bv n00je7tq a6sixzi8 tojvnm2t">
                                                                <div className="bp9cbjyn j83agx80 taijpn5t l9j0dhe7 datstx6m k4urcfbm">
                                                                    <i data-visualcompletion="css-img" className="hu5pjgll bixrwtb6" style={{height: '24px', width: '24px', backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/jtYn6rnwzen.png)`, backgroundPosition: '0px -208px', backgroundSize: 'auto', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="dwxx2s2f dicw6rsg kady6ibp rs0gx3tq">
                                            <div>
                                                <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                    <div onClick={()=>setAction('emotion')} aria-label="Cảm xúc/Hoạt động" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h du4w35lb" role="button" tabindex="0">
                                                                    
                                                        <div className="tv7at329 l9j0dhe7 thwo4zme s45kfl79 emlxlaya bkmhp75w spb7xbtv">
                                                            <div className="iyyx5f41 l9j0dhe7 cebpdrjk bipmatt0 k5wvi7nf a8s20v7p k77z8yql qs9ysxi8 arfg74bv n00je7tq a6sixzi8 tojvnm2t">
                                                                <div className="bp9cbjyn j83agx80 taijpn5t l9j0dhe7 datstx6m k4urcfbm">
                                                                    <i data-visualcompletion="css-img" className="hu5pjgll bixrwtb6" style={{height: '24px', width: '24px', backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/jtYn6rnwzen.png)`, backgroundPosition: '0px -183px', backgroundSize: 'auto', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="dwxx2s2f dicw6rsg kady6ibp rs0gx3tq">
                                            <div>
                                                <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                    <div aria-label="Check in" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h du4w35lb" role="button" tabindex="0">
                                                    
                                                        <div className="tv7at329 l9j0dhe7 thwo4zme s45kfl79 emlxlaya bkmhp75w spb7xbtv">
                                                            <div className="iyyx5f41 l9j0dhe7 cebpdrjk bipmatt0 k5wvi7nf a8s20v7p k77z8yql qs9ysxi8 arfg74bv n00je7tq a6sixzi8 tojvnm2t">
                                                                <div className="bp9cbjyn j83agx80 taijpn5t l9j0dhe7 datstx6m k4urcfbm">
                                                                    <i data-visualcompletion="css-img" className="hu5pjgll bixrwtb6" style={{height: '24px', width: '24px', backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/HyeXO0sd7uk.png)`, backgroundPosition: '0px -225px', backgroundSize: 'auto', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="dwxx2s2f dicw6rsg kady6ibp rs0gx3tq">
                                            <div>
                                                <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                    <div aria-label="Tổ chức buổi H&amp;Đ" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h du4w35lb" role="button" tabindex="0">
                                                                
                                                        <div className="tv7at329 l9j0dhe7 thwo4zme s45kfl79 emlxlaya bkmhp75w spb7xbtv">
                                                            <div className="iyyx5f41 l9j0dhe7 cebpdrjk bipmatt0 k5wvi7nf a8s20v7p k77z8yql qs9ysxi8 arfg74bv n00je7tq a6sixzi8 tojvnm2t">
                                                                <div className="bp9cbjyn j83agx80 taijpn5t l9j0dhe7 datstx6m k4urcfbm">
                                                                    <i data-visualcompletion="css-img" className="hu5pjgll bixrwtb6" style={{height: '24px', width: '24px', backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/IUYFS2LyvHB.png)`, backgroundPosition: '0px -100px', backgroundSize: 'auto', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                            </div>
                                                        </div>
                                                                
                                                        
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="dwxx2s2f dicw6rsg kady6ibp rs0gx3tq">
                                            <div>
                                                <span className="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">
                                                    <div aria-label="Xem thêm" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h du4w35lb" role="button" tabindex="0">
                                                            
                                                        <div className="tv7at329 l9j0dhe7 thwo4zme s45kfl79 emlxlaya bkmhp75w spb7xbtv">
                                                            <div className="iyyx5f41 l9j0dhe7 cebpdrjk bipmatt0 k5wvi7nf a8s20v7p k77z8yql qs9ysxi8 arfg74bv n00je7tq a6sixzi8 tojvnm2t">
                                                                <div className="bp9cbjyn j83agx80 taijpn5t l9j0dhe7 datstx6m k4urcfbm">
                                                                    <i data-visualcompletion="css-img" className="hu5pjgll bixrwtb6" style={{height: '24px', width: '24px', backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/jtYn6rnwzen.png)`, backgroundPosition: '0px -108px', backgroundSize: 'auto', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                                <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                            </div>
                                                        </div>
                                                            
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>              
                            </div>
                            <div className="k4urcfbm discj3wi dati1w0a hv4rvrfc i1fnvgqd j83agx80 rq0escxv bp9cbjyn">
                                <div onClick={(e)=>submit(e)} aria-label="Đăng" className={`${rawContentState.blocks[0].text.trim().length==0 && listfile.length==0 && !emotion?'disabled':'nhd2j8a9'} oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of rj84mg9z n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm`} role="button" tabindex="-1" aria-disabled="true">
                                    <div className="s1i5eluu l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tv7at329">
                                        <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">   
                                            <span className="bwm1u5wc a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Đăng</span> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>   
                </form>
                :
                <div style={{minWidth:'500px'}}>
                    <div>
                        <div className="taijpn5t cb02d2ww j83agx80 rq0escxv linmgsc8 bp9cbjyn">
                            <h2 className="gmql0nx0 l94mrbxd p1ri9a11 lzcic4wl d2edcug0 hpfvmrgz" dir="auto">
                                <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 ns63r2gh rwim8176 o3w64lxj b2s5l15y hnhda86s oo9gr5id" dir="auto">
                                    <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5 r8blr3vg">{action=='addtag'?'Gắn thẻ người khác':action=='editfile' || action=='edit'?'Hình ảnh/Video':action=='except friend'?'Bạn bè ngoại trừ':'Bạn bè cụ thể'}</span>
                                </span>
                            </h2>
                        </div>
                        <div onClick={()=>{
                            setAction(action=='edit'?'editfile':'')
                            const datafile= listfile.map(item=>{
                                return({...item,pre_note:item.note})
                            })
                            setListfile(datafile)
                            }} className="fcg2cn6m re5koujm pmk7jnqg">
                            <div aria-label="Quay lại" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tv7at329 thwo4zme tdjehn4e" role="button" tabindex="0">
                                <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '-46px -46px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3 s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                            </div>
                        </div>
                    </div>
                
                    {action=='addtag'?
                    <Addtags
                        tags={tags}
                        setaction={(value)=>setAction(value)}
                        settags={data=>settags(data)}
                        object={'tag'}
                    />:action=='editfile' || action=='edit'?
                    <Fileedit
                        previewFile={e=>previewFile(e)}
                        listfile={listfile}
                        actionform={action}
                        setlistfile={(e,itemchoice,name,value)=>setlistfile(e,itemchoice,name,value)}
                        setactionform={(data)=>setAction(data)}
                        setfiles={(e,data)=>setfiles(e,data)}
                    />
                    :action=='emotion'?
                    <Emotionpost
                        setaction={()=>setAction('')}
                        emotion={emotion}
                        setemotion={(data)=>setEmotion(data)}
                    />:
                    action=='addviewer' || action=='editviewer'?
                    <SetViewer
                        viewer={viewer}
                        actiondata={action}
                        setaction={(value)=>setAction(value)}
                        setviewer={(e,data)=>setviewer(e,data)}
                        setlistspecific={(data)=>setListspecific(data)}
                        setlistexcept={(data)=>setListexcept(data)}
                        listexcept={listexcept}
                        listspecific={listspecific}
                        post={'create'}
                    />:''}
                
                    </div>}
                </div>   
            </div> :''}
        </>        
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,datapost:state.datapost
});
  
export default connect(mapStateToProps,{uploadpost})( Formpost);
