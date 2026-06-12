import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import { agustinMadrigalClumsyDad, hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/004";
import { moanaDeterminedExplorer } from "@tcg/lorcana-cards/cards/005";

test("challenge mode allows selecting an opposing character at a location", async ({ page }) => {
  const pom = new LorcanaSimulatorPom(page);

  await pom.goto({
    fixture: {
      id: "challenge-at-location",
      name: "Challenge At Location",
      description: "Challenge an exerted character while here.",
      playerOne: {
        play: [moanaDeterminedExplorer],
      },
      playerTwo: {
        play: [
          hiddenCoveTranquilHaven,
          {
            card: agustinMadrigalClumsyDad,
            atLocation: hiddenCoveTranquilHaven,
            exerted: true,
          },
        ],
      },
      skipPreGame: true,
    },
    view: "playerOne",
  });

  const attacker = page.locator('.card-face[aria-label="Moana - Determined Explorer, cost 3"]');
  await attacker.click({ force: true });

  const chooseTargetPrompt = page
    .locator("p")
    .filter({
      hasText: "Select the opposing character for Moana - Determined Explorer to challenge.",
    })
    .first();
  await expect(chooseTargetPrompt).toBeVisible();

  const beforeChallenge = await pom.getStatus();
  const defender = page.locator('.card-face[aria-label="Agustin Madrigal - Clumsy Dad, cost 1"]');
  await defender.click({ force: true });

  await pom.waitForStateChange(beforeChallenge.stateID, "playerOne");
  await expect(chooseTargetPrompt).toBeHidden();
});
