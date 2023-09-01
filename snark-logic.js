

/**
 * Here is where we should register event listeners and emitters. 
 */

var io
var gameSocket
// gamesInSession stores an array of all active socket connections
var gamesInSession = []

var trueGames = []


const initializeGame = (sio, socket) => {
    /**
     * initializeGame sets up all the socket event listeners. 
     */

    // initialize global variables.
    io = sio
    gameSocket = socket

    // pushes this socket to an array which stores all the active sockets.
    gamesInSession.push(gameSocket)

    // Run code when the client disconnects from their socket session. 
    gameSocket.on("disconnect", onDisconnect)

    // Sends new move to the other socket session in the same room. 
    gameSocket.on("new move", newMove)

    // User creates new game room after clicking 'submit' on the frontend
    gameSocket.on("createNewGame", createNewGame)

    // User joins gameRoom after going to a URL with '/game/:gameId' 
    gameSocket.on("playerJoinGame", playerJoinsGame)

    gameSocket.on('start', start)

    gameSocket.on('welcome new player', welcomeNewPlayer)

    gameSocket.on('logout', logout)

    gameSocket.on('shuffled', shuffled)

    gameSocket.on('top card change', topCardChange)

    gameSocket.on('snark win', snarkWin)

    gameSocket.on('score submission', scoreSubmission)
 
    gameSocket.on('score final', scoreFinal)

    gameSocket.on('wave flag', waveFlag)

    gameSocket.on('down flag', downFlag)

    gameSocket.on('lobby logout', lobbyLogout)

    gameSocket.on('exit', exit)

    gameSocket.on('repeat shuffled', repeatShuffled)
    
    gameSocket.on('hi', hi)
}

function hi(data){
    console.log('hi');
    io.sockets.in(data.gameId).emit('hi', data);
}

function repeatShuffled(data){
    io.sockets.in(data.gameId).emit('repeat shuffled', data);
}

function exit(data){
    var room = io.sockets.adapter.rooms.get(data.gameId);
    this.leave(room);

}

function lobbyLogout(data){
    io.sockets.in(data.gameId).emit('lobby logout', data);
}

function downFlag(data){
    io.sockets.in(data.gameId).emit('down flag', data)
}

function waveFlag(data){
    io.sockets.in(data.gameId).emit('wave flag', data)
}

function scoreFinal(data){
    io.sockets.in(data.gameId).emit('score final', data)
}

function scoreSubmission(data){
    io.sockets.in(data.gameId).emit('score compilation', data)
}

function snarkWin(data){
    io.sockets.in(data.gameId).emit('score request', data);
}

function topCardChange(data){
    io.sockets.in(data.gameId).emit('top card change', data);
}

function start(gameId) {
    io.sockets.in(gameId).emit('start', gameId);
}

function welcomeNewPlayer(data){
    io.sockets.in(data.gameId).emit("welcome", data)
}

function logout(data){
    io.sockets.in(data.gameId).emit('logout', data);
}

function shuffled(data){
    io.sockets.in(data.gameId).emit('opponent shuffled', data)
}

function playerJoinsGame(idData) {
 
    var sock = this
    var rooms  = io.sockets.adapter.rooms
    var room = rooms.get(idData.gameId)

    if (room === undefined) {
        this.emit('status', {
            gameId : idData.gameId,
            message : "This game session does not exist."});
        return
    }

    if (sock.rooms.has(idData.gameId) && (idData.isCreator === false)){
        console.log('nvm');
        return
    }

    console.log("------------");
    console.log(idData.userName);
    console.log(idData.gameId);
    console.log(sock.id);
    console.log(sock.rooms);
    console.log(":D");

    if (room.size < 7) {

        idData.mySocketId = sock.id;
        sock.join(idData.gameId);
        trueGames.push(idData.gameId);

        this.emit('new player', idData);
        // io.sockets.in(idData.gameId).emit('new player', idData);
        console.log("new players: " + idData.userName)

    } else {
        this.emit('status', 
        {gameId: idData.gameId,
        message: "There is already the maximum amount of players in this room."});
    }
}


function createNewGame(gameId) {
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('createNewGame', { gameId: gameId, mySocketId: this.id });

    // Join the Room and wait for the other player
    this.join(gameId)
}


function newMove(move) {
    io.to(move.gameId).emit('opponent move', move);
}

function onDisconnect() {
    var i = gamesInSession.indexOf(gameSocket);
    gamesInSession.splice(i, 1);

}


exports.initializeGame = initializeGame