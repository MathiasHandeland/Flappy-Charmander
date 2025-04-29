import { charmander, loadCharmander, updateCharmander, resetCharmanderPos, flapCharmander, checkIfCharmanderHitGround, toggleCharmanderFrame } from './charmander.js';
import { pipeArray, loadPipes, placePipes, updatePipes, checkPipeCollisions } from './pipe.js';
import { drawScore, drawBestScore } from './utils.js';

let board;
const boardWidth = 360;
const boardHeight = 640;
let context; 

let gameOver = false; 
let gameStarted = false;
let score = 0; 
let bestScore = 0; 

let velocityX = -2; // pipe speed
let pipeGenerationInterval = 1500; // milliseconds
let lastPipeTime = 0;

window.onload = function() {
    // draw initial game board
    board = document.getElementById("gameCanvas");
    board.width = boardWidth;  
    board.height = boardHeight;
    context = board.getContext("2d");

    // load best score from localStorage
    loadBestScore();

    // load charmander and pipes
    loadCharmander(context);
    loadPipes();
    
    // Show start message before game starts
    document.getElementById("startGameMessage").style.display = "block";
    document.getElementById("playGameMessage").style.display = "block";

    // start game loop
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveCharmander); // listen for key presses
    document.addEventListener("touchstart", moveCharmander); // listen for touch events
}

// the game loop
function update() {
    requestAnimationFrame(update); // the game loop will call itself 
    
    if (!gameStarted) return;

    if (gameOver) {
        document.getElementById("gameoverMessage").style.display = "block";
        document.getElementById("restartMessage").style.display = "block";

        // Update and display the best score after game over
        if (score > bestScore) {
            bestScore = score;
            saveBestScore(); // Save the new best score to localStorage
        }

        return;
    }
    
    context.clearRect(0, 0, board.width, board.height); 

    updateCharmander(context);
    if (checkIfCharmanderHitGround(charmander, boardHeight)) {
        gameOver = true;
    }

    // Generate pipes at regular intervals
    let currentTime = Date.now();
    if (currentTime - lastPipeTime > pipeGenerationInterval) {
        placePipes(boardHeight);
        lastPipeTime = currentTime;
    }
    
    updatePipes(context, velocityX); 
    if (checkPipeCollisions()) {
        gameOver = true;
    }

    updateScore(score);
    drawScore(context, score); // Draw the current score on the canvas
    drawBestScore(context, bestScore); // Draw the best score on the canvas
}

function moveCharmander(e) {
    e.preventDefault(); // prevent the default action (for mobile browsers)

    // Check if the game has started or is over
    if (!gameStarted && (e.code === "Space" || e.code === "ArrowUp" || e.type === "touchstart")) {
        gameStarted = true;
        document.getElementById("startGameMessage").style.display = "none";
        document.getElementById("playGameMessage").style.display = "none";
    } else if (gameOver && (e.code === "Space" || e.code === "ArrowUp" || e.type === "touchstart")) {
        resetGame();
    } else if (e.code === "Space" || e.code === "ArrowUp" || e.type === "touchstart") {
        flapCharmander();
        toggleCharmanderFrame();
    }
}


function resetGame() {
    resetCharmanderPos();
    pipeArray.length = 0;
    score = 0;
    gameOver = false;
    document.getElementById("gameoverMessage").style.display = "none"; // hide the game over message 
    document.getElementById("restartMessage").style.display = "none"; // hide the restart message
}

function updateScore() {
    for (let pipe of pipeArray) {
        if (!pipe.passed && charmander.x > pipe.x + pipe.width) {
            score += 0.5; // increaments score by 1 when top and bottom pipe are passed
            pipe.passed = true; // mark the pipe as passed
        }
    }
}

// Load the best score from localStorage if available
function loadBestScore() {
    const savedBestScore = localStorage.getItem("bestScore");
    if (savedBestScore !== null) {
        bestScore = parseFloat(savedBestScore); // convert it to a number
    }
}

// Save the best score to localStorage
function saveBestScore() {
    localStorage.setItem("bestScore", bestScore);
}