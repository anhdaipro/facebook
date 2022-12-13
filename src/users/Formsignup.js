import {connect} from "react-redux"
import {useNavigate} from "react-router-dom"
import {signup,googleLogin,reset_password,headers,expiry} from "../actions/auth"
import {validatEemail,validatePassword,isVietnamesePhoneNumber,onValidUsername,generateString} from "../constants"
import {checkuserURL, registerURL,verifyphoneURL,verifyemailURL} from "../urls"
import axios from 'axios'
import React,{useState,useEffect} from 'react'
const style={position: 'absolute',
    top: '40px',
    left: '0px',
    width: '117.703px',
    zIndex: 600}

const Formsignup=(props)=>{
    const {signup,reset_password,isAuthenticated,setstate}=props
    const listgender=[{value:'1',name:'Male'},{value:'2',name:'Female'},{value:'3',name:'Custom'}]
    const [formData,setformData]=useState({code:'',first_name:null,last_name:null,password:null,date_of_birth:new Date(),
    gender:null,phone:null,username:null,date:new Date().getDay(),month:new Date().getMonth()+1,year:new Date().getFullYear()})
    const [state,setState]=useState({show_password:false})
    const[show,setShow]=useState({date:false,month:false,year:false})
    const year_now=new Date().getFullYear()
    const [verify,setVerify]=useState(false)
    const navigate=useNavigate()
    const list_year=Array(year_now).fill().map((_, i) => i).filter(item=>item>year_now-100)
    useEffect(()=>{
        document.addEventListener('click',handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    },[])
    const handleClick=(event)=>{
        let parent=event.target.closest('.dropdown.dropdown--has-selected')
        if (!parent) {
            setShow({...show,date:false,month:false,year:false})
        }
    }
    
    const setdate=(e,name,value)=>{
        setformData({...formData,[name]:value})
        if(new Date(value,formData.month,formData.date)=="Invalid Date"){  
                setState({...state,valid_date:false}) 
            }
        else{
            setState({...state,valid_date:true}) 
        }
        setShow({...show,[name]:false}) 
    }
    const {first_name,last_name,email,password,phone,code}=formData
    const submit=(e)=>{
        if(validatEemail(email) || isVietnamesePhoneNumber(email)){
            axios.post(checkuserURL,JSON.stringify({email:email}),headers)
            .then(res=>{
                setState({...state,error:res.data.error,show:true,requestsend:res.data.error?false:true})
               
            })
        }
    }
    
    const register=(e)=>{
        (async ()=>{
            try{
                e.preventDefault()
                
                const form=isVietnamesePhoneNumber(phone)?{'phone':`+84 ${phone.slice(-9)}`,code:code}:{'email':email,code:code}
                const res =await axios.post(isVietnamesePhoneNumber(formData.email)?verifyphoneURL:verifyemailURL,form,headers)
                if(res.data.verify){
                    const username=formData.username
                    let profile=isVietnamesePhoneNumber(formData.eamil)?{phone:formData.email ,date_of_birth:formData.year+'-'+('0'+formData.month).slice(-2)+'-'+('0'+formData.date).slice(-2)}:{date_of_birth:formData.year+'-'+('0'+formData.month).slice(-2)+'-'+('0'+formData.date).slice(-2)}
                    signup(username?username:generateString(12),first_name,last_name,email,password,profile)
                    navigate('/login')
                }
                setState({...state,verify:res.data.verify})
                    setTimeout(()=>{
                        setState({...state,verify:undefined})
                    },3000)
                }
                catch{
                    setState({...state,verify:false})
                }
        })()
    }
    return(
        <div className="modal-content">
            <div class="modal-signup">
                {state.requestsend?<>
                <div className="tiktok-i17c8h-DivFormHeader ex8pc612">
                    <h4 data-e2e="report-card-title" class="tiktok-f8vded-H4FormTitle ex8pc615">Nhập mã email của bạn</h4>
                    
                </div>
                <div className="title">
                    Hãy cho chúng tôi biết email này thuộc về bạn. Hãy nhập mã trong email được gửi đến <span>{formData.email}.</span>
                </div>
                <div>
                    <div className="box-verifi">
                        <span>FB-</span>
                        <div>
                        <input maxLength='6' onChange={e=>setformData({...formData,code:e.target.value})} value={formData.code} type="text"/>
                        </div>
                    </div>
                </div>
                <div class="_8iu0">
                    <a class="_1w00 _8iu7" href="/confirm/resend_code/?cp=dai8626%40gmail.com" rel="dialog-post" role="button" waprocessedanchor="true">Gửi lại email</a>
                </div>
                <div class="_8iu2 clearfix">
                    <div class="rfloat">
                        <a role="button" class="_42ft _4jy0 _8iu3 _4jy4 _517h _51sy" href="/change_contactpoint/dialog/" rel="dialog">Cập nhật thông tin liên hệ</a>
                        <button onClick={e=>register(e)} value="1" class="_42ft _42fr mls _4jy0 _8iu3 _8iu6 _42fr _4jy4 _4jy1 selected _51sy" name="confirm" disabled={formData.code.length==6?false:true} type="submit" id="u_17_4_XF">Tiếp tục</button>
                    </div>
                </div>
                </>:<>
                <img onClick={e=>setstate(e,'show_signup',false)} class="_8idr img" src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png" alt="" width="24" height="24" id="u_2_9_st"/>
                <div class="modal-signup-heading">
                    <p class="modal-signup-name">Sign Up</p>
                    <p class="modal-signup-child-name">It's quick and easy.</p>
                </div>
                {state.error?
                <div class="_7Ao-BQ _2CyKyE umTGIP">
                    <div class="o5DLud">
                        <svg viewBox="0 0 16 16" class="_2-4Lck"><path fill="none" stroke="#FF424F" d="M8 15A7 7 0 108 1a7 7 0 000 14z" clip-rule="evenodd"></path><rect stroke="none" width="7" height="1.5" x="6.061" y="5" fill="#FF424F" rx=".75" transform="rotate(45 6.06 5)"></rect><rect stroke="none" width="7" height="1.5" fill="#FF424F" rx=".75" transform="scale(-1 1) rotate(45 -11.01 -9.51)"></rect></svg>
                    </div>
                    <div>
                        <div class="_3mi2mp">Tên tài khoản của bạn hoặc Mật khẩu đã được sử dụng</div>
                    </div>
                </div>:''}
                <div class="modal-signup-name"> 
                    <input className="mr-8" onChange={e=>setformData({...formData,first_name:e.target.value})} value={formData.first_name} type="text" placeholder="First name"/>
                    <input onChange={e=>setformData({...formData,last_name:e.target.value})} value={formData.last_name} type="text" placeholder="Name"/>      
                </div>
        
                <div class="modal-signup-email">    
                    <input value={formData.email} onChange={e=>setformData({...formData,email:e.target.value})} type="text" placeholder="Email address or phone number"/>

                </div>
            
                <div class="modal-signup-password">
                        
                    <input  onChange={e=>setformData({...formData,password:e.target.value})} value={formData.password} type="password" placeholder="Password"/>
                        
                </div>
            
                <div class="modal-date-birth">
            
                    <label for="">Date of birth</label>
            
                    <div class="modal-date-alert">   
                        <a >&#63;</a>  
                    </div>
                </div>  
                <div class="modal-date-selection">
                    <div className="_2w5iZe">
                        <div className={`dropdown dropdown--has-selected ${show.date?'dropdown--opened':''}`}>
                            <div onClick={()=>setShow({...show,date:!show.date,month:false,year:false})} className="dropdown__entry dropdown__entry--selected">
                                <span>{('0'+formData.date).slice(-2)}</span>
                                <svg enableBackground="new 0 0 11 11" viewBox="0 0 11 11" x="0" y="0" className="svg-icon icon-arrow-down">
                                    <g>
                                    {show.date?<path d="m11 8.5c0-.1 0-.2-.1-.3l-5-6c-.1-.1-.3-.2-.4-.2s-.3.1-.4.2l-5 6c-.2.2-.1.5.1.7s.5.1.7-.1l4.6-5.5 4.6 5.5c.2.2.5.2.7.1.1-.1.2-.3.2-.4z"></path>:<path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path>}
                                    </g>
                                </svg>
                            </div>
                            {show.date?
                            <div style={style} className="popover popover--default">
                                <ul  className='dropdown__options'>
                                    {Array(31).fill().map((_, i)=>
                                        <li onClick={(e)=>setdate(e,'date',i+1)} className="dropdown__entry dropdown__entry--optional">{('0'+(i+1)).slice(-2)}</li>
                                    )}
                                </ul>
                            </div>:''}
                        </div>
                        <div className={`dropdown dropdown--has-selected ${show.month?'dropdown--opened':''}`}>
                            <div onClick={()=>setShow({...show,month:!show.month,date:false,year:false})} className="dropdown__entry dropdown__entry--selected">
                                <span>Tháng {('0'+formData.month).slice(-2)}</span>
                                <svg enableBackground="new 0 0 11 11" viewBox="0 0 11 11" x="0" y="0" className="svg-icon icon-arrow-down">
                                    <g>
                                    {show.month?<path d="m11 8.5c0-.1 0-.2-.1-.3l-5-6c-.1-.1-.3-.2-.4-.2s-.3.1-.4.2l-5 6c-.2.2-.1.5.1.7s.5.1.7-.1l4.6-5.5 4.6 5.5c.2.2.5.2.7.1.1-.1.2-.3.2-.4z"></path>:<path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path>}
                                    </g>
                                </svg>
                            </div>
                            {show.month?
                            <div style={style} className="popover popover--default">
                                <ul  className='dropdown__options'>
                                    {Array(12).fill().map((_, i)=>
                                        <li onClick={(e)=>setdate(e,'month',i+1)} className="dropdown__entry dropdown__entry--optional">{('0'+(i+1)).slice(-2)}</li>
                                    )}
                                </ul>
                            </div>:''}
                        </div>
                        <div className={`dropdown dropdown--has-selected ${show.year?'dropdown--opened':''}`}>
                        <div onClick={()=>setShow({...show,year:!show.year,date:false,month:false})} className="dropdown__entry dropdown__entry--selected">
                            <span>{formData.year}</span>
                            <svg enableBackground="new 0 0 11 11" viewBox="0 0 11 11" x="0" y="0" className="svg-icon icon-arrow-down">
                                    <g>
                                    {show.year?<path d="m11 8.5c0-.1 0-.2-.1-.3l-5-6c-.1-.1-.3-.2-.4-.2s-.3.1-.4.2l-5 6c-.2.2-.1.5.1.7s.5.1.7-.1l4.6-5.5 4.6 5.5c.2.2.5.2.7.1.1-.1.2-.3.2-.4z"></path>:<path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path>}
                                    </g>
                                </svg>
                        </div>
                        {show.year?
                        <div style={style} className="popover popover--default">
                            <ul  className='dropdown__options'>
                                {list_year.reverse().map(i=>
                                    <li onClick={(e)=>setdate(e,'year',i)} className="dropdown__entry dropdown__entry--optional">{i}</li>
                                )}
                            </ul>
                        </div>:''}
                    </div>
                    </div>
                </div>
        
                <div class="modal-gender">
            
                    <label for="">Gender</label>
            
                    <div class="modal-gender-alert">
                        
                        <a >&#63;</a>
                        
                    </div>
            
                </div>
        
                <div class="modal-gender-choice">
                    {listgender.map((item,index)=>
                        <div onClick={e=>setformData({...formData,gender:item.value})} key={index} class="modal-gender-name">
                            <label for="">{item.name}</label>
                            <input type="radio" checked={item.value==formData.gender?true:false}/>
                        </div>
                    )}
                    
                </div>
        
                <div class="modal-signup-terms">    
                    <p> By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy. You may receive SMS notifications from us and can opt out at any time.</p>    
                </div>
        
                <div class="modal-signup-button">
                    <button className={`btn-light ${(validatEemail(formData.email) || isVietnamesePhoneNumber(formData.email)) && state.valid_date && formData.first_name!=''&&formData.last_name!='' && validatePassword(formData.password) && formData.gender?'':'disabled'}`} onClick={e=>submit(e)}>Sign Up</button>
                </div></>}
            </div>
        </div>    
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated
});
export default connect(mapStateToProps, {signup,reset_password })(Formsignup);