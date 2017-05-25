var crypto = require('crypto')
var db = require('../database/db')

// POST /user/add
function userAdd(req, res) {
    console.log("userAdd 호출")
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
            console.log(err)
            res.send(err)
            return
        }

        res.send(result)
    })

}

// POST /user/login
function userLogin(req, res) {
    console.log("userLogin 호출")
    //var md5sum = crypto.createHash('md5');
    var body = req.body
    // var sess
    //
    // md5sum.update(body.id + body.name);
    // sess = md5sum.digest('hex');

    db.user.get(body.id, function (err, user) {
        if(err){
            console.log(err)
            res.send(err)
            return
        }
        if (!user) {
            res.status(401).send('Sorry cant find that!');
            return
        }

        if(body.password != user.password){
            res.status(401).send('login fail');
            return
        }

        res.send(user);
    })

}

module.exports = {
    add: userAdd,
    login: userLogin
}