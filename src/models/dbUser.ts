import mongoose, {Model} from "mongoose";
import Player, {IPlayer, IPlayerDoc, PlayerSchema} from "./player";
import {AccountStatsSchema, IAccountStats, IAccountStatsDoc} from "./stats";
import SavedGame, {ISavedGame, ISavedGameDoc, SavedGameSchema} from "./savedGame";
import bcrypt from "bcrypt";
import {SupportedLang} from "../enums";
import {GenericModelError, globalSchemaOptions, ModelParameterError, tryQuery} from "./utils";
import {GameSubmission} from "../controllers/statsController";

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
    id: string;
    username: string;
    email: string;
    password: string;
    lang?: SupportedLang;
    friends?: IDbUser[];
    player?: IPlayer;
    guests?: IPlayer[];
    accountStats?: IAccountStats;
    savedGames?: ISavedGame[];
    getMainPlayerInfo(): Promise<IPlayer>;
    findGuestByNick(nick: string): Promise<IPlayer | null>;
    changeLang(lang: SupportedLang): void;
    addGame(game: any): Promise<string | null>;
    getGuests(): Promise<IPlayer[]>;
    getGuest(guestId: string): Promise<IPlayer>;
    addGuest(nick: string): Promise<IPlayer>;
    updateGuest(guestParams: GuestUpdateParams): Promise<IPlayer>;
    deleteGuest(guestId: string): Promise<IPlayer>;
}

type GuestUpdateParams = {id: string, newNick: string};

export interface IDbUserDoc extends mongoose.Document {
    id: string;
    username: string;
    email: string;
    password: string;
    lang: SupportedLang;
    friends: IDbUserDoc[];
    player: IPlayerDoc;
    guests: IPlayerDoc[];
    accountStats: IAccountStatsDoc;
    savedGames: mongoose.Types.Array<ISavedGameDoc>;
    getMainPlayerInfo(): Promise<IPlayer>;
    findGuestByNick(nick: string): Promise<IPlayer | null>;
    changeLang(lang: SupportedLang): void;
    addGame(game: any): Promise<string | null>;
    getGuests(): Promise<IPlayer[]>;
    getGuest(guestId: string): Promise<IPlayer>;
    addGuest(nick: string): Promise<IPlayer>;
    updateGuest(guestParams: GuestUpdateParams): Promise<IPlayer>;
    deleteGuest(guestId: string): Promise<IPlayer>;
}

export interface IDbUserModel extends mongoose.Model<IDbUserDoc> {
    findByEmail(emailQuery: string): IDbUserDoc;
    addNewUser(user: IDbUser): IDbUserDoc;
    registerUser(username: string, email: string, password: string): IDbUserDoc;
    userWithEmailExists(email: string): Promise<boolean>;
    userWithUsernameExists(username: string): Promise<boolean>;
    getSerializedAuthUser(id: string): Promise<IDbUser>;
}

export const DbUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lang: { type: String, required: true },
    friends: {type: [mongoose.Schema.Types.ObjectId], default: []},
    player: {type: PlayerSchema, required: true, unique: true},
    guests: {type: [PlayerSchema], default: []},
    accountStats: {type: AccountStatsSchema, default: () => ({}) },
    savedGames: {type: [SavedGameSchema], default: []},
}, {...globalSchemaOptions});

DbUserSchema.statics.findByEmail = async function (emailQuery: string) {
    return tryQuery(() =>
        this.findOne({email: emailQuery})
    );
};

DbUserSchema.statics.addNewUser = async function (username: string, email: string, hashedPw: string) {
    const player = new Player( { nick: username });
    return tryQuery(() =>
        this.create({
            username: username,
            email: email,
            password: hashedPw,
            lang: SupportedLang.gb,
            player
        })
    );
};

DbUserSchema.statics.registerUser = async function (username: string, email: string, password: string) {
    const usernameTaken = await this.userWithUsernameExists(username);
    const emailTaken = await this.userWithEmailExists(email);
    if (usernameTaken || emailTaken) {
        throw new CredentialsTakenError(usernameTaken, emailTaken);
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        return tryQuery(() =>
            this.addNewUser(username, email, hashedPassword)
        );
    }
};

DbUserSchema.statics.userWithEmailExists = async function (email: string): Promise<boolean> {
    return tryQuery(() => this.exists({email}));
};

DbUserSchema.statics.userWithUsernameExists = async function (username: string): Promise<boolean> {
    return tryQuery(() => this.exists({username}));
};

