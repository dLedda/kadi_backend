import passport from "passport";
import DbUser, {IDbUser, IDbUserDoc} from "../models/dbUser";
import {RequestHandler} from "express";
import SavedGame from "../models/savedGame";
import Player, {IPlayer} from "../models/player";

export interface GameSubmission {
    players: {id: string, nick: string}[],
    results: GameResults[];
}

interface GameResults {
    playerId: string;
    blocks: any;
}

export const listGames: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    const dbUser = await DbUser.findById(user.id, {"savedGames._id": 1, "savedGames.results": 1, "savedGames.createdAt": 1});
    if (dbUser) {
        res.json({games: dbUser.savedGames});
    }
    else {
        res.sendStatus(404);
    }
};

export const saveGame: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    const submission = (req.body as GameSubmission);
    for (let player of submission.players) {
        if (player.id === player.nick) {
            const newGuest = await user.addGuest(player.nick);
            player.id = newGuest.id;
            const playerResult = submission.results.find(result => result.playerId === player.nick);
            playerResult!.playerId = player.id;
        }
    }
    const newGame = await user.addGame(submission);
    res.send({message: "Game submitted successfully!", newGame: newGame});
};

const processStatistics = (results: GameResults, account: IDbUser) => {
};