var db = require('../database/db')

// POST /room/add
function roomAdd (req, res){
    console.log("roomAdd 호출")
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
            console.log("roomAdd DB error : " + err)
            res.send(err)
            return
        }

        res.send(result)
    })

}

// GET /room/list/:userId
function roomList (req, res){
    console.log("roomList 호출")
    db.room.list(req.params.userId, function (err, rooms) {
        if(err){
            console.log("roomList DB error : " + err)
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