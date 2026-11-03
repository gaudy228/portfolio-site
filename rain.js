(() => {
    'use strict';

    const canvas = document.getElementById('matrix-rain');
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
    const fontSize = 16;
    const frameInterval = 33;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let columns = 0;
    let drops = [];
    let rafId = 0;
    let resizeTimer = 0;
    let lastFrame = 0;
    let running = false;

    function setup() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px ui-monospace, 'Cascadia Code', 'Source Code Pro', Consolas, 'Courier New', monospace`;
        ctx.textBaseline = 'top';
        columns = Math.ceil(window.innerWidth / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -50);
        lastFrame = 0;
    }

    function draw(now) {
        if (!running) {
            return;
        }

        rafId = window.requestAnimationFrame(draw);

        if (now - lastFrame < frameInterval) {
            return;
        }

        lastFrame = now;
        ctx.fillStyle = 'rgba(0, 6, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < columns; i += 1) {
            const char = chars.charAt(Math.floor(Math.random() * chars.length));
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            ctx.fillStyle = Math.random() > 0.985 ? '#b8ffca' : '#00ff41';
            ctx.fillText(char, x, y);

            if (y > window.innerHeight && Math.random() > 0.975) {
                drops[i] = 0;
            } else {
                drops[i] += 1;
            }
        }
    }

    function start() {
        if (running || motionQuery.matches) {
            return;
        }

        running = true;
        setup();
        rafId = window.requestAnimationFrame(draw);
    }

    function stop() {
        running = false;
        window.cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function handleResize() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            if (running) {
                setup();
            }
        }, 200);
    }

    function handleMotionChange() {
        if (motionQuery.matches) {
            stop();
        } else {
            start();
        }
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    }

    motionQuery.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    start();
})();
