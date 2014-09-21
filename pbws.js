var WebSocket = require('ws'),
	ws = new WebSocket('wss://stream.pushbullet.com/websocket/Ls6ZNSdCvSbcitKTzagERU6rOYfSaBeG');

ws.on('open', function() {
	ws.send('something');
});

ws.on('message', function(message) {
	console.log('received: %s', message);
	parseWsMessage(message);
});

function parseWsMessage(message) {
	var jsonObj = JSON.parse(message);
	console.log(jsonObj.type);
	if (jsonObj.type == 'tickle' && jsonObj.subtype == 'push') {
		retrievePushHistory();
	};
}

var moment = require('moment');
var https = require('https');

function retrievePushHistory() {
	var oneSecAgo = moment().subtract(1, 's').unix();
	console.log(oneSecAgo)
	// https.get("https://api.pushbullet.com", function(res) {
	// 	console.log("Got response: " + res.statusCode);
	// }).on('error', function(e) {
	// 	console.log("Got error: " + e.message);
	// });

	var options = {
		hostname: 'api.pushbullet.com',
		port: 443,
		path: '/v2/pushes?modified_after=' + oneSecAgo,
		method: 'GET',
		auth: 'Ls6ZNSdCvSbcitKTzagERU6rOYfSaBeG',
	};

	var req = https.request(options, function(res) {
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);

		res.on('data', function(d) {
			process.stdout.write(d);
		});
	});
	req.end();

	req.on('error', function(e) {
		console.error(e);
	});

}