import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op04Chaka008,
  op04Gyats080,
  op04Ideo077,
  op04Kyros082,
  op04Rebecca039,
  op04Stussy084,
  op14eb04NefeltariVivi025,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function concealedTargetToken(engine: OnePieceTestEngine, instanceId: string) {
  const prompt = engine
    .getState()
    .promptQueue.find(
      (candidate) =>
        candidate.status === "pending" &&
        candidate.resolutionContext?.intent === "effectTargetSelection",
    );
  if (prompt?.resolutionContext?.intent !== "effectTargetSelection") {
    throw new Error("Expected a concealed target-selection prompt.");
  }
  const token = Object.entries(prompt.resolutionContext.opaqueCandidateIds ?? {}).find(
    ([, candidateId]) => candidateId === instanceId,
  )?.[0];
  if (!token) {
    throw new Error("Expected the selected concealed card to have an opaque prompt token.");
  }
  return {
    token,
    orderedIds: Object.values(prompt.resolutionContext.opaqueCandidateIds ?? {}),
  };
}

describe("EB04-025 Nefeltari Vivi", () => {
  test("plays an eligible non-Vivi Alabasta Character, then lets the opponent move one of the controller's hand cards to their deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [
          op14eb04NefeltariVivi025,
          op04Chaka008,
          op14eb04NefeltariVivi025,
          eb01Doma005,
          eb01Fourtricks025,
        ],
        activeDon: 7,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const playableId = engine.findCardInZone("south", "hand", op04Chaka008);
    const excludedViviId = engine
      .getState()
      .players.south.hand.find(
        (instanceId) =>
          instanceId !== engine.findCardInZone("south", "hand", op14eb04NefeltariVivi025) &&
          engine.getState().cards[instanceId]?.cardId === op14eb04NefeltariVivi025.id,
      );
    const selectedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const northDeckBefore = engine.getView("north").players.north.deckCount;

    engine.playCard(op14eb04NefeltariVivi025, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Vivi's Alabasta play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playableId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedViviId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playableId] }, "south");

    const handChoice = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(handChoice?.kind).toBe("selectEntity");
    if (handChoice?.kind !== "selectEntity") {
      throw new Error("Expected Vivi's opponent-controlled hand choice.");
    }
    expect(handChoice.candidates.map((candidate) => candidate.ref.id)).not.toContain(selectedId);
    expect(handChoice.candidates.map((candidate) => candidate.label)).toEqual([
      "Card 1",
      "Card 2",
      "Card 3",
    ]);
    expect(handChoice.candidates.every((candidate) => candidate.ref.kind === "option")).toBe(true);
    expect(handChoice.candidates.every((candidate) => candidate.publicInfo === undefined)).toBe(
      true,
    );
    const handOrder = [...engine.getState().players.south.hand];
    const concealedSelection = concealedTargetToken(engine, selectedId);
    expect(concealedSelection.orderedIds).not.toEqual(handOrder);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [concealedSelection.token] },
      "north",
    );

    const southView = engine.getView("south");
    const northView = engine.getView("north");
    const spectatorView = engine.getView("spectator");
    expect(
      southView.players.south.characters.find((card) => card?.instanceId === playableId),
    ).toBeDefined();
    expect(southView.players.south.hand.map((card) => card.instanceId)).not.toContain(selectedId);
    expect(northView.players.north.deckCount).toBe(northDeckBefore + 1);
    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedId);
    expect(engine.getState().cards[selectedId]).toMatchObject({
      owner: "south",
      controller: "north",
      zone: "deck",
    });
    for (const view of [northView, spectatorView]) {
      const transferLog = view.logs.find((entry) =>
        entry.message.includes("places a card from their hand"),
      );
      expect(transferLog).toMatchObject({
        sourceCardId: null,
        sourceInstanceId: null,
        targetIds: [],
      });
      expect(transferLog?.message).not.toContain(eb01Doma005.name);
      expect(transferLog?.message).not.toContain("Order:");
    }
    expect(spectatorView.players.north.deckTop).toMatchObject({ hidden: true, instanceId: null });
    expect(southView.prompts).toHaveLength(0);
    expect(northView.prompts).toHaveLength(0);
  });

  test("still gives the opponent the mandatory hand choice after declining the optional play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04NefeltariVivi025, op04Chaka008, eb01Doma005],
        activeDon: 7,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const declinedId = engine.findCardInZone("south", "hand", op04Chaka008);
    const selectedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04NefeltariVivi025, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const handChoice = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(handChoice?.kind).toBe("selectEntity");
    if (handChoice?.kind !== "selectEntity") {
      throw new Error("Expected Vivi's mandatory opponent hand choice.");
    }
    expect(handChoice.candidates.map((candidate) => candidate.ref.id)).not.toContain(selectedId);
    const concealedSelection = concealedTargetToken(engine, selectedId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [concealedSelection.token] },
      "north",
    );

    const southView = engine.getView("south");
    expect(southView.players.south.hand.map((card) => card.instanceId)).toContain(declinedId);
    expect(southView.players.south.hand.map((card) => card.instanceId)).not.toContain(selectedId);
    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedId);
    expect(southView.prompts).toHaveLength(0);
  });

  test("routes a transferred card milled from the opponent's deck to its retained owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04NefeltariVivi025, op04Chaka008, eb01Doma005],
        activeDon: 7,
      },
      {
        leaderCardId: op04Rebecca039,
        hand: [op04Kyros082],
        deck: [eb01Fourtricks025],
        activeDon: op04Kyros082.cost,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const transferredId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04NefeltariVivi025, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    const concealedSelection = concealedTargetToken(engine, transferredId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [concealedSelection.token] },
      "north",
    );
    engine.endTurn("south");
    engine.playCard(op04Kyros082, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(transferredId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(transferredId);
    expect(view.prompts).toHaveLength(0);
  });

  test("routes a transferred looked-card remainder to its retained owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04NefeltariVivi025, op04Chaka008, eb01Doma005],
        activeDon: 7,
      },
      {
        hand: [op04Stussy084],
        deck: [eb01Fourtricks025, op04Gyats080, op04Ideo077],
        activeDon: op04Stussy084.cost,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const transferredId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04NefeltariVivi025, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    const concealedSelection = concealedTargetToken(engine, transferredId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [concealedSelection.token] },
      "north",
    );
    engine.endTurn("south");
    engine.playCard(op04Stussy084, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(transferredId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(transferredId);
    expect(view.prompts).toHaveLength(0);
  });
});
