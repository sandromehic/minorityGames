exports = module.exports = function(io) {
	// create a socket for every active connection and listen to other events
	io.sockets.on('connection', function (socket) {
		console.log('user connected');
	});
}