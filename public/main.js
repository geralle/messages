var socket = io.connect()
var messageForm = $('.send-message')
var messageBox = $('.messages')
var chat = $('.chat')
var nickForm = $('.setNick')
var nickError = $('.nickError')
var nickBox = $('.nickname')
var users = $('.users')

nickForm.submit(function(event){
  event.preventDefault()
  socket.emit('new user', nickBox.val(), function(data){
    if(data){
      $('.nickWrap').hide()
      $('.contentWrap').show()
    }else{
      nickError.html('That username is already taken! Try again')
    }
  })
  nickBox.val('')
})

socket.on('usernames', function(data){
  var html = ''
  for(var i=0;i < data.length;i++){
    html += data[i] + '<br/>'
  }
  users.html(html)
})

// i think you replace the 'send message' with the user that should recieve each message
messageForm.submit(function(event){
  event.preventDefault()
  socket.emit('send message', messageBox.val())
  messageBox.val('')
})

socket.on('new message', function(data){
  chat.append("<b>" + data.nick + ": </b>" + data.msg + "<br/>")
})
