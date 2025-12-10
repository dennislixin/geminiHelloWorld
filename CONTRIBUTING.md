# Contributing Guide

## Reporting Bugs & Features
- **Issues**: Always start by creating a GitHub Issue to track the bug or feature request.
- **Templates**: Use the provided "Bug Report" or "Feature Request" templates.

## Development Rules
1.  **No Direct Pushes to Main**: All changes must go through a Pull Request.
2.  **Branch Naming**:
    - Features: `feature/issues_id-name`
    - Fixes: `fix/issue_id-name`
3.  **Testing**: All PRs must pass the automated `npx playwright test` suite.
4.  **Auto-Merge**: Valid PRs passing tests will be automatically merged and deployed.
