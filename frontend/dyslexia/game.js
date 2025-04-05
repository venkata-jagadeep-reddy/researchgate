// game.js
const gameData = {
    wordMatch: [
        { 
            word: "cat", 
            options: ["animal", "fruit", "furniture", "technology"],
            hint: "A furry pet that purrs",
            image: "🐱"
        },
        { 
            word: "dog", 
            options: ["animal", "fruit", "furniture", "technology"],
            hint: "A loyal pet that barks",
            image: "🐕"
        },
        { 
            word: "apple", 
            options: ["animal", "fruit", "furniture", "technology"],
            hint: "A red or green fruit that grows on trees",
            image: "🍎"
        },
        { 
            word: "banana", 
            options: ["animal", "fruit", "furniture", "technology"],
            hint: "A yellow curved fruit",
            image: "🍌"
        },
        { 
            word: "chair", 
            options: ["animal", "fruit", "furniture", "technology"],
            hint: "Something you sit on",
            image: "🪑"
        },
        { 
            word: "table", 
            options: ["animal", "fruit", "furniture", "technology"],
            hint: "A flat surface to put things on",
            image: "🪵"
        },
        { 
            word: "computer", 
            options: ["animal", "fruit", "furniture", "technology"],
            hint: "An electronic device for work and games",
            image: "💻"
        },
        { 
            word: "keyboard", 
            options: ["animal", "fruit", "furniture", "technology"],
            hint: "Used to type on a computer",
            image: "⌨️"
        }
    ],
    wordBuilder: [
        { 
            word: "cat", 
            letters: ["c", "a", "t"],
            hint: "A furry pet",
            image: "🐱"
        },
        { 
            word: "dog", 
            letters: ["d", "o", "g"],
            hint: "A loyal pet",
            image: "🐕"
        },
        { 
            word: "apple", 
            letters: ["a", "p", "p", "l", "e"],
            hint: "A red fruit",
            image: "🍎"
        },
        { 
            word: "book", 
            letters: ["b", "o", "o", "k"],
            hint: "You read this",
            image: "📚"
        }
    ],
    wordSearch: [
        {
            grid: [
                ["c", "a", "t", "d", "o", "g"],
                ["a", "p", "p", "l", "e", "s"],
                ["b", "o", "o", "k", "s", "t"],
                ["d", "e", "s", "k", "t", "a"],
                ["c", "h", "a", "i", "r", "s"],
                ["t", "a", "b", "l", "e", "s"]
            ],
            words: ["cat", "dog", "apple", "book", "desk", "chair", "table"],
            hints: {
                "cat": "A furry pet that purrs",
                "dog": "A loyal pet that barks",
                "apple": "A red or green fruit",
                "book": "You read this",
                "desk": "A work surface",
                "chair": "Something you sit on",
                "table": "A flat surface"
            }
        }
    ]
};

let currentGameMode = null;
let currentScore = 0;
let currentStreak = 0;
let bestStreak = 0;
let wordsFound = 0;
let gameTimer = null;
let timeLeft = 60;
let soundEnabled = true;

// Initialize speech synthesis
const speechSynthesis = window.speechSynthesis;

// Memory Game Data
const memoryCards = [
    '🐶', '🐱', '🐭', '🐹'
];

let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let canFlip = true;

function selectGameMode(mode) {
    currentGameMode = mode;
    document.getElementById('game-modes').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    
    // Hide all game modes
    document.querySelectorAll('.game-mode').forEach(el => el.classList.add('hidden'));
    
    // Show selected game mode
    document.getElementById(mode).classList.remove('hidden');
    
    // Initialize the selected game mode
    switch(mode) {
        case 'memoryGame':
            initializeMemoryGame();
            break;
        case 'wordMatch':
            initializeWordMatch();
            break;
        case 'wordBuilder':
            initializeWordBuilder();
            break;
        case 'wordSearch':
            initializeWordSearch();
            break;
    }
    
    startTimer();
}

