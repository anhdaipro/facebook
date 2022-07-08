import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify,showreport } from "../actions/auth";
import { actioncommentURL,actionpostURL, listcommentreplyURL, commentreplyURL, originurl } from "../urls";
import { number,timeago,listemoji,listaction } from "../constants";
const Actioncomment=(props)=>{
    const {comment,user,showreport,actioncomment,listcomment,statedata,
        setlistcomment,setstate,setactioncomment}=props
    const [state, setState] = useState({show_action:false})
    const actionref=useRef()
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [state])

    console.log(statedata)
    const handleClick = (event) => {
        const { target } = event
        if(actionref.current!=null){
            if (!actionref.current.contains(target)) {
                setState({...state,show_action:false})
            }
        }
    }
    
    const setactioncommentuser=(e,item)=>{
        (async()=>{
            
            console.log(item.action)
            e.stopPropagation()
            let form=new FormData()
            form.append('action',item.action)
            if(item.action=='delete' ||item.action=='hidden'){
                const res=await axios.post(`${actioncommentURL}/${comment.id}`,form,headers)
                const data=listcomment.filter(item=>item.id!=comment.id)
                setlistcomment(data)
            }
            else if(item.action=='report'){
                const data={id:comment.id,type:'comment',show:true}
                showreport(data)
            }  
            else if(item.action=='edit'){
                setactioncomment('edit')
                const data={edit:true}
                setstate(data)
                console.log('kkkk')
            }
        
       
    })()
    }
    console.log(actioncomment)
    return(
        <div ref={actionref} className="no6464jc">
            <div onClick={(e)=>setState({...state,show_action:!state.show_action})} className="div-dot-item">
                <span className="fas fa-ellipsis-h comm-td">
                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-34px -109px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                </span>
            </div>
            {state.show_action?
            <div class="dot-comment-action">
                <ul>
                    {user.id==comment.user.id?
                    listaction.filter(item=>item.author).map(item=>
                        <li key={item.action} onClick={e=>setactioncommentuser(e,item)} className="item-choice p-8">{item.name}</li>
                    ):listaction.filter(item=>!item.author).map(item=>
                        <li key={item.action} onClick={e=>setactioncommentuser(e,item)} className="item-choice p-8">{item.name}</li>
                    )}
                    
                </ul>

            </div>:""}
        </div>
    )
}
    
export default Actioncomment