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
});