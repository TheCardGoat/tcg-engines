import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  healingGlow,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { theBossIsOnARoll } from "./063-the-boss-is-on-a-roll";

describe("The Boss Is on a Roll", () => {
  it("puts the looked-at cards on the bottom in the chosen order and gains 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theBossIsOnARoll],
      inkwell: theBossIsOnARoll.cost,
      deck: [
        aladdinPrinceAli,
        arielOnHumanLegs,
        simbaProtectiveCub,
        healingGlow,
        tinkerBellPeterPansAlly,
      ],
    });

    expect(
      testEngine.asPlayerOne().playCard(theBossIsOnARoll, {
        destinations: [
          {
            zone: "deck-bottom",
            cards: [
              tinkerBellPeterPansAlly,
              healingGlow,
              simbaProtectiveCub,
              arielOnHumanLegs,
              aladdinPrinceAli,
            ],
          },
        ],
      }).success,
    ).toBe(true);

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE).slice(0, 5)).toEqual([
      aladdinPrinceAli.id,
      arielOnHumanLegs.id,
      simbaProtectiveCub.id,
      healingGlow.id,
      tinkerBellPeterPansAlly.id,
    ]);
  });
});
