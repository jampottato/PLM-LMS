
import "../Styles/AdminNav.css"
import {Nav,Navbar} from 'react-bootstrap';
import logo from '../assets/logo.png';
import {Link} from "react-router-dom";

import {BsHouseDoorFill, BsFillFileTextFill } from "react-icons/bs";
import Logout from "./Logout";

function AdminNav() {
  return (

    <Navbar className='Headernav' bg="white" variant="white">
      
    <Navbar.Brand>
        <ul className='logo'>
            <li><img src={logo} width="80px" height="auto" />{' '}</li>
        </ul>
        <ul>
            <li className='h1'>PAMANTASAN NG LUNGSOD NG MAYNILA</li>
            <li className='h2'>UNIVERSITY OF THE CITY OF MANILA</li>
        </ul>
    </Navbar.Brand>
      <Nav className='FunctionNav'>
        <Link to = "/StdHome" className='home'><BsHouseDoorFill/>  Home</Link>
        <Link to = "/AddMaterial" className='appointment'><BsFillFileTextFill/> Add Material</Link>
        <Logout/>
      </Nav>
    </Navbar>
  )
}

export default AdminNav;