import Button from '@mui/material/Button';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { IconLogout2 } from '@tabler/icons-react';

function Logout() {

    const navigate = useNavigate();

  const handleSignOut = async () => {
    const auth = getAuth();

    const confirmed = window.confirm('Are you sure you want to sign out?');

    if (confirmed) {
      try {
        await signOut(auth);
        // Sign-out successful.
        navigate('/'); // Redirect to the login page or any other desired page
      } catch (error) {
        // An error happened.
        console.log(error.message);
      }
    }
  };

  return (
    <Button
    leftIcon={<IconLogout2/>} 
    variant='subtle'
    color="dark" 
    onClick={handleSignOut}
    >
      Logout
    </Button>
    );
  }


export default Logout