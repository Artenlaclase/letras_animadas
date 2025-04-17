const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const phraseInput = document.getElementById('phraseInput');
const goButton = document.getElementById('goButton');

let letters = [];
let animationId = null;
let startTime = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createLetters(phrase) {
    letters = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const letterSpacing = 40;
    const startX = centerX - (phrase.length * letterSpacing) / 2;

    for (let i = 0; i < phrase.length; i++) {
        const char = phrase[i];
        if (char !== ' ') {
            const x = startX + i * letterSpacing;
            const y = centerY;
            letters.push(new Letter(char, x, y, i)); // Pasamos el índice
        }
    }
}

function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsedTime = currentTime - startTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo con efecto de estrellas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let allResting = true;
    
    for (const letter of letters) {
        letter.update(elapsedTime); // Pasamos el tiempo transcurrido
        letter.draw(ctx);
        if (letter.state !== "resting") {
            allResting = false;
        }
    }
    
    if (!allResting) {
        animationId = requestAnimationFrame(animate);
    }
}

function startAnimation() {
    const phrase = phraseInput.value.trim().toUpperCase();
    if (phrase) {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        startTime = 0; // Reiniciamos el contador
        createLetters(phrase);
        animationId = requestAnimationFrame(animate);
    }
}

// Event listeners (igual que antes)
window.addEventListener('resize', resizeCanvas);
goButton.addEventListener('click', startAnimation);
phraseInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startAnimation();
});

// Inicialización
resizeCanvas();