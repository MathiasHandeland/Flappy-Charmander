// game board variables
let board;
let boardWidth = 360;
let boardHeight = 640;
let context; 

// player variables
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width :  birdWidth,
    height : birdHeight,
}

// pipe variables
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// game variables and physics
let velocityX = -2; // speed of the pipes moving left
let velocityY  = 0; // bird jump speed
let gravity = 0.4; // gravity effect on the bird
let gameOver = false; // game over flag
let score = 0; // score variable

window.onload = function() {
    // draw initial game board
    board = document.getElementById("gameCanvas");
    board.height = boardHeight;
    board.width = boardWidth;  
    context = board.getContext("2d");

    // draw flappy bird
    birdImg = new Image();
    birdImg.src = "./assets/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // draw pipes
    topPipeImg = new Image();
    topPipeImg.src = "./assets/toppipe.png";
    
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./assets/bottompipe.png";
    
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // place pipes every 1.5 seconds
    document.addEventListener("keydown", moveBird); // move the bird when the space bar is pressed
}

// game loop
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height); // clear the canvas

    // draw the bird over and over again for each frame
    velocityY += gravity; // apply gravity to the bird
    bird.y = Math.max(bird.y + velocityY, 0); // move the bird and limit it to the top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) { // check if the bird has hit the ground
        gameOver = true;
    }

    // draw the pipes 
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX; // move the pipes to the left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) { // check if the bird has passed the pipe
            score += 0.5; // increase the score
            pipe.passed = true; // set the passed flag to true
        }

        if (detectCollision(bird, pipe)) { // check for collision between the bird and the pipes
            gameOver = true;
        }
    }

    // clear pipes - checks all pipes that are off the screen and rempves them
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) { // remove pipes that are off the screen
        pipeArray.shift(); // remove the first pipe from the array
    }

    // draw the score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45); // draw the score at the top left of the canvas

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90); // draw game over text
    }
}

function placePipes() {
    
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2); // randomize the y position of the pipe
    let openingSpace = board.height / 4; // space between the top and bottom pipes

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false, // check if the bird has passed the pipe yet, false by default
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false, // check if the bird has passed the pipe yet
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        velocityY = -6; // jump = move the bird up when the space bar is pressed

        // reset game
        if (gameOver) {
            bird.y = birdY; // reset the bird's position
            pipeArray = []; // reset the pipes
            score = 0; // reset the score
            gameOver = false; // reset the game over flag
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}