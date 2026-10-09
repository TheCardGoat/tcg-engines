// Rules grounding: Everything Else Is Obsolete looks at the top 3 cards of
// your deck and routes exactly one to the inkwell (facedown, exerted), one to
// the top of the deck, and one to the bottom of the deck.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { everythingElseIsObsolete } from "./163-everything-else-is-obsolete";

const deckBottomCard = createMockCharacter({
  id: "obsolete-deck-bottom",
  name: "Deck Bottom Card",
  cost: 1,
});

const inkedCard = createMockCharacter({
  id: "obsolete-inked",
  name: "Inked Card",
  cost: 2,
});

const deckTopCard = createMockCharacter({
  id: "obsolete-deck-top",
  name: "Deck Top Card",
  cost: 3,
});

describe("Everything Else Is Obsolete", () => {
  it("rejects an unseen fourth card without changing a paid pending choice", () => {
    const unseen = createMockCharacter({ id: "obsolete-unseen", name: "Unseen", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: 3,
      deck: [unseen, deckBottomCard, inkedCard, deckTopCard],
    });
    const originalDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(everythingElseIsObsolete)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "inkwell", cards: [unseen] },
          { zone: "deck-top", cards: [deckTopCard] },
          { zone: "deck-bottom", cards: [deckBottomCard, inkedCard] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "inkwell", cards: [inkedCard] },
          { zone: "deck-top", cards: [deckTopCard] },
          { zone: "deck-bottom", cards: [deckBottomCard] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      deckBottomCard.id,
      unseen.id,
      deckTopCard.id,
    ]);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("inks a noninkable looked-at card and readies it only on the next owner turn", () => {
    const noninkable = createMockCharacter({
      id: "obsolete-noninkable",
      name: "Noninkable",
      cost: 1,
      inkable: false,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [everythingElseIsObsolete],
        inkwell: 3,
        deck: [deckBottomCard, noninkable, deckTopCard],
      },
      { deck: [noninkable, noninkable] },
    );
    const [bottomId, inkId, topId] = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(
      g.asPlayerOne().playCard(everythingElseIsObsolete, {
        destinations: [
          { zone: "inkwell", cards: [inkId!] },
          { zone: "deck-top", cards: [topId!] },
          { zone: "deck-bottom", cards: [bottomId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.isCardFaceDown(inkId!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(g.isExerted(inkId!)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.isExerted(inkId!)).toBe(true);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.isExerted(inkId!)).toBe(false);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(g.isCardFaceDown(inkId!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(g.asPlayerOne().getCardZone(deckTopCard)).toBe("hand");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([deckBottomCard.id]);
  });

  it("rejects a dry singer below the song cost without exerting it", () => {
    const singer = createMockCharacter({ id: "obsolete-cheap-singer", name: "Singer", cost: 2 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      play: [{ card: singer, isDrying: false }],
      deck: [inkedCard],
    });
    const id = g.findCardInstanceId(singer, "play", PLAYER_ONE);
    expect(
      g.asPlayerOne().playCard(everythingElseIsObsolete, { cost: { cost: "sing", singer: id } }),
    ).not.toBeSuccessfulCommand();
    expect(g.isExerted(singer)).toBe(false);
    expect(g.asPlayerOne().getCardZone(everythingElseIsObsolete)).toBe("hand");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([inkedCard.id]);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("can be inked normally without looking at or moving deck cards", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      deck: [inkedCard],
    });
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, everythingElseIsObsolete),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(everythingElseIsObsolete)).toBe("inkwell");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([inkedCard.id]);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("playing with an empty deck pays once without adding ink or ending the game immediately", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: 3,
      deck: [],
    });
    expect(g.asPlayerOne().playCard(everythingElseIsObsolete)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(everythingElseIsObsolete)).toBe("discard");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asServer().getWinner()).toBeUndefined();
  });

  it("moves only the top three cards and preserves the untouched deck middle", () => {
    const untouched = createMockCharacter({ id: "obsolete-untouched", name: "Untouched", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: 3,
      deck: [untouched, deckBottomCard, inkedCard, deckTopCard],
    });
    expect(g.asPlayerOne().playCard(everythingElseIsObsolete)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "inkwell", cards: [inkedCard] },
          { zone: "deck-top", cards: [deckTopCard] },
          { zone: "deck-bottom", cards: [deckBottomCard] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      deckBottomCard.id,
      untouched.id,
      deckTopCard.id,
    ]);
    expect(g.isCardFaceDown(inkedCard, "inkwell", PLAYER_ONE)).toBe(true);
    expect(g.isExerted(inkedCard)).toBe(true);
  });

  for (const status of [
    { isDrying: true, exerted: false },
    { isDrying: false, exerted: true },
  ]) {
    it(
      "rejects an unavailable singer without changing deck or hand " + JSON.stringify(status),
      () => {
        const singer = createMockCharacter({ id: "obsolete-unavailable", name: "Singer", cost: 3 });
        const g = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [everythingElseIsObsolete],
          play: [{ card: singer, ...status }],
          deck: [inkedCard],
        });
        const id = g.findCardInstanceId(singer, "play", PLAYER_ONE);
        expect(
          g
            .asPlayerOne()
            .playCard(everythingElseIsObsolete, { cost: { cost: "sing", singer: id } }),
        ).not.toBeSuccessfulCommand();
        expect(g.asPlayerOne().getCardZone(everythingElseIsObsolete)).toBe("hand");
        expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([inkedCard.id]);
        expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      },
    );
  }

  it("player two assigns only their own three looked-at cards", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [deckTopCard, inkedCard], inkwell: 1 },
      {
        hand: [everythingElseIsObsolete],
        deck: [deckBottomCard, inkedCard, deckTopCard, deckBottomCard],
        inkwell: 3,
      },
    );
    const untouched = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const [bottomId, inkId, topId] = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerTwo().playCard(everythingElseIsObsolete)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ destinations: [] })).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolveNextPending({
        destinations: [
          { zone: "inkwell", cards: [inkId!] },
          { zone: "deck-top", cards: [topId!] },
          { zone: "deck-bottom", cards: [bottomId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([bottomId!, topId!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(inkId!);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(untouched);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("a dry cost-three singer pays by exerting and resolves a one-card prompt", () => {
    const singer = createMockCharacter({ id: "obsolete-singer", name: "Singer", cost: 3 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      play: [{ card: singer, isDrying: false }],
      deck: [inkedCard],
    });
    const singerId = g.findCardInstanceId(singer, "play", PLAYER_ONE);
    expect(
      g
        .asPlayerOne()
        .playCard(everythingElseIsObsolete, { cost: { cost: "sing", singer: singerId } }),
    ).toBeSuccessfulCommand();
    expect(g.isExerted(singer)).toBe(true);
    expect(g.asPlayerOne().getPendingEffects()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          payload: expect.objectContaining({
            effect: expect.objectContaining({
              destinations: expect.arrayContaining([
                expect.objectContaining({ zone: "deck-top", min: 0, max: 0 }),
                expect.objectContaining({ zone: "deck-bottom", min: 0, max: 0 }),
              ]),
            }),
          }),
        }),
      ]),
    );
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "inkwell", cards: [inkedCard] },
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(inkedCard)).toBe("inkwell");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("rejects assigning one duplicate instance twice then routes three exact instances", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: 3,
      deck: [inkedCard, inkedCard, inkedCard],
    });
    const [bottomId, inkId, topId] = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(everythingElseIsObsolete)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "inkwell", cards: [inkId!] },
          { zone: "deck-top", cards: [inkId!] },
          { zone: "deck-bottom", cards: [bottomId!] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "inkwell", cards: [inkId!] },
          { zone: "deck-top", cards: [topId!] },
          { zone: "deck-bottom", cards: [bottomId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([bottomId!, topId!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toContain(inkId!);
  });

  it("one-card resolution cannot skip ink entry in favor of deck top", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: 3,
      deck: [inkedCard],
    });
    expect(g.asPlayerOne().playCard(everythingElseIsObsolete)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "inkwell", cards: [] },
          { zone: "deck-top", cards: [inkedCard] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(inkedCard)).toBe("deck");
  });

  it("with one card completes ink entry without impossible deck assignments", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: 3,
      deck: [inkedCard],
    });
    expect(
      g.asPlayerOne().playCard(everythingElseIsObsolete, {
        destinations: [
          { zone: "inkwell", cards: [inkedCard] },
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(inkedCard)).toBe("inkwell");
    expect(g.isExerted(inkedCard)).toBe(true);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
    expect(g.asServer().getWinner()).toBeUndefined();
  });

  it("with two cards inks one and keeps one on top", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: 3,
      deck: [inkedCard, deckTopCard],
    });
    expect(
      g.asPlayerOne().playCard(everythingElseIsObsolete, {
        destinations: [
          { zone: "inkwell", cards: [inkedCard] },
          { zone: "deck-top", cards: [deckTopCard] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([deckTopCard.id]);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("routes one looked-at card to the inkwell (facedown, exerted), one to the top and one to the bottom of the deck", () => {
    // Fixture deck: index 0 = bottom, last = top.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: everythingElseIsObsolete.cost,
      deck: [deckBottomCard, inkedCard, deckTopCard],
    });

    expect(
      testEngine.asPlayerOne().playCard(everythingElseIsObsolete, {
        destinations: [
          { zone: "inkwell", cards: [inkedCard] },
          { zone: "deck-top", cards: [deckTopCard] },
          { zone: "deck-bottom", cards: [deckBottomCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(inkedCard)).toBe("inkwell");
    expect(testEngine.isExerted(inkedCard)).toBe(true);
    expect(testEngine.isCardFaceDown(inkedCard, "inkwell", PLAYER_ONE)).toBe(true);

    const deckDefinitionIds = testEngine
      .getCardInstanceIdsInZone("deck", PLAYER_ONE)
      .map((instanceId) => testEngine.getCardDefinitionId(instanceId));
    // Index 0 = bottom of deck, last = top of deck.
    expect(deckDefinitionIds).toEqual([deckBottomCard.id, deckTopCard.id]);
  });

  it("costs 3 ink to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everythingElseIsObsolete],
      inkwell: everythingElseIsObsolete.cost - 1,
      deck: [deckBottomCard, inkedCard, deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(everythingElseIsObsolete).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(everythingElseIsObsolete)).toBe("hand");
  });
});
