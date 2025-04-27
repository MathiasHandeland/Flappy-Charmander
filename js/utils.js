export function detectCollision(a, b) {
    const horizontalOverlap = a.x < b.x + b.width && a.x + a.width > b.x;
    const verticalOverlap = a.y < b.y + b.height && a.y + a.height > b.y;
    // if there is both a horizontal and vertical overlap, then there is a collision
    return horizontalOverlap && verticalOverlap;
  }

export function drawScore(context, score) {
    context.fillStyle = "white";
    context.font = "35px 'Luckiest Guy'";
    context.fillText(score, 5, 45);
}

export function drawBestScore(context, bestScore) {
    context.fillStyle = "white";
    context.font = "35px 'Luckiest Guy'";
    context.fillText("Best: " + bestScore, 225, 45);
}