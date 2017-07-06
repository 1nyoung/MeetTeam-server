var crypto = require('crypto')

var async = require('async')

var db = require('../lib/db')
var logger = require('../lib/logger')


// POST /map/add
function mapAdd (req, res){
    logger.debug("mapAdd 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id, place

    function makeMap(map) {
        db.map.add(map, function (err, result) {
            if(err) {
                logger.error("mapAdd DB error : " + err)
                res.send(err)
                return
            }

            res.send(result)
        })
    }

    md5sum.update(body.roomName + body.date);
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

        db.map.getById(id, function (err, map) {
            console.log(user)
            if(err) {
                logger.error("mapGetById DB error : " + err)
                res.send(err)
                return
            }


            place = {
                userName: user.name,
                loc: {
                    type: 'point',
                    coordinates: [ body.longitude, body.latitude ]
                }
            }

            if(!map){
                makeMap({
                    id: id,
                    roomName: body.roomName,
                    date: body.date,
                    places: [place]
                })
                return
            }

            db.map.update(id, place, function (err, result) {
                if(err) {
                    logger.error("mapUpdate DB error : " + err)
                    res.send(err)
                    return
                }

                res.send(result)
            })
        })
    })
}

// POST /map/show
function mapShow (req, res){
    logger.debug("mapShow 호출")

    var body = req.body
    var md5sum = crypto.createHash('md5');
    var id

    md5sum.update(body.roomName + body.date);
    id = md5sum.digest('hex');


    db.map.getById(id, function (err, map) {
        if(err) {
            logger.error("mapGetById DB error : " + err)
            res.send(err)
            return
        }

        if(!map){
            res.status(400).send('Sorry cant find that!')
            return
        }

        res.send(map)
    })
}


module.exports = {
    add: mapAdd,
    show: mapShow
}