import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

function getConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApps()[0];
  const c = getConfig();
  const missing = (Object.keys(c) as (keyof typeof c)[]).filter((k) => !c[k]);
  if (missing.length) {
    throw new Error(
      `Missing NEXT_PUBLIC Firebase env: ${missing.join(", ")}`,
    );
  }
  return initializeApp(c);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}
