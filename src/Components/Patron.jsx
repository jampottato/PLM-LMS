import PatronForm from "./PatronForm"
import {Paper, makeStyles} from '@material-ui/core'
import StdNav from "./StdNav";
import Footer from "./Footer";

function Patron() {
    const useStyles= makeStyles(theme => ({
        pageContent: {
            margin: theme.spacing(5),
            padding: theme.spacing(3),
            
        }
    }))

    const classes = useStyles();
  return (
        <>
        <StdNav/>
        <Paper className={classes.pageContent}>
            <PatronForm/>
        </Paper>
        <Footer/>
        </>
  
  )
}

export default Patron

