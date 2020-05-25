import DbUser, {IDbUser, IDbUserDoc} from "../models/dbUser";
import {RequestHandler} from "express";
import {IPlayer} from "../models/player";

export const whoAmI: RequestHandler = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user as IDbUser;
        res.json({loggedIn: true, username: user.username, lang: user.lang});
    }
    else {
        res.json({loggedIn: false});
    }
};

export const changeLang: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    await user.changeLang(req.body.lang);
    res.send({
        username: user.username,
        updatedLang: req.body.lang,
        userId: user.id,
    });
};

export const addGuest: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    if (req.body.guestName) {
        const newGuest: IPlayer = await user.addGuest(req.body.guestName);
        res.send({
            username: user.username,
            userId: user.id,
            newGuest: {
                id: newGuest.id,
                name: newGuest.nick,
            }
        });
    }
    else {
        res.status(400).send({message: "This request requires the parameter 'guestName'"});
    }
};

export const updateGuest: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    const {id: guestId} = req.params;
    if (req.body.newName) {
        const {newName} = req.body;
        const updatedGuest = await user.updateGuest({id: guestId, newNick: newName});
        res.status(200).send({
            userId: user.id,
            username: user.username,
            updatedGuest: {
                id: updatedGuest.id,
                nick: updatedGuest.nick,
            },
        });
    }
    else {
        res.status(400).send({message: "This request requires the parameter 'newName'"});
    }
};

export const getGuest: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    const {id: guestId} = req.params;
    const guest = await user.getGuest(guestId);
    res.status(200).send({
        userId: user.id,
        username: user.username,
        guest: guest,
    });
};

export const deleteGuest: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    const {id: guestId} = req.params;
    const deletedGuest = await user.deleteGuest(guestId);
    res.status(200).send({
        userId: user.id,
        username: user.username,
        deletedGuest: deletedGuest,
    });
};

export const getGuests: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    const guests = await user.getGuests();
    res.status(200).send({
        userId: user.id,
        username: user.username,
        guests: guests,
    });
};

export const getAllPlayersAssociatedWithAccount: RequestHandler = async (req, res) => {
    const user = (req.user as IDbUser);
    const guests = await user.getGuests();
    const mainPlayer = await user.getMainPlayerInfo();
    res.status(200).send({guests, mainPlayer});
};