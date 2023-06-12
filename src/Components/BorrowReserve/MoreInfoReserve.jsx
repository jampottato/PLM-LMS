import {useState, useEffect} from "react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal , Group, ScrollArea, Stack, Container, Grid, Center, Paper} from '@mantine/core';

function MoreInfoReserve(props) {
    const [opened, { open, close }] = useDisclosure(false)
    const genericStyle = {
        borderColor : '#1c7ed6',
        borderWidth : '1px',
        borderStyle : 'solid',
        borderRadius : '5px',
        padding : '10px'
    }
    const buttonPosition = {
        margin : 0,
        padding : 10,
    }

    const styledHeader = () => {
        return (
            <>
                <h4>MORE DETAILS</h4>
            </>
        )
    }
    

    return (
        <div style={buttonPosition}>
            <Button onClick={open} style={buttonPosition} color='green'>more info</Button>
            <Modal 
                
                opened={opened} 
                onClose={close} 
                title={styledHeader()}
                size = '80%'
                scrollAreaComponent={ScrollArea.Autosize}
                overlayProps={{
                    opacity: 0.55,
                    blur: 3,
                }}
                transitionProps={{ transition: 'slide-up', duration: 900 }}
            >

                <Stack>
                    <Group grow position='center'>
                        <Container align='center' style={genericStyle}>
                            <p><span style={{fontWeight:'bold'}}>Call Number</span></p>
                            <p>{props.dataHere.m_call_num}</p>
                        </Container>
                    </Group>
                    <Group grow position='center'>
                        <Container align='center' style={genericStyle}>
                            <p><span style={{fontWeight:'bold'}}>Title</span></p>
                            <p>{props.dataHere.m_title}</p>
                        </Container>
                        <Container align='center' style={genericStyle}>
                            <p><span style={{fontWeight:'bold'}}>Author</span></p>
                            <p>{props.dataHere.m_author}</p>
                        </Container>
                    </Group>
                    <Group grow position='center'>
                        <Container align='center' style={genericStyle}>
                            <p><span style={{fontWeight:'bold'}}>Department</span></p>
                            <p>{props.dataHere.m_dept}</p>
                        </Container>
                        <Container align='center' style={genericStyle}>
                            <p><span style={{fontWeight:'bold'}}>Published Year</span></p>
                            <p>{props.dataHere.m_pub_date}</p>
                        </Container>
                        <Container align='center' style={genericStyle}>
                            <p><span style={{fontWeight:'bold'}}>Available Copies</span></p>
                            <p>{props.dataHere.m_copies}</p>
                        </Container>
                    </Group>
                </Stack>
            </Modal>
        </div>
        )
}
export default MoreInfoReserve;