const express = require("express");

const createHealthCheckRoutes = () => {
    const router = express.Router()
    router.use(['/internal/isAlive', '/internal/isReady'], (req, res) => res.sendStatus(200));
    return router
};

module.exports = createHealthCheckRoutes();
