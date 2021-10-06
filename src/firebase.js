import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'


const firebaseConfig = {

    apiKey: "AIzaSyBVF7u5h3CBy7_MWF9OqSQiV9Qdw2FfHVE",
  
    authDomain: "react-proyectos-5f6be.firebaseapp.com",
  
    projectId: "react-proyectos-5f6be",
  
    storageBucket: "react-proyectos-5f6be.appspot.com",
  
    messagingSenderId: "476302574613",
  
    appId: "1:476302574613:web:743d3a1a02eb36e7aefa1c"
  
  };
  
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()

export {db, auth}