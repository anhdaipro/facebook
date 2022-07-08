import React,{useState,useEffect,useRef,useCallback} from 'react'
function EmojiPicker(props) {
    const {showemoji,setshowemoji,setaddkey}=props
    const emoji=[  
        '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','😍','😘',
        '😗','😚','😙','😋','😛','😜','😝','🤑','🤗','🤔','🤐','😐','😑','😶','😏',
        '😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤧','😵',
        '🤠','😎','🤓','😕','😟','🙁','😮','😯','😲','😳','😦','😧','😨','😰','😥',
        '😢','😭','😱','😖','😣','😞','😓','😩','😫','😤','😡','😠','😈','👿','💀',
        '💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼',
        '😽','🙀','😿','😾']
    const buttonemoji=useRef(null)
    const listemoji=useRef(null)
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [showemoji])

    const setemoji=(e,item)=>{
        setaddkey(e,item)
        setshowemoji(false)
    }
    const handleClick = (event) => {
        const { target } = event
        if(listemoji.current!=null){
            if(buttonemoji.current!=null){
            if (!buttonemoji.current.contains(target) && !listemoji.current.contains(target)) {
                setshowemoji(false)
            }
            }
        }
        else{
            if(buttonemoji.current!=null){
                if (!buttonemoji.current.contains(target)) {
                    setshowemoji(false)
                }
            }
        }
    }
    return(
        <>
            <li ref={buttonemoji} onClick={()=>setshowemoji(!showemoji)} className="face-icon-img">
                <div className="div-size fii">
                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/rEjlCZ3yHnf.png)`, backgroundPosition: '0px -496px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                </div>      
            </li>
            
            {showemoji?
            <div ref={listemoji} className="tiktok-gyf7xg-DivEmojiPanelContainer e1npxakq9">
            <div className="tiktok-e6h932-DivEmojiSuggestionContainer egzo34x0">
                <ul class="tiktok-1ev9bi9-UlNavContainer egzo34x1">
                    <li data-index="0" class="tiktok-1t3mdo7-LiItem egzo34x4">😊</li>
                </ul>
                <div className="tiktok-wrdy8i-DivPanelContainer egzo34x2">
                    <ul className="tiktok-ro4el0-UlPanelList egzo34x3">
                        {emoji.map((item,index)=>
                            <li key={index} data-index={index} onClick={(e)=>setemoji(e,item)} class="tiktok-84kww3-LiItem egzo34x4">{item}</li>
                        )}
                    </ul>
                </div>
            </div>
            </div>
            :''}
        </>
    )
}
export default EmojiPicker