import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc, updateDoc, collection, onSnapshot} from "firebase/firestore";

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

// Create / Set user profile

export const createUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), data);
};

// Get user profile

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) return null;

  return snap.data();
};

// Update user

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), data);
};

// Delete user

export const deleteUserProfile = async (uid) => {
  await deleteDoc(doc(db, "users", uid));
};


//real-time listener

import { doc, onSnapshot } from "firebase/firestore";

export const listenUsers = (callback) => {
  return onSnapshot(collection(db, "users"), (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(users);
  });
};

export async function loadUsers() {
  const snap = await getDocs(collection(db, "users"));

  const users = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log(users);
}