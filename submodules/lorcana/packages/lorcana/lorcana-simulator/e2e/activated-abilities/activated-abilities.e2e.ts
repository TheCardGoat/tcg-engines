import { madamMimRivalOfMerlin, mouseArmor } from "@tcg/lorcana-cards/cards/002";
import { powerlineWorldsGreatestRockStar } from "@tcg/lorcana-cards/cards/009";
import {
  darkwingDuckCoolUnderPressure,
  donaldDuckAlongForTheRide,
} from "@tcg/lorcana-cards/cards/011";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import { brunoMadrigalUndetectedUncle, elsaStormChaser } from "@tcg/lorcana-cards/cards/004";
import { merlinCleverClairvoyant } from "@tcg/lorcana-cards/cards/007";

const PLAYER_ONE_VIEW = "playerOne" as const;

const FIXTURE = {
  id: "activated-abilities",
  name: "activated-abilities",
  description: "activated abilities",
  skipPreGame: true,
  playerOne: {
    inkwell: 10,
    play: [mouseArmor, elsaStormChaser, brunoMadrigalUndetectedUncle],
    deck: [merlinCleverClairvoyant, donaldDuckAlongForTheRide],
  },
  playerTwo: {
    play: [madamMimRivalOfMerlin, darkwingDuckCoolUnderPressure, powerlineWorldsGreatestRockStar],
  },
} as const;

test.describe("Activated Abilities", () => {
  test("activate ability by clicking on the ability row in the card hover card", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();

    await pom.goto({ fixture: FIXTURE, view: PLAYER_ONE_VIEW });
    await expect(page.getByRole("region", { name: "Play for Player One" })).toBeVisible();

    // Hover over Elsa - Storm Chaser to reveal the card hover card with abilities
    await page.getByLabel(/Elsa - Storm Chaser, cost/i).hover();

    // The TEMPEST ability row should be a clickable button in the hover card
    const abilityButton = page.getByRole("button", { name: /TEMPEST/i });
    await expect(abilityButton).toBeVisible();

    const beforeActivate = await pom.getStatus();
    await abilityButton.click();

    // Elsa's TEMPEST targets a chosen character — the panel should ask to pick a target
    const panel = page.getByRole("region", { name: "Available Moves" });
    await expect(panel.getByRole("button", { name: /Madam Mim - Rival of Merlin/i })).toBeVisible();

    // Select a target and confirm
    await panel.getByRole("button", { name: /Madam Mim - Rival of Merlin/i }).click();
    await panel.getByRole("button", { name: /Confirm/i }).click();

    // Verify the state changed — ability was activated
    await pom.waitForStateChange(beforeActivate.stateID, PLAYER_ONE_VIEW);

    // Elsa should now be exerted (activated ability costs {E})
    await expect(playerOne).toHaveCardReadyState({
      card: "Elsa - Storm Chaser",
      readyState: "exerted",
    });
  });

  test("activate ability by clicking on the ability row when a keyword precedes the activated ability", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);

    await pom.goto({ fixture: FIXTURE, view: PLAYER_ONE_VIEW });
    await expect(page.getByRole("region", { name: "Play for Player One" })).toBeVisible();

    // Hover over Bruno Madrigal - Undetected Uncle
    // Bruno has Evasive (keyword) BEFORE "YOU JUST HAVE TO SEE IT" (activated ability)
    // This tests that the ability index mapping correctly skips keywords
    await page.getByLabel(/Bruno Madrigal - Undetected Uncle, cost/i).hover();

    // The activated ability row should render as a clickable button
    const abilityButton = page.getByRole("button", { name: /YOU JUST HAVE TO SEE IT/i });
    await expect(abilityButton).toBeVisible();
    await expect(abilityButton).toBeEnabled();
  });

  test("activate ability from the available moves panel", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();

    await pom.goto({ fixture: FIXTURE, view: PLAYER_ONE_VIEW });
    await expect(page.getByRole("region", { name: "Play for Player One" })).toBeVisible();

    const panel = page.getByRole("region", { name: "Available Moves" });

    // Click "Activate Ability" in the available moves panel
    await panel.getByRole("button", { name: "Activate Ability" }).click();

    // Select Elsa as the source card
    await expect(panel.getByText("Select a card to activate.")).toBeVisible();
    await panel.getByRole("button", { name: /Elsa - Storm Chaser/i }).click();

    // Elsa has only one activated ability so it should go directly to target selection
    // Select a target character
    await panel.getByRole("button", { name: /Madam Mim - Rival of Merlin/i }).click();

    // Confirm the activation
    const beforeActivate = await pom.getStatus();
    await panel.getByRole("button", { name: /Confirm/i }).click();

    await pom.waitForStateChange(beforeActivate.stateID, PLAYER_ONE_VIEW);

    // Verify Elsa is exerted after ability activation
    await expect(playerOne).toHaveCardReadyState({
      card: "Elsa - Storm Chaser",
      readyState: "exerted",
    });
  });
});
