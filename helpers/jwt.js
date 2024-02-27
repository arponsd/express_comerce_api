const expressJwt = require('express-jwt');

function authJwt() {
    const api = process.env.API_URL;
    const secret = process.env.secret;
    return expressJwt({
        secret,
        algorithms:['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET'] },
            `${api}/user/login`,
            `${api}/user/register`
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true);
    }
    done();
}

module.exports = authJwt;