function initializeWordMatch() {
    const currentWord = gameData.wordMatch[0];
    const wordDisplay = document.getElementById('current-word');
    wordDisplay.innerHTML = `${currentWord.image}<br>${currentWord.word}`;
    
    const optionsContainer = document.getElementById('word-options');
    optionsContainer.innerHTML = '';
    
    // Shuffle options
    const shuffledOptions = [...currentWord.options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => checkWordMatch(option);
        optionsContainer.appendChild(button);
    });
}

function initializeWordBuilder() {
    const currentWord = gameData.wordBuilder[0];
    const wordDisplay = document.getElementById('target-word');
    wordDisplay.innerHTML = `${currentWord.image}<br>${currentWord.word}`;
    
    const letterBank = document.getElementById('letter-bank');
    letterBank.innerHTML = '';
    
    // Shuffle letters
    const shuffledLetters = [...currentWord.letters].sort(() => Math.random() - 0.5);
    
    shuffledLetters.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'letter';
        button.textContent = letter;
        button.onclick = () => addLetter(letter);
        letterBank.appendChild(button);
    });
    
    document.getElementById('word-construction').innerHTML = '';
}

function initializeWordSearch() {
    const currentPuzzle = gameData.wordSearch[0];
    const grid = document.getElementById('search-grid');
    grid.innerHTML = '';
    
    currentPuzzle.grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';
            cellElement.textContent = cell;
            cellElement.dataset.row = i;
            cellElement.dataset.col = j;
            cellElement.onclick = () => selectCell(i, j);
            grid.appendChild(cellElement);
        });
    });
    
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';
    currentPuzzle.words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        wordElement.onclick = () => showWordHint(word);
        wordList.appendChild(wordElement);
    });
}

function checkWordMatch(selectedOption) {
    const currentWord = gameData.wordMatch[0];
    const isCorrect = selectedOption === currentWord.word;
    
    if (isCorrect) {
        currentScore += 10;
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
        wordsFound++;
        playSound('correct');
        showFeedback('Correct! 🎉', 'success');
    } else {
        currentStreak = 0;
        playSound('incorrect');
        showFeedback('Try again! 💪', 'error');
    }
    
    updateScoreboard();
    setTimeout(nextWord, 1500);
}

function addLetter(letter) {
    const construction = document.getElementById('word-construction');
    const letterElement = document.createElement('span');
    letterElement.textContent = letter;
    construction.appendChild(letterElement);
    
    // Check if word is complete
    const builtWord = Array.from(construction.children)
        .map(el => el.textContent)
        .join('');
    
    if (builtWord === gameData.wordBuilder[0].word) {
        currentScore += 15;
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
        wordsFound++;
        playSound('correct');
        showFeedback('Word completed! 🎉', 'success');
        setTimeout(nextWord, 1500);
    }
}

let selectedCells = [];

function selectCell(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell.classList.contains('selected')) {
        cell.classList.add('selected');
        selectedCells.push({row, col, letter: cell.textContent});
        
        // Check if a word is formed
        checkSelectedWord();
    }
}

function checkSelectedWord() {
    const selectedWord = selectedCells.map(cell => cell.letter).join('');
    const currentPuzzle = gameData.wordSearch[0];
    
    if (currentPuzzle.words.includes(selectedWord)) {
        currentScore += 20;
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
        wordsFound++;
        playSound('correct');
        showFeedback('Word found! 🎉', 'success');
        
        // Mark word as found
        const wordElement = Array.from(document.querySelectorAll('.word-item'))
            .find(el => el.textContent === selectedWord);
        if (wordElement) {
            wordElement.classList.add('found');
        }
        
        // Clear selection
        clearSelection();
    }
}

function clearSelection() {
    selectedCells.forEach(cell => {
        const element = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
        element.classList.remove('selected');
    });
    selectedCells = [];
}

function showWordHint(word) {
    const currentPuzzle = gameData.wordSearch[0];
    if (currentPuzzle.hints[word]) {
        showFeedback(currentPuzzle.hints[word], 'hint');
    }
}

