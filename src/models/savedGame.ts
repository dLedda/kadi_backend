import mongoose from "mongoose";
import {IPlayer} from "./player";

export interface ISavedGame {
    //players: IPlayer[],
    game: any,
}

export interface ISavedGameDoc extends mongoose.Document {
    //players: mongoose.Types.ObjectId[],
    game: mongoose.Types.Subdocument,
}

export interface ISavedGameModel extends mongoose.Model<ISavedGameDoc> {
    // virtual static methods
}

export const SavedGameSchema = new mongoose.Schema({
    //players: [mongoose.Schema.Types.ObjectId],
    game: mongoose.Schema.Types.Mixed,
}, {timestamps: true});

const SavedGame = mongoose.model<ISavedGameDoc, ISavedGameModel>("SavedGame", SavedGameSchema);
export default SavedGame;