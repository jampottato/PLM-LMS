import '../Styles/Tutorial.css';
import React from 'react'
import Button from 'react-bootstrap/Button';
import StdNav from '../Components/StdNav'
import Footer from "../Components/Footer";
import ReactPlayer from 'react-player/lazy'


function Tutorial() {
  return (
    <div className='wrapper2'>
      <StdNav/>

      <div className='container'>

      <div className='wrapper'>
    <ReactPlayer
      className='player'
      playing
      url='https://youtu.be/dQw4w9WgXcQ'
      width='100%'
      height='100%'
    /></div>
      <div className='btn'>
      <Button variant= 'dark'>Tutorial One</Button>
      <Button variant= 'dark'>Tutorial Two</Button>
      <Button variant= 'dark'>Tutorial Three</Button>   
      </div>

      
    </div>
      
      <Footer/>
    </div>
   
  )
}

export default Tutorial;
