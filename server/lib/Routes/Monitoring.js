import express from "express";

export default class MonitoringRoutes {
    constructor(routes) {
        this.routes = routes;
        this.server = this.routes.server;

        this.router = express.Router();
        this.router.use(express.json({limit: "10mb"}));

        // Routes
        this.router.get('/monitoring', (req, res) => {
            return res.status(200).json({message: "MONITORING"});
        });

        // update server settings
        this.router.patch('/monitoring', (req, res) => {
            return res.status(200).json({message: "MONITORING PATCH"});
        });
    }
}