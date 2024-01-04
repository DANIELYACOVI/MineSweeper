'use strict'

const EMPTY = ' '
const MINES = '💣'

var gBoard
var gLevel = 16
var originalEmoji = '🙂'
var timerStart = false
var gTimer
var time = 0
var timeStep = 10
var gFlagsCount
var gLives

function onInit() {
    resetTimer()
    gBoard = buildBoard()
    setMines(gBoard)
    renderBoard(gBoard)
    gFlagsCount = calculateFlagsCount()
    updateFlagsDisplay()
    gLives = 3
    updateLivesDisplay()

    //darkMode
    const isDarkMode = loadDarkModePreference()
    document.body.classList.toggle('dark-mode', isDarkMode)
}

function buildBoard() {
    var board = []
    for (var i = 0; i < Math.sqrt(gLevel); i++) {
        board.push([])
        for (var j = 0; j < Math.sqrt(gLevel); j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isMine: false,
                isShown: false,
                isMarked: false,
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var cellContent = cell.isShown ? (cell.isMine ? '💣' : '') : ''
            var cellColor = cell.isMine && cell.isShown ? 'background-color: red; display: flex; align-items: center; justify-content: center;' : ''
            strHTML += `<td data-row="${i}" data-col="${j}">
            <button style="${cellColor}" 
            onclick="cellClicked(${i}, ${j}, event)"
            oncontextmenu="cellClicked(${i}, ${j}, event)">
            ${cellContent}
            </button>
            </td>\n`
        }
        strHTML += '</tr>'
    }
    var elTable = document.querySelector('table')
    elTable.innerHTML = strHTML
}

function onLevelSelect(level) {
    gLevel = level
    var restartButton = document.getElementById('restartButton')
    restartButton.innerHTML = originalEmoji
    onInit()
}

function cellClicked(row, col, event) {
    if (gLives <= 0) {
        return
    }

    var cell = gBoard[row][col]

    if (!timerStart) {
        startTimer()
        timerStart = true
    }

    if (event.button === 0) {
        console.log('left mouse')
        if (cell.isMine) {
            mineClick()
        } else {
            if (!cell.isShown && !cell.isMarked) {
                cell.isShown = true

                var minesAroundCount = countMinesAroundCell(row, col, gBoard)
                if (minesAroundCount > 0) {
                    expandCell(row, col, minesAroundCount)
                    console.log('minesAroundCount:', minesAroundCount)
                    cell.innerHTML = minesAroundCount
                } else {
                    openNeighbors(row, col)
                }
            }
        }
    } else if (event.button === 2) {
        console.log('right mouse')
        event.preventDefault()
        toggleFlag(cell, row, col)
        expandCell(row, col, '🚩')

        if (checkWin()) {
            handleWin()
        }
    }
}

//Recursion
function openNeighbors(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gBoard.length && j >= 0 && j < gBoard[0].length) {
                var neighborCell = gBoard[i][j]
                if (!neighborCell.isMine && !neighborCell.isMarked && !neighborCell.isShown) {
                    neighborCell.isShown = true
                    expandCell(i, j, countMinesAroundCell(i, j, gBoard))
                    if (countMinesAroundCell(i, j, gBoard) === 0) {
                        openNeighbors(i, j)
                    }
                }
            }
        }
    }
}

function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                return false
            }
        }
    }
    return true
}

function openWinModal() {
    var winModal = document.getElementById('winModal')
    winModal.style.display = 'block'
    clearInterval(gTimer)
}

function closeWinModal() {
    var winModal = document.getElementById('winModal')
    winModal.style.display = 'none'
    restartGame()
}


function handleWin() {
    openWinModal()
}

function expandCell(row, col, value) {
    console.log('Rendering cell:', row, col, 'with value:', value)

    var elCell = document.querySelector(`[data-row="${row}"][data-col="${col}"] button`)

    if (gBoard[row][col].isMarked) {
        elCell.innerHTML = '🚩'
    } else if (gBoard[row][col].isShown) {
        elCell.innerHTML = value !== 0 ? `<span style="color: ${getNumberColor(value)}">${value}</span>` : ''
    } else {
        elCell.innerHTML = ''
    }
    elCell.style.backgroundColor = gBoard[row][col].isShown ? 'white' : ''
    return
}

function getNumberColor(number) {
    const colorMap = {
        1: 'blue',
        2: 'green',
        3: 'red',
        4: 'purple',
        5: 'maroon',
        6: 'teal',
        7: 'black',
        8: 'gray'
    };

    return colorMap[number] || 'black';
}

function startTimer() {
    if (!timerStart) {
        gTimer = setInterval(function () {
            updateTimer()
        }, timeStep)
        timerStart = true
    }
}

function resetTimer() {
    clearInterval(gTimer)
    time = 0
    const elTimer = document.getElementById('timeDisplay')
    elTimer.innerHTML = '0'
    timerStart = false
}

function updateLivesDisplay() {
    var elLivesDisplay = document.getElementById('livesDisplay')
    if (elLivesDisplay) {
        var livesEmoji = '❤️'.repeat(gLives)
        elLivesDisplay.innerHTML = livesEmoji
    }
}

function gameOver() {
    clearInterval(gTimer)
    revealAllMines()

    var restartButton = document.getElementById('restartButton')
    restartButton.innerHTML = '🙁'
}

function restartGame() {
    resetTimer()
    var restartButton = document.getElementById('restartButton')
    restartButton.innerHTML = originalEmoji
    onInit()
}

//DarkMode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode')
    var darkModeButton = document.querySelector('.dark-mode.style')
    if (document.body.classList.contains('dark-mode')) {
        darkModeButton.innerText = 'Light Mode'
    } else {
        darkModeButton.innerText = 'Dark Mode'
    }

    saveDarkModePreference(document.body.classList.contains('dark-mode'))
}

function saveDarkModePreference(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode)
}

function loadDarkModePreference() {
    return localStorage.getItem('darkMode') === 'true'
}