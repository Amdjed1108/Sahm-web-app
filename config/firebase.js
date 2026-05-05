import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFirestore, doc, setDoc, getDoc, updateDoc,
  deleteDoc, getDocs, collection, onSnapshot, query,
  where, orderBy, limit, writeBatch, serverTimestamp} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDafHuE8M9Cf_i53Ak-rE5fQD5Fh56hDIg",
  authDomain: "planning-with-ai-f8ef1.firebaseapp.com",
  projectId: "planning-with-ai-f8ef1",
  storageBucket: "planning-with-ai-f8ef1.firebasestorage.app",
  messagingSenderId: "14937905925",
  appId: "1:14937905925:web:0db406ddb948866cc3356c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs,
  collection, onSnapshot, query, where, orderBy,
  limit, writeBatch, serverTimestamp };

// Create / Set user profile

export const createUserProfile = (uid, data) => setDoc(doc(db,"users",uid), data);

// Get user profile

export const getUserProfile    = async (uid) => {
  const snap = await getDoc(doc(db,"users",uid));
  return snap.exists() ? snap.data() : null;
};

// Update user

export const updateUserProfile = (uid, data) => updateDoc(doc(db,"users",uid), data);

// Delete user

export const deleteUserProfile = (uid)        => deleteDoc(doc(db,"users",uid));

//real-time listener

export const listenUsers = (callback) =>
  onSnapshot(collection(db,"users"), snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );

export const loadUsers = async () => {
  const snap = await getDocs(collection(db,"users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};





