var db = require('../database/db')
var util = require('util')

function roomAdd (req, res){
    console.log(util.inspect(req.body))
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

function roomAdd2 (req, res){
    console.log('hhhhhhhh')
    console.log(util.inspect(req))
    var body = req.body
    var room
    res.send(req.body)

    // room = {
    //     name: body.name,
    //     chiefName : body.chiefName,
    //     subject : body.subject,
    //     belongIds : body.belongIds
    // }
    //
    // db.room.add(room, function (err, result) {
    //     if (err) {
    //         res.send(err)
    //         return
    //     }
    //
    //     res.send(result)
    // })

}

module.exports = {
    add: roomAdd,
    add2: roomAdd2
}