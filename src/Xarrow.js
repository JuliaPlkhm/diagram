import React, {useEffect, useState} from 'react';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import Draggable from 'react-draggable';
// import data from './data.json'

const boxStyle = {border: 'grey solid 2px', borderRadius: '10px', padding: '5px'};

const DraggableBox = ({id, name, x, y, index, handleStop}) => {
    
    const updateXarrow = useXarrow();
   
    return (
        <Draggable defaultPosition={{x: x, y: y}} onDrag={updateXarrow} onStop={handleStop(id)}>
            <div id={id} style={boxStyle}>
                {name}
            </div>
        </Draggable>
    );
};

export function V2Example() {
    const [posX, setX]= useState(0)
    const [posY, setY]= useState(0)
    const [steps, setSteps]= useState([])
    const [links, setLinks]= useState([])

    const handleStop = (id)=>(event, dragElement) => {
        setX(dragElement.x)
        setY(dragElement.y)
        console.log(posX,posY)
        fetch(`http://localhost:3000/steps/${id}`, {  method: "PATCH",   headers: {
            'Content-type': 'application/json'},
        body: JSON.stringify({ lifecycleStepXPosition: dragElement.x, lifecycleStepYPosition: dragElement.y  })})
        .then(response => {   
         console.log(response.status);     
         return response.json()})
        .then(data => console.log(data));
      };

    useEffect(()=>{
        fetch("http://localhost:3000/steps")
        .then( response => response.json())
        .then( data => setSteps(data))
        .catch(err=> console.log(err))

        fetch("http://localhost:3000/links")
        .then( response => response.json())
        .then( data => setLinks(data))
        .catch(err=> console.log(err))
    },[])
    return (
        <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
            <Xwrapper>
                {steps.map((el,index)=>
                <DraggableBox key = {el.lifecycleStepId} id={el.lifecycleStepId} index={index} name ={el.lifecycleStepName} x={el.lifecycleStepXPosition} y ={el.lifecycleStepYPosition} handleStop={handleStop}/>)}
                
                {links.map((el) =>
                <Xarrow key = {`${el.lifecycleStepFromId}-${el.lifecycleStepToId}`} start={String(el.lifecycleStepFromId)} end={String(el.lifecycleStepToId)} />
                )}
            </Xwrapper>
        </div>
    );
}