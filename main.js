"use strict";
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
let planeX;
let planeY = 100;
let boatX;
let boatY;
let boatSpeed = 5;
let score = 0;
let lives = 3;
let parachutists = [];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    boatY = canvas.height - 150;
    boatX = canvas.width / 2 - 50;
    planeX = canvas.width;
}
// Initial resize
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    // Update boat and plane positions on resize
    boatY = canvas.height - 150;
    planeX = canvas.width;
});
const background = new Image();
background.src = 'assets/background.png';
const boat = new Image();
boat.src = 'assets/boat.png';
const parachutistImg = new Image();
parachutistImg.src = 'assets/parachutist.png';
const plane = new Image();
plane.src = 'assets/plane.png';
const sea = new Image();
sea.src = 'assets/sea.png';
background.onload = () => {
    animate();
};
function animate() {
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        // Animate the plane
        context.drawImage(plane, planeX, planeY, 100, 50);
        planeX -= 2; // Reverse plane direction
        if (planeX < -100) {
            planeX = canvas.width;
        }
        // Randomly drop parachutists with reduced frequency
        if (Math.random() < 0.01) { // Slowed drop frequency
            parachutists.push({ x: planeX + 50, y: planeY + 20 });
        }
        // Animate parachutists
        for (let i = 0; i < parachutists.length; i++) {
            let p = parachutists[i];
            context.drawImage(parachutistImg, p.x, p.y, 50, 50);
            p.y += 1;
            // Check if parachutist is caught by the boat
            if (p.y + 50 >= boatY && p.x + 50 >= boatX && p.x <= boatX + 100) {
                score += 10;
                parachutists.splice(i, 1);
                i--;
                continue;
            }
            // Check if parachutist falls into the sea
            if (p.y + 50 >= canvas.height - 100) {
                lives -= 1;
                parachutists.splice(i, 1);
                i--;
                if (lives <= 0) {
                    alert('Game Over! Your final score is ' + score);
                    resetGame();
                    return;
                }
            }
        }
        // Draw the sea
        context.drawImage(sea, 0, canvas.height - 100, canvas.width, 100);
        // Update boat position
        updateBoatPosition();
        // Draw the boat
        context.drawImage(boat, boatX, boatY, 100, 50);
        // Draw score and lives
        context.fillStyle = 'black';
        context.font = '20px Arial';
        context.fillText('Score: ' + score, canvas.width - 150, 30);
        context.fillText('Lives: ' + lives, canvas.width - 150, 60);
        requestAnimationFrame(animate);
    }
}
function resetGame() {
    score = 0;
    lives = 3;
    parachutists = [];
    planeX = canvas.width;
    animate();
}
// Keyboard controls
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        boatX -= boatSpeed;
    }
    else if (event.key === 'ArrowRight') {
        boatX += boatSpeed;
    }
});
// Mouse controls
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    boatX = event.clientX - rect.left - 50;
});
// Prevent the boat from going out of bounds
function updateBoatPosition() {
    if (boatX < 0) {
        boatX = 0;
    }
    else if (boatX + 100 > canvas.width) {
        boatX = canvas.width - 100;
    }
    if (boatY < 0) {
        boatY = 0;
    }
    else if (boatY + 50 > canvas.height) {
        boatY = canvas.height - 50;
    }
}
