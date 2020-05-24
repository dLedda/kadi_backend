import {IDbUserDoc} from "../models/dbUser";
import {RequestHandler} from "express";

export const whoAmI: RequestHandler = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user as IDbUserDoc;
        res.json({loggedIn: true, username: user.username, lang: user.lang});
    }
    else {
        res.json({loggedIn: false});
    }
};

export const changeLang: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUserDoc);
    user.changeLang(req.body.lang);
};