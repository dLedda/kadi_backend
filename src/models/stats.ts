import mongoose from "mongoose";

// Interfaces and types for business logic
export interface IPlayerStats extends IBaseStats {
    wins: number;
    runnerUps: number;
    draws: number;
    losses: number;
}
export interface IAccountStats extends IBaseStats {
    timesNoWinner: number;
}
export interface IBaseStats {
    one: IMultiplierFieldStats;
    two: IMultiplierFieldStats;
    three: IMultiplierFieldStats;
    four: IMultiplierFieldStats;
    five: IMultiplierFieldStats;
    six: IMultiplierFieldStats;
    upperBonus: IBonusFieldStats;
    upperTotal: ITotalFieldStats;
    threeKind: INumberFieldStats;
    fourKind: INumberFieldStats;
    fullHouse: IBoolFieldStats;
    smlStraight: IBoolFieldStats;
    lgStraight: IBoolFieldStats;
    yahtzee: IYahtzeeFieldStats;
    chance: INumberFieldStats;
    grandTotal: ITotalFieldStats;
    lowerTotal: ITotalFieldStats;
    gamesPlayed: number;
}
interface IBonusFieldStats {
    total: number;
}
interface ITotalFieldStats {
    average: number;
    best: number;
    worst: number;
}
interface IBoolFieldStats {
    average: number;
    timesStruck: number;
    total: number;
}
interface INumberFieldStats {
    average: number;
    timesStruck: number;
    best: number;
    worst: number;
}
type IMultiplierFieldStats = INumberFieldStats;
type IYahtzeeFieldStats = INumberFieldStats;

// Mongoose doc interfaces and types
export interface IPlayerStats extends IBaseStats {
    one: IMultiplierFieldStatsDoc;
    two: IMultiplierFieldStatsDoc;
    three: IMultiplierFieldStatsDoc;
    four: IMultiplierFieldStatsDoc;
    five: IMultiplierFieldStatsDoc;
    six: IMultiplierFieldStatsDoc;
    upperBonus: IBonusFieldStatsDoc;
    upperTotal: ITotalFieldStatsDoc;
    threeKind: INumberFieldStatsDoc;
    fourKind: INumberFieldStatsDoc;
    fullHouse: IBoolFieldStatsDoc;
    smlStraight: IBoolFieldStatsDoc;
    lgStraight: IBoolFieldStatsDoc;
    yahtzee: IYahtzeeFieldStatsDoc;
    chance: INumberFieldStatsDoc;
    grandTotal: ITotalFieldStatsDoc;
    lowerTotal: ITotalFieldStatsDoc;
    gamesPlayed: number;
    wins: number;
    runnerUps: number;
    draws: number;
    losses: number;
}
export interface IAccountStats extends IBaseStats {
    one: IMultiplierFieldStatsDoc;
    two: IMultiplierFieldStatsDoc;
    three: IMultiplierFieldStatsDoc;
    four: IMultiplierFieldStatsDoc;
    five: IMultiplierFieldStatsDoc;
    six: IMultiplierFieldStatsDoc;
    upperBonus: IBonusFieldStatsDoc;
    upperTotal: ITotalFieldStatsDoc;
    threeKind: INumberFieldStatsDoc;
    fourKind: INumberFieldStatsDoc;
    fullHouse: IBoolFieldStatsDoc;
    smlStraight: IBoolFieldStatsDoc;
    lgStraight: IBoolFieldStatsDoc;
    yahtzee: IYahtzeeFieldStatsDoc;
    chance: INumberFieldStatsDoc;
    grandTotal: ITotalFieldStatsDoc;
    lowerTotal: ITotalFieldStatsDoc;
    gamesPlayed: number;
    timesNoWinner: number;
}
type IBonusFieldStatsDoc = mongoose.Document & IBonusFieldStats;
type ITotalFieldStatsDoc = mongoose.Document & ITotalFieldStats;
type IBoolFieldStatsDoc = mongoose.Document & IBoolFieldStats;
type INumberFieldStatsDoc = mongoose.Document & INumberFieldStats;
type IMultiplierFieldStatsDoc = mongoose.Document & IMultiplierFieldStats;
type IYahtzeeFieldStatsDoc = mongoose.Document & IYahtzeeFieldStats;
export type IPlayerStatsDoc = mongoose.Document & IPlayerStats;
export type IAccountStatsDoc = mongoose.Document & IAccountStats;

// Mongoose schemata
class Int extends mongoose.SchemaType {
    constructor(key: string, options: any) {
        super(key, options, 'Int');
    }
    cast(val: any): number {
        let _val = Number(val);
        if (isNaN(_val)) {
            throw new Error('ZeroPositiveInt: ' + val + ' is not a number');
        }
        _val = Math.round(_val);
        return _val;
    }
}
(mongoose.Schema.Types as any).Int = Int;

