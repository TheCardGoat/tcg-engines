import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckMusketeerSpy } from "./007-daisy-duck-musketeer-spy";

const discardFodder = createMockCharacter({
  id: "daisy-duck-musketeer-spy-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Daisy Duck - Musketeer Spy", () => {
  it("INFILTRATION makes the opponent choose and discard a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [daisyDuckMusketeerSpy],
        inkwell: daisyDuckMusketeerSpy.cost,
      },
      {
        hand: [discardFodder],
      },
    );

    const discardId = testEngine.findCardInstanceId(discardFodder, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(daisyDuckMusketeerSpy)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWith(discardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(daisyDuckMusketeerSpy)).toBe("play");
  });
});
