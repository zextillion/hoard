const fs = require('fs/promises');
const express = require('express');
const cors = require('cors');
const axios = require('axios')
const router = express.Router()

const clientId = process.env.clientId
const clientSecret = process.env.clientSecret
const twitchAccessToken = process.env.twitchAccessToken

module.exports = { 
    fs, 
    express, 
    cors, 
    axios, 
    router, 
    clientId, 
    clientSecret, 
    twitchAccessToken 
}