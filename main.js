var gameEngine = new GameEngine();
const EMPTY = 0;
const CIRCLE = 1;
const CROSS = 2;

var ASSET_MANAGER = new AssetManager();


ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameEngine.init(ctx);

	gameEngine.addEntity(new Map(gameEngine));

	gameEngine.start();
});