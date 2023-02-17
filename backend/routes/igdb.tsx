const { router, clientId, twitchAccessToken, axios } = require('../utility.tsx')

const headers = {
    'Accept': 'application/json',
    'Client-ID': clientId,
    'Authorization': `Bearer ${twitchAccessToken}`,
}

function accessIgdbEndpoint(req, res, url, data) {
    axios({
        url: url,
        method: 'POST',
        headers: headers,
        data: data
    })
    .then(response => {
        console.log("Response from IGDB")
        res.set('Access-Control-Allow-Origin', req.headers.origin)
        res.send(response.data)
    })
    .catch(err => {
        console.log("Error from IGDB")
        console.log(err)
        res.send(err)
    });
}

router
.route('/games')
.post((req, res) => {
    accessIgdbEndpoint(req, res, "https://api.igdb.com/v4/games", `fields ${req.body};`)
})

router
.route('/covers')
.post((req, res) => {
    accessIgdbEndpoint(req, res, "https://api.igdb.com/v4/covers", `fields url; where id = (${req.body.toString()});`)
})

router
.route('/releaseDates')
.post((req, res) => {
    accessIgdbEndpoint(req, res, "https://api.igdb.com/v4/release_dates", `fields date,platform,region; where id = (${req.body.toString()});`)
})


module.exports = router