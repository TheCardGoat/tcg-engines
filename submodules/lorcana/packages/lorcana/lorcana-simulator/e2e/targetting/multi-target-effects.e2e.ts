import { lastditchEffort, divebomb } from "@tcg/lorcana-cards/cards/003";
import { loseTheWay } from "@tcg/lorcana-cards/cards/006";
import {
  minnieMouseAlwaysClassy,
  mauiHeroToAll,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import { madamMimRivalOfMerlin, theQueenCommandingPresence } from "@tcg/lorcana-cards/cards/002";
import { powerlineWorldsGreatestRockStar } from "@tcg/lorcana-cards/cards/009";
import {
  darkwingDuckCoolUnderPressure,
  donaldDuckAlongForTheRide,
} from "@tcg/lorcana-cards/cards/011";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const cardLabel = (card: { name: string; version?: string }) =>
  card.version ? `${card.name} - ${card.version}` : card.name;
const MULTI_TARGET_FIXTURE = {
  id: "multi-target",
  name: "Multi Target",
  description: "Exercises multi-target simulator interactions.",
  playerOne: {
    inkwell: 20,
    hand: [divebomb, loseTheWay, lastditchEffort, mickeyMouseTrueFriend],
    play: [
      minnieMouseAlwaysClassy,
      theQueenCommandingPresence,
      mauiHeroToAll,
      { card: donaldDuckAlongForTheRide, exerted: true },
    ],
  },
  playerTwo: {
    play: [madamMimRivalOfMerlin, darkwingDuckCoolUnderPressure, powerlineWorldsGreatestRockStar],
  },
  skipPreGame: true,
} as const;

test.describe("Complex Targeting", () => {
  test("UI interactions resolve multi-target effects with harness-backed assertions", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();
    const playerTwo = pom.asTopPlayer();

    await pom.goto({ fixture: MULTI_TARGET_FIXTURE, view: PLAYER_ONE_VIEW });

    const panel = page.getByRole("region", { name: "Available Moves" });
    const handZone = page.getByTestId("hand-zone-playerOne");

    await expect(page.getByRole("region", { name: "Play for Player One" })).toBeVisible();

    await page.getByLabel(/The Queen - Commanding Presence, cost/i).hover();
    await page.getByRole("button", { name: "Quest for 2 lore" }).click();

    await expect(panel.getByRole("button", { name: "Resolve triggered ability" })).toBeVisible();
    await panel.getByRole("button", { name: "Resolve triggered ability" }).click();
    await expect(
      panel.getByRole("button", { name: "Powerline - World's Greatest Rock Star Character" }),
    ).toBeVisible();
    await panel
      .getByRole("button", { name: "Powerline - World's Greatest Rock Star Character" })
      .click();
    await panel.getByRole("button", { name: "Confirm Resolve triggered ability" }).click();

    await expect(panel.getByRole("button", { name: "Resolve effect" })).toBeVisible();
    await panel.getByRole("button", { name: "Resolve effect" }).click();
    await expect(
      panel.getByRole("button", { name: "Minnie Mouse - Always Classy Character" }),
    ).toBeVisible();
    await panel.getByRole("button", { name: "Minnie Mouse - Always Classy Character" }).click();
    await panel.getByRole("button", { name: "Confirm Resolve effect" }).click();

    await expect(playerTwo).toHaveCardStrength({
      card: cardLabel(powerlineWorldsGreatestRockStar),
      value: powerlineWorldsGreatestRockStar.strength - 4,
    });
    await expect(playerOne).toHaveCardStrength({
      card: cardLabel(minnieMouseAlwaysClassy),
      value: minnieMouseAlwaysClassy.strength + 4,
    });

    await handZone.getByLabel(new RegExp(`${cardLabel(divebomb)}, cost`, "i")).hover();
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(panel.getByRole("button", { name: "Maui - Hero to All Character" })).toBeVisible();
    await panel.getByRole("button", { name: "Maui - Hero to All Character" }).click();
    await panel.getByRole("button", { name: "Confirm Resolve effect" }).click();
    await panel.getByRole("button", { name: "Execute Resolve effect" }).click();
    await panel
      .getByRole("button", { name: "Powerline - World's Greatest Rock Star Character" })
      .click();
    await panel.getByRole("button", { name: "Confirm Resolve effect" }).click();

    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(mauiHeroToAll),
      zone: "discard",
    });
    await expect(playerTwo).toHaveCardInZone({
      card: cardLabel(powerlineWorldsGreatestRockStar),
      zone: "discard",
    });

    await handZone.getByLabel(new RegExp(`${cardLabel(lastditchEffort)}, cost`, "i")).hover();
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(
      panel.getByRole("button", { name: "Madam Mim - Rival of Merlin Character" }),
    ).toBeVisible();
    await panel.getByRole("button", { name: "Madam Mim - Rival of Merlin Character" }).click();
    await panel.getByRole("button", { name: "Confirm Resolve effect" }).click();
    await panel.getByRole("button", { name: "Execute Resolve effect" }).click();
    await panel.getByRole("button", { name: "Minnie Mouse - Always Classy Character" }).click();
    await panel.getByRole("button", { name: "Confirm Resolve effect" }).click();

    await expect(playerTwo).toHaveCardReadyState({
      card: cardLabel(madamMimRivalOfMerlin),
      readyState: "exerted",
    });
    await expect(playerOne).toHaveCardKeywordValue({
      card: cardLabel(minnieMouseAlwaysClassy),
      keyword: "challenger",
      value: 2,
    });

    await handZone.getByLabel(new RegExp(`${cardLabel(loseTheWay)}, cost`, "i")).hover();
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(
      panel.getByRole("button", { name: "Darkwing Duck - Cool Under Pressure Character" }),
    ).toBeVisible();
    await panel
      .getByRole("button", { name: "Darkwing Duck - Cool Under Pressure Character" })
      .click();
    await panel.getByRole("button", { name: "Confirm Resolve effect" }).click();
    await panel.getByRole("button", { name: "Execute Resolve effect" }).click();
    await panel.getByRole("button", { name: "Yes" }).click();
    await panel.getByRole("button", { name: "Confirm Resolve effect" }).click();
    await panel.getByRole("button", { name: "Execute Resolve effect" }).click();
    await panel.getByRole("button", { name: "Mickey Mouse - True Friend Character" }).click();
    await panel.getByRole("button", { name: "Confirm Resolve effect" }).click();

    await expect(playerTwo).toHaveCardReadyState({
      card: cardLabel(darkwingDuckCoolUnderPressure),
      readyState: "exerted",
    });
    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(mickeyMouseTrueFriend),
      zone: "discard",
    });
    await expect(panel.getByRole("button", { name: "Resolve effect" })).toBeHidden();
  });
});
