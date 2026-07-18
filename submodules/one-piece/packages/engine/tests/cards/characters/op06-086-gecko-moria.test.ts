import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, eb01Fourtricks025, op06GeckoMoria086 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const drawOnPlay: CharacterCard = {
  ...eb01Fourtricks025,
  id: "TEST-OP06-086-DRAW",
  canonicalId: "TEST-OP06-086-DRAW",
  name: "Test Moria Draw",
  cost: 4,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
};

const returnOnPlay: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP06-086-RETURN",
  canonicalId: "TEST-OP06-086-RETURN",
  name: "Test Moria Return",
  cost: 2,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
            },
          },
        ],
      },
    ],
  },
};

registerCards([drawOnPlay, returnOnPlay]);

function createMoriaEngine(trash: CharacterCard[]) {
  return OnePieceTestEngine.create({
    hand: [op06GeckoMoria086],
    activeDon: op06GeckoMoria086.cost,
    trash,
  });
}

describe("OP06-086 Gecko Moria", () => {
  test("chooses zero or one eligible card, and a single card enters active", () => {
    const declined = createMoriaEngine([eb01Doma005]);
    declined.playCard(op06GeckoMoria086, "south");
    declined.resolveDecision("effectGroupedPlaySelection", { selectedIds: [] }, "south");
    expect(declined.getView("south").prompts).toHaveLength(0);
    expect(declined.getView("south").players.south.trash).toHaveLength(1);

    const engine = createMoriaEngine([eb01Doma005]);
    const selectedId = engine.findCardInZone("south", "trash", eb01Doma005);
    engine.playCard(op06GeckoMoria086, "south");
    const play = engine.pendingDecision("effectGroupedPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Moria's grouped play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    engine.resolveDecision("effectGroupedPlaySelection", { selectedIds: [selectedId] }, "south");

    const played = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === selectedId);
    expect(played?.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("requires one selected card to satisfy each group and lets the player assign active/rested", () => {
    const engine = createMoriaEngine([drawOnPlay, eb01Fourtricks025, returnOnPlay]);
    const costFourId = engine.findCardInZone("south", "trash", drawOnPlay);
    const costThreeId = engine.findCardInZone("south", "trash", eb01Fourtricks025);
    const costTwoId = engine.findCardInZone("south", "trash", returnOnPlay);
    engine.playCard(op06GeckoMoria086, "south");

    const decision = engine.pendingDecision("effectGroupedPlaySelection", "south");
    expect(
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: decision.id,
        selectedIds: [costFourId, costThreeId],
      }).accepted,
    ).toBe(false);
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [costFourId, costTwoId] },
      "south",
    );
    engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: costTwoId }, "south");

    const characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === costTwoId)?.rested).toBe(false);
    expect(characters.find((card) => card?.instanceId === costFourId)?.rested).toBe(true);
    expect(engine.pendingDecision("effectGroupedPlayOnPlayOrder", "south").steps[0]?.kind).toBe(
      "orderItems",
    );
  });

  test("activates the played cards' On Play effects in the chosen order", () => {
    const engine = createMoriaEngine([drawOnPlay, returnOnPlay]);
    const drawId = engine.findCardInZone("south", "trash", drawOnPlay);
    const returnId = engine.findCardInZone("south", "trash", returnOnPlay);
    engine.playCard(op06GeckoMoria086, "south");
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [drawId, returnId] },
      "south",
    );
    engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: drawId }, "south");
    const handBefore = engine.getView("south").players.south.hand.length;
    engine.resolveDecision(
      "effectGroupedPlayOnPlayOrder",
      { selectedIds: [drawId, returnId] },
      "south",
    );

    expect(engine.getView("south").players.south.hand).toHaveLength(handBefore + 1);
    expect(engine.pendingDecision("effectTargetSelection", "south").steps[0]?.kind).toBe(
      "selectEntity",
    );
  });

  test("activates a pending On Play after that played card leaves the field", () => {
    const engine = createMoriaEngine([drawOnPlay, returnOnPlay]);
    const drawId = engine.findCardInZone("south", "trash", drawOnPlay);
    const returnId = engine.findCardInZone("south", "trash", returnOnPlay);
    engine.playCard(op06GeckoMoria086, "south");
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [drawId, returnId] },
      "south",
    );
    engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: drawId }, "south");
    const deckBefore = engine.getView("south").players.south.deckCount;
    engine.resolveDecision(
      "effectGroupedPlayOnPlayOrder",
      { selectedIds: [returnId, drawId] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [drawId] }, "south");

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 1);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
