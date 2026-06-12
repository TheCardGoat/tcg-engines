import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { castleOfTheHornedKingBastionOfEvil } from "./170-castle-of-the-horned-king-bastion-of-evil";

const gloomQuester = createMockCharacter({
  id: "gloom-quester",
  name: "Gloom Quester",
  cost: 2,
  lore: 1,
});

const secondQuester = createMockCharacter({
  id: "second-quester",
  name: "Second Quester",
  cost: 2,
  lore: 1,
});

const testItem = createMockItem({
  id: "test-item",
  name: "Test Item",
  cost: 1,
});

describe("Castle of the Horned King - Bastion of Evil", () => {
  it("lets you ready a chosen item the first time a character quests here during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        castleOfTheHornedKingBastionOfEvil,
        { card: gloomQuester, atLocation: castleOfTheHornedKingBastionOfEvil },
        { card: testItem, exerted: true },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(testItem).exerted).toBe(true);
    expect(testEngine.asPlayerOne().quest(gloomQuester)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(castleOfTheHornedKingBastionOfEvil).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [testItem] }).success).toBe(true);
    expect(testEngine.asPlayerOne().getCard(testItem).exerted).toBe(false);
  });

  it("does not trigger a second time in the same turn (once per turn)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        castleOfTheHornedKingBastionOfEvil,
        { card: gloomQuester, atLocation: castleOfTheHornedKingBastionOfEvil },
        { card: secondQuester, atLocation: castleOfTheHornedKingBastionOfEvil },
        { card: testItem, exerted: true },
      ],
      deck: 1,
    });

    // First quest triggers the ability
    expect(testEngine.asPlayerOne().quest(gloomQuester)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(castleOfTheHornedKingBastionOfEvil).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [testItem] }).success).toBe(true);
    expect(testEngine.asPlayerOne().getCard(testItem).exerted).toBe(false);

    // Second quest should NOT trigger the ability again
    expect(testEngine.asPlayerOne().quest(secondQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("does not trigger when a character quests NOT at this location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [castleOfTheHornedKingBastionOfEvil, gloomQuester, { card: testItem, exerted: true }],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(gloomQuester)).toBeSuccessfulCommand();
    // No bag should appear since the character is not at the location
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCard(testItem).exerted).toBe(true);
  });
});
