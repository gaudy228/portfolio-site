document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.timeline-item');

    items.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-expanded', 'false');

        const detail = document.createElement('p');
        detail.className = 'timeline-detail';
        detail.textContent = 'Подробнее: шаг реализован по плану из бэклога TZ.md.';
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
});