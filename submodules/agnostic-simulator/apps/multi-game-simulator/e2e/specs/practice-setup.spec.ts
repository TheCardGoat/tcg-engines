import { test, expect } from "@playwright/test";

test.describe("Practice match setup", () => {
  test("practice page loads with print-and-play decks", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/practice");
    await expect(page.getByTestId("practice-setup-title")).toBeVisible();
    await expect(page.getByTestId("practice-setup-your-deck")).toBeVisible();
    await expect(page.getByTestId("practice-setup-bot-deck")).toBeVisible();
    await expect(page.getByTestId("practice-setup-bot-strategy")).toBeVisible();
    await expect(page.getByTestId("practice-setup-start")).toBeVisible();

    const yourDeck = page.getByTestId("practice-setup-your-deck");
    await expect(yourDeck.locator("option[value='arasaka-print-n-play']")).toHaveCount(1);
    await expect(yourDeck.locator("option[value='merc-print-n-play']")).toHaveCount(1);

    const botDeck = page.getByTestId("practice-setup-bot-deck");
    await expect(botDeck.locator("option[value='arasaka-print-n-play']")).toHaveCount(1);
    await expect(botDeck.locator("option[value='merc-print-n-play']")).toHaveCount(1);

    const botStrategy = page.getByTestId("practice-setup-bot-strategy");
    await expect(botStrategy).toHaveValue("default");
    await expect(botStrategy.locator("option[value='default']")).toHaveCount(1);
    await expect(botStrategy.locator("option[value='greedy']")).toHaveCount(1);
    await expect(botStrategy.locator("option[value='first-legal']")).toHaveCount(1);
    await expect(botStrategy.locator("option[value='random']")).toHaveCount(1);
  });

  test("starts a practice match with Arasaka vs Merc and renders board", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/practice");
    await page.getByTestId("practice-setup-your-deck").selectOption("arasaka-print-n-play");
    await page.getByTestId("practice-setup-bot-deck").selectOption("merc-print-n-play");
    await page.getByTestId("practice-setup-bot-strategy").selectOption("greedy");
    await page.getByTestId("practice-setup-start").click();

    await expect(page).toHaveURL(/\/practice\/practice_/);
    await expect(page.getByTestId("board-wrap")).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="hand-zone"][data-side="player"]')).toBeVisible();
    await expect(page.locator('[data-testid="hand-zone"][data-side="opponent"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-zone"][data-side="player"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-zone"][data-side="opponent"]')).toBeVisible();
    await expect(page.locator('[data-testid="fixer-zone"][data-side="player"]')).toBeVisible();
    await expect(page.locator('[data-testid="fixer-zone"][data-side="opponent"]')).toBeVisible();
    await expect(page.locator('[data-testid="legends-zone"][data-side="player"]')).toBeVisible();
    await expect(page.locator('[data-testid="legends-zone"][data-side="opponent"]')).toBeVisible();
    await expect(page.locator('[data-testid="eddies-zone"][data-side="player"]')).toBeVisible();
    await expect(page.locator('[data-testid="gig-row"]').first()).toBeVisible();
  });
});
