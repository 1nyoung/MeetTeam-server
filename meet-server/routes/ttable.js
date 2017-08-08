var crypto = require('crypto')

var async = require('async')
var util = require('util')

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

    async.waterfall([
        //세션으로 user 찾아서 넘기기
        function (callback) {
            db.user.getBySess(body.sess, function (err, user) {
                if (err) {
                    logger.error("userGetBySess DB error : " + err)
                    callback(err)
                    return
                }

                if (!user) {
                    logger.error("not found USER ")
                    //res.status(400).send("not found USER ")
                    callback("not found USER ")
                    return
                }
                callback(null, user)
            })
        },
        //ttable Id로 ttable 찾아서 존재하지 않으면 makeTtable 존재하면 그다음으로
        function (user, callback) {
            db.ttable.getById(id, function (err, ttable) {
                if(err) {
                    logger.error("ttableGetById DB error : " + err)
                    callback(err)
                    return
                }

                table = {
                    userName: user.name,
                    times: body.times
                }
                
                //ttable 없을 경우 waterfall 나가기
                if(!ttable){
                    makeTtable({
                        id: id,
                        roomTitle: body.roomTitle,
                        date: body.date,
                        tables: [table]
                    })
                    return
                }
                callback(null, user)
            })
        },
        //ttable에 userName이 내가 있냐 없냐
        function (user, callback) {
            db.ttable.getByName(id, user.name, function (err, ttable) {
                if(err) {
                    logger.error("ttableGetByName DB error : " + err)
                    callback(err)
                    return
                }

                //userName에 없을 경우 waterfall 나가기
                if(!ttable){
                    db.ttable.update(id, table, function (err, result) {
                        if(err) {
                            logger.error("ttableUpdate DB error : " + err)
                            callback(err)
                            return
                        }

                        return
                    })
                }

                callback(null, user)
            })
        },
        function (user, callback) {
            db.ttable.timesUpdate(id, user.name, body.times, function (err, result) {
                if(err) {
                    logger.error("ttableUpdate DB error : " + err)
                    callback(err)
                    return
                }

                callback(null, result)
            })
        }
    ], function (err, results) {
        if(err){
            logger.error("ttableAdd waterfall error : " + util.inspect(err))
            res.send(err)
            return
        }

        res.send(results)
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