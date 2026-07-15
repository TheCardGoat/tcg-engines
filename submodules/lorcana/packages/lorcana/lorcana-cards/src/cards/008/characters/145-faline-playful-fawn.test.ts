import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { falinePlayfulFawn } from "./145-faline-playful-fawn";
import { hiroHamadaIntuitiveThinker } from "./106-hiro-hamada-intuitive-thinker";
import { princeJohnFraidycat } from "./146-prince-john-fraidy-cat";

describe("Faline - Playful Fawn", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [falinePlayfulFawn],
      deck: 5,
    });

    const card = testEngine.asPlayerOne().getCard(falinePlayfulFawn);
    expect(card.hasEvasive).toBe(true);
  });

  it("PRECOCIOUS FRIEND - gets +2 lore while you have a character with more strength than each opposing character", () => {
    // Faline has strength 2. Prince John has strength 5. Hiro Hamada has strength 1.
    // With no opponent characters, Faline (str 2) has the highest — bonus applies
    // With opponent having Hiro (str 1), Faline (str 2) still has highest — bonus applies
    // After Prince John (str 5) enters the opponent's play, they have the stronger char — no bonus

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [falinePlayfulFawn],
        deck: 5,
      },
      {
        play: [],
        hand: [hiroHamadaIntuitiveThinker, princeJohnFraidycat],
        inkwell: hiroHamadaIntuitiveThinker.cost + princeJohnFraidycat.cost,
        deck: 5,
      },
    );

    // Faline in play, no opponent characters — she has highest → +2 lore (base 1 + bonus 2 = 3)
    expect(testEngine.asPlayerOne().getCardLore(falinePlayfulFawn)).toBe(3);

    // Pass to player two's turn so they can play cards
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent plays Hiro Hamada (str 1) — Faline (str 2) still has higher → +2 lore
    expect(testEngine.asPlayerTwo().playCard(hiroHamadaIntuitiveThinker)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardLore(falinePlayfulFawn)).toBe(3);

    // Opponent plays Prince John (str 5) — now opponent has a stronger character → no bonus
    expect(testEngine.asPlayerTwo().playCard(princeJohnFraidycat)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardLore(falinePlayfulFawn)).toBe(1);
  });
});
