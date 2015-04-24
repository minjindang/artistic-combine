
// 連線按鈕
$('#btnConnect').on('click', function(){
  var nickname = $('#nickname').val();
  var serverip = $('#serverip').val();

  debug('嘗試連線');
  
  var socket = io(serverip);
  bindEventToSocket(socket);
});

function bindEventToSocket(socket) {
  
  socket.on('user_list', function(userList) {
    debug('user_list', userList);
    renderUserList(userList);
  });

  //收到訊息
  socket.on('message', function(from, msg){
    debug('收到訊息', from, msg);
    var msg = from + ': ' + msg;
    $('#messages').append('<div>'+ msg +'</div>')
  });
  /*socket.on('private message', function(from, msg){
    debug('收到私人訊息', from, msg);
    var msg = from + ' 偷偷跟你說: ' + msg;
    $('#messages').append('<div>'+ msg +'</div>');
  });*/

  //連線
  socket.on('connect', function () {
    debug('已連線');
    socket.emit('user_in', $('#nickname').val() );  
  });
  
  //
  socket.on('disconnect', function () {
    debug('與伺服器斷線..');
  });

  
  // 送訊息按鈕
  $('#btnSay').on('click',function(){
    var sendto = $('#sendto option:selected').val();
    var sendtoName = $('#sendto option:selected').html();
    var nickname = $('#nickname').val();
    var msg = $('#message').val();
    
    // 判斷是公開訊息還是私人訊息
    if (sendto === 'all') {
      socket.emit('message', nickname, msg);
    }else {
      socket.emit('private message', nickname, sendto, msg);
			
      //私人訊息的話要顯示在對話      
     /* var msgShow = '你偷偷跟 ' + sendtoName + '說: ' + msg;
      $('#messages').append('<div>'+ msgShow +'</div>');*/
    }
    
    $('#message').val('');
    
  });
}

// 產生使用者清單
function renderUserList(userList) {
  $('#usersList').html('');
  $('#sendto').html('<option value="all">All</option>');

  Object.keys(userList).forEach(function(key){
    $('#usersList').append('<li>' + userList[key] + '</li>');
    $('#sendto').append('<option value="' + key + '">' + userList[key] + '</option>');
  });
}


/* 
* 這裏做一個 簡易除錯區塊 方便大家看
*/
function debug() {
  // 顯示訊息到 console
  console.log.apply(console, arguments);
  
  // 組合訊息
  /*var msg = Array.prototype.join.call(arguments, ' ');
  
  // 顯示訊息到畫面上
  $('#debug').append('<div class="debug">' + msg + '</div>');*/
}

// 清除除錯資訊
$('#btnClearDebug').on('click', function(){
  $('#debug').html('');
});

