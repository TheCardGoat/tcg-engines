import { test, expect } from "@playwright/test";

test.describe("?ai=both unattended mode", () => {
  test("steps a seeded practice AI mirror through visible controls", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto("/cyberpunk/simulator/practice");
    await page.getByTestId("practice-setup-your-deck").selectOption("arasaka-print-n-play");
    await page.getByTestId("practice-setup-bot-deck").selectOption("merc-print-n-play");
    await page.getByTestId("practice-setup-player-strategy").selectOption("first-legal");
    await page.getByTestId("practice-setup-bot-strategy").selectOption("first-legal");
    await page.getByTestId("practice-setup-seed").fill("e2e-ai-mirror-seed");
    await page.getByTestId("practice-setup-start").click();

    await expect(page.getByTestId("practice-match-seed")).toHaveAttribute(
      "data-seed",
      "e2e-ai-mirror-seed",
    );

    const panel = page.getByTestId("ai-control-panel").first();
    await expect(panel).toBeVisible({ timeout: 10000 });
    await page.getByTestId("ai-mode-step").first().click();
    await expect(panel).toHaveAttribute("data-mode", "step");

    const initialLogCount = await page.getByTestId("ai-log-entry").count();
    for (let i = 0; i < 4; i += 1) {
      await expect(panel).not.toHaveAttribute("data-next-ai-side", "none", { timeout: 10000 });
      await page.getByTestId("ai-step").first().click();
      await expect(page.getByTestId("ai-log-entry")).toHaveCount(initialLogCount + i + 1, {
        timeout: 10000,
      });
    }

    await expect(page.locator('[data-testid="hand-zone"][data-side="player"]')).toHaveAttribute(
      "data-count",
      /\d+/,
    );
    await expect(page.locator('[data-testid="field-zone"][data-side="player"]')).toBeVisible();
  });
});
