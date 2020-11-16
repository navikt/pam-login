const {Issuer, Strategy} = require('openid-client');

const idportenWellKnownUrl = process.env.IDPORTEN_WELL_KNOWN_URL || 'https://some-wellknown-url';
const idportenClientId = process.env.IDPORTEN_CLIENT_ID || 'some-client-id';
const idportenClientJwk = process.env.IDPORTEN_CLIENT_JWK || '{}';
const idportenRedirectUri = process.env.IDPORTEN_REDIRECT_URI || 'id-porten-redirect';
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
    const issuer = await Issuer.discover(idportenWellKnownUrl);
    const client = createClient(issuer);
    return new Strategy({
        client,
        sessionKey: '535510n-53cr3t',
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


module.exports = idPortenStrategy;