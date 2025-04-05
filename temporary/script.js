// DOM Elements
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const backToHomeBtns = document.querySelectorAll('#back-to-home, #back-to-home-login');
const backToLoginBtn = document.getElementById('back-to-login');
const forgotPasswordBtn = document.getElementById('forgot-password-btn');
const submitSignupBtn = document.getElementById('submit-signup');
const submitLoginBtn = document.getElementById('submit-login');
const submitResetPasswordBtn = document.getElementById('submit-reset-password');
const roleplaySection = document.getElementById('roleplay-section');
const cameraRoleplaySection = document.getElementById('camera-roleplay-section');
const evaluationSection = document.getElementById('evaluation-section');
const avatarOptions = document.querySelectorAll('.avatar-option');
const signupUsername = document.getElementById('signup-username');
const signupPassword = document.getElementById('signup-password');
const signupConfirmPassword = document.getElementById('signup-confirm-password');
const strengthMeter = document.querySelector('.strength-meter');
const strengthText = document.querySelector('.strength-text span');

// Camera Elements
const startCameraBtn = document.getElementById('start-camera');
const stopCameraBtn = document.getElementById('stop-camera');
const startRecordingBtn = document.getElementById('start-recording');
const stopRecordingBtn = document.getElementById('stop-recording');
const localVideo = document.getElementById('local-video');
const previewVideo = document.getElementById('preview-video');
const evaluateRecordingBtn = document.getElementById('evaluate-recording');
const closeEvaluationBtn = document.getElementById('close-evaluation');
const shareEvaluationBtn = document.getElementById('share-evaluation');

// State Management
let currentSection = 'home';
let selectedAvatar = null;
let userData = {
    username: '',
    avatar: '',
    isLoggedIn: false
};
let mediaRecorder = null;
let recordedChunks = [];
let stream = null;
let currentScenarioIndex = 0;
let timerInterval = null;
let seconds = 0;
let currentFilter = 'normal';

// Camera scenarios
const cameraScenarios = [
    {
        title: 'Making a New Friend',
        instructions: 'Act out how you would make a new friend at the playground. Show how you would introduce yourself and start a conversation.',
        duration: 60
    },
    {
        title: 'Sharing Toys',
        instructions: 'Act out how you would share your favorite toy with a friend. Show how you would offer it and play together.',
        duration: 60
    },
    {
        title: 'Working Together',
        instructions: 'Act out how you would help a friend with a difficult task. Show how you would offer assistance and work as a team.',
        duration: 60
    },
    {
        title: 'Being Kind',
        instructions: 'Act out how you would help someone who fell down. Show how you would comfort them and make sure they are okay.',
        duration: 60
    },
    {
        title: 'Resolving Conflict',
        instructions: 'Act out how you would help friends who are arguing. Show how you would help them talk about their feelings and find a solution.',
        duration: 60
    },
    {
        title: 'Including Others',
        instructions: 'Act out how you would invite a new child to join your game. Show how you would make them feel welcome and included.',
        duration: 60
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    setupEventListeners();
    setupPasswordStrengthMeter();
    setupAvatarSelection();
    setupFormValidation();
    
    // Initialize camera roleplay
    initCameraRoleplay();
    
    // Add camera roleplay button to navigation
    const cameraRoleplayBtn = document.createElement('button');
    cameraRoleplayBtn.className = 'primary-btn';
    cameraRoleplayBtn.textContent = 'Act Out Your Role!';
    cameraRoleplayBtn.style.marginTop = '20px';
    cameraRoleplayBtn.addEventListener('click', () => {
        // Hide roleplay section
        roleplaySection.style.display = 'none';
        
        // Show camera roleplay section
        document.getElementById('camera-roleplay-section').style.display = 'block';
        
        // Show notification
        showNotification('Camera roleplay activated!', 'success');
    });
    
    roleplaySection.appendChild(cameraRoleplayBtn);
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation buttons
    signupBtn.addEventListener('click', () => showSection('signup'));
    loginBtn.addEventListener('click', () => showSection('login'));
    backToHomeBtns.forEach(btn => btn.addEventListener('click', () => showSection('home')));
    backToLoginBtn.addEventListener('click', () => showSection('login'));
    forgotPasswordBtn.addEventListener('click', () => showSection('reset-password'));
    
    // Form submissions
    submitSignupBtn.addEventListener('click', handleSignup);
    submitLoginBtn.addEventListener('click', handleLogin);
    submitResetPasswordBtn.addEventListener('click', handleResetPassword);
    
    // Camera controls
    startCameraBtn.addEventListener('click', startCamera);
    stopCameraBtn.addEventListener('click', stopCamera);
    startRecordingBtn.addEventListener('click', startRecording);
    stopRecordingBtn.addEventListener('click', stopRecording);
    
    // Evaluation controls
    evaluateRecordingBtn.addEventListener('click', showEvaluation);
    closeEvaluationBtn.addEventListener('click', hideEvaluation);
    shareEvaluationBtn.addEventListener('click', shareEvaluation);
}

// Show/Hide Sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the requested section
    switch(sectionName) {
        case 'home':
            document.querySelector('.intro').style.display = 'block';
            break;
        case 'signup':
            signupForm.style.display = 'block';
            break;
        case 'login':
            loginForm.style.display = 'block';
            break;
        case 'reset-password':
            resetPasswordForm.style.display = 'block';
            break;
        case 'roleplay':
            roleplaySection.style.display = 'block';
            break;
        case 'camera-roleplay':
            cameraRoleplaySection.style.display = 'block';
            break;
        case 'evaluation':
            evaluationSection.style.display = 'block';
            break;
    }
    
    // Update current section
    currentSection = sectionName;
    
    // Add animation classes
    const section = document.querySelector(`#${sectionName}-form, .intro, #roleplay-section, #camera-roleplay-section, #evaluation-section`);
    if (section) {
        section.classList.add('fade-in');
        setTimeout(() => section.classList.remove('fade-in'), 500);
    }
}

