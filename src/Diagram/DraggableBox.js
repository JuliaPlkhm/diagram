import React, {useRef} from 'react';
import  {useXarrow} from 'react-xarrows';
import Draggable from 'react-draggable';

import { ConnectPoint } from './ConnectPoint';
import { Block } from './Block';

const headStyle = {
  borderRadius: '10px 10px 0px 0px', padding: '7px',
  display: 'inline-block',
  backgroundColor: 'rgb(120 193 245)'
};

const mainStyle = {
  padding: '5px',
  display: 'inline-block',
  backgroundColor: 'rgb(237 237 237)'
};


export const DraggableBox = ({id, name, note,  x, y, handleStop, addArrow}) => {
    const dragRef = useRef();
    const boxRef = useRef();
    const updateXarrow = useXarrow();
    const onDrop= e => {
        if (e.dataTransfer.getData("arrow") === id) {
          console.log(e.dataTransfer.getData("arrow"), id);
        } else {
          const refs = { start: e.dataTransfer.getData("arrow"), end: id };
          addArrow(refs);
          console.log("droped!", refs);
        }
      }
   
    return (
        <Draggable defaultPosition={{x: x, y: y}} onDrag={updateXarrow} ref={dragRef} onDragOver={e => e.preventDefault()} onStop={handleStop(id)} >
            <div  id={id} ref={boxRef} onDrop={onDrop} className='block' >
           <Block name ={name} note={note} ></Block>
            
            <ConnectPoint id={String(id)} dragRef={dragRef} boxRef ={boxRef} x={x} y={y} ></ConnectPoint>
            </div>
        </Draggable>
    );
};
