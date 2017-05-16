var db = require('../database/db')

function userAdd(req, res) {
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
        isProfessor: body.isProfessor
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

function userLogin(req, res) {
    var body = req.body

    db.user.get(body.id, function (err, user) {
        if(err){
            console.log('eee')
            console.log(err)
            res.send(err)
            return
        }
        if (!user) {
            console.log('ccc')
            res.status(401).send('Sorry cant find that!');
            return
        }

        if(body.password != user.password){
            console.log('aaaa')
            res.status(401).send('login fail');
            return
        }
        console.log('dddd')
        req.session.user = {
            id: user.id
        }
        console.log(req.session)
        console.log('qqq')
        //console.log
        res.send(user);
    })

}

module.exports = {
    add: userAdd,
    login: userLogin
}