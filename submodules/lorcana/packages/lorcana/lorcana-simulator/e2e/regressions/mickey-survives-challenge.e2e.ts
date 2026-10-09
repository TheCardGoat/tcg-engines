import {
  buildRegressionFixturePath,
  expect,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

const REGRESSION_PATH = buildRegressionFixturePath("mickey-survives-challenge", {
  view: "playerOne",
});

test("Mickey surviving a challenge must not force an opponent discard", async ({ page }) => {
  const pom = new LorcanaSimulatorPom(page);
  await pom.gotoPath(REGRESSION_PATH);
  await page.getByLabel("Mickey Mouse - Snowboard Ace, cost 6", { exact: true }).click();
  await page.getByRole("menuitem", { name: "Challenge", exact: true }).click();
  await page.getByLabel("Launchpad - Trusty Sidekick, cost 2", { exact: true }).click();

  await expect(page.getByRole("region", { name: "Event log" })).toContainText("was banished");
  await expect(pom.asBottomPlayer()).toHaveCardInZone({
    card: "Mickey Mouse - Snowboard Ace",
    zone: "play",
  });
  await expect(pom.asTopPlayer()).toHaveCardInZone({
    card: "Launchpad - Trusty Sidekick",
    zone: "discard",
  });
  await expect(pom.asTopPlayer()).toHaveCardCountInZone({
    zone: "hand",
    player: "player_two",
    count: 2,
  });
  await expect(pom.asBottomPlayer()).toHavePriorityPlayer("player_one");
  await expect(page.locator("#pending-effects-panel")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pass Turn", exact: true })).toBeEnabled();
});
