# Neon Pong - Test Cases

Use this file to track manual verification steps. Each test case should be verified before a release.

## Test Suite: Gameplay Mechanics

| ID | Test Case | Steps | Expected Result | Pass/Fail |
|----|-----------|-------|-----------------|-----------|
| **GM-01** | **Game Start** | 1. Open game.<br>2. Press `Space`. | Game transitions from Title Screen to active gameplay. Ball starts moving. | |
| **GM-02** | **Paddle Movement** | 1. Press `ArrowUp`.<br>2. Press `ArrowDown`. | Player paddle moves up and down. Paddle stops at screen edges (does not go out of bounds). | |
| **GM-03** | **Ball Bounce (Walls)** | 1. Let ball hit top/bottom wall. | Ball bounces off with correct angle. No sticky behavior. | |
| **GM-04** | **Ball Bounce (Paddle)**| 1. Intercept ball with paddle. | Ball reflects. Hitting edges creates sharper angles. Particles spawn on impact. | |
| **GM-05** | **Scoring - Player** | 1. Hit ball past Computer. | Player score increases by 1. Ball resets to enter. | |
| **GM-06** | **Scoring - CPU** | 1. Let ball pass Player. | Computer score increases by 1. Ball resets to center. | |
| **GM-07** | **Win Condition** | 1. Score 10 points. | Game stops. Text "Player Wins!" appears. "Click to Restart" appears. Control freezes. | |
| **GM-08** | **Loser Condition** | 1. Let CPU score 10 points. | Game stops. Text "Computer Wins!" appears. | |
| **GM-09** | **Game Restart** | 1. Trigger Game Over.<br>2. Click Mouse. | Scores reset to 0-0. Paddles reset positions. Game starts immediately. | |

## Test Suite: Visuals & UX

| ID | Test Case | Steps | Expected Result | Pass/Fail |
|----|-----------|-------|-----------------|-----------|
| **VX-01** | **Neon Glow** | 1. Observe Canvas borders. | Cyan glow effect is visible around the game border. | |
| **VX-02** | **Particle FX** | 1. Hit ball with paddle. | Small colored particles explode at impact point and fade out. | |
| **VX-03** | **Font Rendering** | 1. Check Score/Text. | Font is `Courier New` (Monospace). Numbers are aligned correctly. | |

## Test Suite: Edge Cases

| ID | Test Case | Steps | Expected Result | Pass/Fail |
|----|-----------|-------|-----------------|-----------|
| **EC-01** | **Window Focus** | 1. Switch tabs while playing.<br>2. Return. | Game should continue (or pause if implemented). *Currently: Game runs in background.* | |
| **EC-02** | **Simultaneous Input**| 1. Hold Up + Down. | Paddle should stop or prioritize last key (depending on logic). | |

## Test Suite: New Features (Phase 2)

| ID | Test Case | Steps | Expected Result | Pass/Fail |
|----|-----------|-------|-----------------|-----------|
| **NF-01** | **Sound Effects** | 1. Hit ball.<br>2. Hit wall.<br>3. Score point. | Audio plays distinct sounds for hit (blip), wall (bop), and score (chime). | |
| **NF-02** | **Difficulty Select** | 1. On Start Screen, press `1`, `2`, `3`. | Highlight color changes (Green/Yellow/Red). Difficulty variable updates. | |
| **NF-03** | **Mobile Touch** | 1. Use Mobile Device Emulation.<br>2. Touch & Drag paddle. | Paddle follows finger position instantly. Touch does not scroll page (`preventDefault`). | |
| **NF-04** | **Power-up Spawn** | 1. Wait 15 seconds. | A Power-up (Green or Red box) appears in the central area. | |
| **NF-05** | **Big Paddle** | 1. Hit Green Power-up with ball. | Player paddle grows to 150px height for 10s, then shrinks back. | |
| **NF-06** | **Fast Ball** | 1. Hit Red Power-up with ball. | Ball speed visibly increases. | |
