import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyGalumphingGumshoeEnchanted } from "./223-goofy-galumphing-gumshoe-enchanted";

const opposingCharacterOne = createMockCharacter({
  id: "goofy-galumphing-gumshoe-enchanted-opponent-1",
  name: "Opposing Character One",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const opposingCharacterTwo = createMockCharacter({
  id: "goofy-galumphing-gumshoe-enchanted-opponent-2",
  name: "Opposing Character Two",
  cost: 4,
  strength: 5,
  willpower: 4,
});

describe("Goofy - Galumphing Gumshoe Enchanted", () => {
  it("HOT PURSUIT applies -1 strength to each opposing character when Goofy is played until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        hand: [goofyGalumphingGumshoeEnchanted],
        inkwell: goofyGalumphingGumshoeEnchanted.cost,
      },
      {
        deck: 2,
        play: [opposingCharacterOne, opposingCharacterTwo],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(goofyGalumphingGumshoeEnchanted),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(2);
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(4);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(2);
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(4);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(3);
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(5);
  });

  it("HOT PURSUIT applies -1 strength to each opposing character whenever Goofy quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [{ card: goofyGalumphingGumshoeEnchanted, isDrying: false }],
      },
      {
        deck: 2,
        play: [opposingCharacterOne, opposingCharacterTwo],
      },
    );

    expect(testEngine.asPlayerOne().quest(goofyGalumphingGumshoeEnchanted)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(2);
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(4);
  });
});
