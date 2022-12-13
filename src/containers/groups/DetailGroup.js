import axios from "axios"
import { useEffect,useState,useRef,useMemo } from "react"
import { useSearchParams,useParams, Link ,useNavigate} from "react-router-dom"
import { headers,uploadpost } from "../../actions/auth"
import { listaction,listchoice } from "../../constants"
import Tabs from "../../hocs/Tabs"
import { creategroupURL,groupdetailURL, originurl } from "../../urls"
import Navbar from "../Navbar"
import GroupSibar from "./GroupSibar"
import {connect} from "react-redux"
import styles from "./groups.module.css"


const listicon=[
    {name:'Thước phim',src:"https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/XiFjrSJS55q.png",position:'0px 0px'},
    {name:'Ảnh/Video',src:"https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/BldLbpBsWmr.png",position:'0px -225px'},
    {name:'Phòng họp mặt',src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/TSlHjWTGU73.png",position:'0px -50px'},
]
const Detailgroup=(props)=>{
    const {user}=props
    const {id}=useParams()
    const [group,setGroup]=useState()
    const inputfile=useRef()
    const navigate=useNavigate()
    const [formdata,setFormdata]=useState()
    const [loading,setLoading]=useState(false)
    const [choice,setChoice]=useState('viewer')
    const list_item=useMemo(()=>[{name:"Thảo luận",value:'discuss',url:`/groups/${id}`},
    {name:'Chủ đề',value:'subject',url:`/groups/${id}/hashtags`},
    {name:'Khác',value:'orther',option:true},
    {name:'Thành viên',value:'members',hide:true,url:`/groups/${id}/people`},
    {name:'File',value:'file',hide:true,url:`/groups/${id}/files/files`},
    {name:'File phương tiện',value:'media',hide:true,url:`/groups/${id}/media`},
    ],[])

    return(
        <>
        <Navbar/>
        
        <div className="container container-groups">
            
            <GroupSibar/>
            <div className="group-container">
                <div className="group-header item-space">
                    <div className={styles.listitem}>
                        {list_item.map((item,i)=>
                            <div onClick={e=>navigate(item.url)} key={i} className={`header-item item-center item-sapce ${item.option?'item-option':''} ${item.hide?'item-hiden':''} ${item.url==window.location.pathname?'bg-blue':'btn-second'}`}>
                                <span>{item.name}</span>
                                {item.option?
                                <i>
                                    <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" class="b6ax4al1 m4pnbp5e somyomsx ahndzqod g8r5yzqk eohcrkr5 akh3l2rg"><path d="M10 14a1 1 0 0 1-.755-.349L5.329 9.182a1.367 1.367 0 0 1-.205-1.46A1.184 1.184 0 0 1 6.2 7h7.6a1.18 1.18 0 0 1 1.074.721 1.357 1.357 0 0 1-.2 1.457l-3.918 4.473A1 1 0 0 1 10 14z"></path></svg>
                                </i>:''}
                            </div>
                        )}
                    </div>
                    <div className="item-center">
                        <div className="item-center icon-search bg-blue btn-add-friend">
                            <i className="svg-icon mr-1_2">
                                <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" class="b6ax4al1 m4pnbp5e somyomsx ahndzqod d1w2l3lo eohcrkr5 akh3l2rg"><g fill-rule="evenodd" transform="translate(-446 -350)"><g fill-rule="nonzero"><path d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z" transform="translate(354.5 159.5)"></path><path d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z" transform="translate(354.5 159.5)"></path></g></g></svg>
                            </i>
                            <span className="text-primary">Tạo bài viết</span>
                        </div>
                        <div className="btn-light btn-small icon-search item-center ">
                            <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/5pxSqp5kDkP.png)`, backgroundPosition: '-170px -147px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                        </div>
                    </div>
                </div>
                <div className="content-wrapper">
                    {user?
                    <div className="box-container t1fg2s7t poaa5t79">
                        <div className="flex avatar-wrapper flex-center">
                            <div className={`${styles.avatar} mr-1_2`}>
                                <img className="avatar__image" src={user.avatar}/>
                            </div>
                            <div className={`${styles.search} flex-1`}>
                                <span>Bạn viết gì đi...</span>
                            </div>
                        </div>
                        <div className={styles.separator}></div>
                        <div className="flex px-1 pb-10 flex-center">
                            {listicon.map((item,i)=>
                            <div key={i} className={styles.item}>
                                <div className={styles.icon}>
                                    <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style={{backgroundImage: `url(${item.src})`, backgroundPosition: item.position, backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                                <div className={styles.name}>{item.name}</div>
                            </div>
                            )}
                        </div>
                    </div>:''}
                    <div className="box-container t1fg2s7t poaa5t79">
                        <div className="item-space box-header">
                            <div className={`flex flex-center mr-1_2`}>
                                <div className="mr-1">Đáng chú ý</div>
                                <div className="icon-action">
                                    <i data-visualcompletion="css-img" class="gneimcpu oee9glnz" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/PbuXOm_pOeh.png)`, backgroundPosition: '-21px -108px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                                
                            </div>
                            <div className={`btn-link`}>
                                Thêm
                            </div>
                        </div>
                        <div className="flex px-1 pb-10 flex-center">
                            <div className="card">
                                <div>
                                    <i data-visualcompletion="css-img" aria-label="alt" class="" role="img" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/P3VA0JQmI2d.png)`, backgroundPosition: '0px 0px', backgroundSize: 'auto', width: '310px', height: '127px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                                <div>
                                    <div>
                                        <span>Nêu bật những điều đáng chú ý nhất trong nhóm</span>
                                    </div>
                                    <div>Nêu bật những điều đáng chú ý nhất trong nhóm ở một nơi thuận tiện mà bạn có thể ghim bài viết, hashtag và quy tắc.</div>
                                    <Link to="/help">Tìm hiểu thêm</Link>
                                </div>
                                <div className={styles.separator}></div>
                                <div>Chỉ quản trị viên và người kiểm duyệt mới xem được nội dung này.</div>
                                <div>
                                    <i data-visualcompletion="css-img" class="gneimcpu ln9jdtaq" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/xjV4j8zXH-H.png)`, backgroundPosition: '-34px -147px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                </div>
                            </div>
                            <div className="card">
                                <div className="item-space">
                                    <div>Sự kiện</div>
                                    <div className="icon-action">

                                    </div>
                                </div>
                                <div>Những sự kiện được tạo hoặc chia sẻ sẽ hiển thị trong thẻ này.</div>
                                <div>
                                    <div className="image-card">
                                        <img width="100%" height="100%" src="https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/OdWhKHwbKYj.png"/>
                                    </div>
                                </div>
                                <div className="item-center bg-blue btn-add-friend">
                                    <div className="svg-icon mr-1_2">
                                        <svg fill="currentColor" viewBox="0 0 12 13" width="1em" height="1em" class="b6ax4al1 m4pnbp5e somyomsx ahndzqod d1w2l3lo eohcrkr5 akh3l2rg"><g fill-rule="evenodd" transform="translate(-450 -1073)"><path d="M461 1080.24c0 .144-.112.26-.25.26h-2a.255.255 0 0 1-.25-.26v-1.98c0-.144.112-.26.25-.26h2c.138 0 .25.116.25.26v1.98zm0 2.7c0 .862-.671 1.56-1.5 1.56h-.75a.255.255 0 0 1-.25-.26v-2.48c0-.144.112-.26.25-.26h2c.138 0 .25.116.25.26v1.18zm-7.25-6.44h4.5v-1h-4.5v1zm3.75 3.74c0 .144-.112.26-.25.26h-2.5a.255.255 0 0 1-.25-.26v-1.98c0-.144.112-.26.25-.26h2.5c.138 0 .25.116.25.26v1.98zm0 4c0 .144-.112.26-.25.26h-2.5a.255.255 0 0 1-.25-.26v-2.48c0-.144.112-.26.25-.26h2.5c.138 0 .25.116.25.26v2.48zm-4-4c0 .144-.112.26-.25.26h-2a.255.255 0 0 1-.25-.26v-1.98c0-.144.112-.26.25-.26h2c.138 0 .25.116.25.26v1.98zm0 4c0 .144-.112.26-.25.26h-.75c-.829 0-1.5-.698-1.5-1.56v-1.18c0-.144.112-.26.25-.26h2c.138 0 .25.116.25.26v2.48zm6-10.74h-7a2.503 2.503 0 0 0-2.5 2.5v7c0 1.378 1.121 2.5 2.5 2.5h7c1.379 0 2.5-1.122 2.5-2.5v-7c0-1.378-1.121-2.5-2.5-2.5z"></path></g></svg>
                                    </div>
                                    <span>Tạo sự kiện</span>
                                </div>
                                <div className={styles.separator}></div>
                                <div>Chỉ quản trị viên và người kiểm duyệt mới xem được nội dung này.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user
});

export default connect(mapStateToProps,{uploadpost})( Detailgroup);
