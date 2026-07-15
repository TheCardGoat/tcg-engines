import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cursedMerfolkUrsulasHandiwork } from "@tcg/lorcana-cards/cards/003";
import { nickWildePersistentInvestigator } from "@tcg/lorcana-cards/cards/010";

const poorSoulsDiscard = createMockCharacter({
  id: "the-962-poor-souls-discard",
  name: "Discard fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

/**
 * THE-962: "during your turn" (`whose: "your"`) must use turn owner, not priority holder, so
 * CASE CLOSED still triggers after Poor Souls mid-challenge.
 */
describe("THE-962 — Nick Wilde CASE CLOSED vs Cursed Merfolk", () => {
  it("draws after banishing Cursed Merfolk once Poor Souls discard resolves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nickWildePersistentInvestigator, isDrying: false }],
        hand: [poorSoulsDiscard],
        deck: 3,
      },
      {
        play: [{ card: cursedMerfolkUrsulasHandiwork, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .challenge(nickWildePersistentInvestigator, cursedMerfolkUrsulasHandiwork),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cursedMerfolkUrsulasHandiwork, {
        targets: [poorSoulsDiscard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cursedMerfolkUrsulasHandiwork)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(poorSoulsDiscard)).toBe("discard");

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });
});
