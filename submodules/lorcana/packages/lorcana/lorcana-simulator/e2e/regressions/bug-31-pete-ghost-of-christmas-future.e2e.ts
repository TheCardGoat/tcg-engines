import {
  expect,
  test,
  buildRegressionFixturePath,
  findCardIdByLabel,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const REGRESSION_PATH = buildRegressionFixturePath("bug-31-pete-ghost-of-christmas-future");

async function executeWithRetry(
  pom: LorcanaSimulatorPom,
  view: "playerOne" | "playerTwo",
  moveId: string,
  params: Record<string, unknown>,
): Promise<{ success: boolean; reason?: string; code?: string }> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await pom.execute(view, moveId, params);
    if (result.success || result.code !== "OPTIMISTIC_MOVE_PENDING") {
      return result;
    }
    await pom.page.waitForTimeout(50);
  }
  return pom.execute(view, moveId, params);
}

test.describe("Bug 31 - Pete, Ghost of Christmas Future", () => {
  test("FOREBODING GLANCE triggers on quest with cards under and resolves the scry", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const beforeQuest = await pom.getBoard(PLAYER_ONE_VIEW);
    const peteId = findCardIdByLabel(
      beforeQuest,
      PLAYER_ONE_ID,
      "play",
      "Pete - Ghost of Christmas Future",
    );

    expect(beforeQuest.cards[peteId]?.cardsUnder).toHaveLength(1);
    const handBefore = beforeQuest.players[PLAYER_ONE_ID]?.handCount ?? 0;
    const deckBefore = beforeQuest.players[PLAYER_ONE_ID]?.deckCount ?? 0;

    const questResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "quest", { cardId: peteId });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(beforeQuest.stateID, PLAYER_ONE_VIEW);

    const afterQuest = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterQuest.players[PLAYER_ONE_ID]?.lore).toBe(1);
    expect(afterQuest.bagEffects).toHaveLength(1);
    expect(afterQuest.bagEffects[0]?.payload?.abilityName).toBe("FOREBODING GLANCE");

    const bagId = afterQuest.bagEffects[0]!.id;
    const resolveResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "resolveBag", { bagId });
    expect(resolveResult.success).toBe(true);
    await pom.waitForStateChange(afterQuest.stateID, PLAYER_ONE_VIEW);

    await expect(page.getByTestId("scry-resolution-overlay")).toBeVisible();

    const revealed = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(revealed.bagEffects).toHaveLength(0);
    expect(revealed.pendingChoice?.type).toBe("action-effect");
    expect(revealed.pendingEffects).toHaveLength(1);

    const revealedCard = page.locator('[data-testid^="revealed-scry-card-"]');
    await expect(revealedCard).toHaveCount(1);
    await revealedCard.first().click();

    const handDestination = page.locator('[data-testid^="scry-row-cards-"][data-testid*=":hand:"]');
    await expect(handDestination.locator('[data-testid^="destination-card-"]')).toHaveCount(1);

    const beforeConfirm = await pom.getBoard(PLAYER_ONE_VIEW);
    await page.waitForTimeout(250);
    await expect(page.getByTestId("scry-confirm-button")).toBeEnabled();
    await page.getByTestId("scry-confirm-button").click();
    await pom.waitForStateChange(beforeConfirm.stateID, PLAYER_ONE_VIEW);

    await expect(page.getByTestId("scry-resolution-overlay")).toBeHidden();

    const afterConfirm = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterConfirm.pendingEffects).toHaveLength(0);
    expect(afterConfirm.players[PLAYER_ONE_ID]?.handCount).toBe(handBefore + 1);
    expect(afterConfirm.players[PLAYER_ONE_ID]?.deckCount).toBe(deckBefore - 1);
  });
});
