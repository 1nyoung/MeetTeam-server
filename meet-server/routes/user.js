var crypto = require('crypto')
var async = require('async')
var db = require('../lib/db')
var logger = require('../lib/logger')


// POST /user/add
function userAdd(req, res) {
    logger.debug("userAdd 호출")
    var body = req.body
    var user

    user = {
        id: body.id,
        password: body.password,
        name: body.name,
        idNum: body.idNum,
        phoneNum: body.phoneNum,
        addr: body.addr,
        email: body.email,
        isProfessor: body.isProfessor,
    }

    db.user.add(user, function (err, result) {
        if(err){
            logger.error("userAdd DB error : " + err)
            res.send(err)
            return
        }

        res.send(result)
    })
}


// POST /user/login
function userLogin(req, res) {
    logger.debug('userLogin 호출')
    var body = req.body
    var sess

    sess = crypto.randomBytes(10).toString('hex')
    db.user.update(body.id, sess, function (err, result) {
        if(err){
            logger.error("userUpdate DB error : " + err)
            res.send(err)
            return
        }

        db.user.getById(body.id, function (err, user) {
            if(err){
                logger.error(err)
                res.send(err)
                return
            }
            if (!user) {
                res.status(400).send('Sorry cant find that!')
                return
            }

            if(body.password != user.password){
                res.status(400).send('login fail')
                return
            }

            res.send({sess: user.sess})
        })
    })
}


// POST /user/list
function userList(req, res) {
    logger.debug('userList 호출')
    var body = req.body
    var userList = []
    var funcs = []

    db.room.getByTitle(body.roomName, function (err, room) {
        if(err){
            logger.error("roomGetByTitle DB error : " + err)
            res.send(err)
        }

        if(room.belongIds.length > 0){
            funcs = room.belongIds.map(function (obj) {
                return function (callback) {
                    db.user.getById(obj, 'USER', function (err, user) {
                        if(err){
                            callback(err)
                            return
                        }

                        userList.push(user)
                        callback(null)
                    })
                }
            })
            async.parallel(funcs, function (err) {
                if(err){
                    res.err(err)
                    return
                }

                res.send(userList)
            })
        }else{
            res.send(null)
        }
    })
}


module.exports = {
    add: userAdd,
    login: userLogin,
    list: userList
}