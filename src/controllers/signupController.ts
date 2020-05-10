import passport from "passport";
import DbUser from "../models/dbUser";
import {RequestHandler} from "express";

export const showLoginPage: RequestHandler = (req, res) => {
    res.render("login.ejs");
};

export const loginUser: RequestHandler = (req, res) => {
    passport.authenticate('local', {
        successRedirect: req.app.locals.rootUrl + "/",
        failureRedirect: req.baseUrl + "/login",
        failureFlash: true,
    })(req, res);
};

export const showRegistrationPage: RequestHandler = (req, res) => {
    res.render("register.ejs");
};

export const registerNewUser: RequestHandler = async (req, res) => {
    try {
        const newUser = await DbUser.registerUser(req.body.username, req.body.email, req.body.password);
        req.login(newUser, (err) => {
            if (err) {
                throw err;
            }
            else {
                res.redirect(req.baseUrl + "/");
            }
        });
    }
    catch (error) {
        const errors: string[] = [];
        if (error.name === "CredentialsTakenError") {
            error.usernameExists && errors.push("That username is already taken");
            error.emailExists && errors.push("That email address is already taken");
        }
        else {
            errors.push("An error occurred during the registration.");
        }
        req.flash("errors", errors);
        res.render("register.ejs");
    }
};

export const logoutUser: RequestHandler = (req, res) => {
    req.logout();
    res.redirect(req.baseUrl + "/login");
};