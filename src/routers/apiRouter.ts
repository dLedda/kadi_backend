import express from "express";
import {requireAuthenticated} from "../passport-config";
import * as stats from "../controllers/statsController";
import * as dbUser from "../controllers/dbUserController"

const router = express.Router();

router.get("/user", dbUser.whoAmI);
router.post("/changeLang", requireAuthenticated, dbUser.changeLang);
router.get("/games", requireAuthenticated, stats.listGames);
router.post("/savegame", requireAuthenticated, stats.saveGame);

export default router;