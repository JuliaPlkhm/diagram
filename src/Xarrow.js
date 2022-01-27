import React, {useState} from 'react';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import Draggable from 'react-draggable';
import data from './data.json'

const boxStyle = {border: 'grey solid 2px', borderRadius: '10px', padding: '5px'};

const DraggableBox = ({id, name, x, y, index}) => {
    const [posX, setX]= useState(0)
    const [posY, setY]= useState(0)
    const updateXarrow = useXarrow();
    const handleStop = (index)=>(event, dragElement) => {
        setX(dragElement.x)
        setY(dragElement.y)
        console.log(data.steps[index])
        data.steps[index].lifecycleStepXPosition = dragElement.x
        data.steps[index].lifecycleStepYPosition= dragElement.y


      };
    return (
        <Draggable defaultPosition={{x: x, y: y}} onDrag={updateXarrow} onStop={handleStop(index)}>
            <div id={id} style={boxStyle}>
                {name}
            </div>
        </Draggable>
    );
};

export function V2Example() {
    return (
        <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
            <Xwrapper>
                {data.steps.map((el,index)=>
                <DraggableBox id={el.lifecycleStepId} index={index} name ={el.lifecycleStepName} x={el.lifecycleStepXPosition} y ={el.lifecycleStepYPosition}/>)}
                
                {data.links.map((el) =>
                <Xarrow start={String(el.lifecycleStepFromId)} end={String(el.lifecycleStepToId)} />
                )}
            </Xwrapper>
        </div>
    );
}