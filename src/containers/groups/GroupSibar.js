import axios from "axios"
import { useEffect,useState,useRef,useMemo } from "react"
import { useSearchParams,useParams, Link } from "react-router-dom"
import { headers,uploadpost } from "../../actions/auth"
import { listaction,listchoice } from "../../constants"
import Tabs from "../../hocs/Tabs"
import { creategroupURL,groupdetailURL, originurl } from "../../urls"
import styles from "./groups.module.css"
const listitem=[{name:'Trang chủ của cộng đồng',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/ptKuwmqcVlp.png',position:'0px -109px'},
{name:'Phòng họp mặt',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Fwyn4ouHxiB.png',position:'0px 0px'},
{name:'Sự kiện',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/1AXy1fubVbE.png',position:'0px -347px'}
]
const GroupSibar=(props)=>{
    const {id}=useParams()
    const [group,setGroup]=useState()
    const inputfile=useRef()
    const [formdata,setFormdata]=useState()
    const [loading,setLoading]=useState(false)
    const [choice,setChoice]=useState('viewer')
    useEffect(()=>{
        ( async () =>{
            const res = await axios.get(`${groupdetailURL}/${id}`,headers)
            setGroup(res.data)
            setFormdata({...res.data,members:[]})
            setLoading(true)
        })()
    },[id])
    
    const previewFile=(e,name)=>{ 
        [].forEach.call(e.target.files, function(file) {
			var image = new Image();
  			image.src = (window.URL || window.webkitURL).createObjectURL(file)
			image.onload = function () {
			var height = this.height;
			var width = this.width;
			console.log(height)
			if (height < 360 || width < 600) {
				alert("Please choice bigger image.");
				return false;
			}
            setFormdata({...formdata,image_cover:(window.URL || window.webkitURL).createObjectURL(file),file:file})
			};
        })  
    }
    const saveimage=(e)=>{
        ( async () =>{
            let form =new FormData()
            Object.keys(formdata).map(item=>{
                form.append(item,formdata[item])
            })
            setGroup({...group,image_cover:formdata.image_image_cover})
            const res = await axios.post(`${groupdetailURL}/${id}`,form,headers)
            setFormdata({...formdata,file:null})
        })()
    }
    return(
        <>
        {formdata?
        <div className="sibar-wrapper">
            <div className={styles.image_cover}>
                <img className="avatar__image" src={formdata.image_cover||'https://res.cloudinary.com/dupep1afe/image/upload/v1662431672/groups-default-cover-photo-2x_ihiq4a.png'}></img>
                {!formdata.file?
                <div onClick={()=>inputfile.current.click()} className={`item-center ${styles.icon_file}`}>
                    <i data-visualcompletion="css-img" class="gneimcpu mr-4 b0w474w7" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/BldLbpBsWmr.png)`, backgroundPosition: '0px -457px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                    <span>Chỉnh sửa</span>
                </div>:
                <div className={styles.list_action}>
                    <div onClick={()=>setFormdata({...formdata,file:null,image_cover:group.image_cover})} className="btn-light btn-gray flex-1 mr-1 item-center"><span className="text-white">Hủy</span></div>
                    <div onClick={e=>saveimage(e)} className="item-center flex-1 btn-primary"><span className="text-white">Lưu thay đổi</span></div>
                </div>}
                <input onChange={e=>previewFile(e)} ref={inputfile} accept="image/*,image/heif,image/heic" className="mkhogb32" type="file"/>
            </div>
            <div className="p-1">
                <h1 className={``}>{group.group_name}</h1>
                <span className="flex flex-center"><div>Quyền riêng tư của nhóm</div><div style={{width:'10px'}}>:</div><div>1 thành viên</div></span>
            </div>
            <div className="item-space px-1">
                <div className="btn-primary flex-1 mr-1 item-center"> 
                    <i data-visualcompletion="css-img" class="gneimcpu mr-1_2 ln9jdtaq" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/1AXy1fubVbE.png)`, backgroundPosition: '0px -1496px' , backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                    <span>Mời</span>
                </div>
                <div className="icon-action">
                    <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/xjV4j8zXH-H.png)`, backgroundPosition: '-68px -147px' , backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                </div>
            </div>
            <div className="">
                <div className="tabs">
                <Tabs
                    listchoice={listchoice}
                    choice={choice}
                    loading={loading}
                    setchoice={data=>setChoice(data)}
                />
                </div>
                <div className={styles.list_item}>
                    {listitem.map((item,i)=>
                    <div key={i} className={styles.item}>
                        <div className={styles.icon}>
                            <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(${item.src})`, backgroundPosition: item.position, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                        <div className={styles.name}>{item.name}</div>
                    </div>
                    )}
                    
                </div>
            </div>
        </div> :''}
        </>
    )
}
export default GroupSibar