// Avatar Selection
function setupAvatarSelection() {
    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Store selected avatar
            selectedAvatar = option.getAttribute('data-avatar');
            
            // Add selection sound effect
            playSound('select');
        });
    });
}

// Password Strength Meter
function setupPasswordStrengthMeter() {
    signupPassword.addEventListener('input', () => {
        const strength = calculatePasswordStrength(signupPassword.value);
        updateStrengthMeter(strength);
    });
    
    signupConfirmPassword.addEventListener('input', () => {
        validatePasswordMatch();
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains number
    if (/\d/.test(password)) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    return strength;
}

function updateStrengthMeter(strength) {
    // Update the width of the strength meter
    strengthMeter.style.setProperty('--strength', `${strength}%`);
    
    // Update the color based on strength
    let color = '#FF6B6B'; // Weak
    if (strength >= 50) color = '#FFA500'; // Medium
    if (strength >= 75) color = '#4CAF50'; // Strong
    
    strengthMeter.style.setProperty('--strength-color', color);
    
    // Update the text
    let text = 'Weak';
    if (strength >= 50) text = 'Medium';
    if (strength >= 75) text = 'Strong';
    
    strengthText.textContent = text;
    strengthText.style.color = color;
}

function validatePasswordMatch() {
    const password = signupPassword.value;
    const confirmPassword = signupConfirmPassword.value;
    
    if (password && confirmPassword) {
        if (password === confirmPassword) {
            signupConfirmPassword.style.borderColor = '#4CAF50';
        } else {
            signupConfirmPassword.style.borderColor = '#FF6B6B';
        }
    }
}

// Form Validation
function setupFormValidation() {
    // Username validation
    signupUsername.addEventListener('input', () => {
        const username = signupUsername.value;
        if (username.length >= 3) {
            signupUsername.style.borderColor = '#4CAF50';
        } else {
            signupUsername.style.borderColor = '#FF6B6B';
        }
    });
}

// Form Handlers
function handleSignup(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateSignupForm()) {
        showNotification('Please fill in all fields correctly', 'error');
        return;
    }
    
    // Check if avatar is selected
    if (!selectedAvatar) {
        showNotification('Please select a character', 'error');
        return;
    }
    
    // Store user data
    userData = {
        username: signupUsername.value,
        avatar: selectedAvatar,
        isLoggedIn: true
    };
    
    // Save to localStorage (for demo purposes)
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Show success message
    showNotification('Account created successfully!', 'success');
    
    // Show roleplay section
    setTimeout(() => {
        showSection('roleplay');
        playSound('success');
    }, 1000);
}

function validateSignupForm() {
    const username = signupUsername.value;
    const password = signupPassword.value;
    const confirmPassword = signupConfirmPassword.value;
    
    // Basic validation
    if (username.length < 3) return false;
    if (password.length < 8) return false;
    if (password !== confirmPassword) return false;
    
    return true;
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!username || !password) {
        showNotification('Please enter username and password', 'error');
        return;
    }
    
    // Check if user exists (for demo purposes)
    const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (storedUserData.username === username) {
        // In a real app, you would verify the password
        userData = storedUserData;
        userData.isLoggedIn = true;
        
        showNotification('Login successful!', 'success');
        
        setTimeout(() => {
            showSection('roleplay');
            playSound('success');
        }, 1000);
    } else {
        showNotification('Invalid username or password', 'error');
        playSound('error');
    }
}

