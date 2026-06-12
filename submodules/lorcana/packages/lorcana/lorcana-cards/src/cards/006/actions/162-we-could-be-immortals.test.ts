import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { weCouldBeImmortals } from "./162-we-could-be-immortals";

const inventorCharacter = createMockCharacter({
  id: "inventor-character",
  name: "Inventor Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Inventor"],
});

const nonInventorCharacter = createMockCharacter({
  id: "non-inventor-character",
  name: "Non Inventor Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("We Could Be Immortals", () => {
  it("gives your Inventor characters Resist +6 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weCouldBeImmortals],
      inkwell: weCouldBeImmortals.cost,
      play: [inventorCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(weCouldBeImmortals)).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(inventorCharacter, "Resist")).toBe(6);
  });

  it("does not give Resist to non-Inventor characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weCouldBeImmortals],
      inkwell: weCouldBeImmortals.cost,
      play: [inventorCharacter, nonInventorCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(weCouldBeImmortals)).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(inventorCharacter, "Resist")).toBe(6);
    expect(testEngine.getKeywordValue(nonInventorCharacter, "Resist")).toBeNull();
  });

  it("puts itself into the inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weCouldBeImmortals],
      inkwell: weCouldBeImmortals.cost,
      play: [inventorCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(weCouldBeImmortals)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(weCouldBeImmortals)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(weCouldBeImmortals)).toBe(true);
  });

  it("removes the Resist bonus at the end of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [weCouldBeImmortals],
        inkwell: weCouldBeImmortals.cost,
        play: [inventorCharacter],
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(weCouldBeImmortals)).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(inventorCharacter, "Resist")).toBe(6);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(inventorCharacter, "Resist")).toBeNull();
  });
});
