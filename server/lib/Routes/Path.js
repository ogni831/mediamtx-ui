import express from "express";

export default class PathRoutes {
    constructor(routes) {
        this.routes = routes;
        this.server = this.routes.server;

        this.router = express.Router();
        this.router.use(express.json({limit: "10mb"}));

        // Routes
        this.router.get('/path', (req, res) => {
            return res.status(200).json({message: "PATH DEFAULTS"});
        });

        // update server settings
        this.router.patch('/path', (req, res) => {
            return res.status(200).json({message: "PATH DEFAULTS PATCH"});
        });
    }
}