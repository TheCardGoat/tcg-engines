import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gadgetHackwrenchQuirkyScientist } from "./099-gadget-hackwrench-quirky-scientist";

const drawnCard = createMockCharacter({
  id: "gadget-quirky-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Gadget Hackwrench - Quirky Scientist", () => {
  it("may draw a card when an opponent has more cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [gadgetHackwrenchQuirkyScientist],
        inkwell: gadgetHackwrenchQuirkyScientist.cost,
        deck: [drawnCard],
      },
      {
        hand: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(gadgetHackwrenchQuirkyScientist),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gadgetHackwrenchQuirkyScientist),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });

  it("does not trigger when the opponent has the same number of cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [gadgetHackwrenchQuirkyScientist],
        inkwell: gadgetHackwrenchQuirkyScientist.cost,
        deck: [drawnCard],
      },
      {
        hand: 0,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(gadgetHackwrenchQuirkyScientist),
    ).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });
});
