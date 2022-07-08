import EmojiPicker from "../hocs/EmojiPicker"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {listfriendURL,actionpostURL, originurl,uploadfileURL, actioncommentURL,listtagURL} from "../urls"
import axios from "axios"
import { headers,expiry,updatenotify } from "../actions/auth";
import {debounce} from 'lodash';
import Editor from '@draft-js-plugins/editor';
import { EditorState,convertToRaw,Modifier, KeyBindingUtil,getDefaultKeyBinding,convertFromRaw } from 'draft-js';
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';
import {useNavigate} from "react-router-dom"
import { number,timeago,listemoji,dataURLtoFile } from "../constants";
import Entry from "../hocs/Entry";

const content ="{\"blocks\":[{\"key\":\"15pf7\",\"text\":\"thuquynh  ddddd\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[{\"offset\":0,\"length\":8,\"key\":0}],\"data\":{}}],\"entityMap\":{\"0\":{\"type\":\"mention\",\"mutability\":\"IMMUTABLE\",\"data\":{\"mention\":{\"user\":{\"avatar\":\"/file/profile/userno_gwinne.png\",\"id\":2},\"online\":true,\"is_online\":\"2022-06-18T18:13:06.807907+07:00\",\"avatar\":\"/file/profile/userno_gwinne.png\",\"name\":\"thuquynh\"}}}}}"
export default function Addcomment(props){
    const {item,parent,user,setlistcomment,listcomment,setitem,socket,setstate,
    stateWithText,url,comment,actioncomment,setactioncomment,setcommentreply
    }=props
    const ref = useRef(null);
    const [showemoji,setShowemoji]=useState(false)
    const [state,setState]=useState({text:''})
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [listuser,setListuser]=useState([]);
    const inputfileref=useRef() 
    const [loading,setLoading]=useState(false);
    const [file,setFile]=useState()
    const [loadfile,setloadFile]=useState(false)
    const navigate=useNavigate()
    const [editorState, setEditorState] = useState(() =>
    actioncomment=='reply'?EditorState.createWithContent(stateWithText):
    actioncomment=='edit'?EditorState.createWithContent(
        convertFromRaw(JSON.parse(comment.text_preview)),
        ):
        EditorState.createEmpty()
    );
    console.log(actioncomment)
    const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      supportWhitespace: true,
    });
    
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
        return { plugins, MentionSuggestions };
    }, []);
  
    useEffect(()=>{
        if(ref!=null&&  ref.current!=null){
            
            setState({...state,text:ref.current.editor.editor.innerText})
        } 
    },[editorState,ref])

    useEffect(()=>{
        if(comment){
        setFile(comment.fileupload)
        }
    },[comment])

    const onChange = (editorState) => {
        setEditorState(editorState);
    }

    const onOpenChange = () => {
        setOpen(!open);
    }


    const onSearchChange = ({ value }) => {
        fetchkeyword(value) 
        setSuggestions(defaultSuggestionsFilter(value, suggestions));
    }

   
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const res = await axios.get(`${listtagURL}?keyword=${value}`,headers)
                setSuggestions(res.data)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[])

    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const entityMap = rawContentState.entityMap;
    const listtag=Object.values(entityMap).map(entity => {
        return({...entity.data.mention.user,...entity.data.mention.name})
    })
    console.log(stateWithText)
    //console.log(ref.current.editor.editor.innerText);
   
    const myKeyBindingFn=(e)=>{
        const { hasCommandModifier } = KeyBindingUtil;
        if (e.keyCode === 13 && !hasCommandModifier(e)) {
            const listtext=document.querySelectorAll('.public-DraftStyleDefault-block>span')
            let text=[]
            let text_preview=''
            for(let i=0;i<listtext.length;i++){
                if(listtext[i].classList.contains('m6zwb4v')){
                    text.push({"text":listtext[i].innerText.replace('@',''),"type":"tag"})
                    text_preview+='@'+listtext[i].innerText
                }
                else{
                    text.push({"text":listtext[i].innerText,"type":"text"})
                    text_preview+=listtext[i].innerText
                }
            }
            const caption=JSON.stringify(text)
            let form =new FormData()
            form.append('body',caption)
            form.append('action',actioncomment=='edit'?actioncomment:'comment')
            form.append('text_preview',JSON.stringify(rawContentState))
            if(file){
                form.append('file_id',file.id)
            }    
            Object.values(entityMap).map(entity => {
                form.append('tag',entity.data.mention.id)
            }); 
            if(parent!=null){
                form.append('parent_id',parent.id)
            }
            
            axios.post(actioncomment=='edit'?`${actioncommentURL}/${comment.id}`:`${url}/${item.id}`,form,headers)
            .then(res=>{
                if(actioncomment!='edit'){
                    socket.current.emit("sendNotifi",res.data.listnotifications)
                }
                const commentadd={id:comment?comment.id:res.data.id,body:caption,count_reply: 0,
                text_preview:JSON.stringify(rawContentState),count_express_emotions:0,
                list_emoji:[],express_emotions:false,fileupload:file,
                date:new Date().toString(),like: false,parent:parent?parent.id:null,user:user,tags: listtag}
                const listcomments=comment?
                listcomment.map(item=>{
                    if(item.id==comment.id){
                        return({...item,body:caption,tags: listtag,text_preview:text_preview,fileupload:file,
                            date:new Date().toString()})
                    }
                    return({...item})
                })
                :listcomment.map(item=>{
                    if (parent!=null &&item.id==parent.id){
                        return({...item,count_reply:item.count_reply+1,hidden_reply:false})
                    }
                    return({...item})
                })
                const list_comments=comment?listcomment:[...listcomments,commentadd]
                const datacomment={listcomment:list_comments,id:item.id}
                socket.current.emit('addComment',datacomment)
                
                if(actioncomment!='edit'){
                    const itemedit={...item,count_comment:item.count_comment+1,commented:true}
                    setitem(itemedit)
                }
                setloadFile(false)
                setFile()
                if(setcommentreply){
                setcommentreply()
                }
                if (actioncomment=='edit'){setstate({edit:false})}
                setempty() 
            })
        }
        else{
            if(actioncomment=='edit' && e.keyCode === 27){
                setstate({edit:false})
                setEditorState(EditorState.createEmpty())
                
            }
        }
        
        return getDefaultKeyBinding(e);
    }

    const setaddkey=(e,text)=>{  
        setEditorState(insertText(text, editorState));
    }
    
    const setempty=()=>{
        setEditorState(EditorState.createEmpty())
    }
    
    const setshowemoji=(data)=>{
       setShowemoji(data)
   }

    const setemoji = (e,text) => {
        setEditorState(insertText(text, editorState));
    };

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
    let time=100
    let filechoice={}
    const previewFile=(e)=>{
        
        [].forEach.call(e.target.files, function(file) {
            setloadFile(true)
            if ((/image\/.*/.test(file.type))){
                filechoice={file:file,duration:0}
            }
            else if(file.type.match('video.*')){ 
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
                        filechoice={file_name:file.name,file:file,file_preview:file_preview,duration:video.duration}
                        
                        URL.revokeObjectURL(url);
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
        
            setTimeout(function() {
            let form=new FormData()
            Object.keys(filechoice).map(item=>{
                form.append(item,filechoice[item])
            })
            if(filechoice.id){
                form.append('id',file.id)
            }
            axios.post(uploadfileURL,form,headers)
            .then(res=>{
                setLoading(true)
                setFile(res.data)
             })
        }, 2000);
    }
    
    const setremovefile=(e)=>{
        let form=new FormData()
        form.append('id',file.id)
        axios.post(uploadfileURL,form,headers)
        .then(res=>{
            setFile()
            setloadFile(false)
        })
    }

    return (
        <div className="tiktok-a5fzmm-DivCommentContainer e1npxakq0">
            <div className="input-comment-div"> 
                <div className="tiktok-1vplah5-DivLayoutContainer e1npxakq1">   
                    <div onClick={()=>ref.current.focus()} data-e2e="comment-input" className="tiktok-1vwgyq9-DivInputAreaContainer e1npxakq2">    
                        <div  data-e2e="comment-text" className="oo9gr5id tiktok-qpucp9-DivInputEditorContainer e1npxakq3">
                            <Editor
                                editorKey={'editor'}
                                editorState={editorState}
                                onChange={onChange}
                                plugins={plugins}
                                ref={ref}
                                keyBindingFn={myKeyBindingFn}
                                placeholder={`${parent?`Reply ${parent.user.name}`:'Add comment'}`}
                            />
                        </div>
                        
                        <MentionSuggestions
                            open={open}
                            onOpenChange={onOpenChange}
                            suggestions={suggestions}
                            onSearchChange={onSearchChange}
                            onAddMention={(obj) => {
                                setListuser([...listuser,obj.username])
                                
                            }}
                            entryComponent={Entry}
                            popoverContainer={({ children }) => 
                            <div className="tiktok-2qnxeb-DivMentionSuggestionContainer e1npxakq7">
                                <div className="tiktok-16el7uh-DivContainer ewopnkv0">
                                    <div className="tiktok-16el7uh-DivContainer ewopnkv0">
                                        {children}
                                    </div>
                                </div>
                            </div>}
                        />
                    </div>
                </div>
                <ul>
                    <EmojiPicker
                    showemoji={showemoji}
                    setaddkey={(e,text)=>setaddkey(e,text)}
                    setshowemoji={data=>setshowemoji(data)}
                    />
                    {file?'':<>
                    <li onClick={()=>inputfileref.current.click()}  className="cemera-icon-img">
                        <div className="div-size cii">
                            <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/rEjlCZ3yHnf.png)`, backgroundPosition: '0px -445px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                        <input onChange={(e)=>previewFile(e)} ref={inputfileref} accept="video/*,  video/x-m4v, video/webm, video/x-ms-wmv, video/x-msvideo, video/3gpp, video/flv, video/x-flv, video/mp4, video/quicktime, video/mpeg, video/ogv, .ts, .mkv, image/*, image/heic, image/heif" className="mkhogb32" type="file"/>
                    </li>

                    <li className="gif-icon-img">
                        <div className="div-size gii">
                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/rEjlCZ3yHnf.png)`, backgroundPosition: '0px -513px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                    </li>

                    <li className="sticer-icon-img">
                        <div className="div-size sii">
                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/rEjlCZ3yHnf.png)`, backgroundPosition: '0px -615px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                    </li></>}
                </ul>
            </div>
            {loadfile?
            <div className="buofh1pr">
                {file?
                <div className="sj5x9vvc cxgpxx05 m0hv1tm6 aov4n071 btwxx1t3 hybvsw6c du4w35lb l9j0dhe7 a8nywdso rz4wbd8a hpfvmrgz hcukyx3x cxmmr5t8 oygrvhab i1fnvgqd g5gj957u buofh1pr j83agx80 rq0escxv auili1gw ow4ym5g4 gs1a9yip">
                    <div className="k4urcfbm scb9dxdr dflh9lhu buofh1pr">
                        <div aria-atomic="true" aria-live="polite" className="rfua0xdk pmk7jnqg stjgntxs ni8dbmo4 ay7djpcl ema1e40h q45zohi1" role="status">Đã đính kèm ảnh thành công</div>
                        <div>
                            {file.file_preview?
                            
                                <div style={{width:'300px',height:'300px'}} class="i09qtzwb qmr60zad inkptoze qlfml3jp e72ty7fz">
                                    <img className="datstx6m bixrwtb6 k4urcfbm" src={originurl+file.file_preview}/>
                                </div>
                                
                            :
                            <div className="uiScaledImageContainer" style={{width:'60px',height:'80px'}}>
                                <img className="scaledImageFitWidth img" src={`${originurl}${file.file_preview?file.file_preview:file.file}`} alt="Ảnh của Nguyễn Trãi." width="60" height="80" caption="Ảnh của Nguyễn Trãi."/>
                            </div>}
                        </div>
                    </div>
                    <div className="dflh9lhu ">
                        <div aria-label="Gỡ ảnh" onClick={(e)=>setremovefile(e)} className="close-btn oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 rgmg9uty b73ngqbp tdjehn4e" role="button" tabindex="0">
                            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-39px -126px', backgroundSize: 'auto', width: '12px', height: '12px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                        </div>
                    </div>
                </div>:
                <div className="flex item-center loader--style3" title="2">
                <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="70px" height="70px" viewBox="0 0 50 50" style={{enableBackground:'new 0 0 50 50'}} xmlspace="preserve">
                    <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                    </path>
                </svg>
                </div>}
            </div>:''}
        </div>
  );
}