# ChromaQuest - Master the Art of Color 🎨

A stunning, modern RGB color guessing game with beautiful animations, multiple game modes, and an engaging gameplay experience.

## Features ✨

- **4 Game Modes**: Classic, Timed Rush, Endless, and Expert
- **5 Difficulty Levels**: From Easy (3 colors) to Master (16 colors)
- **Beautiful UI**: Gradient animations, particle effects, and smooth transitions
- **Sound Effects**: Audio feedback using Web Audio API
- **Score System**: Points, streaks, and achievements
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Responsive Design**: Works perfectly on all devices
- **Local Storage**: Saves your best score and theme preference

## How to Launch on Windows 11 🚀

### Method 1: Direct Browser Opening (Easiest)

1. **Navigate to the game folder**:
   - Open File Explorer (Win + E)
   - Navigate to: `E:\Projects\TheColorGame\ChromaQuest`

2. **Open the game**:
   - Double-click on `index.html`
   - The game will open in your default browser

### Method 2: Using Python HTTP Server (Recommended)

1. **Open Terminal/PowerShell**:
   - Press `Win + X` and select "Windows Terminal" or "PowerShell"

2. **Navigate to the game directory**:
   ```bash
   cd E:\Projects\TheColorGame\ChromaQuest
   ```

3. **Start a local server** (choose one):
   
   **Option A - Python 3** (if installed):
   ```bash
   python -m http.server 8000
   ```
   
   **Option B - Python 2** (if installed):
   ```bash
   python -m SimpleHTTPServer 8000
   ```

4. **Open the game**:
   - Open your browser
   - Go to: `http://localhost:8000`

### Method 3: Using Node.js HTTP Server

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Install with default settings

2. **Install http-server globally**:
   ```bash
   npm install -g http-server
   ```

3. **Navigate to game directory**:
   ```bash
   cd E:\Projects\TheColorGame\ChromaQuest
   ```

4. **Start the server**:
   ```bash
   http-server -p 8080
   ```

5. **Open the game**:
   - Go to: `http://localhost:8080`

### Method 4: Using Live Server in VS Code

1. **Open VS Code**
2. **Install Live Server extension** (if not installed)
3. **Open the ChromaQuest folder**
4. **Right-click on `index.html`**
5. **Select "Open with Live Server"**

## Game Instructions 🎮

### How to Play
1. Look at the RGB values displayed (e.g., RGB(255, 128, 64))
2. Click on the color square that matches those RGB values
3. Score points for correct guesses and build streaks
4. Use hints if you're stuck (costs 50 points)

### Game Modes
- **Classic**: One mistake ends the game
- **Timed Rush**: 30 seconds to score as many points as possible
- **Endless**: Keep playing until you decide to stop
- **Expert**: RGB values are hidden - pure color matching!

### Scoring
- Base points vary by difficulty (Easy: 50, Medium: 100, Hard: 150, Expert: 200, Master: 300)
- Streak multiplier: +10% per consecutive correct answer
- Timed mode: 1.5x multiplier

## Browser Compatibility 🌐

Works best on:
- Chrome (Recommended)
- Firefox
- Edge
- Safari

## Troubleshooting 🔧

**Game not loading?**
- Ensure all files (index.html, styles.css, game.js) are in the same folder
- Try a different browser
- Check browser console for errors (F12)

**No sound?**
- Click the sound button to toggle
- Ensure browser allows audio
- Some browsers require user interaction before playing sounds

**Theme not saving?**
- Enable cookies/local storage in your browser
- Check privacy settings

## Development 💻

Built with:
- Vanilla JavaScript (ES6+)
- CSS3 with animations and gradients
- HTML5
- Web Audio API for sound effects

## License 📄

This game is open source and available for personal use and modification.

---

Enjoy ChromaQuest! 🎨✨