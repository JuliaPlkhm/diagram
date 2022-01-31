import React, { useState, useRef,} from 'react';
import Xarrow from 'react-xarrows';

import { Arrow } from './Arrow';

const connectPointStyle = {
    position: "absolute",
    bottom: '-7px',
    right: 0,
    width: 15,
    height: 15,
    borderRadius: "50%",
    background: "black",
    opacity: "0.5"
  };

export const ConnectPoint = ({ id, x, y, dragRef, boxRef }) => {
    const ref1 = useRef();
    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);
  
    const onDragStart = e => {
      setBeingDragged(true);
      e.dataTransfer.setData("arrow", id);
    }
  
    const onDrag = e => {
        // const { x, y } = dragRef.current.state;
        const { offsetTop, offsetLeft } = boxRef.current;
      setPosition({
        position: "fixed",
        left: e.clientX -x ,
        top: e.clientY-y ,
        transform: "none",
        opacity: 0
  
      });
    }
  
    const onDragEnd = e => {
      setPosition({});
      setBeingDragged(false);
    }
  
    return (
      <>
        <div className="connectPoint"
          draggable
          style={{
            ...connectPointStyle,
            ...position
          }}
          ref={ref1}
          onMouseDown={e => e.stopPropagation()}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        ></div>
        {beingDragged ? <Arrow start={id} end={ref1}  /> : null}
      </>
    )
  }