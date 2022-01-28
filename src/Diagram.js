import React, {useEffect, useState} from 'react';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import Draggable from 'react-draggable';

const boxStyle = {border: 'grey solid 2px', borderRadius: '10px', padding: '5px'};

const DraggableBox = ({id, name, x, y, handleStop}) => {
    
    const updateXarrow = useXarrow();
   
    return (
        <Draggable defaultPosition={{x: x, y: y}} onDrag={updateXarrow} onStop={handleStop(id)}>
            <div id={id} style={boxStyle}>
                {name}
            </div>
        </Draggable>
    );
};

export function Diagram() {
    
    const [steps, setSteps]= useState([]);
    const [links, setLinks]= useState([]);

    const handleStop = (id)=>(event, dragElement) => {
        
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
        .catch(err=> console.log(err));

        fetch("http://localhost:3000/links")
        .then( response => response.json())
        .then( data => setLinks(data))
        .catch(err=> console.log(err));
    },[])

    return (
        <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
            <Xwrapper>
                {steps.map((el)=>
                <DraggableBox key = {el.lifecycleStepId} id={el.lifecycleStepId} name ={el.lifecycleStepName} x={el.lifecycleStepXPosition} y ={el.lifecycleStepYPosition} handleStop={handleStop}/>)}
                
                {links.map((el) =>
                <Xarrow key = {`${el.lifecycleStepFromId}-${el.lifecycleStepToId}`} start={String(el.lifecycleStepFromId)} end={String(el.lifecycleStepToId)} />
                )}
            </Xwrapper>
        </div>
    );
}