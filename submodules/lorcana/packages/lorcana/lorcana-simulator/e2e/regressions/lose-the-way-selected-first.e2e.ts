import {
  buildRegressionFixturePath,
  expect,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const REGRESSION_PATH = buildRegressionFixturePath("lose-the-way-selected-first", {
  view: PLAYER_ONE_VIEW,
});

test.describe("Lose the Way player report", () => {
  test("keeps the original character exerted after the optional discard and ready step", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();
    const playerTwo = pom.asTopPlayer();
    await pom.gotoPath(REGRESSION_PATH);

    const guidance = page.getByRole("region", { name: "Active player guidance" });
    const loseTheWay = page.getByLabel(/Lose the Way, cost 2/i).first();

    await expect(loseTheWay).toBeVisible();
    await loseTheWay.click();
    await page.getByRole("menuitem", { name: "Play: 2 ink" }).click();

    await page.getByRole("button", { name: "Open target selector" }).click();
    const targetDialog = page.locator(".card-target-dialog");
    await expect(targetDialog).toBeVisible();
    await targetDialog
      .getByRole("button", {
        name: "Toggle selection for Darkwing Duck - Cool Under Pressure",
      })
      .click();

    await expect(guidance).toContainText("Lose the Way");
    await guidance.getByRole("button", { name: "Yes" }).click();
    await page.getByRole("button", { name: "Open target selector" }).click();
    await expect(targetDialog).toBeVisible();
    await targetDialog
      .getByRole("button", {
        name: "Toggle selection for Mickey Mouse - True Friend",
      })
      .click();

    await expect(playerOne).toHaveCardInZone({
      card: "Mickey Mouse - True Friend",
      zone: "discard",
    });
    await expect(playerTwo).toHaveCardReadyState({
      card: "Darkwing Duck - Cool Under Pressure",
      readyState: "exerted",
    });
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);

    const turnBeforePass = (await playerTwo.getStatus()).turnNumber;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if ((await playerTwo.getStatus()).priorityPlayer === "player_two") {
        break;
      }

      const passTurn = page.getByRole("button", { name: "Pass Turn" });
      const confirmPassTurn = page.getByRole("button", { name: "Confirm Pass Turn" });
      if (await confirmPassTurn.isVisible()) {
        await confirmPassTurn.click();
      } else if (await passTurn.isVisible()) {
        await passTurn.click();
        await confirmPassTurn.click();
      }
      await page.waitForTimeout(100);
    }

    await expect.poll(async () => (await playerTwo.getStatus()).priorityPlayer).toBe("player_two");
    await expect
      .poll(async () => (await playerTwo.getStatus()).turnNumber)
      .toBeGreaterThan(turnBeforePass);
    await expect(playerTwo).toHaveCardReadyState({
      card: "Darkwing Duck - Cool Under Pressure",
      readyState: "exerted",
    });

    const artifactDirectory = process.env.BUG_TRIAGE_ARTIFACT_DIR;
    if (artifactDirectory) {
      await page.screenshot({
        path: `${artifactDirectory}/green.png`,
        fullPage: true,
      });
    }
  });
});
