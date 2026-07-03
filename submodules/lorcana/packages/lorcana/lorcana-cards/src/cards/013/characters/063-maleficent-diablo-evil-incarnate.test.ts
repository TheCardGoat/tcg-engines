import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maleficentExultantSpellcaster } from "./039-maleficent-exultant-spellcaster";
import { maleficentDiabloEvilIncarnate } from "./063-maleficent-diablo-evil-incarnate";

const discardCharacters = Array.from({ length: 5 }, (_, index) =>
  createMockCharacter({
    id: `maleficent-diablo-fools-discard-${index + 1}`,
    name: `Discard Character ${index + 1}`,
    cost: 1,
  }),
);

const drawnCard = createMockCharacter({
  id: "maleficent-diablo-ravens-call-draw",
  name: "Raven's Call Draw",
  cost: 1,
});

describe("Maleficent & Diablo - Evil Incarnate", () => {
  it("can shift onto a character named Maleficent", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [maleficentDiabloEvilIncarnate],
      play: [maleficentExultantSpellcaster],
      inkwell: 5,
    });
    const shiftTarget = testEngine.findCardInstanceId(
      maleficentExultantSpellcaster,
      "play",
      "player_one",
    );

    expect(
      testEngine.asPlayerOne().playCard(maleficentDiabloEvilIncarnate, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(maleficentDiabloEvilIncarnate)).toBe("play");
  });

  it("puts 5 character cards from discard on the bottom of the deck to shift for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [maleficentDiabloEvilIncarnate],
      play: [maleficentExultantSpellcaster],
      discard: discardCharacters,
      inkwell: 0,
    });
    const shiftTarget = testEngine.findCardInstanceId(
      maleficentExultantSpellcaster,
      "play",
      "player_one",
    );
    const deckBottomTargets = discardCharacters.map((card) =>
      testEngine.findCardInstanceId(card, "discard", "player_one"),
    );

    expect(
      testEngine.asPlayerOne().playCard(maleficentDiabloEvilIncarnate, {
        cost: { cost: "shift", shiftTarget, deckBottomTargets },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(maleficentDiabloEvilIncarnate)).toBe("play");
    for (const discardCharacter of discardCharacters) {
      expect(testEngine.asPlayerOne().getCardZone(discardCharacter)).toBe("deck");
    }
  });

  it("draws a card when exerting during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [maleficentDiabloEvilIncarnate],
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().quest(maleficentDiabloEvilIncarnate)).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentDiabloEvilIncarnate),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });
});