function handleResetPassword(e) {
    e.preventDefault();
    
    const username = document.getElementById('reset-username').value;
    const newPassword = document.getElementById('reset-new-password').value;
    
    // Simple validation
    if (!username || !newPassword) {
        showNotification('Please enter username and new password', 'error');
        return;
    }
    
    // Check if user exists (for demo purposes)
    const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (storedUserData.username === username) {
        // In a real app, you would update the password
        showNotification('Password reset successful!', 'success');
        
        setTimeout(() => {
            showSection('login');
        }, 1000);
    } else {
        showNotification('User not found', 'error');
        playSound('error');
    }
}

// Roleplay Functions
function chooseOption(option) {
    let message = '';
    let characterResponse = '';
    let points = 0;
    let emotion = '';
    
    // Get current scenario
    const currentScenario = document.querySelector('.roleplay-section h2').textContent.replace('Scenario: ', '');
    
    // Handle different scenarios
    switch(currentScenario) {
        case 'Making a New Friend':
            if (option === 'greet') {
                message = 'You greeted the character with a friendly "Hi!"';
                characterResponse = 'The character smiled and said, "Hi! I\'m Alex. Would you like to play with me?"';
                points = 10;
                emotion = 'happy';
            } else {
                message = 'You ignored the character and walked away.';
                characterResponse = 'Alex looked sad and walked away.';
                points = -5;
                emotion = 'sad';
            }
            break;
            
        case 'Sharing Toys':
            if (option === 'share') {
                message = 'You offered to share your toy with the other child.';
                characterResponse = 'The child smiled and said, "Thank you! You\'re so kind. Let\'s play together!"';
                points = 15;
                emotion = 'happy';
            } else {
                message = 'You kept the toy to yourself.';
                characterResponse = 'The child looked disappointed and walked away.';
                points = -10;
                emotion = 'disappointed';
            }
            break;
            
        case 'Working Together':
            if (option === 'help') {
                message = 'You offered to help the other child with their task.';
                characterResponse = 'The child was grateful and said, "Thank you! We finished much faster together!"';
                points = 20;
                emotion = 'grateful';
            } else {
                message = 'You decided to work on your own task.';
                characterResponse = 'The child struggled to complete their task alone.';
                points = -5;
                emotion = 'struggling';
            }
            break;
            
        case 'Being Kind':
            if (option === 'help') {
                message = 'You helped the child who fell down.';
                characterResponse = 'The child thanked you and said, "You\'re so kind! Thank you for helping me."';
                points = 25;
                emotion = 'grateful';
            } else {
                message = 'You walked past without helping.';
                characterResponse = 'The child struggled to get up alone.';
                points = -15;
                emotion = 'sad';
            }
            break;
            
        case 'Resolving Conflict':
            if (option === 'talk') {
                message = 'You suggested talking about the problem.';
                characterResponse = 'Everyone agreed to talk it out and found a solution together!';
                points = 20;
                emotion = 'happy';
            } else {
                message = 'You walked away from the conflict.';
                characterResponse = 'The conflict continued between the other children.';
                points = -10;
                emotion = 'angry';
            }
            break;
            
        case 'Including Others':
            if (option === 'invite') {
                message = 'You invited the new child to join your game.';
                characterResponse = 'The child was happy to join and said, "Thank you for including me!"';
                points = 15;
                emotion = 'happy';
            } else {
                message = 'You continued playing without inviting the new child.';
                characterResponse = 'The new child stood alone, watching from a distance.';
                points = -10;
                emotion = 'lonely';
            }
            break;
            
        default:
            if (option === 'greet') {
                message = 'You greeted the character with a friendly "Hi!"';
                characterResponse = 'The character smiled and said, "Hi! I\'m Alex. Would you like to play with me?"';
                points = 10;
                emotion = 'happy';
            } else {
                message = 'You ignored the character and walked away.';
                characterResponse = 'Alex looked sad and walked away.';
                points = -5;
                emotion = 'sad';
            }
    }
    
    // Update user's points
    updatePoints(points);
    
    // Show the result with character dialogue
    showRoleplayResult(message, characterResponse, emotion);
    
    // Add some delay before showing the next scenario
    setTimeout(() => {
        showNextScenario();
    }, 4000);
}

