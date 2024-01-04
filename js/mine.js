'use strict'

function setMines(board) {
    //Test
    //     for (var i = 0; i < board.length; i++) {
    //         for (var j = 0; j < board[0].length; j++) {
    //             board[i][j].isMine = false
    //         }
    //     }

    //     var minePositions = [
    //         { row: 0, col: 0 },
    //         { row: 1, col: 1 },
    //         { row: 2, col: 0 }
    //     ]

    //     for (var i = 0; i < minePositions.length; i++) {
    //         var minePosition = minePositions[i]
    //         board[minePosition.row][minePosition.col].isMine = true
    //     }
    // }

    // Random
    var minesCount
    switch (gLevel) {
        case 16:
            minesCount = 2;
            break;
        case 64:
            minesCount = 14;
            break;
        case 144:
            minesCount = 32;
            break;
        default: minesCount = 2;
            break;
    }
    for (var i = 0; i < minesCount; i++) {
        var randRow = getRandomInt(0, board.length)
        var randCol = getRandomInt(0, board[0].length)
        while (board[randRow][randCol].isMine) {
            randRow = getRandomInt(0, board.length)
            randCol = getRandomInt(0, board[0].length)
        }
        board[randRow][randCol].isMine = true
    }
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
            }
        }
    }
}

function countMinesAroundCell(cellI, cellJ, board) {
    var minesCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine || board[i][j].isMarked) minesCount++
        }
    }
    return minesCount
}

function mineClick() {
    if (gLives > 0) {
        // console.log('Revealing all mines. Initial board state:', gBoard)
        // renderBoard(gBoard)
        gLives--
        
        if (gLives === 0) {
            revealAllMines()
            renderBoard(gBoard)
            gameOver()
            resetTimer()
        } else {
            hideAllMines()
            updateLivesDisplay()
        }
    }
    // console.log('Board state after revealing mines:', gBoard)
}

function hideAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = false
            }
        }
    }
}