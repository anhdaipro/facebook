import { listfriendURL, originurl, uploadfileURL } from "../urls"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
  } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import { dataURLtoFile } from "../constants";
import axios from 'axios';
import { headers, updateprofile } from "../actions/auth";
import {debounce} from 'lodash';

 
const actionfile=[{name:'Cắt',position:'-75px -97px',action:'cut',image:true},
{name:"Xoay",position:'-150px -97px',action:'rotate',image:true},
{name:"Tag",position:'-175px -97px',action:'tag',image:true},
{name:"Thay đổi hình thu nhỏ",action:'changeimage',position:'-125px -97px'}]
const listactionchange=[{name:"Chọn hình gợi ý",action:1},{name:"Tải ảnh lên",action:2},{name:'Choice in video',action:3}]
const Fileedit=(props)=>{
    const inputfile=useRef(null)
    const {user,listfile,setfiles,previewFile,setactionform,actionform,setlistfile}=props
    const [state,setState]=useState({edit:false,disabled:false,paly:false})
    const imgRef = useRef(null)
    const [percent,setPercent]=useState({width:100,height:100})
    const [crop, setCrop] = useState()
    const [aspect, setAspect] = useState(1)
    const [completedCrop, setCompletedCrop] = useState()
    const [showaction,setShowaction]=useState(false)
    const [scale, setScale] = useState(1)
    const [save,setSave]=useState(false)
    const [action,setAction]=useState('cut')
    const [time,setTime]=useState(0)
    const [rotate, setRotate] = useState(0)
    const [listimages,setlistImages]=useState([])
    const [file, setFile] = useState({height:324,width:324})
    const [filechoice,setFilchoice]=useState()
    const [listtags,setListTags]=useState([])
    const [listuser,setListuser]=useState([])
    const [text,setText]=useState('')
    const [note,setNote]=useState('')
    const [addtagfile,setAddtagfile]=useState()
    const [index,setIndex]=useState(0)
    const videoref=useRef()
    const [actionchange,setActionchange]=useState()
    const fileedit=useRef()
    const inputref=useRef()
    let list_image=[]
    function centerAspectCrop(
        mediaWidth: number,
        mediaHeight: number,
        aspect: 1,
      ) {
        return centerCrop(
          makeAspectCrop(
            {
              x: 0,y: 0,width: 100,height: 100,unit: '%'
            },
            aspect,
            mediaWidth,
            mediaHeight,
          ),
          mediaWidth,
          mediaHeight,
        )
      }
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [addtagfile])
   
    useEffect(()=>{
        if(listfile.length>0 && index< listfile.length){
            setListTags(listfile[index].tags)
            const listnote=listfile.map((item,i)=>{
                return({note:item.note,index:i})
            })
            setNote(listnote)
            setFilchoice({media:listfile[index].media,media_preview:listfile[index].media_preview})
        }
        else{
            setactionform('')
            setlistImages([])
            setFilchoice()
        }
    },[listfile,index])
    console.log(completedCrop)
    const handleClick = (event) => {
        const { target } = event
        if(fileedit.current!=null){
            if (!fileedit.current.contains(target)) {
                setAddtagfile()
            }
        }
    }
   
    
    const setlistfiles=(e,file,name,value)=>{
        const list_file=listfile.map(item=>{
            if(item.media==file.media){
                return({...item,[name]:value})
            }
            else{
                if(name=='show_action'){
                    return({...item,[name]:false})
                }
                return({...item})
            }
            
        })
        setfiles(list_file)
    }
    const removeitem=(e,file)=>{
        const list_file=listfile.filter(item=>item.media!=file.media)
        setfiles(list_file)
    }
    function onImageLoad(e) {
        const { width, height } = e.currentTarget
        setFile({width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight})
        if (aspect) {
          setCrop(centerAspectCrop(width, height, aspect))
        }
      }
   
    const submit=(e)=>{
        const sourceImage=imgRef.current
        const canvas = document.createElement("canvas");
        if(!listfile[index].media_preview){
            const pixelRatio = window.devicePixelRatio;
            const scaleX = sourceImage.naturalWidth / sourceImage.width;
            const scaleY = sourceImage.naturalHeight / sourceImage.height;
            canvas.width = crop.width * pixelRatio * scaleX;
            canvas.height = crop.height * pixelRatio * scaleY;
            const TO_RADIANS = Math.PI / 180
            const ctx = canvas.getContext("2d"); 
            const rotateRads = rotate * TO_RADIANS
            const centerX = sourceImage.naturalWidth / 2
            const centerY = sourceImage.naturalHeight / 2
            const cropX = crop.x * scaleX
            const cropY = crop.y * scaleY
            ctx.save()
            // 5) Move the crop origin to the canvas origin (0,0)
            ctx.translate(-cropX, -cropY)
            
            // 4) Move the origin to the center of the original position
            ctx.translate(centerX, centerY)
            // 3) Rotate around the origin
            ctx.rotate(rotateRads)
            // 2) Scale the image
            ctx.scale(scale, scale)
            // 1) Move the center of the image to the origin (0,0)
            ctx.translate(-centerX, -centerY)
            ctx.drawImage(
                sourceImage,
                0,
                0,
                sourceImage.naturalWidth,
                sourceImage.naturalHeight,
                0,
                0,
                sourceImage.naturalWidth,
                sourceImage.naturalHeight,
            );
        }
        let image = canvas.toDataURL("image/png");
        let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
        console.log(canvas)
        const datacrop=percent.width<100 || percent.height<100?{media:(window.URL || window.webkitURL).createObjectURL(file_preview)}:{}
        const list_file=listfile.map(item=>{
            if(item.media==listfile[index].media){
                if(listfile[index].media_preview){
                    return({...item,...filechoice,note:listfile[index].pre_note})
                }
                else{
                    return({...item,...datacrop,tags:listtags,note:listfile[index].pre_note})
                }
            }
            return({...item}) 
        })
        setfiles(list_file)
        setPercent({width: 100,height: 100})
        setState({...state,edit:false})
        setactionform('editfile')
    }
  
    const setaddtagfile=(e)=>{
        if(state.disabled){
        const rects = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rects.left;
        const y=e.clientY-rects.top
        setAddtagfile({top:y*100/rects.height,left:x*100/rects.width})
        console.log(y*100/rects.height)
        }
    }
    
    const updatefile=(e)=>{
        const datalistfiles=listfile.map(item=>{
            return({...item,note:item.pre_note})
        })
        setfiles(datalistfiles)
        setactionform('')
    }
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const res = await axios.get(`${listfriendURL}?keyword=${value}`,headers)
                const datauser=res.data.filter(item=>listtags.every(mention=>mention.id!=item.id))
                setListuser(datauser)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[listtags])
    console.log(crop)
    const setaction=(e,item)=>{
        setAction(item.action)
        if(item.action=='cut'){
            setState({...state,disabled:false})
        }
        else if(item.action=='rotate'){
            setRotate(rotate+90)
        }
        else{
            setState({...state,disabled:true})
            setScale(1)
        }
    }
    const setlisttags=(e,item)=>{
        e.stopPropagation()
        const itempost=item
        const data={...addtagfile,...itempost}
        setListTags([...listtags,data])
        setAddtagfile()
        setText('')
        setListuser([])
    }
    const removetag=(e,itemchoice)=>{
        e.stopPropagation()
        const data=listtags.filter(item=>item.id!=itemchoice.id)
        setListTags(data)
    }
    const editFile=(e)=>{
        [].forEach.call(e.target.files, function(file) {
            setFilchoice({...filechoice,update:true,file_preview:file,media_preview:(window.URL || window.webkitURL).createObjectURL(file)})    
        })
    }
    useEffect(()=>{
        if(actionchange && actionchange==3 && listfile[index].listimages.length==0){
        list_image.length=0
        let video = document.createElement('video');
        let i = 1;
        video.addEventListener('loadeddata', function() {
            this.currentTime = i;
        });
        video.addEventListener('seeked', function() {
            // now video has seeked and current frames will show
            // at the time as we expect
            generateThumbnail(i);
            // when frame is captured, increase here by 5 seconds
            i += listfile[index].duration/10;
            // if we are not past end, seek to next interval
            if (i <= this.duration) {
              // this will trigger another seeked event
              this.currentTime = i;
            }
            else {
              // Done!, next action
                return
            }
        });
        function generateThumbnail(i) {   
            console.log(i)  
            let canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let image = canvas.toDataURL("image/png");
            let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
            list_image.push({media_preview:image,file_preview:file_preview,time:i})
            const datalistimage=[...list_image]
            const list_file=listfile.map(item=>{
                if(item.media==listfile[index].media){
                    return({...item,listimages:datalistimage})
                }
                return({...item})
            })
            setfiles(list_file)
        }
        console.log(i)
        video.preload = 'metadata';
        video.src=listfile[index].media
    }
    },[actionchange,listfile,index])
    
   
    console.log(listfile)
    const setfilechange=(e,value)=>{
        const times=value>=listfile[index].duration?listfile[index].duration-1  :value<=1?1:value
        setTime(times)
        console.log(times)
        console.log(listfile[index].duration)
        var video = document.createElement('video');
        video.addEventListener('loadeddata', function() {
            this.currentTime=times
        });
        var timeupdate = function() {  
            let canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let image = canvas.toDataURL("image/png");
            let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
            setFilchoice({...filechoice,file_preview:file_preview,media_preview:image})
        };
        video.preload = 'metadata';
        video.src=listfile[index].media
        video.addEventListener('seeked', timeupdate);
    }
    return(
        <div className="j83agx80 file-edit-container ni8dbmo4 cbu4d94t f0kvp8a6 mt3fbsrg l0zeh9nj"> 
            <div className="j83agx80 datstx6m g64rku83 bg-white">
                <div className="j83agx80 cbu4d94t buofh1pr l9j0dhe7">
                    {actionform=='editfile'?
                    <div className={`bq4bzpyk j83agx80 ${state.edit?'btwxx1t3':'cbu4d94t'} lhclo0ds jifvfom9 muag1w35 dlv3wnog enqfppq2 rl04r1d5`}>
                        {listfile.map((item,i)=>
                        <div  key={i} className="rq0escxv j83agx80 rj1gh0hx cbu4d94t buofh1pr g5gj957u ph5uu5jm b3onmgus e5nlhep0 ecm0bbzt n1dktuyu" style={{maxWidth: '680px', minWidth: '350px'}}>
                            <div className="abiwlrkh gw4tj676 a7woen2v rq0escxv prrx4l0j k4urcfbm" data-key="0" draggable="true">
                                <div onMouseLeave={(e)=>setlistfiles(e,item,'show_action',false)} onMouseOver={(e)=>setlistfiles(e,item,'show_action',true)} className="rq0escxv">
                                    <div className="ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi ad9n1n66 ni8dbmo4 stjgntxs l9j0dhe7">
                                        <div  className="l9j0dhe7">
                                            <div className="pgeiv1et l9j0dhe7 djkytl3r">
                                                <div className="bp9cbjyn j83agx80 datstx6m taijpn5t ni8dbmo4 stjgntxs k4urcfbm hqeojc4l">
                                                    <div className="oqujnh0m b6s8h9p6 cg1f0npj">
                                                        <span className="id8f4lua">
                                                            <img draggable="false" alt="" className="datstx6m bixrwtb6 k4urcfbm" referrerpolicy="origin-when-cross-origin" src={item.media}/>
                                                        </span>
                                                    </div>
                                                </div>
                                                <img draggable="false" alt="6b2b7067b0833d85fef24d5f5a83e902_tn.jpg" className="datstx6m r0294ipz pmk7jnqg j9ispegn kr520xx4 k4urcfbm" referrerpolicy="origin-when-cross-origin" src={item.media_preview?item.media_preview:item.media}/>
                                            </div>
                                            <div className="d2iitwg3 tvfksri0 pmk7jnqg rnx8an3s">
                                                {!item.media_preview?
                                                <div>
                                                    <div onClick={()=>{setState({...state,edit:true,disabled:true})
                                                        setIndex(i)
                                                        setAction('tag')
                                                        setactionform('edit')
                                                    }} aria-label="Gắn thẻ ảnh" className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                                                        <div className="pcp91wgn iuny7tx3 p8fzw8mz ipjc6fyt qjjbsfad j83agx80 qrtewk5h lsl2245n hqlzco19 o3c63hce lit7pgxp d6rk862h bp9cbjyn">
                                                            <i data-visualcompletion="css-img" className="hu5pjgll eb18blue" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/xf7B4qqxYaQ.png)`, backgroundPosition: '0px -13px', backgroundSize: 'auto', width: '12px', height: '12px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                            {item.tags.length>0?
                                                            <div className="pcp91wgn buofh1pr rj1gh0hx">
                                                                <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi b1v8xokw qrtewk5h" dir="auto">
                                                                    {item.tags.map((tag,i)=>
                                                                        <>{tag.name}{i>=0&&i<item.tags.length-2?', ':i==item.tags.length-2?' và ':''}</>
                                                                    )}
                                                                </span>
                                                            </div>:''}
                                                        </div>
                                                    </div>
                                                </div>:''}
                                            </div>
                                        </div>
                                        <div class={`${item.show_action?'pedkr2u6':'b5wmifdl'}`}>
                                            <div className="fcg2cn6m rnx8an3s pmk7jnqg">
                                                <div onClick={()=>{setState({...state,edit:true,disabled:false})
                                                        setIndex(i)
                                                        setactionform('edit')
                                                        setAction('cut')
                                                    }} aria-label="Chỉnh sửa" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                                                    <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq q2y6ezfg __fb-light-mode  tv7at329">
                                                        <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                                            <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                                <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/3M5Zv5RmvSt.png)`, backgroundPosition: '0px -1169px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                            </div>
                                                            <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                                <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p oo9gr5id" dir="auto">
                                                                    <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Chỉnh sửa</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="fcg2cn6m pmk7jnqg swmj3c3o">
                                                <div className="a7x4jqbc gwewmpg2 pmk7jnqg jaqpu5ht">
                                                    <div onClick={(e)=>removeitem(e,item)} aria-label="Gỡ video" className="oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv j83agx80 taijpn5t jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 tv7at329 thwo4zme hn33210v m7msyxje m9osqain" role="button" tabindex="0">
                                                        <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/p_1KiBAWUgK.png)`, backgroundPosition: '0px -197px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                        <div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {listfile.length>1?
                                        <div className="cwj9ozl2 cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr">
                                            <div>
                                                <label aria-label="Chú thích" className="cwj9ozl2 beltcj47 p86d2i9g aot14ch1 kzx2olss goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 j83agx80 cbu4d94t ni8dbmo4 stjgntxs l9j0dhe7 du4w35lb hw4tbnyy o6r2urh6 np24d88i p9mcbvme krxe8813 ph5sz0o6 lzcic4wl" for="jsc_c_c7">
                                                    <div className="j83agx80 k4urcfbm">
                                                        <div className="g5ia77u1 buofh1pr d2edcug0 hpfvmrgz l9j0dhe7">
                                                            <textarea spellCheck={false} onChange={e=>{
                                                                setlistfile(e,item,'pre_note',e.target.value)}
                                                            } value={item.pre_note} placeholder={'bắt đàu nhập'} dir="ltr" aria-invalid="false" id="jsc_c_c7" className="oajrlxb2 f1sip0of hidtqoto g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv oo9gr5id j83agx80 jagab5yi p-8 knj5qynh fo6rh5oj lzcic4wl ni8dbmo4 stjgntxs hv4rvrfc dati1w0a ieid39z1 k4urcfbm" rows="4" style={{overflowY: 'auto'}}></textarea>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>:''}
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>:
                    <div className="flex center apxknhg1">
                        <div className="facebook-edit-container">
                            <div className="facebook-edit-wrap">
                                {listfile.length>1?
                                <div className="facebook-edit-note-container">
                                    <div className="facebook-note">
                                        <textarea spellCheck={false} value={listfile[index].pre_note} onChange={(e)=>setlistfiles(e,listfile[index],'pre_note',e.target.value)} placeholder='Bắt đầu nhập' className="facebbok-edit-input"></textarea>
                                    </div>
                                </div>:''}
                                <div className="facebook-edit-actions">
                                    {!listfile[index].media_preview?<>
                                    {actionfile.filter(item=>item.image).map((item,i)=><>
                                    <div key={i} onClick={(e)=>setaction(e,item)} className={`${action==item.action?'facebook-action-active':''} facebook-edit-action`}>
                                        <div className="facebook-edit-action-icon">
                                            <i data-visualcompletion="css-img" className={`hu5pjgll lzf7d6o1 ${action==item.action?'eb18blue':''}`} style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/rB-A1NXM1Qa.png)`, backgroundPosition: item.position, backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                        </div>
                                        
                                        <div className="facebook-edit-action-name">{item.name}</div>
                                    </div>
                                    {action=='tag' && action==item.action && listtags.length>0?
                                        <div class="j83agx80 k4urcfbm">
                                            <div class="g5ia77u1 buofh1pr d2edcug0 hpfvmrgz l9j0dhe7 border-8 l9j0dhe7 tag-container-body">
                                                <span class="title-tag">Được gắn thẻ trong ảnh</span>
                                                <div class="pt-24">
                                                    {listtags.map(item=>
                                                        <div key={item.id} class="kkf49tns tvmbv18p cgat1ltu aahdfvyu q9uorilb" role="row">
                                                            <span role="gridcell">
                                                                <div class="bp9cbjyn beltcj47 p86d2i9g aot14ch1 kzx2olss pq6dq46d rv4hoivh h4z51re5 oo1teu6h e5nlhep0 ecm0bbzt">
                                                                    <div aria-hidden="true" class="oi9244e8">
                                                                        <img height='40' width='40' class="hu5pjgll op6gxeva" src={originurl+item.avatar} alt="" height="20" width="20"/>
                                                                    </div>
                                                                    <div aria-hidden="true" class="oi9244e8">
                                                                        <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi lrazzd5p q66pz984" dir="auto">{item.name}</span>
                                                                    </div>
                                                                    <div onClick={e=>setListTags(
                                                                        listtags.filter(mention=>mention.id!=item.id)
                                                                    )} aria-label="Gỡ  Bạn bè " class="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 pq6dq46d kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 pzggbiyp pkj7ub1o bqnlxs5p kkg9azqs c24pa1uk ln9iyx3p fe6kdd0r ar1oviwq l10q8mi9 sq40qgkc s8quxz6p pdjglbur" role="button" tabindex="0">
                                                                        <i data-visualcompletion="css-img" class="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/5-4DvmZZblx.png)`, backgroundPosition: `-65px -126px`, backgroundSize: 'auto', width: '12px', height: '12px', backgroundRepeat: `no-repeat`, display: `inline-block`}}></i>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    )}       
                                                </div>
                                            </div>
                                        </div>
                                    :''}
                                    </>
                                    )}</>:
                                    <>
                                    {actionfile.filter(item=>!item.image).map((item,i)=>
                                        <>
                                        <div key={i} onClick={(e)=>setaction(e,item)} className={`${action==item.action?'facebook-action-active':''} facebook-edit-action i1fnvgqd`}>
                                            <div className="flex flex-center g5gj957u">
                                                <div className="facebook-edit-action-icon">
                                                    <i data-visualcompletion="css-img" className={`hu5pjgll lzf7d6o1 ${action==item.action?'eb18blue':''}`} style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/rB-A1NXM1Qa.png)`, backgroundPosition: item.position, backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                </div>
                                                
                                                <div className="facebook-edit-action-name">{item.name}</div>
                                            </div>
                                            <div onClick={()=>setShowaction(!showaction)} className="bp9cbjyn j83agx80 btwxx1t3">
                                                <div className="oi9244e8">
                                                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: `${showaction?'-42px -67px':'-126px -46px'}`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                </div>
                                            
                                            </div>
                                        </div>
                                        {showaction?
                                        <div>
                                            {item.action=='changeimage'?<>
                                            {listactionchange.map((item,i)=><>
                                            <div key={i} onClick={(e)=>{
                                                setActionchange(item.action)
                                                
                                                }} className={`${action==item.action?'facebook-action-active':''} facebook-edit-action i1fnvgqd`}>
                                                <div className="flex flex-center g5gj957u">
                                                    <div className="facebook-edit-action-name">{item.name}</div>
                                                </div>
                                                <div className="bp9cbjyn j83agx80 btwxx1t3">
                                                    <div className="oi9244e8">
                                                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: `${actionchange==item.action?-63:-84}px -67px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                    </div>
                                                </div>
                                            </div>
                                            {actionchange==item.action?
                                            <div className="discj3wi dati1w0a hv4rvrfc">
                                                <div className="qzhwtbm6 knvmm38d">
                                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi b1v8xokw m9osqain hzawbc8m" dir="auto">Choose one of these suggested images to show before your video starts playing.</span>
                                                </div>
                                                {i==0 || i==2?
                                                <div className="tqsryivl jk6sbkaj kdgqqoy6 ihh4hy1g qttc61fc ni8dbmo4 stjgntxs l9j0dhe7 oqcyycmt">
                                                    <img className="enqfppq2 pthvdlie t4nbt77m" src={filechoice?filechoice.media_preview:''}/>
                                                    {i==0?
                                                    <div className="k01i5q8h oqnctjl6 pmk7jnqg">
                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw i1fnvgqd gs1a9yip owycx6da btwxx1t3 jb3vyjys dlv3wnog rl04r1d5 enqfppq2 muag1w35">
                                                            <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t d2edcug0 hpfvmrgz buofh1pr g5gj957u ph5uu5jm b3onmgus e5nlhep0 ecm0bbzt mg4g778l">  
                                                                <div onClick={e=>setfilechange(e,time-listfile[index].duration/10)}  aria-label="" className={`${time<=1?'disabled':''} oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm`} role="button" tabindex="0">
                                                                    <div className="l9j0dhe7  du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329">                                                                   
                                                                        <i data-visualcompletion="css-img" className="hu5pjgll dfmqs5qf" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-152px -88px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>                                                                      
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t d2edcug0 hpfvmrgz buofh1pr g5gj957u ph5uu5jm b3onmgus e5nlhep0 ecm0bbzt mg4g778l">     
                                                                <div onClick={e=>setfilechange(e,time+listfile[index].duration/10)} aria-label="" className={`${time>=listfile[index].duration-1?'disabled':''} oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm`} role="button" tabindex="0">
                                                                    <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329">                                                                       
                                                                        <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-169px -88px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>:''}
                                                </div>:<>
                                                <input spellCheck={false} onChange={(e)=>{
                                                    editFile(e)
                                                    setState({...state,change:true})
                                                }} ref={inputref} accept=".png,.jpg,.jpeg" class="mkhogb32" type="file"/>
                                                <div className={`${!state.change?'add-file-container':'tqsryivl jk6sbkaj kdgqqoy6 ihh4hy1g qttc61fc ni8dbmo4 stjgntxs l9j0dhe7 oqcyycmt'}`}>
                                                    {!state.change?
                                                    <div onClick={(e)=>inputref.current.click()} className="add-file-wrapper">
                                                        <div class="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                            <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/vxd04SE-LAi.png)`, backgroundPosition: `0px -597px`, backgroundSize: `auto`, width: `16px`, height: `16px`, backgroundRepeat: `no-repeat`, display: `inline-block`}}></i>
                                                        </div>
                                                        <div class="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                                            <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p a57itxjd" dir="auto">
                                                                <span class="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Tải ảnh lên</span>
                                                            </span>
                                                        </div>
                                                    </div>:<>
                                                    <img loading="auto" alt="Tuỳ chỉnh ảnh đã tải lên" class="enqfppq2 pthvdlie t4nbt77m" referrerpolicy="origin-when-cross-origin" src={filechoice.media_preview}></img>
                                                    <div className="oqnctjl6 flex pmk7jnqg c0p38np4">
                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t d2edcug0 hpfvmrgz buofh1pr g5gj957u ph5uu5jm b3onmgus e5nlhep0 ecm0bbzt mg4g778l">     
                                                            <div onClick={(e)=>inputref.current.click()} aria-label="" className={`${time>=listfile[index].duration-1?'disabled':''} oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm`} role="button" tabindex="0">
                                                                <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329">                                                                       
                                                                    <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/rEjlCZ3yHnf.png)`, backgroundPosition: '0px -564px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                            </div>
                                                                
                                                        </div>
                                                        <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t d2edcug0 hpfvmrgz buofh1pr g5gj957u ph5uu5jm b3onmgus e5nlhep0 ecm0bbzt mg4g778l">     
                                                            <div onClick={e=>{
                                                                setState({...state,change:false})
                                                                setFilchoice({media:listfile[index].media,media_preview:listfile[index].media_preview})
                                                            }} aria-label="" className={`${time>=listfile[index].duration-1?'disabled':''} oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm`} role="button" tabindex="0">
                                                                <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329">                                                                       
                                                                    <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/NevcpXBoZny.png)`, backgroundPosition: '0px -399px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div></>
                                                    }
                                                </div></>
                                                }
                                            </div>:''}
                                            </>)}
                                            </>:''}
                                        </div>:''}
                                        </>
                                        )}
                                    </>}
                                </div>
                            </div>
                            <div className="facebook-edit-bottom bg-white">
                                <div className='flex'>
                                    <div onClick={e=>setState({...state,edit:false})} className="border-8 p-0-16 mr-8 btn btn-light">Hủy</div>
                                    <div onClick={e=>submit(e)} className={`border-8 p-0-16 ${listtags.length!=listfile[index].tags.length || percent.height<100 || listfile[index].pre_note!=listfile[index].note || percent.width<100 || (filechoice && filechoice.media_preview && filechoice.media_preview!=listfile[index].media_preview)?'':'disabled'} s1i5eluu btn btn-primary`}>
                                       <span className="bwm1u5wc ni8dbmo4 stjgntxs"> Lưu</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="facebook-edit-file-container">
                            <div className="facebook-edit-file-wrap">
                                <div  className="facebook-edit-file">
                                    {!listfile[index].media_preview?
                                    <div style={{height:`${file.height<300?file.height:file.height>file.width?360:300}px`}} ref={fileedit} onClick={e=>setaddtagfile(e)} className="facebook-edit-image">
                                        {listfile.length>0 ?
                                        <>
                                        {!state.disabled?
                                        <ReactCrop
                                        crop={crop}   
                                        
                                        disabled={state.disabled}
                                        onChange={(crop, percentCrop) => {
                                            setPercent(percentCrop)
                                            setCrop(crop)}}
                                        onComplete={(c) => setCompletedCrop(c)}
                                      >
                                        <img
                                          ref={imgRef}  
                                          alt="Crop image"
                                          onLoad={onImageLoad}
                                          src={listfile[index].media}
                                          style={{ maxHeight:`${file.height<300?file.height:file.height>file.width?360:300}px`,transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                          
                                        />
                                      </ReactCrop>:<img
                                          ref={imgRef}
                                          alt="Crop image"
                                          onLoad={onImageLoad}
                                          src={listfile[index].media}
                                          style={{maxHeight:`${file.height<300?file.height:file.height>file.width?360:300}px`, transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                          
                                        />}</>:''}
                                        {addtagfile?<>
                                        <div className="file-tag-position" style={{position:'absolute',top:`calc(${addtagfile.top}% - 30px)`,left:`${addtagfile.left}%`,transform:`translate(-50%, 0px)`}}></div>
                                        <div className="facebook-add-tag-file" style={{position:'absolute',top:`calc(${addtagfile.top}% + 40px)`,left:`${addtagfile.left}%`,transform:`translate(-50%, 0px)`}}>
                                            <div onClick={e=>e.stopPropagation()} className="facebook-input-tag">
                                                <div className="flex flex-center">
                                                    <div>
                                                        <i data-visualcompletion="css-img" className="hu5pjgll mr-4 cwsop09l" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-51px -109px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                    </div>
                                                    <input spellCheck={false} onChange={e=>{setText(e.target.value)
                                                        const value=e.target.value
                                                        fetchkeyword(value)
                                                    }} value={text} />
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <ul className="facebook-file-tags">
                                                    {listuser.map((item,i)=>
                                                    <li onClick={(e)=>setlisttags(e,item)} key={i} className="facebook-tag">
                                                        <div className="facebook-tag-avatar">
                                                            <img width='36' src={originurl+item.avatar}/>
                                                        </div>
                                                        <div>{item.name}</div>
                                                    </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div></>
                                        :""}
                                        {action!='tag'?'':<>
                                        {listtags.map((item,i)=>
                                            <div key={i} className="facebook-tag-user-file" style={{position:'absolute',top:`calc(${item.top}% + 40px)`,left:`${item.left}%`,transform:`translate(-50%, 0px)`}}>
                                                <div className="flex flex-center item-space">
                                                    <div className="mr-4">{item.name}</div>
                                                    <div onClick={(e)=>removetag(e,item)} className="facebook-item-close">
                                                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '0px -92px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                                    </div>
                                                </div>
                                                <div className="d06cv69u cdcbzqsl goun2846 ccm00jje s44p3ltw mk2mc5f4 tl61u9r6 bcctvi4p gcjuebxg kvs4odcb hzruof5a pmk7jnqg et4y5ytx np69z8it bssd97o4 n4j0glhw h9efg1rk" style={{transform: `translate(0px, 7px) rotate(-45deg)`}}></div>
                                            </div>
                                        )}</>}
                                    </div>
                                    :<>
                                    <div  className="apxknhg1">
                                        <video ref={videoref} style={{display: 'block'}} className="k4urcfbm r0294ipz datstx6m"  controls={true}  src={listfile[index].media}></video>
                                        
                                    </div>
                                    {listfile[index].listimages.length>0 && actionchange==3?
                                    <div className="c55xq0r4 pmk7jnqg kfkz5moi cj5g2342 k4urcfbm">
                                        <div className="l9j0dhe7">
                                            <div className="g6srhlxm epj6itk9 trx93iar rce73xky kah54v4u jk6sbkaj kdgqqoy6 ihh4hy1g qttc61fc hp8pqdm5 gf6cdtck g0qnabr5">
                                                {listfile[index].listimages.map((item,i)=>
                                                    <img key={i} onClick={e=>{setFilchoice(item)
                                                        videoref.current.currentTime=item.time
                                                    }} className={`${filechoice.media==item.media?'file-active':''} enqfppq2 cg1f0npj`} src={item.media_preview}/>
                                                )}
                                            </div>
                                        </div>
                                    </div>:''}
                                    </>

                                    }
                                </div>
                                <div onClick={()=>setIndex(index-1<=0?0:index-1)} className={`bnt-action ${index==0?'btn-disabled':''} btn-preview`}>
                                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: '0px -100px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                    </div>
                                    <div onClick={()=>setIndex(index+1>=listfile.length-1?listfile.length-1:index+1)} className={`bnt-action ${index>=listfile.length-1?'btn-disabled':''} bnt btn-next`}>
                                        <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png)`, backgroundPosition: '-83px -13px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
            {actionform=='edit'?"":
            <div className="dwg5866k pybr56ya ph5uu5jm f10w8fjw b3onmgus">
                <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw bkfpd7mw gs1a9yip owycx6da btwxx1t3 d1544ag0 tw6a2znq jb3vyjys b5q2rw42 lq239pai mysgfdmx hddg9phg">
                    <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz p8fzw8mz pcp91wgn iuny7tx3 ipjc6fyt">
                        <input spellCheck={false} ref={inputfile} onChange={e=>previewFile(e)} accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv" className="mkhogb32" multiple={true} type="file"/>
                        <div onClick={(e)=>inputfile.current.click()} aria-label="Thêm ảnh/video" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                            <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq g5ia77u1 tv7at329">
                                <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                    <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                        <i data-visualcompletion="css-img" className="hu5pjgll op6gxeva" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/fzpi9XpCJQR.png)`, backgroundPosition: '0px -352px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                    </div>
                                    <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                        <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p knomaqxo" dir="auto">
                                        <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Thêm ảnh/video</span>
                                        </span>
                                    </div>
                                </div>
                            <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                        </div>
                    </div>
                </div>
                <div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz p8fzw8mz pcp91wgn iuny7tx3 ipjc6fyt">
                    <div onClick={(e)=>updatefile(e)} aria-label="Xong" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
                        <div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv tkv8g59h fl8dtwsd s1i5eluu tv7at329">
                            <div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
                                <div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
                                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p bwm1u5wc" dir="auto">
                                        <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Xong</span>
                                    </span>
                                </div>
                            </div>
                            <div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>} 
        </div>
    )
}
export default Fileedit