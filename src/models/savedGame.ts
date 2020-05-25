import mongoose, {Types} from "mongoose";
import Player, {IPlayer} from "./player";
import {GameSubmission} from "../controllers/statsController";
import {tryQuery, globalSchemaOptions} from "./utils";
import DbUser from "./dbUser";

export interface ISavedGame {
    id: string;
    //rulesetUsed?: ruleset;
    players: mongoose.Types.ObjectId[];
    results: any[];
}

export interface ISavedGameDoc extends mongoose.Document {
    //rulesetUsed: mongoose.Types.ObjectId[];
    id: string;
    players: mongoose.Types.Array<mongoose.Types.ObjectId>;
    results: mongoose.Types.Array<mongoose.Types.Subdocument>;
}

export interface ISavedGameModel extends mongoose.Model<ISavedGameDoc> {
    // virtual static methods
    createFromGameSubmission(submission: GameSubmission): Promise<ISavedGameDoc>;
}

export const SavedGameSchema = new mongoose.Schema({
    //rulesetUsed: [mongoose.Schema.Types.ObjectId],
    players: [mongoose.Schema.Types.ObjectId],
    results: [mongoose.Schema.Types.Mixed],
}, {
    timestamps: true,
    ...globalSchemaOptions
});

SavedGameSchema.statics.createFromGameSubmission = async function(submission: GameSubmission) {
    const newGame = new SavedGame();
    newGame.results.addToSet(...submission.results);
    await tryQuery(async () => {
        newGame.players.addToSet(...submission.players.map(player => player.id));
    });
    return newGame;
};

const SavedGame = mongoose.model<ISavedGameDoc, ISavedGameModel>("SavedGame", SavedGameSchema);
export default SavedGame;