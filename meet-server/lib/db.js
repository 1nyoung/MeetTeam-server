var util = require('util')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var db = {}

/*====== Schema ======*/
var UserSchema = new Schema({
    id: String,
    password: String,
    name: String,
    idNum: Number,
    phoneNum: String,
    addr: String,
    email: String,
    isProfessor: Boolean,
    sess: String
}), User = mongoose.model('User', UserSchema)

var RoomSchema = new Schema({
    name: String,
    chiefName: String,
    subject: String,
    belongIds: [String]
}), Room = mongoose.model('Room', RoomSchema)

var TtableSchema = new Schema({
    roomNum: String,
    date: String,
    table: {
        mon: {
            mor: [String],
            after: [String],
            even: [String],
        },
        tues: {
            mor: [String],
            after: [String],
            even: [String],
        },
        wed: {
            mor: [String],
            after: [String],
            even: [String],
        },
        thurs: {
            mor: [String],
            after: [String],
            even: [String],
        },
        fri: {
            mor: [String],
            after: [String],
            even: [String],
        },
        sat: {
            mor: [String],
            after: [String],
            even: [String],
        },
        sun: {
            mor: [String],
            after: [String],
            even: [String],
        }
    }
}), Ttable = mongoose.model('Ttable', TtableSchema)

var MapSchema = new Schema({
    date: String,
    place: [
        {
            id: String,
            loc: {
                'type': {type: String, 'default': 'Point'},
                'coordinates': [Number]
            }
        }
    ]
}), Map = mongoose.model('Map', MapSchema)

var ClistSchema = new Schema({
    roomNum: String,
    todoName: String,
    schedule: [
        {
            isCheck: Boolean,
            todo: String,
            dName: String
        }
    ]
}), Clist = mongoose.model('Clist', ClistSchema)

var AppSchema = new Schema({
    roomNum: String,
    decDay: String,
    decTime: String,
    decPlace: String
}), App = mongoose.model('App', AppSchema)


var SELECT = {
    USER: '_id id name email addr phoneNum idNum isProfessor sess'
}


/*====== init ======*/
function init(config) {

    console.log('db init')

    mongoose.connect(config.db_url)
    db = mongoose.connection;

    db.on('error', console.error.bind(console, 'mongoose connection error.'));
    db.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + config.db_url);
    });
   db.on('disconnected', init);
}


/*====== DB function ======*/

function userAdd(user, cb) {
    User.update({
        id: user.id
    }, user, {
        upsert: true

    }, cb)
}


function userGetBySess(sess, cb) {
    User.findOne({
        sess: sess
    }, cb)
}


function userGetById(id, select, cb) {
    if(typeof select === 'function'){
        cb = select
        select = null
    }
    User.findOne({
        id: id
    })
    .select(SELECT[select]).exec(cb)
}


function userUpdate(id, sess, cb) {
    User.update({
        id: id
    },{
        $set: { sess: sess}
    }, cb)
}


function roomAdd(room, cb) {
    Room.update({
        name: room.name
    }, room, {
        upsert: true
    }, cb)
}


function roomList(id, cb) {
    Room.find({
        belongIds: id
    }).sort({"_id": -1}).exec(cb)
}


function roomGetByName(roomName, cb) {
    Room.findOne({
        name: roomName
    },cb)
}


function roomUpdate(roomName, belongIds, cb) {
    Room.update({
        name: roomName
    }, {
        $set: {
            belongIds: belongIds
        }
    },cb)
}


module.exports = {
    init: init,
    user: {
        add: userAdd,
        getById: userGetById,
        getBySess: userGetBySess,
        update: userUpdate
    },
    room: {
        add: roomAdd,
        list: roomList,
        getByName: roomGetByName,
        update: roomUpdate
    },
    ttable: {},
    map: {},
    clist: {},
    app: {}
}
