import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDafHuE8M9Cf_i53Ak-rE5fQD5Fh56hDIg",
  authDomain: "planning-with-ai-f8ef1.firebaseapp.com",
  projectId: "planning-with-ai-f8ef1",
  storageBucket: "planning-with-ai-f8ef1.firebasestorage.app",
  messagingSenderId: "14937905925",
  appId: "1:14937905925:web:0db406ddb948866cc3356c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


// create user(staff)
import { db } from "./firebase.js";
import { doc, setDoc } from "firebase/firestore";

export async function createUserProfile(user) {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "user", // admin / ambulance / etc.
    createdAt: Date.now()
  });
}

// read user data
import { db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

//real-time listener
import { db } from "./firebase.js";
import { doc, onSnapshot } from "firebase/firestore";

export function listenUser(uid, callback) {
  return onSnapshot(doc(db, "users", uid), (doc) => {
    callback(doc.data());
  });
}

// create token
import admin from "firebase-admin";

const user = await verifyStaffCredentials(staffId, password, pin);

const token = await admin.auth().createCustomToken(user.uid);
return token;

//sign in with custom token
import { signInWithCustomToken } from "firebase/auth";

await signInWithCustomToken(auth, token);

// pin