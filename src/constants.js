
export function validatEemail(email)
{
  var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!filter.test(email)) {
      return false;
  }
  return true;
}

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}

const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
export const generateString=(length)=>{
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export const listaction=[{name:'Báo cáo',author:false,action:'report'},{name:'Chỉnh sửa',author:true,action:'edit'},{name:'Xóa',author:true,action:'delete'},{name:"Ẩn bình luận",author:false,action:'hidden'}]
export const listemoji=[{color:"rgb(32, 120, 244)",emoji:"like",name:'Thích',src:"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"},
{color:"rgb(243, 62, 88)",emoji:"favourite",name:'Yêu thích',src:"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FF6680'/%3e%3cstop offset='100%25' stop-color='%23E61739'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41'/%3e%3c/g%3e%3c/svg%3e"},
{color:"rgb(247, 177, 37)",emoji:"love",name:"Thương thương",src:"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 180 180' %3e %3cdefs%3e %3cradialGradient cx='50.001%25' cy='50%25' fx='50.001%25' fy='50%25' r='50%25' id='c'%3e %3cstop stop-color='%23F08423' stop-opacity='0' offset='0%25'/%3e %3cstop stop-color='%23F08423' stop-opacity='.34' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='50%25' cy='44.086%25' fx='50%25' fy='44.086%25' r='57.412%25' gradientTransform='matrix(-1 0 0 -.83877 1 .81)' id='d'%3e %3cstop stop-color='%23FFE874' offset='0%25'/%3e %3cstop stop-color='%23FFE368' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='10.82%25' cy='52.019%25' fx='10.82%25' fy='52.019%25' r='10.077%25' gradientTransform='matrix(.91249 .4091 -.31644 .7058 .174 .109)' id='e'%3e %3cstop stop-color='%23F28A2D' stop-opacity='.5' offset='0%25'/%3e %3cstop stop-color='%23F28A2D' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='74.131%25' cy='76.545%25' fx='74.131%25' fy='76.545%25' r='28.284%25' gradientTransform='rotate(-38.243 1.4 .537) scale(1 .40312)' id='f'%3e %3cstop stop-color='%23F28A2D' stop-opacity='.5' offset='0%25'/%3e %3cstop stop-color='%23F28A2D' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='31.849%25' cy='12.675%25' fx='31.849%25' fy='12.675%25' r='10.743%25' gradientTransform='matrix(.98371 -.17976 .03575 .19562 0 .16)' id='g'%3e %3cstop stop-color='%23D45F00' stop-opacity='.25' offset='0%25'/%3e %3cstop stop-color='%23D45F00' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='68.023%25' cy='12.637%25' fx='68.023%25' fy='12.637%25' r='12.093%25' gradientTransform='rotate(11.848 .192 .076) scale(1 .19886)' id='h'%3e %3cstop stop-color='%23D45F00' stop-opacity='.25' offset='0%25'/%3e %3cstop stop-color='%23D45F00' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='50.709%25' cy='66.964%25' fx='50.709%25' fy='66.964%25' r='87.22%25' gradientTransform='matrix(0 -.8825 1 0 -.163 1.117)' id='j'%3e %3cstop stop-color='%233B446B' offset='0%25'/%3e %3cstop stop-color='%23202340' offset='68.84%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='49.239%25' cy='66.964%25' fx='49.239%25' fy='66.964%25' r='87.22%25' gradientTransform='matrix(0 -.8825 1 0 -.177 1.104)' id='k'%3e %3cstop stop-color='%233B446B' offset='0%25'/%3e %3cstop stop-color='%23202340' offset='68.84%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='48.317%25' cy='42.726%25' fx='48.317%25' fy='42.726%25' r='29.766%25' gradientTransform='matrix(-.09519 -.96847 1.71516 -1.15488 -.204 1.389)' id='l'%3e %3cstop stop-color='%23E38200' offset='0%25'/%3e %3cstop stop-color='%23CD6700' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='50%25' cy='29.807%25' fx='50%25' fy='29.807%25' r='31.377%25' gradientTransform='matrix(.07236 -.9819 2.22613 1.12405 -.2 .454)' id='m'%3e %3cstop stop-color='%23E38200' offset='0%25'/%3e %3cstop stop-color='%23CD6700' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='73.646%25' cy='44.274%25' fx='73.646%25' fy='44.274%25' r='29.002%25' gradientTransform='scale(.92955 1) rotate(20.36 .764 .598)' id='p'%3e %3cstop stop-color='%23FF7091' stop-opacity='.7' offset='0%25'/%3e %3cstop stop-color='%23FE6D8E' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='26.749%25' cy='29.688%25' fx='26.749%25' fy='29.688%25' r='29.002%25' gradientTransform='scale(.92955 1) rotate(20.36 .278 .353)' id='q'%3e %3cstop stop-color='%23FF7091' stop-opacity='.7' offset='0%25'/%3e %3cstop stop-color='%23FE6D8E' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='23.798%25' cy='53.35%25' fx='23.798%25' fy='53.35%25' r='24.89%25' gradientTransform='matrix(-.18738 .97947 -1.25372 -.27758 .951 .449)' id='r'%3e %3cstop stop-color='%239C0600' stop-opacity='.999' offset='0%25'/%3e %3cstop stop-color='%239C0600' stop-opacity='.94' offset='26.692%25'/%3e %3cstop stop-color='%239C0600' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='97.063%25' cy='54.555%25' fx='97.063%25' fy='54.555%25' r='15.021%25' gradientTransform='matrix(.8002 .50886 -.59365 1.08039 .518 -.538)' id='s'%3e %3cstop stop-color='%23C71C08' stop-opacity='.75' offset='0%25'/%3e %3cstop stop-color='%23C71C08' stop-opacity='.704' offset='53.056%25'/%3e %3cstop stop-color='%23C71C08' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='4.056%25' cy='24.23%25' fx='4.056%25' fy='24.23%25' r='13.05%25' gradientTransform='matrix(.8728 -.3441 .41218 1.20997 -.095 -.037)' id='t'%3e %3cstop stop-color='%239C0600' stop-opacity='.5' offset='0%25'/%3e %3cstop stop-color='%239C0600' stop-opacity='.473' offset='31.614%25'/%3e %3cstop stop-color='%239C0600' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='74.586%25' cy='77.013%25' fx='74.586%25' fy='77.013%25' r='17.563%25' gradientTransform='matrix(.77041 .55955 -.56333 .89765 .605 -.339)' id='u'%3e %3cstop stop-color='%239C0600' stop-opacity='.999' offset='0%25'/%3e %3cstop stop-color='%239C0600' stop-opacity='.934' offset='45.7%25'/%3e %3cstop stop-color='%239C0600' stop-opacity='.803' offset='59.211%25'/%3e %3cstop stop-color='%239C0600' stop-opacity='0' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='50.001%25' cy='50%25' fx='50.001%25' fy='50%25' r='51.087%25' gradientTransform='matrix(-.3809 .91219 -.97139 -.46943 1.176 .279)' id='v'%3e %3cstop stop-color='%23C71C08' stop-opacity='0' offset='0%25'/%3e %3cstop stop-color='%23C71C08' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='2.243%25' cy='4.089%25' fx='2.243%25' fy='4.089%25' r='122.873%25' gradientTransform='scale(.78523 1) rotate(36.406 .025 .05)' id='x'%3e %3cstop stop-color='%23EDA83A' offset='0%25'/%3e %3cstop stop-color='%23FFDC5E' offset='100%25'/%3e %3c/radialGradient%3e %3cradialGradient cx='100%25' cy='7.011%25' fx='100%25' fy='7.011%25' r='105.039%25' gradientTransform='scale(-.90713 -1) rotate(-45.799 -.217 2.489)' id='z'%3e %3cstop stop-color='%23F4B248' offset='0%25'/%3e %3cstop stop-color='%23FFDD5F' offset='100%25'/%3e %3c/radialGradient%3e %3clinearGradient x1='50%25' y1='95.035%25' x2='50%25' y2='7.417%25' id='b'%3e %3cstop stop-color='%23F28A2D' offset='0%25'/%3e %3cstop stop-color='%23FDE86F' offset='100%25'/%3e %3c/linearGradient%3e %3clinearGradient x1='49.985%25' y1='-40.061%25' x2='49.985%25' y2='111.909%25' id='i'%3e %3cstop stop-color='%23482314' offset='0%25'/%3e %3cstop stop-color='%239A4111' offset='100%25'/%3e %3c/linearGradient%3e %3clinearGradient x1='52.727%25' y1='31.334%25' x2='28.964%25' y2='102.251%25' id='o'%3e %3cstop stop-color='%23F34462' offset='0%25'/%3e %3cstop stop-color='%23CC0820' offset='100%25'/%3e %3c/linearGradient%3e %3cpath d='M180 90c0 49.71-40.29 90-90 90S0 139.71 0 90 40.29 0 90 0s90 40.29 90 90z' id='a'/%3e %3cpath d='M108.947 95.828c-23.47-7.285-31.71 8.844-31.71 8.844s2.376-17.954-21.095-25.24c-22.57-7.004-36.253 13.757-37.307 26.812-2.264 28.103 22.134 59.996 31.26 70.86a8.062 8.062 0 008.34 2.584c13.697-3.777 51.904-16.242 66.009-40.667 6.54-11.328 7.06-36.188-15.497-43.193z' id='n'/%3e %3cpath d='M180.642 90c0 49.71-40.289 90-90 90-49.71 0-90-40.29-90-90s40.29-90 90-90c49.711 0 90 40.29 90 90z' id='w'/%3e %3c/defs%3e %3cg fill='none' fill-rule='evenodd'%3e %3cg fill-rule='nonzero'%3e %3cg transform='translate(.005 -.004)'%3e %3cuse fill='url(%23b)' xlink:href='%23a'/%3e %3cuse fill='url(%23c)' xlink:href='%23a'/%3e %3cuse fill='url(%23d)' xlink:href='%23a'/%3e %3cuse fill='url(%23e)' xlink:href='%23a'/%3e %3cuse fill='url(%23f)' xlink:href='%23a'/%3e %3cuse fill='url(%23g)' xlink:href='%23a'/%3e %3cuse fill='url(%23h)' xlink:href='%23a'/%3e %3c/g%3e %3cpath d='M109.013 66.234c-1.14-3.051-36.872-3.051-38.011 0-1.322 3.558 6.806 8.396 19.012 8.255 12.192.14 20.306-4.71 18.999-8.255z' fill='url(%23i)' transform='translate(.005 -.004)'/%3e %3cpath d='M68.006 46.125c.014 7.566-4.823 9.788-11.995 10.702-7.102 1.068-11.883-2.068-11.995-10.702-.099-7.256 3.81-16.116 11.995-16.284 8.17.168 11.981 9.028 11.995 16.284z' fill='url(%23j)' transform='translate(.005 -.004)'/%3e %3cpath d='M54.807 35.054c1.18 1.378.97 3.769-.479 5.358-1.448 1.575-3.571 1.744-4.753.366-1.181-1.378-.97-3.77.478-5.344 1.449-1.59 3.572-1.744 4.754-.38z' fill='%234E506A'/%3e %3cpath d='M112.022 46.125c-.014 7.566 4.823 9.788 11.995 10.702 7.102 1.068 11.883-2.068 11.995-10.702.099-7.256-3.81-16.116-11.995-16.284-8.184.168-11.995 9.028-11.995 16.284z' fill='url(%23k)' transform='translate(.005 -.004)'/%3e %3cpath d='M124.078 34.52c.957 1.547.38 3.881-1.293 5.217-1.674 1.336-3.797 1.181-4.753-.366-.957-1.546-.38-3.88 1.293-5.217 1.66-1.336 3.797-1.181 4.753.366z' fill='%234E506A'/%3e %3cpath d='M37.969 23.344c-2.349 1.983-.45 6.047 3.515 4.19 6.328-2.967 19.899-6.623 31.824-5.287 3.164.351 4.19-.113 3.487-4.022-.689-3.853-4.33-6.37-13.387-5.26-14.035 1.716-23.09 8.396-25.44 10.379z' fill='url(%23l)' transform='translate(.005 -.004)'/%3e %3cpath d='M116.592 12.952c-9.056-1.111-12.698 1.42-13.387 5.259-.703 3.91.323 4.373 3.487 4.022 11.925-1.336 25.481 2.32 31.824 5.287 3.965 1.857 5.864-2.207 3.515-4.19-2.348-1.97-11.404-8.649-25.439-10.378z' fill='url(%23m)' transform='translate(.005 -.004)'/%3e %3c/g%3e %3cg fill-rule='nonzero'%3e %3cuse fill='url(%23o)' xlink:href='%23n'/%3e %3cuse fill='url(%23p)' xlink:href='%23n'/%3e %3cuse fill='url(%23q)' xlink:href='%23n'/%3e %3cuse fill='url(%23r)' xlink:href='%23n'/%3e %3cuse fill='url(%23s)' xlink:href='%23n'/%3e %3cuse fill='url(%23t)' xlink:href='%23n'/%3e %3cuse fill='url(%23u)' xlink:href='%23n'/%3e %3cuse fill-opacity='.5' fill='url(%23v)' xlink:href='%23n'/%3e %3c/g%3e %3cg transform='translate(-.637 -.004)'%3e %3cmask id='y' fill='white'%3e %3cuse xlink:href='%23w'/%3e %3c/mask%3e %3cpath d='M15.52 86.231C9.642 80.508-.708 77.892-1.89 91.153c-.927 10.364 3.93 27.694 16.234 37.763C45.282 154.23 74.742 139.667 75.628 122c.699-13.932-15.502-12.327-20.648-12.045-.352.014-.507-.45-.197-.647a48.147 48.147 0 004.725-3.488c4.036-3.403 1.968-9.31-3.67-7.607-.858.253-14.583 4.359-23.288 1.068-9.872-3.726-11.053-7.214-17.03-13.05z' fill='url(%23x)' fill-rule='nonzero' mask='url(%23y)'/%3e %3cpath d='M161.081 88.2c3.502-6.778 9.066-4.401 12.194-3.359 4.61 1.537 7.353 4.4 7.353 11.572 0 17.001-2.812 32.765-17.002 48.6-25.987 28.982-69.935 25.143-73.675 6.862-3.094-15.16 13.066-16.678 18.34-17.381.365-.042.421-.605.098-.746a46.169 46.169 0 01-5.4-2.896c-5.444-3.403-3.989-10.051 2.405-9.07 6.806 1.012 15.23 2.924 22.486 2.207 21.009-2.11 24.975-19.87 33.201-35.789z' fill='url(%23z)' fill-rule='nonzero' mask='url(%23y)'/%3e %3c/g%3e %3c/g%3e %3c/svg%3e"},
{color:"rgb(247, 177, 37)",emoji:"smile",name:"Haha",src:"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='10.25%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FEEA70'/%3e%3cstop offset='100%25' stop-color='%23F69B30'/%3e%3c/linearGradient%3e%3clinearGradient id='d' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23472315'/%3e%3cstop offset='100%25' stop-color='%238B3A0E'/%3e%3c/linearGradient%3e%3clinearGradient id='e' x1='50%25' x2='50%25' y1='0%25' y2='81.902%25'%3e%3cstop offset='0%25' stop-color='%23FC607C'/%3e%3cstop offset='100%25' stop-color='%23D91F3A'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.921365489 0 0 0 0 0.460682745 0 0 0 0 0 0 0 0 0.35 0'/%3e%3c/filter%3e%3cpath id='b' d='M16 8A8 8 0 110 8a8 8 0 0116 0'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='url(%23d)' d='M3 8.008C3 10.023 4.006 14 8 14c3.993 0 5-3.977 5-5.992C13 7.849 11.39 7 8 7c-3.39 0-5 .849-5 1.008'/%3e%3cpath fill='url(%23e)' d='M4.541 12.5c.804.995 1.907 1.5 3.469 1.5 1.563 0 2.655-.505 3.459-1.5-.551-.588-1.599-1.5-3.459-1.5s-2.917.912-3.469 1.5'/%3e%3cpath fill='%232A3755' d='M6.213 4.144c.263.188.502.455.41.788-.071.254-.194.369-.422.371-.78.011-1.708.255-2.506.612-.065.029-.197.088-.332.085-.124-.003-.251-.058-.327-.237-.067-.157-.073-.388.276-.598.545-.33 1.257-.48 1.909-.604a7.077 7.077 0 00-1.315-.768c-.427-.194-.38-.457-.323-.6.127-.317.609-.196 1.078.026a9 9 0 011.552.925zm3.577 0a8.953 8.953 0 011.55-.925c.47-.222.95-.343 1.078-.026.057.143.104.406-.323.6a7.029 7.029 0 00-1.313.768c.65.123 1.363.274 1.907.604.349.21.342.44.276.598-.077.18-.203.234-.327.237-.135.003-.267-.056-.332-.085-.797-.357-1.725-.6-2.504-.612-.228-.002-.351-.117-.422-.37-.091-.333.147-.6.41-.788z'/%3e%3c/g%3e%3c/svg%3e"},
{color:"rgb(247, 177, 37)",emoji:"wow",name:"Wow",src:"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='10.25%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FEEA70'/%3e%3cstop offset='100%25' stop-color='%23F69B30'/%3e%3c/linearGradient%3e%3clinearGradient id='d' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23472315'/%3e%3cstop offset='100%25' stop-color='%238B3A0E'/%3e%3c/linearGradient%3e%3clinearGradient id='e' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23191A33'/%3e%3cstop offset='87.162%25' stop-color='%233B426A'/%3e%3c/linearGradient%3e%3clinearGradient id='j' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23E78E0D'/%3e%3cstop offset='100%25' stop-color='%23CB6000'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.921365489 0 0 0 0 0.460682745 0 0 0 0 0 0 0 0 0.35 0'/%3e%3c/filter%3e%3cfilter id='g' width='111.1%25' height='133.3%25' x='-5.6%25' y='-16.7%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='.5'/%3e%3cfeOffset in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.0980392157 0 0 0 0 0.101960784 0 0 0 0 0.2 0 0 0 0.819684222 0'/%3e%3c/filter%3e%3cfilter id='h' width='204%25' height='927.2%25' x='-52.1%25' y='-333.3%25' filterUnits='objectBoundingBox'%3e%3cfeOffset dy='1' in='SourceAlpha' result='shadowOffsetOuter1'/%3e%3cfeGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='1.5'/%3e%3cfeColorMatrix in='shadowBlurOuter1' values='0 0 0 0 0.803921569 0 0 0 0 0.388235294 0 0 0 0 0.00392156863 0 0 0 0.14567854 0'/%3e%3c/filter%3e%3cpath id='b' d='M16 8A8 8 0 110 8a8 8 0 0116 0'/%3e%3cpath id='f' d='M3.5 5.5c0-.828.559-1.5 1.25-1.5S6 4.672 6 5.5C6 6.329 5.441 7 4.75 7S3.5 6.329 3.5 5.5zm6.5 0c0-.828.56-1.5 1.25-1.5.691 0 1.25.672 1.25 1.5 0 .829-.559 1.5-1.25 1.5C10.56 7 10 6.329 10 5.5z'/%3e%3cpath id='i' d='M11.068 1.696c.052-.005.104-.007.157-.007.487 0 .99.204 1.372.562a.368.368 0 01.022.51.344.344 0 01-.496.024c-.275-.259-.656-.4-.992-.369a.8.8 0 00-.59.331.346.346 0 01-.491.068.368.368 0 01-.067-.507 1.49 1.49 0 011.085-.612zm-7.665.555a2.042 2.042 0 011.372-.562 1.491 1.491 0 011.242.619.369.369 0 01-.066.507.347.347 0 01-.492-.068.801.801 0 00-.59-.331c-.335-.031-.717.11-.992.369a.344.344 0 01-.496-.024.368.368 0 01.022-.51z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='url(%23d)' d='M5.643 10.888C5.485 12.733 6.369 14 8 14c1.63 0 2.515-1.267 2.357-3.112C10.2 9.042 9.242 8 8 8c-1.242 0-2.2 1.042-2.357 2.888'/%3e%3cuse fill='url(%23e)' xlink:href='%23f'/%3e%3cuse fill='black' filter='url(%23g)' xlink:href='%23f'/%3e%3cpath fill='%234E506A' d='M4.481 4.567c.186.042.29.252.232.469-.057.218-.254.36-.44.318-.186-.042-.29-.252-.232-.47.057-.216.254-.36.44-.317zm6.658.063c.206.047.322.28.258.52-.064.243-.282.4-.489.354-.206-.046-.322-.28-.258-.521.063-.242.282-.4.49-.353z'/%3e%3cuse fill='black' filter='url(%23h)' xlink:href='%23i'/%3e%3cuse fill='url(%23j)' xlink:href='%23i'/%3e%3c/g%3e%3c/svg%3e"},
{color:"rgb(247, 177, 37)",emoji:"sad",name:"Buồn",src:"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='10.25%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FEEA70'/%3e%3cstop offset='100%25' stop-color='%23F69B30'/%3e%3c/linearGradient%3e%3clinearGradient id='d' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23472315'/%3e%3cstop offset='100%25' stop-color='%238B3A0E'/%3e%3c/linearGradient%3e%3clinearGradient id='e' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23191A33'/%3e%3cstop offset='87.162%25' stop-color='%233B426A'/%3e%3c/linearGradient%3e%3clinearGradient id='h' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23E78E0D'/%3e%3cstop offset='100%25' stop-color='%23CB6000'/%3e%3c/linearGradient%3e%3clinearGradient id='i' x1='50%25' x2='50%25' y1='81.899%25' y2='17.94%25'%3e%3cstop offset='0%25' stop-color='%2335CAFC'/%3e%3cstop offset='100%25' stop-color='%23007EDB'/%3e%3c/linearGradient%3e%3clinearGradient id='j' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%236AE1FF' stop-opacity='.287'/%3e%3cstop offset='100%25' stop-color='%23A8E3FF' stop-opacity='.799'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.921365489 0 0 0 0 0.460682745 0 0 0 0 0 0 0 0 0.35 0'/%3e%3c/filter%3e%3cfilter id='g' width='111.4%25' height='137.5%25' x='-5.7%25' y='-18.8%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='.5'/%3e%3cfeOffset in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.0411226772 0 0 0 0 0.0430885485 0 0 0 0 0.0922353316 0 0 0 0.819684222 0'/%3e%3c/filter%3e%3cpath id='b' d='M16 8A8 8 0 110 8a8 8 0 0116 0'/%3e%3cpath id='f' d='M3.599 8.8c0-.81.509-1.466 1.134-1.466.627 0 1.134.656 1.134 1.466 0 .338-.089.65-.238.898a.492.492 0 01-.301.225c-.14.037-.353.077-.595.077-.243 0-.453-.04-.595-.077a.49.49 0 01-.3-.225 1.741 1.741 0 01-.239-.898zm6.534 0c0-.81.508-1.466 1.133-1.466.627 0 1.134.656 1.134 1.466 0 .338-.089.65-.238.898a.49.49 0 01-.301.225 2.371 2.371 0 01-1.189 0 .49.49 0 01-.301-.225 1.74 1.74 0 01-.238-.898z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='url(%23d)' d='M5.333 12.765c0 .137.094.235.25.235.351 0 .836-.625 2.417-.625s2.067.625 2.417.625c.156 0 .25-.098.25-.235C10.667 12.368 9.828 11 8 11c-1.828 0-2.667 1.368-2.667 1.765'/%3e%3cuse fill='url(%23e)' xlink:href='%23f'/%3e%3cuse fill='black' filter='url(%23g)' xlink:href='%23f'/%3e%3cpath fill='%234E506A' d='M4.616 7.986c.128.125.136.372.017.551-.12.178-.32.222-.448.096-.128-.125-.135-.372-.017-.55.12-.179.32-.222.448-.097zm6.489 0c.128.125.136.372.018.551-.12.178-.32.222-.45.096-.127-.125-.134-.372-.015-.55.119-.179.319-.222.447-.097z'/%3e%3cpath fill='url(%23h)' d='M4.157 5.153c.332-.153.596-.219.801-.219.277 0 .451.119.55.306.175.329.096.401-.198.459-1.106.224-2.217.942-2.699 1.39-.301.28-.589-.03-.436-.274.154-.244.774-1.105 1.982-1.662zm6.335.087c.099-.187.273-.306.55-.306.206 0 .469.066.801.219 1.208.557 1.828 1.418 1.981 1.662.153.244-.134.554-.435.274-.483-.448-1.593-1.166-2.7-1.39-.294-.058-.371-.13-.197-.459z'/%3e%3cpath fill='url(%23i)' d='M13.5 16c-.828 0-1.5-.748-1.5-1.671 0-.922.356-1.545.643-2.147.598-1.258.716-1.432.857-1.432.141 0 .259.174.857 1.432.287.602.643 1.225.643 2.147 0 .923-.672 1.671-1.5 1.671'/%3e%3cpath fill='url(%23j)' d='M13.5 13.606c-.328 0-.594-.296-.594-.66 0-.366.141-.613.255-.852.236-.498.283-.566.339-.566.056 0 .103.068.339.566.114.24.255.486.255.851s-.266.661-.594.661'/%3e%3c/g%3e%3c/svg%3e"},
{color:"rgb(233, 113, 15)",emoji:"indignant",name:"Phẫn nộ",src:"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='67.194%25'%3e%3cstop offset='0%25' stop-color='%23E04300'/%3e%3cstop offset='100%25' stop-color='%23FFA320'/%3e%3c/linearGradient%3e%3clinearGradient id='f' x1='50%25' x2='50%25' y1='13.511%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%233D0D00'/%3e%3cstop offset='100%25' stop-color='%23661C04'/%3e%3c/linearGradient%3e%3clinearGradient id='g' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23191A33'/%3e%3cstop offset='87.162%25' stop-color='%233B426A'/%3e%3c/linearGradient%3e%3clinearGradient id='l' x1='82.871%25' x2='82.871%25' y1='109.337%25' y2='0%25'%3e%3cstop offset='0%25' stop-color='%239A2F00'/%3e%3cstop offset='100%25' stop-color='%23D44800'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.731459466 0 0 0 0 0.0510349878 0 0 0 0 0.0184398032 0 0 0 0.353638549 0'/%3e%3c/filter%3e%3cfilter id='d' width='169.5%25' height='366.7%25' x='-33.8%25' y='-66.7%25' filterUnits='objectBoundingBox'%3e%3cfeOffset dy='1' in='SourceAlpha' result='shadowOffsetOuter1'/%3e%3cfeGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='.5'/%3e%3cfeColorMatrix in='shadowBlurOuter1' values='0 0 0 0 1 0 0 0 0 0.509680707 0 0 0 0 0 0 0 0 0.371206975 0'/%3e%3c/filter%3e%3cfilter id='i' width='111.4%25' height='138.5%25' x='-5.7%25' y='-19.2%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='.5'/%3e%3cfeOffset in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.0387427847 0 0 0 0 0.0406182666 0 0 0 0 0.0875053146 0 0 0 1 0'/%3e%3c/filter%3e%3cfilter id='j' width='106.4%25' height='165.6%25' x='-3.2%25' y='-16.4%25' filterUnits='objectBoundingBox'%3e%3cfeOffset dy='.6' in='SourceAlpha' result='shadowOffsetOuter1'/%3e%3cfeGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='.05'/%3e%3cfeColorMatrix in='shadowBlurOuter1' values='0 0 0 0 0.565874787 0 0 0 0 0.151271555 0 0 0 0 0 0 0 0 0.150240385 0'/%3e%3c/filter%3e%3cpath id='b' d='M16 8A8 8 0 110 8a8 8 0 0116 0'/%3e%3cpath id='e' d='M5.2 13.551c0 .528 1.253.444 2.8.444 1.546 0 2.8.084 2.8-.444 0-.636-1.254-1.051-2.8-1.051-1.547 0-2.8.415-2.8 1.051'/%3e%3cpath id='h' d='M3.6 9.831c0-.791.538-1.431 1.2-1.431.663 0 1.2.64 1.2 1.431 0 .329-.093.633-.252.874a.527.527 0 01-.318.22c-.15.036-.373.075-.63.075s-.481-.039-.63-.075a.524.524 0 01-.318-.22 1.588 1.588 0 01-.252-.874zm6.4 0c0-.791.537-1.431 1.2-1.431.662 0 1.2.64 1.2 1.431 0 .329-.094.633-.252.874a.524.524 0 01-.318.22 2.734 2.734 0 01-.63.075c-.257 0-.48-.039-.63-.075a.53.53 0 01-.319-.22A1.596 1.596 0 0110 9.831z'/%3e%3cpath id='k' d='M9 7.6c0-.446.163-.6.445-.6.28 0 .414.276.506 1.066 1.128 0 3.038-.534 3.222-.534.178 0 .277.085.317.267.035.158-.023.308-.221.4-.621.287-2.443.935-3.984.935-.168 0-.285-.086-.285-.301V7.6zm-2.951.466C6.141 7.276 6.275 7 6.555 7c.282 0 .445.154.445.6v1.233c0 .215-.117.301-.285.301-1.541 0-3.363-.648-3.984-.935-.198-.092-.256-.242-.221-.4.041-.182.14-.267.317-.267.184 0 2.094.534 3.222.534z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23d)' xlink:href='%23e'/%3e%3cuse fill='url(%23f)' xlink:href='%23e'/%3e%3cuse fill='url(%23g)' xlink:href='%23h'/%3e%3cuse fill='black' filter='url(%23i)' xlink:href='%23h'/%3e%3cpath fill='%234F4F67' d='M4.968 9.333a.329.329 0 01.007.071c0 .201-.176.366-.394.366-.217 0-.393-.165-.393-.366 0-.083.03-.16.08-.221.224.053.459.104.7.15zm5.926.437c-.211 0-.383-.153-.393-.348.259-.038.516-.085.766-.136a.333.333 0 01.02.119c0 .2-.175.365-.393.365z'/%3e%3cuse fill='black' filter='url(%23j)' xlink:href='%23k'/%3e%3cuse fill='url(%23l)' xlink:href='%23k'/%3e%3c/g%3e%3c/svg%3e"}
]

export const listbackground=[
  {index:0,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089937/51653719_241165293466285_9014132538842546176_n_xggt4d.jpg'},
  {index:1,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089937/51841714_236995953875660_8736933391053619200_n_tg35jr.jpg'},
  {index:2,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089937/51689393_459530731251153_9085793668744347648_n_sifes2.jpg'},
  {index:3,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/51644543_367314943851408_3549659207353499648_n_jhzham.jpg'},
  {index:4,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/51632965_1793841947394628_9114252388335616000_n_y45eec.jpg'},
  {index:5,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089937/51672542_410811559670311_860540562254594048_n_jp5k4g.jpg'},
  {index:6,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089937/64502458_318989065695201_361648744678031360_n_braynm.jpg'},
  {index:7,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089937/51672602_316152725684704_8903056472590516224_n_valcoe.jpg'},
  {index:8,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089937/51753375_2349018408676168_3434534163762380800_n_d08pax.jpg'},
  {index:9,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/51624557_2173297946332595_8628355269191008256_n_arr3rd.jpg'},
  {index:10,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/51632003_554617661722416_5997845928201945088_n_hohuff.jpg'},
  {index:11,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/44079721_291719128109207_5500973612837896192_n_bnroue.jpg'},
  {index:12,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/40401945_525804511192473_6652321157959647232_n_wmwjih.jpg'},
  {index:13,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/40394085_452537138572518_4073248607300485120_n_ejpych.jpg'},
  {index:14,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/51611230_1009318299261959_6271388972195250176_n_eni3rb.jpg'},
  {index:15,name:'màu tím',src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655089936/40345755_2163632403908042_6254610308791271424_n_xpu6xy.jpg'},
  
]
export function hidestring(username){
  let string=''
  for(let m=1;m<username.length-1;m++){
  string+='*'
  }
  return string
}

export const number=(value)=>{
  if(value>=1000000000){
    return (value/1000000000).toFixed(1) +'B'
  }
  if(value>=1000000&&value<1000000000){
    return (value/1000000).toFixed(1) +'M'
  }
  else if(value>=1000 && value<1000000) {
    return (value/1000).toFixed(1) +'K'
  }
  else{
    return value
  }
}

export const arraymove = (arr, fromIndex, toIndex) =>{
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
export const timeformat=(data)=>{
  return  ("0" + new Date(data).getDate()).slice(-2) + "-" + ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +
  new Date(data).getFullYear()
}
export const timevalue=(data)=>{
  return new Date(data).getFullYear() + "-" + ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" + ("0" + new Date(data).getDate()).slice(-2)
}
export const timecreate=(data)=>{
  return ("0" + new Date(data).getDate()).slice(-2) + "-" + ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +
  new Date(data).getFullYear() + " " + ("0" + new Date(data).getHours()).slice(-2) + ":" + ("0" + new Date(data).getMinutes()).slice(-2)
}
export const timepromotion=(data)=>{
  return ("0" + new Date(data).getHours()).slice(-2) + ":" + ("0" + new Date(data).getMinutes()).slice(-2)+ " " + ('0'+new Date(data).getDate()).slice(-2) + "-" + ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +
  new Date(data).getFullYear()
}

export function validatePassword(value) {
  let  errors = [];
  if(value!=null){
      if (value.length < 6) {
          errors.push("Your password must be at least 8 characters"); 
      }
      if (value.search(/[a-z]/) < 0) {
          errors.push("Your password must contain at least one letter.");
      }
      if (value.search(/[A-Z]/) < 0) {
          errors.push("Your password must contain at least one letter.");
      }
      if (value.search(/[0-9]/) < 0) {
          errors.push("Your password must contain at least one digit."); 
      }
      if(value.match(/[|\\/~^:,;?!&%$@*+]/)){
          errors.push("Your password must contain at least one digit."); 
      }
  }
  else{
      errors.push("Your password must contain at least one digit."); 
  }
  return errors;
}

export const originweb =window.location.origin
export function isVietnamesePhoneNumber(number) {
  return /([\+84 |84 |0|+84|84|(+84)|(+84 )]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(number);
}
export  const onValidUsername = (val) => {
        const usernameRegex = /^[a-z0-9_.]+$/
        return usernameRegex.test(val)
    }
export const Dayformat = (value) => {
  const date=new Date(value)
  const today = new Date()
  let day=`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  if(date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()){
      if(date.getDate() === (today.getDate())-1 ){
        day=`${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)} Yesterday`
      }
      if(date.getDate() === (today.getDate())){
        day=`${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
      }
    }
    return day
};

export const checkDay = (value) => {
  const today = new Date()
  const date=new Date(value)
  let day=''
  if(date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()){
      if(date.getDate() === (today.getDate())-1 ){
        day='Yesterday'
      }
      if(date.getDate() === (today.getDate())){
        day='Today'
      }
    }
    return day
};

export function groupBy(data, property) {
  return data.reduce((acc, obj) => {
    const key = obj[property];
    console.log(key)
    if (!acc[key]) {  
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, []);
}
export const weekday = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
export function matchYoutubeUrl(url) {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if(url.match(p)){
      return url.match(p)[1];
  }
  return false;
}

export const timeago=(value)=>{
  const totalseconds=(new Date().getTime()-new Date(value).getTime())/1000
  let time=Math.round(totalseconds)+'s'
  if(totalseconds>60 && totalseconds<60*60){
    time=Math.round(totalseconds/60) +'m'
  }
  if(totalseconds>=60*60 && totalseconds<60*60*24){
    time=Math.round(totalseconds/3600) +'h'
  }
  else if(totalseconds>=60*60*24 && totalseconds<60*60*24*30){
    time=Math.round(totalseconds/(60*60*24)) +'d'
  }
  else if(totalseconds>=60*60*24*30 && totalseconds<60*60*24*30*12){
    time=Math.round(totalseconds/(60*60*24*30)) +'m'
  }
  else if(totalseconds>=60*60*24*30*12){
    time=Math.round(totalseconds/(60*60*24*30*12)) +'y'
  }
  return time
}
export const formatter = new Intl.NumberFormat('vi-VN', {
  minimumFractionDigits: 0
})
export const listbackgroundpost=[
  {id:1,src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655441294/24296915_552118028462428_2149620566028451840_n_s91qfu.jpg'},
  {id:2,src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655441293/23668668_1966335853691332_6328494771463520256_n_uph31p.jpg'},
  {id:3,src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655441294/24304065_172497529909942_2445007968308035584_n_ktcdq4.jpg'},
  {id:4,src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655441293/26477768_1466076880167319_4355500702508777472_n_n3mgji.jpg'},
{id:5,src:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1655442511/26911761_2038921609720837_5794385467600273408_n_piuf42.jpg'}
]
export const list_type_chat=[{'name':'All',value:1},{'name':'Unread',value:2},{'name':'Đã gim',value:3}]
export const action_thread=[
  {name:'Ghim Trò Chuyện',gim:true},{name:'Bỏ gim cuộc Trò Chuyện',gim:false},
  {name:'Đánh dấu đã đọc',unread:false},{name:'Đánh dấu đã đọc',unread:true},
  {name:'Xóa trò chuyện',delete:true}]
export const listitem=[{value:'1',name:"Công khai",info:"Mọi người trên hoặc ngoài Facebook",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/uaBHGktnPxt.png",option:false,story:true},
{value:'2',name:"Bạn bè",info:"Bạn bè của bạn trên Facebook",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yt/r/UFYvNcKWkj5.png",option:false,story:true},
{value:'3',name:"Bạn bè ngoại trừ ...",info:"Không hiển thị với một số bạn bè",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yE/r/Flkkj1Wx8Cf.png",option:true,story:true},
{value:'4',name:"Chỉ mình tôi",info:"",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yO/r/tlBBJvkvBea.png",option:false},
{value:'5',name:"Bạn bè cụ thể",info:"Chỉ hiển thị với một số bạn bè",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/2ZYmcZmsqKn.png",option:true},
{value:'6',name:"Tùy chỉnh",info:"Chỉ hiển thị với một số bạn bè",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/VMTh7moy_t1.png",option:true},
{value:'7',name:"Bạn thân",info:"Danh sách tùy chỉnh của bạn",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/D9rol890gDz.png",option:false},
{value:'8',name:"Danh sách chưa đặt tên",info:"Danh sách tùy chỉnh của bạn",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/ssHeUgcEFx6.png",option:false},
{value:'9',name:"Người quen",info:"Danh sách tùy chỉnh của bạn",src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/FUR-6IEUzHi.png",option:false},
]
export const listcoins=[{number:70,price:18000},{number:350,price:89000},
  {number:700,price:178000},{number:1400,price:356000},{number:3500,price:89000},
  {number:7000,price:1780000},{number:17500,price:4449000}]
export const listgift=[
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455802/3a1a5f209c9e3a17253c2956ec51ef89_tplv-obj_pwabey.png',
name:"May",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/802a21ae29f9fae5abe3693de9f874bd_tplv-obj_joqqoj.png',
name:"Tiktok",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455645/0e6c7bcc6afb7d9aba4d65f2b05ae55e_tplv-obj_wwhvzm.png',
name:"May",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/09d9b188294ecf9b210c06f4e984a3bd_tplv-obj_a7dlaz.png',
name:"Tennis",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/c043cd9e418f13017793ddf6e0c6ee99_tplv-obj_m08nnn.png',
name:"Football",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/840b3d6e362053e4eb83af0ca7228762_tplv-obj_ekoioz.png',
name:"Minnors",coin:30},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/3f02fa9594bd1495ff4e8aa5ae265eef_tplv-obj_vrmd5m.png',
name:"GG",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/63135affee2016240473cab8376dfe74_tplv-obj_nwjmom.png',
name:"Hand wave",coin:10},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/8ebe28a907bb6237fa3b11a97deffe96_tplv-obj_fnfmub.png',
name:"Game",coin:9},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/728cc7436005cace2791aa7500e4bf95_tplv-obj_uwqjmy.png',
name:"Mini Speaker",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/4e7ad6bdf0a1d860c538f38026d4e812_tplv-obj_b4yoxv.png',
name:"Dounit",coin:30},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/968820bc85e274713c795a6aef3f7c67_tplv-obj_d8cdrz.png',
name:"ICe Cream",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/a99fc8541c7b91305de1cdcf47714d03_tplv-obj_znfpge.png',
name:"Weights",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/20b8f61246c7b6032777bb81bf4ee055_tplv-obj_aohh0x.png',
name:"Tiktok",coin:20},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/7d055532898d2060101306de62b89882_tplv-obj_dbctkv.png',
name:"May",coin:10},

{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/eba3a9bb85c33e017f3648eaf88d7189_tplv-obj_suqpsq.png',
name:"Tiktok",coin:1},

{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/8d4381b7d2272ffc14227c3705832e24_tplv-obj_iz3cq0.png',
name:"May",coin:5},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/a4c4dc437fd3a6632aba149769491f49.png_tplv-obj_xkoytb.png',
name:"Tiktok",coin:5},
]

export const listactionchat=[
  {name:'Mở bằng message',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/GUBrx59viEV.png',
  position:'0 -46px',action:'open-message'},
  {name:'Tải ứng dụng',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/NevcpXBoZny.png',
  position:'0 -134px',action:'dowload'},
  {name:'Xem trang cá nhân',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/WqTMwWy4BYV.png',
  position:'0 -46px',action:'view-profile',dot:true},
  {name:'Đổi chủ đề',svg:'<svg viewBox="0 0 20 20" data-testid="mw_edit_theme_svg:Grape" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4" fill="url(#jsc_c_6y)" height="20" width="20"><defs><linearGradient gradientTransform="rotate(90)" id="jsc_c_6y"><stop stop-color="#5e007e" offset="0%"></stop><stop stop-color="#5e007e" offset="100%"></stop></linearGradient></defs><defs><mask id="jsc_c_6x"><rect width="100%" height="100%" fill="white"></rect><circle cx="10" cy="10" r="3" fill="black"></circle></mask></defs><circle cx="10" cy="10" r="10" mask="url(#jsc_c_6x)"></circle></svg>',
  position:'0 -46px',action:'change-object',title:'Chủ đề'},
  {name:'Biểu tượng cảm xúc',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/NevcpXBoZny.png',
  position:'0 -155px',action:'emotion',title:'Biểu tượng cảm xúc'},
  {name:'Biệt danh',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/WqTMwWy4BYV.png',
  position:'0 -505px',action:'nickname',dot:true,title:'Biệt danh'},
  {name:'Tạo nhóm',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/NevcpXBoZny.png',
  position:'0 -218px',action:'create-group',dot:true},
  {name:'Tắt thông báo',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/WqTMwWy4BYV.png',
  position:'0 -253px',action:'turnoff',title:'Tắt cuộc trò chuyện'},
  {name:'Bỏ qua tin nhắn',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png',
  position:'0 -1300px',action:'inogre',title:'Bỏ qua cuộc trò chuyện này?'},
  {name:'Chặn',src:'https://static.xx.fbcdn.net/rsrc.php/v3/yu/r/nS-zdyBpep2.png',
  position:'0 -719px',action:'block',dot:true},
  {name:'Lưu trữ đoạn chat',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png',
  position:'0 -775px',action:'save'},
  {name:'Xóa tin nhắn',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png',
  position:'0 -1279px',action:'delete'},
  {name:'Báo cáo',src:'https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/1nXLBe7cfOm.png',
  position:'0 -565px',action:'report'},
]
export const listemojipost=[{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'hạnh phúc'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/SbLxX4jljCS.png",
name:'có phúc'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/jnaR01aXOKF.png",
name:'được yêu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'buồn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/jnaR01aXOKF.png",
name:'đáng yêu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/8HG4ArhYqqm.png",
name:'biết ơn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/GTVH05GEVXD.png",
name:'hào hứng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/jnaR01aXOKF.png",
name:'đang yêu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yL/r/D5AOH5Rt9K8.png",
name:'điên'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/84_AfuO7-Sk.png",
name:'cảm kích'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/-Oz0Mt1ODxc.png",
name:'sung sướng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/7EP_wi4-K-2.png",
name:'tuyệt vời'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/8XwN6UuxTMh.png",
name:'khờ khạo'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/9Te0n4rkLpK.png",
name:'vui vẻ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'tuyệt vời'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/TLm2OJzKubg.png",
name:'tuyệt'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'thú vị'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/zhi6jtmTu3-.png",
name:'thư giãn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/zhi6jtmTu3-.png",
name:'tích cực'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/zhi6jtmTu3-.png",
name:'thoải mái'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/-QMIhlwCYdo.png",
name:'đầy hy vọng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/-Oz0Mt1ODxc.png",
name:'hân hoan'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'mệt mỏi'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'có động lực'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'tự hào'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/2OPxnmzWJKZ.png",
name:'cô đơn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yY/r/5AnCiyS_9cd.png",
name:'chu đáo'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/VvIMJyzy948.png",
name:'OK'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/oMOT1mZQEl_.png",
name:'hoài niệm'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'giận dữ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/1Se99YgIwLT.png",
name:'ốm yếu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/7EP_wi4-K-2.png",
name:'hài lòng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/gXjnOZhx3oz.png",
name:'kiệt sức'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/02a2H2B9Ec7.png",
name:'xúc động'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'tự tin'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/8HG4ArhYqqm.png",
name:'rất tuyệt'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'tươi mới'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/TTm3hch87J7.png",
name:'quyết đoán'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/qwkICZ8qkDL.png",
name:'kiệt sức'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'bực mình'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Zq_QZwVGoqX.png",
name:'vui vẻ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yY/r/Doy76OT15hh.png",
name:'may mắn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/l0h4FhPauYc.png",
name:'đau khổ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/l61F6_7qt8r.png",
name:'buồn tẻ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'buồn ngủ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/7EP_wi4-K-2.png",
name:'tràn đầy sinh lực'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/gTtDa0D7Kt9.png",
name:'đói'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'chuyên nghiệp'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/A6RS5poIYbi.png",
name:'đau đớn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/zhi6jtmTu3-.png",
name:'thanh thản'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'thất vọng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'lạc quan'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/kb_BaCTS07b.png",
name:'lạnh'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/XXa65GQHGQp.png",
name:'dễ thương'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/TLm2OJzKubg.png",
name:'tuyệt cú mèo'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/8HG4ArhYqqm.png",
name:'thật tuyệt'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/2jDz-deNGrq.png",
name:'hối tiếc'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/h-6zozwrF3r.png",
name:'thật giỏi'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Xs7vOCLE3qu.png",
name:'lo lắng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yL/r/nSF2F851epw.png",
name:'vui nhộn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'tồi tệ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/2OPxnmzWJKZ.png",
name:'xuống tinh thần'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/UGwrAPxJM9s.png",
name:'đầy cảm hứng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'hài lòng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'phấn khích'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/zhi6jtmTu3-.png",
name:'bình tĩnh'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/LbV-kw7aU4K.png",
name:'bối rối'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/8XwN6UuxTMh.png",
name:'ngớ ngẩn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/84_AfuO7-Sk.png",
name:'trống vắng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'tốt'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/EsVCKErmClv.png",
name:'mỉa mai'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'cô đơn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/h-6zozwrF3r.png",
name:'mạnh mẽ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/um_yQgR5G3L.png",
name:'lo lắng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/GTVH05GEVXD.png",
name:'đặc biệt'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/2OPxnmzWJKZ.png",
name:'chán nản'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/Ln8Jt7O9E6n.png",
name:'vui vẻ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/UGwrAPxJM9s.png",
name:'tò mò'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'ủ dột'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'được chào đón'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/IUAvWtouCkM.png",
name:'đau khổ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/_TZbNRGVjQo.png",
name:'xinh đẹp'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/GTVH05GEVXD.png",
name:'tuyệt vời'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/9VzoHiB2sW3.png",
name:'cáu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'căng thẳng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/KND4MZeohIT.png",
name:'thiếu vắng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/8XwN6UuxTMh.png",
name:'quá siêu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/AL9NGhl006C.png",
name:'tinh quái'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/7EP_wi4-K-2.png",
name:'kinh ngạc'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'tức giận'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/A6RS5poIYbi.png",
name:'buồn chán'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/O0XxUXwnqpq.png",
name:'bối rối'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/9XdcKFX2O43.png",
name:'giận dữ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'phẫn nộ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'mới mẻ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/AL9NGhl006C.png",
name:'thành công'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/A360uqNMpcP.png",
name:'ngạc nhiên'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/O0XxUXwnqpq.png",
name:'bối rối'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'nản lòng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yc/r/DPFf568WJRf.png",
name:'tẻ nhạt'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/XXa65GQHGQp.png",
name:'xinh xắn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Zq_QZwVGoqX.png",
name:'khá hơn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'tội lỗi'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/vTeCt9V__aX.png",
name:'an toàn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'tự do'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/LbV-kw7aU4K.png",
name:'hoang mang'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/3fCnxVGYwTa.png",
name:'già nua'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/zhi6jtmTu3-.png",
name:'lười biếng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'tồi tệ hơn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'khủng khiếp'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'thoải mái'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'ngốc nghếch'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/2jDz-deNGrq.png",
name:'hổ thẹn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/2OPxnmzWJKZ.png",
name:'kinh khủng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'đang ngủ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'khỏe'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'nhanh nhẹn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/XXa65GQHGQp.png",
name:'ngại ngùng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/sStyNmFW9xC.png",
name:'gay go'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/Bu57dnmNtdt.png",
name:'kỳ lạ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'như con người'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/A6RS5poIYbi.png",
name:'bị tổn thương'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/DLgydu3LLkn.png",
name:'khủng khiếp'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Zq_QZwVGoqX.png",
name:'bình thường'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yn/r/vm_19q6gADx.png",
name:'ấm áp'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yc/r/DPFf568WJRf.png",
name:'không an toàn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'yếu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Zq_QZwVGoqX.png",
name:'tốt đẹp'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Zq_QZwVGoqX.png",
name:'khỏe'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'ngu ngốc'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'dễ chịu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/AL9NGhl006C.png",
name:'quan trọng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/DLgydu3LLkn.png",
name:'dở tệ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'không thoải mái'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'chẳng được tích sự gì'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'sẵn sàng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yL/r/nSF2F851epw.png",
name:'khác biệt'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'bất lực'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yc/r/DPFf568WJRf.png",
name:'hèn nhát'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/rJtHLlG4Fm0.png",
name:'say'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/OQv1OHMN3kt.png",
name:'choáng ngợp'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'vô vọng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'toàn vẹn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'khổ sở'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'tức điên'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'thâm trầm'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/DLgydu3LLkn.png",
name:'kinh tởm'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'bồn chồn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/JKEqLFZ3qRw.png",
name:'buồn bã'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'được yêu mến'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Zq_QZwVGoqX.png",
name:'vinh dự'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'thư thái'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/DLgydu3LLkn.png",
name:'choáng váng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/vTeCt9V__aX.png",
name:'an toàn'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/O_9mSdIbFWO.png",
name:'trống rỗng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/a4VuRwFNsgi.png",
name:'bẩn thỉu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'không quan trọng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/8HG4ArhYqqm.png",
name:'vĩ đại'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/Dxg7LlsBAFd.png",
name:'sợ hãi'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/9XdcKFX2O43.png",
name:'ghen tuông'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/A6RS5poIYbi.png",
name:'đau nhức'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'không ai cần mình'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/vqNLyDJn0LW.png",
name:'được coi trọng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/Iu45bu7idw4.png",
name:'đầy đủ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yc/r/DPFf568WJRf.png",
name:'bận bịu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yY/r/FOXyv5kMlip.png",
name:'nhỏ bé'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/l0h4FhPauYc.png",
name:'không được yêu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/2OPxnmzWJKZ.png",
name:'vô dụng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/AL9NGhl006C.png",
name:'đủ điều kiện'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/Svm03GM3eXC.png",
name:'thờ ơ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/l61F6_7qt8r.png",
name:'nôn nóng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/bIWUEPoNY9W.png",
name:'được ưu tiên'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/VU_ofChVPBA.png",
name:'mắc lừa'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/DLgydu3LLkn.png",
name:'khát'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/1Se99YgIwLT.png",
name:'gớm ghiếc'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'khó chịu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'phản cảm'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/kb_BaCTS07b.png",
name:'vô cảm'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/GTVH05GEVXD.png",
name:'hoàn hảo'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yY/r/5AnCiyS_9cd.png",
name:'bị thách thức'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/qwkICZ8qkDL.png",
name:'bị đe dọa'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/DxnxXXkYiSX.png",
name:'yên lòng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/gXjnOZhx3oz.png",
name:'bế tắc'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/Bu57dnmNtdt.png",
name:'lạ lùng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/XXa65GQHGQp.png",
name:'xấu hổ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/zhi6jtmTu3-.png",
name:'đầy năng lượng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yL/r/xOjVJ2q9bEF.png",
name:'lanh lợi'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'bị lừa'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/MqU4w6kG_-T.png",
name:'bị phản bội'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/qwkICZ8qkDL.png",
name:'lo âu'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'tức tối'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/USUgQ58uDx-.png",
name:'xấu xa'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'bị thờ ơ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/XUxJKsLyvQ4.png",
name:'hối hận'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/-Oz0Mt1ODxc.png",
name:'khỏe mạnh'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Zq_QZwVGoqX.png",
name:'hào phóng'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/6Nc6PBM5UGj.png",
name:'giàu có'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/OQv1OHMN3kt.png",
name:'lo sợ'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/r1VAo2m4J3d.png",
name:'hết tiền'},{src:"https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/LbV-kw7aU4K.png",
name:'vô hình'}]

export const list_subject=[{bgimage:'radial-gradient(circle at center 75%, rgb(237, 159, 154) 0%, rgb(237, 159, 154) 50%, rgb(237, 159, 154) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(47, 169, 228) 0%, rgb(100, 143, 235) 50%, rgb(155, 115, 242) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(255, 0, 24) 0%, rgb(255, 4, 23) 6%, rgb(255, 49, 14) 12%, rgb(255, 93, 6) 18%, rgb(255, 122, 1) 24%, rgb(255, 135, 1) 30%, rgb(255, 176, 1) 36%, rgb(217, 197, 7) 42%, rgb(121, 199, 24) 48%, rgb(1, 201, 45) 54%, rgb(1, 190, 105) 60%, rgb(1, 179, 170) 66%, rgb(11, 161, 223) 72%, rgb(63, 119, 230) 78%, rgb(114, 76, 236) 84%, rgb(138, 57, 239) 90%, rgb(138, 57, 239) 96%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(130, 2, 2) 0%, rgb(152, 12, 12) 50%, rgb(163, 17, 17) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(147, 20, 16) 0%, rgb(147, 20, 16) 50%, rgb(147, 20, 16) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(170, 0, 255) 0%, rgb(0, 128, 255) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(202, 52, 255) 0%, rgb(48, 44, 255) 50%, rgb(186, 0, 156) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(0, 128, 255) 0%, rgb(159, 26, 255) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(246, 149, 0) 0%, rgb(218, 0, 80) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(241, 97, 78) 0%, rgb(102, 15, 132) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(219, 64, 64) 0%, rgb(163, 36, 36) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(37, 192, 225) 0%, rgb(206, 131, 42) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(74, 201, 228) 0%, rgb(88, 144, 255) 50%, rgb(140, 145, 255) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(255, 35, 154) 0%, rgb(255, 140, 33) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(0, 38, 238) 0%, rgb(0, 178, 255) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(255, 112, 97) 0%, rgb(255, 82, 128) 33%, rgb(160, 51, 255) 66%, rgb(0, 153, 255) 99%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(0, 213, 47) 0%, rgb(0, 101, 40) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(0, 199, 211) 0%, rgb(54, 83, 232) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(140, 179, 255) 0%, rgb(64, 159, 255) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(255, 13, 158) 0%, rgb(249, 0, 90) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(0, 82, 205) 0%, rgb(0, 161, 230) 50%, rgb(0, 82, 205) 100%)'},
    {bgcolor:'rgb(96, 96, 96)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(170, 0, 255) 0%, rgb(0, 128, 255) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(0, 95, 255) 0%, rgb(146, 0, 255) 50%, rgb(255, 46, 25) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(255, 143, 178) 0%, rgb(167, 151, 255) 50%, rgb(0, 229, 255) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(251, 69, 222) 0%, rgb(132, 29, 213) 50%, rgb(58, 29, 138) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(42, 127, 227) 0%, rgb(0, 191, 145) 50%, rgb(159, 213, 45) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(85, 0, 41) 0%, rgb(170, 50, 50) 50%, rgb(217, 169, 0) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(242, 92, 84) 0%, rgb(244, 132, 95) 50%, rgb(247, 178, 103) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(250, 175, 0) 0%, rgb(255, 46, 46) 50%, rgb(58, 18, 255) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(255, 210, 0) 0%, rgb(110, 223, 0) 50%, rgb(0, 223, 187) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(255, 98, 91) 0%, rgb(197, 50, 173) 50%, rgb(77, 62, 194) 100%)'},
    {bgimage:'radial-gradient(circle at center 75%, rgb(94, 0, 126) 0%, rgb(51, 18, 144) 50%, rgb(40, 37, 181) 100%)'},
    {bgcolor:'rgb(255, 49, 30)'},
    {bgcolor:'rgb(167, 151, 255)'},
    {bgcolor:'rgb(251, 69, 222)'},
    {bgcolor:'rgb(0, 153, 255)'},
    {bgcolor:'rgb(170, 50, 50)'},
    {bgcolor:'rgb(242, 92, 84)'},
    {bgcolor:'rgb(250, 175, 0)'},
    {bgcolor:'rgb(110, 223, 0)'},
    {bgcolor:'rgb(77, 62, 194)'},
    {bgcolor:'rgb(94, 0, 126)'}]

