const { router, clientId, twitchAccessToken, axios } = require('../utility.tsx')

const headers = {
    'Accept': 'application/json',
    'Client-ID': clientId,
    'Authorization': `Bearer ${twitchAccessToken}`,
}

function accessIgdbEndpoint(res, url, data) {
    axios({
        url: url,
        method: 'POST',
        headers: headers,
        data: data
    })
    .then(response => {
        res.send(response.data)
    })
    .catch(err => {
        res.status(err.response.status).send(new Error(err))
    });
}

router
    .route('/games')
    .post((req, res) => {
        accessIgdbEndpoint(res, "https://api.igdb.com/v4/games", `fields ${req.body};`)
    })

router
    .route('/covers')
    .post((req, res) => {
        accessIgdbEndpoint(res, "https://api.igdb.com/v4/covers", `fields url; where id = (${req.body.toString()});`)
    })

router
    .route('/releaseDates')
    .post((req, res) => {
        accessIgdbEndpoint(res, "https://api.igdb.com/v4/release_dates", `fields date,platform,region; where id = (${req.body.toString()});`)
    })


module.exports = router