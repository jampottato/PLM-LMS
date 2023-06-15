import PatronForm from "./PatronForm"
import Paper from '@mui/material/Paper';
// import {makeStyles} from '@material-ui/core/styles'

function Patron() {
    // const useStyles= makeStyles(theme => ({
    //     pageContent: {
    //         margin: theme.spacing(5),
    //         padding: theme.spacing(3),
            
    //     }
    // }))

    // const classes = useStyles();
  return (
        <>
        <Paper >
            <PatronForm/>
        </Paper>
        </>
  
  )
}

export default Patron

