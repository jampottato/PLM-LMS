import {useState, useEffect} from "react";
import {db} from "../firebase";
import {addDoc, collection, setDoc, doc, getDocs, updateDoc} from "firebase/firestore";

function AddMaterial() {
    //Add Book
    const [book_author, setNewAuthor] = useState("")
    const [book_copyright, setNewCopyright] = useState("")
    const [book_pages, setNewPages] = useState(0)
    const [book_publication, setNewPublication] = useState("")
    const [book_publication_date, setNewPubDate] = useState("")
    const [book_is_ebook, setNewIsEbook] = useState("")
    const [book_edition, setNewEdition] = useState("")
    const [book_isbn, setNewIsbn] = useState("")
    const [book_lccn, setNewLccn] = useState("")

    const [material_description, setMDesc] = useState("")
    const [material_copies, setMCopies] = useState(0)
    const [material_price, setMPrice] = useState(0)
    const [material_type, setMType] = useState("")
    const [material_category, setMCategory] = useState("")
    const [material_title, setMTitle] = useState("")
    
    let isEqual = false;

    //Add Doc to students
    // Add a new document in collection "Student"
    const addStudents = async () => {
        if (isEqual == false) {
        //check if the added stuff is existing
        console.log("ISEQUAL: ", isEqual)
        await addDoc(collection(db, "Material"), {
                material_category:      material_category,
                material_copies:        material_copies,
                material_description:   material_description,
                material_price:         material_price,
                material_title:         material_title,
                material_type:          material_type
                }).then((thisDoc)=>{
                        setDoc(doc(db, "Book", thisDoc.id), {
                                book_author:            book_author,
                                book_edition:           book_edition,
                                book_publication:       book_publication,
                                book_publication_date:  book_publication_date,
                                book_isbn:              book_isbn,
                                book_lccn:              book_lccn,
                                book_copyright:         book_copyright,
                                book_pages:             book_pages,
                                book_is_ebook:          book_is_ebook
                                })
                })

        
        // IF THESIS/DISSERTATION
        }
    }

    const checker = async () => {
        if(material_copies <= 0){alert("You have to add atleast 1 copy");return;}

        getDocs(collection(db,"Material")).then((docsHere)=>{
            docsHere.docs.map((dc)=>{
                if (material_title == dc.data().material_title && material_price == dc.data().material_price && material_description == dc.data().material_description && material_category == dc.data().material_category && material_type == dc.data().material_type) {
                    isEqual = true;
                    // set the DOC details to have +x copy, x being the copies of new dplicated material
                    const copyVal = dc.data().material_copies;
                    const addedCopyDoc = doc(db, "Material", dc.id)
                    updateDoc(addedCopyDoc, {
                        material_copies : parseInt(copyVal) + parseInt(material_copies)
                    }, {merge:true})
                }
            })
        }).then(()=>{
            addStudents();
            }
        );
    }

    const addStudent = () => {
        checker();
    }

    return (
        <div>
            <input  placeholder='Material Category' 
                    onChange={(event)=>{setMCategory(event.target.value)}}/>
            <br/>
            <input  type="number"
                    placeholder='Material Copies' 
                    onChange={(event)=>{setMCopies(event.target.value)}}/>
            <br/>
            <input  placeholder='Material Description' 
                    onChange={(event)=>{setMDesc(event.target.value)}}/>
            <br/>
            <input  type="number"
                    placeholder='Price' 
                    onChange={(event)=>{setMPrice(event.target.value)}}/>
            <br/>
            <input  placeholder='Material Title' 
                    onChange={(event)=>{setMTitle(event.target.value)}}/>
            <br/>
            <input  placeholder='Material Type' 
                    onChange={(event)=>{setMType(event.target.value)}}/>
            <br/>



            <br/>
            <input  placeholder='ISBN' 
                    onChange={(event) => {setNewIsbn(event.target.value)}}/>
            <br/>
            <input  placeholder='LCCN' 
                    onChange={(event) => {setNewLccn(event.target.value)}}/>
            <br/>
            <input  placeholder='Publication' 
                    onChange={(event)=>{setNewPublication(event.target.value)}}/>
            <br/>
            <input  placeholder='Publication Date' 
                    onChange={(event)=>{setNewPubDate(event.target.value)}}/>
            <br/>
            <input  
                    placeholder='Ebook/book' 
                    onChange={(event)=>{setNewIsEbook(event.target.value)}}/>
            <br/>
            <input  type="number"
                    placeholder='Pages' 
                    onChange={(event)=>{setNewPages(event.target.value)}}/>
            <br/>
            <input
                    placeholder='Copyright' 
                    onChange={(event)=>{setNewCopyright(event.target.value)}}/>
            <br/>
            <input  placeholder='Author' 
                    onChange={(event)=>{setNewAuthor(event.target.value)}}/>
            <br/>
            <input
                    placeholder='Edition' 
                    onChange={(event)=>{setNewEdition(event.target.value)}}/>
            <br/>


            

            <button onClick={addStudent}>Submit</button>
        </div>
    );
}


export default AddMaterial;