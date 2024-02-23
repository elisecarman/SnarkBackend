const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const snarkLogic = require('./snark-logic')
const app = express()

/**
 * Backend flow:
 * - check to see if the game ID encoded in the URL belongs to a valid game session in progress. 
 * - if yes, join the client to that game. 
 * - else, create a new game instance. 
 * - '/' path should lead to a new game instance. 
 * - '/game/:gameid' path should first search for a game instance, then join it. Otherwise, throw 404 error.  
 */


const server = http.createServer(app)
const io = socketio(server, {
    cookie: {
        name: "test",
        httpOnly: false,
        path: "/custom"
    },
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

// get the gameID encoded in the URL. 
// check to see if that gameID matches with all the games currently in session. 
// join the existing game session. 
// create a new session.  
// run when client connects

io.on('connection', client => {
    snarkLogic.initializeGame(io, client)
})

// usually this is where we try to connect to our DB.

// server.listen(process.env.PORT || 8000)
server.listen(process.env.PORT || 8000)

