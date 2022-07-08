
import React, { useEffect,useState,useRef } from 'react';
import { listbackground } from '../constants';

const listfont=[
    {name:"Gọn gàng",font:"Times New Roman, Times, serif"},
    {name:"Đơn giản",font:'Arial, Helvetica, sans-serif'},
    {font:'Impact,Charcoal,sans-serif',name:"Bình thường"},
    {font:'Facebook Stencil Viet App, Helvetica, Arial, sans-serif',name:"Kiểu cách"},
    {name:"Tiêu đề",font:'Facebook Sans App Heavy Italic, Helvetica, Arial, sans-serif'}
]
const Storytext=(props)=>{
    const {setstate,state,styletext,setstyle}=props
    const ref=useRef()
    const [choice,setChoice]=useState({show:false})
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
    return(
        <div className="tr9rh885">
            <label aria-label="Bắt đầu nhập" className="cwj9ozl2 qbxu24ho bxzzcbxg lxuwth05 h2mp5456 beltcj47 p86d2i9g aot14ch1 kzx2olss goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 j83agx80 cbu4d94t ni8dbmo4 stjgntxs l9j0dhe7 du4w35lb hw4tbnyy o6r2urh6 lzcic4wl" for="jsc_c_4g">
                <div className="j83agx80 k4urcfbm">
                    <div className="g5ia77u1 buofh1pr d2edcug0 hpfvmrgz l9j0dhe7">
            
                        <textarea dir="ltr" placeholder='bắt đầu nhập' value={state.test} onChange={e=>setstate({text:e.target.value})} aria-invalid="false" id="jsc_c_4g" className="oajrlxb2 oo9gr5id f1sip0of hidtqoto g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv oo9gr5id j83agx80 jagab5yi knj5qynh fo6rh5oj oud54xpy p-8 lzcic4wl ni8dbmo4 stjgntxs hv4rvrfc dati1w0a ieid39z1 k4urcfbm" rows="6" style={{overflowY: 'auto',height:'100px'}}></textarea>
                    </div>
                </div>
            </label>
            <div ref={ref} style={{position:'relative',zIndex:100}} aria-label="Kiểu phông chữ" className="oajrlxb2 g5ia77u1 nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o cxmmr5t8 hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb btwxx1t3 abiwlrkh p8dawk7l lzcic4wl bp9cbjyn qbxu24ho bxzzcbxg lxuwth05 h2mp5456 beltcj47 p86d2i9g aot14ch1 kzx2olss goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 rq0escxv j83agx80 e5d9fub0 jifvfom9 n851cfcs tr9rh885" role="button" tabindex="0">
                <div className="pmk7jnqg re5koujm">
                    <i data-visualcompletion="css-img" className="hu5pjgll m6k467ps" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/I-tqQnJ8R-d.png)`, backgroundPosition: '0px -85px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                </div>
                <div className="pmk7jnqg p8tpcahk">
                    <span className="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d3f4x2em mdeji52x a5q79mjw g1cxx5fr b1v8xokw oo9gr5id" dir="auto">
                        <div className="bp9cbjyn j83agx80 taijpn5t ipjc6fyt p8fzw8mz iuny7tx3 pcp91wgn hm22hv23">{styletext.name}</div>
                    </span>
                </div>
                <div onClick={e=>setChoice({...choice,show:!choice.show})} className="pthwc45v pmk7jnqg">
                    <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: `url(https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/l3mk95SCfJf.png)`, backgroundPosition: '0px -191px', backgroundSize: 'auto', width: '16px', height: '16px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                </div>
                {choice.show?
                <div className="dropdown-item">
                    <div className="list-item-font-size">
                        {listfont.map((item,i)=>
                            <div onClick={e=>{
                                e.stopPropagation()
                                setstyle({font:item.font,name:item.name})
                                setChoice({...choice,show:false})
                            }} 
                            key={i} className="item-font-size">{item.name}</div>
                        )}
                    </div>
                </div>:""}
            </div>
            <div className="qbxu24ho bxzzcbxg lxuwth05 h2mp5456 ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi goun2846 ccm00jje s44p3ltw mk2mc5f4 frvqaej8 ed0hlay0 afxsp9o4 jcgfde61 tr9rh885 sjgh65i0">
                <div className="m9osqain jq4qci2q pybr56ya rz4wbd8a sj5x9vvc dati1w0a abiwlrkh k4urcfbm">Phông nền</div>
                <div className="j83agx80 lhclo0ds tw6a2znq">
                    {listbackground.map((item,i)=>
                    <div onClick={()=>setstyle({src:item.src,id:i})} key={i} className="iwfcevqm tqcvc53n">
                        <div aria-label="Hình minh họa màu tím, hình nền" aria-pressed="true" className="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl" role="button" tabindex="0">
                            <div className="b3onmgus e5nlhep0 ph5uu5jm ecm0bbzt kwzhilbh j83agx80 bp9cbjyn">
                                <img height={`${styletext.src==item.src?'28':'24'}`} width={`${styletext.src==item.src?'28':'24'}`} alt="" className={`${styletext.src==item.src?'og13rbbo nxp5a7ae ng4oes9w epui8hbc enlbkfmh':'r7dfy6xl jgf7e1nu d06cv69u cdcbzqsl'} s45kfl79 emlxlaya bkmhp75w spb7xbtv goun2846 ccm00jje s44p3ltw mk2mc5f4 d0xz27nh m269brjn b2mspmbn rt0cn7cn rq0escxv a8c37x1j l9j0dhe7 enlbkfmh   pd1imjf9`} referrerpolicy="origin-when-cross-origin" src={item.src}/>
                            </div>
                        </div>
                    </div>
                    )}
                    
                </div>
            </div>
        </div>

    )
}
export default Storytext