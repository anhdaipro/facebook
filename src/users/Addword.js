import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from 'axios';
import { headers } from '../actions/auth';
import Editor from '@draft-js-plugins/editor';
import { EditorState,convertToRaw,Modifier } from 'draft-js';
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';

import Draggable from "../hocs/useDraggable";

const Addword=(props)=>{
    const {item,setlisteditor,listeditorState,parent,index}=props
    const ref=useRef()
    const [state,setState]=useState({text:''})
    const [offset, setOffset] = useState({ dx: 0, dy: 0,scale:1,rotate:0 });
    const editorState=item.editorState
    const onChange = (editorState) => {
        const data=listeditorState.map(editor=>{
            if(index==listeditorState.indexOf(editor)){
                return({...editor,editorState:editorState})
            }
            return({...editor})
        })
        setlisteditor(data)
    }
     const setoffset=(data)=>{
        const {dx,dy,scale}=data
		const scales={scale:scale<=0.2?0.2:scale>=2.2?2.2:scale}
        setOffset({...offset,...data,...scales})
    }
    const setmovetext=(e,value)=>{
        const data=listeditorState.map(editor=>{
            if(listeditorState.indexOf(editor)==index){
                return({...editor,move:value})
            }
            return({...editor,move:false})
        })
        setlisteditor(data)
    }
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const entityMap = rawContentState.entityMap;
    const drag=(e)=>{
        e.stopPropagation()
        e.dataTransfer.setData("text", e.target.id);
    }
    const children=useRef()
    console.log(rawContentState)
    
    const removeiitem=(e)=>{
        e.stopPropagation()
        const data=listeditorState.filter((item,i)=>listeditorState.indexOf(item)!=index)
        setlisteditor(data)
    }
    const setitem=(e)=>{
        console.log()
    }
    return(
        <Draggable
        classname={'datstx6m'}
        offset={offset}
        setoffset={setoffset}
       children={
        <div onMouseLeave={e=>setmovetext(e,false)} onMouseEnter={(e)=>setmovetext(e,true)} className="" id="a498d9790-e6d6-409e-b071-af24acf32f04" style={{color: item.color, fontFamily: `Facebook Stencil Viet App`, fontSize: `${!item.choice?14.33:30}px`, maxWidth: '220px', minWidth: `${!item.choice?'auto':'220px'}`}}>
            <div  className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of lzcic4wl a8c37x1j ipjc6fyt p8fzw8mz iuny7tx3 pcp91wgn k4urcfbm o6r2urh6" role="presentation">
                <div className="tojvnm2t a6sixzi8 k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y l9j0dhe7 iyyx5f41 a8s20v7p">
                    <div  className="rq0escxv datstx6m k4urcfbm">
                        <div onClick={(e) =>{
                            e.stopPropagation()
                            ref.current.focus()
                                 
                            }}  
                            className="_5rp7 _5rpa">
                            <div className="_1p1t _1p1u">
                                {rawContentState.blocks[0].text.trim()==''?<div className="_1p1v " id="placeholder-bpbjf" style={{whiteSpace: 'pre-wrap'}}>Bắt đầu nhập</div>:''}
                            </div>
                            <div className="_5rpb">
                            <Editor
                                editorKey={'editor'}
                                editorState={item.editorState}
                                onChange={onChange}
                                ref={ref}
                                
                            />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`${item.move && !item.choice?'a8c37x1j':'mkhogb32'} pmk7jnqg j9ispegn kr520xx4 py2didcb`}>
                <div onClick={e=>removeiitem(e)} aria-label="Xóa" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 rgmg9uty b73ngqbp hn33210v m7msyxje m9osqain" role="button" tabindex="0">
                    <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '-52px -130px', backgroundSize: 'auto', width: '12px', height: '12px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                    <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                </div>
            </div>
            <div className={`${item.move && !item.choice?'a8c37x1j':'mkhogb32'} datstx6m k4urcfbm`}>
                <div className="jnigpg78 pmk7jnqg odw8uiq3 n7fi1qx3 kr520xx4 j8rxnqxn a7woen2v">
                    <div className="i09qtzwb j9ispegn q2y6ezfg s45kfl79 emlxlaya bkmhp75w spb7xbtv am38r5jf pmk7jnqg mx9os10e bcd4bg8y"></div>
                    <div className="nhd2j8a9 a8c37x1j datstx6m pmk7jnqg k4urcfbm c2jidycd">
                        <div className="mkhogb32 a3fe08na">
                            <i data-visualcompletion="css-img" className="hu5pjgll" draggable="false" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/I-tqQnJ8R-d.png)`, backgroundPosition: '0px -51px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                    </div>
                </div>
                <div className="jnigpg78 pmk7jnqg odw8uiq3 i09qtzwb n7fi1qx3 h5qj88ue a7woen2v">
                    <div className="q2y6ezfg s45kfl79 emlxlaya bkmhp75w spb7xbtv am38r5jf pmk7jnqg mx9os10e j9ispegn kr520xx4 dfck0lc5"></div>
                    <div className="nhd2j8a9 a8c37x1j datstx6m pmk7jnqg k4urcfbm ro89jwcp">
                        <div className="mkhogb32">
                            <i data-visualcompletion="css-img" className="hu5pjgll" draggable="false" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/I-tqQnJ8R-d.png)`, backgroundPosition: '0px 0px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                    </div>
                </div>
                <div className="jnigpg78 pmk7jnqg odw8uiq3 i09qtzwb j9ispegn fd5l4qr9 a7woen2v">
                    <div className="q2y6ezfg s45kfl79 emlxlaya bkmhp75w spb7xbtv am38r5jf pmk7jnqg mx9os10e n7fi1qx3 kr520xx4 bcd4bg8y"></div>
                    <div className="nhd2j8a9 a8c37x1j datstx6m pmk7jnqg k4urcfbm n84xj1y6">
                        <div className="mkhogb32 a3fe08na">
                            <i data-visualcompletion="css-img" className="hu5pjgll" draggable="false" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/I-tqQnJ8R-d.png)`, backgroundPosition: '0px 0px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
         />
    )
}
export default Addword