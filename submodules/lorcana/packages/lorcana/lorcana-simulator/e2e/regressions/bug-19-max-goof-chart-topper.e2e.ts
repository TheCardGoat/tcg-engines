import {
  expect,
  test,
  buildRegressionFixturePath,
  findCardIdByLabel,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const REGRESSION_PATH = buildRegressionFixturePath("bug-19-max-goof-chart-topper");

test.describe("Bug 19 - Max Goof, Chart Topper", () => {
  test("NUMBER ONE HIT offers eligible discard songs after accepting the optional", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);

    await pom.gotoPath(REGRESSION_PATH);

    const beforeQuest = await pom.getBoard(PLAYER_ONE_VIEW);
    const hakunaMatataId = findCardIdByLabel(
      beforeQuest,
      PLAYER_ONE_ID,
      "discard",
      "Hakuna Matata",
    );

    await page.getByRole("button", { name: "Quest with All (1) for 2 lore" }).click();
    await page.getByRole("button", { name: "Confirm Quest with All (1) for 2 lore" }).click();
    await pom.waitForStateChange(beforeQuest.stateID, PLAYER_ONE_VIEW);

    await expect(page.getByRole("region", { name: "Active player guidance" })).toContainText(
      "Resolving Max Goof - Chart Topper: NUMBER ONE HIT.",
    );

    const beforeAccept = await pom.getBoard(PLAYER_ONE_VIEW);
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "Accept effect" }).click();
    await pom.waitForStateChange(beforeAccept.stateID, PLAYER_ONE_VIEW);

    const picker = page.locator(".card-target-dialog");
    await expect(picker).toBeVisible();
    await expect(picker.locator(".card-button", { hasText: "Reflection" })).toHaveCount(1);
    await expect(
      picker.locator(".card-button", { hasText: "Friends on the Other Side" }),
    ).toHaveCount(1);
    await expect(picker.locator(".card-button", { hasText: "Hakuna Matata" })).toHaveCount(1);
    await expect(picker.locator(".card-button", { hasText: "A Whole New World" })).toHaveCount(0);

    const beforeSong = await pom.getBoard(PLAYER_ONE_VIEW);
    await page.waitForTimeout(250);
    await picker.locator(".card-button", { hasText: "Hakuna Matata" }).first().click();
    await pom.waitForStateChange(beforeSong.stateID, PLAYER_ONE_VIEW);

    const afterSong = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterSong.bagEffects).toHaveLength(0);
    expect(afterSong.players[PLAYER_ONE_ID]?.discard).not.toContain(hakunaMatataId);
    expect(afterSong.players[PLAYER_ONE_ID]?.discard).toHaveLength(3);
    expect(afterSong.players[PLAYER_ONE_ID]?.deckCount).toBe(4);
  });
});
