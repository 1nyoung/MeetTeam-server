var crypto = require('crypto')

var async = require('async')

var db = require('../lib/db')
var logger = require('../lib/logger')


// POST /todo/add
function todoAdd (req, res){
    logger.debug("todoAdd 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id, aclist

    function makeTodo(todo) {
        db.todo.add(todo, function (err, result) {
            if(err) {
                logger.error("todoAdd DB error : " + err)
                res.send(err)
                return
            }

            res.send(result)
        })
    }

    md5sum.update(body.roomTitle + body.todoName);
    id = md5sum.digest('hex');

    db.user.getBySess(body.sess, function (err, user) {
        if (err) {
            logger.error("userGetBySess DB error : " + err)
            res.send(err)
            return
        }

        if (!user) {
            logger.error("not found USER ")
            res.status(400).send("not found USER ")
            return
        }

        db.todo.getById(id, function (err, todo) {
            console.log(user)

            if(err) {
                logger.error("ttableGetById DB error : " + err)
                res.send(err)
                return
            }

            aclist = {
                isCheck: body.isCheck || false,
                list: body.list,
                name: body.name
            }

            if(!todo){
                makeTodo({
                    id: id,
                    roomTitle: body.roomTitle,
                    todoName: body.todoName,
                    clist: [aclist]
                })
                return
            }

            db.todo.update(id, aclist, function (err, result) {
                if(err) {
                    logger.error("todoUpdate DB error : " + err)
                    res.send(err)
                    return
                }

                res.send(result)
            })
        })
    })
}

// POST /todo/show
function todoShow (req, res){
    logger.debug("todoShow 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id

    md5sum.update(body.roomTitle + body.date);
    id = md5sum.digest('hex');


    db.ttable.getById(id, function (err, ttable) {
        if(err) {
            logger.error("ttableGetById DB error : " + err)
            res.send(err)
            return
        }

        if(!ttable){
            res.status(400).send('Sorry cant find that!')
            return
        }

        res.send(ttable)
    })
}


module.exports = {
    add: todoAdd,
    show: todoShow
}