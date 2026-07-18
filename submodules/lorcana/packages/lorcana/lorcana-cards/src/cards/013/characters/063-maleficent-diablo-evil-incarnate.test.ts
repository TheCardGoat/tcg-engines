import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { maleficentExultantSpellcaster } from "./039-maleficent-exultant-spellcaster";
import { maleficentDiabloEvilIncarnate } from "./063-maleficent-diablo-evil-incarnate";
import { diabloProtectingHisMistress } from "./193-diablo-protecting-his-mistress";

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
    const player = testEngine.asPlayerOne();
    const cardId = testEngine.findCardInstanceId(maleficentDiabloEvilIncarnate, "hand", PLAYER_ONE);
    const shiftTarget = testEngine.findCardInstanceId(
      maleficentExultantSpellcaster,
      "play",
      "player_one",
    );

    expect(player.getShiftPlayDisabledReason(cardId)).toBeNull();
    expect(
      player.getAvailableMoves().find((move) => move.moveId === "shiftCard")?.selectableCardIds,
    ).toContain(cardId);
    expect(player.getMoveOptions("shiftCard", cardId)).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "card", cardId: shiftTarget })]),
    );
    expect(
      player.playCard(maleficentDiabloEvilIncarnate, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(player.getCardZone(maleficentDiabloEvilIncarnate)).toBe("play");
    expect(testEngine.getCardsUnder(maleficentDiabloEvilIncarnate)).toEqual([shiftTarget]);
  });

  it("can shift onto a character named Diablo", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [maleficentDiabloEvilIncarnate],
      play: [diabloProtectingHisMistress],
      inkwell: 5,
    });
    const player = testEngine.asPlayerOne();
    const cardId = testEngine.findCardInstanceId(maleficentDiabloEvilIncarnate, "hand", PLAYER_ONE);
    const shiftTarget = testEngine.findCardInstanceId(
      diabloProtectingHisMistress,
      "play",
      "player_one",
    );

    expect(player.getShiftPlayDisabledReason(cardId)).toBeNull();
    expect(
      player.getAvailableMoves().find((move) => move.moveId === "shiftCard")?.selectableCardIds,
    ).toContain(cardId);
    expect(player.getMoveOptions("shiftCard", cardId)).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "card", cardId: shiftTarget })]),
    );
    expect(
      player.playCard(maleficentDiabloEvilIncarnate, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(player.getCardZone(maleficentDiabloEvilIncarnate)).toBe("play");
    expect(testEngine.getCardsUnder(maleficentDiabloEvilIncarnate)).toEqual([shiftTarget]);
  });

  it("puts 5 character cards from discard on the bottom of the deck to shift for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [maleficentDiabloEvilIncarnate],
      play: [maleficentExultantSpellcaster],
      discard: discardCharacters,
      inkwell: 0,
    });
    const player = testEngine.asPlayerOne();
    const cardId = testEngine.findCardInstanceId(maleficentDiabloEvilIncarnate, "hand", PLAYER_ONE);
    const shiftTarget = testEngine.findCardInstanceId(
      maleficentExultantSpellcaster,
      "play",
      "player_one",
    );
    const deckBottomTargets = discardCharacters.map((card) =>
      testEngine.findCardInstanceId(card, "discard", "player_one"),
    );

    expect(player.getShiftPlayDisabledReason(cardId)).toBeNull();
    expect(
      player.getAvailableMoves().find((move) => move.moveId === "shiftCard")?.selectableCardIds,
    ).toContain(cardId);
    expect(player.getMoveOptions("shiftCard", cardId)).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "card", cardId: shiftTarget })]),
    );
    expect(
      player.playCard(maleficentDiabloEvilIncarnate, {
        cost: { cost: "shift", shiftTarget, deckBottomTargets },
      }),
    ).toBeSuccessfulCommand();

    expect(player.getCardZone(maleficentDiabloEvilIncarnate)).toBe("play");
    expect(testEngine.getCardsUnder(maleficentDiabloEvilIncarnate)).toEqual([shiftTarget]);
    for (const discardCharacter of discardCharacters) {
      expect(player.getCardZone(discardCharacter)).toBe("deck");
    }
  });

  it("can shift onto Diablo for free by putting 5 character cards from discard on the deck bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [maleficentDiabloEvilIncarnate],
      play: [diabloProtectingHisMistress],
      discard: discardCharacters,
      inkwell: 0,
    });
    const player = testEngine.asPlayerOne();
    const cardId = testEngine.findCardInstanceId(maleficentDiabloEvilIncarnate, "hand", PLAYER_ONE);
    const shiftTarget = testEngine.findCardInstanceId(
      diabloProtectingHisMistress,
      "play",
      PLAYER_ONE,
    );
    const deckBottomTargets = discardCharacters.map((card) =>
      testEngine.findCardInstanceId(card, "discard", PLAYER_ONE),
    );

    expect(player.getShiftPlayDisabledReason(cardId)).toBeNull();
    expect(
      player.getAvailableMoves().find((move) => move.moveId === "shiftCard")?.selectableCardIds,
    ).toContain(cardId);
    expect(player.getMoveOptions("shiftCard", cardId)).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "card", cardId: shiftTarget })]),
    );
    expect(
      player.playCard(maleficentDiabloEvilIncarnate, {
        cost: { cost: "shift", shiftTarget, deckBottomTargets },
      }),
    ).toBeSuccessfulCommand();

    expect(player.getCardZone(maleficentDiabloEvilIncarnate)).toBe("play");
    expect(testEngine.getCardsUnder(maleficentDiabloEvilIncarnate)).toEqual([shiftTarget]);
    for (const discardCharacter of discardCharacters) {
      expect(player.getCardZone(discardCharacter)).toBe("deck");
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
