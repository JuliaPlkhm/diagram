import React, {useEffect, useState, useRef,} from 'react';
import { Xwrapper} from 'react-xarrows';

import { DraggableBox } from './DraggableBox';
import { Arrow } from './Arrow';

export function Diagram() {
  const reactFlowWrapper = useRef(null);
  const [steps, setSteps] = useState([]);
  const [links, setLinks] = useState([]);

  const addArrow = ({ start, end }) => {
    setLinks([...links, { "lifecycleStepFromId": start, "lifecycleStepToId": end }]);
  };

  const handleStop = (id) => (event, dragElement) => {

    fetch(`http://localhost:3000/steps/${id}`, {
      method: "PATCH", headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ lifecycleStepXPosition: dragElement.x, lifecycleStepYPosition: dragElement.y })
    })
      .then(response => {
        console.log(response.status);
        return response.json()
      })
      .then(data => console.log(data));
  };

  useEffect(() => {
    fetch("http://localhost:3000/steps")
      .then(response => response.json())
      .then(data => setSteps(data))
      .catch(err => console.log(err));

    fetch("http://localhost:3000/links")
      .then(response => response.json())
      .then(data => setLinks(data))
      .catch(err => console.log(err));
  }, [])

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const name = event.dataTransfer.getData('application/reactflow');
    const newNode = {
      lifecycleStepId: steps[steps.length - 1].lifecycleStepId + 1,
      lifecycleStepXPosition: event.clientX - reactFlowBounds.left,
      lifecycleStepYPosition: event.clientY - reactFlowBounds.top,
      lifecycleStepName: name
    };
    if (name) {
      setSteps([...steps, newNode]);
    }
  };

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
      <div style={{ height: '800px' }} onDrop={onDrop}
        onDragOver={onDragOver}>
        <Xwrapper>
          {steps.map((el) =>
            <DraggableBox key={el.lifecycleStepId} addArrow={addArrow} id={el.lifecycleStepId} name={el.lifecycleStepName} note={el.lifecycleStepNote} x={el.lifecycleStepXPosition} y={el.lifecycleStepYPosition} handleStop={handleStop} />)}

          {links.map((el) =>
            <Arrow key={`${el.lifecycleStepFromId}-${el.lifecycleStepToId}`} start={String(el.lifecycleStepFromId)} end={String(el.lifecycleStepToId)} />
          )}
        </Xwrapper>
      </div>
    </div>
  );
}