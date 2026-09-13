import {
  buildRegressionFixturePath,
  expect,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

const REGRESSION_PATH = buildRegressionFixturePath("mulan-created-by-the-vine-self-trigger", {
  view: "playerOne",
});

test.describe("Mulan - Created by the Vine player report", () => {
  test("offers Demolish when Mulan herself is played", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();
    const playerTwo = pom.asTopPlayer();
    await pom.gotoPath(REGRESSION_PATH);

    await page.getByLabel(/Mulan - Created by the Vine, cost 4/i).first().click();
    await page.getByRole("menuitem", { name: "Play: 4 ink" }).click();

    const guidance = page.getByRole("region", { name: "Active player guidance" });
    await expect(guidance).toContainText("Mulan - Created by the Vine");
    await page.getByRole("button", { name: "Open target selector" }).click();

    const targetDialog = page.locator(".card-target-dialog");
    await expect(targetDialog).toBeVisible();
    await targetDialog
      .getByRole("button", { name: "Toggle selection for Medallion Weights" })
      .click();

    await expect(page.getByRole("region", { name: "Event log" })).toContainText(
      "Medallion Weights was banished",
    );
    await expect(playerOne).toHaveCardInZone({
      card: "Mulan - Created by the Vine",
      zone: "play",
    });
    await expect(playerTwo).toHaveCardInZone({
      card: "Medallion Weights",
      zone: "discard",
    });
    await expect(page.getByRole("button", { name: "Open target selector" })).toHaveCount(0);
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });

  test("allows the player to decline Demolish after Mulan is played", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();
    const playerTwo = pom.asTopPlayer();
    await pom.gotoPath(REGRESSION_PATH);

    await page.getByLabel(/Mulan - Created by the Vine, cost 4/i).first().click();
    await page.getByRole("menuitem", { name: "Play: 4 ink" }).click();
    await page.getByRole("button", { name: "Open target selector" }).click();

    const targetDialog = page.locator(".card-target-dialog");
    await expect(targetDialog).toBeVisible();
    await targetDialog.getByRole("button", { name: "Skip effect" }).click();

    await expect(playerOne).toHaveCardInZone({
      card: "Mulan - Created by the Vine",
      zone: "play",
    });
    await expect(playerTwo).toHaveCardInZone({
      card: "Medallion Weights",
      zone: "play",
    });
    await expect(page.getByRole("button", { name: "Open target selector" })).toHaveCount(0);
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });
});
