import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const LOOK_AT_TOP_FIXTURE_ID = "look-at-the-top";

function findCardIdByLabel(
  board: LorcanaProjectedBoardView,
  playerId: string,
  zone: "hand" | "play",
  label: string,
): string {
  const cardId = board.players[playerId]?.[zone].find(
    (candidate) => board.cards[candidate]?.fullName === label,
  );
  if (!cardId) {
    throw new Error(`Card "${label}" not found in ${zone} for ${playerId}.`);
  }

  return String(cardId);
}

async function playCardByLabel(pom: LorcanaSimulatorPom, label: string): Promise<void> {
  const board = await pom.getBoard(PLAYER_ONE_VIEW);
  const cardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", label);
  const previousStateId = board.stateID;

  const result = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId });
  expect(result.success).toBe(true);
  await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
}

test.describe("Look at the top of your deck effects", () => {
  test("renders the inline overlay and resolves Develop Your Brain", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: LOOK_AT_TOP_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    await playCardByLabel(pom, "Develop Your Brain");

    await expect(page.getByTestId("scry-resolution-overlay")).toBeVisible();
    const firstHandButton = page.locator('[data-testid^="assign-"][data-testid$="-hand"]').first();
    await expect(firstHandButton).toBeVisible();
    await firstHandButton.click();
    await page.getByTestId("scry-confirm-button").click();

    await expect(page.getByTestId("scry-resolution-overlay")).toBeHidden();

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(board.pendingEffects).toHaveLength(0);
    expect(board.players[PLAYER_ONE_ID]?.hand).toHaveLength(7);
  });

  test("supports top-of-deck reordering in the overlay", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: LOOK_AT_TOP_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    await playCardByLabel(pom, "Reflection");

    const destination = page.getByTestId("scry-destination-deck-top");
    await expect(destination).toBeVisible();
    const cardsBefore = await destination
      .locator('[data-testid^="destination-card-deck-top-"] .scry-card__title')
      .allTextContents();

    await page.locator('[data-testid^="reorder-deck-top-"][data-testid$="-right"]').first().click();
    const cardsAfter = await destination
      .locator('[data-testid^="destination-card-deck-top-"] .scry-card__title')
      .allTextContents();

    expect(cardsAfter).not.toEqual(cardsBefore);
  });

  test("hides illegal Family Madrigal hand destinations", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: LOOK_AT_TOP_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    await playCardByLabel(pom, "The Family Madrigal");

    await expect(page.getByTestId("scry-resolution-overlay")).toBeVisible();
    const revealedCards = page.getByTestId("scry-overlay-revealed");
    const brunoCard = revealedCards.locator(".scry-card", {
      hasText: "Bruno Madrigal - Out of the Shadows",
    });
    await expect(brunoCard.first().getByRole("button", { name: "Hand" })).toHaveCount(2);

    const reflectionCard = revealedCards.locator(".scry-card", { hasText: "Reflection" });
    await expect(reflectionCard.first().getByRole("button", { name: "Hand" })).toHaveCount(2);

    const moanaCard = revealedCards.locator(".scry-card", {
      hasText: "Moana - Determined Explorer",
    });
    await expect(moanaCard.first().getByRole("button", { name: "Hand" })).toHaveCount(0);
  });

  test("Robin Hood scry plays action card with targets — target selection appears in resolution area", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: LOOK_AT_TOP_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    // Quest Robin Hood Sharpshooter — triggers MY GREATEST PERFORMANCE (scry 4, play action ≤ 6 for free)
    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const robinHoodId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Robin Hood - Sharpshooter",
    );
    const previousStateId = board.stateID;

    const questResult = await pom.execute(PLAYER_ONE_VIEW, "quest", { cardId: robinHoodId });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Scry overlay should appear for Robin Hood's trigger (or Aurelian's — both trigger on quest)
    // We need to resolve the bag triggers; first verify bag has items
    const boardAfterQuest = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(boardAfterQuest.bagEffects.length).toBeGreaterThanOrEqual(1);

    // The scry overlay should eventually appear (auto-opened or via bag resolution)
    await expect(page.getByTestId("scry-resolution-overlay")).toBeVisible({ timeout: 5000 });

    // Assign Lose The Way to "play" zone (action card, cost 2 ≤ 6, needs target selection)
    const loseTheWayCard = page.locator(".scry-card", { hasText: "Lose the Way" });
    await expect(loseTheWayCard).toBeVisible();
    const playButton = loseTheWayCard.getByRole("button", { name: "Play" });
    await expect(playButton).toBeVisible();
    await playButton.click();

    // Confirm the scry selection
    await page.getByTestId("scry-confirm-button").click();

    // After confirming, Lose The Way is played and needs a target (exert chosen character)
    // The target selection should appear in the resolution area
    // This is the bug: the played action card's pending effect doesn't show in the UI
    const boardAfterScry = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(boardAfterScry.pendingEffects.length).toBeGreaterThanOrEqual(1);

    // The pending effect should be auto-opened — check that some resolution UI is visible
    // (either a target selection prompt or the pending effects popover highlights it)
    const hasResolveEffect = boardAfterScry.pendingChoice?.requestID != null;
    expect(hasResolveEffect).toBe(true);
  });

  test("only offers legal play targets for Down in New Orleans", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: LOOK_AT_TOP_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    await playCardByLabel(pom, "Down in New Orleans");

    await expect(page.getByTestId("scry-resolution-overlay")).toBeVisible();

    const brunoCard = page.locator(".scry-card", {
      hasText: "Bruno Madrigal - Out of the Shadows",
    });
    await expect(brunoCard.getByRole("button", { name: "Play" })).toHaveCount(1);

    const reflectionCard = page.locator(".scry-card", { hasText: "Reflection" });
    await expect(reflectionCard.getByRole("button", { name: "Play" })).toHaveCount(0);

    const hakunaCard = page.locator(".scry-card", { hasText: "Hakuna Matata" });
    await expect(hakunaCard.getByRole("button", { name: "Play" })).toHaveCount(0);
  });
});
