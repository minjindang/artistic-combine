var socketio = require("socket.io");
//建立一個新的 socket.io server
var io = socketio(process.env.PORT || 7000);

var clients = {};
var userList = {};

//每條新連線進來都要做事件綁定
io.on("connection", function(someone){
	console.log("someone here", someone.id);

	//使用者上線通知
	someone.on('user_in', function(nickname){
		userList[someone.id] = nickname;
		clients[someone.id] = someone;
		io.emit('user_list', userList);
	});
	//使用者下線通知
	someone.on('disconnect', function(nickname){
		delete userList[someone.id];
		delete clients[someone.id];
		io.emit('user_list', userList);
	});

	//收到訊息並發送給所有人
	someone.on('message', function(form, msg) {
		io.emit('message', form, msg);
	});
	someone.on('private message', function(form, sendToId, msg) {
		clients[sendToId].emit('private message', form, msg);
	});
});

console.log("Start socket!");