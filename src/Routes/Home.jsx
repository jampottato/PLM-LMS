import '../Styles/Home.css';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
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
import { auth } from '../Database/firebase-config';
import { useEffect } from 'react';


function Header() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true)

  useEffect(()=>{
    auth.onAuthStateChanged(user => {
      if(user != null) {
        navigate('/StdHome')
      } else {
        setShowLogin(false)
      }
    })
  })
  

  return (
    <div className="App" hidden={showLogin}>
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
          <h2>Haribon - Library Management System</h2>
            <h3>Haribon: Redefining Library Management System with Enchanced Online Capabilities</h3>
            <p> An enhanced system that prioritizes a better user experience with its user-friendly interface and streamlined features, ensuring easy navigation and optimal usability.</p>
             
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