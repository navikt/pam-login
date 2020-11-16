const express = require('express');
const expressSession = require('express-session');
const setUpSecurity = require('./settings/securitySettings');
const healthCheckRoutes = require('./routes/healthCheckRoutes');
const loginRoutes = require('./routes/loginRoutes');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;

const server = express();

server.use(healthCheckRoutes);

server.use(expressSession({
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

const passport = setUpSecurity(server);
server.use(loginRoutes(passport));


server.listen(PORT, () =>
    console.log(`Started serving on port ${PORT}`)
);
