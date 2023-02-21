import {useState, useEffect} from "react";
import {db} from "../firebase";
import {setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, updateDoc} from "firebase/firestore";

function AdminEdit() {
    let activeStudentNum = "202011847";
    let patronType = "Student";

    const [book_author, setNewAuthor] = useState("")
    const [book_copyright, setNewCopyright] = useState("")
    const [book_pages, setNewPages] = useState("")
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

    //MATERIAL DETAILS
    const [searchRes, setSearchRes] = useState([])
    const [materialResult, setMaterialResult] = useState([])
    const [totalRes, setTotalRes] = useState([])
    //SEARCH VALUE
    const [searchVal, setSearchVal] = useState("")
    //REFERNCES
    const colRefBooks = collection(db, "Book")
    const colRefMaterial = collection(db, "Material")
    const colRefIssue = collection(db, "Issue")

    //START: search for something with material title and category
    const studentRawQueryTitle = "Title 1";
    let studentRawQueryCategory = "";
    let studentQueryBook = query(colRefMaterial);
    
    const ff = async ()=>{
        await onSnapshot(studentQueryBook, (qSnapshot)=>{
            setMaterialResult(
                qSnapshot.docs.map((docMaterial)=>({
                    material_id : docMaterial.id,
                    material_title : docMaterial.data().material_title,
                    material_copies : docMaterial.data().material_copies,
                    material_price : docMaterial.data().material_price,
                    material_type : docMaterial.data().material_type,
                    material_description : docMaterial.data().material_description
                }))
            )
        })
    }

    useEffect(()=>{
        const ff = async ()=>{
            console.log("ADDED")
            await onSnapshot(collection(db,"Material"), (qSnapshot)=>{
                setMaterialResult(
                    qSnapshot.docs.map((docMaterial)=>({
                        material_id : docMaterial.id,
                        material_title : docMaterial.data().material_title,
                        material_copies : docMaterial.data().material_copies,
                        material_category: docMaterial.data().material_category,
                        material_price: docMaterial.data().material_price,
                        material_description : docMaterial.data().material_description,
                        material_type : docMaterial.data().material_type
                    }))
                )
            })
        }
        ff()
    },[])


    let result = []
    useEffect(() => {
        const allMaterials = async () => {
            setTotalRes([])
            setSearchRes([])
            await materialResult.map((idd)=>{
                // console.log("COPIES",idd.material_copies, "\t",idd.material_id)
                
                onSnapshot(doc(db, "Book", idd.material_id), ((docH)=>{
                    // console.log("MATID",doc, "\t", idd.material_id)      
                    let oo = docH.data()
                    oo.material_id = idd.material_id
                    oo.material_title = idd.material_title
                    oo.material_copies = idd.material_copies
                    oo.material_description = idd.material_description
                    oo.material_category = idd.material_category
                    oo.material_price = idd.material_price
                    oo.material_type = idd.material_type
                    getDoc(doc(db, "Book", idd.material_id)).then((doc)=>{
                        oo.book_author = doc.data().book_author
                        oo.book_copyright = doc.data().book_copyright
                        oo.book_edition = doc.data().book_edition
                        oo.book_is_ebook = doc.data().book_is_ebook
                        oo.book_isbn = doc.data().book_isbn
                        oo.book_lccn = doc.data().book_lccn
                        oo.book_pages = doc.data().book_pages
                        oo.book_publication = doc.data().book_publication
                        oo.book_publication_date = doc.data().book_publication_date
                        
                    }).then(
                        setTotalRes(prev => (prev.concat(oo))) 
                        
                    ).then(
                        setSearchRes(prev => (prev.concat(oo))) 
                    )
                    
                    }))
            })
        }
        allMaterials()
    },[materialResult]) 

    // Edit Function
    const editInfoCategory = async (bId) => {
        await updateDoc(doc(db, "Material", bId),{
            material_category : material_category
        })
    }
    const editInfoCopies = async (bId) => {
        await updateDoc(doc(db, "Material", bId),{
            material_copies : material_copies
        })
    }
    const editInfoAuthor = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_author : book_author
        })
    }
    const editInfoDesc = async (bId) => {
        await updateDoc(doc(db, "Material", bId),{
            material_description : material_description
        })
    }
    const editInfoPrice = async (bId) => {
        await updateDoc(doc(db, "Material", bId),{
            material_price : material_price
        })
    }
    const editInfoTitle = async (bId) => {
        await updateDoc(doc(db, "Material", bId),{
            material_title : material_title
        })
    }
    const editInfoType = async (bId) => {
        await updateDoc(doc(db, "Material", bId),{
            material_type : material_type
        })
    }
    const editInfoIsE = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_is_ebook : book_is_ebook
        })
    }
    const editInfoPages = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_pages : book_pages
        })
    }
    const editInfoCopyright = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_copyright : book_copyright
        })
    }
    const editInfoLccn = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_lccn : book_lccn
        })
    }
    const editInfoIsbn = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_isbn: book_isbn
        })
    }
    const editInfoPubDate = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_publication_date : book_publication_date
        })
    }
    const editInfoPub = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_publication : book_publication
        })
    }
    const editInfoEdition = async (bId) => {
        await updateDoc(doc(db, "Book", bId),{
            book_edition : book_edition
        })
    }
    const editInfo = async (bId) => {
        await setDoc(doc(db, "Material", bId), {
            material_category:      material_category,
            material_copies:        material_copies,
            material_description:   material_description,
            material_price:         material_price,
            material_title:         material_title,
            material_type:          material_type
            }, {merge:true}).then(()=>{
                    setDoc(doc(db, "Book", bId), {
                            book_author:            book_author,
                            book_edition:           book_edition,
                            book_publication:       book_publication,
                            book_publication_date:  book_publication_date,
                            book_isbn:              book_isbn,
                            book_lccn:              book_lccn,
                            book_copyright:         book_copyright,
                            book_pages:             book_pages,
                            book_is_ebook:          book_is_ebook
                            }, {merge:true})
            })
    }

    const searchQ = () => {
        console.log(searchVal);
        studentRawQueryCategory = searchVal

        const tt = totalRes.filter((item)=>{
            const title = item.material_title.toLowerCase()
            const desc = item.material_description.toLowerCase()
            return  title.includes(searchVal.toLowerCase()) || 
                    desc.includes(searchVal.toLowerCase())
        })
        setSearchRes(tt)
    }

    useEffect(()=>{
        console.log("Searchres",searchRes)
    },[searchRes])

  return (
    <div className="BooksList">
        <input  placeholder="Search materials here"
                onChange={e => setSearchVal(e.target.value)}/>
        <button onClick={searchQ}>HERE</button>
        {console.log("Searchres",searchRes)}
        {searchRes.map((doc)=> {
            return (
                <div className="BookSection">
                    <p> Book ISBN:          <strong>{doc.book_isbn}</strong><br/>
                        Book Title:         <strong>{doc.material_title}</strong><br/>
                        Book Description:   <strong>{doc.material_description}</strong><br/>
                        Category:           <strong>{doc.material_category}</strong><br/>
                        Copies:             <strong>{doc.material_copies}</strong><br/>
                        Author              <strong>{doc.book_author}</strong><br/>
                        Copyright           <strong>{doc.book_copyright}</strong><br/>
                        Edition             <strong>{doc.book_edition}</strong><br/>
                        ISBN                <strong>{doc.book_isbn}</strong><br/>
                        LCCN                <strong>{doc.book_lccn}</strong><br/>
                        Pages               <strong>{doc.book_pages}</strong><br/>
                        Publication         <strong>{doc.book_publication}</strong><br/>
                        Publication Date    <strong>{doc.book_publication_date}</strong><br/>
                    </p>
                    <input  defaultValue={doc.material_category}
                            onChange={(event)=>{setMCategory(event.target.value)}}/>
                            <button onClick={()=>editInfoCategory(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  type="number"
                            defaultValue={doc.material_copies}
                            onChange={(event)=>{setMCopies(event.target.value)}}/>
                            <button onClick={()=>editInfoCopies(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  defaultValue={doc.book_author}
                            onChange={(event)=>{setMDesc(event.target.value)}}/>
                            <button onClick={()=>editInfoAuthor(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  type="number"
                            defaultValue={doc.material_price}
                            onChange={(event)=>{setMPrice(event.target.value)}}/>
                            <button onClick={()=>editInfoPrice(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  defaultValue={doc.material_title}
                            onChange={(event)=>{setMTitle(event.target.value)}}/>
                            <button onClick={()=>editInfoTitle(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  defaultValue={doc.material_type}
                            onChange={(event)=>{setMType(event.target.value)}}/>
                            <button onClick={()=>editInfoType(doc.material_id)}>EDIT</button>
                    <br/>



                    <br/>
                    <input  defaultValue={doc.book_isbn}
                            onChange={(event) => {setNewIsbn(event.target.value)}}/>
                            <button onClick={()=>editInfoIsbn(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  defaultValue={doc.book_lccn}
                            onChange={(event) => {setNewLccn(event.target.value)}}/>
                            <button onClick={()=>editInfoLccn(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  defaultValue={doc.book_publication}
                            onChange={(event)=>{setNewPublication(event.target.value)}}/>
                            <button onClick={()=>editInfoPub(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  defaultValue={doc.book_publication_date}
                            onChange={(event)=>{setNewPubDate(event.target.value)}}/>
                            <button onClick={()=>editInfoPubDate(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  
                            defaultValue={doc.book_is_ebook}
                            onChange={(event)=>{setNewIsEbook(event.target.value)}}/>
                            <button onClick={()=>editInfoIsE(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  type="number"
                            defaultValue={doc.book_pages}
                            onChange={(event)=>{setNewPages(event.target.value)}}/>
                            <button onClick={()=>editInfoPages(doc.material_id)}>EDIT</button>
                    <br/>
                    <input
                            defaultValue={doc.book_copyright}
                            onChange={(event)=>{setNewCopyright(event.target.value)}}/>
                            <button onClick={()=>editInfoCopyright(doc.material_id)}>EDIT</button>
                    <br/>
                    <input  defaultValue={doc.book_author}
                            onChange={(event)=>{setNewAuthor(event.target.value)}}/>
                            <button onClick={()=>editInfoAuthor(doc.material_id)}>EDIT</button>
                    <br/>
                    <input
                            defaultValue={doc.book_edition}
                            onChange={(event)=>{setNewEdition(event.target.value)}}/>
                            <button onClick={()=>editInfoEdition(doc.material_id)}>EDIT</button>
                    <br/>

                    <button onClick={()=>editInfo(doc.material_id)}>EDIT</button>
                </div>
            );
        })}
    </div>
  );
}

export default AdminEdit;