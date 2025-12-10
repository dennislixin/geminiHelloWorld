const { test, expect } = require('@playwright/test');

test('game loads and canvas is visible', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Tennis Game/i);

    // Check canvas exists
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();

    // Check if game starts (based on text)
    await expect(page.getByText('Press Space to Start')).toBeVisible();
});

test('game starts on spacebar', async ({ page }) => {
    await page.goto('/');

    // Press space to start
    await page.keyboard.press('Space');

    // "Press Space to Start" should disappear
    await expect(page.getByText('Press Space to Start')).not.toBeVisible();
});
