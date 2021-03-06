var db = require('../lib/db')
var logger = require('../lib/logger')


// POST /room/add
function roomAdd (req, res){
    logger.debug("roomAdd 호출")

    var body = req.body
    var room

    db.user.getBySess(req.body.sess, function (err, user) {
        if (err) {
            logger.error("userGetBySess DB error : " + err)
            res.send(err)
            return
        }

        room = {
            title: body.title,
            chiefName : user.name,
            subject: body.subject,
            belongIds: [user.id]
        }

        db.room.add(room, function (err, result) {
            if (err) {
                logger.error("roomAdd DB error : " + err)
                res.send(err)
                return
            }

            res.send(result)
        })
    })
}


// POST /room/addChat
function roomAddChat (req, res){
    logger.debug("roomAddChat 호출")
    var body = req.body
    var chatting

    db.user.getBySess(req.body.sess, function (err, user) {
        if (err) {
            logger.error("userGetBySess DB error : " + err)
            res.send(err)
            return
        }

        if (!user) {
            logger.error("not found USER")
            res.status(400).send("not found USER")
            return
        }

        db.room.getByTitle(body.title, function (err, room) {
            if(err){
                logger.error("roomGetByTitle DB error : " + err)
                res.send(err)
                return
            }

            if(room.length === 0) {
                logger.error("not found ROOM")
                res.status(400).send("not found ROOM")
                return
            }

            chatting ={
                userName: user.name,
                message: body.message
            }

            db.room.updateChat(room.title, chatting, function (err, result) {
                if(err){
                    logger.error("roomUpdateChat DB error : " + err)
                    res.send(err)
                }

                res.send(result)
            })
        })
    })
}


// POST /room/addUser
function roomAddUser (req, res){
    logger.debug("roomAddUser 호출")
    var body = req.body

    db.user.getBySess(req.body.sess, function (err, user) {
        if (err) {
            logger.error("userGetBySess DB error : " + err)
            res.send(err)
            return
        }

        if (!user) {
            logger.error("not found USER")
            res.status(400).send("not found USER")
            return
        }

        db.room.getByTitle(body.title, function (err, room) {
            if(err){
                logger.error("roomGetByTitle DB error : " + err)
                res.send(err)
                return
            }

            if(room.length === 0) {
                logger.error("not found ROOM")
                res.status(400).send("not found ROOM")
                return
            }

            for(i = 0; i < room.belongIds.length; i++){
                if(room.belongIds[i] === user.id ){
                    res.send("ok")
                    return
                }
            }

            room.belongIds.push(user.id)
            db.room.update(room.title, room.belongIds, function (err, result) {
                if(err){
                    logger.error("roomUpdate DB error : " + err)
                    res.send(err)
                }

                res.send(result)
            })
         })
    })
}


// POST /room/list
function roomList (req, res){
    logger.debug("roomList 호출")

    db.user.getBySess(req.body.sess, function (err, user) {
        if (err) {
            logger.error("userGetBySess DB error : " + err)
            res.send(err)
            return
        }

        if (!user) {
            logger.error("not found USER")
            res.status(400).send("not found USER")
            return
        }

        db.room.list(user.id, function (err, rooms) {
            if(err){
                logger.error("userGetBySess DB error : " + err)
                res.send(err)
                return
            }

            res.send(rooms)
        })
    })
}


// POST /room/show
function roomShow(req, res) {
    logger.debug('roomShow 호출')
    var body = req.body

    db.room.getByTitle(body.title, function (err, room) {
        if(err){
            logger.error("roomGetByTitle DB error : " + err)
            res.send(err)
        }

        res.send(room)
    })
}


module.exports = {
    add: roomAdd,
    addUser: roomAddUser,
    addChat: roomAddChat,
    list: roomList,
    show: roomShow
}