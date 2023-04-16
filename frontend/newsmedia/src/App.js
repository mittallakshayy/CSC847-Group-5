import {useState} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';


function App() {
 
  const [toggle, setToggle] = useState(true);

 

  return (<>
    <Navbar setToggle={setToggle}></Navbar>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setToggle={setToggle} />}></Route>
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;