import express from "express";
import {requireAuthenticated} from "../passport-config";
import routers from "./routers";
import {IDbUser} from "../models/dbUser";

const router = express.Router();

router.use("/account", routers.signup);
router.use("/api", routers.api);

router.get("/game", requireAuthenticated, (req, res) => {
    res.render("gameIndex.ejs", {
        username: (req.user as IDbUser).username,
        rootUrl: req.app.locals.rootUrl
    });
});

router.get("/**", requireAuthenticated, (req, res) => {
    res.render("frontendIndex.ejs", {
        username: (req.user as IDbUser).username,
        rootUrl: req.app.locals.rootUrl
    });
});

export default router;