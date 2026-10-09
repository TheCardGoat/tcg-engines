import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  arielSpectacularSinger,
  cinderellaGentleAndKind,
  healingGlow,
  simbaProtectiveCub,
} from "../../001";
import { neverTooFarApart } from "./028-never-too-far-apart";

const deckFillerA = createMockCharacter({ id: "ntfa-filler-a", name: "Filler A", cost: 1 });
const deckFillerB = createMockCharacter({ id: "ntfa-filler-b", name: "Filler B", cost: 1 });
const deckFillerC = createMockCharacter({ id: "ntfa-filler-c", name: "Filler C", cost: 1 });
const fillerAction = createMockAction({ id: "ntfa-filler-action", name: "Filler Action", cost: 2 });

function getRevealedFlag(
  testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
  cardId: string,
): boolean | undefined {
  return testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[cardId]?.revealed === true;
}

describe("Never Too Far Apart", () => {
  it("looks at the top 9 cards, puts up to 3 Singer characters into hand, bottoms the rest", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: neverTooFarApart.cost,
      deck: [
        cinderellaGentleAndKind,
        simbaProtectiveCub,
        healingGlow,
        deckFillerA,
        arielSpectacularSinger,
        deckFillerB,
        aladdinPrinceAli,
        fillerAction,
        deckFillerC,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(neverTooFarApart)).toBeSuccessfulCommand();

    // Only the two Singer characters may go to hand; a non-Singer character
    // (simbaProtectiveCub) must stay out of the hand destination.
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [cinderellaGentleAndKind, arielSpectacularSinger] },
          {
            zone: "deck-bottom",
            cards: [
              simbaProtectiveCub,
              healingGlow,
              deckFillerA,
              deckFillerB,
              aladdinPrinceAli,
              fillerAction,
              deckFillerC,
            ],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cinderellaGentleAndKind)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(arielSpectacularSinger)).toBe("hand");
    // Song is in the discard after resolving; only the two singers were drawn.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(7);
  });

  it("reveals the character cards put into the hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: neverTooFarApart.cost,
      deck: [
        cinderellaGentleAndKind,
        simbaProtectiveCub,
        healingGlow,
        deckFillerA,
        deckFillerB,
        aladdinPrinceAli,
        fillerAction,
        deckFillerC,
        arielOnHumanLegs,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(neverTooFarApart)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [cinderellaGentleAndKind] },
          {
            zone: "deck-bottom",
            cards: [
              simbaProtectiveCub,
              healingGlow,
              deckFillerA,
              deckFillerB,
              aladdinPrinceAli,
              fillerAction,
              deckFillerC,
              arielOnHumanLegs,
            ],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    const cinderellaInstanceId = testEngine
      .getCardInstanceIdsInZone("hand", PLAYER_ONE)
      .find(
        (instanceId) => testEngine.getCardDefinitionId(instanceId) === cinderellaGentleAndKind.id,
      );
    expect(cinderellaInstanceId).toBeDefined();
    expect(getRevealedFlag(testEngine, cinderellaInstanceId!)).toBe(true);
  });

  it("can put zero characters into hand and bottom everything", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: neverTooFarApart.cost,
      deck: [
        cinderellaGentleAndKind,
        simbaProtectiveCub,
        healingGlow,
        deckFillerA,
        deckFillerB,
        aladdinPrinceAli,
        fillerAction,
        deckFillerC,
        arielOnHumanLegs,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(neverTooFarApart)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [] },
          {
            zone: "deck-bottom",
            cards: [
              arielOnHumanLegs,
              deckFillerC,
              fillerAction,
              aladdinPrinceAli,
              deckFillerB,
              deckFillerA,
              healingGlow,
              simbaProtectiveCub,
              cinderellaGentleAndKind,
            ],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    // Song resolved to the discard; nothing was taken into hand.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(9);
  });

  it("looks at fewer cards when the deck holds fewer than 9", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: neverTooFarApart.cost,
      deck: [cinderellaGentleAndKind, simbaProtectiveCub, healingGlow],
    });

    expect(testEngine.asPlayerOne().playCard(neverTooFarApart)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [cinderellaGentleAndKind] },
          { zone: "deck-bottom", cards: [healingGlow, simbaProtectiveCub] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cinderellaGentleAndKind)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(2);
  });

  it("can be sung for free with Sing Together 9", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: 0,
      play: [cinderellaGentleAndKind, arielSpectacularSinger, simbaProtectiveCub],
      deck: [healingGlow, aladdinPrinceAli],
    });

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(neverTooFarApart, [
          cinderellaGentleAndKind,
          arielSpectacularSinger,
          simbaProtectiveCub,
        ]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(cinderellaGentleAndKind)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(arielSpectacularSinger)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(true);

    // The look-at effect still resolves on the 2-card deck.
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [aladdinPrinceAli, healingGlow] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(2);
  });

  it("costs 9 ink to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: neverTooFarApart.cost - 1,
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(neverTooFarApart)).toMatchObject({
      success: false,
    });
    expect(testEngine.asPlayerOne().getCardZone(neverTooFarApart)).toBe("hand");
  });
  it("limits the hand selection to three Singers and keeps the initial look private", () => {
    const singers = Array.from({ length: 4 }, (_, index) =>
      createMockCharacter({
        id: `ntfa-singer-${index}`,
        name: `Singer ${index}`,
        cost: 1,
        abilities: [{ type: "keyword", keyword: "Singer", value: 2 }],
      }),
    );
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: 9,
      deck: [deckFillerA, ...singers],
    });
    expect(engine.asPlayerOne().playCard(neverTooFarApart)).toBeSuccessfulCommand();
    expect(
      engine
        .getAuthoritativeState()
        .ctx.zones.reveals.active.every((window) => window.visibleTo !== "all"),
    ).toBe(true);
    expect(
      engine.asPlayerOne().resolveNextPending({ destinations: [{ zone: "hand", cards: singers }] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolveNextPending({ destinations: [{ zone: "hand", cards: [deckFillerA] }] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: singers.slice(0, 3) },
          { zone: "deck-bottom", cards: [singers[3], deckFillerA] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(engine.getCardDefinitionIdsInZone("deck", "player_one")).toEqual([
      deckFillerA.id,
      singers[3].id,
    ]);
  });

  it("does not allow selecting a card below the top nine and preserves chosen bottom order", () => {
    const looked = Array.from({ length: 9 }, (_, index) =>
      createMockCharacter({ id: `ntfa-order-${index}`, name: `Order ${index}`, cost: 1 }),
    );
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: 9,
      deck: [deckFillerA, ...looked],
    });
    expect(engine.asPlayerOne().playCard(neverTooFarApart)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolveNextPending({ destinations: [{ zone: "deck-bottom", cards: [deckFillerA] }] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolveNextPending({ destinations: [{ zone: "deck-bottom", cards: looked }] }),
    ).toBeSuccessfulCommand();
    expect(engine.getCardDefinitionIdsInZone("deck", "player_one")).toEqual([
      ...looked.toReversed().map((card) => card.id),
      deckFillerA.id,
    ]);
  });

  it("finishes on an empty deck without a pending choice", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverTooFarApart],
      inkwell: 9,
      deck: [],
    });
    expect(engine.asPlayerOne().playCard(neverTooFarApart)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("requires the printed Sing Together total, accepting exactly 9 and rejecting 8", () => {
    for (const total of [8, 9]) {
      const singerA = createMockCharacter({
        id: `boundary-a-${total}`,
        name: "Boundary A",
        cost: total - 1,
      });
      const singerB = createMockCharacter({
        id: `boundary-b-${total}`,
        name: "Boundary B",
        cost: 1,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [neverTooFarApart],
        play: [singerA, singerB],
        deck: [],
      });
      const result = engine.asPlayerOne().playSongTogether(neverTooFarApart, [singerA, singerB]);
      if (total === 9) expect(result).toBeSuccessfulCommand();
      else {
        expect(result).not.toBeSuccessfulCommand();
        expect(engine.isExerted(singerA)).toBe(false);
        expect(engine.isExerted(singerB)).toBe(false);
      }
    }
  });
  it("lets player two choose only from their deck and draws the chosen bottom order on later turns", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: Array(6).fill(deckFillerC) },
      {
        hand: [neverTooFarApart],
        inkwell: 9,
        deck: [cinderellaGentleAndKind, deckFillerA, deckFillerB, healingGlow],
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(healingGlow)).toBe("hand");
    expect(engine.asPlayerTwo().playCard(neverTooFarApart)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({ destinations: [] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [cinderellaGentleAndKind] },
          { zone: "deck-bottom", cards: [deckFillerA, deckFillerB] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(2);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(deckFillerA)).toBe("hand");
    expect(engine.asPlayerTwo().getCardZone(deckFillerB)).toBe("deck");
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(deckFillerB)).toBe("hand");
  });
  it("rejects a drying or exerted singer without spending resources or opening the look", () => {
    for (const unavailable of [{ isDrying: true }, { exerted: true }]) {
      const singer = createMockCharacter({ id: "ntfa-unavailable", name: "Unavailable", cost: 9 });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [neverTooFarApart],
        play: [{ card: singer, ...unavailable }],
        inkwell: 2,
        deck: [cinderellaGentleAndKind, deckFillerA],
      });
      expect(
        engine.asPlayerOne().playSongTogether(neverTooFarApart, [singer]),
      ).not.toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(neverTooFarApart)).toBe("hand");
      expect(engine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
      expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(2);
      expect(engine.getAuthoritativeState().ctx.zones.reveals.active).toHaveLength(0);
    }
  });
  it("Player Two sings exactly nine and publicly reveals only the three selected Singers", () => {
    const singers = Array.from({ length: 4 }, (_, i) =>
      createMockCharacter({
        id: "ntfa-p2-singer-" + i,
        name: "P2 Singer " + i,
        cost: 1,
        abilities: [{ type: "keyword", keyword: "Singer", value: 2 }],
      }),
    );
    const a = createMockCharacter({ id: "ntfa-p2-cost-five", name: "Five", cost: 5 });
    const b = createMockCharacter({ id: "ntfa-p2-cost-four", name: "Four", cost: 4 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      {
        hand: [neverTooFarApart],
        play: [a, b],
        deck: [deckFillerA, ...singers, deckFillerC],
        inkwell: 2,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const selected = singers
      .slice(0, 3)
      .map((card) => game.findCardInstanceId(card, "deck", PLAYER_TWO));
    const hidden = [singers[3], deckFillerA].map((card) =>
      game.findCardInstanceId(card, "deck", PLAYER_TWO),
    );
    expect(game.asPlayerTwo().playSongTogether(neverTooFarApart, [a, b])).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerOne().resolveNextPending({ destinations: [] })).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveNextPending({ destinations: [{ zone: "hand", cards: singers }] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveNextPending({
        destinations: [
          { zone: "hand", cards: singers.slice(0, 3) },
          { zone: "deck-bottom", cards: [singers[3], deckFillerA] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(4);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(2);
    const publicLog = JSON.stringify(
      game
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public),
    );
    for (const id of selected) {
      expect(game.asPlayerTwo().getCardZone(id)).toBe("hand");
      expect(publicLog).toContain(id);
    }
    for (const id of hidden) expect(publicLog).not.toContain(id);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
});
