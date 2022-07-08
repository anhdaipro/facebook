import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { headers } from '../actions/auth';
import {debounce} from 'lodash';
import {dataURLtoFile,generateString,listitem} from "../constants"
import {listfriendURL,actionpostURL, originurl,uploadfileURL, listcategoriesURL, listtagURL} from "../urls"
import Inputsearch from '../hocs/Inputsearch';

const Listviewer=(props)=>{
    const inputref=useRef()
    const boxref=useRef()
    const [listuser,setListuser]=useState([])
    const [state, setState] = useState({text:''})
    const {listviewer,setlistviewer,listfriends,type}=props
    const [show,setShow]=useState(false)
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [show])

    const handleClick = (event) => {
        const { target } = event
        if(boxref.current!=null){
            if (!boxref.current.contains(target)) {
                setShow(false)
            }
        }
    }
    const setkeyword=(e)=>{
        const value=e.target.value
        setState({...state,text:value})
        if(value.trim()!==''){
        fetchkeyword(value)}
    }
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const res = await axios.get(`${listfriendURL}?keyword=${value}`,headers)
                const datauser=res.data.filter(item=>listfriends.every(mention=>mention.id!=item.id))
                setListuser(datauser)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[listfriends])
    return(
        <div class="j83agx80 k4urcfbm">
            <div ref={boxref} onClick={e=>{inputref.current.focus()
            setShow(true)
            }} class="g5ia77u1 buofh1pr d2edcug0 hpfvmrgz l9j0dhe7 border-8 l9j0dhe7 tag-container-body">
                <span class="title-tag">Những người hoặc danh sách này</span>
                <div class="pt-24">
                    {type=='specific'?
                    <div class="kkf49tns tvmbv18p cgat1ltu aahdfvyu q9uorilb" role="row">
                        <span role="gridcell">
                            <div class="bp9cbjyn beltcj47 p86d2i9g aot14ch1 kzx2olss pq6dq46d rv4hoivh h4z51re5 oo1teu6h e5nlhep0 ecm0bbzt">
                                <div aria-hidden="true" class="oi9244e8">
                                    <img class="hu5pjgll op6gxeva" src="https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/9k6yNjHv16_.png" alt="" height="20" width="20"/>
                                </div>
                                <div aria-hidden="true" class="oi9244e8">
                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi lrazzd5p q66pz984" dir="auto">Bạn bè</span>
                                </div>
                                <div aria-label="Gỡ  Bạn bè " class="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 pq6dq46d kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 pzggbiyp pkj7ub1o bqnlxs5p kkg9azqs c24pa1uk ln9iyx3p fe6kdd0r ar1oviwq l10q8mi9 sq40qgkc s8quxz6p pdjglbur" role="button" tabindex="0">
                                    <i data-visualcompletion="css-img" class="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/5-4DvmZZblx.png)`, backgroundPosition: `-65px -126px`, backgroundSize: 'auto', width: '12px', height: '12px', backgroundRepeat: `no-repeat`, display: `inline-block`}}></i>
                                    
                                </div>
                            </div>
                        </span>
                    </div>:''}
                    {listviewer.map(item=>
                        <div key={item.id} class="kkf49tns tvmbv18p cgat1ltu aahdfvyu q9uorilb" role="row">
                            <span role="gridcell">
                                <div class="bp9cbjyn beltcj47 p86d2i9g aot14ch1 kzx2olss pq6dq46d rv4hoivh h4z51re5 oo1teu6h e5nlhep0 ecm0bbzt">
                                    <div aria-hidden="true" class="oi9244e8">
                                        <img height='40' width='40' class="hu5pjgll op6gxeva" src={originurl+item.avatar} alt="" height="20" width="20"/>
                                    </div>
                                    <div aria-hidden="true" class="oi9244e8">
                                        <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi lrazzd5p q66pz984" dir="auto">{item.name}</span>
                                    </div>
                                    <div onClick={e=>setlistviewer(
                                        listviewer.filter(mention=>mention.id!=item.id)
                                    )} aria-label="Gỡ  Bạn bè " class="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 pq6dq46d kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 pzggbiyp pkj7ub1o bqnlxs5p kkg9azqs c24pa1uk ln9iyx3p fe6kdd0r ar1oviwq l10q8mi9 sq40qgkc s8quxz6p pdjglbur" role="button" tabindex="0">
                                        <i data-visualcompletion="css-img" class="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/5-4DvmZZblx.png)`, backgroundPosition: `-65px -126px`, backgroundSize: 'auto', width: '12px', height: '12px', backgroundRepeat: `no-repeat`, display: `inline-block`}}></i>
                                        
                                    </div>
                                </div>
                            </span>
                        </div>
                    )}      
                    <span aria-hidden="true" class="g0qnabr5 kr9hpln1 kr520xx4 j9ispegn pmk7jnqg r0usavy5 n5sx5to1 jagab5yi"></span>
                    <input ref={inputref} onChange={(e)=>setkeyword(e)} aria-autocomplete="list" aria-expanded="false" aria-label="Những người hoặc danh sách này" role="combobox" autocomplete="off" class="g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv oo9gr5id nc684nl6 jagab5yi knj5qynh fo6rh5oj fv0vnmcu ggphbty4 aov4n071 bi6gxh9e d2edcug0 lzcic4wl ieid39z1 aj8hi1zk kd8v7px7 r4fl40cc m07ooulj mzan44vs" id="jsc_c_1jj" placeholder="" spellcheck="false" type="search" value={state.text} style={{width: '80px'}}/>
                </div>
                {show && listuser.length>0 && type?
                <div className="drop-down" style={{width:'100%',marginTop:'0px'}}>
                    <div className="p-8">
                        <div className="eg9m0zos t5wl5276" style={{maxHeight:'50vh'}}>
                            {listuser.map((item,i)=>
                            <div key={i} onClick={(e)=>{
                                e.stopPropagation()
                                setlistviewer([...listviewer,item])
                                setShow(false)
                                setListuser([])
                                setState({...state,text:''})
                                }} class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz p7hjln8o esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 rq0escxv nhd2j8a9 j83agx80 btwxx1t3 pfnyh3mw opuu4ng7 kj2yoqh6 kvgmc6g5 oygrvhab l9j0dhe7 i1ao9s8h du4w35lb bp9cbjyn cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr" role="menuitem" tabindex="0">
                                <div class="bp9cbjyn tiyi1ipj j83agx80 taijpn5t tvfksri0">
                                    <img class="hu5pjgll lzf7d6o1" src={originurl+item.avatar} alt="" height="40" width="40"/>
                                </div>
                                <div class="bp9cbjyn j83agx80 btwxx1t3 buofh1pr i1fnvgqd hpfvmrgz">
                                    <div class="j83agx80 cbu4d94t ew0dbk1b irj2b8pg">
                                        <div class="qzhwtbm6 knvmm38d">
                                            <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v ekzkrbhg oo9gr5id hzawbc8m" dir="auto">{item.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore" style={{borderRadius: '4px'}}></div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>:''}
            </div>
        </div>
    )
}
const Addtags=(props)=>{
    const {user,tags,settags,object,listexcept,listspecific,setaction,action,id,
    setexcept,setspecific,setviewer,viewerdata,showactionport}=props
    const [state, setState] = useState({text:''})
    const [listuser, setListuser] = useState([])
    const [keyword,setKeyword]=useState('')
    const [mentions,setMentions]=useState([])
    const [listexceptfriend,setListexceptfriend]=useState([])
    const [listspecificfriend,setListspecificfriend]=useState([])
    useEffect(()=>{
        setMentions(tags)
    },[tags])
    useEffect(()=>{
        if(listexcept){
        setListexceptfriend(listexcept)
        setListspecificfriend(listspecific)
        }
    },[listexcept,listspecific])
    useEffect(()=>{
        (async()=>{
            try{
                if(object!='tag' && viewerdata && viewerdata.value!='6'){
                    const res =await axios.get(listtagURL,headers)
                    setListuser(res.data)
                }
            }
            catch{
            }
        })()
        
    },[object,viewerdata])
    
    const ListTag=()=>{
        
        return(
            <div className="k4urcfbm">
                <div className="dati1w0a sj5x9vvc rz4wbd8a jb3vyjys">
                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi lrazzd5p m9osqain" dir="auto">{object=='specific'?'Những bạn sẽ nhìn thấy bài viết':object=='except'?'Những bạn không nhìn thấy bài viết':'ĐÃ GẮN THẺ'}</span>
                </div>
                <div className="dati1w0a ihqw7lf3 hv4rvrfc cxgpxx05">
                    <div className={`cwj9ozl2 o1lve8g4 ${object!='tag'?'emxnvquj':'stjgntxs'} qbxu24ho bxzzcbxg lxuwth05 h2mp5456 beltcj47 p86d2i9g aot14ch1 kzx2olss goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 j83agx80 cbu4d94t ni8dbmo4 l9j0dhe7 du4w35lb hw4tbnyy`}>
                        <div className="k4urcfbm scb9dxdr sj5x9vvc dflh9lhu cxgpxx05 emxnvquj lzcic4wl jy1fj58s fo6rh5oj knj5qynh jagab5yi oo9gr5id rq0escxv izx4hr6d humdl8nn bn081pho gcieejh5 g5ia77u1">
                            {mentions.map(item=>
                                <div className="kkf49tns q9uorilb tvmbv18p cgat1ltu aahdfvyu q9uorilb">
                                    <div className="bp9cbjyn beltcj47 p86d2i9g aot14ch1 kzx2olss pq6dq46d jktsbyx5 rv4hoivh osnr6wyh h4z51re5 oo1teu6h">
                                        <div aria-hidden="true" className="oi9244e8">
                                            <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p q66pz984" dir="auto">{item.name}</span>
                                        </div>
                                        <div onClick={e=>{
                                            setMentions(mentions.filter(itemchoice=>item.id!=itemchoice.id))
                                            setState({...state,text:''})
                                            
                                            }} 
                                            aria-label="Gỡ  Phạm Đại " className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 pq6dq46d kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 pzggbiyp pkj7ub1o bqnlxs5p kkg9azqs c24pa1uk ln9iyx3p fe6kdd0r ar1oviwq l10q8mi9 sq40qgkc s8quxz6p pdjglbur" role="button" tabindex="0">
                                            <i data-visualcompletion="css-img" className="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '-52px -130px', backgroundSize:'auto', width: '12px', height: '12px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                            <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3 s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore" style={{inset: '-8px'}}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }

    const listfriend=object=='specific'?listuser.filter(item=>listexcept.every(except=>except.id!=item.id)):object=='except'?listuser.filter(item=>listspecific.every(speci=>speci.id!=item.id)):listuser
    const listfriends=[...listexceptfriend,...listspecificfriend]
    return(
        <div className="aovydwv3 j83agx80 tag-body" style={{maxWidth: '500px'}}>
            <div className="rq0escxv j83agx80 cbu4d94t k4urcfbm">
                {viewerdata && viewerdata.value=='6'?'':
                <Inputsearch
                setstate={data=>setState(data)}
                state={state}
                mentions={mentions}
                setlistuser={data=>setListuser(data)}
                />}
                <div className="cwj9ozl2 rq0escxv j83agx80 cbu4d94t buofh1pr q9n83ivv">
                    <div className="rpm2j7zs k7i0oixp gvuykj2m j83agx80 cbu4d94t ni8dbmo4 du4w35lb q5bimw55 ofs802cu pohlnb88 dkue75c7 mb9wzai9 l56l04vs r57mb794 l9j0dhe7 kh7kg01d eg9m0zos c3g1iek1 t5wl5276 k4urcfbm q9n83ivv">
                        <div className="j83agx80 cbu4d94t buofh1pr l9j0dhe7">
                            <div className="discj3wi sj5x9vvc">
                                <ul role="listbox" className="p-0-16">
                                    {viewerdata && viewerdata.value=='6'?
                                    <div>
                                        <div>
                                            <div className="pl-8 l9j0dhe7 du4w35lb rq0escxv j83agx80 cbu4d94t pfnyh3mw d2edcug0 e5nlhep0 aodizinl">
                                                <span class="a8c37x1j o3w64lxj ni8dbmo4 stjgntxs l9j0dhe7 r8blr3vg" >Chia sẻ với</span>
                                            </div>
                                            <Listviewer
                                            type='specific'
                                            listviewer={listspecificfriend}
                                            listfriends={listfriends}
                                            setlistuser={data=>setListuser(data)}
                                            setlistviewer={data=>setListspecificfriend(data)}
                                            />
                                            <div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div class="py-16 rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hv4rvrfc dati1w0a"><div class="rq0escxv l9j0dhe7 du4w35lb pwoa4pd7 ay7djpcl mkjtxrlb"></div></div>
                                        <div>
                                            <div className="pl-8 l9j0dhe7 du4w35lb rq0escxv j83agx80 cbu4d94t pfnyh3mw d2edcug0 e5nlhep0">
                                                <span class="a8c37x1j o3w64lxj ni8dbmo4 stjgntxs l9j0dhe7 r8blr3vg" >Không chia sẻ với</span>
                                            </div>
                                            <Listviewer
                                            listfriends={listfriends}
                                            type='except'
                                            listviewer={listexceptfriend}
                                            setlistuser={data=>setListuser(data)}
                                            setlistviewer={data=>setListexceptfriend(data)}
                                            />
                                            <div class="qzhwtbm6 knvmm38d"><span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x sq6gx45u a3bd9o3v b1v8xokw m9osqain hzawbc8m" dir="auto">Bất kỳ ai bạn thêm vào đây hoặc danh sách hạn chế sẽ không thể xem bài viết này trừ khi bạn gắn thẻ họ. Chúng tôi không cho mọi người biết khi bạn chọn không chia sẻ gì đó với họ.</span></div>
                                        </div>
                                    </div>
                                    :
                                    <>
                                    {mentions.length>0 && object=='tag'?
                                    <ListTag/>:''}
                                    <div className="tiktok-1vwgyq9-DivInputAreaContaine list-tag-item eg9m0zos ni8dbmo4 e1npxakq2">
                                        <div className={`${listfriend.length==0?'item-center flex p-8':'p-4-16'}`}>
                                            <span  dir="auto">
                                                {listfriend.length>0?'Tìm kiếm' :'Không tìm thấy người nào'}
                                            </span>
                                        </div> 
                                        {listfriend.map(mention=>
                                            <div onClick={()=>{
                                                if(object=='tag'){
                                                    setListuser([])
                                                    setMentions([...mentions,mention])
                                                }
                                                else{
                                                    if(mentions.some(item=>item.id==mention.id)){
                                                        setMentions(mentions.filter(itemchoice=>mention.id!=itemchoice.id))
                                                    }
                                                    else{
                                                    setMentions([...mentions,mention])
                                                    }
                                                }
                                                setState({...state,text:''})
                                            }} key={mention.id} data-e2e="comment-at-list" className="tiktok-d4c6zy-DivItemBackground flex flex-center item-space ewopnkv6 p-8">
                                                <div className="tiktok-1rn2hi8-DivItemContainer flex-center ewopnkv5">
                                                    <span shape="circle" className="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{flex: '0 0 40px', width: '40px', height: '40px'}}>
                                                        <img loading="lazy" src={originurl+mention.avatar} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                                    </span>
                                                    <div className="tiktok-4f7266-DivInfoContainer ewopnkv7">
                                                        <p className="tiktok-15s5y80-PMentionInfoLine ewopnkv8">
                                                            <span data-e2e="comment-at-nickname" className="tiktok-evv4sm-SpanInfoNickname ewopnkv9">{mention.name}</span>
                                                                <span className="tiktok-14bueqa-SpanInfoVerify ewopnkv12">
                                                                <svg className="tiktok-shsbhf-StyledVerifyBadge e1aglo370" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#20D5EC"></circle><path fillRule="evenodd" clipRule="evenodd" d="M37.1213 15.8787C38.2929 17.0503 38.2929 18.9497 37.1213 20.1213L23.6213 33.6213C22.4497 34.7929 20.5503 34.7929 19.3787 33.6213L10.8787 25.1213C9.70711 23.9497 9.70711 22.0503 10.8787 20.8787C12.0503 19.7071 13.9497 19.7071 15.1213 20.8787L21.5 27.2574L32.8787 15.8787C34.0503 14.7071 35.9497 14.7071 37.1213 15.8787Z" fill="white"></path></svg>
                                                            </span>
                                                        </p>
                                                        <p className="tiktok-15s5y80-PMentionInfoLine ewopnkv8">
                                                            <span data-e2e="comment-at-uniqueid" className="tiktok-ny41l3-SpanInfoUniqueId ewopnkv10">Bạn bè</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                {object!='tag'?
                                                <div class="n851cfcs ozuftl9m n1l5q3vz l9j0dhe7 o8rfisnq">
                                                    <div class="bp9cbjyn j83agx80 btwxx1t3">
                                                        <div class="j83agx80">
                                                            {object=='specific'?
                                                            <i data-visualcompletion="css-img" class="hu5pjgll" aria-label="Xóa khỏi Những bạn sẽ nhìn thấy bài viết" role="img" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yM/r/901SaFUPfI0.png)`, backgroundPosition: `0px ${mentions.some(item=>item.id==mention.id)?0:-50}px`, backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                            :<i data-visualcompletion="css-img" class="hu5pjgll" aria-label="Xóa khỏi Những bạn không nhìn thấy bài viết" role="img" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yM/r/901SaFUPfI0.png)`, backgroundPosition: `0px ${mentions.some(item=>item.id==mention.id)?-75:-100}px`, backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>}
                                                        </div>
                                                    </div>
                                                </div>:''}
                                            </div>
                                        )}
                                    </div>
                                    {mentions.length>0 && object!='tag'?
                                    <ListTag/>:''}
                                    
                                    </>
                                    }
                                    <div className="bkfpd7mw pfnyh3mw j83agx80">
                                        <div className="flex flex-center p-0-8">
                                            <div onClick={()=>setaction(action=='editviewer'?'addviewer':'')} className="rq0escxv nhd2j8a9 l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz p8fzw8mz pcp91wgn iuny7tx3 ipjc6fyt">
                                                <div class="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p knomaqxo" dir="auto">
                                                        <span class="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Hủy</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="rq0escxv nhd2j8a9 l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz p8fzw8mz pcp91wgn iuny7tx3 ipjc6fyt">
                                                <div onClick={e=>{
                                                    if(settags){
                                                        settags(mentions)
                                                    }
                                                    setaction('')
                                                    if(viewerdata){
                                                        let form=new FormData()
                                                        if(viewerdata.value=='6'){
                                                            setexcept(listexceptfriend)
                                                            setspecific(listspecificfriend)
                                                            listexceptfriend.map(item=>{
                                                                form.append('except_id',item.id)
                                                            })
                                                            listspecificfriend.map(item=>{
                                                                form.append('specific_id',item.id)
                                                            })
                                                        }
                                                        else{
                                                            
                                                            if(viewerdata.value=='5'){
                                                                setexcept([])
                                                                mentions.map(item=>{
                                                                    form.append('specific_id',item.id)
                                                                })
                                                            }
                                                            else{
                                                                setspecific([])
                                                                mentions.map(item=>{
                                                                    form.append('except_id',item.id)
                                                                })
                                                            }
                                                        }
                                                        setviewer(e,viewerdata)
                                                        if(id){
                                                            form.append('action','editviewer')
                                                            form.append('viewer',viewerdata.value)
                                                            axios.post(`${actionpostURL}/${id}`,form,headers)
                                                            .then(res=>{
                                                                showactionport({id:id,viewer:viewerdata.value,action:''})
                                                            })
                                                        }
                                                    }
                                                }} class="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv tkv8g59h fl8dtwsd s1i5eluu tv7at329">
                                                    <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p knomaqxo" dir="auto">
                                                        <span class="a8c37x1j ni8dbmo4 bwm1u5wc stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Lưu</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        </div>
                        <div className="pwoa4pd7 mkhogb32 n7fi1qx3 datstx6m b5wmifdl pmk7jnqg kr520xx4 qgmjvhk0 art1omkt nw2je8n7 hhz5lgdu pyaxyem1" data-visualcompletion="ignore" data-thumb="1" style={{display: 'none', right: '0px', height: '329px'}}></div> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Addtags