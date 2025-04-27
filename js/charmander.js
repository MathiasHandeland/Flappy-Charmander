export let charmanderImg1;
export let charmanderImg2;

export let isAltFrame = false; // used to alternate between two images for animation

export const charmander = {
    x : 360 / 8, // board width / 8
    y : 640 / 2, // board height / 2
    width : 36, 
    height : 40.5,
};

export let velocityY = 0; // charmander jump speed
export const gravity = 0.4; // gravity effect

export function loadCharmander(context) {
    charmanderImg1 = new Image();
    charmanderImg1.src = "./assets/char1.png";
    charmanderImg1.onload = function() {
        context.drawImage(charmanderImg1, charmander.x, charmander.y, charmander.width, charmander.height);
    }
    charmanderImg2 = new Image();
    charmanderImg2.src = "./assets/char2.png";
}

export function updateCharmander(context) {
    velocityY += gravity; // apply gravity
    charmander.y = Math.max(charmander.y + velocityY, 0); // move charmander and limit it to the top of the canvas
    const currentImg = isAltFrame ? charmanderImg2 : charmanderImg1; // alternate between images to create animation effect
    context.drawImage(currentImg, charmander.x, charmander.y, charmander.width, charmander.height); 
}

export function resetCharmanderPos() {
    charmander.y = 640 / 2;
    velocityY = 0; 
}

export function flapCharmander() {
    velocityY = -7 // move charmander up on canvas
}

export function checkIfCharmanderHitGround(charmander, boardHeight) {
    return charmander.y > boardHeight;
}

export function toggleCharmanderFrame() {
    isAltFrame = !isAltFrame;
}