import  { useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  Modal,
  Box
} from '@mui/material';
import {addDoc, collection} from "firebase/firestore"
import {db} from "../Database/firebase-config";



const AppointmentSystem = () => {

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  //full name, student number, patron type, program, college, section, email
//Add Book
const [Patron_name, setPatronName] = useState("")
const [Patron_user_number, setUserNumber] = useState("")
const [Patron_college, setPatronCollege] = useState("")
const [Patron_program, setPatronProgram] = useState("")
const [Patron_Location, setPatronLocation] = useState("")
const [Patron_email, setPatronEmail] = useState("")
const [Patron_DateTime, setPatronDateTime] = useState("")

const addAppointment = async () => {
    await addDoc(collection(db, "Appointment"), {
        appnt_full_name:        Patron_name,
        appnt_user_number:      Patron_user_number,
        appnt_college:          Patron_college,
        appnt_program:          Patron_program,
        appnt_section:          Patron_Location,
        appnt_email:            Patron_email,
        appnt_datetime:         Patron_DateTime
        })
    }
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    let isValid = true;
    // Name validation
    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
      isValid = false;
    } else if (fullName.trim().length < 9) {
      errors.fullName = 'Full Name must be at least 9 characters long';
      isValid = false;
    }

    // ID validation
    if (!idNumber.trim()) {
      errors.idNumber = 'ID Number is required';
      isValid = false;
    } else if (!/^\d+$/.test(idNumber.trim())) {
      errors.idNumber = 'ID Number must contain only numbers';
      isValid = false;
    } else if (idNumber.trim().length < 9) {
      errors.idNumber = 'ID Number must be at least 9 characters long';
      isValid = false;
    } else if (idNumber.trim().match(/[^\d]|-/)) {
      errors.idNumber = 'ID Number must contain only numbers';
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!email.includes('@')) {
      errors.email = 'Email must be a valid email address';
      isValid = false;
    }
    if (!college) {
      errors.college = 'College is required';
      isValid = false;
    }

    if (!course) {
      errors.course = 'Course is required';
      isValid = false;
    }

    if (!location) {
      errors.location = 'Location is required';
      isValid = false;
    }

    if (!dateTime) {
      errors.dateTime = 'Date and Time is required';
      isValid = false;
    }

    setErrors(errors);

    if (isValid) {
      // Do something with the form data
      console.log({
        fullName,
        email,
        idNumber,
        college,
        course,
        location,
        dateTime,
      });

      // Reset form fields
      setFullName('');
      setEmail('');
      setIdNumber('');
      setCollege('');
      setCourse('');
      setLocation('');
      setDateTime('');

      // Open the modal
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getCoursesForCollege = (college) => {
    // Map college to available courses
    switch (college) {
      case 'College of Architecture and Urban Planning':
        return ['BS in Architecture'];
      case 'College of Education':
        return ['BS in Elementary Education', 'BS in Early Childhood Education' ,'BSin Physical Education', 'BS in Secondary Education Major in English', 'BS in Secondary Education Major in Filipino', 'BS in Secondary Education Major in Math' , 'BS in Secondary Education Major in Science' , 'BS in Secondary Education Major in Social Studies'];
      case 'College of Engineering and Technologies':
        return ['BS in Chemical Engineering,BS in Civil Engineering', 'BS in Computer Engineering', 'BS in Computer Science', 'BS in Electrical Engineering', 'BS in Electronic Engineering', 'BS in Information Technology', 'BS in Manufacturing Engineering', 'BS in Mechanical Engineering'];
      case 'College of Humanities, Arts and Social Sciences':
        return ['BA in Communication' , 'BA in Communicaton major in Public Relations', 'BA in Public Relation', 'BS in Social Work', 'BS of Music in Music Performance'];
      case 'College of Law':
        return ['Juris Doctor'];
      case 'College of Medicine':
        return ['Medicine'];
      case 'College of Nursing':
        return ['BS in Nursing'];
      case 'College of Physical Theraphy':
        return ['BS in Physical Therapy'];
      case 'PLM Business School':
        return ['BSA', 'BSBA-FM', 'BSBA-MM', 'BSBA-OM', 'BSBA-HRM', 'BSBA-BE', 'BS Entrep', 'BS REM', 'BSHM', 'BSTM', 'Master in Business Administration', 'Doctor of Business Administration']
      case 'College of Science':
        return ['BSin Biology major in Cell and Molecular Biology','BS in Biology major in Ecology', 'BS in Biology major in Medical Biology','BS in Chemistry','BS in Mathematics','BS in Psychology', 'Master of Arts in Psychology major in Clinical Psychology', 'Master of Arts in Psychology in Industrial Psychology']
      case 'Graduate School of Law':
        return ['Master of Law']
      case 'School of Goverment':
        return ['Professionalization Program for Public Procurement','Master in Government Management', 'Government Management']
      case 'School of Public Health':
        return ['Certificate in Public Health','Master of Public Health', 'Public Health Learning Series']
        default:
        return [];
        
    }
  };

const coursesForCollege = getCoursesForCollege(college);



  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Make an appointment:</Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                fullWidth
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setPatronName(e.target.value);
                 }}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="PLM Email"
                fullWidth
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setPatronEmail(e.target.value);
                }}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Number"
                fullWidth
                type='Number'
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value)
                  setUserNumber(event.target.value);
                }}
                error={!!errors.idNumber}
                helperText={errors.idNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                select
                label="College Department"
                fullWidth
                value={college}
                onChange={(e) => {
                  setPatronCollege(e.target.value);
                  setCollege(e.target.value);
                  setCourse('');
                  
                }}
                error={!!errors.college}
                helperText={errors.college}
              >
                <MenuItem value="">Select College Department</MenuItem>
                <MenuItem value="College of Architecture and Urban Planning">College of Architecture and Urban Planning</MenuItem>
                <MenuItem value="College of Education">College of Education</MenuItem>
                <MenuItem value="College of Engineering and Technologies">College of Engineering</MenuItem>
                <MenuItem value="College of Humanities, Arts and Social Sciences">College of Humanities, Arts and Social Sciences</MenuItem>
                <MenuItem value="College of Law">College of Law</MenuItem>
                <MenuItem value="College of Medicine">College of Medicine</MenuItem>
                <MenuItem value="College of Nursing">College of Nursing</MenuItem>
                <MenuItem value="College of Physical Theraphy">College of Physical Therapy</MenuItem>
                <MenuItem value="PLM Business School">PLM Business School</MenuItem>
                <MenuItem value="College of Science">College of Science</MenuItem>
                <MenuItem value="Graduate School of Law">Graduate School of Law</MenuItem>
                <MenuItem value="School of Goverment">School of Government</MenuItem>
                <MenuItem value="School of Public Health">School of Public Health</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                select
                label="Program"
                fullWidth
                value={course}
                onChange={(e) => {
                  setPatronProgram(e.target.value);
                  setCourse(e.target.value)
                  
                }}
                error={!!errors.course}
                helperText={errors.course}
                disabled={!college}
              >
                <MenuItem value="">Select Program</MenuItem>
                {coursesForCollege.map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Library Location"
                fullWidth
                value={location}
                onChange={(e) => {
                  setPatronLocation(e.target.value);
                  setLocation(e.target.value)
                 
                }}
                error={!!errors.location}
                helperText={errors.location}
              >
                <MenuItem value="">Select Location</MenuItem>
                <MenuItem value="Circulation Section">Circulation Section</MenuItem>
                <MenuItem value="Filipiniana Section">Filipiniana Section</MenuItem>
                <MenuItem value="GraduateSchool Section">GraduateSchool Section</MenuItem>
                <MenuItem value="HealthSciences Section">HealthSciences</MenuItem>
                <MenuItem value="Internet Section">Internet Section</MenuItem>
                <MenuItem value="Law Section">Law Section</MenuItem>
                <MenuItem value="Liliosa Hilao Section">Liliosa Hilao Section</MenuItem>
                <MenuItem value="Medical">Medical Section</MenuItem>
                <MenuItem value="MultimediaRoom Section">MultimediaRoom Section</MenuItem>
                <MenuItem value="Ospital Ng Maynila Section">Ospital Ng Maynila Section</MenuItem>
                <MenuItem value="Reference Section">Reference Section</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date and Time"
                fullWidth
                type="datetime-local"
                value={dateTime}
                onChange={(e) => {
                  setDateTime(e.target.value);
                  setPatronDateTime(event.target.value);
                }}
                error={!!errors.dateTime}
                helperText={errors.dateTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" onClick={addAppointment}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6">Appointment Submitted!</Typography>
          <Typography variant="body1">
            Thank you for making an appointment. 
            Please show this appointment and an ID Before entering the library section. 
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Modal>
    </Grid>
      </Grid>
  );
};

export default AppointmentSystem;
