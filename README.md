# minorityGames
Webapp to research competitive behaviour in [Minority Games](http://en.wikipedia.org/wiki/El_Farol_Bar_problem), a negative-sum-game 
# Node.js and Express.js
To start developing new nodejs app we first need to create it and install various dependencies.

	mkdir minorityGames
	cd minorityGames
	npm init
	npm install --save express jade socket.io

Check `package.json` to see if all the details are fin, like versions of dependencies, name of the javascript file that acts as the server, etc.

# Reference Material

* [Node.js modules, require and export](http://openmymind.net/2012/2/3/Node-Require-and-Exports/) - Excellent article about `module.exports` in Node.js