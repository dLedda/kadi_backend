import passport from "passport";
import {Strategy as LocalStrategy, VerifyFunction} from "passport-local";
import bcrypt from "bcrypt";
import DbUser, {IDbUserDoc} from "./models/dbUser";
import {NextFunction, Request, Response} from "express";

export const requireAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect(req.baseUrl + "/account/login");
    }
};

export const requireNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        res.redirect(req.app.locals.rootUrl + "/");
    }
    else {
        return next();
    }
};

const authenticateUser: VerifyFunction = async (email, password, done) => {
    const user = await DbUser.findByEmail(email);
    if (!user) {
        return done(null, false, { message: "A user with that email does not exist."} );
    }
    try {
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, {message: "Password incorrect"});
        }
    }
    catch (e) {
        return done(e);
    }
};

export const initialisePassport = () => {
    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
    passport.serializeUser((user: IDbUserDoc, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id: string, done) => {
        const user: IDbUserDoc | null = await DbUser.findById(id, {username: 1, password: 1, lang: 1, email: 1});
        done(null, user);
    });
};