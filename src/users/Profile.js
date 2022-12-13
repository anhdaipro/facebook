import Navbar from "../containers/Navbar"
import Postcreate from "./Postcreate"
import axios from 'axios';
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import { headers,expiry,updatenotify,showchat } from '../actions/auth';
import {uploadfileURL,originurl,uploadstoryURL,profileURL,actionfriendURL} from "../urls"
import {connect} from "react-redux"
import { useNavigate,useParams,Link } from "react-router-dom"
import { dataURLtoFile, number,actionfriend } from "../constants";
import Draggable from "../hocs/useDraggable";
import * as htmlToImage from 'html-to-image';
import io from "socket.io-client"

const Profile=(props)=>{
    const {user,isAuthenticated,showchat}=props
    const {username}=useParams()
    const navigate=useNavigate
    const [state,setState]=useState({addpost:false,editbio:false,complete:false,cut:false})
	const [showaction,setShowaction]=useState(false)
	const [offset, setOffset] = useState({ dx: 0, dy: 0,scale:0.29297,rotate:0 });
	const fileavataref=useRef()
	const avatar=useRef()
	const [action,setAction]=useState()
	const fileimagecover=useRef()
	const socket=useRef()
    const setstate=(data)=>{
        setState(data)
    }
    const [profile,setProfile]=useState()
    const [formdata,setFormData]=useState({story:'',name:''})

	useEffect(() => { 
        socket.current=io.connect('https://server-socket-123.herokuapp.com')
        return () => socket.current.disconnect()
    },[])

    useEffect(()=>{
        (async ()=>{
            try{
                await isAuthenticated
                const res= await axios.get(`${profileURL}/${username}`,headers)
                setProfile(res.data)
				setFormData(res.data)
            }
            catch (e){
                console.log(e)
            }
        })()
    },[username])

	const editprofile=(e,name,name_choice,value)=>{
		(async ()=>{
			try{
				let form =new FormData()
				form.append(name,value)
				const res =await axios.post(`${profileURL}/${username}`,form,headers)
				const data=res.data.action
				setProfile({...profile,...data,[name_choice]:null})
				setFormData({...formdata,[name_choice]:null})
			}
			catch(e){
				console.log(e)
			}
		})()
	}
	const previewFile=(e,name)=>{ 
        [].forEach.call(e.target.files, function(file) {
			var image = new Image();
  			image.src = (window.URL || window.webkitURL).createObjectURL(file)
			if(name=='cover_image_file'){
				image.onload = function () {
				var height = this.height;
				var width = this.width;
				console.log(height)
				if (height < 360 || width < 600) {
					  alert("Please choice bigger image.");
					  return false;
					}
					setProfile({...profile,[name]:(window.URL || window.webkitURL).createObjectURL(file)})
					setFormData({...formdata,[name]:file})
				};
			}
			else{
			setProfile({...profile,[name]:(window.URL || window.webkitURL).createObjectURL(file)})
			setFormData({...formdata,[name]:file})
			}
        })  
    }
	const setoffset=(data)=>{
		const {dx,dy,scale}=data
		const scales={scale:scale<=0.29297?0.29297:scale>=2.29297?2.29297:scale}
        setOffset({...offset,dx:dx,dy:dy,...scales})
		
    }
	const editavatar=(e)=>{
		htmlToImage.toCanvas(avatar.current)
        .then(function(canvas) {
			let image = canvas.toDataURL("image/png");
			let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
			editprofile(e,'avatar','avatar_file',file_preview)
			
		})
	}
	const actionprofile=(e)=>{
		e.preventDefault()
        let data={member:[profile.user_id,user.id]}
        showchat(data)
	}
	console.log(user)
	const actionfriendref=useRef()
	useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [user,profile])

    const handleClick = (event) => {
        const { target } = event
        if(actionfriendref.current!=null && user.id!=profile.user_id){
            if (!actionfriendref.current.contains(target)) {
                setShowaction(false)
            }
        }
    }
	const setactionfriend=(e,action)=>{
		(async ()=>{
			try{
				setAction(action)
				if(action!="edit"){
					const form={action:action,receiver_id:profile.user_id}
					console.log(form)
					const res= await axios.post(actionfriendURL,JSON.stringify(form),headers)
					if(res.data.action.friend_invitation && user.id!=profile.user_id){
						socket.current.emit("sendNotifi",res.data.listnotifications)
					}
					setProfile({...profile,...res.data.action})
				}
				else {
				}
			}
			catch(e){
				console.log(e)
			}
		})()
	}
	
    return(
		<>
        <div id="main">
            <Navbar/>
            <div className="container-profile">
				{profile && user?
				<>
                <section className="cover-image-section">		
                    <header className="cover-hader-site">	
                        <img src={profile.cover_image_file?profile.cover_image_file:profile.cover_image}/>
                        {formdata.cover_image_file?
						<div className="action-image-cover">
							<div className="mr-4">	
								<div onClick={e=>editprofile(e,'cover_image','cover_image_file',formdata.cover_image_file)} className="flex profile-action-story s1i5eluu flex-center ">		
									<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">		
										<span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Lưu thay đổi</span>			
									</div>
									<div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
								</div>
							</div>
                            <div onClick={e=>{
								setProfile({...profile,cover_image_file:null})
								setFormData({...formdata,cover_image_file:null})}} aria-label="Chỉnh sửa trang cá nhân" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
								<div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329">
									<div className="flex flex-center bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
										<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">											
											<span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Hủy</span>											
										</div>
									</div>
									<div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
								</div>
							</div>
						</div>:''}
						<div className="cover-image-div">
                            <div onClick={e=>fileimagecover.current.click()} className="cover-image-edite-btn">
                                <button>
								<i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: '0px -1372px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                                    Edit Covar Photo
                                </button>
                            </div>
							<input onChange={e=>previewFile(e,'cover_image_file')} ref={fileimagecover} accept="image/*,image/heif,image/heic" className="mkhogb32" type="file"/>
                        </div>

                    </header>
                </section>

                <section className="profile-section">
                    <div className="profile-section-in">
                        
                        <div className="profile-image-site">
                            <div className="profile-image-div">
                                <a href="#" id="profile-link">
                                    <img id="Profile_images" src={profile.avatar_file?profile.avatar_file: profile.avatar}/>
                                </a>
                                <span onClick={e=>fileavataref.current.click()} className="fas fa-camera">
								<i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png)`, backgroundPosition: '0px -544px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
								</span>
								<input onChange={e=>previewFile(e,'avatar_file')} ref={fileavataref} accept="image/*,image/heif,image/heic" className="mkhogb32" type="file"/>
                            </div>
                        </div>
                        <div className="profile-name-info">
                            <h1>
                                <span className="pro-txt" id="profile_name">MD Mehedi Hasan</span>
                                <span id="nik-name"></span>
                            </h1>
					    <p>
                            <span className="fir-count-txt">
                                <span id="friend_count">{number(profile.count_friend)}</span> Friends
                            </span>
                        </p>

                        <div className="friends-img-div">
                            {profile.mutual_friends.listfriend.map(item=>
                            <div className="firend-img a">
                                <img id="frind-image-1" src={ item}/>
                            </div>
							)}
                            
                        </div>

                    </div>
                    <div className="profile-button-site">
                        <div className="btn-site-pro flex">
							<div className="mr-4">
								{user.id==profile.user_id?
								<Link aria-label="Thêm vào tin" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl" to="/stories/create" role="link" tabindex="0" waprocessedanchor="true">
									<div className="flex profile-action-story s1i5eluu flex-center ">
										<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
											<img className="hu5pjgll eb18blue" src="https://static.xx.fbcdn.net/rsrc.php/v3/yp/r/bR3-u2s-xwG.png" alt="" height="16" width="16"/>
										</div>
										<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
											<span className="a8c37x1j bwm1u5wc ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Thêm vào tin</span>
										</div>
										<div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
									</div>
								</Link>:
								<div ref={actionfriendref} aria-label={user.id==profile.user_id?'Chỉnh sửa trang cá nhân':''} className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
									<div onClick={e=>{
										if(profile.friend){
										setShowaction(!showaction)
										}
										else{
											setactionfriend(e,'friend_invitation')
										}
									}} className={`l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq ${user.id!=profile.user_id?'tdjehn4e':'s1i5eluu'} tv7at329`}>
										<div className="flex flex-center bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
											<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
												<img className="hu5pjgll lzf7d6o1" src={profile.friend?'https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/5nzjDogBZbf.png':profile.friend_invitation?'https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/Qg9sXPTnmFb.png':'https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/Mlt-gKEc17f.png'} alt="" height="16" width="16"/>
											</div>
											<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
												<span className="a8c37x1j a57itxjd ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">{profile.friend?'Bạn bè':profile.friend_invitation?'Hủy yêu cầu':'Thêm Bạn bè'}</span>	
											</div>
										</div>
										{showaction && profile.friend?
										<div className="drop-down" style={{width:'200px',marginTop:'8px'}}>
											<div className="p-8">
												<div className="">
													{actionfriend.map((item,i)=>
													<div key={i} onClick={(e)=>setactionfriend(e,item.action)} class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz p7hjln8o esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 rq0escxv nhd2j8a9 j83agx80 btwxx1t3 pfnyh3mw opuu4ng7 kj2yoqh6 kvgmc6g5 oygrvhab l9j0dhe7 i1ao9s8h du4w35lb bp9cbjyn cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr" role="menuitem" tabindex="0">
														<div class="bp9cbjyn tiyi1ipj j83agx80 taijpn5t tvfksri0">
															{item.position?
															<i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/ly3Zmqiw05t.png)`, backgroundPosition: '0px -105px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>:
															<img class="hu5pjgll lzf7d6o1" src={item.src} alt="" height="20" width="20"/>}
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
												<div class="d06cv69u cdcbzqsl goun2846 ccm00jje s44p3ltw mk2mc5f4 tl61u9r6 bcctvi4p gcjuebxg kvs4odcb hzruof5a pmk7jnqg et4y5ytx np69z8it bssd97o4 n4j0glhw j9ispegn" style={{transform: `translate(118.562px, 7px) rotate(-45deg)`}}></div>
											</div>
										</div>:''}
									</div>
								</div>
								}
							</div>
                            <div onClick={(e)=>actionprofile(e)} aria-label="Chỉnh sửa trang cá nhân" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0">
								<div className={`l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq ${user.id==profile.user_id?'tdjehn4e':'s1i5eluu'} tv7at329`}>
									<div className="flex flex-center bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
										<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
											<img className={`hu5pjgll ${user.id!=profile.user_id?'eb18blue':'lzf7d6o1'}`} src={user.id==profile.user_id?'https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/OR6SzrfoMFg.png':'https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/111xWLHJ_6m.png'} alt="" height="16" width="16"/>
										</div>
										<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
											<span className={`a8c37x1j ${user.id!=profile.user_id?'bwm1u5wc':'a57itxjd'} ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5`}>{user.id==profile.user_id?'Chỉnh sửa trang cá nhân':'Nhắn tin'}</span>
										</div>
									</div>
									<div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
								</div>
							</div>
                        </div>
                    </div>

                </div>
            </section>


            <section className="full-navbar">
                <nav className="navbar-site">
                
                    <ul compact="txt-color-c">
                        <a href="#">
                            <li className=" txt-cc activ-navbar">Posts</li>
                        </a>
                        <a href="#">
                            <li className=" txt-cc">About</li>
                        </a>
                        <a href="#">
                            <li className=" txt-cc">Friends</li>
                        </a>
                        <a href="#" id="photo-nav">
                            <li className=" txt-cc">Photo</li>
                        </a>
                        <a href="#" id="video-nav">
                            <li className=" txt-cc">Video</li>
                        </a>
                        <a href="#" id="likes-nav">
                            <li className=" txt-cc">Likes</li>
                        </a>
                        <a href="#">
                            <li className=" txt-cc">More <i className="fas fa-caret-down"></i></li>
                        </a>
                    </ul>

                    <div className="nav-btn">
                        <i className="fas fa-ellipsis-h"></i>
                    </div>

                </nav>

		    </section>

            <section className="post-section">
                <div className="post-section-in">
                    
                    <section className="info-section">
                        
                        <div className="profile-lock-div">
                            <div className="icon-pld">
                                <i className="fab fa-keycdn"></i>
                            </div>
                            <div className="pld-text">
                                <h3>You locked your profile</h3>
                                <a href="#">Learn More</a>
                            </div>
                        </div>

                        <div className="about-info">
                            <h4>Intro</h4>

                            <p id="bio-text">{profile.story}</p>
                            <div className={`${!state.editbio?'bio-btn-click':''}`}>
								<div className="input-story">
                                <textarea onChange={e=>{
									if(e.target.value.length<101){
									setFormData({...formdata,story:e.target.value})
									
										e.preventDefault()
									}
									}} className="input-box" type="text" value={formdata.story}> </textarea>
                                </div>
								<p className="length-count-txt"> 
                                    <span id="length-count">{formdata.story?100-formdata.story.length:100}</span> characters remaining
								</p> 
                                <div className="putlic-c-o-btn">
                                    <div>
                                        <p><span className="fas fa-globe-europe"></span> Public</p>
                                    </div>
                                     <div className="button-site-js">
                                        <button onClick={e=>setState({...state,editbio:false})} id="cencel-btn">Cancel</button>
                                        <button onClick={(e)=>{editprofile(e,'story',undefined,formdata.story)
										setState({...state,editbio:false})}} className={`${formdata.story!='' && formdata.story!=profile.story?'':'disabled'} s1i5eluu`} id="save-btn">Save</button>
									</div>
                                </div>
                            </div>
                            <button onClick={()=>setState({...state,editbio:true})} id="bio-edit-btn" className="edit-bio btn">Edit Bio</button>

						<ul>
							<li><i className="fas fa-briefcase"></i> Works at 
								<a href="#">Sad Mia</a>
							</li>

							<li><i className="fas fa-graduation-cap"></i> Went to
								<a href="#">kamarkhali high school</a>
							</li>

							<li><i className="fas fa-home"></i> Lives in 
								<a href="#">Dhaka, Bangladesh</a>
							</li>

							<li><i className="fas fa-map-marker-alt"></i> From 
								<a href="#">Faridpur, Dhaka, Bangladesh</a>
							</li>
							<li><i className="fas fa-heart"></i> Single</li>
							<li><i className="fas fa-globe"></i> <a href="#">
								sadmia.com
							</a></li>
						</ul>

						<button className="edit-bio btn">Edit Details</button>

						<div className="Hobbies-show">
							<span><i className="fas fa-laptop-code"></i> Learning to Code</span>

							<span><i className="fas fa-laptop-code"></i>Code</span>

							<span><i className="fas fa-book"></i>Learning</span>

							<span><i className="fas fa-camera-retro"></i>Photography</span>
						</div>

						<button className="edit-bio btn">Edit Hobbies</button>

						<div className="Featured-site">
							
							<div className="Featured-img-div">
								<img id="post-image-12" src="images/friends/0.jpg"/>
							</div>

							<div className="Featured-img-div">
								<img id="post-image-11" src="images/friends/0.jpg"/>
							</div>

							<div className="Featured-img-div">
								<img id="post-image-9" src="images/friends/0.jpg"/>
							</div>

							<div className="Featured-img-div">
								<img id="post-image-8" src="images/friends/0.jpg"/>
							</div>

						</div>

						<button className="edit-bio btn">Edit Featured</button>
					</div>

					<div className="box-design images-site">
													
							<span>Photos</span>

							<div className="see-all-images"><a href="#">See All Photos</a></div>

						<div className="at9-images">
							
							<div className="images-div">
								<img id="post-image-12" src="images/friends/0.jpg"/>
							</div>

							<div className="images-div">
								<img id="post-image-2" src="images/friends/0.jpg"/>
							</div>

							<div className="images-div">
								<img id="post-image-3" src="images/friends/0.jpg"/>
							</div>

							<div className="images-div">
								<img id="post-image-4" src="images/friends/0.jpg"/>
							</div>

							<div className="images-div">
								<img id="post-image-5" src="images/friends/0.jpg"/>
							</div>

							<div className="images-div">
								<img id="post-image-6" src="images/friends/0.jpg"/>
							</div>

							<div className="images-div">
								<img id="post-image-7" src="images/friends/0.jpg"/>
							</div>

							<div className="images-div">
								<img id="post-image-8" src="images/friends/0.jpg"/>
							</div>

							<div className="images-div">
								<img id="post-image-9" src="images/friends/0.jpg"/>
							</div>

						</div>

					</div>

					<div className="box-design friends-site">
													
							<span>Friends <br/> 
								<p>
									<span>
										3641
									</span> 
									Friends
								</p>
							</span>

							<div className="see-all-images"><a href="#">See All Friends</a></div>

						<div className="at9-images">
							
							<div className="images-div">
								<img id="frind-image-1" src="images/friends/0.jpg"/>
								<p><a href="#">Mehei Hasan</a></p>
							</div>

			

						</div>

					</div>

				</section>

				<section className="post-info">

					<Postcreate 
						user={user}
						statedata={state}		
						setstate={(data)=>setState(data)}
					/>

					<div className="box-design post-filter">

						<div className="filter-site">
							<span>Posts</span>
							<div className="fil-ter">
								<button><i className="fas fa-sliders-h"></i> Filters</button>

								<button><i className="fas fa-cog"></i> Manager Posts</button>
							</div>
						</div>

						<div className="list-type">
							<div className="fil-list activ-navbar">
								<i className="fas fa-bars"></i> List View
							</div>
							<div className="fil-list">
								<i className="fas fa-th-large"></i> Grid View
							</div>
						</div>
						
					</div>


					<div className="box-design post-div">
						<div className="post-infarmation">
							<div>
								<div className="profil-ing-div post-profile-img">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							</div>
							<div className="post-three-dot">
								<h2><a href="#" id="profile_name">MD Meheid Hasan</a></h2>
								<p>
									<a href="%">5d</a>
									<span>
										<i id="public-btn-i" className="fas fa-user-friends"></i>

										<div className="Select-audience">
											<div className="header-popap">
												<p className="h-pop">Select audience</p>
												<span id="popup-close-btn" className="fas fa-times"></span>
											</div>

											<div className="content-popaap">
												<ul>
													<li id="public-btn">
														<div className="icon-div">
															<i className="fas fa-globe-europe"></i>
														</div>
														<div className="text-aria">
															<h2>Public</h2>
															<p>Anyone on or off Facebook</p>
															<i id="public-li-icon" className="far fa-circle"></i>
														</div>
													</li>

													<li className="activ-li-div" id="friends-btn">
														<div className="icon-div">
															<i className="fas fa-user-friends frind-icon"></i>
														</div>
														<div className="text-aria">
															<h2>Friends</h2>
															<p>Your friends on Facebook</p>
															<i id="friends-li-icon" className="far fa-dot-circle activ-li-icon"></i>
														</div>
													</li>

													<li id="lock-btn">
														<div className="icon-div">
															<i className="fas fa-lock"></i>
														</div>
														<div className="text-aria">
															<h2 className="onlu-me">Only Me</h2>
															<i id="lock-li-icon" className="far fa-circle"></i>
														</div>
													</li>
												</ul>
											</div>
										</div>

									</span>
								</p>

								<span className="thre-dto-btn fas fa-ellipsis-h"></span>
							</div>
						</div>

							<p className="post-hader-text" id="post_h_T">Hello World.</p>
							<img id="post-image-12" className="post-images" src="images/friends/0.jpg"/>

						<div className="post-info-input">
							
							<div className="lilowow-cs">
								<div className="llw-count">
									<div className="icon-show top">
										<img src="images/icon/wow.png"/>
									</div>
									<div className="icon-show mid like-icon-bg">
										<i className="fas fa-thumbs-up"></i>
									</div>
									<div className="icon-show low love-icon-bg">
										<i className="fas fa-heart"></i>
									</div>
									<div><p className="l-count"><span>11</span></p></div>
								</div>

								<div>
									<p>
										<a href="#">1 Comments</a>

										<a href="#">1 Share</a>
									</p>
								</div>
							</div>

						</div>

						<div className="actavite">
							<div className="lcs-btn lcs-btn_i">
								<p>
									<i id="post-icon-btn_i" className="far fa-thumbs-up"></i> 
									<span id="post-icon-text_i">Like</span>
								</p>
							</div>
							<div className="lcs-btn">
								<p><i className="far fa-comment-alt"></i> Comment</p>
							</div>
							<div className="lcs-btn">
								<p><i className="fas fa-share"></i> Share</p>
							</div>
						</div>


						<div className="comment-site">
							<div className="profil-ing-div">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							<div className="comment-input">
								<input type="text" placeholder="Write a comment…"/>
								<div className="comment-icon-div">
									<div>
										<i className="far fa-grin-alt"></i>
									</div>
									<div>
										<i className="fas fa-camera"></i>
									</div>
									<div>
										<img src="images/icon/gif.jpg"/>
									</div>
									<div>
										<img src="images/icon/sticer.jpg"/>
									</div>
								</div>
							</div>
						</div>

					</div>


					<div className="box-design post-div">
						<div className="post-infarmation">
							<div>
								<div className="profil-ing-div post-profile-img">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							</div>
							<div className="post-three-dot">
								<h2><a href="#" id="profile_name">MD Meheid Hasan</a></h2>
								<p>
									<a href="%">5d</a>
									<span><i className="fas fa-user-friends"></i></span>
								</p>

								<span className="thre-dto-btn fas fa-ellipsis-h"></span>
							</div>
						</div>
							<p className="post-hader-text" id="post_h_V">Hello World.</p>
							<video id="vidio-tge" width="100%" controls>
								<source id="video-update" type="video/mp4"/>
							</video>

						<div className="post-info-input">
							
							<div className="lilowow-cs">
								<div className="llw-count">
									<div className="icon-show top">
										<img src="images/icon/wow.png"/>
									</div>
									<div className="icon-show mid like-icon-bg">
										<i className="fas fa-thumbs-up"></i>
									</div>
									<div className="icon-show low love-icon-bg">
										<i className="fas fa-heart"></i>
									</div>
									<div><p className="l-count"><span>35</span></p></div>
								</div>

								<div>
									<p>
										<a href="#">11 Comments</a>

										<a href="#">6 Share</a>
									</p>
								</div>
							</div>

						</div>

						<div className="actavite">
							<div className="lcs-btn lcs-btn_v">
								<p>
									<i id="post-icon-btn_v" className="far fa-thumbs-up"></i> 
									<span id="post-icon-text_v">Like</span>
								</p>
							</div>
							<div className="lcs-btn">
								<p><i className="far fa-comment-alt"></i> Comment</p>
							</div>
							<div className="lcs-btn">
								<p><i className="fas fa-share"></i> Share</p>
							</div>
						</div>


						<div className="comment-site">
							<div className="profil-ing-div">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							<div className="comment-input">
								<input type="text" placeholder="Write a comment…"/>
								<div className="comment-icon-div">
									<div>
										<i className="far fa-grin-alt"></i>
									</div>
									<div>
										<i className="fas fa-camera"></i>
									</div>
									<div>
										<img src="images/icon/gif.jpg"/>
									</div>
									<div>
										<img src="images/icon/sticer.jpg"/>
									</div>
								</div>
							</div>
						</div>

					</div>


					<div className="box-design post-div">
						<div className="post-infarmation">
							<div>
								<div className="profil-ing-div post-profile-img">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							</div>
							<div className="post-three-dot">
								<h2><a href="#" id="profile_name">MD Meheid Hasan</a></h2>
								<p>
									<a href="%">5d</a>
									<span><i className="fas fa-user-friends"></i></span>
								</p>

								<span className="thre-dto-btn fas fa-ellipsis-h"></span>
							</div>
						</div>

							<p className="post-text-show">
								জাভাস্ক্রিপ্ট কি? জাভাস্ক্রিপ্ট(Javascript) হচ্ছে ওয়েব এবং এইচটিএমএল-এর জন্য প্রোগ্রামিং ভাষা। প্রোগ্রামিংয়ের সাহায্যে আপনি কম্পিউটারকে দিয়ে যা করাতে চান তাই করাতে পারবেন।জাভাস্ক্রিপ্ট শেখাও অনেক সহজ। আমাদের এই জাভাস্ক্রিপ্ট টিউটোরিয়ালটি আপনাকে জাভাস্ক্রিপ্টের মৌলিক ধারণা থেকে অ্যাডভান্স লেভেলের প্রোগ্রামার হতে সাহায্য করবে।
							</p>

						<div className="post-info-input">
							
							<div className="lilowow-cs">
								<div className="llw-count">
									<div className="icon-show top">
										<img src="images/icon/wow.png"/>
									</div>
									<div className="icon-show mid like-icon-bg">
										<i className="fas fa-thumbs-up"></i>
									</div>
									<div className="icon-show low love-icon-bg">
										<i className="fas fa-heart"></i>
									</div>
									<div><p className="l-count"><span>35</span></p></div>
								</div>

								<div>
									<p>
										<a href="#">11 Comments</a>

										<a href="#">6 Share</a>
									</p>
								</div>
							</div>

						</div>

						<div className="actavite">
							<div className="lcs-btn lcs-btn_t">
								<p>
									<i id="post-icon-btn_t" className="far fa-thumbs-up"></i> 
									<span id="post-icon-text_t">Like</span>
								</p>
							</div>
							<div className="lcs-btn">
								<p><i className="far fa-comment-alt"></i> Comment</p>
							</div>
							<div className="lcs-btn">
								<p><i className="fas fa-share"></i> Share</p>
							</div>
						</div>


						<div className="comment-site">
							<div className="profil-ing-div">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							<div className="comment-input">
								<input type="text" placeholder="Write a comment…"/>
								<div className="comment-icon-div">
									<div>
										<i className="far fa-grin-alt"></i>
									</div>
									<div>
										<i className="fas fa-camera"></i>
									</div>
									<div>
										<img src="images/icon/gif.jpg"/>
									</div>
									<div>
										<img src="images/icon/sticer.jpg"/>
									</div>
								</div>
							</div>
						</div>

					</div>


					<div className="box-design post-div">
						<div className="post-infarmation">
							<div>
								<div className="profil-ing-div post-profile-img">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							</div>
							<div className="post-three-dot">
								<h2><a href="#" id="profile_name">MD Meheid Hasan</a></h2>
								<p>
									<a href="%">5d</a>
									<span><i className="fas fa-user-friends"></i></span>
								</p>

								<span className="thre-dto-btn fas fa-ellipsis-h"></span>
							</div>
						</div>

							<div className="post-background">
								<div>
									<p>আমাদের এই জাভাস্ক্রিপ্ট টিউটোরিয়ালটি আপনাকে জাভাস্ক্রিপ্টের মৌলিক ধারণা থেকে অ্যাডভান্স লেভেলের প্রোগ্রামার হতে সাহায্য করবে।</p>
								</div>
							</div>

						<div className="post-info-input">
							
							<div className="lilowow-cs">
								<div className="llw-count">
									<div className="icon-show top">
										<img src="images/icon/wow.png"/>
									</div>
									<div className="icon-show mid like-icon-bg">
										<i className="fas fa-thumbs-up"></i>
									</div>
									<div className="icon-show low love-icon-bg">
										<i className="fas fa-heart"></i>
									</div>
									<div><p className="l-count"><span>35</span></p></div>
								</div>

								<div>
									<p>
										<a href="#">11 Comments</a>

										<a href="#">6 Share</a>
									</p>
								</div>
							</div>

						</div>

						<div className="actavite">
							<div className="lcs-btn lcs-btn_bt">
								<p>
									<i id="post-icon-btn_bt" className="far fa-thumbs-up"></i> 
									<span id="post-icon-text_bt">Like</span>
								</p>
							</div>
							<div className="lcs-btn">
								<p><i className="far fa-comment-alt"></i> Comment</p>
							</div>
							<div className="lcs-btn">
								<p><i className="fas fa-share"></i> Share</p>
							</div>
						</div>


						

					</div>


					<div className="box-design post-div">
						<div className="post-infarmation">
							<div>
								<div className="profil-ing-div post-profile-img">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							</div>
							<div className="post-three-dot">
								<h2><a href="#" id="profile_name">MD Meheid Hasan</a></h2>
								<p>
									<a href="%">5d</a>
									<span><i className="fas fa-user-friends"></i></span>
								</p>

								<span className="thre-dto-btn fas fa-ellipsis-h"></span>
							</div>
						</div>
							<p className="post-hader-text" id="post_h_2I">Hello World.</p>
							<div className="post-background-img">
								<div>
									<img id="post-image-1" src="images/friends/0.jpg"/>
								</div>
								<div>
									<img id="post-image-2" src="images/friends/0.jpg"/>
								</div>
							</div>

						<div className="post-info-input">
							
							<div className="lilowow-cs">
								<div className="llw-count">
									<div className="icon-show top">
										<img src="images/icon/wow.png"/>
									</div>
									<div className="icon-show mid like-icon-bg">
										<i className="fas fa-thumbs-up"></i>
									</div>
									<div className="icon-show low love-icon-bg">
										<i className="fas fa-heart"></i>
									</div>
									<div><p className="l-count"><span>35</span></p></div>
								</div>

								<div>
									<p>
										<a href="#">11 Comments</a>

										<a href="#">6 Share</a>
									</p>
								</div>
							</div>

						</div>

						<div className="actavite">
							<div className="lcs-btn lcs-btn_2i">
								<p>
									<i id="post-icon-btn_2i" className="far fa-thumbs-up"></i> 
									<span id="post-icon-text_2i">Like</span>
								</p>
							</div>
							<div className="lcs-btn">
								<p><i className="far fa-comment-alt"></i> Comment</p>
							</div>
							<div className="lcs-btn">
								<p><i className="fas fa-share"></i> Share</p>
							</div>
						</div>


						

					</div>

					<div className="box-design post-div">
						<div className="post-infarmation">
							<div>
								<div className="profil-ing-div post-profile-img">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							</div>
							<div className="post-three-dot">
								<h2><a href="#" id="profile_name">MD Meheid Hasan</a></h2>
								<p>
									<a href="%">5d</a>
									<span><i className="fas fa-user-friends"></i></span>
								</p>

								<span className="thre-dto-btn fas fa-ellipsis-h"></span>
							</div>
						</div>
							<p className="post-hader-text" id="post_h_3I">Hello World.</p>
							<div className="post-background-img">
								<div>
									<img id="post-image-3" src="images/friends/0.jpg"/>
								</div>

								<div>
									<div className="one-or-two">
										<img id="post-image-4" src="images/friends/0.jpg"/>
									</div>
									<div className="one-or-two">
										<img id="post-image-5" src="images/friends/0.jpg"/>
									</div>
								</div>
							</div>

						<div className="post-info-input">
							
							<div className="lilowow-cs">
								<div className="llw-count">
									<div className="icon-show top">
										<img src="images/icon/wow.png"/>
									</div>
									<div className="icon-show mid like-icon-bg">
										<i className="fas fa-thumbs-up"></i>
									</div>
									<div className="icon-show low love-icon-bg">
										<i className="fas fa-heart"></i>
									</div>
									<div><p className="l-count"><span>35</span></p></div>
								</div>

								<div>
									<p>
										<a href="#">11 Comments</a>

										<a href="#">6 Share</a>
									</p>
								</div>
							</div>

						</div>

						<div className="actavite">
							<div className="lcs-btn lcs-btn_3i">
								<p>
									<i id="post-icon-btn_3i" className="far fa-thumbs-up"></i> 
									<span id="post-icon-text_3i">Like</span>
								</p>
							</div>
							<div className="lcs-btn">
								<p><i className="far fa-comment-alt"></i> Comment</p>
							</div>
							<div className="lcs-btn">
								<p><i className="fas fa-share"></i> Share</p>
							</div>
						</div>


					</div>

					<div className="box-design post-div">
						<div className="post-infarmation">
							<div>
								<div className="profil-ing-div post-profile-img">
								<a href="#" id="profile-link">
									<img id="Profile_images" src="images/friends/00.jpg"/>
								</a>
							</div>
							</div>
							<div className="post-three-dot">
								<h2><a href="#" id="profile_name">MD Meheid Hasan</a></h2>
								<p>
									<a href="%">5d</a>
									<span><i className="fas fa-user-friends"></i></span>
								</p>

								<span className="thre-dto-btn fas fa-ellipsis-h"></span>
							</div>
						</div>
							<p className="post-hader-text" id="post_h_4I">Hello World.</p>
							<div className="post-background-img">
								<div>
									<div className="one-or-two">
										<img id="post-image-6" src="images/friends/0.jpg"/>
									</div>
									<div className="one-or-two">
										<img id="post-image-7" src="images/friends/0.jpg"/>
									</div>
								</div>

								<div>
									<div className="one-or-two">
										<img id="post-image-8" src="images/friends/0.jpg"/>
									</div>
									<div className="one-or-two">
										<img id="post-image-9" src="images/friends/0.jpg"/>
									</div>
								</div>
							</div>

							<div className="post-info-input">
								
								<div className="lilowow-cs">
									<div className="llw-count">
										<div className="icon-show top">
											<img src="images/icon/wow.png"/>
										</div>
										<div className="icon-show mid like-icon-bg">
											<i className="fas fa-thumbs-up"></i>
										</div>
										<div className="icon-show low love-icon-bg">
											<i className="fas fa-heart"></i>
										</div>
										<div><p className="l-count"><span>35</span></p></div>
									</div>

									<div>
										<p>
											<a href="#">11 Comments</a>

											<a href="#">6 Share</a>
										</p>
									</div>
								</div>

							</div>

							<div className="actavite">
								<div className="lcs-btn lcs-btn_4i">
									<p>
										<i id="post-icon-btn_4i" className="far fa-thumbs-up"></i> 
										<span id="post-icon-text_4i">Like</span>
									</p>
								</div>
								<div className="lcs-btn">
									<p><i className="far fa-comment-alt"></i> Comment</p>
								</div>
								<div className="lcs-btn">
									<p><i className="fas fa-share"></i> Share</p>
								</div>
							</div>


							
						</div>

						<div className="box-design post-div">
							<div className="post-infarmation">
								<div>
									<div className="profil-ing-div post-profile-img">
									<a href="#" id="profile-link">
										<img id="Profile_images" src="images/friends/00.jpg"/>
									</a>
								</div>
								</div>
								<div className="post-three-dot">
									<h2><a href="#" id="profile_name">MD Meheid Hasan</a></h2>
									<p>
										<a href="%">5d</a>
										<span><i className="fas fa-user-friends"></i></span>
									</p>

									<span className="thre-dto-btn fas fa-ellipsis-h"></span>
								</div>
							</div>
								<p className="post-hader-text" id="post_h_PLUS_I">Hello World.</p>
								<div className="post-background-img">
									<div>
										<div className="one-or-two">
											<img id="post-image-10" src="images/friends/0.jpg"/>
										</div>
										<div className="one-or-two">
											<img id="post-image-11" src="images/friends/0.jpg"/>
										</div>
									</div>

									<div>
										<div className="one-or-two">
											<img id="post-image-1" src="images/friends/0.jpg"/>
										</div>
										<div className="one-or-two ofverflow-images">
											<img id="post-image-2" src="images/friends/0.jpg"/>
											<div className="ove-img-div">
												<p>15</p>
											</div>
										</div>
									</div>
								</div>

							<div className="post-info-input">
								
								<div className="lilowow-cs">
									<div className="llw-count">
										<div className="icon-show top">
											<img src="images/icon/wow.png"/>
										</div>
										<div className="icon-show mid like-icon-bg">
											<i className="fas fa-thumbs-up"></i>
										</div>
										<div className="icon-show low love-icon-bg">
											<i className="fas fa-heart"></i>
										</div>
										<div><p className="l-count"><span>35</span></p></div>
									</div>

									<div>
										<p>
											<a href="#">11 Comments</a>

											<a href="#">6 Share</a>
										</p>
									</div>
								</div>

							</div>

							<div className="actavite">
								<div className="lcs-btn lcs-btn_plus_i">
									<p>
										<i id="post-icon-btn_plus_i" className="far fa-thumbs-up"></i> 
										<span id="post-icon-text_plus_i">Like</span>
									</p>
								</div>
								<div className="lcs-btn">
									<p><i className="far fa-comment-alt"></i> Comment</p>
								</div>
								<div className="lcs-btn">
									<p><i className="fas fa-share"></i> Share</p>
								</div>
							</div>


							
						</div>
						
					</section>

				</div>
			</section>
			</>:''}
                
            </div>
        </div>
		<div id="modal">
			{profile && profile.avatar_file?
			<div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
                <div className="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
					<div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
						
						<div className="tiktok-si5yni-FormReport ex8pc610">
							<div className="linmgsc8  tiktok-i17c8h-DivFormHeader ex8pc612">
							
							<h4 data-e2e="report-card-title" className="tiktok-f8vded-H4FormTitle ex8pc615">Report</h4>
							<div onClick={()=>setState({...state,edit:false})} data-e2e="report-card-cancel" className="tiktok-78z7l6-DivCloseButton ex8pc614">
								<svg width="14" height="14" viewBox="0 0 9 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path></svg>
							</div>
							
						</div>
							<div>
							<div className="discj3wi hv4rvrfc ihqw7lf3 dati1w0a">
							
								<label aria-label="Mô tả" className="cwj9ozl2 beltcj47 p86d2i9g aot14ch1 kzx2olss goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 j83agx80 cbu4d94t ni8dbmo4 stjgntxs l9j0dhe7 du4w35lb hw4tbnyy o6r2urh6 np24d88i p9mcbvme krxe8813 ph5sz0o6 lzcic4wl" for="jsc_c_5w">
									<div className="j83agx80 k4urcfbm">
										<div className="g5ia77u1 buofh1pr d2edcug0 hpfvmrgz l9j0dhe7">
											<span className="m9osqain t5a262vz a8c37x1j b5fwa0m2 jagab5yi knj5qynh fo6rh5oj d2edcug0 ni8dbmo4 stjgntxs hzruof5a pmk7jnqg re5koujm ltmttdrg fgv6swy9 dd2scrzq ms05siws flx89l3n b7h9ocf4 g0qnabr5">Mô tả</span>
											<textarea dir="ltr" aria-invalid="false" id="jsc_c_5w" className="oajrlxb2 f1sip0of hidtqoto g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv oo9gr5id j83agx80 jagab5yi knj5qynh fo6rh5oj oud54xpy l9qdfxac lzcic4wl ni8dbmo4 stjgntxs hv4rvrfc dati1w0a ieid39z1 k4urcfbm" rows="2" style={{overflowY: 'hidden'}}></textarea>
										</div>
									</div>
								</label>
							</div>
							<div className="cmsa8f9s f36cnskx axo7380y nzwjwy10">
								<div className="k4urcfbm l9j0dhe7 stjgntxs ni8dbmo4 datstx6m">
									<div  className={`ke6wolob rk01pc8j l9j0dhe7 f9o22wc5 ad2k81qe ${state.cut?'stjgntxs ni8dbmo4':''}`} style={{height: '300px', width: '300px'}}>
										<div ref={avatar} className="l9j0dhe7 stjgntxs ni8dbmo4" style={{webkitMaskImage: '-webkit-radial-gradient(center, white, black)', borderRadius: `50%`, height: `300px`, width: `300px`}}>
											<div className="pmk7jnqg soycq5t1" style={{transform: `translate(-362px, -362px)`}}>
												<Draggable
													classname={''}
													offset={offset}
													setoffset={(data)=>setoffset(data)}
													children={<img alt="" referrerpolicy="origin-when-cross-origin" src={profile.avatar_file?profile.avatar_file:profile.avatar}/>}
												/>
											</div>
										</div>
										<div className="kr520xx4 pmk7jnqg akz8cqyu soycq5t1" style={{transform: `translate(-362px, -362px)`}}>
											<Draggable
												classname={'a7woen2v'}
												offset={offset}
												setoffset={(data)=>setoffset(data)}
												children={<img alt="" referrerpolicy="origin-when-cross-origin" src={profile.avatar_file?profile.avatar_file:profile.avatar}/>}
											/>
											
										</div>
									</div>
								</div>
							</div>
							<div className="ozuftl9m n851cfcs tvfksri0 n1l5q3vz taijpn5t j83agx80">
								<div onClick={(e)=>setOffset({...offset,scale:offset.scale-0.1<=0.29297?0.29297:offset.scale-0.1})} aria-disabled="true" aria-label="Thu nhỏ" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 rq0escxv mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz i1ao9s8h esuyzwwr f1sip0of du4w35lb rj84mg9z n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 pq6dq46d kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 pzggbiyp pkj7ub1o bqnlxs5p kkg9azqs c24pa1uk ln9iyx3p fe6kdd0r ar1oviwq l10q8mi9 sq40qgkc s8quxz6p pdjglbur" role="button" tabindex="-1">
									<i data-visualcompletion="css-img" className="hu5pjgll dfmqs5qf" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/C2OP-LEuPII.png)`, backgroundPosition: `0px -50px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
										<div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore" style={{inset: `-8px`}}></div>
									</div>
									<div className="cozx11s6 gwi2wbwd h676nmdw oi9244e8">
										<div className="tojvnm2t a6sixzi8 k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y l9j0dhe7 iyyx5f41 a8s20v7p">
											<div className="cjfnh4rs nhd2j8a9 q9uorilb mw227v9j sj5x9vvc cxgpxx05 l9j0dhe7 gokke00a k4urcfbm" role="none"><div className="pwoa4pd7 s8bnoagg bn9qtmzc hp05c5td b6jg2yqc a8c37x1j mw227v9j pmk7jnqg k4urcfbm"></div>
											<div className="is6700om s8bnoagg bn9qtmzc hp05c5td b6jg2yqc a8c37x1j mw227v9j pmk7jnqg" style={{left: `0%`, width: `${(offset.scale-0.29297)*100/2}%`}}></div>
											<div className="o3lre8g0 gu00c43d sv5sfqaa l9j0dhe7">
												<div  aria-label="Thu phóng" aria-orientation="horizontal" aria-valuemax="1.66667" aria-valuemin="0.29297" aria-valuenow="0.29297" aria-valuetext="0.29297" className="oajrlxb2 gs1a9yip nhd2j8a9 j83agx80 mg4g778l cbu4d94t pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of du4w35lb q2y6ezfg qbxu24ho bxzzcbxg lxuwth05 h2mp5456 s45kfl79 emlxlaya bkmhp75w spb7xbtv goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 i09qtzwb ibrqsekg rq0escxv jnigpg78 e5bbllhu lzcic4wl pmk7jnqg kr520xx4 odw8uiq3" id="jsc_c_5y0" role="slider" tabindex="0" style={{left: `${(offset.scale-0.29297)*100/2}%`}}></div>
												</div>
												</div>
												</div>
											</div>
												<div onClick={(e)=>setOffset({...offset,scale:offset.scale+0.1>=2.29297?2.29297:offset.scale+0.1})} aria-label="Phóng to" className="oajrlxb2 gs1a9yip mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql btwxx1t3 abiwlrkh p8dawk7l lzcic4wl dwo3fsh8 g5ia77u1 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 pq6dq46d kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 pzggbiyp pkj7ub1o bqnlxs5p kkg9azqs c24pa1uk ln9iyx3p fe6kdd0r ar1oviwq l10q8mi9 sq40qgkc s8quxz6p pdjglbur" role="button" tabindex="0">
													<i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/ze1Zf2Dx_Hn.png)`, backgroundPosition: `0px -146px`, backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
													<div className="i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s s45kfl79 emlxlaya bkmhp75w spb7xbtv" data-visualcompletion="ignore" style={{inset: `-8px`}}></div>
							</div>
							</div>
							<div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t gs1a9yip owycx6da btwxx1t3 sjgh65i0 wkznzc2l dhix69tm"><div><div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz tvfksri0">
								<div onClick={e=>setState({...state,cut:!state.cut})} aria-label="Cắt ảnh" aria-pressed="false" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0"><div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329"><div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4"><div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
								<i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/P8ja-RQKNNi.png)`, backgroundPosition: '0px 0px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
								</div><div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81"><span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p a57itxjd" dir="auto"><span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Cắt ảnh</span></span></div></div><div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div></div></div></div></div><div className="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz"><div aria-label="Để tạm thời" aria-pressed="false" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0"><div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq tdjehn4e tv7at329"><div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4"><div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81">
									<i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/gPbRSboLqTw.png)`, backgroundPosition: '0px -203px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i></div><div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81"><span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p a57itxjd" dir="auto"><span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Để tạm thời</span></span></div></div><div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div>
							</div></div></div></div>
							<div className="bp9cbjyn j83agx80 sjgh65i0 wkznzc2l dhix69tm">
								<div className="j83agx80 tvfksri0">
								<i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/ev6wmSh2Cu3.png)`, backgroundPosition: '0px -310px', backgroundSize: 'auto', width: '20px', height: '20px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i></div><div className="j83agx80"><span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr b1v8xokw m9osqain" dir="auto">Ảnh đại diện của bạn hiển thị công khai.</span></div></div>
							<div className="bp9cbjyn l6v480f0 j83agx80 bkfpd7mw discj3wi hv4rvrfc ihqw7lf3 dati1w0a"><div className="cgat1ltu">
								<div onClick={e=>{
									setProfile({...profile,avatar_file:null})
									setFormData({...formdata,avatar_file:null})
							}} aria-label="Hủy" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0"><div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv d1544ag0 tw6a2znq g5ia77u1 tv7at329"><div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4">
								<div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81"><span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p knomaqxo" dir="auto"><span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Hủy</span>
								</span></div></div><div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3" data-visualcompletion="ignore"></div></div></div></div><div className="kkf49tns">
									<div onClick={e=>editavatar(e)} aria-label="Lưu" className="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of n00je7tq arfg74bv qs9ysxi8 k77z8yql abiwlrkh p8dawk7l lzcic4wl rq0escxv pq6dq46d cbu4d94t taijpn5t l9j0dhe7 k4urcfbm" role="button" tabindex="0"><div className="l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv tkv8g59h fl8dtwsd s1i5eluu tv7at329"><div className="bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4"><div className="rq0escxv l9j0dhe7 du4w35lb d2edcug0 hpfvmrgz bp9cbjyn j83agx80 pfnyh3mw j5wkysh0 hytbnt81"><span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em iv3no6db jq4qci2q a3bd9o3v lrazzd5p bwm1u5wc" dir="auto"><span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5">Lưu</span></span></div></div><div className="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div></div></div></div></div>
						</div>
					</div>
				</div>
			</div>:''}
		</div>
		</>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,report:state.report,
    post:state.postaction
});
  
export default connect(mapStateToProps,{showchat})( Profile);
