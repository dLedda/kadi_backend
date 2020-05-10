import passport from "passport";
import DbUser, {IDbUser, IDbUserDoc} from "../models/dbUser";
import {RequestHandler} from "express";
import SavedGame from "../models/savedGame";

export const whoAmI: RequestHandler = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user as IDbUserDoc;
        res.json({loggedIn: true, username: user.username});
    }
    else {
        res.json({loggedIn: false});
    }
};