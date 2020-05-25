import express from "express";
import {requireAuthenticated} from "../passport-config";
import routers from "./routers";
import {IDbUser} from "../models/dbUser";
import {ModelParameterError} from "../models/utils";

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

const genericErrorHandler: express.ErrorRequestHandler =
    (err, req, res, next) => {
        if (err instanceof ModelParameterError) {
            res.status(500).send({message: "An internal error occurred in the database."});
        }
        else {
            res.status(500).send({message: "An unknown error occurred."});
        }
    };

router.use(genericErrorHandler);

export default router;