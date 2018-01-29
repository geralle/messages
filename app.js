const express = require('express')
const app = express()
const server = require('http').createServer(app)
const port = 3000
const path = require('path');
var io = require('socket.io').listen(server)
var users = {}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, function(){
  console.log("http://localhost:"+port)
})

app.get('/', function(req, res){
  res.render('index',{
    title: 'messages'
  })
})

io.sockets.on('connection', function(socket){
  socket.on('new user', function(data, callback){
    if(data in users){
      callback(false)
    }else{
      callback(true)
      socket.nickname = data
      users[socket.nickname] = socket
      updateNicknames()
    }
  })

  function updateNicknames(){
    io.sockets.emit('usernames', Object.keys(users))
  }

// i think you replace the 'send message' with the user that should recieve each message
  socket.on('send message', function(data){
    var msg = data.trim()
    io.sockets.emit('new message', {msg: data, nick: socket.nickname})
  })

  socket.on('disconnect', function(data){
    if(!socket.nickname) return
    delete users[socket.nickname]
    updateNicknames()
  })
})
