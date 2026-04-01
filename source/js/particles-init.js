// ==========================================
// 动态感知波形矩阵 (Acoustic/LiDAR Grid)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth < 768) return; // 移动端保护

    const canvas = document.createElement('canvas');
    canvas.id = 'gravity-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-999';
    canvas.style.pointerEvents = 'none';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 智能配色：适配 Fluid 的亮暗模式
    let particleColor = 'rgba(3, 102, 214, 0.25)'; // 白天科技蓝
    function updateTheme() {
        const theme = document.documentElement.getAttribute('data-user-color-scheme');
        particleColor = theme === 'dark' ? 'rgba(88, 166, 255, 0.25)' : 'rgba(3, 102, 214, 0.25)';
    }
    updateTheme();
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => { if (m.attributeName === 'data-user-color-scheme') updateTheme(); });
    });
    observer.observe(document.documentElement, { attributes: true });

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        time += 0.012; // 波形流动的速度

        const spacing = 45; // 矩阵点的间距
        const rows = Math.floor(height / spacing) + 1;
        const cols = Math.floor(width / spacing) + 1;

        ctx.fillStyle = particleColor;

        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                let x = i * spacing;
                let y = j * spacing;

                // 核心算法：融合正弦声波与纵向呼吸感
                let wave = Math.sin(x * 0.005 + time) * Math.cos(y * 0.005 + time) * 15;

                // 交互层：模拟雷达探测，鼠标靠近时矩阵产生轻微排斥与高亮
                let dx = x - mouse.x;
                let dy = y - mouse.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                let sensorEffect = 0;
                let size = 1.2; // 默认极小的像素点

                if (dist < 180) {
                    sensorEffect = (180 - dist) * 0.08;
                    size = 2.5; // 探测区域内点放大
                }

                let finalY = y + wave - sensorEffect;

                ctx.beginPath();
                ctx.arc(x, finalY, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
});