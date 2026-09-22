import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op04Chaka008,
  op04Kyros082,
  op14eb04NefeltariVivi025,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-025 Nefeltari Vivi", () => {
  test("plays an eligible non-Vivi Alabasta Character, then the opponent bottom-decks a card from their own hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04NefeltariVivi025, op04Chaka008, op14eb04NefeltariVivi025, eb01Doma005],
        activeDon: 7,
      },
      { hand: [op04Kyros082, eb01Fourtricks025] },
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
    const northHandIds = engine.getView("north").players.north.hand.map((card) => card.instanceId);
    const selectedId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const southHandBefore = engine.getView("south").players.south.handCount;
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
      throw new Error("Expected the opponent's own-hand choice.");
    }
    expect(handChoice.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(northHandIds),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const southView = engine.getView("south");
    const northView = engine.getView("north");
    expect(
      southView.players.south.characters.find((card) => card?.instanceId === playableId),
    ).toBeDefined();
    // The controller's hand only lost Vivi and the played Character.
    expect(southView.players.south.handCount).toBe(southHandBefore - 2);
    expect(northView.players.north.hand.map((card) => card.instanceId)).not.toContain(selectedId);
    expect(northView.players.north.deckCount).toBe(northDeckBefore + 1);
    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedId);
    expect(engine.getState().cards[selectedId]).toMatchObject({
      owner: "north",
      controller: "north",
      zone: "deck",
    });
    expect(southView.prompts).toHaveLength(0);
    expect(northView.prompts).toHaveLength(0);
  });

  test("still makes the opponent bottom-deck a card after declining the optional play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04NefeltariVivi025, op04Chaka008, eb01Doma005],
        activeDon: 7,
      },
      { hand: [op04Kyros082] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const declinedId = engine.findCardInZone("south", "hand", op04Chaka008);
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);
    const selectedId = engine.findCardInZone("north", "hand", op04Kyros082);

    engine.playCard(op14eb04NefeltariVivi025, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    // With a single card in hand the opponent's mandatory choice resolves on its own.
    const southView = engine.getView("south");
    expect(southView.players.south.hand.map((card) => card.instanceId)).toContain(declinedId);
    expect(southView.players.south.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(engine.getView("north").players.north.handCount).toBe(0);
    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedId);
    expect(southView.prompts).toHaveLength(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
