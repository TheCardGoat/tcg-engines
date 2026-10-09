import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cinderellaHomespunDressmaker } from "./138-cinderella-homespun-dressmaker";
import { cinderellaUnintentionalIcon } from "./157-cinderella-unintentional-icon";

const shiftBase = cinderellaHomespunDressmaker;

const topCard = createMockCharacter({ id: "cinderella-top", name: "Top Card", cost: 1 });
const secondCard = createMockCharacter({ id: "cinderella-second", name: "Second Card", cost: 2 });

// CR 8.10.1–8.10.6: Shift uses the named own character and retains its state and damage.
// CR 6.2.3, 6.1.4: each end-turn copy has a separate optional resolution.
// https://files.disneylorcana.com/Comprehensive-Rules_2.2.0-EN.pdf
describe("Cinderella - Unintentional Icon", () => {
  it("Player Two copies independently decline and assign only their own looked-at cards", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6, inkwell: 1 },
      {
        play: [cinderellaUnintentionalIcon, cinderellaUnintentionalIcon],
        deck: [topCard, secondCard, topCard],
        inkwell: 2,
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const ar = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(2);
    expect(
      g.asPlayerTwo().resolvePendingByCard(ar[0]!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(before);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(2);
    expect(g.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      g.asPlayerTwo().resolvePendingByCard(ar[1]!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ destinations: [] })).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [before[0]!] },
          { zone: "inkwell", cards: [before[1]!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([before[0]!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(before[1]!);
    expect(g.isCardFaceDown(before[1]!, "inkwell", PLAYER_TWO)).toBe(true);
    expect(g.asPlayerTwo().isExerted(before[1]!)).toBe(true);
    expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(1);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
  });
  for (const targetOwner of [PLAYER_ONE, PLAYER_TWO]) {
    it(`rejects an invalid Shift target owned by ${targetOwner} without payment`, () => {
      const other = createMockCharacter({
        id: "base-shift-wrong-name",
        name: "Other Character",
        cost: 1,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [cinderellaUnintentionalIcon], play: [other], inkwell: 5, deck: 6 },
        { play: [shiftBase], deck: 6 },
      );
      const target = targetOwner === PLAYER_ONE ? other : shiftBase;
      const shiftTarget = engine.findCardInstanceId(target, "play", targetOwner);
      const owner = engine.asPlayerOne();
      expect(
        owner.playCard(cinderellaUnintentionalIcon, { cost: { cost: "shift", shiftTarget } })
          .success,
      ).toBe(false);
      expect(owner.getAvailableInk(PLAYER_ONE)).toBe(5);
      expect(owner.getCardZone(cinderellaUnintentionalIcon)).toBe("hand");
      expect(owner.getCardZone(target)).toBe("play");
      expect(owner.getBagCount()).toBe(0);
    });
  }

  it("requires one ink destination after looking at two and allows a valid retry", () => {
    const kept = createMockCharacter({ id: "base-required-kept", name: "Kept", cost: 1 });
    const inked = createMockCharacter({
      id: "base-required-ink",
      name: "Uninkable",
      cost: 1,
      inkable: false,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIcon], deck: [inked, kept], inkwell: 2 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    const before = engine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(
      owner.resolvePendingByCard(cinderellaUnintentionalIcon, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      owner.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [kept] },
          { zone: "deck-bottom", cards: [inked] },
          { zone: "inkwell", cards: [] },
        ],
      }).success,
    ).toBe(false);
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(owner.getPendingEffects()).toHaveLength(1);
    expect(
      owner.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [kept] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [inked] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(owner.getCardZone(inked)).toBe("inkwell");
    expect(engine.isCardFaceDown(before[0]!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(owner.isExerted(inked)).toBe(true);
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(owner.isExerted(inked)).toBe(false);
    expect(engine.isCardFaceDown(before[0]!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(owner.getPendingEffects()).toHaveLength(0);
  });

  it("rejects a six-ink normal play without moving or paying", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIcon],
      inkwell: 6,
      deck: 6,
    });
    const owner = engine.asPlayerOne();
    expect(owner.playCard(cinderellaUnintentionalIcon).success).toBe(false);
    expect(owner.getCardZone(cinderellaUnintentionalIcon)).toBe("hand");
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(6);
    expect(owner.getBagCount()).toBe(0);
  });

  it("player two uses only their own deck and ink at their turn end", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [topCard, secondCard], inkwell: 1 },
      { play: [cinderellaUnintentionalIcon], deck: [topCard, secondCard, topCard], inkwell: 2 },
    );
    const ownDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
    const [keptId, inkId] = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(cinderellaUnintentionalIcon, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ destinations: [] })).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [keptId!] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [inkId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(inkId!);
    expect(g.isCardFaceDown(inkId!, "inkwell", PLAYER_TWO)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(ownDeck.slice(0, -1));
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual(ownDeck.slice(-1));
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(1);
  });

  it("normal entry pays seven ink and cannot quest while drying", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIcon],
      inkwell: 7,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(cinderellaUnintentionalIcon)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardZone(cinderellaUnintentionalIcon)).toBe("play");
    expect(g.asPlayerOne().quest(cinderellaUnintentionalIcon)).not.toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("can be inked without triggering Bespoke Design", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIcon],
      deck: 3,
    });
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, cinderellaUnintentionalIcon),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(cinderellaUnintentionalIcon)).toBe("inkwell");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("with one deck card can put that card on top without adding ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIcon], deck: [topCard] },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(cinderellaUnintentionalIcon, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [topCard] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([topCard.id]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(0);
  });

  it("rejects an untouched card and permits a valid top-placement retry", () => {
    const below = createMockCharacter({ id: "icon-below", name: "Below", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIcon], deck: [below, secondCard, topCard] },
      { deck: 3 },
    );
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(cinderellaUnintentionalIcon, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [below] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [secondCard] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [topCard] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [secondCard] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([below.id, topCard.id]);
    expect(g.asPlayerOne().getCardZone(secondCard)).toBe("inkwell");
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("keeps duplicate deck instances separate when assigning deck and ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIcon], deck: [topCard, topCard] },
      { deck: 3 },
    );
    const [keptId, inkId] = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(keptId).not.toBe(inkId);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(cinderellaUnintentionalIcon, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [keptId!] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [inkId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([keptId!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toEqual([inkId!]);
    expect(g.asPlayerOne().isExerted(inkId!)).toBe(true);
  });

  for (const isDrying of [false, true]) {
    for (const exerted of [false, true]) {
      it(`Shift preserves damage, drying ${isDrying}, and exertion ${exerted}`, () => {
        const g = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [cinderellaUnintentionalIcon],
          inkwell: 5,
          play: [{ card: shiftBase, damage: 2, exerted, isDrying }],
          deck: 3,
        });
        const shiftTarget = g.findCardInstanceId(shiftBase, "play", PLAYER_ONE);
        expect(
          g.asPlayerOne().playCard(cinderellaUnintentionalIcon, {
            cost: { cost: "shift", shiftTarget },
          }),
        ).toBeSuccessfulCommand();
        expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
        const shifted = g.findCardInstanceId(cinderellaUnintentionalIcon, "play", PLAYER_ONE);
        expect(g.getCardsUnder(shifted!)).toContain(shiftTarget!);
        expect(g.asPlayerOne().getBagCount()).toBe(0);
        expect(g.asPlayerOne().getCard(cinderellaUnintentionalIcon).damage).toBe(2);
        expect(g.asPlayerOne().isExerted(cinderellaUnintentionalIcon)).toBe(exerted);
        if (isDrying || exerted) {
          expect(g.asPlayerOne().quest(cinderellaUnintentionalIcon)).not.toBeSuccessfulCommand();
        } else {
          expect(g.asPlayerOne().quest(cinderellaUnintentionalIcon)).toBeSuccessfulCommand();
          expect(g.getLore(PLAYER_ONE)).toBe(3);
        }
      });
    }
  }

  it("Shift with four ink fails without payment or consuming the base", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIcon],
      inkwell: 4,
      play: [shiftBase],
    });
    const shiftTarget = g.findCardInstanceId(shiftBase, "play", PLAYER_ONE);
    expect(
      g.asPlayerOne().playCard(cinderellaUnintentionalIcon, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(g.asPlayerOne().getCardZone(shiftBase)).toBe("play");
    expect(g.asPlayerOne().getCardZone(cinderellaUnintentionalIcon)).toBe("hand");
  });

  it("bottom placement puts the chosen looked-at card below untouched cards", () => {
    const untouched = createMockCharacter({
      id: "cinderella-untouched",
      name: "Untouched",
      cost: 1,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIcon], deck: [untouched, secondCard, topCard], inkwell: 2 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(cinderellaUnintentionalIcon, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [topCard] },
          { zone: "inkwell", cards: [secondCard] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([topCard.id, untouched.id]);
    expect(g.asPlayerOne().isExerted(secondCard)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
  });

  it("Shift 5 - can shift onto a Cinderella character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIcon],
      inkwell: 10,
      play: [shiftBase],
    });

    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(cinderellaUnintentionalIcon, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(cinderellaUnintentionalIcon)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(shiftBase)).not.toBe("play");
  });

  it("BESPOKE DESIGN - at end of turn, puts one looked-at card into the inkwell facedown and exerted and the other on the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: cinderellaUnintentionalIcon, isDrying: false }],
      deck: [topCard, secondCard],
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cinderellaUnintentionalIcon, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [topCard] },
          { zone: "inkwell", cards: [secondCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(secondCard)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCard(secondCard).exerted).toBe(true);
    expect(testEngine.isCardFaceDown(secondCard, "inkwell", PLAYER_ONE)).toBe(true);

    // topCard went to the bottom; secondCard left the deck.
    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    expect(deckIds).toEqual([topCard.id]);
  });

  it("BESPOKE DESIGN - declining leaves the deck untouched", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: cinderellaUnintentionalIcon, isDrying: false }],
      deck: [topCard, secondCard],
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cinderellaUnintentionalIcon, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    expect(deckIds).toEqual([topCard.id, secondCard.id]);
    expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(0);
  });

  // CR 3.4.1.1–3.4.2: resolve end-turn abilities before the final deck-loss check.
  it("BESPOKE DESIGN - declining on an empty deck precedes the final loss", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: cinderellaUnintentionalIcon, isDrying: false }],
      deck: [],
    });

    try {
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(testEngine.asServer().getWinner()).toBeUndefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(cinderellaUnintentionalIcon, { resolveOptional: false }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asServer().getWinner()).toBe(PLAYER_TWO);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    } finally {
      testEngine.dispose();
    }
  });
});
