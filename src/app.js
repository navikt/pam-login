const express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
const idPortenStrategy = require("./settings/idPortenStrategy");
const healthCheckRoutes = require('./routes/healthCheckRoutes');
const loginRoutes = require('./routes/loginRoutes');
const {ensureLoggedIn} = require("connect-ensure-login");

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;

const app = express();

app.use(healthCheckRoutes);

app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 86400,
        sameSite: "lax"
    },
    secret: '535510n-53cr3t'
}));


const initializePassport = async () => {
    app.use(passport.initialize());
    app.use(passport.session());
    const strategy = await idPortenStrategy();
    passport.use('idporten', strategy);
    passport.serializeUser(function (user, done) {
        done(null, user)
    })

    passport.deserializeUser(function (user, done) {
        done(null, user)
    })
};

initializePassport()
    .catch(console.error);

app.use(loginRoutes(passport));

app.use('/', ensureLoggedIn({redirectTo: '/stillinger'}), (_, res) => res.send('OK'));

app.listen(PORT, () =>
    console.log(`Started serving on port ${PORT}`)
);
