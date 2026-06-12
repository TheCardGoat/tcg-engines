import {
  expect,
  test,
  buildRegressionFixturePath,
  findCardIdByLabel,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const REGRESSION_PATH = buildRegressionFixturePath("bug-45-moana-kakamora-leader-gathering-forces");

test.describe("Bug 45 - Moana, Kakamora Leader", () => {
  test("GATHERING FORCES lets the player fill the character bucket and location slot explicitly", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const setupBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const moanaId = findCardIdByLabel(setupBoard, PLAYER_ONE_ID, "hand", "Moana - Kakamora Leader");
    const boardingPartyId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Kakamora - Boarding Party",
    );
    const specialistId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Kakamora - Long-Range Specialist",
    );
    const flotillaId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Flotilla - Coconut Armada",
    );

    const playResult = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId: moanaId });
    expect(playResult.success).toBe(true);
    await pom.waitForStateChange(setupBoard.stateID, PLAYER_ONE_VIEW);

    await expect(page.getByRole("region", { name: "Active player guidance" })).toContainText(
      "Choose characters to move, then choose a location for",
    );
    await expect(pom.resolutionTargetOverlay).toBeVisible();
    await expect(pom.resolutionTargetSlot("subject")).toContainText("Character to move");
    await expect(pom.resolutionTargetSlot("location")).toContainText("Move to location");
    await expect(pom.resolutionTargetSlot("subject")).toHaveAttribute("data-active", "true");

    await pom.chooseResolutionTargetCandidate(boardingPartyId);
    await expect(pom.resolutionTargetSlot("subject")).toContainText("Kakamora Boarding Party");
    await expect(pom.resolutionTargetSlot("subject")).toHaveAttribute("data-active", "true");

    await pom.chooseResolutionTargetCandidate(specialistId);
    await pom.chooseResolutionTargetSlot("location");
    await expect(pom.resolutionTargetSlot("location")).toHaveAttribute("data-active", "true");
    await pom.chooseResolutionTargetCandidate(flotillaId);

    const beforeConfirm = await pom.getBoard(PLAYER_ONE_VIEW);
    await pom.confirmResolutionSelection();
    await pom.waitForStateChange(beforeConfirm.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.bagEffects).toHaveLength(0);
    expect(resolvedBoard.players[PLAYER_ONE_ID]?.lore).toBe(2);
  });
});
