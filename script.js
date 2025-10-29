class TypeX {
    constructor() {
        this.currentLevel = '';
        this.testText = '';
        this.startTime = null;
        this.timer = 60;
        this.timerInterval = null;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.isTestActive = false;
        this.levels = ['beginner', 'experienced', 'pro'];
        
        this.texts = {
            beginner: [
                "the quick brown fox jumps over the lazy dog and runs through the green forest with amazing speed and grace while birds sing",
                "hello world this is a simple typing test for beginners who want to improve their keyboard skills and typing speed every single day",
                "practice makes perfect so keep typing every day to build muscle memory and increase your words per minute typing speed significantly over time"
            ],
            experienced: [
                "JavaScript is a versatile programming language used for web development that enables interactive websites with dynamic content and modern user interfaces across all platforms",
                "The modern web relies heavily on responsive design and user experience principles to create engaging applications that work seamlessly on desktop mobile and tablet devices",
                "Coding requires patience practice and continuous learning to master complex algorithms data structures and software engineering principles that drive technological innovation and digital transformation"
            ],
            pro: [
                "Asynchronous programming paradigms enable efficient handling of concurrent operations through event loops promises and callback mechanisms that optimize performance in distributed systems and microservices architectures",
                "Machine learning algorithms revolutionize data analysis and predictive modeling by leveraging neural networks deep learning frameworks and statistical methods to extract meaningful insights from datasets",
                "Quantum computing represents the next frontier in computational capabilities utilizing quantum mechanics principles like superposition and entanglement to solve complex problems exponentially faster than classical computers"
            ]
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentLevel = e.target.dataset.level;
                this.startTest();
            });
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartTest();
        });
        
        document.getElementById('home-btn').addEventListener('click', () => {
            this.goHome();
        });
        
        document.getElementById('typing-input').addEventListener('input', (e) => {
            this.handleTyping(e);
        });
        
        document.getElementById('restart-result-btn').addEventListener('click', () => {
            this.hideResultScreen();
            this.restartTest();
        });
        
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.nextLevel();
        });
    }
    
    startTest() {
        document.querySelector('.hero-section').classList.add('hidden');
        document.getElementById('typing-test').classList.remove('hidden');
        
        this.testText = this.getRandomText();
        this.displayText();
        this.resetStats();
        
        document.getElementById('typing-input').focus();
    }
    
    getRandomText() {
        const texts = this.texts[this.currentLevel];
        return texts[Math.floor(Math.random() * texts.length)];
    }
    
    displayText() {
        const display = document.getElementById('text-display');
        display.innerHTML = this.testText.split('').map((char, index) => 
            `<span id="char-${index}">${char}</span>`
        ).join('');
    }
    
    handleTyping(e) {
        if (!this.isTestActive) {
            this.startTimer();
            this.isTestActive = true;
        }
        
        const input = e.target.value;
        this.currentIndex = input.length;
        this.totalChars = Math.max(this.totalChars, this.currentIndex);
        
        this.updateDisplay(input);
        this.calculateStats(input);
        
        if (input === this.testText) {
            this.endTest();
        }
    }
    
    updateDisplay(input) {
        const chars = document.querySelectorAll('#text-display span');
        
        chars.forEach((char, index) => {
            char.className = '';
            if (index < input.length) {
                if (input[index] === this.testText[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            } else if (index === input.length) {
                char.classList.add('current');
            }
        });
    }
    
    calculateStats(input) {
        this.correctChars = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === this.testText[i]) {
                this.correctChars++;
            }
        }
        
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        document.getElementById('accuracy').textContent = accuracy;
        
        const timeElapsed = this.startTime ? (Date.now() - this.startTime) / 1000 / 60 : 0;
        const wpm = timeElapsed > 0 ? Math.round((this.correctChars / 5) / timeElapsed) : 0;
        document.getElementById('wpm').textContent = wpm;
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.timer--;
            document.getElementById('timer').textContent = this.timer;
            
            if (this.timer <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    endTest() {
        this.isTestActive = false;
        clearInterval(this.timerInterval);
        document.getElementById('typing-input').disabled = true;
        
        setTimeout(() => {
            this.showResultScreen();
        }, 500);
    }
    
    restartTest() {
        this.hideResultScreen();
        this.resetStats();
        this.testText = this.getRandomText();
        this.displayText();
        document.getElementById('typing-input').value = '';
        document.getElementById('typing-input').disabled = false;
        document.getElementById('typing-input').focus();
    }
    
    resetStats() {
        this.timer = 60;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.isTestActive = false;
        this.startTime = null;
        
        clearInterval(this.timerInterval);
        
        document.getElementById('timer').textContent = '60';
        document.getElementById('wpm').textContent = '0';
        document.getElementById('accuracy').textContent = '100';
    }
    
    goHome() {
        document.getElementById('typing-test').classList.add('hidden');
        document.querySelector('.hero-section').classList.remove('hidden');
        this.hideResultScreen();
        this.resetStats();
        document.getElementById('typing-input').value = '';
        document.getElementById('typing-input').disabled = false;
    }
    
    showResultScreen() {
        const finalTime = 60 - this.timer;
        document.getElementById('final-wpm').textContent = document.getElementById('wpm').textContent;
        document.getElementById('final-accuracy').textContent = document.getElementById('accuracy').textContent + '%';
        document.getElementById('final-time').textContent = finalTime + 's';
        
        const nextLevelBtn = document.getElementById('next-level-btn');
        const currentLevelIndex = this.levels.indexOf(this.currentLevel);
        if (currentLevelIndex === this.levels.length - 1) {
            nextLevelBtn.textContent = 'Home';
        } else {
            nextLevelBtn.textContent = 'Next Level';
        }
        
        const overlay = document.getElementById('result-overlay');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('show'), 10);
    }
    
    hideResultScreen() {
        const overlay = document.getElementById('result-overlay');
        overlay.classList.remove('show');
        setTimeout(() => overlay.classList.add('hidden'), 500);
    }
    
    nextLevel() {
        const currentLevelIndex = this.levels.indexOf(this.currentLevel);
        if (currentLevelIndex < this.levels.length - 1) {
            this.currentLevel = this.levels[currentLevelIndex + 1];
            this.hideResultScreen();
            this.restartTest();
        } else {
            this.hideResultScreen();
            this.goHome();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TypeX();
});