function showRoleplayResult(userAction, characterResponse, emotion) {
    // Create result container
    const resultContainer = document.createElement('div');
    resultContainer.className = 'roleplay-result';
    
    // Create user action element
    const userActionElement = document.createElement('div');
    userActionElement.className = 'user-action';
    userActionElement.textContent = userAction;
    
    // Create character response element with emotion
    const characterResponseElement = document.createElement('div');
    characterResponseElement.className = `character-response ${emotion}`;
    characterResponseElement.textContent = characterResponse;
    
    // Add character avatar based on emotion
    const characterAvatar = document.createElement('div');
    characterAvatar.className = `character-avatar ${emotion}`;
    
    // Add elements to container
    resultContainer.appendChild(userActionElement);
    resultContainer.appendChild(characterAvatar);
    resultContainer.appendChild(characterResponseElement);
    
    // Add to roleplay section
    const roleplaySection = document.getElementById('roleplay-section');
    
    // Clear previous results
    const previousResults = roleplaySection.querySelectorAll('.roleplay-result');
    previousResults.forEach(result => result.remove());
    
    // Add new result
    roleplaySection.appendChild(resultContainer);
    
    // Add animation
    setTimeout(() => resultContainer.classList.add('show'), 10);
    
    // Play sound based on emotion
    playEmotionSound(emotion);
}

function updatePoints(points) {
    // Get current points or initialize
    let currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
    
    // Update points
    currentPoints += points;
    
    // Save to localStorage
    localStorage.setItem('userPoints', currentPoints);
    
    // Show points notification
    const pointsMessage = points >= 0 ? `+${points} points!` : `${points} points`;
    const pointsType = points >= 0 ? 'success' : 'error';
    
    showNotification(pointsMessage, pointsType);
    
    // Update points display if it exists
    const pointsDisplay = document.querySelector('.points-display');
    if (pointsDisplay) {
        pointsDisplay.textContent = `Points: ${currentPoints}`;
    }
}

function playEmotionSound(emotion) {
    // In a real app, you would play actual sound effects
    console.log(`Playing ${emotion} sound`);
    
    // For demo purposes, just show a notification
    showNotification(`Character feels ${emotion}`, 'info');
}

function showNextScenario() {
    // Clear previous results
    const roleplaySection = document.getElementById('roleplay-section');
    const previousResults = roleplaySection.querySelectorAll('.roleplay-result');
    previousResults.forEach(result => result.remove());
    
    // In a real app, you would have multiple scenarios
    const scenarios = [
        'Making a New Friend',
        'Sharing Toys',
        'Working Together',
        'Being Kind',
        'Resolving Conflict',
        'Including Others'
    ];
    
    // For demo purposes, just show a random scenario
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Update the scenario title
    document.querySelector('.roleplay-section h2').textContent = `Scenario: ${randomScenario}`;
    
    // Update scenario description
    const scenarioDescription = document.querySelector('.roleplay-section p');
    scenarioDescription.textContent = getScenarioDescription(randomScenario);
    
    // Update scenario options
    updateScenarioOptions(randomScenario);
    
    // Show notification
    showNotification(`New scenario: ${randomScenario}`, 'info');
}

