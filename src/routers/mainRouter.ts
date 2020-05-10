import express from "express";
import {requireAuthenticated, requireNotAuthenticated} from "../passport-config";
import routers from "./routers";
import {IDbUser} from "../models/dbUser";
import * as path from "path";

const router = express.Router();

router.use("/account", routers.signup);
router.use("/api", routers.api);
router.use("/game/static", express.static(path.join(__dirname, "../game/static")));
router.use("/static", express.static(path.join(__dirname, "../frontend/static")));
router.use("/static", express.static("static"));

// General Endpoints
router.get("/game", requireAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + "/../game/index.html"));
});
router.get("", requireAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + "/../frontend/index.html"), {username: (req.user as IDbUser).username});
});

export default router;