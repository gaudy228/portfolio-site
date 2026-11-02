document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('game-board');

    if (!boardElement) {
        return;
    }

    const cells = Array.from(boardElement.querySelectorAll('.game-cell'));
    const statusElement = document.getElementById('game-status');
    const restartButton = document.getElementById('game-restart');
    const resetScoreButton = document.getElementById('game-reset-score');
    const difficultyButtons = Array.from(document.querySelectorAll('.difficulty-btn'));
    const scorePlayerElement = document.getElementById('score-player');
    const scoreBotElement = document.getElementById('score-bot');
    const scoreDrawsElement = document.getElementById('score-draws');

    const WIN_LINES = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const PLAYER_MARK = 'X';
    const BOT_MARK = 'O';
    const BOT_DELAY = 380;

    const scores = {
        player: 0,
        bot: 0,
        draws: 0,
    };

    let board = Array(9).fill('');
    let difficulty = 'hard';
    let isBotThinking = false;
    let roundOver = false;
    let botTimer = null;

    const setStatus = (text) => {
        statusElement.textContent = text;
    };

    const updateScore = () => {
        scorePlayerElement.textContent = String(scores.player);
        scoreBotElement.textContent = String(scores.bot);
        scoreDrawsElement.textContent = String(scores.draws);
    };

    const cellLabel = (index) => {
        const position = `Клетка ${index + 1}`;
        const mark = board[index];

        if (!mark) {
            return `${position}, пусто`;
        }

        return `${position}, ${mark === PLAYER_MARK ? 'крестик' : 'нолик'}`;
    };

    const syncButtons = () => {
        cells.forEach((cell, index) => {
            cell.disabled = isBotThinking || roundOver || board[index] !== '';
            cell.setAttribute('aria-label', cellLabel(index));
        });
    };

    const renderMove = (index, mark) => {
        const cell = cells[index];
        board[index] = mark;
        cell.classList.add(mark === PLAYER_MARK ? 'is-x' : 'is-o');

        const markElement = document.createElement('span');
        markElement.className = 'game-mark';
        markElement.setAttribute('aria-hidden', 'true');
        markElement.textContent = mark;

        cell.replaceChildren(markElement);
        syncButtons();
    };

    const getWinner = (currentBoard) => {
        for (const line of WIN_LINES) {
            const [a, b, c] = line;

            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return { mark: currentBoard[a], line };
            }
        }

        return null;
    };

    const isBoardFull = (currentBoard) => currentBoard.every((value) => value !== '');

    const getEmptyCells = (currentBoard) => currentBoard.reduce((empty, value, index) => {
        if (value === '') {
            empty.push(index);
        }

        return empty;
    }, []);

    const evaluateBoard = (currentBoard) => {
        const winner = getWinner(currentBoard);

        if (winner) {
            return winner.mark;
        }

        if (isBoardFull(currentBoard)) {
            return 'draw';
        }

        return null;
    };

    const minimax = (currentBoard, isMaximizing, depth) => {
        const result = evaluateBoard(currentBoard);

        if (result === BOT_MARK) {
            return 10 - depth;
        }

        if (result === PLAYER_MARK) {
            return depth - 10;
        }

        if (result === 'draw') {
            return 0;
        }

        const emptyCells = getEmptyCells(currentBoard);

        if (isMaximizing) {
            let bestScore = -Infinity;

            for (const index of emptyCells) {
                currentBoard[index] = BOT_MARK;
                bestScore = Math.max(bestScore, minimax(currentBoard, false, depth + 1));
                currentBoard[index] = '';
            }

            return bestScore;
        }

        let bestScore = Infinity;

        for (const index of emptyCells) {
            currentBoard[index] = PLAYER_MARK;
            bestScore = Math.min(bestScore, minimax(currentBoard, true, depth + 1));
            currentBoard[index] = '';
        }

        return bestScore;
    };

    const shuffle = (items) => {
        const result = items.slice();

        for (let i = result.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    };

    const chooseBotMove = () => {
        const emptyCells = getEmptyCells(board);

        if (emptyCells.length === 0) {
            return -1;
        }

        if (difficulty === 'easy') {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        let bestScore = -Infinity;
        let bestMoves = [];

        for (const index of shuffle(emptyCells)) {
            board[index] = BOT_MARK;
            const score = minimax(board, false, 0);
            board[index] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMoves = [index];
            } else if (score === bestScore) {
                bestMoves.push(index);
            }
        }

        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    };

    const finishRound = (result) => {
        roundOver = true;
        syncButtons();

        if (result && result.mark === PLAYER_MARK) {
            scores.player += 1;
            setStatus('Ты выиграл');
        } else if (result && result.mark === BOT_MARK) {
            scores.bot += 1;
            setStatus('Бот выиграл');
        } else {
            scores.draws += 1;
            setStatus('Ничья');
        }

        if (result) {
            result.line.forEach((index) => cells[index].classList.add('is-win'));
        }

        updateScore();
    };

    const checkRoundEnd = () => {
        const winner = getWinner(board);

        if (winner) {
            finishRound(winner);
            return true;
        }

        if (isBoardFull(board)) {
            finishRound(null);
            return true;
        }

        return false;
    };

    const handleCellClick = (event) => {
        const cell = event.currentTarget;
        const index = Number(cell.dataset.cell);

        if (isBotThinking || roundOver || board[index] !== '') {
            return;
        }

        renderMove(index, PLAYER_MARK);

        if (checkRoundEnd()) {
            return;
        }

        isBotThinking = true;
        setStatus('Ход бота');
        syncButtons();

        botTimer = window.setTimeout(() => {
            botTimer = null;
            const botMove = chooseBotMove();

            if (botMove !== -1) {
                renderMove(botMove, BOT_MARK);
            }

            isBotThinking = false;
            syncButtons();

            if (!checkRoundEnd()) {
                setStatus('Твой ход');
            }
        }, BOT_DELAY);
    };

    const resetBoard = () => {
        if (botTimer !== null) {
            window.clearTimeout(botTimer);
            botTimer = null;
        }

        board = Array(9).fill('');
        isBotThinking = false;
        roundOver = false;

        cells.forEach((cell, index) => {
            cell.replaceChildren();
            cell.classList.remove('is-x', 'is-o', 'is-win');
            cell.disabled = false;
            cell.setAttribute('aria-label', `Клетка ${index + 1}, пусто`);
        });

        setStatus('Твой ход');
    };

    const selectDifficulty = (nextDifficulty) => {
        difficulty = nextDifficulty;

        difficultyButtons.forEach((button) => {
            button.setAttribute('aria-pressed', String(button.dataset.difficulty === difficulty));
        });
    };

    cells.forEach((cell) => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', resetBoard);

    resetScoreButton.addEventListener('click', () => {
        scores.player = 0;
        scores.bot = 0;
        scores.draws = 0;
        updateScore();
    });

    difficultyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            selectDifficulty(button.dataset.difficulty);
        });
    });

    updateScore();
    syncButtons();
});
