const express = require('express');
const {generators} = require('openid-client');

const logOutUrl = process.env.LOGOUT_URL || 'http://localhost:8080/';

const createLoginRoutes = (passport) => {
    const router = express.Router();
    router.get('/login', passport.authenticate('idporten', {
        state: generators.state()
    }));
    router.get('/logout', (req, res) => res.redirect(logOutUrl))

    // account for variable redirect
    router.get('/oauth2/callback', passport.authenticate('idporten', {
        successRedirect: '/',
        failureRedirect: '/login'
    }))
    return router;
}

module.exports = createLoginRoutes;