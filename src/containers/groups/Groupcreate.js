import { Link, Navigate,useNavigate } from "react-router-dom"
import Navbar from "../Navbar"
import { useState,useEffect,useRef,useMemo,useCallback } from "react"
import { headers,uploadpost } from "../../actions/auth"
import { actionfriendURL,listtagURL,originurl,creategroupURL } from "../../urls"
import axios from "axios"
import styles from "./sibar.module.css"
import Editor from '@draft-js-plugins/editor';
import { EditorState,convertToRaw,Modifier, ContentState } from 'draft-js';
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';
import {connect} from "react-redux"
import Entry from "../../hocs/Entry"
import {debounce} from 'lodash';
const listitem=['Giới thiệu',"Thành viên",'Bài viết',"Sự kiện"]
const listprivate=[
    {name:'Công khai',value:'1',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/ptKuwmqcVlp.png',position:'0px -88px',info:'Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.'},
    {name:'Riêng tư',value:'2',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/ptKuwmqcVlp.png',position:'0px -193px',info:'Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.'},
]
const NewGroup=(props)=>{
    const {user}=props
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const navigate=useNavigate()
    const ref=useRef()
    const [suggestions, setSuggestions] = useState([]);
    const [listuser,setListuser]=useState([])
    const [groupname,setGroupname]=useState()
    const [show,setShow]=useState(false)
    const [open, setOpen] = useState(false);
    const parent=useRef()
    const [showemoji,setShowemoji]=useState(false)
    const [viewer,setViewer]=useState()
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    
    const handleClick = (event) => {
        const { target } = event
        if(parent.current!=null){
            if (!parent.current.contains(target)) {
                setShow(false)
            }
        }
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

    const onChange = useCallback((editorState) => {
        setEditorState(editorState);
    },[])

    const onOpenChange = () => {
        setOpen(!open);
    }

    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const onSearchChange = useCallback(({ value }) => {
        fetchkeyword(value) 
        setSuggestions(defaultSuggestionsFilter(value, suggestions));
    },[])

   
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const url=`${listtagURL}?keyword=${value}`
                const res = await axios.get(url,headers)
                setSuggestions(res.data)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[])

   
    const entityMap = rawContentState.entityMap;
    const listtag=Object.values(entityMap).map(entity => {
        return({...entity.data.mention.user,...entity.data.mention.name})
    })
    const submit=(e)=>{
        (async ()=>{
            const listtag=Object.values(entityMap).map(entity => {
                return entity.data.mention.id
            });
            const data={group_name:groupname,private:viewer,members:listtag}
            const res =await axios.post(creategroupURL,JSON.stringify(data),headers)
            navigate(`/groups/${res.data.id}`)
        })()
    }
    return(
        <div>
            <Navbar
            hidesearch={true}
            className={'position'}
            />
            {user?
            <div className="container container-group">
                <div className="sibar-wrapper">
                    <div class="a3l43yxo jez8cy9q k3q8kl47"></div>
                    <div className={styles.header_content}>
                        <span>
                            <Link to="/group/feed">
                                Nhóm
                            </Link>
                        </span>
                        <span>{' > '}</span>
                        <span>Tạo nhóm</span>
                    </div>
                    <h1 className="px-1">Tạo nhóm</h1>
                    <div className="p-1">
                        <div className={`${styles.account}`}>
                            <div className={`${styles.avatar}`}>
                                <img src={user.avatar} className="avatar__image"/>
                            </div>
                            <div>
                                <div className={styles.name}>{user.name}</div>
                                <div className={styles.info}>quản trị viên</div>
                            </div>
                        </div>
                    </div>
                    <div ref={parent}  className="p-1">
                        <div className="px-1 box-item mb-1">
                            <input onChange={e=>setGroupname(e.target.value)} value={groupname} placeholder="Tên nhóm" type="text" maxLength="75" />
                        </div>
                        <div className="mb-1 relative">
                            <div onClick={()=>setShow(!show)} className="px-1 drop-item box-item">
                                <div className="flex flex-center">{viewer? 
                                    <><div className="mr-8">
                                        <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(${listprivate.find(item=>item.value==viewer).src})`, backgroundPosition: listprivate.find(item=>item.value==viewer).position, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                    </div>
                                        
                                    <div>{listprivate.find(item=>item.value==viewer).name}</div></>:'Chọn quyền riêng tư'}</div>
                                <div>
                                    <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/xjV4j8zXH-H.png)`, backgroundPosition: '-17px -164px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                            </div>
                            {show?
                            <div className="drop-down">
                                <div className="p-1_2">
                                    {listprivate.map((item,i)=>
                                    <div onClick={(e)=>{setViewer(item.value)
                                        setShow(false)}
                                    } key={i} className="item-space">
                                        <div  className={styles.item}>
                                            <div className="mr-8">
                                                <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(${item.src})`, backgroundPosition: item.position, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                            </div>
                                            <div>
                                                <div>{item.name}</div>
                                                <div className={styles.info}>{item.info}</div>
                                            </div>

                                        </div>
                                        {item.value==viewer?
                                        <div class="j0k7ypqs">
                                            <i data-visualcompletion="css-img" class="gneimcpu a3axapz1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/xjV4j8zXH-H.png)`, backgroundPosition: `-84px -84px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                        </div>:''}
                                    </div>)}
                                    <div className="separator"></div>
                                    <div className="footer-bottom"><span className="font-normal">Tìm hiểu thêm về </span><Link className="font-normal text-primary" to="/help">Quyền riêng tư của bạn</Link></div>
                                </div>
                            </div>:''}
                        </div>
                        <div className="px-1 box-item mb-1">
                            <div className="tiktok-1vplah5-DivLayoutContainer e1npxakq1">   
                                <div onClick={()=>ref.current.focus()} data-e2e="comment-input" className="tiktok-1vwgyq9-DivInputAreaContainer e1npxakq2">    
                                    <div  data-e2e="comment-text" className="oo9gr5id tiktok-qpucp9-DivInputEditorContainer e1npxakq3">
                                        <Editor
                                            editorKey={'editor'}
                                            editorState={editorState}
                                            onChange={onChange}
                                            plugins={plugins}
                                            ref={ref}
                                            
                                            placeholder={`Mời bạn bè (Không bắt buộc)`}
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
                        </div>
                    </div>
                    <div onClick={e=>submit(e)} className={styles.bottom}>
                        <button className="btn-primary btn-large"><span className="text-white">Tạo</span></button>
                    </div>
                </div>
                <div className="group-wrapper">
                <div className="preview-group-container preview-normal preview-large">
                    <div className={`${styles.header} item-space`}>
                        <div>Xem trước trên máy tính</div>
                        <div className="item-center">
                            <div className={'icon-action mr-4'}>
                                <i data-visualcompletion="css-img" class="gneimcpu a3axapz1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yO/r/S5kbUJndQrI.png)`, backgroundPosition: '0px -142px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            </div>
                            <div className={'icon-action'}>
                                <i data-visualcompletion="css-img" class="gneimcpu oee9glnz" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/1AXy1fubVbE.png)`, backgroundPosition: '0px -935px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            </div>
                        </div>
                    </div>
                    <div className="container_previews">
                    <div className="content-preview">
                        <div className="image_cover">
                            <img className="avatar__image" src="https://res.cloudinary.com/dupep1afe/image/upload/v1662431672/groups-default-cover-photo-2x_ihiq4a.png"></img>
                        </div>
                        <div className="p-1">
                            <h1 className={`${groupname?'':'text-normal'}`}>{groupname||'Tên nhóm'}</h1>
                            <span className="flex flex-center"><div>Quyền riêng tư của nhóm</div><div style={{width:'10px'}}>:</div><div>1 thành viên</div></span>
                        </div>
                        <div className="separator"></div>
                        <div className={`${styles.list_item} pb-12 flex flex-center `}>
                            {listitem.map((item,i)=>
                                <div key={i} className={styles.item}>{item}</div>
                            )}
                        </div>
                        <div className="info-group">
                            <div className="info-group-header">Giới thiệu</div>
                            <div className="post-group">
                                <div className={`${styles.header_post} px-1`}>
                                    <div className="item-center mr-1_2">
                                        <i data-visualcompletion="css-img" class="i8zpp7h3 qmqpeqxj e7u6y3za qwcclf47 nmlomj2f" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/1AXy1fubVbE.png)`, backgroundPosition: '0px 0px', backgroundSize: 'auto', width: '32px', height: '32px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                    </div>
                                    <div className={`search search_content`}>
                                        <span className={''}>Bạn đang nghĩ gì?</span>
                                    </div>
                                </div>
                                <div className={`${styles.list_item} item-center`}>
                                    <div className={styles.item}>
                                        <i className="icon-large icon mr-1_2">
                                            <svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em" class="b6ax4al1 m4pnbp5e somyomsx ahndzqod n7gtua6e mwtcrujb mx6bq00g"><g fill-rule="evenodd" transform="translate(-444 -156)"><g><path d="m96.968 22.425-.648.057a2.692 2.692 0 0 1-1.978-.625 2.69 2.69 0 0 1-.96-1.84L92.01 4.32a2.702 2.702 0 0 1 .79-2.156c.47-.472 1.111-.731 1.774-.79l2.58-.225a.498.498 0 0 1 .507.675 4.189 4.189 0 0 0-.251 1.11L96.017 18.85a4.206 4.206 0 0 0 .977 3.091s.459.364-.026.485m8.524-16.327a1.75 1.75 0 1 1-3.485.305 1.75 1.75 0 0 1 3.485-.305m5.85 3.011a.797.797 0 0 0-1.129-.093l-3.733 3.195a.545.545 0 0 0-.062.765l.837.993a.75.75 0 1 1-1.147.966l-2.502-2.981a.797.797 0 0 0-1.096-.12L99 14.5l-.5 4.25c-.06.674.326 2.19 1 2.25l11.916 1.166c.325.026 1-.039 1.25-.25.252-.21.89-.842.917-1.166l.833-8.084-3.073-3.557z" transform="translate(352 156.5)"></path><path fill-rule="nonzero" d="m111.61 22.963-11.604-1.015a2.77 2.77 0 0 1-2.512-2.995L98.88 3.09A2.77 2.77 0 0 1 101.876.58l11.603 1.015a2.77 2.77 0 0 1 2.513 2.994l-1.388 15.862a2.77 2.77 0 0 1-2.994 2.513zm.13-1.494.082.004a1.27 1.27 0 0 0 1.287-1.154l1.388-15.862a1.27 1.27 0 0 0-1.148-1.37l-11.604-1.014a1.27 1.27 0 0 0-1.37 1.15l-1.387 15.86a1.27 1.27 0 0 0 1.149 1.37l11.603 1.016z" transform="translate(352 156.5)"></path></g></g></svg>
                                        </i>
                                        <div>Ảnh/video</div>
                                    </div>
                                    <div className={styles.item}>
                                        <i data-visualcompletion="css-img" class="mr-1_2" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/BldLbpBsWmr.png)`, backgroundPosition: '0px -200px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                        <div>Gắn thẻ người khác</div>
                                    </div>
                                    <div className={styles.item}>
                                        <i className="icon-large icon mr-1_2">
                                            <svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em" class="b6ax4al1 m4pnbp5e somyomsx ahndzqod dxn77deq mwtcrujb mx6bq00g"><g fill-rule="evenodd" transform="translate(-444 -156)"><g><path d="M107.285 13c.49 0 .841.476.712.957-.623 2.324-2.837 4.043-5.473 4.043-2.636 0-4.85-1.719-5.473-4.043-.13-.48.222-.957.712-.957h9.522z" transform="translate(353.5 156.5)"></path><path fill-rule="nonzero" d="M114.024 11.5c0 6.351-5.149 11.5-11.5 11.5s-11.5-5.149-11.5-11.5S96.173 0 102.524 0s11.5 5.149 11.5 11.5zm-2 0a9.5 9.5 0 1 0-19 0 9.5 9.5 0 0 0 19 0z" transform="translate(353.5 156.5)"></path><path d="M99.524 8.5c0 .829-.56 1.5-1.25 1.5s-1.25-.671-1.25-1.5.56-1.5 1.25-1.5 1.25.671 1.25 1.5m8.5 0c0 .829-.56 1.5-1.25 1.5s-1.25-.671-1.25-1.5.56-1.5 1.25-1.5 1.25.671 1.25 1.5m-.739 4.5h-9.522c-.49 0-.841.476-.712.957.623 2.324 2.837 4.043 5.473 4.043 2.636 0 4.85-1.719 5.473-4.043.13-.48-.222-.957-.712-.957m-2.165 2c-.667.624-1.592 1-2.596 1a3.799 3.799 0 0 1-2.596-1h5.192" transform="translate(353.5 156.5)"></path></g></g></svg>
                                        </i>
                                        <div>Cảm xúc/Hoạt động</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>:''}
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user
});

export default connect(mapStateToProps,{uploadpost})( NewGroup);
