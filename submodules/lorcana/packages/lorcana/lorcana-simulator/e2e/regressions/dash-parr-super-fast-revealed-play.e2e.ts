import {
  buildRegressionFixturePath,
  expect,
  findCardIdByLabel,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const REGRESSION_PATH = buildRegressionFixturePath("dash-parr-super-fast-revealed-play", {
  view: PLAYER_ONE_VIEW,
});

async function executeWithRetry(
  pom: LorcanaSimulatorPom,
  moveId: string,
  params: Record<string, unknown>,
): Promise<{ success: boolean; reason?: string; code?: string }> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await pom.execute(PLAYER_ONE_VIEW, moveId, params);
    if (result.success || result.code !== "OPTIMISTIC_MOVE_PENDING") {
      return result;
    }
    await pom.page.waitForTimeout(50);
  }
  return pom.execute(PLAYER_ONE_VIEW, moveId, params);
}

test.describe("Dash Parr - Super Fast feedback", () => {
  test("plays the revealed top card without opening a hand picker", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const initialBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const dashId = findCardIdByLabel(initialBoard, PLAYER_ONE_ID, "play", "Dash Parr - Super Fast");

    const questResult = await executeWithRetry(pom, "quest", { cardId: dashId });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(initialBoard.stateID, PLAYER_ONE_VIEW);

    const triggeredBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const bagEffect = triggeredBoard.bagEffects[0];
    expect(bagEffect).toBeDefined();

    const acceptResult = await executeWithRetry(pom, "resolveBag", {
      bagId: bagEffect!.id,
      params: { resolveOptional: true },
    });
    expect(acceptResult.success, JSON.stringify(acceptResult)).toBe(true);
    await pom.waitForStateChange(triggeredBoard.stateID, PLAYER_ONE_VIEW);

    await expect(page.getByTestId("choice-resolution-overlay")).toBeVisible();
    await expect(page.getByTestId("resolution-target-overlay")).toBeHidden();
    const choiceBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    await page.getByRole("button", { name: "Play the revealed card" }).click();
    await pom.waitForStateChange(choiceBoard.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(
      resolvedBoard.players[PLAYER_ONE_ID]?.play.map(
        (cardId) => resolvedBoard.cards[cardId]?.fullName,
      ),
    ).toContain("Dash Parr - Dodgeball Dynamo");
    expect(resolvedBoard.pendingEffects).toHaveLength(0);
  });
});
