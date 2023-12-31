'use strict'

function calculateFlagsCount() {
    switch (gLevel) {
        case 16:
            return 2;
        case 64:
            return 14;
        case 144:
            return 32;
        default:
            return 2;
    }
}

function updateFlagsDisplay() {
    var elFlagsDisplay = document.getElementById('flagsDisplay')
    if (elFlagsDisplay) {
        elFlagsDisplay.innerText = gFlagsCount
    }
}

function toggleFlag(cell, row, col) {
    if (gFlagsCount > 0 && !cell.isShown) {
        cell.isMarked = !cell.isMarked

        gBoard[row][col].isMarked = cell.isMarked
        gFlagsCount += cell.isMarked ? -1 : 1
        updateFlagsDisplay()
        console.log('Toggling flag at row:', row, 'col:', col)
        expandCell(row, col, cell.isMarked ? '🚩' : EMPTY)
    }
}