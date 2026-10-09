// Rules grounding: Intense Research looks at the top 2 cards of your deck
// (top 5 instead if an ink drop was removed to pay for it), puts one into your
// hand and the rest on the bottom of the deck in any order.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { intenseResearch } from "./164-intense-research";

const deckCardOne = createMockCharacter({ id: "research-deck-1", name: "Deck One", cost: 1 });
const deckCardTwo = createMockCharacter({ id: "research-deck-2", name: "Deck Two", cost: 1 });
const deckCardThree = createMockCharacter({ id: "research-deck-3", name: "Deck Three", cost: 1 });
const deckCardFour = createMockCharacter({ id: "research-deck-4", name: "Deck Four", cost: 1 });
const deckCardFive = createMockCharacter({ id: "research-deck-5", name: "Deck Five", cost: 1 });

describe("Intense Research", () => {
  it("two ink drops pay the full cost but still look at only five cards", () => {
    const unseen = createMockCharacter({ id: "research-sixth", name: "Sixth", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      inkDrops: 2,
      deck: [unseen, deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
    });
    const originalDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(
      g.asPlayerOne().playCard(intenseResearch, {
        inkDrops: 2,
        destinations: [
          { zone: "hand", cards: [unseen] },
          {
            zone: "deck-bottom",
            cards: [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
          },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().getCardZone(intenseResearch)).toBe("hand");
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(
      g.asPlayerOne().playCard(intenseResearch, {
        inkDrops: 2,
        destinations: [
          { zone: "hand", cards: [deckCardOne] },
          { zone: "deck-bottom", cards: [deckCardFive, deckCardFour, deckCardThree, deckCardTwo] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardZone(deckCardOne)).toBe("hand");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      deckCardTwo.id,
      deckCardThree.id,
      deckCardFour.id,
      deckCardFive.id,
      unseen.id,
    ]);
  });

  for (const upgraded of [false, true]) {
    it(`rejects a direct mandatory-hand skip before payment and accepts a retry (${upgraded ? "ink drop" : "ordinary ink"})`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [intenseResearch],
        inkwell: upgraded ? 1 : 2,
        inkDrops: upgraded ? 1 : 0,
        deck: [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
      });
      const looked = upgraded
        ? [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive]
        : [deckCardFour, deckCardFive];
      const originalDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      expect(
        g.asPlayerOne().playCard(intenseResearch, {
          inkDrops: upgraded ? 1 : 0,
          destinations: [
            { zone: "hand", cards: [] },
            { zone: "deck-bottom", cards: looked },
          ],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(intenseResearch)).toBe("hand");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(upgraded ? 1 : 2);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(upgraded ? 1 : 0);
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(
        g.asPlayerOne().playCard(intenseResearch, {
          inkDrops: upgraded ? 1 : 0,
          destinations: [
            { zone: "hand", cards: [deckCardFive] },
            { zone: "deck-bottom", cards: looked.filter((c) => c !== deckCardFive) },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(deckCardFive)).toBe("hand");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    });
  }

  for (const upgraded of [false, true]) {
    it(`rejects reusing one duplicate instance and then accepts separate copies (${upgraded ? "ink drop" : "ordinary ink"})`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [intenseResearch],
        inkwell: upgraded ? 1 : 2,
        inkDrops: upgraded ? 1 : 0,
        deck: [deckCardOne, deckCardOne],
      });
      const [bottom, top] = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      expect(
        g.asPlayerOne().playCard(intenseResearch, { inkDrops: upgraded ? 1 : 0 }),
      ).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [top!] },
            { zone: "deck-bottom", cards: [top!] },
          ],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([bottom!, top!]);
      expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(1);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(
        g.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [top!] },
            { zone: "deck-bottom", cards: [bottom!] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([top!]);
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([bottom!]);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    });
  }

  it("ordinary inking adds ready ink without looking at the deck", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      deck: [deckCardOne],
    });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, intenseResearch)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(intenseResearch)).toBe("inkwell");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([deckCardOne.id]);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("player two chooses only their own looked-at cards and spends only their own drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: 2, inkDrops: 1, deck: [deckCardOne, deckCardTwo] },
      {
        hand: [intenseResearch],
        inkwell: 1,
        inkDrops: 1,
        deck: [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive, deckCardOne],
      },
    );
    const opponentDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const [chosen, ...rest] = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerTwo().playCard(intenseResearch, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ destinations: [] })).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [chosen!] },
          { zone: "deck-bottom", cards: rest },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toContain(chosen!);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([...rest].reverse());
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opponentDeck);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("holding an unspent ink drop does not extend the look beyond two", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      inkwell: 2,
      inkDrops: 1,
      deck: [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
    });
    expect(g.asPlayerOne().playCard(intenseResearch)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [deckCardOne] },
          { zone: "deck-bottom", cards: [deckCardFour, deckCardFive] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [deckCardFour] },
          { zone: "deck-bottom", cards: [deckCardFive] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      deckCardFive.id,
      deckCardOne.id,
      deckCardTwo.id,
      deckCardThree.id,
    ]);
  });

  it("orders all four upgraded remainder cards while preserving the untouched deck", () => {
    const untouched = createMockCharacter({ id: "research-untouched", name: "Untouched", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      inkwell: 1,
      inkDrops: 1,
      deck: [untouched, deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
    });
    expect(g.asPlayerOne().playCard(intenseResearch, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [deckCardThree] },
          { zone: "deck-bottom", cards: [deckCardFive, deckCardOne, deckCardFour, deckCardTwo] },
        ],
      }),
    ).toBeSuccessfulCommand();
    // Destination input is top-first; the fixture query is bottom-first.
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      deckCardTwo.id,
      deckCardFour.id,
      deckCardOne.id,
      deckCardFive.id,
      untouched.id,
    ]);
    expect(g.asPlayerOne().getCardZone(deckCardThree)).toBe("hand");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  for (const upgraded of [false, true]) {
    it(`takes the only deck card without impossible remainder (${upgraded ? "ink drop" : "ordinary ink"})`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [intenseResearch],
        inkwell: upgraded ? 1 : 2,
        inkDrops: upgraded ? 1 : 0,
        deck: [deckCardOne],
      });
      expect(
        g.asPlayerOne().playCard(intenseResearch, { inkDrops: upgraded ? 1 : 0 }),
      ).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [deckCardOne] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(deckCardOne)).toBe("hand");
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(g.asServer().getWinner()).toBeUndefined();
    });

    it(`empty deck resolves without a hand choice (${upgraded ? "ink drop" : "ordinary ink"})`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [intenseResearch],
        inkwell: upgraded ? 1 : 2,
        inkDrops: upgraded ? 1 : 0,
        deck: [],
      });
      expect(
        g.asPlayerOne().playCard(intenseResearch, { inkDrops: upgraded ? 1 : 0 }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(g.asPlayerOne().getCardZone(intenseResearch)).toBe("discard");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(g.asServer().getWinner()).toBeUndefined();
    });
  }

  for (const upgraded of [false, true]) {
    it(`requires one looked-at card in hand (${upgraded ? "ink drop" : "ordinary ink"})`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [intenseResearch],
        inkwell: upgraded ? 1 : 2,
        inkDrops: upgraded ? 1 : 0,
        deck: [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
      });
      expect(
        g.asPlayerOne().playCard(intenseResearch, { inkDrops: upgraded ? 1 : 0 }),
      ).toBeSuccessfulCommand();
      const looked = upgraded
        ? [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive]
        : [deckCardFour, deckCardFive];
      expect(
        g.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [] },
            { zone: "deck-bottom", cards: looked },
          ],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        deckCardOne.id,
        deckCardTwo.id,
        deckCardThree.id,
        deckCardFour.id,
        deckCardFive.id,
      ]);
      expect(
        g.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [deckCardFive] },
            { zone: "deck-bottom", cards: looked.filter((c) => c !== deckCardFive) },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(deckCardFive)).toBe("hand");
    });
  }

  it("looks at the top 2 cards without an ink drop: one to hand, rest to the bottom", () => {
    // Deck index 0 = bottom, last = top; the top 2 cards are Four and Five.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      inkwell: intenseResearch.cost,
      deck: [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
    });

    expect(
      testEngine.asPlayerOne().playCard(intenseResearch, {
        destinations: [
          { zone: "hand", cards: [deckCardFour] },
          { zone: "deck-bottom", cards: [deckCardFive] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckCardFour)).toBe("hand");
    const deckDefinitionIds = testEngine
      .getCardInstanceIdsInZone("deck", PLAYER_ONE)
      .map((instanceId) => testEngine.getCardDefinitionId(instanceId));
    expect(deckDefinitionIds).toEqual([
      deckCardFive.id,
      deckCardOne.id,
      deckCardTwo.id,
      deckCardThree.id,
    ]);
  });

  it("cannot put a card from deeper than the top 2 into your hand when no ink drop was removed", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      inkwell: intenseResearch.cost,
      deck: [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
    });

    // deckCardOne is outside the ordinary two-card look.
    expect(testEngine.asPlayerOne().playCard(intenseResearch)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [deckCardOne] },
          { zone: "deck-bottom", cards: [deckCardFour, deckCardFive] },
        ],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckCardOne)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(5);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [deckCardFour] },
          { zone: "deck-bottom", cards: [deckCardFive] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(intenseResearch)).toBe("discard");
  });

  it("looks at the top 5 cards instead when an ink drop was removed to play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      inkwell: intenseResearch.cost - 1,
      inkDrops: 1,
      deck: [deckCardOne, deckCardTwo, deckCardThree, deckCardFour, deckCardFive],
    });

    // Cost 2: 1 ready ink + 1 removed ink drop.
    expect(
      testEngine.asPlayerOne().playCard(intenseResearch, {
        inkDrops: 1,
        destinations: [
          { zone: "hand", cards: [deckCardOne] },
          { zone: "deck-bottom", cards: [deckCardTwo, deckCardThree, deckCardFour, deckCardFive] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    // The bottom card was reachable: the look extended to the top 5.
    expect(testEngine.asPlayerOne().getCardZone(deckCardOne)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(4);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("costs 2 ink to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      inkwell: intenseResearch.cost - 1,
      deck: [deckCardOne, deckCardTwo],
    });

    expect(testEngine.asPlayerOne().playCard(intenseResearch).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(intenseResearch)).toBe("hand");
  });

  it("rejects claiming an ink drop the player does not hold", () => {
    // Ready ink alone covers the cost — the play must still fail because the
    // claimed ink-drop payment cannot actually be made (and effects such as
    // the top-5 look must not fire off an unbacked claim).
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [intenseResearch],
      inkwell: intenseResearch.cost,
      deck: [deckCardOne, deckCardTwo],
    });

    expect(
      testEngine.asPlayerOne().playCard(intenseResearch, {
        inkDrops: 1,
        destinations: [{ zone: "hand", cards: [deckCardOne] }],
      }).success,
    ).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(intenseResearch)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(deckCardOne)).toBe("deck");
  });
});
