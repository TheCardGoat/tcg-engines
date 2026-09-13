import { expect, test } from "@playwright/test";

// Opt-in deployment smoke: supply a public live match path from the environment
// being verified. Never check in player/match identifiers or authenticated state.
// Deterministic transport/update coverage lives in LiveMatch.spectator.test.tsx.
const matchPath = process.env.FAB_SPECTATOR_MATCH_PATH;

test.describe("anonymous FAB live spectator", () => {
  test.skip(!matchPath, "Set FAB_SPECTATOR_MATCH_PATH to an existing public match route.");
  test.use({ storageState: { cookies: [], origins: [] } });
  test.setTimeout(180_000);

  test("renders both private hands as backs, cannot act, and survives reload", async ({ page }) => {
    if (!matchPath) throw new Error("Missing public match path");
    await page.goto(matchPath);
    await expect(page.getByTestId("fab-tabletop")).toBeVisible({ timeout: 150_000 });
    await expect(page.getByText(/Spectating · .* perspective/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Concede match", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open your player actions" })).toHaveCount(0);

    for (const name of [/Your hand, \d+ cards/, /Opponent hand, \d+ cards/]) {
      const hand = page.getByLabel(name);
      await expect(hand).toBeVisible();
      await expect(hand).not.toContainText("Image unavailable");
      await expect(hand.locator('[data-fab-owner-face-down="true"]')).toHaveCount(0);
      const hiddenCard = hand.getByRole("button", { name: /Hidden card/ }).first();
      await expect(hiddenCard).toBeVisible();
      await hiddenCard.click();
      await expect(page.getByRole("button", { name: /^Play card/ })).toHaveCount(0);
      await page.keyboard.press("Escape");
    }
    await page.keyboard.press("Space");
    await expect(page.getByText(/Match actions could not be synchronized/)).toHaveCount(0);
    await page.screenshot({ path: test.info().outputPath("anonymous-spectator.png") });

    await page.reload();
    await expect(page.getByTestId("fab-tabletop")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/Spectating · .* perspective/)).toBeVisible();
    await expect(page.getByText(/Match actions could not be synchronized/)).toHaveCount(0);
  });
});
