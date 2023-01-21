import React from 'react';
import "../Styles/StdNav.css"
import {Nav,Navbar} from 'react-bootstrap';
import logo from '../assets/logo.png';
import {Link} from "react-router-dom";

import {BsHouseDoorFill, BsFillFileTextFill, BsBookHalf, BsFillPlayBtnFill } from "react-icons/bs";

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
        <Link to = '/Appointment' className='appointment'><BsFillFileTextFill/> Appointment</Link>
        <Link to = '/Resources' className='resources'><BsBookHalf/> Resources</Link>
        <Link to = "/Tutorial" className=' tutorial'><BsFillPlayBtnFill/> Tutorial</Link>
      </Nav>
    </Navbar>
  )
}

export default AdminNav;