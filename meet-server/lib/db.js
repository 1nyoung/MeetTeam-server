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
        //     idx: String,
        //     userNames: [String]
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

var TaskSchema = new Schema({
    id: String,
    roomTitle: String,
    taskName: String,
    clist: [
        // {
        //     isCheck: Boolean,
        //     list: String,
        //     name: String
        // }
    ]
}), Task = mongoose.model('Task', TaskSchema)

var AppSchema = new Schema({
    id: String,
    roomTitle: String,
    date: String,
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

function ttableGetByTime(id, time, cb) {
    Ttable.findOne({
        id: id,
        "tables.time": time
    }, cb)
}


function ttableGetByUserName(id, time, userName, cb) {
    Ttable.findOne({
        $and:[
            {
                id: id,
            },
            {
                tables:{
                    $elemMatch:{
                        time: time,
                        userNames: userName
                    }
                }
            }
        ]
    }, cb)
}


function ttableUpdate(id, table, cb) {
    Ttable.update({
        id: id
    },{
        $push: {
            tables: table
        }
    }, cb)
}


function ttableUserNamesUpdate(id, time, userName, cb) {
    Ttable.update({
        id: id,
        "tables.time": time
    },{
        $push:{
            "tables.$.userNames": userName
        }
    }, cb)
}


function ttableUserNameDelete(id, time, userName, cb) {
    Ttable.update({
        id: id,
        "tables.time": time
    },{
        $pull:{
            "tables.$.userNames": userName
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


function mapPlaceRemove(id, userName, cb) {
    Map.update({
        id: id,
    },{
        $pull: {
            "places": {
                userName: userName
            }
        }
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


function taskAdd(task, cb) {
    Task.update({
        id: task.id
    }, task, {
        upsert: true
    }, cb)
}


function taskRemove(id, cb) {
    Task.remove({
        id: id
    }, cb)
}


function taskClistRemove(id, list, name, cb) {
    Task.update({
        id: id,
    },{
        $pull: {
            "clist": {
                list: list,
                name: name
            }
        }
    }, cb)
}


function taskGetById(id, cb) {
    Task.find({
        id: id
    },cb)
}


function taskGetByRoomTitle(roomTitle, cb) {
    Task.find({
        roomTitle: roomTitle
    },cb)
}


function taskUpdate(id, aclist, cb) {
    Task.update({
        id: id
    },{
        $push: {
            clist: aclist
        }
    }, cb)
}


function taskCheckUpdate(id, aclist, cb) {
    Task.update({
        id: id,
        "clist.list": aclist.list,
        "clist.name": aclist.name
    },{
        $set:{
            "clist.$.isCheck": aclist.isCheck
        }
    }, cb)
}


function appAdd(app, cb) {
    App.update({
        id: app.id
    }, app, {
        upsert: true
    }, cb)
}


function appGetById(appId, cb) {
    App.findOne({
        id: appId
    },cb)
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
        add:        roomAdd,
        list:       roomList,
        getByTitle: roomGetByTitle,
        update:     roomUpdate
    },
    ttable: {
        add:               ttableAdd,
        getById:           ttableGetById,
        getByTime:         ttableGetByTime,
        getByUserName:     ttableGetByUserName,
        update:            ttableUpdate,
        userNamesUpdate:   ttableUserNamesUpdate,
        userNameDelete:    ttableUserNameDelete
    },
    map: {
        add:          mapAdd,
        placeRemove:  mapPlaceRemove,
        getById:      mapGetById,
        update:       mapUpdate
    },
    task: {
        add:            taskAdd,
        remove:         taskRemove,
        clistRemove:    taskClistRemove,
        getById:        taskGetById,
        getByRoomTitle: taskGetByRoomTitle,
        update:         taskUpdate,
        checkUpdate:    taskCheckUpdate
    },
    app: {
        add: appAdd,
        getById: appGetById
    }
}
