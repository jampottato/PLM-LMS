import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import {setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, updateDoc} from "firebase/firestore";

function BooksList() {
    let activeStudentNum = "202011847";
    let patronType = "Student";

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
                    material_title : docMaterial.data().material_title,
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
                        material_title : docMaterial.data().material_title,
                        material_description : docMaterial.data().material_description
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
                
                onSnapshot(doc(db, "Book", idd.material_id), ((doc)=>{
                    // console.log("MATID",doc, "\t", idd.material_id)      
                    let oo = doc.data()
                    oo.material_id = idd.material_id
                    oo.material_title = idd.material_title
                    oo.material_copies = idd.material_copies
                    oo.material_description = idd.material_description
                    setTotalRes(prev => (prev.concat(oo))) 
                    setSearchRes(prev => (prev.concat(oo))) 
                    }))
            })
        }
        allMaterials()
    },[materialResult]) 

    // Borrow Function
    const getInfo = async (bId, title) => {
        alert(bId)
        let copies = 0
        let dateToday = new Date()
        let dateTomorrow = new Date()
        dateTomorrow.setDate(dateToday.getDate()+1)

        await getDoc(doc(db, "Material", bId)).then((doc)=> {
            copies = parseInt(parseInt(doc.data().material_copies) - 1)
            console.log("COPIES", copies)
        })

        //check
        await addDoc(collection(db, "Issue"), {
            patron_id : activeStudentNum,
            material_id : bId,
            material_title: title,
            issue_confirmed : false,
            issue_checkout_date : dateToday, //today
            issue_due : dateTomorrow, // tomorrow
            issue_fine : 0 // 0
        })
        
        if(copies > -1){
            await updateDoc(doc(db, "Material", bId), {
                material_copies: copies
            })
        } else {
            alert("There are 0 copies, you could not borrow this")
        }
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

        {searchRes.map((doc)=> {
            return (
                <div className="BookSection">
                    <p> Book ISBN:          <strong>{doc.book_isbn}</strong><br/>
                        Book Title:         <strong>{doc.material_title}</strong><br/>
                        Book Description:   <strong>{doc.material_description}</strong><br/>
                        Copies:             <strong>{doc.material_copies}</strong><br/>
                    </p>
                    <button onClick={()=>getInfo(doc.material_id, doc.material_title)}>BORROW</button>
                </div>
            );
        })}
    </div>
  );
}

export default BooksList;