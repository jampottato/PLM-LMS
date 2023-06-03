import '../Styles/Home.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import { Nav, Navbar} from 'react-bootstrap'
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BsFillTelephoneFill, BsFillEnvelopeFill } from "react-icons/bs";
import Login from '../Components/Login';
import HomeFooter from '../Components/Home-Footer'
import HomeCarousel from '../Components/Home-Carousel';
import logo from '../assets/logo.png';
import fire from  '../assets/fire.jpg';;


function Header() {

  return (
    <div className="App">
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

        <Navbar.Toggle className="coloring" />
        <Navbar.Collapse>
          <Nav className='mslogin'>
            <Login/>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="content">
        <HomeCarousel/>
        <div className='SubContent'>
          
          <img src={fire}/>
          <img src={fire}/>

          <div className='ContentText'>
            <h2>Hero Title Sample</h2>
            <h3>Hero Sub-title Description</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse </p>
              <Button href="" variant='dark'>Read More</Button>
          </div>
        </div>
          <div className='Contact'>
            <img src={logo}/>
            <h2>Contact Us</h2>
            <h3>Send us a message</h3>
            <p><BsFillTelephoneFill/>  (08) 400 2000</p>
            <p><BsFillEnvelopeFill/>  emailaddress@gmail.com</p>
          </div>
      </div>
      <div className='ft'> <HomeFooter/></div>
    </div>
  );
}

export default Header;