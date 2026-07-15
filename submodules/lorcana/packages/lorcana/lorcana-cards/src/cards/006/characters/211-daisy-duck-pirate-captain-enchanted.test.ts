import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { daisyDuckPirateCaptainEnchanted } from "./211-daisy-duck-pirate-captain-enchanted";

const testLocation = createMockLocation({
  id: "daisy-test-location",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  willpower: 7,
  lore: 1,
});

describe("Daisy Duck - Pirate Captain (Enchanted)", () => {
  it("Distant Shores draws a card when Daisy quests while at a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: daisyDuckPirateCaptainEnchanted, atLocation: testLocation }, testLocation],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(daisyDuckPirateCaptainEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(daisyDuckPirateCaptainEnchanted)).toBe("play");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 0,
      hand: 1,
      play: 2,
    });
  });

  it("does not draw a card when Daisy quests outside a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [daisyDuckPirateCaptainEnchanted],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(daisyDuckPirateCaptainEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 1,
      hand: 0,
      play: 1,
    });
  });
});
