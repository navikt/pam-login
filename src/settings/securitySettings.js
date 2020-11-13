const passport = require('passport');
const {Issuer, Strategy} = require('openid-client');

const idportenWellKnownUrl = process.env.IDPORTEN_WELL_KNOWN_URL || '';
const idportenClientId = process.env.IDPORTEN_CLIENT_ID || '';
const idportenClientJwk = process.env.IDPORTEN_CLIENT_JWK || '{}';
const idportenRedirectUri = process.env.IDPORTEN_REDIRECT_URI || '';
const logoutRedirectUri = process.env.LOGOUT_URL || 'http://localhost:8080/stillinger';
const privateKeyJwt = 'private_key_jtw';

const createClient = (issuer) => new issuer.Client({
    client_id: idportenClientId,
    token_endpoint_auth_method: privateKeyJwt,
    token_endpoint_auth_signing_alg: 'RS256',
    redirect_uris: [idportenRedirectUri],
    post_logout_redirect_uris: [logoutRedirectUri],
    response_types: ['code'],
}, {
    keys: [JSON.parse(idportenClientJwk)]
});

const idPortenStrategy = async () => {
    const issuer = await Issuer.discover(idportenWellKnownUrl);;
    const client = createClient(issuer);
    return new Strategy({
        client,
        sessionKey: '',
        usePKCE: true,
        params: {
            scope: 'openid profile'
        },
        extras: {
            clientAssertionPayload: {
                aud: issuer.metadata.issuer
            }
        }
    }, (tokenSet, done) => {
        done(console.error, {id_token: tokenSet.id_token})
    });
}


const setUpSecurity = async (server) => {
    server.use(passport.initialize());
    server.use(passport.session());
    passport.use('idporten', await idPortenStrategy());
}

module.exports = setUpSecurity;