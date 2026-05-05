import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/* ── Role → page map ── */
const ROLE_REDIRECT = {
  secretary:    "secretary.html",
  doctor:       "doctor.html",
  specialist:   "specialist.html",
  paramedic:    "ambulance.html",
  er_doctor:    "er.html",
  blood_service:"blood.html",
  admin:        "admin.html"
};

/* ── Auth guard — paste at top of EVERY page (except auth.html) ── */
export function requireAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = "/auth.html"; return; }
    // profile already in localStorage — skip Firestore read
    if (!localStorage.getItem("role")) {
      const snap = await getDoc(doc(db,"users", user.uid));
      if (snap.exists()) cacheProfile(user.uid, snap.data());
    }
  });
}

function cacheProfile(uid, data) {
  localStorage.setItem("uid",        uid);
  localStorage.setItem("role",       data.role);
  localStorage.setItem("name",       data.name);
  localStorage.setItem("hospitalId", data.hospitalId);
  localStorage.setItem("officeId",   data.officeId   ?? "");
  localStorage.setItem("specialtyId",data.specialtyId ?? "");
  localStorage.setItem("vehicleId",  data.vehicleId  ?? "");
}

/* ── Sign in ── */
export async function signIn(staffId, password) {
  // Staff ID → email convention: staffId@sahm.internal
  const email = `${staffId.toLowerCase()}@sahm.internal`;
  const cred  = await signInWithEmailAndPassword(auth, email, password);
  const snap  = await getDoc(doc(db,"users", cred.user.uid));
  if (!snap.exists()) throw new Error("Profile not found. Contact admin.");
  const data = snap.data();
  cacheProfile(cred.user.uid, data);
  return ROLE_REDIRECT[data.role] ?? "index.html";
}

/* ── Sign out ── */
export async function logout() {
  localStorage.clear();
  await signOut(auth);
  window.location.href = "/auth.html";
}