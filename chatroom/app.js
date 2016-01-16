var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session')({
	secret: '123',
	resave: true,
	saveUninitialized: true
});
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./router');
var sharedsession = require("express-socket.io-session");
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/chatroom';

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session);

app.use('/', router);

var server = app.listen(process.env.PORT || 3000, function() {
	console.log('listen on port:' + 3000);
});

var io = require('socket.io').listen(server);

io.use(sharedsession(session, {
	autoSave:true
}));

io.on('connection', function(socket){
	console.log(socket.handshake.session.username + ' entered the chatroom!');

	socket.on('chat message', function(post){
		MongoClient.connect(url, function(err, db) {
			if(err) {
				console.log('Failed to connect to MongoDB!');
				return console.dir(err);
			}
			else {
				console.log('Connect to MongoDB successfully!');
				var collection = db.collection('messages');
				collection.insert(post);
			}
		});
		io.emit('chat message', post);
		console.log(post);
	});

	socket.on('disconnect', function() {
		console.log(socket.handshake.session.username + ' left the chatroom!');
	});
});