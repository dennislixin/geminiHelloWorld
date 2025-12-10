---
description: Protocol for developing features and proper Git usage for this project.
---

# Development Protocol

All AI agents working on this project must strictly follow this protocol.

## 1. Issue-Driven Workflow
- **Rules**: Every change must be linked to a GitHub Issue.
- **Find Issue**: Check existing issues or create a new one using the standard templates.

## 2. Branching Strategy
- **NEVER** commit directly to `main`.
- **Feature Branches**: Use `feature/ISSUE_ID-description` (e.g., `feature/12-add-scoreboard`).
- **Bug Fix Branches**: Use `fix/ISSUE_ID-description` (e.g., `fix/45-ball-collision`).

## 3. Development Loop
1.  **Find/Create Issue**: Understand the requirement.
2.  **Create Branch**: `git checkout -b feature/123-my-feature`
3.  **Implement**: Write code and tests.
4.  **Verify Locally**: Run `npx playwright test` to ensure tests pass.
5.  **Commit**: `git commit -m "Description of changes (fixes #123)"`
6.  **Push**: `git push -u origin feature/123-my-feature`

## 4. Pull Request & Merge
1.  **Create PR**: usage `gh pr create --fill` to create a PR.
2.  **Auto-Merge**: The CI system is configured to automatically merge PRs that pass all tests.
3.  **Do Not Force Merge**: If tests fail, fix the code and push again.
