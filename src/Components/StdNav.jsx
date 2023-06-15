import React from 'react';
import "../Styles/StdNav.css"
import {Nav,Navbar} from 'react-bootstrap';
import logo from '../assets/logo.png';
import {Link} from "react-router-dom";

import {BsHouseDoorFill, BsFillFileTextFill, BsBookHalf, BsFillPlayBtnFill } from "react-icons/bs";
import Logout from './Logout';
import Patron from './Patron';

function StdNav() {
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
        <Link to = '/Patron' className='appointment'><BsFillFileTextFill/> Appointment</Link>
        <Logout/>
      </Nav>
      
    </Navbar>
  )
}

export default StdNav;