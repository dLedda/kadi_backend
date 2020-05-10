import express from "express";
import {requireAuthenticated, requireNotAuthenticated} from "../passport-config";
import * as signup from "../controllers/signupController";

const router = express.Router();

router.get("/login", requireNotAuthenticated, signup.showLoginPage);

router.post("/login", requireNotAuthenticated, signup.loginUser);

router.get("/register", requireNotAuthenticated, signup.showRegistrationPage);

router.post("/register", requireNotAuthenticated, signup.registerNewUser);

router.get("/logout", requireAuthenticated, signup.logoutUser);

export default router;