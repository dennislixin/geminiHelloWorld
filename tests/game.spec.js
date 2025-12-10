const { test, expect } = require('@playwright/test');

test('game loads and canvas is visible', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Tennis Game/i);

    // Check canvas exists
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();

    // Check if game starts (based on state)
    // Initially game should not be started
    const gameStarted = await page.evaluate(() => window.game.gameStarted);
    expect(gameStarted).toBe(false);
});

test('game starts on spacebar', async ({ page }) => {
    await page.goto('/');

    // Press space to start
    await page.keyboard.press('Space');

    // Game should be started
    await expect.poll(async () => {
        return await page.evaluate(() => window.game.gameStarted);
    }, {
        message: 'Game should be started after pressing Space',
        timeout: 5000,
    }).toBe(true);
});
