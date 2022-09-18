import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import "firebase/storage"

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
})

export const firestore = app.firestore()
export const database = {
  lessons: firestore.collection("lessons"),
  users: firestore.collection("users"),
  vocab: firestore.collection("vocab"),
  grammar: firestore.collection("grammar"),
  dialogue: firestore.collection("dialogue"),
  reading: firestore.collection("reading")
}

export const storage = app.storage();

export const auth = app.auth()
export default app