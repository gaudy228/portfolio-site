document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.timeline-item');

    const details = [
        'Сформулировал идею и зафиксировал требования в ТЗ.',
        'Разбил задачу на конкретные пункты в бэклоге TZ.md.',
        'Создал репозиторий, добавил AGENTS.md и базовые файлы.',
        'Написал HTML-разметку и CSS-стили для тёмной темы.',
        'Реализовал интерактивное раскрытие шагов в JS.',
        'Протестировал на мобильном, поправил отступы и размеры.',
        'Опубликовал на GitHub Pages, проверил работоспособность.',
    ];

    items.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-expanded', 'false');

        const detail = document.createElement('p');
        detail.className = 'timeline-detail';
        detail.textContent = details[index] || 'Подробности по шагу.';
        detail.hidden = true;
        item.appendChild(detail);

        const toggle = () => {
            const isExpanded = item.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                item.setAttribute('aria-expanded', 'false');
                detail.hidden = true;
            } else {
                item.setAttribute('aria-expanded', 'true');
                detail.hidden = false;
            }
        };

        item.addEventListener('click', toggle);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

    const magneticButtons = document.querySelectorAll('.hero-btn, .game-btn-primary');
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resetMagnet = (button) => {
        button.style.removeProperty('--magnet-x');
        button.style.removeProperty('--magnet-y');
    };

    magneticButtons.forEach((button) => {
        button.addEventListener('pointermove', (event) => {
            if (!finePointerQuery.matches || reduceMotionQuery.matches) {
                return;
            }

            const rect = button.getBoundingClientRect();
            const offsetX = event.clientX - rect.left - rect.width / 2;
            const offsetY = event.clientY - rect.top - rect.height / 2;

            button.style.setProperty('--magnet-x', `${(offsetX * 0.14).toFixed(2)}px`);
            button.style.setProperty('--magnet-y', `${(offsetY * 0.2).toFixed(2)}px`);
        });

        button.addEventListener('pointerleave', () => resetMagnet(button));
        button.addEventListener('pointercancel', () => resetMagnet(button));
        button.addEventListener('blur', () => resetMagnet(button));
    });

    if (typeof reduceMotionQuery.addEventListener === 'function') {
        reduceMotionQuery.addEventListener('change', () => {
            magneticButtons.forEach(resetMagnet);
        });
    }

    const revealElements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
    });

    revealElements.forEach((element) => revealObserver.observe(element));
});
