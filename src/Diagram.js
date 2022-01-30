import React, {useEffect, useState, useRef,} from 'react';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import Draggable from 'react-draggable';

const headStyle = {borderRadius: '10px 10px 0px 0px', padding: '7px',
                  display: 'inline-block', 
                  backgroundColor: 'rgb(120 193 245)'};

const mainStyle = {padding: '5px',
                   display: 'inline-block', 
                   backgroundColor: 'rgb(237 237 237)'};

const DraggableBox = ({id, name, note,  x, y, handleStop}) => {
    
    const updateXarrow = useXarrow();
   
    return (
        <Draggable defaultPosition={{x: x, y: y}} onDrag={updateXarrow} onStop={handleStop(id)}>
            <div id={id} style={{position: 'absolute', display: 'flex', flexDirection: "column"}}>
            <div  style={headStyle}>
                {name}
            </div>
            <div style={mainStyle}>
                {note}
            </div>
            </div>
        </Draggable>
    );
};

export function Diagram() {
    const reactFlowWrapper = useRef(null);
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

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      console.log(event.clientX,  event.clientY )
      };
    
      const onDrop = (event) => {
        event.preventDefault();
    
        // const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        // const type = event.dataTransfer.getData('application/reactflow');
        // const position = reactFlowInstance.project({
        //   x: event.clientX - reactFlowBounds.left,
        //   y: event.clientY - reactFlowBounds.top,
         
        // });
        
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const name = event.dataTransfer.getData('application/reactflow');
        const newNode = {
            lifecycleStepId: steps[steps.length-1].lifecycleStepId + 1,
            lifecycleStepXPosition: event.clientX - reactFlowBounds.left,
            lifecycleStepYPosition: event.clientY ,
            lifecycleStepName: name
         
        };
    console.log(event)
        
        setSteps((es) => es.concat(newNode));
      };

    return (
        <div className="reactflow-wrapper"   ref={reactFlowWrapper}>
            <div style={{ height: '500px'}} onDrop={onDrop}
        onDragOver={onDragOver}>
            <Xwrapper>
                {steps.map((el)=>
                <DraggableBox key = {el.lifecycleStepId} id={el.lifecycleStepId} name ={el.lifecycleStepName} note ={el.lifecycleStepNote} x={el.lifecycleStepXPosition} y ={el.lifecycleStepYPosition} handleStop={handleStop}/>)}
                
                {links.map((el) =>
                <Xarrow headSize={9} strokeWidth={1} path ={'straight'} color={'black'} key = {`${el.lifecycleStepFromId}-${el.lifecycleStepToId}`} start={String(el.lifecycleStepFromId)} end={String(el.lifecycleStepToId)} />
                )}
            </Xwrapper>
            </div>
        </div>
    );
}