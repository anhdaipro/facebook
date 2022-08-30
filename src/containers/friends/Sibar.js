import { Link } from "react-router-dom"
import { originweb } from "../../constants"
import styles from "./sibar.module.css"

const listitem=[
    {name:'Trang chủ',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png',position:`-126px -132px`,url:`/friend`},
    {name:'Lời mời kết bạn',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/258MsptFNEE.png',position:`0px -746px`,option:true,url:`/friend/requests`},
    {name:'Gợi ý',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/258MsptFNEE.png',position:`0px -725px`,option:true,url:`/friend/suggestions`},
    {name:'Tất cả bạn bè',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/RflY1jeNSn4.png',position:`0px -50px`,option:true,url:`/friend/list`},
    {name:'Sinh nhật',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/258MsptFNEE.png',position:`0px -767px`,url:`/friend/birthdays`},
    {name:'Danh sách tùy chỉnh',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/RflY1jeNSn4.png',position:`0px -50px`,option:true,url:`/friend/friendlist`},
    
    ]
const Sibar=()=>{
    return(
        <div className="sibar-wrapper">

            <div className={styles.header}>
                <h1 className={styles.title}>Bạn bè</h1>
                <div className="icon-setting">
                    <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/wi7d5lDooXC.png)`, backgroundPosition: `0px -394px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: `inline-block`}}></i>
                </div>
            </div>
            <div className={styles.list_item}>
                {listitem.map((item,i)=>
                    <Link to={`${item.url}`}>
                        <div key={i} className={styles.item}>
                            <div className="flex flex-center">
                                <div className={`${styles.icon} ${window.location.pathname==item.url?`icon-active`:''}`}>
                                    <i data-visualcompletion="css-img" class={`gneimcpu ${window.location.pathname==item.url?'active':''}`} style={{backgroundImage: `url(${item.src})`, backgroundPosition: `${item.position}`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: `inline-block`}}></i>
                                </div>
                                <div className={styles.name}>{item.name}</div>
                            </div>
                            {item.option?
                            
                            <div class="alzwoclg">
                                <i data-visualcompletion="css-img" class="gneimcpu oee9glnz" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/zbB3v_l5XEp.png)`, backgroundPosition: `-147px -111px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            </div>
                            :''}
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}
export default Sibar