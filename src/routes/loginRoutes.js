const express = require('express');
const {generators} = require('openid-client');

const createLoginRoutes = (passport) => {
    const router = express.Router();
    router.get('/login', passport.authenticate('idporten', {
        state: generators.state()
    }));
    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('https://arbeidsplassen.dev.nav.no');
    })

    // account for variable redirect
    router.get('/oauth2/callback', passport.authenticate('idporten', {
        successRedirect: '/cv',
        failureRedirect: '/login'
    }))
    return router;
}

module.exports = createLoginRoutes;