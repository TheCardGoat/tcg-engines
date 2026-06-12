import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { prideLandsPrideRock } from "../../003/locations";
import { touchTheSkyEnchanted } from "./240-touch-the-sky-enchanted";

describe("Touch the Sky (Enchanted)", () => {
  it("moves a character of yours to a location for free and draws cards equal to that location's lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [touchTheSkyEnchanted],
      inkwell: touchTheSkyEnchanted.cost,
      deck: 5,
      play: [prideLandsPrideRock, arielOnHumanLegs],
    });

    const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

    expect(
      testEngine.asPlayerOne().playCard(touchTheSkyEnchanted, {
        targets: [arielOnHumanLegs, prideLandsPrideRock],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: arielOnHumanLegs,
      location: prideLandsPrideRock,
    });

    // Before: 1 card (touchTheSkyEnchanted) in hand. After playing it, hand decreases by 1,
    // then the player draws cards equal to the location's lore value.
    const handAfter = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;
    const handDelta = handAfter - (handBefore - 1);
    expect(handDelta).toBe(prideLandsPrideRock.lore);
  });
});
