let level = 1;
let streak = 0;
let achievements = [];
let timeLeft = 30;
let timer;
let isChallengeActive = false;
let currentQuestion = null;

// DOM Elements
let taskBox = document.getElementById('taskBox');
let taskText = document.getElementById('taskText');
let timerDisplay = document.getElementById('timer');
let startButton = document.getElementById('startButton');
let badge = document.getElementById('badge');
let streakDisplay = document.getElementById('streak');
let achievementsDisplay = document.getElementById('achievements');
let answerInput = document.getElementById('answerInput');
let submitButton = document.getElementById('submitAnswer');

// Question Bank
const questions = [
    // Level 1 Questions - Basic Focus
    {
        level: 1,
        type: 'sequence',
        question: 'What comes next in the sequence? 2, 4, 6, 8, __',
        answer: '10',
        hint: 'Look for the pattern of adding numbers',
        time: 20
    },
    {
        level: 1,
        type: 'counting',
        question: 'Count how many letter "e" appear here: "Seven elephants went to exercise early every evening"',
        answer: '8',
        hint: 'Count each "e" one by one',
        time: 25
    },
    {
        level: 1,
        type: 'spot',
        question: 'Find the odd one out: 🐶 🐶 🐱 🐶 🐶',
        answer: 'cat',
        hint: 'One emoji is different from the others',
        time: 15
    },
    {
        level: 1,
        type: 'math',
        question: 'What is 5 + 7?',
        answer: '12',
        hint: 'Use your fingers if needed',
        time: 15
    },

    // Level 2 Questions - Intermediate Focus
    {
        level: 2,
        type: 'memory',
        question: 'Remember these colors in order: RED, BLUE, GREEN, YELLOW. Close your eyes for 5 seconds, then type them in reverse order',
        answer: 'yellow green blue red',
        hint: 'Try creating a mental picture',
        time: 30
    },
    {
        level: 2,
        type: 'focus',
        question: 'Find the different number: 7 7 7 7 1 7 7 7',
        answer: '1',
        hint: 'Take your time to scan each number',
        time: 20
    },
    {
        level: 2,
        type: 'calculation',
        question: 'If today is Monday, what day will it be after 10 days?',
        answer: 'thursday',
        hint: 'Count the days on your fingers',
        time: 25
    },
    {
        level: 2,
        type: 'pattern',
        question: 'Complete: 🌟⭐🌟⭐🌟__',
        answer: '⭐',
        hint: 'The pattern alternates',
        time: 20
    },

    // Level 3 Questions - Advanced Focus
    {
        level: 3,
        type: 'pattern',
        question: 'Complete the pattern: MOON, SOON, NOON, ____',
        answer: 'spoon',
        hint: 'Think of words that rhyme',
        time: 25
    },
    {
        level: 3,
        type: 'calculation',
        question: "If you count by 3s starting from 2, what is the 5th number? (2, 5, 8, 11, __)",
        answer: '14',
        hint: 'Add 3 each time',
        time: 30
    },
    {
        level: 3,
        type: 'memory',
        question: 'Remember this sequence: 🍎 🍌 🍇 🍊. Close your eyes, count to 3, type the THIRD fruit',
        answer: 'grape',
        hint: 'Focus on the third position',
        time: 25
    },
    {
        level: 3,
        type: 'wordplay',
        question: 'How many words can you make from: STAR? (Enter the number)',
        answer: '4',
        hint: 'Try rearranging the letters (star, rats, arts, tars)',
        time: 35
    },

    // Level 4 Questions - Expert Focus
    {
        level: 4,
        type: 'visual',
        question: 'How many triangles can you spot? 🔺🔺🔺🔻▲△',
        answer: '6',
        hint: 'Count each triangle symbol, regardless of style',
        time: 25
    },
    {
        level: 4,
        type: 'wordplay',
        question: 'Rearrange these letters to make a word: CFOUS',
        answer: 'focus',
        hint: "It is related to attention",
        time: 30
    },
    {
        level: 4,
        type: 'math',
        question: 'Solve: If 2🌟 = 10 and 3🌟 = 15, then 4🌟 = ?',
        answer: '20',
        hint: 'Look for the pattern with the star symbol',
        time: 40
    },
    {
        level: 4,
        type: 'sequence',
        question: 'Complete: 1, 3, 6, 10, 15, __',
        answer: '21',
        hint: 'Add an increasing number each time (+2, +3, +4, +5, +6)',
        time: 45
    }
];

