import passport from "passport";
import DbUser, {IDbUser, IDbUserDoc} from "../models/dbUser";
import {RequestHandler} from "express";
import SavedGame from "../models/savedGame";

export const listGames: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUserDoc);
    const dbUser = await DbUser.findById(user._id, {"savedGames.game": 1, "savedGames.createdAt": 1});
    if (dbUser) {
        res.json({games: dbUser.savedGames});
    }
    else {
        res.sendStatus(404);
    }
};

export const saveGame: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUserDoc);
    const handleError = (err: string) => {
        res.send({error: true, message: err});
    };
    DbUser.findById(user, (err, user) => {
        if (err) {
            handleError(err);
        }
        else if (user) {
            const newGame = new SavedGame();
            newGame.game = req.body;
            user.savedGames.push(newGame);
            user.save((err) => {
                if (err) {
                    return handleError(err);
                }
                else {
                    res.send("Thanks for submitting your game, " + user.username + "!");
                }
            })
        }
    });
};