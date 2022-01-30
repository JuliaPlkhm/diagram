import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  ArrowHeadType,
  Controls,
} from 'react-flow-renderer';
import ConnectionLine from './ConnectionLine';

import Sidebar from './Sidebar';

import './dnd.css';

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const edgeTypes = {
    type: 'straight',
    arrowHeadType: 'arrowclosed',
  };

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements((els) =>  addEdge({ ...params, arrowHeadType: ArrowHeadType.Arrow }, els));
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLoad = (_reactFlowInstance) =>{
    setReactFlowInstance(_reactFlowInstance);
    // console.log(_reactFlowInstance.toObject().position)

  }
//    useEffect(() => {
//        if(reactFlowInstance){
//         console.log(reactFlowInstance.toObject().position)
//        }
    
//   }, [reactFlowInstance]);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
 
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
     
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` },
    };
    setElements((es) => es.concat(newNode));
  };
   
  const onNodeDragStop = (event, node) => {
    if (reactFlowInstance) {
    //   const flow = rfInstance.toObject();
    //   localforage.setItem(flowKey, flow);
    let index = elements.findIndex((element) => element.id === node.id);
      console.log(reactFlowInstance.toObject().elements[index].position, node.id)
    }
  }

//   const onNodeDragStop = (event, node) => {
//     let elementsCopy = elements;
//     let index = elements.findIndex((element) => element.id === node.id);
//     let newPositionNode = elements[index];
//     newPositionNode.position = node.position;
//     elementsCopy.splice(index, 1, newPositionNode);
//     setElements(elementsCopy);
//     console.log(node.position)
//   };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            edgeTypes={edgeTypes}
            onNodeDragStop={onNodeDragStop}
            connectionLineComponent={ConnectionLine}
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;