// Start the game and timer
startButton.addEventListener('click', () => {
    if (!isChallengeActive) {
        startChallenge();
        answerInput.value = '';
        answerInput.disabled = false;
        submitButton.disabled = false;
        answerInput.focus(); // Automatically focus the input
    }
});

function getRandomQuestion(level) {
    const levelQuestions = questions.filter(q => q.level <= level);
    if (levelQuestions.length === 0) return questions[0]; // Fallback to first question
    return levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
}

function startChallenge() {
    isChallengeActive = true;
    startButton.style.display = 'none';
    badge.style.display = 'none';
    
    // Get a random question for the current level
    currentQuestion = getRandomQuestion(level);
    timeLeft = currentQuestion.time;
    
    // Display the question with styling
    taskBox.innerHTML = `
        <p class="task-text" id="taskText">
            <span class="level-indicator">Level ${level}</span>
            <span class="question-type">${currentQuestion.type.toUpperCase()}</span>
            <br><br>
            ${currentQuestion.question}
        </p>
        <p class="hint-text">Hint: ${currentQuestion.hint}</p>
    `;
    
    startTimer();
}

// Handle answer submission
submitButton.addEventListener('click', () => {
    if (isChallengeActive) {
        checkAnswer();
    }
});

// Allow Enter key to submit answer
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && isChallengeActive) {
        checkAnswer();
    }
});

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();
    
    // Function to normalize answers for comparison
    const normalizeAnswer = (answer) => {
        return answer
            .replace(/\s+/g, ' ')        // Replace multiple spaces with single space
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove punctuation
            .trim()
            .toLowerCase();
    };

    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);

    // Check for exact match or close match
    if (normalizedUserAnswer === normalizedCorrectAnswer ||
        (currentQuestion.type === 'sequence' && normalizedUserAnswer.replace(/[,\s]/g, '') === normalizedCorrectAnswer.replace(/[,\s]/g, '')) ||
        (currentQuestion.type === 'memory' && normalizedUserAnswer.split(' ').every(word => normalizedCorrectAnswer.includes(word)))) {
        clearInterval(timer);
        completeTask();
    } else {
        // Show error feedback
        answerInput.classList.add('error');
        setTimeout(() => {
            answerInput.classList.remove('error');
        }, 1000);
    }
}

function completeTask() {
    clearInterval(timer);
    badge.style.display = 'inline-block';
    badge.textContent = `Level ${level} Completed! 🎉`;
    streak++;
    updateStreak();
    
    if (streak % 3 === 0) {
        unlockAchievement(`Focus Master: ${streak} in a row! 🏆`);
    }

    // Disable input during completion animation
    answerInput.disabled = true;
    submitButton.disabled = true;

    setTimeout(() => {
        level++;
        resetGame();
    }, 2000);
}

function resetGame() {
    timeLeft = 30;
    taskBox.innerHTML = `
        <p class="task-text" id="taskText">
            Ready for your next focus challenge?<br>
            Click the button below to start!
        </p>
    `;
    startButton.style.display = 'block';
    startButton.textContent = 'Start Challenge';
    isChallengeActive = false;
    answerInput.value = '';
    answerInput.disabled = true;
    submitButton.disabled = true;
    updateStreak();
}

function startTimer() {
    timer = setInterval(function () {
        if (timeLeft === 0) {
            clearInterval(timer);
            alert("Time's up! Let's try another question.");
            resetGame();
        } else {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
        }
    }, 1000);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function updateStreak() {
    streakDisplay.textContent = `Streak: ${streak} 🔥`;
}

function unlockAchievement(achievement) {
    achievements.push(achievement);
    achievementsDisplay.textContent = `Achievements: ${achievements.join(' | ')}`;
}

// Add error styles for the input
const style = document.createElement('style');
style.textContent = `
    .answer-input.error {
        border-color: #ef4444 !important;
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .level-indicator {
        display: inline-block;
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.9em;
        margin-right: 10px;
    }

    .question-type {
        display: inline-block;
        background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.9em;
    }

    .hint-text {
        color: #6b7280;
        font-size: 0.9em;
        margin-top: 1rem;
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Initially disable input and submit button
answerInput.disabled = true;
submitButton.disabled = true;