DbUserSchema.statics.getSerializedAuthUser = async function (id: string): Promise<IDbUser> {
    return tryQuery(() => {
        return DbUser.findById(id, {id: 1, username: 1, password: 1, lang: 1, email: 1});
    });
};

DbUserSchema.methods.getGuests = async function (this: IDbUser): Promise<IPlayer[]> {
    const user: IDbUserDoc = await tryQuery(async () => {
        return DbUser.findById(this.id, {"guests.nick": 1, "guests._id": 1}).exec();
    });
    return user.guests;
};

DbUserSchema.methods.getGuest = async function (this: IDbUser, guestId: string): Promise<IPlayer> {
    return tryQuery(async () => {
        const user = await DbUser.findById(this.id, {guests: {$elemMatch: {_id: guestId}}});
        if (user!.guests.length > 0) {
            return user!.guests[0];
        }
        else {
            throw new ModelParameterError("Guest with ID " + guestId + " doesn't exist!");
        }
    });
};

DbUserSchema.methods.findGuestByNick = async function (this: IDbUser, guestNick: string): Promise<IPlayer | null> {
    return tryQuery(async () => {
        const user = await DbUser.findById(this.id, {guests: {$elemMatch: {nick: guestNick}}});
        if (user!.guests.length > 0) {
            return user!.guests[0];
        }
        else {
            return null;
        }
    });
};

DbUserSchema.methods.addGuest = async function (this: IDbUser, newGuestNick: string): Promise<IPlayer> {
    if (this.username !== newGuestNick) {
        const guestLookup = await this.findGuestByNick(newGuestNick);
        if (!guestLookup) {
            return saveGuest(this, newGuestNick);
        }
        else {
            throw new ModelParameterError(`Cannot add a guest with the same name of another guest in this account.`);
        }
    }
    else {
        throw new ModelParameterError("Cannot add a guest with the same name as the account holder's username.")
    }
};

async function saveGuest(user: IDbUser, newGuestNick: string): Promise<IPlayer> {
    const newGuest: IPlayerDoc = new Player();
    newGuest.nick = newGuestNick;
    await tryQuery(() => {
        DbUser.findByIdAndUpdate(user.id, {$push: {guests: newGuest}}).exec();
    });
    return newGuest;
}

DbUserSchema.methods.updateGuest = async function (this: IDbUser, guestParams: GuestUpdateParams): Promise<IPlayer> {
    return tryQuery(async () => {
        const user = await DbUser.findById(this.id);
        const updatableGuest = user!.guests.find(guest => guest.id === guestParams.id);
        if (updatableGuest) {
            updatableGuest.nick = guestParams.newNick;
            await user!.save();
            return updatableGuest;
        }
        else {
            throw new ModelParameterError("Guest with ID " + guestParams.id + " doesn't exist!");
        }
    });
};

DbUserSchema.methods.deleteGuest = async function (this: IDbUser, guestId: string): Promise<IPlayer> {
    return tryQuery(async () => {
        const user = await DbUser.findById(this.id);
        const deleteGuestIndex = user!.guests.findIndex(guest => guest.id === guestId);
        if (deleteGuestIndex !== -1) {
            const deletedGuest = user!.guests[deleteGuestIndex];
            user!.guests[deleteGuestIndex].remove();
            await user!.save();
            return deletedGuest;
        }
        else {
            throw new ModelParameterError("Guest with ID " + guestId + " doesn't exist!");
        }
    });
};

DbUserSchema.methods.addGame = async function (submission: GameSubmission): Promise<ISavedGame> {
    const newGame = await SavedGame.createFromGameSubmission(submission);
    await tryQuery(() => {
        DbUser.findByIdAndUpdate(this.id, {$push: {savedGames: newGame}}).exec();
    });
    return newGame;
};

DbUserSchema.methods.changeLang = async function (lang: SupportedLang): Promise<void> {
    if (lang in SupportedLang) {
        await tryQuery(() =>
            DbUser.findByIdAndUpdate(this.id, {lang: lang})
        );
    }
    else {
        throw new ModelParameterError(lang + " is not a supported language code!");
    }
};

DbUserSchema.methods.getMainPlayerInfo = async function (): Promise<IPlayer> {
    const user = await tryQuery(() =>
        DbUser.findById(this.id, {"player.nick": 1, "player._id": 1}).exec()
    );
    return user.player;
};

const DbUser = mongoose.model<IDbUserDoc, IDbUserModel>("DbUser", DbUserSchema);
export default DbUser;