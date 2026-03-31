// ==========================================
// 极简深海流体引擎 (Ultra-Slow Fluid)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'gravity-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zindex = '-999';
    canvas.style.pointerEvents = 'none'; 
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let width, height;
    const NUM_PARTICLES = 100; // 稍微减少数量，增加留白感
    const REPULSE_RADIUS = 150; 
    let particles = [];
    let mouse = { x: -1000, y: -1000, active: false };
    
    let particleColor = '#0284c7';
    let lineColor = 'rgba(2, 132, 199, 0.1)'; 

    function updateTheme() {
        const theme = document.documentElement.getAttribute('data-user-color-scheme');
        if (theme === 'dark') {
            particleColor = '#00ffff';
            lineColor = 'rgba(0, 255, 255, 0.1)';
        } else {
            particleColor = '#0284c7';
            lineColor = 'rgba(2, 132, 199, 0.1)';
        }
    }
    updateTheme(); 

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-user-color-scheme') updateTheme();
        });
    });
    observer.observe(document.documentElement, { attributes: true });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // 【核心改动】大幅降低初始速度，营造静谧感
            this.vx = (Math.random() - 0.5) * 0.4; 
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 1.5 + 0.5;
            this.bounceCount = 0; 
        }
        update() {
            if (mouse.active) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < REPULSE_RADIUS) {
                    let force = (REPULSE_RADIUS - dist) / REPULSE_RADIUS;
                    // 降低排斥力度，让拨开的动作更轻柔
                    this.vx += (dx / dist) * force * 0.2;
                    this.vy += (dy / dist) * force * 0.2;
                }
            }

            // 【核心改动】增加恒定的环境阻力，像在浓稠液体中运动
            this.vx *= 0.98;
            this.vy *= 0.98;

            this.x += this.vx;
            this.y += this.vy;

            // 撞墙弹回并大幅损耗动能，防止加速乱飞
            if (this.x + this.size > width || this.x - this.size < 0) {
                this.vx *= -0.5; 
                this.bounceCount = 5; 
            }
            if (this.y + this.size > height || this.y - this.size < 0) {
                this.vy *= -0.5; 
                this.bounceCount = 5;
            }
            if (this.bounceCount > 0) this.bounceCount--;
            
            // 【核心改动】极其严格的最高速限制，确保永远不“快”
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 1.0) {
                this.vx *= 0.9;
                this.vy *= 0.9;
            }
            // 保持微弱的最低动力，防止死掉不动
            if (speed < 0.1) {
                this.vx += (Math.random() - 0.5) * 0.05;
                this.vy += (Math.random() - 0.5) * 0.05;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.bounceCount > 0 ? '#fff' : particleColor;
            ctx.fill();
        }
    }

    for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                // 只有距离极近才连线，减少视觉上的杂乱感
                if (dist < 70) { 
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.3;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
});