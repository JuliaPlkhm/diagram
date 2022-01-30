import logo from './logo.svg';
import './App.css';
import DnDFlow from './ReactFlow/ReactFlow'

import {Diagram} from './Diagram'
import Sidebar from './Sidebar'


function App() {
  return (
    <div className="dndflow">
      {/* <div className="reactflow-wrapper" > */}
     <Diagram ></Diagram>
     {/* <DnDFlow></DnDFlow> */}
     {/* </div> */}
     <Sidebar></Sidebar>
     {/* <DnDFlow ></DnDFlow> */}
    </div>
  );
}

export default App;
