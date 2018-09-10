const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')

// save all the users is chatting
let arrUsers = [];

//save all messages
let arrMessages = [];

app.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT || 3000;

const server =  app.listen(port, () => console.log(`Server started in port ${port}`));

const io = require('socket.io')(server);

app.get('/', (req, res) => {
  let file = path.join(__dirname , 'views/login.html');
  res.sendFile(file);
})

app.get('/index', (req, res) => {
  let file = path.join(__dirname , 'views/index.html');
  res.sendFile(file);
})

app.get('/getUsersVsMessages', (req, res) => {
  let users = arrUsers;
  let messages = arrMessages;
  res.json({ users, messages });  
})

app.post('/login', handleLogin);

io.on('connection', (client) => {
  client.on('disconnect', handleDisconnect);
  // client.on('CLIENT_LOGIN_EMIT', handleLogin);
})

function checkExisted(name){
  if(arrUsers.length == 0) return false;
  let index = arrUsers.findIndex(item => {
    item = item.toLowerCase();
    name = name.toLowerCase();
    return name == item;
  })
  console.log(index);
  return index > -1;
}

function handleLogin(req, res){
  const { username } = req.body;
  if(checkExisted(username)) return res.json({success: false});
  arrUsers.push(username);
  res.json({success: true});
}

function handleDisconnect(client){
  console.log('disconnect');
  console.log(client);
}


