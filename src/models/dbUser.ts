import mongoose from "mongoose";
import Player, {IPlayer, IPlayerDoc, PlayerSchema} from "./player";
import {AccountStats, AccountStatsSchema, IAccountStats, IAccountStatsDoc} from "./stats";
import {ISavedGame, ISavedGameDoc, SavedGameSchema} from "./savedGame";
import bcrypt from "bcrypt";

export class CredentialsTakenError extends Error {
    public emailExists: boolean;
    public usernameExists: boolean;
    constructor(usernameExists: boolean, emailExists: boolean) {
        super("Registration failure:" + usernameExists + emailExists);
        this.usernameExists = usernameExists;
        this.emailExists = emailExists;
        this.name = "CredentialsTakenError";
    }
}

export interface IDbUser {
    username: string;
    email: string;
    password: string;
    friends?: IDbUser[];
    player?: IPlayer;
    guests?: IPlayer[];
    accountStats?: IAccountStats;
    savedGames?: ISavedGame[];
}

export interface IDbUserDoc extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    friends: IDbUserDoc[];
    player: IPlayerDoc;
    guests: IPlayerDoc[];
    accountStats: IAccountStatsDoc;
    savedGames: ISavedGameDoc[];
}

export interface IDbUserModel extends mongoose.Model<IDbUserDoc> {
    findByEmail(emailQuery: string): IDbUserDoc;
    addNewUser(user: IDbUser): IDbUserDoc;
    registerUser(username: string, email: string, password: string): IDbUserDoc;
    userWithEmailExists(email: string): boolean;
    userWithUsernameExists(username: string): boolean;
}

export const DbUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: {type: [mongoose.Schema.Types.ObjectId], required: true, default: []},
    player: {type: PlayerSchema, required: true, unique: true},
    guests: {type: [PlayerSchema], required: true, default: []},
    accountStats: {type: AccountStatsSchema, required: true, default: () => ({}) },
    savedGames: {type: [SavedGameSchema], required: true, default: []},
});

DbUserSchema.statics.findByEmail = async function (emailQuery: string) {
    return this.findOne({email: emailQuery});
};

DbUserSchema.statics.addNewUser = async function (user: IDbUser) {
    const player = new Player( { nick: user.username });
    return this.create({
            username: user.username,
            email: user.email,
            password: user.password,
            player
        });
};

DbUserSchema.statics.registerUser = async function (username: string, email: string, password: string) {
    const usernameTaken = await this.userWithUsernameExists(username);
    const emailTaken = await this.userWithEmailExists(email);
    if (usernameTaken || emailTaken) {
        throw new CredentialsTakenError(usernameTaken, emailTaken);
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.addNewUser({username, email, password: hashedPassword});
    }
};

DbUserSchema.statics.userWithEmailExists = async function (email: string) {
    return this.exists({email});
};

DbUserSchema.statics.userWithUsernameExists = async function (username: string) {
    return this.exists({username});
};

const DbUser = mongoose.model<IDbUserDoc, IDbUserModel>("DbUser", DbUserSchema);
export default DbUser;