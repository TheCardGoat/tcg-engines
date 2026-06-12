import {
  expect,
  test,
  buildRegressionFixturePath,
  cardByName,
  findCardIdByLabel,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const FIXTURE_ID = "leviathans-lair-hand-vs-play";
const REGRESSION_PATH = buildRegressionFixturePath(FIXTURE_ID, { view: "playerOne" });
const PLAYER_ONE_ID = "player_one";
const PLAYER_TWO_ID = "player_two";

test.describe("Leviathan's Lair hand-vs-play visual regression", () => {
  test("highlights only the opponent character in play, not the hand character", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const board = await pom.getBoard("authoritative");
    const lairId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Leviathan's Lair - Dangerous Ground",
    );
    const playCharacterId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Simba - Protective Cub",
    );
    const handCharacterId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "hand",
      "Ariel - On Human Legs",
    );
    const previousStatus = await pom.getStatus("authoritative");

    const damageResult = await pom.execute("authoritative", "manualSetDamage", {
      cardId: lairId,
      damage: 4,
    });
    expect(damageResult.success).toBe(true);
    await pom.waitForStateChange(previousStatus.stateID, "authoritative");
    await pom.swapPlayers();

    await expect(
      page.getByText(/Select the required target or player for\s+Leviathan's Lair/i),
    ).toBeVisible();
    await expect(cardByName(page, "Simba - Protective Cub")).toHaveClass(/card-face--valid-target/);
    await expect(page.locator(`[data-card-id="${playCharacterId}"].card-face`)).toHaveClass(
      /card-face--valid-target/,
    );
    const handCardFace = page.locator(`[data-card-id="${handCharacterId}"].card-face`);
    await expect(handCardFace).toBeVisible();
    await expect(handCardFace).not.toHaveClass(/card-face--valid-target/);
  });
});
