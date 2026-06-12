import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { familyFishingPole } from "./100-family-fishing-pole";

const reeledInFriend = createMockCharacter({
  id: "family-fishing-pole-friend",
  name: "Reeled In Friend",
  cost: 2,
});

describe("Family Fishing Pole", () => {
  it("enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [familyFishingPole],
      inkwell: familyFishingPole.cost,
    });

    expect(testEngine.asPlayerOne().playCard(familyFishingPole)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(familyFishingPole)).toBe(true);
  });

  it("returns your chosen exerted character to hand and gains 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [familyFishingPole, { card: reeledInFriend, exerted: true, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(familyFishingPole, {
        targets: [reeledInFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(reeledInFriend)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(familyFishingPole)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });
});
