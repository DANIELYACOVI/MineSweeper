'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function updateTimer() {
    const elTimer = document.getElementById('timeDisplay')
    if (elTimer) {
        elTimer.innerHTML = (time / 1000).toFixed(0)
        time += timeStep
    }
}

function saveBestTime(level, time) {
    const bestTimeKey = `timeScore-${level}`
    const existingBestTime = localStorage.getItem(bestTimeKey)
    if (!existingBestTime || time < existingBestTime) {
        localStorage.setItem(bestTimeKey, time)
    }
}

function loadBestTime(level) {
    const bestTimeKey = `timeScore-${level}`
    return localStorage.getItem(bestTimeKey) || 0
}