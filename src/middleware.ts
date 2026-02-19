import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/demo(.*)",
  "/login(.*)",
  "/register(.*)",
  "/impressum(.*)",
  "/datenschutz(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    // In this Clerk version, auth().protect() is not available.
    // We protect routes by checking userId.
    return auth().then((a) => {
      if (!a.userId) {
        // Middleware will handle redirect to sign-in based on Clerk config.
        // Throwing is not necessary here; returning a redirect keeps it explicit.
        const url = new URL("/login", req.url);
        return Response.redirect(url);
      }
      return undefined;
    });
  }
  return undefined;
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
