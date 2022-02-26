let Player = require("./player.js"),
    players = []
            
module.exports = {
    // Each player join by connecting to server
    handle: (socket) => {
        // Only start game when got 2 player 
        let hasGameStarted = () => {
            return players.find(player => player.active == true)
        }	

        // When a new player comes in, push into player list
        // Player identified by its name and socket id
		socket.on('new player', (name) => {
            if (!hasGameStarted()) {
                players.push(Player.newPlayer(socket.id, name))
                // Annouce to the other player that another player has joined
                socket.server.emit('update game', players)
            } else {
                console.log("Someone attempted to join a but the game has already started.")
            }
        })

        // If none player is active, turn is pass to first player of list
        socket.on('pass turn', () => {
            // Get the index of current active player and findIndex is -1 is no player is active
            let current = players.findIndex(player => player.active == true)
            
            // Make next player active
            let next = (current + 1) % players.length

            players[current].distance = 1231

            if (current != -1) {
                players[current].active = false
            }
            players[next].active = true

            socket.server.emit('update game', players)
        })       
    }
}