function nextWord() {
    // Move to next word in current game mode
    gameData[currentGameMode].shift();
    
    if (gameData[currentGameMode].length === 0) {
        endGame();
    } else {
        switch(currentGameMode) {
            case 'wordMatch':
                initializeWordMatch();
                break;
            case 'wordBuilder':
                initializeWordBuilder();
                break;
            case 'wordSearch':
                initializeWordSearch();
                break;
        }
    }
}

function startTimer() {
    timeLeft = 60;
    updateTimer();
    
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('timer').textContent = timeLeft;
}

function updateScoreboard() {
    document.getElementById('score').textContent = currentScore;
    document.getElementById('streak').textContent = currentStreak;
}

function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 1500);
}

function playSound(type) {
    if (!soundEnabled) return;
    
    const audio = new Audio();
    audio.src = type === 'correct' ? 'correct.mp3' : 'incorrect.mp3';
    audio.play().catch(e => console.log('Audio playback failed:', e));
}

function initializeMemoryGame() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    
    // Create pairs of cards
    const cardPairs = [...memoryCards, ...memoryCards];
    
    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    // Create card elements
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.card = card;
        cardElement.dataset.index = index;
        
        const front = document.createElement('div');
        front.className = 'memory-card-front';
        front.innerHTML = '?';
        
        const back = document.createElement('div');
        back.className = 'memory-card-back';
        back.textContent = card;
        
        cardElement.appendChild(front);
        cardElement.appendChild(back);
        
        cardElement.addEventListener('click', () => flipCard(cardElement));
        grid.appendChild(cardElement);
    });
    
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    canFlip = true;
    currentScore = 0;
    currentStreak = 0;
    
    // Update stats
    document.getElementById('matches-found').textContent = '0';
    document.getElementById('attempts').textContent = '0';
    document.getElementById('score').textContent = '0';
    document.getElementById('streak').textContent = '0';
    
    // Hide game over screen
    document.getElementById('game-over').classList.add('hidden');
    
    // Start timer
    startTimer();
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        canFlip = false;
        attempts++;
        document.getElementById('attempts').textContent = attempts;
        
        const [card1, card2] = flippedCards;
        const match = card1.dataset.card === card2.dataset.card;
        
        if (match) {
            matchedPairs++;
            currentScore += 10;
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
            
            document.getElementById('matches-found').textContent = matchedPairs;
            document.getElementById('score').textContent = currentScore;
            document.getElementById('streak').textContent = currentStreak;
            
            card1.classList.add('matched');
            card2.classList.add('matched');
            
            playSound('correct');
            showFeedback('Match found! 🎉', 'success');
            
            if (matchedPairs === 26) {
                setTimeout(endGame, 500);
            } else {
                setTimeout(() => {
                    flippedCards = [];
                    canFlip = true;
                }, 500);
            }
        } else {
            currentStreak = 0;
            document.getElementById('streak').textContent = '0';
            
            playSound('incorrect');
            showFeedback('Try again! 💪', 'error');
            
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
}

function endGame() {
    clearInterval(gameTimer);
    document.getElementById('game-over').classList.remove('hidden');
    
    document.getElementById('final-score').textContent = currentScore;
    document.getElementById('final-matches').textContent = matchedPairs;
    document.getElementById('best-streak').textContent = bestStreak;
    document.getElementById('total-attempts').textContent = attempts;
}

function startNewGame() {
    initializeMemoryGame();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sound toggle
    document.getElementById('toggle-sound').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        document.getElementById('toggle-sound').querySelector('i').className = 
            soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    });
    
    // Initialize hint button
    document.getElementById('hint-button')?.addEventListener('click', () => {
        const currentWord = gameData[currentGameMode][0];
        showFeedback(currentWord.hint, 'hint');
    });
    
    // Initialize new game button
    document.getElementById('new-game').addEventListener('click', startNewGame);
});
