class ChromaQuest {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.bestScore = localStorage.getItem('chromaQuest_bestScore') || 0;
        this.targetColor = null;
        this.options = [];
        this.gameMode = 'classic';
        this.difficulty = 'medium';
        this.soundEnabled = true;
        this.hintsUsed = 0;
        this.correctGuesses = 0;
        this.totalGuesses = 0;
        this.timeRemaining = 30;
        this.timerInterval = null;
        this.audioContext = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.loadTheme();
        this.updateBestScore();
        this.startNewGame();
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    playSound(type) {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'correct':
                oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
                oscillator.frequency.exponentialRampToValueAtTime(1046.50, this.audioContext.currentTime + 0.1); // C6
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                break;
            case 'wrong':
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                break;
            case 'achievement':
                oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
                oscillator.frequency.setValueAtTime(554.37, this.audioContext.currentTime + 0.1); // C#5
                oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.2); // E5
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
                break;
        }
        
        oscillator.type = 'sine';
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.6);
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (20 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    setupEventListeners() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('soundBtn').addEventListener('click', () => this.toggleSound());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.startNewGame();
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameMode = e.target.dataset.mode;
                // Reset timer display based on mode
                if (this.gameMode === 'endless') {
                    document.getElementById('timer').textContent = '∞';
                } else if (this.gameMode !== 'timed') {
                    document.getElementById('timer').textContent = '30s';
                }
                this.startNewGame();
            });
        });

        document.querySelector('.play-again').addEventListener('click', () => {
            this.hideModal();
            this.startNewGame();
        });

        document.querySelector('.share-btn').addEventListener('click', () => this.shareScore());
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('chromaQuest_theme', isLight ? 'light' : 'dark');
        document.querySelector('.theme-icon').textContent = isLight ? '☀️' : '🌙';
    }

    loadTheme() {
        const theme = localStorage.getItem('chromaQuest_theme');
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            document.querySelector('.theme-icon').textContent = '☀️';
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        document.getElementById('soundBtn').querySelector('.btn-icon').textContent = 
            this.soundEnabled ? '🔊' : '🔇';
    }

    startNewGame() {
        this.score = 0;
        this.streak = 0;
        this.hintsUsed = 0;
        this.correctGuesses = 0;
        this.totalGuesses = 0;
        this.updateScore();
        this.updateStreak();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        if (this.gameMode === 'timed') {
            this.startTimer();
        } else if (this.gameMode === 'endless') {
            document.getElementById('timer').textContent = '∞';
        }

        this.generateNewRound();
    }

    startTimer() {
        this.timeRemaining = 30;
        this.updateTimer();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.endGame();
            }
        }, 1000);
    }

    updateTimer() {
        document.getElementById('timer').textContent = `${this.timeRemaining}s`;
    }

    generateNewRound() {
        const colorCount = this.getColorCount();
        this.targetColor = this.generateRandomColor();
        this.options = [this.targetColor];

        for (let i = 1; i < colorCount; i++) {
            let newColor;
            do {
                newColor = this.generateRandomColor();
            } while (this.options.some(color => this.colorsAreTooSimilar(color, newColor)));
            this.options.push(newColor);
        }

        this.options.sort(() => Math.random() - 0.5);
        this.displayColors();
    }

    getColorCount() {
        const counts = {
            easy: 3,
            medium: 6,
            hard: 9,
            expert: 12,
            master: 16
        };
        return counts[this.difficulty];
    }

    generateRandomColor() {
        return {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        };
    }

    colorsAreTooSimilar(color1, color2) {
        const threshold = this.difficulty === 'master' ? 30 : 50;
        const distance = Math.sqrt(
            Math.pow(color1.r - color2.r, 2) +
            Math.pow(color1.g - color2.g, 2) +
            Math.pow(color1.b - color2.b, 2)
        );
        return distance < threshold;
    }

    displayColors() {
        const colorDisplay = document.getElementById('colorDisplay');
        const rgbValues = document.getElementById('rgbValues');
        const colorOptions = document.getElementById('colorOptions');

        if (this.gameMode === 'expert') {
            // Expert mode: Show the color, guess the RGB
            colorDisplay.style.background = `rgb(${this.targetColor.r}, ${this.targetColor.g}, ${this.targetColor.b})`;
            rgbValues.textContent = 'Guess the RGB values!';
            colorDisplay.classList.add('expert-mode');
            
            // Show RGB values as options instead of colors
            colorOptions.innerHTML = '';
            colorOptions.classList.add('expert-options');
            this.options.forEach((color, index) => {
                const option = document.createElement('div');
                option.className = 'color-option rgb-option';
                option.innerHTML = `<span class="rgb-text">RGB(${color.r}, ${color.g}, ${color.b})</span>`;
                option.dataset.index = index;
                option.addEventListener('click', (e) => this.checkAnswer(e.currentTarget, color));
                colorOptions.appendChild(option);
            });
        } else {
            // Normal modes: Show RGB, guess the color
            colorDisplay.style.background = '';
            colorDisplay.classList.remove('expert-mode');
            colorOptions.classList.remove('expert-options');
            rgbValues.textContent = `RGB(${this.targetColor.r}, ${this.targetColor.g}, ${this.targetColor.b})`;
            
            colorOptions.innerHTML = '';
            this.options.forEach((color, index) => {
                const option = document.createElement('div');
                option.className = 'color-option';
                option.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
                option.dataset.index = index;
                option.addEventListener('click', (e) => this.checkAnswer(e.currentTarget, color));
                colorOptions.appendChild(option);
            });
        }
    }

    checkAnswer(element, selectedColor) {
        this.totalGuesses++;
        
        if (this.colorsMatch(selectedColor, this.targetColor)) {
            element.classList.add('correct');
            this.correctGuesses++;
            this.streak++;
            this.updateScore(this.calculatePoints());
            this.updateStreak();
            this.playSound('correct');
            
            if (this.streak % 5 === 0) {
                this.showAchievement(`${this.streak} Streak! 🔥`);
            }
            
            setTimeout(() => {
                if (this.gameMode !== 'endless' || this.timeRemaining > 0) {
                    this.generateNewRound();
                }
            }, 800);
        } else {
            element.classList.add('wrong');
            this.streak = 0;
            this.updateStreak();
            this.playSound('wrong');
            
            if (this.gameMode === 'classic') {
                setTimeout(() => this.endGame(), 1000);
            }
        }
    }

    colorsMatch(color1, color2) {
        return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
    }

    calculatePoints() {
        let points = 100;
        const multipliers = {
            easy: 0.5,
            medium: 1,
            hard: 1.5,
            expert: 2,
            master: 3
        };
        
        points *= multipliers[this.difficulty];
        points *= (1 + this.streak * 0.1);
        
        if (this.gameMode === 'timed') {
            points *= 1.5;
        }
        
        return Math.round(points);
    }

    showHint() {
        if (this.hintsUsed >= 3) return;
        
        this.hintsUsed++;
        this.score = Math.max(0, this.score - 50);
        this.updateScore();
        
        // Find and shake the correct answer
        const correctIndex = this.options.findIndex(color => 
            this.colorsMatch(color, this.targetColor)
        );
        
        const correctOption = document.querySelector(`.color-option[data-index="${correctIndex}"]`);
        if (correctOption) {
            correctOption.classList.add('hint-shake');
            setTimeout(() => {
                correctOption.classList.remove('hint-shake');
            }, 1000);
        }
    }

    rgbToHex(color) {
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.updateBestScore();
        }
    }

    updateStreak() {
        document.getElementById('streak').textContent = this.streak;
    }

    updateBestScore() {
        document.getElementById('best').textContent = this.bestScore;
        localStorage.setItem('chromaQuest_bestScore', this.bestScore);
    }

    showAchievement(text) {
        const popup = document.getElementById('achievementPopup');
        popup.querySelector('.achievement-text').textContent = text;
        popup.classList.add('show');
        this.playSound('achievement');
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }

    endGame() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const accuracy = this.totalGuesses > 0 
            ? Math.round((this.correctGuesses / this.totalGuesses) * 100) 
            : 0;
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalStreak').textContent = this.streak;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        
        this.showModal();
    }

    showModal() {
        document.getElementById('gameOverModal').classList.add('show');
    }

    hideModal() {
        document.getElementById('gameOverModal').classList.remove('show');
    }

    shareScore() {
        const text = `I scored ${this.score} points in ChromaQuest! Can you beat my score? 🎨`;
        
        if (navigator.share) {
            navigator.share({
                title: 'ChromaQuest Score',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text);
            this.showAchievement('Score copied to clipboard! 📋');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChromaQuest();
});