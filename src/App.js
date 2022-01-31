import './App.css';
import './dnd.css';
import {Diagram} from './Diagram/Diagram'
import Sidebar from './Diagram/Sidebar'


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
