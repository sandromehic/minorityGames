exports = module.exports = function(io) {
	// create a socket for every active connection and listen to other events
	io.sockets.on('connection', function (socket) {
		console.log('user connected');
		
		// --- EVENTS
		// disconnect event
		socket.on('disconnect', function (data) {
			console.log('a user disconnected');
		});

		// admin messages
		socket.on('start', function (data) {
			console.log('Received start the game signal!');
			socket.broadcast.emit('start', 'Start the game!');
		});
		socket.on('stop', function (data) {
			console.log('Received stop the game signal!');
			socket.broadcast.emit('stop', 'Stop the game!');
		});
		socket.on('sendNewRound', function (data) {
			console.log('Received new round signal from admin!' + data);
			socket.broadcast.emit('newRound', data);
		});
		// graph controll from admin
		socket.on('sendNewPoint', function (data) {
			console.log('Received new point from admin ' + data);
			socket.broadcast.emit('graphNewPoint', data);
		});

		// ping for testing
		socket.on('ping', function(data) {
			console.log('recieved ping message from ' + data);
			socket.emit('ping', data);
		})
	});
}