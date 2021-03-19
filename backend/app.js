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
const { parse } = require('path');
const port = process.env.PORT || 3000;

// for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

app.use(cors());

const gameStateCont = new Map();

const createGameStateCopy = () => {
   const output = {};
   for (const [key, value] of gameStateCont) {
      output[key] = value;
   }
   return output;
};

app.get('/', async function (req, res) {
   res.send("hello world");
});

const checkConnection = (ws, req, next) => {
   if (!gameStateCont.has(req.query.code) && parseInt(req.query.player) === 2) {
      console.log("closing");
      ws.close();
   } else {
      if (parseInt(req.query.player) === 1) {
         gameStateCont.set(req.query.code, 
            { 
               state: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], 
               turn: true 
            }
         );
      }
      if (parseInt(req.query.player) === 2) {
         ws.send(JSON.stringify(createGameStateCopy()));
      }
      next();
   }
};


app.ws('/room', checkConnection, function(ws, req) {
   
   ws.on('message', async function(msg) {
      const parsedRequest = JSON.parse(msg);
      const gameState = { state: parsedRequest.state, turn: parsedRequest.turn };
      const gameCode = parsedRequest.code;
      gameStateCont.set(gameCode, gameState);

      
      expressWs.getWss().clients.forEach(client => {
         client.send(JSON.stringify(createGameStateCopy()));
      });
   });
   
});

// NEED A FUNCTION TO UPDATE GAME STATE FOR SPECIFIED GAME (DONE)
// NEED A FUNCTION TO END A GAME (DONE)

app.post('/game', async function(req, res) {
   const gameCode = createGameRoomName();
   try {
      res.set("Content-Type", "application/json");
      res.json({ 'game-code': gameCode });
   } catch (e) {
      const errorMessage = "An error occurred. Please try again later.";
      res.set("Content-Type", "text/plain");
      res.status(500).send(errorMessage);
   }
});

/**
 * Queries the database to retrieve all of the curently tracked pollution types
 * @param {DBConnection} db - The connection to the APMDB
 * @return {JSON[]} - The list of pollution types, each containing its pollutionID and name
 */
function createGameRoomName () {
   let output = "";
   
   while (gameStateCont.has(output) || output == "") {
      for (let i = 0; i < 3; i++) {
         const letterCode = String.fromCharCode((65 + Math.floor(Math.random() * 26)));
         output = output + letterCode;
      }
   
      for (let i = 0; i < 3; i++) {
         output = output + Math.floor(Math.random() * 10);
      }
   }

   return output;
}

app.listen(port);