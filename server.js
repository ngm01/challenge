var express = require('express');

var app = express();

app.use(express.static(__dirname + "/static"));

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
//app.use(session({secret: 'goodforyou'}));

app.get("/", function(req, res){
    res.render("index");
})

// more routes &c

var PORT = 8000;
var line = "\n**************************\n"
var server = app.listen(8000, function(){
console.log(line, "Challenge: Socket Chat. ", "\n", "Listening on port: " + PORT, line);
})
var io = require('socket.io').listen(server);
var users = [];
var posts = [];
var updates = [];
io.sockets.on('connect', (socket)=>{
    console.log("Socket connected: ", socket.id);
    io.emit("users", users);
    io.emit("posts", posts);
    io.emit("updates", updates);
    socket.on("new_user", (new_user)=>{
        new_user.id = socket.id;
        users.push(new_user);
        updates.push(new_user.user_name + " joined the room.");
        io.emit("users", users);
        io.emit("updates", updates);
        io.emit("posts", posts);
    })
    socket.on('new_post', (new_post)=>{
        //console.log(new_post);
        posts.push(new_post);
        io.emit("posts", posts);
    })
    socket.on('disconnect', ()=>{
    console.log("Socket disconnected: ", socket.id);
    for(let i=0; i<users.length; i++){
        if(users[i].id == socket.id){
            var disconnected_user = users.splice(i, 1);
            //console.log(disconnected_user);
            updates.push(disconnected_user[0].user_name + " left the room.");
            io.emit("updates", updates);
        }
    }
})
})