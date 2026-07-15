import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { shieldOfVirtue } from "../../001/items";
import { salvageOperation } from "./165-salvage-operation";

const bigWillpowerCharacter = createMockCharacter({
  id: "salvage-op-big-w",
  name: "Hefty Ally",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
});

const smallWillpowerCharacter = createMockCharacter({
  id: "salvage-op-small-w",
  name: "Tiny Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Salvage Operation", () => {
  it("returns a chosen item card from your discard to your hand and gains 1 lore when you have a character with 4 {W} or more in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [salvageOperation],
      inkwell: salvageOperation.cost,
      discard: [shieldOfVirtue],
      play: [bigWillpowerCharacter],
    });

    const loreBefore = testEngine.asPlayerOne().getLore("player_one");

    expect(
      testEngine.asPlayerOne().playCard(salvageOperation, {
        targets: [shieldOfVirtue],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(shieldOfVirtue)).toBe("hand");
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(loreBefore + 1);
  });

  it("returns the item but does not gain lore when you have no character with 4 {W} or more in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [salvageOperation],
      inkwell: salvageOperation.cost,
      discard: [shieldOfVirtue],
      play: [smallWillpowerCharacter],
    });

    const loreBefore = testEngine.asPlayerOne().getLore("player_one");

    expect(
      testEngine.asPlayerOne().playCard(salvageOperation, {
        targets: [shieldOfVirtue],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(shieldOfVirtue)).toBe("hand");
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(loreBefore);
  });
});
