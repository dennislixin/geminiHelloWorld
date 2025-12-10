const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Game state
let gameStarted = false;
let isPaused = false;
let gameOver = false;
let winner = null;
const winningScore = 10;
let difficulty = 'MEDIUM'; // EASY, MEDIUM, HARD

// For testing
window.game = {
    get gameStarted() { return gameStarted; },
    get gameOver() { return gameOver; },
    get winner() { return winner; },
    get difficulty() { return difficulty; }
};

// Game objects
const paddleWidth = 10, paddleHeight = 100;
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#0ff', // Cyan
    score: 0,
    speed: 8
};

const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#f0f', // Magenta
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: '#ff0' // Yellow
};

// Sound System (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'wall') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'score') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    }
}

// Particle System
const particles = [];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 2;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5
        };
        this.alpha = 1;
    }

    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
    }
}

function createParticles(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Power Up System
const powerUps = [];
const powerUpTypes = ['BIG_PADDLE', 'FAST_BALL'];

class PowerUp {
    constructor() {
        this.x = canvas.width / 4 + Math.random() * (canvas.width / 2);
        this.y = Math.random() * (canvas.height - 40);
        this.width = 30;
        this.height = 30;
        this.type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        this.color = this.type === 'BIG_PADDLE' ? '#0f0' : '#f00';
    }

    draw() {
        drawRect(this.x, this.y, this.width, this.height, this.color);
        // Inner detail
        context.fillStyle = '#000';
        context.font = '20px Arial';
        context.fillText(this.type === 'BIG_PADDLE' ? 'P' : 'F', this.x + 15, this.y + 22);
    }
}

function spawnPowerUp() {
    if (powerUps.length < 1 && gameStarted && !isPaused && !gameOver) {
        powerUps.push(new PowerUp());
    }
}

// Spawn powerup every 15 seconds
setInterval(spawnPowerUp, 15000);

// Check powerup collision
function checkPowerUpCollision() {
    powerUps.forEach((p, index) => {
        // Simple AABB collision with ball
        if (ball.x < p.x + p.width &&
            ball.x + ball.radius > p.x &&
            ball.y < p.y + p.height &&
            ball.y + ball.radius > p.y) {

            // Apply Effect
            if (p.type === 'BIG_PADDLE') {
                // Determine who hit it (based on ball direction/position)
                let beneficiary = ball.velocityX > 0 ? player : computer;

                beneficiary.height = 150;
                setTimeout(() => { beneficiary.height = 100; }, 10000); // Reset after 10s
            } else if (p.type === 'FAST_BALL') {
                ball.speed += 5;
                // No timeout, resets on score
            }

            playSound('score'); // Reuse sweet sound
            createParticles(p.x + p.width / 2, p.y + p.height / 2, p.color);
            powerUps.splice(index, 1);
        }
    });
}

// Keyboard state
const keys = {
    ArrowUp: false,
    ArrowDown: false
};

// Draw rect
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw circle
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw text
function drawText(text, x, y, color, font = '75px Courier New') {
    context.fillStyle = color;
    context.font = font;
    context.textAlign = 'center'; // Center text alignment help
    context.shadowBlur = 10;
    context.shadowColor = color;
    context.fillText(text, x, y);
    context.shadowBlur = 0; // Reset shadow
}

// Draw Net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#555');
    }
}

// Render the game
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'BLACK');

    if (!gameStarted) {
        drawText('Press Space to Start', canvas.width / 2, canvas.height / 2 - 50, '#fff', '50px Courier New');
        drawText('Select Difficulty:', canvas.width / 2, canvas.height / 2 + 20, '#fff', '30px Courier New');

        let easyColor = difficulty === 'EASY' ? '#0f0' : '#555';
        let medColor = difficulty === 'MEDIUM' ? '#ff0' : '#555';
        let hardColor = difficulty === 'HARD' ? '#f00' : '#555';

        drawText('1: Easy', canvas.width / 2 - 150, canvas.height / 2 + 70, easyColor, '25px Courier New');
        drawText('2: Medium', canvas.width / 2, canvas.height / 2 + 70, medColor, '25px Courier New');
        drawText('3: Hard', canvas.width / 2 + 150, canvas.height / 2 + 70, hardColor, '25px Courier New');

        drawText('Player: Arrow Keys / Touch', canvas.width / 2, canvas.height / 2 + 130, '#0ff', '20px Courier New');
        return;
    }

    if (gameOver) {
        drawText(winner + ' Wins!', canvas.width / 2, canvas.height / 2, '#fff', '60px Courier New');
        drawText('Click to Restart', canvas.width / 2, canvas.height / 2 + 70, '#fff', '30px Courier New');
        return;
    }

    // Draw Net
    drawNet();

    // Draw the scores
    // Draw the scores
    drawText(player.score, canvas.width / 4, canvas.height / 5, '#0ff');
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, '#f0f');

    // Draw the paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

    // Draw particles
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });

    // Draw Powerups
    powerUps.forEach(p => p.draw());

    // Draw the ball
    if (!isPaused) {
        drawCircle(ball.x, ball.y, ball.radius, ball.color);
    }
}

