import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBTdAusM8LZNSCO09lJm7srwLnhmAv3tvU",
    authDomain: "whatsapp-2-7f990.firebaseapp.com",
    projectId: "whatsapp-2-7f990",
    storageBucket: "whatsapp-2-7f990.appspot.com",
    messagingSenderId: "390221929550",
    appId: "1:390221929550:web:02228e21400fe41f33371f"
  };

const app = !firebase.apps.length 
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
