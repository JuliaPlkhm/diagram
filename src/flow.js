import React, {useState} from 'react';
import ReactFlow, {removeElements} from 'react-flow-renderer';
import data from './data.json'

const initialElements = []

function getElements (data){
    data.steps.map((el)=>{ 
        const item ={
            id: el.lifecycleStepId,
            type: 'default', // input node
            data: { label: el.lifecycleStepName },
            position: { x: el.lifecycleStepXPosition, y: el.lifecycleStepYPosition },
        }
        initialElements.push(item)
    })
    data.links.map((el) =>{
        const item ={
            id: `e${el.lifecycleStepFromId}-${el.lifecycleStepToId}`, 
            source: `${el.lifecycleStepFromId}`, 
            target: `${el.lifecycleStepToId}`,
            arrowHeadType: 'arrowclosed', 
            animated: true
        }
        initialElements .push(item)
    })
    
}

getElements(data)

const Flow = () => {
    const [elements, setElements] = useState(initialElements);
    const onElementsRemove = (elementsToRemove) =>{
        setElements((els) => removeElements(elementsToRemove, els));
        console.log(elements)
    }

    return (

        <div style={{ height: '100vh'}}>
            <ReactFlow elements={elements} onElementsRemove={onElementsRemove}/>
        </div>
    )
};
export default Flow