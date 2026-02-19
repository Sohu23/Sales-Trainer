export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

// TODO: Replace with real auth (e.g. Clerk) once enabled.
// For now we just read a cookie. This keeps the app structure compatible
// with a real auth provider later.
export function isAuthedFromCookie(cookieHeader?: string | null): boolean {
  if (!cookieHeader) return false;
  // Very lightweight cookie check: st_logged_in=1
  return /(?:^|;\s*)st_logged_in=1(?:;|$)/.test(cookieHeader);
}