// Keyboard event listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = true;
    if (e.key === 'ArrowDown') keys.ArrowDown = true;

    if (!gameStarted) {
        if (e.key === '1') { difficulty = 'EASY'; render(); }
        if (e.key === '2') { difficulty = 'MEDIUM'; render(); }
        if (e.key === '3') { difficulty = 'HARD'; render(); }

        if (e.key === ' ' || e.code === 'Space') {
            gameStarted = true;
            gameLoop();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
    }
});

window.addEventListener('mousedown', (e) => {
    if (gameOver) {
        resetGame();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
});

// Mobile Touch Support
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling
    if (gameOver) {
        resetGame();
    } else if (!gameStarted) {
        gameStarted = true;
        gameLoop();
        // Initialize audio on first touch
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchY = touch.clientY - rect.top;

    // Move player paddle to touch position (centered)
    player.y = touchY - player.height / 2;

    // Constrain to canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}, { passive: false });


// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Reset the ball
function resetBall() {
    isPaused = true;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7; // Reset speed on score

    setTimeout(() => {
        isPaused = false;
    }, 1000); // 1 second pause
}

function resetGame() {
    player.score = 0;
    computer.score = 0;
    player.y = canvas.height / 2 - paddleHeight / 2;
    computer.y = canvas.height / 2 - paddleHeight / 2;
    ball.speed = 7;
    ball.velocityX = 5;
    ball.velocityY = 5;
    gameOver = false;
    gameStarted = true;
    resetBall();
    gameLoop();
}

// Update logic
function update() {
    if (isPaused || gameOver) return;

    // Move player paddle
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }


    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    checkPowerUpCollision();

    // Computer AI to control its paddle
    let computerLevel = 0.1;
    if (difficulty === 'EASY') computerLevel = 0.05;
    if (difficulty === 'MEDIUM') computerLevel = 0.1;
    if (difficulty === 'HARD') computerLevel = 0.15; // Faster reaction

    // Add some random error to AI based on difficulty
    let error = 0;
    if (difficulty === 'EASY' && Math.random() < 0.02) error = 50 * (Math.random() - 0.5);

    computer.y += (ball.y + error - (computer.y + computer.height / 2)) * computerLevel;


    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
        playSound('wall');
    }

    let playerOrComputer = (ball.x < canvas.width / 2) ? player : computer;
    if (collision(ball, playerOrComputer)) {
        // Create particles on hit
        createParticles(ball.x, ball.y, ball.color);
        playSound('hit');

        let collidePoint = (ball.y - (playerOrComputer.y + playerOrComputer.height / 2));
        collidePoint = collidePoint / (playerOrComputer.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

    }

    if (ball.x - ball.radius < 0) {
        computer.score++;
        if (computer.score >= winningScore) {
            gameOver = true;
            winner = 'Computer';
        } else {
            playSound('score');
            resetBall();
        }
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        if (player.score >= winningScore) {
            gameOver = true;
            winner = 'Player';
        } else {
            playSound('score');
            resetBall();
        }
    }
}

// Game loop
function gameLoop() {
    update();
    render();
    if (gameStarted) {
        requestAnimationFrame(gameLoop);
    }
}

// Increase ball speed every 20 seconds
setInterval(() => {
    if (gameStarted && !isPaused) {
        ball.speed += 0.5;
    }
}, 20000);

// Initial render
render();
