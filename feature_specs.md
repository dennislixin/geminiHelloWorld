# Neon Pong - Feature Specification

## Overview
Neon Pong is a modern, high-contrast arcade tennis game built with HTML5 Canvas. It features a cyberpunk aesthetic, particle effects, and a competitive "First to 10" gameplay loop.

## Core Features

### 1. Game Rules & Mechanics
- **Win Condition**: The first player (human or computer) to reach **10 points** wins the match.
- **Scoring**: A point is scored when the ball passes the opponent's paddle and touches the left or right screen edge.
- **Game Over**: When a player wins, the game pauses, displays the winner, and waits for a user click to restart.
- **Ball Physics**:
    - The ball bounces off the top and bottom walls with perfect elasticity.
    - Hitting a paddle reflects the ball. The angle of reflection depends on where the ball hits the paddle (center = straight, edges = sharper angle).
    - **Speed Increase**: Ball speed resets to default on serve, but speed increases over time (every 20 seconds) if no point is scored.
    - **Power-ups**:
        - **Big Paddle (P)**: Increases paddle height by 50% for 10 seconds. Green.
        - **Fast Ball (F)**: Increases ball speed by 5. Red.

### 2. Controls
- **Player (Left Paddle)**:
    - **Desktop**:
        - `ArrowUp` / `ArrowDown`: Move Paddle.
        - `Space`: Start game.
        - `1/2/3`: Select Difficulty (1=Easy, 2=Medium, 3=Hard) on Start Screen.
    - **Mobile**:
        - `Touch`: Start game.
        - `Drag`: Move paddle (follows finger Y position).
- **Computer (Right Paddle)**:
    - AI tracks ball with reaction speed based on Difficulty.
    - **Levels**:
        - **Easy (1)**: Slow reaction, random errors.
        - **Medium (2)**: Standard tracking.
        - **Hard (3)**: Fast tracking, almost perfect defense.

### 3. Visuals & Audio
- **Theme**: Neon / Cyberpunk.
    - Background: Dark Grey ` #121212`.
    - Player Color: Cyan `#0ff` with glow.
    - Computer Color: Magenta `#f0f` with glow.
    - Ball Color: Yellow `#ff0`.
- **Effects**:
    - **Glow**: CSS Box Shadow on the canvas.
    - **Particles**: Burst of colored particles when the ball hits a paddle.
    - **Typography**: Retro-tech font (`Courier New`).

### 4. Technical Specs
- **Resolution**: 800x600 (Fixed Canvas Size).
- **Responsive**: Centered in viewport. Canvas scales via CSS but internal resolution is 800x600.
- **Platform**: Web Browser (Desktop & Mobile).
- **Audio**: Web Audio API (Synthesized Beeps).
    - `Hit`: Square wave.
    - `Wall`: Sine wave.
    - `Score`: Triangle wave (musical chime).

## Future Roadmap (Planned)
- [ ] **Sound Effects**: Add audio for hits, score, and win.
- [ ] **Mobile Support**: Touch controls for paddle movement.
- [ ] **Difficulty Selection**: Easy / Normal / Hard AI settings.
- [ ] **Power-ups**: Random spawns that change paddle size or ball speed.
