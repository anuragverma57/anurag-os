/** HttpOnly session cookie set after Firebase ID token exchange (server-verified). */
export const SESSION_COOKIE_NAME = "admin_session";

/** Session cookie max age (seconds). Must align with createSessionCookie expiresIn. */
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 5; // 5 days
