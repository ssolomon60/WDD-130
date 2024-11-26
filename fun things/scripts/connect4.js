const ROWS = 6;
const COLS = 7;
let currentPlayer = 'red';
let gameActive = true;
const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// Create the game board dynamically
const gameBoard = document.getElementById('game-board');
for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        gameBoard.appendChild(cell);
    }
}

// Handle cell clicks
gameBoard.addEventListener('click', (e) => {
    if (!gameActive || !e.target.classList.contains('cell')) return;

    const col = parseInt(e.target.dataset.col);
    const row = findAvailableRow(col);

    if (row !== -1) {
        board[row][col] = currentPlayer;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(currentPlayer);

        if (checkWin(row, col)) {
            document.getElementById('status').textContent = `Player ${currentPlayer === 'red' ? 1 : 2} Wins!`;
            gameActive = false;
        } else if (board.flat().every(cell => cell !== null)) {
            document.getElementById('status').textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            document.getElementById('status').textContent = `Player ${currentPlayer === 'red' ? 1 : 2}'s Turn (${currentPlayer === 'red' ? 'Red' : 'Yellow'})`;
        }
    }
});

// Restart the game
document.getElementById('restart').addEventListener('click', () => {
    board.forEach(row => row.fill(null));
    currentPlayer = 'red';
    gameActive = true;
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('red', 'yellow'));
    document.getElementById('status').textContent = "Player 1's Turn (Red)";
});

// Find the lowest available row in a column
function findAvailableRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) return row;
    }
    return -1;
}

// Check for a win
function checkWin(row, col) {
    return (
        checkDirection(row, col, 0, 1) || // Horizontal
        checkDirection(row, col, 1, 0) || // Vertical
        checkDirection(row, col, 1, 1) || // Diagonal down-right
        checkDirection(row, col, 1, -1)   // Diagonal down-left
    );
}

// Check a specific direction for a win
function checkDirection(row, col, rowDir, colDir) {
    let count = 1;

    for (let step = 1; step < 4; step++) {
        const r = row + step * rowDir;
        const c = col + step * colDir;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }

    for (let step = 1; step < 4; step++) {
        const r = row - step * rowDir;
        const c = col - step * colDir;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }

    return count >= 4;
}
