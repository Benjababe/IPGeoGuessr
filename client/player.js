module.exports = {
    newPlayer: (id, name) => {
        return {
            id: id,
            name: name ? name : id,
            score: 0,
            active: false, 
            distance: 0
            
        }
    }
}