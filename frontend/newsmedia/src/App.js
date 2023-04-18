import {useState} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Article from './pages/Home/Article';


function App() {
 
  const [toggle, setToggle] = useState(true);

 

  return (<>
    
    <BrowserRouter>
    <Navbar setToggle={setToggle} toggle={toggle}></Navbar>
      <Routes>
        <Route path="/" element={<Home setToggle={setToggle} toggle={toggle} />}></Route>
        <Route path="/article/:title" element={<Article/> }> </Route>
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;