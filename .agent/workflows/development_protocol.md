---
description: Protocol for developing features and proper Git usage for this project.
---

# Development Protocol

All AI agents working on this project must strictly follow this protocol.

## 1. Branching Strategy
- **NEVER** commit directly to `main`.
- **Feature Branches**: Use `feature/description` (e.g., `feature/add-scoreboard`).
- **Bug Fix Branches**: Use `fix/description` (e.g., `fix/ball-collision`).

## 2. Development Loop
1.  **Create Branch**: `git checkout -b feature/my-feature`
2.  **Implement**: Write code and tests.
3.  **Verify Locally**: Run `npx playwright test` to ensure tests pass.
4.  **Commit**: `git commit -m "Description of changes"`
5.  **Push**: `git push -u origin feature/my-feature`

## 3. Pull Request & Merge
1.  **Create PR**: usage `gh pr create --fill` to create a PR.
2.  **Auto-Merge**: The CI system is configured to automatically merge PRs that pass all tests.
3.  **Do Not Force Merge**: If tests fail, fix the code and push again.
