const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

let socket;


connectToServer = async () => {
	socket = new WebSocket(`ws://localhost:3000/ABC123`);
	socket.addEventListener('open', function (event) {
      console.log("Successfully opened");
   });
   
   socket.addEventListener('message', function (message) {
      console.log(message);
      const parsedMessage = JSON.parse(message.data);
      console.log(parsedMessage);
      console.log(parsedMessage.message);
   })
};

function main() {
   connectToServer();
	ASSET_MANAGER.downloadAll(function () {
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
	
		gameEngine.init(ctx);
	
		gameEngine.start();
	});
}

window.addEventListener("load", main);





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
