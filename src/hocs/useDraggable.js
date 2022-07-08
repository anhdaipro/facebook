import { useState, useEffect,useRef } from "react";

const Draggable=(props) =>{
    const {offset,setoffset,children,classname}=props
    const cardRef = useRef(null);
    useEffect(() => {
    const handleMouseDown = event => {
        const startX = event.pageX - offset.dx;
        const startY = event.pageY - offset.dy;
        const handleMouseMove = event => {
            const newDx = event.pageX - startX;
            const newDy = event.pageY - startY;
            setoffset({...offset, dx: newDx, dy: newDy });
            
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup",() => {
          document.removeEventListener("mousemove", handleMouseMove);
            },
            { once: true }
        );
    };

    cardRef.current.addEventListener("mousedown", handleMouseDown);
    return () => {
        if(cardRef.current){
            cardRef.current.removeEventListener("mousedown", handleMouseDown);
        }
    };
    
    }, [offset]);

    useEffect(()=>{
        const handleWhecardRef=e=>{
        var xs = (e.clientX - offset.dx) / offset.scale,
        ys = (e.clientY - offset.dy) / offset.scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
        
        setoffset({...offset,scale:(delta  > 0) ? (offset.scale *= 1.2) : (offset.scale /= 1.2)})
        }
        cardRef.current.addEventListener('wheel',handleWhecardRef)
        return () => {
        if(cardRef.current){
            cardRef.current.removeEventListener("wheel", handleWhecardRef);
        }
    };
    },[offset])

    console.log(offset)
    return (
        <div className={`${classname}`} ref={cardRef} style={{transform:`translate3d(${offset.dx}px, ${offset.dy}px, 0) scale(${offset.scale}) rotate(${offset.rotate}deg)`}}>
            {props.children}
        </div>
    );
}
export default Draggable
