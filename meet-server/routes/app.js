var crypto = require('crypto')

var db = require('../lib/db')
var logger = require('../lib/logger')


// POST /app/add
function appAdd (req, res){
    logger.debug("appAdd 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id, app

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

        app = {
            id: id,
            roomTitle: body.roomTitle,
            date: body.date,
            decTime: body.decTime || "미정",
            decPlace: body.decPlace || "미정"
        }

        db.app.add(app, function (err, result) {
            if(err) {
                logger.error("appAdd DB error : " + err)
                res.send(err)
                return
            }

            res.send(result)
        })
    })
}


// POST /app/show
function appShow (req, res){
    logger.debug("appShow 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id

    md5sum.update(body.roomTitle + body.date);
    id = md5sum.digest('hex');

    db.app.getById(id, function (err, app) {
        if(err) {
            logger.error("appGetById DB error : " + err)
            res.send(err)
            return
        }

        if(!app){
            res.status(400).send('Sorry cant find that!')
            return
        }

        res.send(app)
    })
}


module.exports = {
    add: appAdd,
    show: appShow
}