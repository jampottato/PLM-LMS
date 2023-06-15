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
import {db} from "../FirebaseConfig";
import Select from '@material-ui/core/Select/Select';


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
      case 'CAUP':
        return ['BS in Architecture'];
      case 'CED':
        return ['BS in Elementary Education', 'BS in Early Childhood Education' ,'BSin Physical Education', 'BS in Secondary Education Major in English', 'BS in Secondary Education Major in Filipino', 'BS in Secondary Education Major in Math' , 'BS in Secondary Education Major in Science' , 'BS in Secondary Education Major in Social Studies'];
      case 'CET':
        return ['BS in Chemical Engineering,BS in Civil Engineering', 'BS in Computer Engineering', 'BS in Computer Science', 'BS in Electrical Engineering', 'BS in Electronic Engineering', 'BS in Information Technology', 'BS in Manufacturing Engineering', 'BS in Mechanical Engineering'];
      case 'CHASS':
        return ['BA in Communication' , 'BA in Communicaton major in Public Relations', 'BA in Public Relation', 'BS in Social Work', 'BS of Music in Music Performance'];
      case 'CL':
        return ['Juris Doctor'];
      case 'CMD':
        return ['Medicine'];
      case 'CN':
        return ['BS in Nursing'];
      case 'CPT':
        return ['BS in Physical Therapy'];
      case 'PLMBS':
        return ['BSA', 'BSBA-FM', 'BSBA-MM', 'BSBA-OM', 'BSBA-HRM', 'BSBA-BE', 'BS Entrep', 'BS REM', 'BSHM', 'BSTM', 'Master in Business Administration', 'Doctor of Business Administration']
      case 'COS':
        return ['BSin Biology major in Cell and Molecular Biology','BS in Biology major in Ecology', 'BS in Biology major in Medical Biology','BS in Chemistry','BS in Mathematics','BS in Psychology', 'Master of Arts in Psychology major in Clinical Psychology', 'Master of Arts in Psychology in Industrial Psychology']
      case 'GL':
        return ['Master of Law']
      case 'SG':
        return ['Professionalization Program for Public Procurement','Master in Government Management', 'Government Management']
      case 'PH':
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
                  setPatronName(event.target.value);
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
                  setPatronEmail(event.target.value);
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
            <Select
                select
                label="College Department"
                fullWidth
                value={college}
                onChange={(e) => {
                  setPatronCollege(event.target.value);
                  setCollege(e.target.value);
                  setCourse('');
                  
                }}
                error={!!errors.college}
                helperText={errors.college}
              >
                <MenuItem value="">Select College Department</MenuItem>
                <MenuItem value="CAUP">College of Architecture and Urban Planning</MenuItem>
                <MenuItem value="CED">College of Education</MenuItem>
                <MenuItem value="CET">College of Engineering</MenuItem>
                <MenuItem value="CHASS">College of Humanities, Arts and Social Sciences</MenuItem>
                <MenuItem value="CL">College of Law</MenuItem>
                <MenuItem value="CMD">College of Medicine</MenuItem>
                <MenuItem value="CN">College of Nursing</MenuItem>
                <MenuItem value="CPT">College of Physical Therapy</MenuItem>
                <MenuItem value="PLMBS">PLM Business School</MenuItem>
                <MenuItem value="COS">College of Science</MenuItem>
                <MenuItem value="GL">Graduate School of Law</MenuItem>
                <MenuItem value="SG">School of Government</MenuItem>
                <MenuItem value="PH">School of Public Health</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
            <Select
                select
                label="Program"
                fullWidth
                value={course}
                onChange={(e) => {
                  setPatronProgram(event.target.value);
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
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
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
                <MenuItem value="location1">Circulation</MenuItem>
                <MenuItem value="location2">Filipiniana</MenuItem>
                <MenuItem value="location3">GraduateSchool</MenuItem>
                <MenuItem value="location4">HealthSciences</MenuItem>
                <MenuItem value="location5">Internet</MenuItem>
                <MenuItem value="location6">Law</MenuItem>
                <MenuItem value="location7">Liliosa Hilao</MenuItem>
                <MenuItem value="location8">Medical</MenuItem>
                <MenuItem value="location9">MultimediaRoom</MenuItem>
                <MenuItem value="location10">OspitalNgMaynila</MenuItem>
                <MenuItem value="location11">Reference</MenuItem>
              </Select>
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