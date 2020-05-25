import express from "express";
import {requireAuthenticated} from "../passport-config";
import * as statsController from "../controllers/statsController";
import * as dbUserController from "../controllers/dbUserController"

const router = express.Router();

// Basic User Settings
router.get("/user", dbUserController.whoAmI);
router.put("/lang", requireAuthenticated, dbUserController.changeLang);

// Guests
router.get("/players", requireAuthenticated, dbUserController.getAllPlayersAssociatedWithAccount);
router.get("/guests", requireAuthenticated, dbUserController.getGuests);
router.get("/guest/:id", requireAuthenticated, dbUserController.getGuest);
router.put("/guest/:id", requireAuthenticated, dbUserController.updateGuest);
router.post("/guests", requireAuthenticated, dbUserController.addGuest);
router.delete("/guest/:id", requireAuthenticated, dbUserController.deleteGuest);

// Games
router.get("/games", requireAuthenticated, statsController.listGames);
router.post("/games", requireAuthenticated, statsController.saveGame);

export default router;