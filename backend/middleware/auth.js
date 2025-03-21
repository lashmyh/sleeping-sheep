import passport from "passport";


//only authenticated users can access protected routes
export const authenticateJWT = passport.authenticate("jwt", { session: false });
