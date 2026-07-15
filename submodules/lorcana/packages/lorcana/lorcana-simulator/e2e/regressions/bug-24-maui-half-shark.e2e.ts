import {
  expect,
  test,
  buildRegressionFixturePath,
  findCardIdByLabel,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const PLAYER_TWO_ID = "player_two";
const REGRESSION_PATH = buildRegressionFixturePath("bug-24-maui-half-shark");

test.describe("Bug 24 - Maui, Half-Shark", () => {
  test("does not offer CHEEEEOHOOOO! after Maui challenges a location", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const maui = page.getByLabel("Maui - Half-Shark, cost 6").first();
    const location = page.getByLabel("Skull Rock - Isolated Fortress, cost 2").first();
    const character = page.getByLabel("HeiHei - Boat Snack, cost 1").first();

    await expect(maui).toBeVisible();
    await expect(location).toBeVisible();
    await expect(character).toBeVisible();

    const beforeLocationChallenge = await pom.getStatus(PLAYER_ONE_VIEW);
    await maui.click({ force: true });
    await location.click({ force: true });
    await pom.waitForStateChange(beforeLocationChallenge.stateID, PLAYER_ONE_VIEW);

    const afterLocationChallengeStatus = await pom.getStatus(PLAYER_ONE_VIEW);
    const afterLocationChallengeBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterLocationChallengeBoard.pendingChoice).toBeUndefined();
    expect(afterLocationChallengeBoard.bagEffects).toHaveLength(0);
    expect(afterLocationChallengeStatus.zoneCounts.player_one?.hand).toBe(0);
    expect(afterLocationChallengeStatus.zoneCounts.player_one?.discard).toBe(5);

    await pom.reset();

    const beforeCharacterChallenge = await pom.getBoard(PLAYER_ONE_VIEW);
    const mauiId = findCardIdByLabel(
      beforeCharacterChallenge,
      PLAYER_ONE_ID,
      "play",
      "Maui - Half-Shark",
    );
    const heiheiId = findCardIdByLabel(
      beforeCharacterChallenge,
      PLAYER_TWO_ID,
      "play",
      "HeiHei - Boat Snack",
    );
    const challengeResult = await pom.execute(PLAYER_ONE_VIEW, "challenge", {
      attackerId: mauiId,
      defenderId: heiheiId,
    });
    expect(challengeResult.success).toBe(true);
    await pom.waitForStateChange(beforeCharacterChallenge.stateID, PLAYER_ONE_VIEW);

    const afterCharacterChallenge = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterCharacterChallenge.bagEffects).toHaveLength(1);
    const bagSourceId = afterCharacterChallenge.bagEffects[0]?.sourceId;
    expect(bagSourceId).toBeDefined();
    expect(afterCharacterChallenge.cards[String(bagSourceId)]?.fullName).toBe("Maui - Half-Shark");
  });
});
