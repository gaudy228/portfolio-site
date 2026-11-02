document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('follow');

    if (!section) {
        return;
    }

    const glow = section.querySelector('.follow-glow');
    const icons = Array.from(section.querySelectorAll('.follow-icon'));

    if (!glow || icons.length === 0) {
        return;
    }

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 767px)');

    const glowEase = 0.15;
    const settleThreshold = 0.1;
    const glowPosition = { x: 0, y: 0 };
    const iconPositions = icons.map(() => ({ x: 0, y: 0 }));
    const iconEase = icons.map((icon) => {
        const lag = Number(icon.dataset.lag);
        const safeLag = Number.isFinite(lag) ? Math.min(Math.max(lag, 0), 0.45) : 0.18;
        return Math.max(0.08, 1 - safeLag * 2);
    });

    let targetX = 0;
    let targetY = 0;
    let frameId = 0;

    const canAnimate = () => !reduceMotionQuery.matches && !mobileQuery.matches;

    const writePosition = (element, x, y) => {
        element.style.setProperty('--follow-x', `${x.toFixed(2)}px`);
        element.style.setProperty('--follow-y', `${y.toFixed(2)}px`);
    };

    const resetPositions = () => {
        glowPosition.x = 0;
        glowPosition.y = 0;
        writePosition(glow, 0, 0);

        icons.forEach((icon, index) => {
            iconPositions[index].x = 0;
            iconPositions[index].y = 0;
            writePosition(icon, 0, 0);
        });
    };

    const stopFrame = () => {
        if (frameId !== 0) {
            cancelAnimationFrame(frameId);
            frameId = 0;
        }
    };

    const isSettled = () => {
        const glowSettled = Math.abs(targetX - glowPosition.x) < settleThreshold
            && Math.abs(targetY - glowPosition.y) < settleThreshold;
        const iconsSettled = iconPositions.every((position) => (
            Math.abs(targetX - position.x) < settleThreshold
            && Math.abs(targetY - position.y) < settleThreshold
        ));

        return glowSettled && iconsSettled;
    };

    const tick = () => {
        frameId = 0;

        if (!canAnimate()) {
            resetPositions();
            return;
        }

        glowPosition.x += (targetX - glowPosition.x) * glowEase;
        glowPosition.y += (targetY - glowPosition.y) * glowEase;
        writePosition(glow, glowPosition.x, glowPosition.y);

        icons.forEach((icon, index) => {
            const position = iconPositions[index];
            const ease = iconEase[index];

            position.x += (targetX - position.x) * ease;
            position.y += (targetY - position.y) * ease;
            writePosition(icon, position.x, position.y);
        });

        if (!isSettled()) {
            frameId = requestAnimationFrame(tick);
        }
    };

    const requestTick = () => {
        if (frameId === 0) {
            frameId = requestAnimationFrame(tick);
        }
    };

    const handleMouseMove = (event) => {
        if (!canAnimate()) {
            return;
        }

        const rect = section.getBoundingClientRect();
        const inside = event.clientX >= rect.left
            && event.clientX <= rect.right
            && event.clientY >= rect.top
            && event.clientY <= rect.bottom;

        if (!inside) {
            return;
        }

        targetX = event.clientX - rect.left - rect.width / 2;
        targetY = event.clientY - rect.top - rect.height / 2;
        requestTick();
    };

    const handleModeChange = () => {
        if (!canAnimate()) {
            stopFrame();
            resetPositions();
        }
    };

    const addQueryListener = (query) => {
        if (typeof query.addEventListener === 'function') {
            query.addEventListener('change', handleModeChange);
        } else if (typeof query.addListener === 'function') {
            query.addListener(handleModeChange);
        }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    addQueryListener(reduceMotionQuery);
    addQueryListener(mobileQuery);

    resetPositions();
});
