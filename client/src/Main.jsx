import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './Routes/Home';
import Resources from './Routes/Resources'
import Appointment from './Routes/Appointment'
import StdNav from "./Components/StdNav";
import StdHome from "./Routes/StdHome";
import Tutorial from "./Routes/Tutorial";
import Homevs from "./Routes/Homevs";

function Main() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/Resources" element={<Resources/>}/>
      <Route path="/Appointment" element={<Appointment/>}/>
      <Route path="/Tutorial" element={<Tutorial/>}/>
      <Route path="/StdNav" element={<StdNav/>}/>
      <Route path="/StdHome" element={<StdHome/>}/>
      <Route path="/Homevs" element={<Homevs/>}/>
    </Routes>
   </Router>
  );
}



export default Main;
