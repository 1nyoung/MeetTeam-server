var crypto = require('crypto')

var async = require('async')

var db = require('../lib/db')
var logger = require('../lib/logger')


// POST /ttable/add
function ttableAdd (req, res){
    logger.debug("ttableAdd 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id, table

    function makeTtable(ttable) {
        db.ttable.add(ttable, function (err, result) {
            if(err) {
                logger.error("ttableAdd DB error : " + err)
                res.send(err)
                return
            }

            res.send(result)
        })
    }

    md5sum.update(body.roomTitle + body.date);
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

        db.ttable.getById(id, function (err, ttable) {
            console.log(user)

            if(err) {
                logger.error("ttableGetById DB error : " + err)
                res.send(err)
                return
            }
            console.log(body.times)

            table = {
                userName: user.name,
                times: body.times
            }

            if(!ttable){
                makeTtable({
                    id: id,
                    roomTitle: body.roomTitle,
                    date: body.date,
                    tables: [table]
                })
                return
            }

            db.ttable.update(id, table, function (err, result) {
                if(err) {
                    logger.error("ttableUpdate DB error : " + err)
                    res.send(err)
                    return
                }

                res.send(result)
            })
        })
    })
}

// POST /ttable/show
function ttableShow (req, res){
    logger.debug("ttableShow 호출")

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
    add: ttableAdd,
    show: ttableShow
}