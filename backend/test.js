const util = require('util');
const fs = require('fs');
const glob = require('glob');
const cors = require('cors');

const globPromise = util.promisify(glob);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);

const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);


const multer = require("multer");
const port = process.env.PORT || 3000;

// for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

app.use(cors());

app.ws('/:code', async function(ws, req) {
   console.log(req.params.code);
   const obj = { message: "Hello World" };
   ws.send(JSON.stringify(obj));
});















async function endGame(code) {
   await rmdir(code, { recursive: true });
}

async function updateGame(code, state) {
   await writeFile(`${code}/game.json`, JSON.stringify(state), 'utf8');
}

async function getGameState(code) {
   const results = await readFile(`${code}/game.json`, 'utf8');
   return results;
}

app.post('/game', async function(req, res) {
   const gameCode = createGameRoomName();
   try {
      await mkdir(`${gameCode}`);
      res.set("Content-Type", "application/json");
      res.json({ 'game-code': gameCode });
   } catch (e) {
      const errorMessage = "An error occurred. Please try again later.";
      res.set("Content-Type", "text/plain");
      res.status(500).send(errorMessage);
   }
});

app.get('/game/:code', cors(), async function(req, res) {
   if (fs.existsSync(`./${req.params.code}`)) {
      res.set("Content-Type", "text/plain");
      res.send("Game exists.");
   } else {
      res.set("Content-Type", "text/plain");
      res.status(404).send("Game does not exist.");
   }
});

/**
 * Queries the database to retrieve all of the curently tracked pollution types
 * @param {DBConnection} db - The connection to the APMDB
 * @return {JSON[]} - The list of pollution types, each containing its pollutionID and name
 */
function createGameRoomName () {
   let output = "";

   for (let i = 0; i < 3; i++) {
      const letterCode = String.fromCharCode((65 + Math.floor(Math.random() * 26)));
      output = output + letterCode;
   }

   for (let i = 0; i < 3; i++) {
      output = output + Math.floor(Math.random() * 10);
   }

   return output;
}

app.listen(port);