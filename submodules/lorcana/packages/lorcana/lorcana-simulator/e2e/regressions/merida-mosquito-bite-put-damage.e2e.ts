import {
  buildRegressionFixturePath,
  expect,
  findCardIdByLabel,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const PLAYER_TWO_ID = "player_two";
const REGRESSION_PATH = buildRegressionFixturePath("merida-mosquito-bite-put-damage", {
  view: PLAYER_ONE_VIEW,
});

test.describe("Merida - Formidable Archer feedback", () => {
  test("Mosquito Bite puts exactly 1 damage and does not trigger STEADY AIM", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const setupBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const mosquitoBiteId = findCardIdByLabel(setupBoard, PLAYER_ONE_ID, "hand", "Mosquito Bite");
    const goofyId = findCardIdByLabel(
      setupBoard,
      PLAYER_TWO_ID,
      "play",
      "Goofy - Knight for a Day",
    );

    const result = await pom.execute(PLAYER_ONE_VIEW, "playCard", {
      cardId: mosquitoBiteId,
      targets: [goofyId],
    });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(setupBoard.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.cards[goofyId]?.damage).toBe(1);
    expect(resolvedBoard.bagEffects).toHaveLength(0);
  });
});
