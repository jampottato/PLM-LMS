import {useState, useEffect} from "react";
import {db} from "../firebase";
import {setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, updateDoc} from "firebase/firestore";

function AdminConfirm() {
    let activeStudentNum = "202011847";
    let patronType = "Student";
    //Get: name, email, title, due, patronType
    //get the issue data,  -> [p-email,  ,...]
    //material_title FROM material collection
    //

  return (
    <div className="BooksList">
    </div>
  );
}

export default AdminConfirm;