const BonusFieldStatsSchema = new mongoose.Schema( {
    average: {type: Number, required: true, default: 0, min: 0},
    total: {type: Int, required: true, default: 0, min: 0}
}, { _id: false });
const TotalFieldStatsSchema = new mongoose.Schema( {
    average: {type: Number, required: true, default: 0, min: 0},
    best: {type: Int, required: true, default: 0, min: 0},
    worst: {type: Int, required: true, default: 0, min: 0},
}, { _id: false });
const BoolFieldStatsSchema = new mongoose.Schema( {
    average: {type: Number, required: true, default: 0, min: 0, max: 1},
    timesStruck: {type: Int, required: true, default: 0, min: 0},
    total: {type: Int, required: true, default: 0, min: 0},
}, { _id: false });
const NumberFieldStatsSchema = new mongoose.Schema( {
    average: {type: Number, required: true, default: 0, min: 0},
    timesStruck: {type: Int, required: true, default: 0, min: 0},
    best: {type: Int, required: true, default: 0, min: 0},
    worst: {type: Int, required: true, default: 0, min: 0},
}, { _id: false });
const MultiplierFieldStatsSchema = new mongoose.Schema( {
    average: {type: Number, required: true, default: 0, min: 0},
    timesStruck: {type: Int, required: true, default: 0, min: 0},
    best: {type: Int, required: true, default: 0, min: 0},
    worst: {type: Int, required: true, default: 0, min: 0},
}, { _id: false });
const YahtzeeFieldStatsSchema = new mongoose.Schema( {
    average: {type: Number, required: true, default: 0, min: 0},
    timesStruck: {type: Int, required: true, default: 0, min: 0},
    best: {type: Int, required: true, default: 0, min: 0},
    worst: {type: Int, required: true, default: 0, min: 0},
}, { _id: false });
export const PlayerStatsSchema = new mongoose.Schema( {
    one: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    two: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    three: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    four: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    five: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    six: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    upperBonus: { type: BonusFieldStatsSchema, required: true, default: () => ({}) },
    upperTotal: { type: TotalFieldStatsSchema, required: true, default: () => ({}) },
    threeKind: { type: NumberFieldStatsSchema, required: true, default: () => ({}) },
    fourKind: { type: NumberFieldStatsSchema, required: true, default: () => ({}) },
    fullHouse: { type: BoolFieldStatsSchema, required: true, default: () => ({}) },
    smlStraight: { type: BoolFieldStatsSchema, required: true, default: () => ({}) },
    lgStraight: { type: BoolFieldStatsSchema, required: true, default: () => ({}) },
    yahtzee: { type: YahtzeeFieldStatsSchema, required: true, default: () => ({}) },
    chance: { type: NumberFieldStatsSchema, required: true, default: () => ({}) },
    grandTotal: { type: TotalFieldStatsSchema, required: true, default: () => ({}) },
    lowerTotal: { type: TotalFieldStatsSchema, required: true, default: () => ({}) },
    gamesPlayed: { type: Int, required: true, default: 0, min: 0 },
    wins: { type: Int, required: true, default: 0, min: 0 },
    runnerUps: { type: Int, required: true, default: 0, min: 0 },
    draws: { type: Int, required: true, default: 0, min: 0 },
    losses: { type: Int, required: true, default: 0, min: 0 },
}, { _id: false });
export const AccountStatsSchema = new mongoose.Schema( {
    one: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    two: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    three: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    four: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    five: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    six: { type: MultiplierFieldStatsSchema, required: true, default: () => ({}) },
    upperBonus: { type: BonusFieldStatsSchema, required: true, default: () => ({}) },
    upperTotal: { type: TotalFieldStatsSchema, required: true, default: () => ({}) },
    threeKind: { type: NumberFieldStatsSchema, required: true, default: () => ({}) },
    fourKind: { type: NumberFieldStatsSchema, required: true, default: () => ({}) },
    fullHouse: { type: BoolFieldStatsSchema, required: true, default: () => ({}) },
    smlStraight: { type: BoolFieldStatsSchema, required: true, default: () => ({}) },
    lgStraight: { type: BoolFieldStatsSchema, required: true, default: () => ({}) },
    yahtzee: { type: YahtzeeFieldStatsSchema, required: true, default: () => ({}) },
    chance: { type: NumberFieldStatsSchema, required: true, default: () => ({}) },
    grandTotal: { type: TotalFieldStatsSchema, required: true, default: () => ({}) },
    lowerTotal: { type: TotalFieldStatsSchema, required: true, default: () => ({}) },
    gamesPlayed: { type: Int, required: true, default: 0, min: 0 },
    timesNoWinner: { type: Int, required: true, default: 0, min: 0 },
}, { _id: false });

export const PlayerStats = mongoose.model<IPlayerStatsDoc>("PlayerStats", PlayerStatsSchema);
export const AccountStats = mongoose.model<IAccountStatsDoc>("AccountStats", AccountStatsSchema);
