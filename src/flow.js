import React, {useState, useEffect, useCallback} from 'react';
import ReactFlow, {removeElements} from 'react-flow-renderer';

// const initialElements = []

// function getElements (data){
//     data.steps.map((el)=>{ 
//         const item ={
//             id: el.lifecycleStepId,
//             type: 'default', // input node
//             data: { label: el.lifecycleStepName },
//             position: { x: el.lifecycleStepXPosition, y: el.lifecycleStepYPosition },
//         }
//         initialElements.push(item)
//     })
//     data.links.map((el) =>{
//         const item ={
//             id: `e${el.lifecycleStepFromId}-${el.lifecycleStepToId}`, 
//             source: `${el.lifecycleStepFromId}`, 
//             target: `${el.lifecycleStepToId}`,
//             arrowHeadType: 'arrowclosed', 
//             animated: true
//         }
//         initialElements .push(item)
//     })
    
// }


const Flow = () => {
    const [steps, setSteps]= useState([])
    const [links, setLinks]= useState([])
    const [elements, setElements] = useState();
    const [rfInstance, setRfInstance] = useState(null);
    const onElementsRemove = (elementsToRemove) =>{
        setElements((els) => removeElements(elementsToRemove, els));
        console.log(elements)
    }

    useEffect(()=>{
        fetch("http://localhost:3000/steps")
        .then( response => response.json())
        .then( data => setSteps(data))
        .then( () => getElements(steps))
        .catch(err=> console.log(err))

        fetch("http://localhost:3000/links")
        .then( response => response.json())
        .then( data => setLinks(data))
        .then( ()=> getElements(links))
        .catch(err=> console.log(err))

    },[])

    const getElements = (data)=>{
        if(data === steps){
            data.map((el)=>{ 
                const item ={
                    id: el.lifecycleStepId,
                    type: 'default', // input node
                    data: { label: el.lifecycleStepName },
                    position: { x: el.lifecycleStepXPosition, y: el.lifecycleStepYPosition },
                }
                setElements([...elements, item])
            })
        } else {
            data.map((el) =>{
                const item ={
                    id: `e${el.lifecycleStepFromId}-${el.lifecycleStepToId}`, 
                    source: `${el.lifecycleStepFromId}`, 
                    target: `${el.lifecycleStepToId}`,
                    arrowHeadType: 'arrowclosed', 
                    animated: true
                }
                setElements([...elements, item])
            })
            
        }
    }       

const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log(flow)
    }
  }, [rfInstance]);


    return (

        <div style={{ height: '100vh'}}>
            <ReactFlow elements={elements} onLoad={setRfInstance} />
        </div>
    )
};
export default Flow