import {useState} from "react";
import {db} from "../Database/firebase-config";
import {addDoc, collection} from "firebase/firestore";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import AdminNav from "./adminNav";
import Footer from "../Components/Footer";


function AddMaterial() {
    //Add Book
    const [m_author, setNewAuthor] = useState("")
    const [m_call_num, setNewCall_num] = useState("")
    const [m_copies, setNewCopies] = useState("")
    const [m_copyright, setNewCopyright] = useState("")
    const [m_dept, setNewDept] = useState("")
    const [m_edition, setNewEdition] = useState("")
    const [m_isbn, setNewIsbn] = useState("")
    const [m_lccn, setNewLccn] = useState("")
    const [m_pages, setNewPages] = useState(0)
    const [m_pub, setNewPublication] = useState("")
    const [m_pub_date, setNewPubDate] = useState("")
    const [m_title, setTitle] = useState("")
    const [m_type, setNewType] = useState("")
   

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    let isEqual = false;

    //Add Doc to students
    // Add a new document in collection "Student"
    const AddMaterial = async () => {
        if(confirm('Are you sure you want to add this book?')){
            if (isEqual == false) {
                //check if the added stuff is existing
                console.log("ISEQUAL: ", isEqual)
                await addDoc(collection(db, "Material"), {
        
                    m_author:   m_author ,
                    m_call_num: m_call_num,
                    m_copies:   m_copies,
                    m_copyright: m_copyright,
                    m_dept: m_dept,
                    m_edition: m_edition,
                    m_isbn: m_isbn,
                    m_lccn: m_lccn,
                    m_pages: m_pages,
                    m_pub: m_pub,
                    m_pub_date: m_pub_date,
                    m_title: m_title,
                    m_type: m_type,
                       
                }).then(()=>{
                    setIsModalOpen(true);
                })
        }
        
        
    }};

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    return (
        <div>
            <AdminNav/>
            <div >
            <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '50%'},}}noValidateautoComplete="off">
                <div style={{ display: 'grid', placeItems: 'center', height: '100vh'}}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Author"
                       
                        onChange={(event)=>{setNewAuthor(event.target.value)}}
                    />
                    <TextField
                        id="outlined-number"
                        label="Call Number"
                        
                        InputLabelProps={{
                            shrink: true,}}
                        onChange={(event)=>{setNewCall_num(event.target.value)}}
                    />

                    <TextField
                        id="outlined-number"
                        label="Number of Copies"
                        type="number"
                        InputLabelProps={{
                            shrink: true,}}
                            onChange={(event)=>{setNewCopies(event.target.value)}}
                    />
                    <TextField
                        required
                        id="outlined-required"
                        label="Copyright"
                        
                        onChange={(event)=>{setNewCopyright(event.target.value)}}
                    />
                    <TextField
                        required
                        id="outlined-required"
                        label="College Department"
                        
                        onChange={(event)=>{setNewDept(event.target.value)}}
                    />
                    <TextField
                        required
                        id="outlined-required"
                        label="Edition"
                        
                        onChange={(event)=>{setNewEdition(event.target.value)}}
                    />
                    <TextField
                        required
                        id="outlined-required"
                        label="ISBN"
                        
                        onChange={(event) => {setNewIsbn(event.target.value)}}
                    />
                     <TextField
                        required
                        id="outlined-required"
                        label="LCCN"
                        
                        onChange={(event) => {setNewLccn(event.target.value)}}
                    />
                     <TextField
                        required
                        id="outlined-required"
                        label="Page Number"
                        
                        onChange={(event) => {setNewPages(event.target.value)}}
                    />
                     <TextField
                        required
                        id="outlined-required"
                        label="Publication"
                       
                        onChange={(event)=>{setNewPublication(event.target.value)}}
                    />
                     <TextField
                        required
                        id="outlined-required"
                        label="Publication Date"
                       
                        onChange={(event)=>{setNewPubDate(event.target.value)}}
                    />
                     <TextField
                        required
                        id="outlined-required"
                        label="Material Title"
                       
                        onChange={(event)=>{setTitle(event.target.value)}}
                    />
                      <TextField
                        required
                        id="outlined-required"
                        label="Material Type"
                        
                        onChange={(event)=>{setNewType(event.target.value)}}
                    />
                   
                   <button onClick={AddMaterial}>Submit</button>
                </div>
               
              <div>
           
              </div>
                        <Modal
                        open={isModalOpen}
                        onClose={handleCloseModal}
                        aria-labelledby="material-added-modal-title"
                        aria-describedby="material-added-modal-description"
                    >
                        <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            p: 4,
                        }}
                        >
                        <Typography id="material-added-modal-title" variant="h6" component="h2">
                            Material successfully added!
                        </Typography>
                        <Typography id="material-added-modal-description">
                        </Typography>
                        </Box>
                    </Modal>
                    
                    </Box>
                </div>
        </div>
        
    );
  
                    }

export default AddMaterial;