import { expect, test } from "@playwright/test";

const cases = [
  {
    fixture: "deckSearchThreeMouthsPrompt",
    title: "Choose cards for your hand",
    context: "2 friendly min Gigs allow 2 extra cards",
    requirement: "required",
    count: 3,
    eligible: 3,
  },
  {
    fixture: "deckSearchHanakoPrompt",
    title: "Choose cards for your hand",
    context: "cost matching a friendly Gig value (2, 4, 5, 6)",
    requirement: "optional",
    count: 4,
    eligible: 2,
  },
  {
    fixture: "deckSearchSketchyRipperPrompt",
    title: "Choose a card for your hand",
    context: "Gear",
    requirement: "optional",
    count: 3,
    eligible: 1,
  },
  {
    fixture: "deckSearchViktorPrompt",
    title: "Choose cards for your hand",
    context: "Gear with cost 2 or less",
    requirement: "optional",
    count: 5,
    eligible: 3,
  },
  {
    fixture: "deckSearchRiverWardPrompt",
    title: "Choose a card to trash",
    context: null,
    requirement: "required",
    count: 2,
    eligible: 2,
  },
  {
    fixture: "deckSearchTetratronicPrompt",
    title: "Choose a card to trash",
    context: null,
    requirement: "optional",
    count: 1,
    eligible: 1,
  },
] as const;

for (const scenario of cases) {
  test(`${scenario.fixture} explains the legal choice and captures visual evidence`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(() => {
      localStorage.setItem("tcg:cyberpunk:payment-selection-discovery:v1", "dismissed");
    });
    await page.goto(`/cyberpunk/simulator/tests/${scenario.fixture}?ai=off`);

    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(scenario.title, { exact: true })).toBeVisible();
    const context = dialog.getByTestId("search-deck-context");
    await expect(context).toContainText(`${scenario.eligible} of ${scenario.count} eligible`);
    await expect(dialog.getByTestId("search-deck-requirement")).toHaveAttribute(
      "data-requirement",
      scenario.requirement,
    );
    if (scenario.context) {
      await expect(context).toContainText(scenario.context);
    } else {
      await expect(context).not.toContainText("any card");
    }
    await expect(dialog.getByTestId("search-deck-card")).toHaveCount(scenario.count);
    await expect(
      dialog.locator('[data-testid="search-deck-card"][data-selectable="true"]'),
    ).toHaveCount(scenario.eligible);

    await page.screenshot({
      path: testInfo.outputPath(`${scenario.fixture}.png`),
      fullPage: false,
    });

    if (scenario.fixture === "deckSearchThreeMouthsPrompt") {
      const eligibleCards = dialog.locator(
        '[data-testid="search-deck-card"][data-selectable="true"]',
      );
      await eligibleCards.nth(0).click();
      await eligibleCards.nth(1).click();
      await expect(
        dialog.getByText("2 to hand · 1 to bottom of deck", { exact: true }),
      ).toBeVisible();
      await expect(dialog.getByRole("button", { name: "Add 2 to hand" })).toBeEnabled();
    }

    if (scenario.fixture === "deckSearchHanakoPrompt") {
      await dialog
        .locator('[data-testid="search-deck-card"][data-selectable="true"]')
        .first()
        .click();
      await expect(dialog.getByRole("button", { name: "Reveal 1 and add to hand" })).toBeEnabled();
    }
  });
}
