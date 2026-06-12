import { test, expect } from "../fixtures/test";
import type { Locator } from "@playwright/test";

test.describe("mobile prompt parity", () => {
  test("shows the shared mulligan prompt on desktop and mobile", async ({ browser }) => {
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });

    try {
      await desktopPage.goto("/cyberpunk/simulator/tests/gameStart?ai=off");
      await mobilePage.goto("/cyberpunk/simulator/tests/gameStart?ai=off&mobile");

      const desktopPrompt = desktopPage.locator(
        '[data-testid="prompt-banner"][data-side="player"]',
      );
      const mobilePrompt = mobilePage.locator('[data-testid="prompt-banner"][data-side="player"]');

      for (const prompt of [desktopPrompt, mobilePrompt]) {
        await expect(prompt).toBeVisible();
        await expect(prompt).toHaveAttribute("data-state", "mulligan");
        await expect(prompt.locator('[data-testid="prompt-banner-title"]')).toHaveText("Mulligan");
        await expect(prompt.locator('[data-testid="prompt-verb-mulligan"]')).toBeVisible();
        await expect(prompt.locator('[data-testid="prompt-verb-keepHand"]')).toBeVisible();
      }

      const desktopVerbs = await promptVerbs(desktopPrompt);
      const mobileVerbs = await promptVerbs(mobilePrompt);
      expect(mobileVerbs).toEqual(desktopVerbs);
    } finally {
      await desktopPage.close();
      await mobilePage.close();
    }
  });
});

async function promptVerbs(prompt: Locator) {
  return prompt.locator('[data-testid^="prompt-verb-"]').evaluateAll((buttons) =>
    buttons.map((button) => ({
      disabled: button.hasAttribute("disabled"),
      text: button.textContent?.trim() ?? "",
      verb: button.getAttribute("data-verb"),
    })),
  );
}
