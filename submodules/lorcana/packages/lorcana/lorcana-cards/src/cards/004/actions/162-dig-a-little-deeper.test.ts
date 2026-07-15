import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  fireTheCannons,
  healingGlow,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { goofyKnightForADay } from "../../002";
import { digALittleDeeper } from "./162-dig-a-little-deeper";

describe("Dig a Little Deeper", () => {
  it("puts exactly 2 cards into your hand and the rest on the bottom in the chosen order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [digALittleDeeper],
      inkwell: digALittleDeeper.cost,
      deck: [
        aladdinPrinceAli,
        arielOnHumanLegs,
        goofyKnightForADay,
        healingGlow,
        simbaProtectiveCub,
        tinkerBellPeterPansAlly,
        fireTheCannons,
      ],
    });

    const playResult = testEngine.asPlayerOne().playCard(digALittleDeeper, {
      destinations: [
        {
          zone: "hand",
          cards: [aladdinPrinceAli, arielOnHumanLegs],
        },
        {
          zone: "deck-bottom",
          cards: [
            fireTheCannons,
            tinkerBellPeterPansAlly,
            simbaProtectiveCub,
            healingGlow,
            goofyKnightForADay,
          ],
        },
      ],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("hand");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE).slice(0, 5)).toEqual([
      goofyKnightForADay.id,
      healingGlow.id,
      simbaProtectiveCub.id,
      tinkerBellPeterPansAlly.id,
      fireTheCannons.id,
    ]);
  });
});
