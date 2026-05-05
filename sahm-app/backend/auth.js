// Paste this in auth.js — this is your session gate
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (!user) return window.location.href = "auth.html";
  // get their role from Firestore users/{uid}
  const doc = await getDoc(doc(db, "users", user.uid));
  const role = doc.data().role;
  localStorage.setItem("role", role);
  localStorage.setItem("hospitalId", doc.data().hospitalId);
  // redirect by role
  const routes = { admin: "admin.html", er_doctor: "er.html", ... };
  window.location.href = routes[role];
});

