var gameEngine = new GameEngine();
const EMPTY = 0;
const CIRCLE = 1;
const CROSS = 2;
const ONE = true;
const TWO = false;
const SOLO = "Solo Game";
const MULTIPLAYER = "Multiplayer Game";
const URL = "gameserver-env.eba-95e29jmb.us-east-2.elasticbeanstalk.com";

let gameMap;
let player;

const ASSET_MANAGER = new AssetManager();

let socket;
let gameCode;

/**
 * Checks and reports on the status of the fetch call
 * @param {String} response - The response from the fetch that was made previously
 * @return {Promise/String} - The success code OR The error promise that resulted from the fetch
 */
async function checkStatus (response) {
	if (response.status >= 200 && response.status < 300 || response.status === 0) {
		return response.text();
	} else {
		let errorMessage = await response.json();
		return Promise.reject(new Error(errorMessage.error));
	}
}

const createGame = async () => {
	fetch(`https://${URL}/game`, { method: 'post' })
		.then(checkStatus)
		.then(JSON.parse)
		.then((res) => {
			gameCode = res["game-code"];
			player = ONE;
			multiplayerGame(res["game-code"], ONE);
		})
		.catch(console.log);
};

const checkGame = async () => {
	const code = document.getElementById("code-input").value;
	player = TWO;
	multiplayerGame(code, TWO)
};

const soloGame = () => {
	document.getElementById("intro-section").classList.add("hidden");
	startCanvasGame(true, SOLO, "");
};

const multiplayerGame = (code, turn) => {
	const gameCodeElement = document.getElementById("game-code");
	document.getElementById("intro-section").classList.add("hidden");
	gameCodeElement.classList.remove("hidden");
	gameCodeElement.innerText = "Current Game Code: " + code;
	connectToGame(code);
	startCanvasGame(turn, MULTIPLAYER, code);
}

const startCanvasGame = (chosenTurn, type, code) => {
	ASSET_MANAGER.downloadAll(function () {
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
	
		gameMap = new Map(gameEngine, chosenTurn, type, code, socket);
	
		gameEngine.init(ctx);
	
		gameEngine.addEntity(gameMap);
	
		gameEngine.start();
	});
	document.getElementById("canvas").classList.remove("hidden");
};

const connectToGame = async (code) => {
	const playerState = player ? 1 : 2;
	socket = new WebSocket(`ws://${URL}/room/?code=${code}&player=${playerState}`);
	socket.addEventListener('open', function (event) {
		console.log("Successfully opened");
	});

	socket.addEventListener('close', function (event) {
		console.log("Closed");
	});
};

function main() {
	document.getElementById("solo-game-btn").addEventListener("click", soloGame);
	document.getElementById("create-game-btn").addEventListener("click", createGame);
	document.getElementById("connect-game-btn").addEventListener("click", checkGame);
}

window.addEventListener("load", main);
