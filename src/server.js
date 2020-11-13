const express = require('express');
const setUpSecurity = require('./settings/securitySettings');
const healthCheckRoutes = require('./routes/healthCheckRoutes');
const loginRoutes = require('./routes/loginRoutes');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;

const server = express();

setUpSecurity(server);

server.use(healthCheckRoutes);
server.use(loginRoutes);

server.listen(PORT, () =>
    console.log(`Started serving on port ${PORT}`)
);
