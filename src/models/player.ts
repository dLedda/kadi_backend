import mongoose from "mongoose";
import {IPlayerStats, IPlayerStatsDoc, PlayerStatsSchema} from "./stats";
import {globalSchemaOptions} from "./utils";

export interface IPlayer {
    id: string;
    nick: string;
    stats: IPlayerStats;
}

export interface IPlayerDoc extends mongoose.Document {
    id: string;
    nick: string;
    stats: IPlayerStatsDoc;
}

export interface IPlayerModel extends mongoose.Model<IPlayerDoc> {
    // virtual static methods
}

export const PlayerSchema = new mongoose.Schema({
    nick: { type: String, required: true },
    stats: { type: PlayerStatsSchema, required: true, default: () => ({}) },
}, {...globalSchemaOptions});

const Player = mongoose.model<IPlayerDoc, IPlayerModel>("Player", PlayerSchema);
export default Player;