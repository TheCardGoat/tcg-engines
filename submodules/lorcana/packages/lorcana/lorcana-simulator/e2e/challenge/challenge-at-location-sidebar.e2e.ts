import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import { agustinMadrigalClumsyDad, hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/004";
import { moanaDeterminedExplorer } from "@tcg/lorcana-cards/cards/005";

test("available moves panel can complete a challenge against a character at a location", async ({
  page,
}) => {
  const pom = new LorcanaSimulatorPom(page);
  const attackerLabel = "Moana - Determined Explorer";
  const defenderLabel = "Agustin Madrigal - Clumsy Dad";

  await pom.goto({
    fixture: {
      id: "challenge-at-location-sidebar",
      name: "Challenge At Location Sidebar",
      description: "Complete challenge selection from the Available Moves panel.",
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

  const panel = page.locator('section[aria-labelledby="available-moves-panel-title"]');

  await panel.getByRole("button", { name: "Challenge" }).click();
  await expect(panel.getByText("Select a character to challenge with.")).toBeVisible();

  await panel.getByRole("button", { name: attackerLabel }).click();
  await expect(
    panel.getByText(`Select the opposing character for ${attackerLabel} to challenge.`),
  ).toBeVisible();

  await panel.getByRole("button", { name: defenderLabel }).click();
  await expect(
    panel.getByText(
      `Confirm Challenge. You can skip confirmations in Player Settings.\nChallenge ${attackerLabel} -> ${defenderLabel}`,
    ),
  ).toBeVisible();

  const beforeChallenge = await pom.getStatus();
  await panel.getByRole("button", { name: "Confirm Challenge" }).click();

  await pom.waitForStateChange(beforeChallenge.stateID, "playerOne");
  await expect(
    panel.getByText(`Select the opposing character for ${attackerLabel} to challenge.`),
  ).toBeHidden();
});
