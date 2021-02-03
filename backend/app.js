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

app.ws('/', function(ws, req) {

   ws.on('message', function(msg) {
      const gameState = JSON.parse(msg);
      ws.send(JSON.stringify(gameState));
   });
   
});

app.post('/game', function(req, res) {
   
});

app.listen(port);