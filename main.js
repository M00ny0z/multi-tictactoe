var gameEngine = new GameEngine();
const EMPTY = 0;
const CIRCLE = 1;
const CROSS = 2;
let gameMap;

var ASSET_MANAGER = new AssetManager();

const socket = new WebSocket('ws://localhost:3000');

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameMap = new Map(gameEngine);

	gameEngine.init(ctx);

	gameEngine.addEntity(gameMap);

	gameEngine.start();

	socket.addEventListener('open', function (event) {
		const gameState = gameMap.getState();
		socket.send(JSON.stringify(gameState));
	});
});

// Listen for messages
socket.addEventListener('message', function (event) {
	console.log(`GameState: ${event.data}`);
});