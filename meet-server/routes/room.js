var db = require('../database/db')
var logger = require('../lib/logger')


// POST /room/list
function roomList (req, res){
    logger.debug("roomList 호출")

    // 로그인하고나서 세션값만줘서 이렇게 로직 타도록 수정해야함
    // 아직까진 세션이랑 id같이줘서 아래 로직으로..
    db.user.getBySess(req.body.sess, function (err, user) {
        db.room.list(user.id, function (err, rooms) {
            if(err){
                logger.error("userGetBySess DB error : " + err)
                res.send(err)
                return
            }

            res.send(rooms)
        })

    })

    // db.room.list(req.params.userId, function (err, rooms) {
    //     if(err){
    //         logger.error("roomList DB error : " + err)
    //         res.send(err)
    //         return
    //     }
    //
    //     res.send(rooms)
    // })
}


// POST /room/add
function roomAdd (req, res){
    logger.debug("roomAdd 호출")
    var body = req.body
    var room

    db.user.getBySess(req.body.sess, function (err, user) {
        if (err) {
            logger.error("userGetBySess DB error : " + err);
            res.send(err)
            return
        }

        room = {
            name: body.name,
            chiefName : user.name,
            subject: body.subject,
            belongIds: [user.id]
        }
        db.room.add(room, function (err, result) {
            if (err) {
                logger.error("roomAdd DB error : " + err);
                res.send(err)
                return
            }

            res.send(result)
        })
    })
}


// POST /room/addUser
function roomAddUser (req, res){
    logger.debug("roomAddUser 호출")
    var body = req.body


    db.user.getBySess(req.body.sess, function (err, user) {
        if (err) {
            logger.error("userGetBySess DB error : " + err);
            res.send(err)
            return
        }

        if (!user) {
            logger.error("not found USER ");
        }

        db.room.getByName(body.roomName, function (err, room) {
            if(err){
                logger.error("roomGetByName DB error : " + err);
                res.send(err)
            }

            room.belongIds.push(user.id)
            db.room.update(room.name, room.belongIds, function (err, result) {
                if(err){
                    logger.error("roomUpdate DB error : " + err);
                    res.send(err)
                }

                res.send(result)
            })
         })
    })
}



module.exports = {
    list: roomList,
    add: roomAdd,
    addUser: roomAddUser
}