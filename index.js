/*
CSCI 290
High Low Game Assignment
Kailey Conyers
December 2 2021
File contains a program that interacts with users over text, allowing them to
guess a randomly generated number under 10. The program gives users hints in 
the form of 'too high' or 'too low'. Supports multiple users.
*/


const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const accountSid = "";
const authToken = "";

const client = new twilio(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

let gamesWon = parseInt(0);
let randomNum = parseInt(0);
let guessNum = parseInt(0);
let gameData = {};
let numberFrom = '';

let app = express(); app.use(bodyParser.urlencoded({extended:false}));

app.post('/sms', function (request, response){
  const twiml = new MessagingResponse();

  switch(request.body.Body.toLowerCase())
  {
    case "new game":
      numberFrom = request.body.From;
      if (!gameData.hasOwnProperty(numberFrom)){
        gameData[numberFrom] = {gamesWon: parseInt(0), randomNum: parseInt(0), guessNum: parseInt(0)};
        console.log(gameData);
      }
      gameData[numberFrom].randomNum = Math.floor(Math.random() * 10) + 1;
      twiml.message('New game started. Guess a number between 1 and 10.');
      break;
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "10":
        numberFrom = request.body.From;
	    gameData[numberFrom].guessNum = request.body.Body;
	    if (gameData[numberFrom].guessNum == gameData[numberFrom].randomNum){
	      gameData[numberFrom].gamesWon += 1;
	      twiml.message("Congratulations, that is the correct number. Type 'New Game' to play again. Total games won: ");
          twiml.message(gameData[numberFrom].gamesWon);
          break;
	    }else if (gameData[numberFrom].guessNum < gameData[numberFrom].randomNum){
	      twiml.message("You guess is too low. Try guessing again");
          break;
	    }else if (gameData[numberFrom].guessNum > gameData[numberFrom].randomNum){
	      twiml.message("You guess is too high. Try guessing again");
          break;
	    }
    default:
      twiml.message('Type "New Game" to start a new game. Only guesses of between 1 and 10 will be accepted.');
      break;
  }
  response.writeHead(200, {'Content-Type' : 'text/xml'})
  response.end(twiml.toString());
});

app.listen(8080);