function getScenarioDescription(scenario) {
    switch(scenario) {
        case 'Making a New Friend':
            return 'You see a new child at the playground. What do you do?';
        case 'Sharing Toys':
            return 'Another child is looking at your favorite toy. What do you do?';
        case 'Working Together':
            return 'A classmate is struggling with a difficult task. What do you do?';
        case 'Being Kind':
            return 'You see a child who fell down and is crying. What do you do?';
        case 'Resolving Conflict':
            return 'Two friends are arguing about who gets to go first. What do you do?';
        case 'Including Others':
            return 'A new child is watching your game from a distance. What do you do?';
        default:
            return 'Choose an option below to interact with another character:';
    }
}

function updateScenarioOptions(scenario) {
    // Get the buttons container
    const buttonsContainer = document.querySelector('.roleplay-section');
    
    // Remove existing buttons
    const existingButtons = buttonsContainer.querySelectorAll('button');
    existingButtons.forEach(button => button.remove());
    
    // Create new buttons based on scenario
    let options = [];
    
    switch(scenario) {
        case 'Making a New Friend':
            options = [
                { text: 'Greet the child', action: 'greet' },
                { text: 'Ignore the child', action: 'ignore' }
            ];
            break;
        case 'Sharing Toys':
            options = [
                { text: 'Share your toy', action: 'share' },
                { text: 'Keep the toy to yourself', action: 'keep' }
            ];
            break;
        case 'Working Together':
            options = [
                { text: 'Offer to help', action: 'help' },
                { text: 'Work on your own task', action: 'alone' }
            ];
            break;
        case 'Being Kind':
            options = [
                { text: 'Help the child up', action: 'help' },
                { text: 'Walk past', action: 'ignore' }
            ];
            break;
        case 'Resolving Conflict':
            options = [
                { text: 'Suggest talking about it', action: 'talk' },
                { text: 'Walk away', action: 'ignore' }
            ];
            break;
        case 'Including Others':
            options = [
                { text: 'Invite them to join', action: 'invite' },
                { text: 'Continue playing', action: 'ignore' }
            ];
            break;
        default:
            options = [
                { text: 'Greet the character', action: 'greet' },
                { text: 'Ignore the character', action: 'ignore' }
            ];
    }
    
    // Create and add new buttons
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => chooseOption(option.action);
        buttonsContainer.appendChild(button);
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add animation class
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function playSound(type) {
    // In a real app, you would play actual sound effects
    console.log(`Playing ${type} sound`);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 30px;
        background: white;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        background: #4CAF50;
        color: white;
    }
    
    .notification.error {
        background: #FF6B6B;
        color: white;
    }
    
    .notification.info {
        background: #4A90E2;
        color: white;
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .strength-meter {
        --strength: 0%;
        --strength-color: #FF6B6B;
    }
    
    .strength-meter::before {
        width: var(--strength);
        background: var(--strength-color);
    }
`;
document.head.appendChild(style);

// Add CSS for roleplay results
const roleplayStyle = document.createElement('style');
roleplayStyle.textContent = `
    .roleplay-result {
        margin: 20px 0;
        padding: 15px;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.5s ease;
    }
    
    .roleplay-result.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .user-action {
        font-weight: bold;
        color: #4A90E2;
        margin-bottom: 10px;
    }
    
    .character-response {
        padding: 10px;
        border-radius: 10px;
        margin-top: 10px;
        position: relative;
    }
    
    .character-response::before {
        content: '';
        position: absolute;
        top: -10px;
        left: 20px;
        border-width: 0 10px 10px 10px;
        border-style: solid;
    }
    
    .character-response.happy {
        background: #E8F5E9;
        border-left: 4px solid #4CAF50;
    }
    
    .character-response.happy::before {
        border-color: transparent transparent #E8F5E9 transparent;
    }
    
    .character-response.sad {
        background: #FFEBEE;
        border-left: 4px solid #FF6B6B;
    }
    
    .character-response.sad::before {
        border-color: transparent transparent #FFEBEE transparent;
    }
    
    .character-response.disappointed {
        background: #FFF3E0;
        border-left: 4px solid #FFA000;
    }
    
    .character-response.disappointed::before {
        border-color: transparent transparent #FFF3E0 transparent;
    }
    
    .character-response.grateful {
        background: #E3F2FD;
        border-left: 4px solid #2196F3;
    }
    
    .character-response.grateful::before {
        border-color: transparent transparent #E3F2FD transparent;
    }
    
    .character-response.struggling {
        background: #F5F5F5;
        border-left: 4px solid #9E9E9E;
    }
    
    .character-response.struggling::before {
        border-color: transparent transparent #F5F5F5 transparent;
    }
    
    .character-response.angry {
        background: #FFEBEE;
        border-left: 4px solid #F44336;
    }
    
    .character-response.angry::before {
        border-color: transparent transparent #FFEBEE transparent;
    }
    
    .character-response.lonely {
        background: #E8EAF6;
        border-left: 4px solid #3F51B5;
    }
    
    .character-response.lonely::before {
        border-color: transparent transparent #E8EAF6 transparent;
    }
    
    .character-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 10px 0;
        background-size: cover;
        background-position: center;
    }
    
    .character-avatar.happy {
        background-image: url('images/happy.png');
    }
    
    .character-avatar.sad {
        background-image: url('images/sad.png');
    }
    
    .character-avatar.disappointed {
        background-image: url('images/disappointed.png');
    }
    
    .character-avatar.grateful {
        background-image: url('images/grateful.png');
    }
    
    .character-avatar.struggling {
        background-image: url('images/struggling.png');
    }
    
    .character-avatar.angry {
        background-image: url('images/angry.png');
    }
    
    .character-avatar.lonely {
        background-image: url('images/lonely.png');
    }
    
    .points-display {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 10px 20px;
        border-radius: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        font-weight: bold;
        z-index: 100;
    }
`;
document.head.appendChild(roleplayStyle);

// Add points display to the page
document.addEventListener('DOMContentLoaded', () => {
    // Create points display
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'points-display';
    
    // Get current points
    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
    pointsDisplay.textContent = `Points: ${currentPoints}`;
    
    // Add to body
    document.body.appendChild(pointsDisplay);
    
    // Initialize the app
    setupEventListeners();
    setupPasswordStrengthMeter();
    setupAvatarSelection();
    setupFormValidation();
});

// Initialize camera roleplay
function initCameraRoleplay() {
    // Get DOM elements
    const startCameraBtn = document.getElementById('start-camera');
    const stopCameraBtn = document.getElementById('stop-camera');
    const startRecordingBtn = document.getElementById('start-recording');
    const stopRecordingBtn = document.getElementById('stop-recording');
    const nextScenarioBtn = document.getElementById('next-scenario');
    const saveRecordingBtn = document.getElementById('save-recording');
    const discardRecordingBtn = document.getElementById('discard-recording');
    const localVideo = document.getElementById('local-video');
    const previewVideo = document.getElementById('preview-video');
    const recordingPreview = document.getElementById('recording-preview');
    const timerDisplay = document.getElementById('timer');
    const currentScenarioDisplay = document.getElementById('current-scenario');
    const scenarioInstructions = document.getElementById('scenario-instructions');
    
    // Add event listeners
    startCameraBtn.addEventListener('click', startCamera);
    stopCameraBtn.addEventListener('click', stopCamera);
    startRecordingBtn.addEventListener('click', startRecording);
    stopRecordingBtn.addEventListener('click', stopRecording);
    nextScenarioBtn.addEventListener('click', nextScenario);
    saveRecordingBtn.addEventListener('click', saveRecording);
    discardRecordingBtn.addEventListener('click', discardRecording);
    
    // Initialize scenario
    updateScenario();
    
    // Add camera effects
    addCameraEffects();
}

// Start camera
async function startCamera() {
    try {
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showNotification('Your browser does not support camera access', 'error');
            return;
        }
        
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: true
        });
        
        // Display local video
        localVideo.srcObject = stream;
        
        // Update button states
        document.getElementById('start-camera').disabled = true;
        document.getElementById('stop-camera').disabled = false;
        document.getElementById('start-recording').disabled = false;
        
        // Show success notification
        showNotification('Camera started successfully!', 'success');
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showNotification('Could not access camera. Please check permissions.', 'error');
        
        // Show camera permission UI
        showCameraPermissionUI();
    }
}

// Stop camera
function stopCamera() {
    if (stream) {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        
        // Clear video source
        localVideo.srcObject = null;
        
        // Update button states
        document.getElementById('start-camera').disabled = false;
        document.getElementById('stop-camera').disabled = true;
        document.getElementById('start-recording').disabled = true;
        document.getElementById('stop-recording').disabled = true;
        
        // Show notification
        showNotification('Camera stopped', 'info');
    }
}

// Start recording
function startRecording() {
    if (!stream) return;
    
    try {
        // Create MediaRecorder
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });
        
        // Clear previous recordings
        recordedChunks = [];
        
        // Add data available event handler
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        // Add stop event handler
        mediaRecorder.onstop = () => {
            // Create blob from recorded chunks
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            
            // Create URL for the blob
            const url = URL.createObjectURL(blob);
            
            // Set video source
            const previewVideo = document.getElementById('preview-video');
            previewVideo.src = url;
            
            // Show preview
            document.getElementById('recording-preview').style.display = 'block';
            
            // Update button states
            document.getElementById('start-recording').disabled = false;
            document.getElementById('stop-recording').disabled = true;
            
            // Stop timer
            stopTimer();
            
            // Show notification
            showNotification('Recording completed!', 'success');
        };
        
        // Start recording
        mediaRecorder.start();
        
        // Update button states
        document.getElementById('start-recording').disabled = true;
        document.getElementById('stop-recording').disabled = false;
        
        // Start timer
        startTimer();
        
        // Show notification
        showNotification('Recording started!', 'info');
        
    } catch (error) {
        console.error('Error starting recording:', error);
        showNotification('Could not start recording', 'error');
    }
}

// Stop recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}

// Save recording
function saveRecording() {
    // Get the video blob
    const previewVideo = document.getElementById('preview-video');
    const videoUrl = previewVideo.src;
    
    // Create download link
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `roleplay-${cameraScenarios[currentScenarioIndex].title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.webm`;
    a.click();
    
    // Hide preview
    document.getElementById('recording-preview').style.display = 'none';
    
    // Show notification
    showNotification('Recording saved!', 'success');
    
    // Award points for completing the scenario
    updatePoints(20);
}

// Discard recording
function discardRecording() {
    // Hide preview
    document.getElementById('recording-preview').style.display = 'none';
    
    // Show notification
    showNotification('Recording discarded', 'info');
}

// Next scenario
function nextScenario() {
    // Move to next scenario
    currentScenarioIndex = (currentScenarioIndex + 1) % cameraScenarios.length;
    
    // Update scenario
    updateScenario();
    
    // Show notification
    showNotification(`New scenario: ${cameraScenarios[currentScenarioIndex].title}`, 'info');
}

// Update scenario
function updateScenario() {
    const scenario = cameraScenarios[currentScenarioIndex];
    
    // Update scenario title
    document.getElementById('current-scenario').textContent = scenario.title;
    
    // Update scenario instructions
    document.getElementById('scenario-instructions').textContent = scenario.instructions;
    
    // Reset timer
    resetTimer();
}

// Start timer
function startTimer() {
    // Clear any existing interval
    if (timerInterval) clearInterval(timerInterval);
    
    // Reset seconds
    seconds = 0;
    
    // Update timer display
    updateTimerDisplay();
    
    // Start interval
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
        
        // Check if time is up
        if (seconds >= cameraScenarios[currentScenarioIndex].duration) {
            stopRecording();
        }
    }, 1000);
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Reset timer
function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Format as MM:SS
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    // Update display
    document.getElementById('timer').textContent = formattedTime;
}

// Show camera permission UI
function showCameraPermissionUI() {
    // Create permission container
    const permissionContainer = document.createElement('div');
    permissionContainer.className = 'camera-permission';
    
    // Add content
    permissionContainer.innerHTML = `
        <h3>Camera Access Required</h3>
        <p>To use the camera roleplay feature, you need to allow camera access in your browser.</p>
        <p>Please click the camera icon in your browser's address bar and select "Allow" for this website.</p>
        <button id="retry-camera">Try Again</button>
    `;
    
    // Add to camera section
    const cameraSection = document.querySelector('.camera-roleplay-section');
    cameraSection.insertBefore(permissionContainer, cameraSection.firstChild);
    
    // Add event listener to retry button
    document.getElementById('retry-camera').addEventListener('click', () => {
        // Remove permission UI
        permissionContainer.remove();
        
        // Try starting camera again
        startCamera();
    });
}

// Add camera effects
function addCameraEffects() {
    // Create effects container
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'camera-effects';
    
    // Define effects
    const effects = [
        { name: 'normal', icon: '🔄' },
        { name: 'grayscale', icon: '⚫' },
        { name: 'sepia', icon: '🟤' },
        { name: 'invert', icon: '🔄' },
        { name: 'blur', icon: '🔍' },
        { name: 'brightness', icon: '☀️' },
        { name: 'contrast', icon: '🌓' },
        { name: 'saturate', icon: '🌈' }
    ];
    
    // Add effect buttons
    effects.forEach(effect => {
        const button = document.createElement('div');
        button.className = `effect-button ${effect.name === 'normal' ? 'active' : ''}`;
        button.textContent = effect.icon;
        button.title = effect.name.charAt(0).toUpperCase() + effect.name.slice(1);
        
        // Add click event
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.effect-button').forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Apply filter
            applyFilter(effect.name);
        });
        
        effectsContainer.appendChild(button);
    });
    
    // Add to video container
    const videoContainer = document.querySelector('.video-container');
    videoContainer.appendChild(effectsContainer);
}

// Apply filter to video
function applyFilter(filterName) {
    // Get video element
    const localVideo = document.getElementById('local-video');
    
    // Remove all filter classes
    localVideo.classList.remove(
        'filter-grayscale',
        'filter-sepia',
        'filter-invert',
        'filter-blur',
        'filter-brightness',
        'filter-contrast',
        'filter-saturate'
    );
    
    // Add new filter class
    if (filterName !== 'normal') {
        localVideo.classList.add(`filter-${filterName}`);
    }
    
    // Update current filter
    currentFilter = filterName;
    
    // Show notification
    showNotification(`Applied ${filterName} filter`, 'info');
}

// Evaluation Functions
function showEvaluation() {
    const scores = generateScores();
    updateEvaluationDisplay(scores);
    evaluationSection.style.display = 'block';
}

function hideEvaluation() {
    evaluationSection.style.display = 'none';
}

function generateScores() {
    return {
        confidence: Math.floor(Math.random() * 40) + 60,
        clarity: Math.floor(Math.random() * 40) + 60,
        creativity: Math.floor(Math.random() * 40) + 60,
        effort: Math.floor(Math.random() * 40) + 60
    };
}

function updateEvaluationDisplay(scores) {
    const totalScore = Math.round((scores.confidence + scores.clarity + scores.creativity + scores.effort) / 4);
    
    document.getElementById('score-value').textContent = totalScore;
    document.getElementById('confidence-value').textContent = scores.confidence;
    document.getElementById('clarity-value').textContent = scores.clarity;
    document.getElementById('creativity-value').textContent = scores.creativity;
    document.getElementById('effort-value').textContent = scores.effort;
    
    // Animate score bars
    setTimeout(() => {
        document.getElementById('confidence-score').style.width = scores.confidence + '%';
        document.getElementById('clarity-score').style.width = scores.clarity + '%';
        document.getElementById('creativity-score').style.width = scores.creativity + '%';
        document.getElementById('effort-score').style.width = scores.effort + '%';
    }, 100);
    
    // Update feedback
    const feedback = generateFeedback(scores);
    document.getElementById('feedback-text').textContent = feedback.text;
    
    // Update badges
    const badges = document.querySelectorAll('.badge');
    badges.forEach((badge, index) => {
        badge.textContent = feedback.badges[index];
    });
}

function generateFeedback(scores) {
    const feedbacks = [
        {
            text: "Excellent performance! You showed great confidence and creativity.",
            badges: ["Confident", "Creative", "Star Performer"]
        },
        {
            text: "Good job! Your clarity and effort were impressive.",
            badges: ["Clear", "Hardworking", "Team Player"]
        },
        {
            text: "Well done! You demonstrated strong communication skills.",
            badges: ["Communicator", "Friendly", "Helpful"]
        }
    ];
    
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function shareEvaluation() {
    // In a real application, this would send the evaluation to parents/teachers
    showNotification('Evaluation shared successfully!', 'success');
}

   
