var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/chatroom';

router.use(function(req, res, next) {
	next();
});

router.get('/', function(req, res) {
	if(req.session.username!=null) {
		MongoClient.connect(url, function(err, db) {
			if(err){
				console.log('Failed to connect to MongoDB!');
				return console.dir(err);
			}
			else{
				console.log('Connect to MongoDB successfully!');
				var collection = db.collection('messages');
				collection.find().toArray(function(err, results) {
					console.log('There are '+results.length+' messages in database.');
					for(var i=0;i<results.length;i++){
						console.log(results[i].username);
						console.log(results[i].time);
						console.log(results[i].content);
					}
					res.render('chatroom', {
						layout: false,
						session: req.session,
						messages: results
					});
					db.close();
				});
			}
		});
	}
	else {
		res.redirect('/login');
	}
});

router.get('/login', function(req, res) {
	res.sendFile(__dirname + '/login.html');
});

router.get('/chatroom', function(req, res) {
	if(req.session.username!=null){
		MongoClient.connect(url, function(err, db) {
			if(err){
				console.log('Failed to connect to MongoDB!');
				return console.dir(err);
			}
			else{
				console.log('Connect to MongoDB successfully!');
				var collection = db.collection('messages');
				collection.find().toArray(function(err, results) {
					console.log('There are '+results.length+' messages in database.');
					for(var i=0;i<results.length;i++){
						console.log(results[i].username);
						console.log(results[i].time);
						console.log(results[i].content);
					}
					res.render('chatroom', {
						layout: false,
						session: req.session,
						messages: results
					});
					db.close();
				});
			}
		});
	}
	else {
		res.redirect('/login');
	}
});

router.get('/logout', function(req, res) {
	req.session.username = null;
	res.redirect('/login');
});

router.post('/register', function(req, res) {
	if(req.body.username) {
		req.session.username = req.body.username;
		res.redirect('/chatroom');
	} else {
		res.redirect('/');
	}
});

module.exports = router;