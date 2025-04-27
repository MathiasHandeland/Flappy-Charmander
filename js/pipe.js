import { charmander } from './charmander.js';
import { detectCollision } from './utils.js';

export let pipeArray = [];

const pipeWidth = 64;
const pipeHeight = 512; // must be smaller than board height
const pipeX = 360; // the initial x position of the pipe: starting from the right side of the canvas
const pipeY = 0; // the initial y position of the pipe - top of the canvas

let topPipeImg;
let bottomPipeImg;

export function loadPipes() {
    topPipeImg = new Image();
    topPipeImg.src = "./assets/toppipe.png";
    
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./assets/bottompipe.png";
}

export function placePipes(boardHeight) {
    const randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2); // randomize the y position of the pipe
    const openingSpace = boardHeight / 4; // space between the top and bottom pipes

    const topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false, // check if charmander has passed the pipe yet, false by default
    };
    
    const bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false, // check if charmander has passed the pipe yet
    };
    // push the pipes to the array which will be used to draw them sequentially
    pipeArray.push(topPipe); 
    pipeArray.push(bottomPipe);
}

export function updatePipes(context, velocityX) {
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX; // move the pipes to the left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }
    // remove off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }
}

export function checkPipeCollisions() {
    for (let pipe of pipeArray) {
        if (detectCollision(charmander, pipe)) {
            return true;
        }
    }
    return false;
}