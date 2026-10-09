import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { priscillaEfficientClerk } from "./148-priscilla-efficient-clerk";

const deckA = createMockCharacter({ id: "priscilla-deck-a", name: "Deck A", cost: 2 });
const deckB = createMockItem({ id: "priscilla-deck-b", name: "Deck B", cost: 2 });

describe("Priscilla - Efficient Clerk", () => {
  // CR 1.2.3 and 6.1.3.1: keep the printed hand-then-other-ink assignment.
  it("rejects one-card ink-only assignment, then puts the card in hand", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [deckB],
      inkwell: 2,
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
    });
    expect(g.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "inkwell", cards: [deckB] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(deckB)).toBe("deck");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [deckB] },
          { zone: "inkwell", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(deckB)).toBe("hand");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
  });

  it("rejects incomplete, duplicate and opposing assignments, then permits a valid split", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [deckA, deckB],
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
    });
    expect(g.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk)).toBeSuccessfulCommand();
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    for (const destinations of [
      [
        { zone: "hand", cards: [deckA] },
        { zone: "inkwell", cards: [] },
      ],
      [
        { zone: "hand", cards: [] },
        { zone: "inkwell", cards: [deckB] },
      ],
      [
        { zone: "hand", cards: [deckA] },
        { zone: "inkwell", cards: [deckA] },
      ],
    ]) {
      expect(
        g.asPlayerOne().resolveNextPending({ resolveOptional: true, destinations }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
      expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
      expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(0);
    }
    const destinations = [
      { zone: "hand", cards: [deckB] },
      { zone: "inkwell", cards: [deckA] },
    ];
    expect(
      g.asPlayerTwo().resolveNextPending({ resolveOptional: true, destinations }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(
      g.asPlayerOne().resolveNextPending({ resolveOptional: true, destinations }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(deckB)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(deckA)).toBe("inkwell");
  });

  it("does not trigger Filing System when another character quests", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [deckA, deckB],
      play: [
        { card: priscillaEfficientClerk, isDrying: false },
        { card: deckA, isDrying: false },
      ],
    });
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().quest(deckA)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(g.asPlayerOne().isExerted(priscillaEfficientClerk)).toBe(false);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(0);
  });

  it("keeps duplicate deck copies separate when assigning hand and ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [deckA, deckA],
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
    });
    const [inkId, handId] = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(inkId).not.toBe(handId);
    expect(g.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [handId!] },
          { zone: "inkwell", cards: [inkId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([handId!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toEqual([inkId!]);
    expect(g.asPlayerOne().isExerted(inkId!)).toBe(true);
  });

  it("rejects two cards to hand and permits the required split on retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [deckA, deckB],
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
    });
    expect(g.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [deckA, deckB] },
          { zone: "inkwell", cards: [] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(2);
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [deckB] },
          { zone: "inkwell", cards: [deckA] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(deckA)).toBe("inkwell");
  });

  it("uses player two's deck and inkwell when player two controls Priscilla", () => {
    const draw = createMockItem({ id: "priscilla-turn-draw", name: "Turn Draw", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [deckA, deckA, deckA] },
      { deck: [deckA, deckB, draw], play: [{ card: priscillaEfficientClerk, isDrying: false }] },
    );
    const ownDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolvePendingByCard(priscillaEfficientClerk)).toBeSuccessfulCommand();
    const lookedId = g.findCardInstanceId(deckA, "deck", PLAYER_TWO);
    const handId = g.findCardInstanceId(deckB, "deck", PLAYER_TWO);
    expect(
      g.asPlayerTwo().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [handId!] },
          { zone: "inkwell", cards: [lookedId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(2);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toHaveLength(2);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(ownDeck);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toEqual([lookedId!]);
    expect(g.asPlayerTwo().isExerted(lookedId!)).toBe(true);
  });
  it("with an empty deck gains quest lore without adding a hand or ink card", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [],
      inkwell: 2,
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
    });
    expect(g.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it("with one deck card puts that card into hand and adds no ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [deckB],
      inkwell: 2,
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
    });
    expect(g.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [deckB] },
          { zone: "inkwell", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(deckB)).toBe("hand");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("rejects a card below the looked-at pair and allows a valid retry", () => {
    const below = createMockCharacter({ id: "priscilla-below", name: "Below", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [below, deckA, deckB],
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
    });
    expect(g.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [below] },
          { zone: "inkwell", cards: [deckA] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(below)).toBe("deck");
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [deckB] },
          { zone: "inkwell", cards: [deckA] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(deckB)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(deckA)).toBe("inkwell");
  });
  it("enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [priscillaEfficientClerk],
      inkwell: priscillaEfficientClerk.cost,
    });

    expect(testEngine.asPlayerOne().playCard(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(priscillaEfficientClerk)).toBe(true);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().quest(priscillaEfficientClerk)).not.toBeSuccessfulCommand();
  });

  it("on quest, looks at the top 2: one to hand, one to the inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      deck: [deckA, deckB],
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "hand", cards: [deckB] },
          { zone: "inkwell", cards: [deckA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckB)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(deckA)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(deckA)).toBe(true);
    expect(testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
  });

  it("can decline Filing System without moving either deck card", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [deckA, deckB],
      play: [{ card: priscillaEfficientClerk, isDrying: false }],
      inkwell: 2,
    });
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().quest(priscillaEfficientClerk)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(priscillaEfficientClerk, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });
});
