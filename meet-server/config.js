
module.exports = {
	server_port: 7530,
    db_url: 'mongodb://root:root@ds161410.mlab.com:61410/meetdb',
	route_info: [
	    //===== User =====//
        {file:'./user', path:'/user/login', method:'login', type:'post'},			// user.login
	    {file:'./user', path:'/user/add', method:'add', type:'post'},		    // user.adduser
        // {file:'./user', path:'/user/list', method:'listuser', type:'post'}		// user.listuser

        //===== Room =====//
        // {file:'./room', path:'/room/list', method:'', type:'post'},
        {file:'./room', path:'/room/add', method:'add', type:'post'},
        {file:'./room', path:'/room/add2', method:'add2', type:'post'}
        // {file:'./room', path:'/room/delete', method:'', type:'post'},
        // {file:'./room', path:'/room/search', method:'', type:'post'},
        //
        // //===== Ttable =====//
        // {file:'./ttable', path:'/ttable/show', method:'', type:'post'},
        // {file:'./ttable', path:'/ttable/register', method:'', type:'post'},
        // {file:'./ttable', path:'/ttable/delete', method:'', type:'post'},
        //
        // //===== Map =====//
        // {file:'./map', path:'/map/show', method:'', type:'post'},
        // {file:'./map', path:'/map/register', method:'', type:'post'},
        // {file:'./map', path:'/map/', method:'', type:'post'},
        //
        // //===== Clist =====//
        // {file:'./clist', path:'/clist/list', method:'', type:'post'},
        // {file:'./clist', path:'/clist/register', method:'', type:'post'},
        // {file:'./clist', path:'/clist/', method:'', type:'post'},
        //
        // //===== App =====//
        // {file:'./app', path:'/app/show', method:'', type:'post'},
        // {file:'./app', path:'/app/register', method:'', type:'post'},
        // {file:'./app', path:'/app/', method:'', type:'post'}
    ]
}