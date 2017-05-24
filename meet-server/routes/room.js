var db = require('../database/db')

function roomAdd (req, res){
    var body = req.body
    var room

    room = {
        name: body.name,
        chiefName : body.chiefName,
        subject : body.subject,
        belongIds : body.belongIds
    }

    db.room.add(room, function (err, result) {
        if (err) {
            res.send(err)
            return
        }

        res.send(result)
    })

}

// GET /room/list/:userId
function roomList (req, res){
    db.room.list(req.params.userId, function (err, rooms) {
        if(err){
            res.send(err)
            return
        }

        res.send(rooms)
    })
}

module.exports = {
    add: roomAdd,
    list: roomList
}