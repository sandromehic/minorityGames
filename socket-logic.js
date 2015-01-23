exports = module.exports = function(io) {
	// create a socket for every active connection and listen to other events
	io.sockets.on('connection', function (socket) {
		console.log('user connected');
		
		// --- EVENTS
		// disconnect event
		socket.on('disconnect', function (data) {
			console.log('a user disconnected');
		});

		// get graph, client can require graph information
		// it should however all be sent on every new round
		socket.on('getGraph', function (data) {
			console.log('user requested graph data!');
		});

		// get score (same as above)
		socket.on('getScore', function (data) {
			console.log('user requested score data!');
		});

		// get rank (same as above)
		socket.on('getRank', function (data) {
			console.log('user requested rank data!');
		});

		// get rank difference (same as above)
		socket.on('getRankDifference', function (data) {
			console.log('user requested rank difference data!');
		});

		// get neighbors (same as above)
		socket.on('getNeighbors', function (data) {
			console.log('user requested neighbors data!');
		});
	});
}