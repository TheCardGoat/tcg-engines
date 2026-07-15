import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { whatElseCanIDoEnchanted } from "./237-what-else-can-i-do-enchanted";

const deckCardOne = createMockCharacter({
  id: "what-else-can-i-do-enchanted-deck-one",
  name: "Deck Card One",
  cost: 2,
});

const deckCardTwo = createMockCharacter({
  id: "what-else-can-i-do-enchanted-deck-two",
  name: "Deck Card Two",
  cost: 3,
});

const yourCharacterOne = createMockCharacter({
  id: "what-else-can-i-do-enchanted-your-one",
  name: "Your Character One",
  cost: 2,
});

const yourCharacterTwo = createMockCharacter({
  id: "what-else-can-i-do-enchanted-your-two",
  name: "Your Character Two",
  cost: 2,
});

const singer = createMockCharacter({
  id: "what-else-can-i-do-enchanted-singer",
  name: "Singer",
  cost: 5,
});

describe("What Else Can I Do? (Enchanted)", () => {
  it("puts one looked-at card into your hand and the other into your inkwell exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [whatElseCanIDoEnchanted],
      inkwell: whatElseCanIDoEnchanted.cost,
      deck: [deckCardOne, deckCardTwo],
    });

    expect(
      testEngine.asPlayerOne().playCard(whatElseCanIDoEnchanted, {
        destinations: [
          { zone: "hand", cards: [deckCardTwo] },
          { zone: "inkwell", cards: [deckCardOne] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckCardTwo)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(deckCardOne)).toBe("inkwell");
    expect(testEngine.isExerted(deckCardOne)).toBe(true);
  });

  it("does NOT grant Ward to your characters when played from hand (no singer)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [whatElseCanIDoEnchanted],
      inkwell: whatElseCanIDoEnchanted.cost,
      deck: [deckCardOne, deckCardTwo],
      play: [yourCharacterOne, yourCharacterTwo],
    });

    expect(
      testEngine.asPlayerOne().playCard(whatElseCanIDoEnchanted, {
        destinations: [
          { zone: "hand", cards: [deckCardTwo] },
          { zone: "inkwell", cards: [deckCardOne] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(yourCharacterOne, "Ward")).toBe(false);
    expect(testEngine.asPlayerOne().hasKeyword(yourCharacterTwo, "Ward")).toBe(false);
  });

  it("grants Ward to your characters when sung by a character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [whatElseCanIDoEnchanted],
      deck: [deckCardOne, deckCardTwo],
      play: [singer, yourCharacterOne, yourCharacterTwo],
    });

    expect(
      testEngine.asPlayerOne().singSong(whatElseCanIDoEnchanted, singer),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(whatElseCanIDoEnchanted, {
        destinations: [
          { zone: "hand", cards: [deckCardTwo] },
          { zone: "inkwell", cards: [deckCardOne] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(singer, "Ward")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(yourCharacterOne, "Ward")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(yourCharacterTwo, "Ward")).toBe(true);
  });
});
