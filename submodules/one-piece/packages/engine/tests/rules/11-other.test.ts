import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01ArtificialDevilFruitSmile116,
  op01DonquixoteDoflamingo073,
  op01KurozumiOrochi098,
  op11CharlottePudding070,
} from "@tcg/op-cards";

import { finalizeDraw, OnePieceTestEngine } from "../../src/index.ts";

// 11-1-1, 11-1-1-1, 11-1-1-2, 11-1-1-3 (infinite loops) are NON-EXECUTABLE:
// the engine has no loop detection and no loop-count declaration command.
// The 11-1 draw outcome itself is now representable: `finalizeDraw` ends the
// match with `winner: null` and `finishReason: "draw"` (proven below), ready
// for future loop detection to finalize through.
//
// 11-2-1 is proven with OP01-098 Kurozumi Orochi, the catalog's whole-deck
// named search. No catalog card uses the rule's "Add Monkey.D.Luffy from your
// deck to your hand" phrasing without reveal instructions; the rule's
// observable contract (a secret-to-secret move surfaces the moved card's
// identity publicly) is what the engine must honor for every such move.

function resolveOrochiSearch(engine: OnePieceTestEngine, smileId: string) {
  const south = engine.asSouth();
  south.play(op01KurozumiOrochi098);
  const search = south.pendingDecision("effectSearchSelection").steps[0];
  if (search?.kind !== "selectEntity") throw new Error("Expected Orochi's search choice.");
  expect(search.candidates.find((candidate) => candidate.ref.id === smileId)?.legal).toBe(true);
  south.chooseSearch(smileId);

  const remainder = south.pendingDecision("effectSearchRemainderOrder").steps[0];
  if (remainder?.kind !== "orderItems") throw new Error("Expected remainder ordering.");
  south.orderCards(
    "effectSearchRemainderOrder",
    remainder.candidates.map((candidate) => candidate.ref.id),
  );
}

function createOrochiSearch() {
  const engine = OnePieceTestEngine.create({
    hand: [op01KurozumiOrochi098],
    deck: [
      op01ArtificialDevilFruitSmile116,
      eb01Doma005,
      eb01MountainGod018,
      eb01Doma005,
      eb01MountainGod018,
    ],
    activeDon: op01KurozumiOrochi098.cost,
  });
  const smileId = engine.asSouth().findInZone("deck", op01ArtificialDevilFruitSmile116);
  return { engine, smileId };
}

