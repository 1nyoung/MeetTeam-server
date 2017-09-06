
module.exports = {
	server_port: 7530,
    db_url: 'mongodb://root:root@ds161410.mlab.com:61410/meetdb',
	route_info: [
	    //===== User =====//
	    {file:'./user', path:'/user/add', method:'add', type:'post'},
        {file:'./user', path:'/user/update', method:'update', type:'post'},
        {file:'./user', path:'/user/show', method:'show', type:'post'},
        {file:'./user', path:'/user/login', method:'login', type:'post'},
        {file:'./user', path:'/user/list', method:'list', type:'post'},

        //===== Room =====//
        {file:'./room', path:'/room/add', method:'add', type:'post'},
        {file:'./room', path:'/room/addUser', method:'addUser', type:'post'},
        {file:'./room', path:'/room/addChat', method:'addChat', type:'post'},
        {file:'./room', path:'/room/list', method:'list', type:'post'},
        {file:'./room', path:'/room/show', method:'show', type:'post'},
        // {file:'./room', path:'/room/delete', method:'', type:'post'},
        // {file:'./room', path:'/room/search', method:'', type:'post'},
        //
        // //===== Ttable =====//
        {file:'./ttable', path:'/ttable/add', method:'add', type:'post'},
        {file:'./ttable', path:'/ttable/show', method:'show', type:'post'},
        // {file:'./ttable', path:'/ttable/delete', method:'', type:'post'},
        //
        // //===== Map =====//
        {file:'./map', path:'/map/add', method:'add', type:'post'},
        {file:'./map', path:'/map/placeRemove', method:'placeRemove', type:'post'},
        {file:'./map', path:'/map/show', method:'show', type:'post'},
        // {file:'./map', path:'/map/', method:'', type:'post'},
        //
        // //===== task =====//
        {file:'./task', path:'/task/add', method:'add', type:'post'},
        {file:'./task', path:'/task/remove', method:'remove', type:'post'},
        {file:'./task', path:'/task/clistAdd', method:'clistAdd', type:'post'},
        {file:'./task', path:'/task/clistRemove', method:'clistRemove', type:'post'},
        {file:'./task', path:'/task/show', method:'show', type:'post'},
        //
        // //===== App =====//
        {file:'./app', path:'/app/add', method:'add', type:'post'},
        {file:'./app', path:'/app/show', method:'show', type:'post'},
        // {file:'./app', path:'/app/', method:'', type:'post'}
    ]
}