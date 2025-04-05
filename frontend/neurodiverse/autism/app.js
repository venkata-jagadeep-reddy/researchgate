// Speech recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// DOM Elements
const startButton = document.getElementById('start-btn');
const nextLevelButton = document.getElementById('next-level-btn');
const statusElement = document.getElementById('status');
const scoreElement = document.getElementById('score');
const streakElement = document.getElementById('streak');
const feedbackElement = document.getElementById('feedback');
const phraseElement = document.getElementById('phrase');
const instructionElement = document.getElementById('instruction');
const currentLevelElement = document.getElementById('current-level');
const levelDisplayElement = document.getElementById('level-display');
const accuracyBar = document.getElementById('accuracy-bar');
const progressBar = document.getElementById('progress-bar');

// Game variables
let score = 0;
let streak = 0;
let bestStreak = 0;
let currentLevel = 1;
let attempts = 0;
let correctAttempts = 0;
let levelProgress = 0;

// Level configuration
const levelConfig = {
    1: {
        phrases: [
            "The quick brown fox jumps over the lazy dog.",
            "She sells seashells by the seashore.",
            "How much wood would a woodchuck chuck?"
        ],
        requiredScore: 20,
        difficulty: 1
    },
    2: {
        phrases: [
            "Peter Piper picked a peck of pickled peppers.",
            "All that glitters is not gold.",
            "A journey of a thousand miles begins with a single step."
        ],
        requiredScore: 40,
        difficulty: 2
    },
    3: {
        phrases: [
            "To be or not to be, that is the question.",
            "All's well that ends well.",
            "A man, a plan, a canal, Panama."
        ],
        requiredScore: 60,
        difficulty: 3
    },
    4: {
        phrases: [
            "The rain in Spain stays mainly in the plain.",
            "She stood on the balcony, inexplicably mimicking him hiccuping.",
            "Red rabbits rarely run right."
        ],
        requiredScore: 80,
        difficulty: 4
    },
    5: {
        phrases: [
            "Unique New York, unique New York, you know you need unique New York.",
            "The sixth sick sheik's sixth sheep's sick.",
            "I scream, you scream, we all scream for ice cream."
        ],
        requiredScore: 100,
        difficulty: 5
    }
};

// Initialize the game
function initializeGame() {
    updateUI();
    setCurrentPhrase();
}

// Handle speech recognition results
recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log('Recognized speech:', transcript);
    checkAnswer(transcript);
};

// Handle errors
recognition.onerror = function(event) {
    console.log("Speech recognition error", event.error);
    statusElement.innerText = "Error: Please try again.";
    startButton.disabled = false;
};

// Start the speech recognition
startButton.addEventListener('click', function() {
    statusElement.innerText = "Listening...";
    startButton.disabled = true;
    recognition.start();
});

// Check the spoken answer against the target phrase
function checkAnswer(transcript) {
    attempts++;
    const targetPhrase = currentPhrase.toLowerCase();
    const accuracy = calculateAccuracy(transcript, targetPhrase);
    
    if (accuracy >= 0.8) { // 80% accuracy threshold
        correctAttempts++;
        feedbackElement.innerText = "Excellent! Well done!";
        feedbackElement.className = "text-lg text-center text-green-500";
        score += 10;
        streak++;
        if (streak > bestStreak) {
            bestStreak = streak;
            streakElement.innerText = bestStreak;
        }
        nextLevelButton.classList.remove('hidden');
        nextLevelButton.disabled = false;
    } else {
        feedbackElement.innerText = `Try again! You said: "${transcript}"`;
        feedbackElement.className = "text-lg text-center text-red-500";
        streak = 0;
        streakElement.innerText = streak;
    }

    updateUI();
    startButton.disabled = false;
}

// Calculate accuracy between spoken and target phrase
function calculateAccuracy(spoken, target) {
    const spokenWords = spoken.split(' ');
    const targetWords = target.split(' ');
    let matches = 0;

    spokenWords.forEach((word, index) => {
        if (targetWords[index] === word) {
            matches++;
        }
    });

    return matches / targetWords.length;
}

// Update UI elements
function updateUI() {
    scoreElement.innerText = score;
    streakElement.innerText = streak;
    currentLevelElement.innerText = currentLevel;
    levelDisplayElement.innerText = currentLevel;
    
    // Update accuracy bar
    const accuracy = attempts > 0 ? (correctAttempts / attempts) * 100 : 0;
    accuracyBar.style.width = `${accuracy}%`;
    
    // Update progress bar
    const levelConfig = getLevelConfig(currentLevel);
    levelProgress = (score / levelConfig.requiredScore) * 100;
    progressBar.style.width = `${Math.min(levelProgress, 100)}%`;
    
    // Update level indicators
    updateLevelIndicators();
}

// Update level indicators
function updateLevelIndicators() {
    const indicators = document.querySelectorAll('.level-indicator');
    indicators.forEach((indicator, index) => {
        const level = index + 1;
        if (level < currentLevel) {
            indicator.classList.add('completed');
            indicator.querySelector('div').className = 'bg-green-100 p-4 rounded-lg text-center';
            indicator.querySelector('span').className = 'text-green-800 font-semibold';
        } else if (level === currentLevel) {
            indicator.classList.add('active');
            indicator.querySelector('div').className = 'bg-blue-100 p-4 rounded-lg text-center';
            indicator.querySelector('span').className = 'text-blue-800 font-semibold';
        }
    });
}

// Get current level configuration
function getLevelConfig(level) {
    return levelConfig[level] || levelConfig[1];
}

// Set current phrase
function setCurrentPhrase() {
    const config = getLevelConfig(currentLevel);
    const randomIndex = Math.floor(Math.random() * config.phrases.length);
    currentPhrase = config.phrases[randomIndex];
    phraseElement.innerText = currentPhrase;
    instructionElement.innerText = `Please repeat the following phrase (Level ${currentLevel}):`;
}

// Handle next level button click
nextLevelButton.addEventListener('click', function() {
    if (currentLevel < 5) {
        currentLevel++;
        streak = 0;
        attempts = 0;
        correctAttempts = 0;
        nextLevelButton.classList.add('hidden');
        setCurrentPhrase();
        updateUI();
    } else {
        feedbackElement.innerText = "Congratulations! You've completed all levels!";
        feedbackElement.className = "text-lg text-center text-green-500";
        nextLevelButton.disabled = true;
    }
});

// Initialize the game when the page loads
window.addEventListener('load', initializeGame);
