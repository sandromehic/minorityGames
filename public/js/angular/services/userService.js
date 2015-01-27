classicalMinorityApp.service('userService', function() {
	this.user = '';
	this.setuser = function(nick) {
		if(nick != '') {
			this.user = nick;
		}
	};
	this.getuser = function() {
		return this.user;
	};
});