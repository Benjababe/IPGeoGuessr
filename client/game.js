document.addEventListener('DOMContentLoaded', () => {
    var 
    socket = io(),
    playername = document.querySelector('input[name="name"]'),
    btnJoin = document.querySelector('#btnJoin'),
    btnStart = document.querySelector('#btnStart'),
    btnPass = document.querySelector('#btnGuess')

  // A new player has arrived
  btnJoin.addEventListener('click', () => {
    socket.emit('new player', playername.value)
  });
  
  // Pass the turn
  [btnStart, btnPass].forEach(button => {
    button.addEventListener('click', () => {
      socket.emit('pass turn')
    })
  });

  // Handle game updates if a new player has joined or a player has passed its turn
  socket.on('update game', players => {
    let me = socket.id
    console.log(players.flatMap(player => player.name))

    // Check if game has started
    let hasGameStarted = () => {
      return players.find(player => player.active == true)
    }
    
    // If game has already started
    if (hasGameStarted()) {
        let active = players.find(player => player.active == true)
        console.log(active.name + " is active")

        btnStart.classList.add("hidden")
        active.id == me ? btnPass.classList.remove("hidden") : btnPass.classList.add("hidden")
    } else {
        if (players[0].id == me) btnStart.classList.remove("hidden")
    }
  });
})