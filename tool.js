document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tz-form');

    if (!form) {
        return;
    }

    const whatInput = document.getElementById('tz-what');
    const featureInput = document.getElementById('tz-feature');
    const resultInput = document.getElementById('tz-result');
    const termSelect = document.getElementById('tz-term');
    const preview = document.getElementById('tool-preview');
    const copyButton = document.getElementById('tool-copy');
    const downloadButton = document.getElementById('tool-download');
    const message = document.getElementById('tool-message');

    const copyDefaultLabel = copyButton.textContent.trim();
    const requiredInputs = [whatInput, featureInput, resultInput];
    const allInputs = [whatInput, featureInput, resultInput, termSelect];
    let copyResetTimer = null;

    const getValues = () => ({
        what: whatInput.value.trim(),
        feature: featureInput.value.trim(),
        result: resultInput.value.trim(),
        term: termSelect.value,
    });

    const isComplete = (values) => Boolean(values.what && values.feature && values.result && values.term);

    const buildFormula = (values) => `Хочу ${values.what} с ${values.feature} и ${values.result} за ${values.term}`;

    const buildMarkdown = (values) => [
        '# TZ',
        buildFormula(values),
        '',
        '## Бэклог',
        '- [ ] Создать репозиторий и AGENTS.md',
        '- [ ] Спроектировать структуру проекта',
        `- [ ] Реализовать фишку: ${values.feature}`,
        `- [ ] Довести до измеримого результата: ${values.result}`,
        '- [ ] Записать видео 30–60 секунд',
        '- [ ] Написать рефлексию',
    ].join('\n');

    const clearValidation = () => {
        allInputs.forEach((input) => input.removeAttribute('aria-invalid'));
        message.hidden = true;
        message.textContent = '';
    };

    const showIncompleteHint = () => {
        const emptyFields = requiredInputs.filter((input) => !input.value.trim());

        requiredInputs.forEach((input) => {
            if (!input.value.trim()) {
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.removeAttribute('aria-invalid');
            }
        });

        message.textContent = 'Заполни выделенные поля — и ТЗ будет готово.';
        message.hidden = false;

        if (emptyFields.length > 0) {
            emptyFields[0].focus();
        }
    };

    const updatePreview = () => {
        const values = getValues();
        const complete = isComplete(values);

        requiredInputs.forEach((input) => {
            if (input.value.trim()) {
                input.removeAttribute('aria-invalid');
            }
        });

        preview.textContent = complete
            ? buildFormula(values)
            : 'заполни все поля, чтобы увидеть ТЗ';
        preview.classList.toggle('is-empty', !complete);

        if (complete) {
            message.hidden = true;
            message.textContent = '';
        }
    };

    const fallbackCopy = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        let copied = false;

        try {
            copied = document.execCommand('copy');
        } catch (error) {
            copied = false;
        }

        textarea.remove();
        return copied;
    };

    const copyText = async (text) => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                return fallbackCopy(text);
            }
        }

        return fallbackCopy(text);
    };

    const showCopiedState = () => {
        if (copyResetTimer !== null) {
            window.clearTimeout(copyResetTimer);
        }

        copyButton.textContent = 'Скопировано ✓';
        copyButton.classList.add('is-copied');
        copyResetTimer = window.setTimeout(() => {
            copyButton.textContent = copyDefaultLabel;
            copyButton.classList.remove('is-copied');
            copyResetTimer = null;
        }, 2000);
    };

    const downloadTz = (markdown) => {
        const blob = new Blob([markdown], {
            type: 'text/markdown;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'TZ.md';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    allInputs.forEach((input) => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
    });

    copyButton.addEventListener('click', async () => {
        const values = getValues();

        if (!isComplete(values)) {
            showIncompleteHint();
            return;
        }

        clearValidation();
        const copied = await copyText(buildMarkdown(values));

        if (copied) {
            showCopiedState();
        } else {
            message.textContent = 'Не удалось скопировать. Выдели текст и скопируй вручную.';
            message.hidden = false;
        }
    });

    downloadButton.addEventListener('click', () => {
        const values = getValues();

        if (!isComplete(values)) {
            showIncompleteHint();
            return;
        }

        clearValidation();
        downloadTz(buildMarkdown(values));
    });

    updatePreview();
});
