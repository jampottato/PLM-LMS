import React from 'react'
import "../Styles/Resources.css"
import Accordion from 'react-bootstrap/Accordion';
import StdNav from '../Components/StdNav'
import Footer from "../Components/Footer"

function Resources() {
  return (
    <div className='Container'>
      <StdNav/>     

      <div className='Box1'>
        <div className='paid'>
        <Accordion>
          <h5>Online Library Resources Subscriptions</h5>
          <Accordion.Item eventKey="0">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>ACCESS Physiotheraphy</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: Medicine20
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="5">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="6">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

        </Accordion>
        </div>
        <div className='free'>
        <Accordion>
          <h5>Open/Free Educational Resources</h5>
          <Accordion.Item eventKey="0">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>ACCESS Physiotheraphy</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: Medicine20
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="5">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="6">
            <Accordion.Header>ACCESS Engineering</Accordion.Header>
            <Accordion.Body>
              Username: pnlm <br/>
              Password: engineering
            </Accordion.Body>
          </Accordion.Item>

        </Accordion>
        </div>
      </div>    
    <Footer/>
  </div>
  )
}

export default Resources;