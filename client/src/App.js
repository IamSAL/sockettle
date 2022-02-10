import "./App.scss";
import { Routes, Route, Link } from "react-router-dom";
import Controller from "./Pages/Controller/index";
import Display from "./Pages/Display/index";
import Landing from "./Pages/index";

function App() {
  return (
    <div className="App container-fluid">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/controller" element={<Controller />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    </div>
  );
}

export default App;
