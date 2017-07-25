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
    title: String,
    chiefName: String,
    subject: String,
    belongIds: [String]
}), Room = mongoose.model('Room', RoomSchema)

var TtableSchema = new Schema({
    id: String,
    roomTitle: String,
    title: String,
    date: String,
    tables: [
        // {
        //     userName: String,
        //     times: [Number]
        // }
    ]
}), Ttable = mongoose.model('Ttable', TtableSchema)

var MapSchema = new Schema({
    id: String,
    roomTitle: String,
    date: String,
    places: [
        // {
        //     userName: String,
        //     loc: {
        //         'type': {type: String, 'default': 'Point'},
        //         'coordinates': [Number]
        //     }
        // }
    ]
}), Map = mongoose.model('Map', MapSchema)

var TodoSchema = new Schema({
    id: String,
    roomTitle: String,
    todoName: String,
    clist: [
        // {
        //     isCheck: Boolean,
        //     list: String,
        //     name: String
        // }
    ]
}), Todo = mongoose.model('Todo', TodoSchema)

var AppSchema = new Schema({
    roomTitle: String,
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
        title: room.title
    }, room, {
        upsert: true
    }, cb)
}


function roomList(id, cb) {
    Room.find({
        belongIds: id
    }).sort({"_id": -1}).exec(cb)
}


function roomGetByTitle(title, cb) {
    Room.findOne({
        title: title
    },cb)
}


function roomUpdate(title, belongIds, cb) {
    Room.update({
        title: title
    }, {
        $set: {
            belongIds: belongIds
        }
    },cb)
}


function ttableAdd(ttable, cb) {
    Ttable.update({
        id: ttable.id
    }, ttable, {
        upsert: true
    }, cb)
}


function ttableGetById(ttableId, cb) {
    Ttable.findOne({
        id: ttableId
    },cb)
}

// function ttableGetByName(id, userName, cb) {
//     Ttable.findOne({
//         $and:[
//             {
//                 id: id,
//             },
//             {
//                 tables:{
//                     $elemMatch:{
//                         userName: userName
//                     }
//                 }
//             }
//         ]
//     }, cb)
// }

function ttableGetByName(id, userName, cb) {
    Ttable.findOne({
        id: id,
        "tables.userName": userName
    }, cb)
}
//db.col.find({date:'2013-05-20'}, {date:0, visitor:{$elemMatch:{age:30}}})


function ttableUpdate(id, table, cb) {
    Ttable.update({
        id: id
    },{
        $push: {
            tables: table
        }
    }, cb)
}

function ttableTimesUpdate(id, userName, times, cb) {
    Ttable.update({
        id: id,
        "tables.userName": userName
    },{
        $set:{
            "tables.$.times": times
        }
    }, cb)
}


function mapAdd(map, cb) {
    Map.update({
        id: map.id
    }, map, {
        upsert: true
    }, cb)
}


function mapGetById(mapId, cb) {
    Map.findOne({
        id: mapId
    },cb)
}


function mapUpdate(id, place, cb) {
    Map.update({
        id: id
    },{
        $push: {
            places: place
        }
    }, cb)
}

function todoAdd(map, cb) {
    Todo.update({
        id: map.id
    }, map, {
        upsert: true
    }, cb)
}


function todoGetById(mapId, cb) {
    Todo.findOne({
        id: mapId
    },cb)
}


function todoUpdate(id, aclist, cb) {
    Todo.update({
        id: id
    },{
        $push: {
            clist: aclist
        }
    }, cb)
}

module.exports = {
    init: init,
    user: {
        add:       userAdd,
        getById:   userGetById,
        getBySess: userGetBySess,
        update:    userUpdate
    },
    room: {
        add:       roomAdd,
        list:      roomList,
        getByTitle: roomGetByTitle,
        update:    roomUpdate
    },
    ttable: {
        add:       ttableAdd,
        getById:   ttableGetById,
        getByName: ttableGetByName,
        update:    ttableUpdate,
        timesUpdate: ttableTimesUpdate
    },
    map: {
        add:     mapAdd,
        getById: mapGetById,
        update:  mapUpdate
    },
    todo: {
        add:     todoAdd,
        getById: todoGetById,
        update:  todoUpdate
    },
    app: {}
}