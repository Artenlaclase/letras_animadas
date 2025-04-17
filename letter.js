class Letter {
    constructor(char, x, y, index) {
        this.char = char;
        this.originalX = x;
        this.originalY = y;
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + 50;
        this.targetY = y;
        this.size = 30;
        this.speed = Math.random() * 2 + 1;
        this.angle = 0;
        this.amplitude = Math.random() * 100 + 50;
        this.hue = Math.random() * 360;
        this.sparkles = [];
        this.state = "falling"; // "falling", "exploding", "resting"
        this.delay = index * 300; // Retraso basado en posición (ms)
        this.hasExploded = false;
    }

    update(time) {
        if (this.state === "falling" && time > this.delay) {
            const dx = this.originalX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 5 && !this.hasExploded) {
                this.state = "exploding";
                this.createExplosion();
                this.hasExploded = true;
            } else {
                this.x += dx * 0.05;
                this.y += dy * 0.05;
                this.angle += 0.1;
                this.y += Math.sin(this.angle) * 0.5;
            }
        } else if (this.state === "exploding") {
            for (let i = 0; i < this.sparkles.length; i++) {
                const sparkle = this.sparkles[i];
                sparkle.x += sparkle.vx;
                sparkle.y += sparkle.vy;
                sparkle.vy += 0.05; // gravedad
                sparkle.alpha -= 0.01;
            }
            this.sparkles = this.sparkles.filter(s => s.alpha > 0);

            if (this.sparkles.length === 0) {
                this.state = "resting";
            }
        }
    }

    createExplosion() {
        for (let i = 0; i < 50; i++) {
            this.sparkles.push({
                x: this.x,
                y: this.y,
                vx: Math.random() * 6 - 3,
                vy: Math.random() * 6 - 3,
                size: Math.random() * 3 + 1,
                hue: this.hue,
                alpha: 1
            });
        }
    }

    draw(ctx) {
        if (this.state === "falling") {
            ctx.save();
            ctx.font = `${this.size}px Arial`;
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fillText(this.char, this.x, this.y);
            ctx.restore();
        } else if (this.state === "exploding") {
            for (const sparkle of this.sparkles) {
                ctx.save();
                ctx.globalAlpha = sparkle.alpha;
                ctx.fillStyle = `hsl(${sparkle.hue}, 100%, 50%)`;
                ctx.beginPath();
                ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        } else if (this.state === "resting") {
            ctx.save();
            ctx.font = `${this.size}px Arial`;
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fillText(this.char, this.originalX, this.originalY);
            ctx.restore();
        }
    }
}