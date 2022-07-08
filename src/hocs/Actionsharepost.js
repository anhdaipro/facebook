import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify,showreport } from "../actions/auth";
import { actioncommentURL,actionpostURL, listcommentreplyURL, commentreplyURL, originurl } from "../urls";
import { number,timeago,listemoji,listaction } from "../constants";
const Actionsharepost=(props)=>{
    const {post,user}=props

    const [state, setState] = useState({show_action:false})
    const actionref=useRef()
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [state])

    const handleClick = (event) => {
        const { target } = event
        if(actionref.current!=null){
            if (!actionref.current.contains(target)) {
                setState({...state,show_action:false})
            }
        }
    }
    return(
        <div class="share-btn" ref={actionref} style={{position:'relative'}}>
        <div onClick={e=>setState({...state,show_action:!state.show_action})} class="share-center-div" id="share-btn">
            <div class="icon-match share-pose flex item-center">
                <i data-visualcompletion="css-img" class="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/wC-PkLKHXz3.png)`, backgroundPosition: '0px -341px', backgroundSize: 'auto', width: '18px', height: '18px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
            </div>
            <span>Share</span>
        </div>
        {state.show_action?
        <div class="three-dot-div share-btn-div" id="share-btn-btn-show">  
            <ul>
                <li id="Pin_Post_Button">
                    <i class="fas fa-share"></i> Share Now (Only Me)</li>
                <li id="Save_Post_Button">
                    <i class="far fa-edit"></i> 
                    Share to News Feed
                </li>

                <li><i class="fas fa-comment-dots"></i> Sent to Messanger</li>

                <li><i class="fas fa-users"></i> Share to a Groups</li>

                <li><i class="far fa-flag"></i> Share to a Page</li>

                <li><i class="fas fa-user-friends"></i> Share on a friend's profile</li>

            </ul>
            <div class="d06cv69u cdcbzqsl goun2846 ccm00jje s44p3ltw mk2mc5f4 tl61u9r6 bcctvi4p gcjuebxg kvs4odcb hzruof5a pmk7jnqg et4y5ytx np69z8it bssd97o4 n4j0glhw h9efg1rk" style={{transform: `translate(67.8203px, 7px) rotate(-45deg)`}}></div>
        </div>:''}
        </div>
    )
}
export default Actionsharepost