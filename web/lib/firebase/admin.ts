import { readFileSync } from "fs";
import { join } from "path";
import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;

function loadServiceAccountFromPath(): ServiceAccount | null {
  const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!p) return null;
  const resolved = p.startsWith("/")
    ? p
    : join(/* turbopackIgnore: true */ process.cwd(), p);
  const raw = readFileSync(resolved, "utf8");
  return JSON.parse(raw) as ServiceAccount;
}

/**
 * Firebase Admin (server-only). Used for session cookies and token verification.
 */
export function getAdminApp(): App {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0]!;
    return app;
  }

  const fromFile = loadServiceAccountFromPath();
  if (fromFile) {
    app = initializeApp({ credential: cert(fromFile) });
    return app;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin: set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY",
    );
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return app;
}

let db: Firestore | null = null;

export function getAdminDb(): Firestore {
  if (!db) {
    db = getFirestore(getAdminApp());
  }
  return db;
}
