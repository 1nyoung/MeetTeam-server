var db = require('../database/db')
var logger = require('../lib/logger')

// POST /room/add
function roomAdd (req, res){
    logger.debug("roomAdd 호출")
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
            logger.error("roomAdd DB error : " + err);
            res.send(err)
            return
        }

        res.send(result)
    })

}

// GET /room/list/:userId
function roomList (req, res){
    logger.debug("roomList 호출")

    // 로그인하고나서 세션값만줘서 이렇게 로직 타도록 수정해야함
    // 아직까진 세션이랑 id같이줘서 아래 로직으로..
    // db.user.getBySess(req.params.sess, function (err, user) {
    //     db.room.list(user.id, function (err, rooms) {
    //         if(err){
    //             logger.error("roomList DB error : " + err)
    //             res.send(err)
    //             return
    //         }
    //
    //         res.send(rooms)
    //     })
    //
    // })

    db.room.list(req.params.userId, function (err, rooms) {
        if(err){
            logger.error("roomList DB error : " + err)
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