import express from "express";
import {initialisePassport, requireAuthenticated, requireNotAuthenticated} from "./passport-config";
import mongoose from "mongoose";
import Settings from "./server-config.json";
import flash from "express-flash";
import passport from "passport";
import session from "express-session";
import MainRouter from "./routers/mainRouter";

// MongoDB Setup
mongoose.connect(Settings.mongodb_uri, (err: any) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Successfully connected to mongoDB!");
    }
});

// Express app config
const app = express();
app.use(express.json());
app.set("port", process.env.PORT || 3000);
app.set("view-engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: false}));
app.use(flash());
app.use(session({
    // TODO hide the secret
    secret: "secret",
    saveUninitialized: false,
    resave: false
}));
app.locals = {
    rootUrl: Settings.serverRoot
};

// Passport init
initialisePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(Settings.serverRoot + "/static", express.static("static"));
app.use(Settings.serverRoot, MainRouter);

const server = app.listen(app.get("port"), () => {
    console.log("App is running on http://localhost:%d", app.get("port"));
});