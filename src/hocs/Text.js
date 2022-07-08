import React, { useEffect,useState,useRef } from 'react';
const listcolor=[{name:'đen',color:'rgb(0, 0, 0)'},{name:'xanh da trời',color:'rgb(41, 134, 174)'},
{name:'nâu',color:'rgb(112, 41, 41)'},{name:'cam',color:'rgb(247, 114, 74)'},
{name:'trắng',color:'rgb(255, 255, 255)'},{name:'PaleGreen',color:'rgb(144 238 144)'},{name:'Turquoise2',color:'rgb(0 229 238)'},
{name:'xanh da trời',color:'rgb(94, 213, 255)'},{name:'vàng',color:'rgb(241, 196, 58)'},
,{name:'xám',color:'rgb(142, 147, 156)'},{name:'xanh lá cây',color:'rgb(136, 191, 75)'},{name:'IndianRed1',color:'rgb(255 106 106)'},
{name:'Pink',color:'rgb(255 192 203)'},
{name:'xanh da trời nhạt',color:'rgb(202, 237, 248)'},{name:'xám nhạt',color:'rgb(206, 208, 212)'},
{name:'tím nhạt',color:'rgb(220, 211, 239)'},{name:'hồng cánh sen',color:'rgb(251, 62, 160)'},
{name:'xanh bạc hà',color:'rgb(185, 252, 203)'},{name:'xanh nước biển',color:'rgb(43, 69, 124)'}]

const listfont=[
    {name:"Gọn gàng",font:"Times New Roman, Times, serif"},
    {name:"Đơn giản",font:'Arial, Helvetica, sans-serif'}, 
]

const Text=(props)=>{
    const {setlisteditor,listeditorState,styletext}=props
    const ref=useRef()
    const [choice,setChoice]=useState({show:false})
    const [color,setColor]=useState('rgb(255,255,255)')
   
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])
    const handleClick = (event) => {
        const { target } = event
        if(ref.current!=null){
            if (!ref.current.contains(target)) {
                setChoice({show:false})
            }
        }
    }
    const setlistedit=(e,item)=>{
        const data=listeditorState.map(editor=>{
            if(editor.choice){
                return({...editor,color:item.color})
            }
            return({...editor})
        })
        setlisteditor(data)
        setColor(item.color)
    }
    const setfontitem=(e,item)=>{
        const data=listeditorState.map(editor=>{
            if(editor.choice){
                return({...editor,font:item.foent,name:item.name})
            }
            return({...editor})
        })
        setlisteditor(data)
    }
    return(
        <div className="j34wkznp qp9yad78 pmk7jnqg kr520xx4" style={{top:0,left:0,transform: `translate(74px, 280px)`}}>
            <div className="l9j0dhe7">
                <div className="rq0escxv cwj9ozl2 nwpbqux9 io0zqebd m5lcvass fbipl8qg nwvqtn77 ni8dbmo4 stjgntxs">
                    <div className="tr9rh885 wkznzc2l sjgh65i0 dhix69tm">
                        <div style={{position:'relative',zIndex:100}} ref={ref} className="oajrlxb2 g5ia77u1 nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o cxmmr5t8 hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb btwxx1t3 abiwlrkh p8dawk7l lzcic4wl bp9cbjyn qbxu24ho bxzzcbxg lxuwth05 h2mp5456 beltcj47 p86d2i9g aot14ch1 kzx2olss goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 rq0escxv j83agx80 jifvfom9 n1l5q3vz n851cfcs qypqp5cg bc3a0qav">
                            <div class="pmk7jnqg re5koujm">
                                <i data-visualcompletion="css-img" class="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/I-tqQnJ8R-d.png)`, backgroundPosition: '0px -85px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            </div>
                            <div class="pmk7jnqg p8tpcahk">
                                <span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr b1v8xokw oo9gr5id" dir="auto">
                                    <div class="bp9cbjyn j83agx80 taijpn5t ipjc6fyt p8fzw8mz iuny7tx3 pcp91wgn hm22hv23">{listeditorState.find(editor=>editor.choice)?listeditorState.find(editor=>editor.choice).name:'Gọn Gàng'}</div>
                                </span>
                            </div>
                            <div onClick={e=>setChoice({show:!choice.show})} class="pthwc45v pmk7jnqg">
                                <i data-visualcompletion="css-img" class="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/w7B99hm_5Li.png)`, backgroundPosition: '-153px -113px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                            </div>
                            {/*chọn foent*/}
                            {choice.show?
                            <div className="dropdown-item">
                                <div className="list-item-font-size">
                                    {listfont.map((item,i)=>
                                        <div onClick={e=>{
                                            e.stopPropagation()
                                            setfontitem(e,item)
                                            setChoice({...choice,show:false})
                                        }} 
                                        key={i} className="item-font-size">{item.name}</div>
                                    )}
                                </div>
                            </div>:""}
                            {/*chọn foent*/}
                        </div>
                        <div className="ll8tlv6m qbxu24ho bxzzcbxg lxuwth05 h2mp5456 beltcj47 p86d2i9g aot14ch1 kzx2olss goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 rq0escxv j83agx80 btwxx1t3 lhclo0ds ijttq3ge gt1oanoe dflh9lhu scb9dxdr bc3a0qav">
                            {listcolor.map(item=>
                            <div onClick={(e)=>setlistedit(e,item)} key={item.color} aria-label={item.name} className={`oajrlxb2 g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv jnigpg78 n851cfcs qq4y78aw hnxzwevs n1l5q3vz odw8uiq3 ${color==item.color?'active-color':''}`}>
                                <div style={{background: item.color}} className="qbxu24ho bxzzcbxg lxuwth05 h2mp5456 s45kfl79 emlxlaya bkmhp75w spb7xbtv goun2846 ccm00jje s44p3ltw mk2mc5f4 kqev5x78 lxhk6ua7 mx2l840d f8147j9l ri5l3prv rq0escxv datstx6m k4urcfbm"></div>
                                <div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    )
}
export default Text