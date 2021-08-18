import '../styles/globals.css'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from './login';
import Loading from '../components/Loading';
import firebase from "firebase";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  //receives the logged user - the loading state
  const [user, loading] = useAuthState(auth);

  //trigger this piece of code whenever the component mounts
  useEffect(() => {
    if(user) {
      db.collection('users').doc(user.uid).set(
      {
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL,
      }, 
      {merge: true}  //in order for the 'set' to only update the data in the database or create new object if needed
      );
    }
  }, [user]);

  //if there is any loading at the moment
  if(loading) return <Loading />;

  // go to Login page if there's no user
  if(!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp
