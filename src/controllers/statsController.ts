import passport from "passport";
import DbUser, {IDbUser, IDbUserDoc} from "../models/dbUser";
import {RequestHandler} from "express";
import SavedGame from "../models/savedGame";

export const listGames: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUserDoc);
    const dbUser = await DbUser.findById(user._id, {"savedGames.game": 1, "savedGames.createdAt": 1});
    if (dbUser) {
        console.log(dbUser.savedGames);
        res.json({games: dbUser.savedGames});
    }
    else {
        res.sendStatus(404);
    }
};

export const saveGame: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUserDoc);
    await user.addGame(req.body);
};