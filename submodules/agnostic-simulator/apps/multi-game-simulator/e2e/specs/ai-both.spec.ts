import { test, expect } from "@playwright/test";

test.describe("?ai=both unattended mode", () => {
  test("drives both greedy AIs to game end", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/gameStart?ai=both&ai-mode=auto&ai-speed=fast");
    await expect(page.locator('[data-testid="board-wrap"]')).toBeVisible({ timeout: 10000 });

    // Wait for the game to end — with fast AI speed both sides should resolve quickly.
    // The end-game modal appears when the match is over.
    const endGameModal = page.locator("role=dialog");
    await expect(endGameModal).toBeVisible({ timeout: 60000 });
  });
});
