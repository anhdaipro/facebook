import { Link } from "react-router-dom"
import Navbar from "../Navbar"

const Formgroup=()=>{
    return(
        <div>
            <Navbar/>
            <div className="container">
                <div className="sibar-wrapper">
                    <div className={styles.header}>
                        <span>
                            <Link to="/group/feed">
                                
                            </Link>
                        </span>
                        <span> {'>'} </span>
                        <span>Tạo nhóm</span>
                    </div>
                    <h1>Tạo nhóm</h1>
                    <div className={styles.item}>
                        <div className={`avatar`}>
                            <img src={item.avatar} className="avatar__image"/>
                        </div>
                        <div>
                            <div className={styles.name}></div>
                            <div className={styles.info}>quản trị viên</div>
                        </div>
                    </div>
                    <div>
                        <span>Tên nhóm</span>
                        <input type="text" value maxLength="75" />
                    </div>
                    <div>
                        <div>Chọn quyền riêng tư</div>
                        <div>
                            <i data-visualcompletion="css-img" class="gneimcpu b0w474w7" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/xjV4j8zXH-H.png&quot;); background-position: -17px -164px; background-size: auto; width: 16px; height: 16px; background-repeat: no-repeat; display: inline-block;"></i>
                        </div>
                    </div>
                    <div>
                        <span>Mời bạn bè</span>
                        <input type="text" value maxLength="75" />
                    </div>
                </div>
            </div>
        </div>
    )
}