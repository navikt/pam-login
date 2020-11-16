const express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
const idPortenStrategy = require("./settings/idPortenStrategy");
const healthCheckRoutes = require('./routes/healthCheckRoutes');
const loginRoutes = require('./routes/loginRoutes');

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

    app.use(loginRoutes(passport));
};

initializePassport()
    .catch(console.error);

app.listen(PORT, () =>
    console.log(`Started serving on port ${PORT}`)
);
