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
            logger.error("not found USER")
            res.status(400).send("not found USER")
            return
        }

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


// POST /task/remove
function taskRemove (req, res){
    logger.debug("taskRemove 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id

    md5sum.update(body.roomTitle + body.taskName);
    id = md5sum.digest('hex');

    db.user.getBySess(body.sess, function (err, user) {
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

        db.task.getById(id, function (err, task) {
            if(err) {
                logger.error("ttableGetById DB error : " + err)
                res.send(err)
                return
            }

            if(task.length === 0){
                logger.error("not found TASK")
                res.status(400).send("not found TASK")
                return
            }

            db.task.remove(id, function (err, result) {
                if(err) {
                    logger.error("taskAdd DB error : " + err)
                    res.send(err)
                    return
                }

                res.send(result)
            })
        })
    })
}


// POST /task/clistAdd
function taskClistAdd (req, res){
    logger.debug("taskClistAdd 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id, aclist

    md5sum.update(body.roomTitle + body.taskName);
    id = md5sum.digest('hex');

    db.task.getById(id, function (err, task) {
        if(err) {
            logger.error("ttableGetById DB error : " + err)
            res.send(err)
            return
        }

        if(task.length === 0){
            logger.error("not found TASK")
            res.status(400).send("not found TASK")
            return
        }

        aclist = {
            list: body.list,
            name: body.name
        }

        if(body.isCheck){
            aclist.isCheck = body.isCheck

            db.task.checkUpdate(id, aclist, function (err, result) {
                if(err) {
                    logger.error("taskUpdate DB error : " + err)
                    res.send(err)
                    return
                }

                res.send(result)
                return
            })
        }else{
            aclist.isCheck = false

            db.task.update(id, aclist, function (err, result) {
                if(err) {
                    logger.error("taskUpdate DB error : " + err)
                    res.send(err)
                    return
                }

                res.send(result)
                return
            })
        }
    })
}


// POST /task/clistRemove
function taskClistRemove (req, res){
    logger.debug("taskClistRemove 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id

    md5sum.update(body.roomTitle + body.taskName);
    id = md5sum.digest('hex');

    db.task.getById(id, function (err, task) {
        if(err) {
            logger.error("ttableGetById DB error : " + err)
            res.send(err)
            return
        }

        if(task.length === 0){
            logger.error("not found TASK")
            res.status(400).send("not found TASK")
            return
        }

        db.task.clistRemove(id, body.list, body.name, function (err, result) {
            if(err) {
                logger.error("taskClistRemove DB error : " + err)
                res.send(err)
                return
            }

            res.send(result)
        })
    })
}


// POST /task/show
function taskShow (req, res){
    logger.debug("taskShow 호출")

    var body = req.body

    db.task.getByRoomTitle(body.roomTitle, function (err, task) {
        if(err) {
            logger.error("taskGetById DB error : " + err)
            res.send(err)
            return
        }

        if(task.length === 0){
            res.status(400).send("not found TASK")
            return
        }

        res.send(task)
    })
}


module.exports = {
    add:         taskAdd,
    remove:      taskRemove,
    clistAdd:    taskClistAdd,
    clistRemove: taskClistRemove,
    show:        taskShow
}