describe("Comprehensive Rules 11. Other", () => {
  test("11-1: the draw outcome is representable — the game ends with no winner", () => {
    const engine = OnePieceTestEngine.create({ life: 4, deck: 6 }, { life: 4, deck: 6 });
    const south = engine.asSouth();

    // Future infinite-loop detection (11-1-1) finalizes through finalizeDraw;
    // the terminal state it constructs is the 11-1 draw.
    finalizeDraw(engine.getState());

    const view = south.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBeNull();
    expect(view.finishReason).toBe("draw");
  });

  test("11-2-1: a card moved from deck to hand by a named search is revealed to both players", () => {
    const { engine, smileId } = createOrochiSearch();
    const south = engine.asSouth();
    const north = engine.asNorth();

    resolveOrochiSearch(engine, smileId);

    // The reveal is projected to both viewers as a public log naming the moved
    // card and identifying the physical instance.
    for (const view of [south.view(), north.view()]) {
      const revealLog = view.logs.find((entry) =>
        entry.message.includes(op01ArtificialDevilFruitSmile116.name),
      );
      expect(revealLog?.visibility).toBe("public");
      expect(revealLog?.message).toContain("reveals");
      expect(revealLog?.targetIds).toContain(smileId);
    }

    expect(south.view().prompts).toHaveLength(0);
  });

  test("11-2-2: a card revealed by an effect becomes unrevealed after that effect resolves", () => {
    const { engine, smileId } = createOrochiSearch();
    const south = engine.asSouth();
    const north = engine.asNorth();

    resolveOrochiSearch(engine, smileId);

    // After the whole On Play effect (search, add to hand, shuffle) resolves,
    // the opponent's projection of the hand conceals the revealed card again.
    const opponentHand = north.view().players.south.hand;
    expect(north.view().players.south.handCount).toBe(1);
    expect(opponentHand).toHaveLength(1);
    expect(opponentHand[0]).toMatchObject({
      hidden: true,
      instanceId: null,
      cardId: null,
      name: null,
    });

    // The controller's own view is unaffected: they can see their hand.
    expect(south.view().players.south.hand.map((card) => card.instanceId)).toContain(smileId);
  });

  test("11-3-1: a look-at effect exposes the secret card's identity only to the effect's player", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlottePudding070], activeDon: 1 },
      { deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const topCardName = eb01Doma005.name;

    south.activateMain(op11CharlottePudding070);
    south.acceptOptional();

    // The effect's player learns the identity of the opponent's top deck card.
    expect(south.view().logs.some((entry) => entry.message.includes(topCardName))).toBe(true);

    // The deck owner is only told that a look happened; the identity stays secret.
    const ownerView = north.view();
    expect(ownerView.logs.some((entry) => entry.message.includes("looks at the top card"))).toBe(
      true,
    );
    expect(ownerView.logs.some((entry) => entry.message.includes(topCardName))).toBe(false);
    expect(ownerView.players.north.deckTop?.hidden).toBe(true);
    expect(ownerView.players.north.deckTop?.cardId).toBeNull();
  });

  test("11-3-2: looked-at cards remain in their original area with no zone movement", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01DonquixoteDoflamingo073],
      deck: [
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: op01DonquixoteDoflamingo073.cost,
    });
    const south = engine.asSouth();
    const north = engine.asNorth();
    const lookedIds = engine.getState().players.south.deck.slice(0, 5);

    south.play(op01DonquixoteDoflamingo073);

    // The looking player receives all five identities as an ordering decision.
    const order = south.pendingDecision("effectRearrangeDeckOrder").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Doflamingo's deck order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(lookedIds);

    // The opponent's projection gains no prompt, no decision, and no card name
    // while the cards are being looked at.
    const opponentView = north.view();
    expect(opponentView.prompts).toHaveLength(0);
    expect(
      opponentView.decisions.some(
        (decision) => decision.extensions?.resolutionIntent === "effectRearrangeDeckOrder",
      ),
    ).toBe(false);

    // Resolving the look keeps every looked-at card inside the deck zone.
    const chosenOrder = [...lookedIds].reverse();
    south.orderCards("effectRearrangeDeckOrder", chosenOrder);
    south.chooseOption("effectRearrangeDeckPosition", "top");

    const deckAfter = engine.getState().players.south.deck;
    expect(deckAfter).toHaveLength(6);
    expect(lookedIds.every((instanceId) => deckAfter.includes(instanceId))).toBe(true);
    expect(deckAfter.slice(0, 5)).toEqual(chosenOrder);
    expect(south.view().players.south.hand).toHaveLength(0);
    expect(south.view().players.south.trash).toHaveLength(0);
  });

  test("11-3-3: after a look with no instructed action, cards stay in their original state", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlottePudding070], activeDon: 1 },
      { deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018] },
    );
    const south = engine.asSouth();
    // Raw state is used only for identity and face state inside a hidden zone.
    const deckBefore = engine.getState().players.north.deck.map((instanceId) => ({
      instanceId,
      faceUp: engine.getState().cards[instanceId]?.faceUp,
      publicKnowledge: engine.getState().cards[instanceId]?.publicKnowledge,
    }));

    south.activateMain(op11CharlottePudding070);
    south.acceptOptional();

    const state = engine.getState();
    const deckAfter = state.players.north.deck.map((instanceId) => ({
      instanceId,
      faceUp: state.cards[instanceId]?.faceUp,
      publicKnowledge: state.cards[instanceId]?.publicKnowledge,
    }));
    expect(deckAfter).toEqual(deckBefore);
  });
});
