import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { duchessCosmopolitanCat } from "./153-duchess-cosmopolitan-cat";
import { dragonFire } from "../../001/actions/130-dragon-fire";

const topCard = createMockCharacter({ id: "duchess-top", name: "Top", cost: 2 });
const cheapAlly = createMockCharacter({ id: "duchess-ally", name: "Cheap Ally", cost: 1 });
const priceyAlly = createMockCharacter({ id: "duchess-pricey", name: "Pricey Ally", cost: 9 });

describe("Duchess - Cosmopolitan Cat", () => {
  it("rejects opposing resolution and duplicate destinations, then retries the mandatory look", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: duchessCosmopolitanCat, isDrying: false }],
      deck: [cheapAlly, topCard],
    });
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    const destinations = [
      { zone: "deck-top", cards: [topCard] },
      { zone: "deck-bottom", cards: [] },
    ];
    expect(g.asPlayerTwo().resolveNextPending({ destinations })).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [topCard] },
          { zone: "deck-bottom", cards: [topCard] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(g.asPlayerOne().resolveNextPending({ destinations })).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("Player Two's separate copies lose and regain their tied bonus as the highest character changes", () => {
    const opponent = createMockCharacter({ id: "duchess-p2-high", name: "Opponent", cost: 9 });
    const draw = createMockItem({ id: "duchess-p2-draw", name: "Draw", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [opponent] },
      {
        play: [
          { card: duchessCosmopolitanCat, isDrying: false },
          { card: duchessCosmopolitanCat, isDrying: false },
          { card: duchessCosmopolitanCat, isDrying: false },
          priceyAlly,
        ],
        hand: [dragonFire, priceyAlly],
        inkwell: 14,
        deck: [draw],
      },
    );
    const sources = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const oldHigh = g.findCardInstanceId(priceyAlly, "play", PLAYER_TWO);
    const replacement = g.findCardInstanceId(priceyAlly, "hand", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(sources[0]!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(2);
    expect(g.asPlayerTwo().playCard(dragonFire, { targets: [oldHigh!] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(sources[1]!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(3);
    expect(g.asPlayerTwo().playCard(replacement!)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(sources[2]!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(5);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerTwo().getBagEffects()).toHaveLength(0);
  });

  it("uses player two's deck and lore when player two controls Duchess", () => {
    const draw = createMockItem({ id: "duchess-turn-draw", name: "Turn Draw", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [cheapAlly, topCard] },
      {
        play: [{ card: duchessCosmopolitanCat, isDrying: false }],
        deck: [cheapAlly, topCard, draw],
      },
    );
    const ownDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const [bottomId, topId] = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerTwo().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolvePendingByCard(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [topId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([topId!, bottomId!]);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(ownDeck);
    expect(g.getLore(PLAYER_TWO)).toBe(2);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });

  it("finishes Proper Etiquette with an empty deck without leaving a prompt", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: duchessCosmopolitanCat, isDrying: false }],
      deck: [],
    });
    expect(g.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("rejects a card below the looked-at top card and permits a valid retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: duchessCosmopolitanCat, isDrying: false }],
      deck: [cheapAlly, topCard],
    });
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [cheapAlly] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [topCard] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([topCard.id, cheapAlly.id]);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("moves only the top instance when the deck contains identical copies", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: duchessCosmopolitanCat, isDrying: false }],
      deck: [topCard, topCard],
    });
    const [bottomId, topId] = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(bottomId).not.toBe(topId);
    expect(g.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [topId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([topId!, bottomId!]);
  });

  it("ignores an opposing item with a higher cost than every character", () => {
    const item = createMockItem({ id: "duchess-expensive-item", name: "Expensive Item", cost: 12 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: duchessCosmopolitanCat, isDrying: false }], deck: [] },
      { play: [item] },
    );
    expect(g.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("loses the bonus before questing when the friendly highest-cost character leaves", () => {
    const opponent = createMockCharacter({ id: "duchess-middle", name: "Middle Cost", cost: 4 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dragonFire],
        inkwell: 5,
        play: [{ card: duchessCosmopolitanCat, isDrying: false }, priceyAlly],
        deck: [],
      },
      { play: [opponent] },
    );
    expect(g.asPlayerOne().playCard(dragonFire, { targets: [priceyAlly] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(priceyAlly)).toBe("discard");
    expect(g.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });
  it("gains the bonus when the highest character cost is tied across players", () => {
    const opposingTie = createMockCharacter({
      id: "duchess-opposing-tie",
      name: "Opposing Tie",
      cost: 9,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: duchessCosmopolitanCat, isDrying: false }, priceyAlly], deck: [] },
      { play: [opposingTie] },
    );
    expect(g.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("Duchess herself can satisfy the highest-cost character condition", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: duchessCosmopolitanCat, isDrying: false }],
      deck: [],
    });
    expect(g.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });
  it("gets +1 {L} while your highest-cost character ties the game's highest", () => {
    // Duchess (1) + pricey ally (9): the game's highest is 9, owned by you.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [duchessCosmopolitanCat],
        inkwell: duchessCosmopolitanCat.cost,
        play: [priceyAlly],
      },
      { play: [cheapAlly] },
    );

    expect(testEngine.asPlayerOne().playCard(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("no bonus when an opponent owns the highest-cost character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [duchessCosmopolitanCat],
        inkwell: duchessCosmopolitanCat.cost,
        play: [cheapAlly],
      },
      { play: [priceyAlly] },
    );

    expect(testEngine.asPlayerOne().playCard(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("on quest, puts the looked-at card on top or bottom of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: duchessCosmopolitanCat, isDrying: false }],
      deck: [cheapAlly, topCard],
    });

    expect(testEngine.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(duchessCosmopolitanCat),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [topCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    const deck = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    // Index 0 is the bottom of the deck: topCard moved to the bottom.
    expect(deck).toEqual([topCard.id, cheapAlly.id]);
  });

  it("on quest, can leave the looked-at card on top of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: duchessCosmopolitanCat, isDrying: false }],
      deck: [cheapAlly, topCard],
    });

    expect(testEngine.asPlayerOne().quest(duchessCosmopolitanCat)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(duchessCosmopolitanCat),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [topCard] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();

    const deck = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    expect(deck).toEqual([cheapAlly.id, topCard.id]);
  });
});
