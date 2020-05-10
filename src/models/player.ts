import mongoose from "mongoose";
import {IPlayerStats, IPlayerStatsDoc, PlayerStatsSchema} from "./stats";

export interface IPlayer {
    nick: string;
    stats: IPlayerStats;
}

export interface IPlayerDoc extends mongoose.Document {
    nick: string;
    stats: IPlayerStats;
}

export interface IPlayerModel extends mongoose.Model<IPlayerDoc> {
    // virtual static methods
}

export const PlayerSchema = new mongoose.Schema({
    nick: { type: String, required: true },
    stats: { type: PlayerStatsSchema, required: true, default: () => ({}) },
});

const Player = mongoose.model<IPlayerDoc, IPlayerModel>("Player", PlayerSchema);
export default Player;