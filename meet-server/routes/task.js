var crypto = require('crypto')

var async = require('async')

var db = require('../lib/db')
var logger = require('../lib/logger')


// POST /task/add
function taskAdd (req, res){
    logger.debug("taskAdd 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id, task

    md5sum.update(body.roomTitle + body.taskName);
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
        // task 만들고 그리고나서 추가

        task = {
            id: id,
            roomTitle: body.roomTitle,
            taskName: body.taskName
        }

        db.task.add(task, function (err, result) {
            if(err) {
                logger.error("taskAdd DB error : " + err)
                res.send(err)
                return
            }

            res.send(result)
        })
    })
}

// POST /task/clistAdd
function taskClistAdd (req, res){
    logger.debug("taskClistAdd 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id, aclist

    function maketask(task) {
        db.task.add(task, function (err, result) {
            if(err) {
                logger.error("taskAdd DB error : " + err)
                res.send(err)
                return
            }

            res.send(result)
        })
    }

    md5sum.update(body.roomTitle + body.taskName);
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

        db.task.getById(id, function (err, task) {
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

            if(!task){
                maketask({
                    id: id,
                    roomTitle: body.roomTitle,
                    taskName: body.taskName,
                    clist: [aclist]
                })
                return
            }

            db.task.update(id, aclist, function (err, result) {
                if(err) {
                    logger.error("taskUpdate DB error : " + err)
                    res.send(err)
                    return
                }

                res.send(result)
            })
        })
    })
}


// POST /task/show
function taskShow (req, res){
    logger.debug("taskShow 호출")

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
    add: taskAdd,
    clistAdd: taskClistAdd,
    show: taskShow
}