import logo from './logo.svg';
import './App.css';
import AddMaterial from './comp/AddMaterial.js';
import BooksList from './comp/BooksList.js';
import Borrow from './comp/Borrow.js';
import AdminAppoint from './comp/AdminAppoint';
import AdminEdit from './comp/AdminEdit';

function App() {
  return (
    <div className="App">
      <AddMaterial/>
      <br/>
      <BooksList/>
      <br/>
      <Borrow/>
      <br/>
      <AdminAppoint/>
      <br/>
      <AdminEdit/>
    </div>
  );
}

export default App;
