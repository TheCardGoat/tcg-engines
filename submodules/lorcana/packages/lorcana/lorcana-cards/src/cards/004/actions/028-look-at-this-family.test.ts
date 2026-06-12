import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  healingGlow,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { lookAtThisFamily } from "./028-look-at-this-family";

describe("Look at This Family", () => {
  it("puts up to 2 character cards into your hand and bottoms the rest in the chosen order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [lookAtThisFamily],
      inkwell: lookAtThisFamily.cost,
      deck: [
        aladdinPrinceAli,
        healingGlow,
        simbaProtectiveCub,
        arielOnHumanLegs,
        tinkerBellPeterPansAlly,
      ],
    });

    const playResult = testEngine.asPlayerOne().playCard(lookAtThisFamily, {
      destinations: [
        {
          zone: "hand",
          cards: [aladdinPrinceAli, simbaProtectiveCub],
        },
        {
          zone: "deck-bottom",
          cards: [tinkerBellPeterPansAlly, arielOnHumanLegs, healingGlow],
        },
      ],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE).slice(0, 3)).toEqual([
      healingGlow.id,
      arielOnHumanLegs.id,
      tinkerBellPeterPansAlly.id,
    ]);
  });
});
