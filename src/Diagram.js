import React, {useEffect, useState, useRef,} from 'react';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import Draggable from 'react-draggable';

const headStyle = {borderRadius: '10px 10px 0px 0px', padding: '7px',
                  display: 'inline-block', 
                  backgroundColor: 'rgb(120 193 245)'};

const mainStyle = {padding: '5px',
                   display: 'inline-block', 
                   backgroundColor: 'rgb(237 237 237)'};

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
const ConnectPoint =({id, boxRef, dragRef}) =>{
    const ref1 = useRef();
    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);
    return (
    <>
    <div defaultPosition={{x: 10, y: 20}} className="connectPoint" style={{height: '5px', width: '5px', backgroundColor: 'grey'}}
    draggable
    style={{
        ...connectPointStyle,
        // ...connectPointOffset[handler],
        ...position
      }}
    ref={ref1}
    onMouseDown={e => e.stopPropagation()}
    onDragStart={e => {
      setBeingDragged(true);
      e.dataTransfer.setData("arrow", id);
      console.log(id)
    }}
    onDrag={e => {
      const { offsetTop, offsetLeft } = boxRef.current;
      const { x, y } = dragRef.current.state;
      setPosition({
        position: "fixed",
        left: e.clientX - x - offsetLeft,
        top: e.clientY - y - offsetTop,
        transform: "none",
        opacity: 0
        
      });
    //   console.log(e.clientX,  e.clientY )
    //   console.log(ref1.current.state)
    }}
    
    onDragEnd={e => {
      setPosition({});
      setBeingDragged(false);
    }}
  ></div>
  {beingDragged ? <Xarrow start={id} end={ref1} /> : null}
  </>
    )}

const DraggableBox = ({id, name, note,  x, y, handleStop, addArrow}) => {
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
        <Draggable defaultPosition={{x: x, y: y}} onDrag={updateXarrow}  onDragOver={e => e.preventDefault()} onStop={handleStop(id)}  ref={dragRef}>
            <div ref={boxRef} id={id} onDrop={onDrop} style={{position: 'absolute', display: 'flex', flexDirection: "column"}}>
            <div  style={headStyle}>
                {name}
            </div>
            <div style={mainStyle}>
                {note}
            </div>
            <ConnectPoint id={String(id)} boxRef ={boxRef} dragRef ={dragRef} x={x} y={y} ></ConnectPoint>
            </div>
        </Draggable>
    );
};

export function Diagram() {
    const reactFlowWrapper = useRef(null);
    const [steps, setSteps]= useState([]);
    const [links, setLinks]= useState([]);

    const addArrow = ({ start, end }) => {
        setLinks([...links, {"lifecycleStepFromId": start, "lifecycleStepToId": end }]);
      };

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
    //   console.log(event.clientX,  event.clientY )
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
        if(name){
            setSteps((es) => es.concat(newNode));

        }
      };

    return (
        <div className="reactflow-wrapper"   ref={reactFlowWrapper}>
            <div style={{ height: '500px'}} onDrop={onDrop}
        onDragOver={onDragOver}>
            <Xwrapper>
                {steps.map((el)=>
                <DraggableBox key = {el.lifecycleStepId} addArrow={addArrow} id={el.lifecycleStepId} name ={el.lifecycleStepName} note ={el.lifecycleStepNote} x={el.lifecycleStepXPosition} y ={el.lifecycleStepYPosition} handleStop={handleStop}/>)}
                
                {links.map((el) =>
                <Xarrow headSize={9} strokeWidth={1} path ={'straight'} color={'black'} key = {`${el.lifecycleStepFromId}-${el.lifecycleStepToId}`} start={String(el.lifecycleStepFromId)} end={String(el.lifecycleStepToId)} />
                )}
            </Xwrapper>
            </div>
        </div>
    );
}