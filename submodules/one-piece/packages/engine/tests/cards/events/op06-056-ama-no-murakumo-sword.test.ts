import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05BartholomewKuma011,
  op06AmaNoMurakumoSword056,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-056 Ama no Murakumo Sword", () => {
  test("declining the first target group still permits the second group", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP06-056"], activeDon: 8, life: 2 },
      { character: ["EB01-005", "EB01-005"] },
    );
    const kept = engine.getView("south").players.north.characters[0]!.instanceId;
    const selected = engine.getView("south").players.north.characters[1]?.instanceId;
    if (!selected) throw new Error("Expected second opposing Character");
    const deckBefore = engine.getView("south").players.north.deckCount;
    engine.playCard("OP06-056");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      engine.getView("south").players.north.characters.some((card) => card?.instanceId === kept),
    ).toBe(true);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selected] }, "south");
    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === kept)).toBe(true);
    expect(view.players.north.deckCount).toBe(deckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("Main maps the cost-2 then cost-1 choices into owner-selected bottom-deck order", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06AmaNoMurakumoSword056],
        activeDon: 2,
      },
      {
        deck: [eb01MountainGod018],
        character: [eb01Doma005, op05BartholomewKuma011],
      },
    );
    const costOneId = engine.findCardInZone("north", "character", eb01Doma005);
    const costTwoId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
    const originalDeckId = engine.findCardInZone("north", "deck", eb01MountainGod018);

    engine.playCard(op06AmaNoMurakumoSword056);

    const firstDecision = engine.pendingDecision("effectTargetSelection", "south");
    const firstStep = firstDecision.steps[0];
    expect(firstStep?.kind).toBe("selectEntity");
    if (firstStep?.kind !== "selectEntity") {
      throw new Error("Expected the first cost-2-or-less bottom-deck choice.");
    }
    expect(firstStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      costOneId,
      costTwoId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costTwoId] }, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === costTwoId),
    ).toBe(true);

    const secondDecision = engine.pendingDecision("effectTargetSelection", "south");
    const secondStep = secondDecision.steps[0];
    expect(secondStep?.kind).toBe("selectEntity");
    if (secondStep?.kind !== "selectEntity") {
      throw new Error("Expected the remaining cost-1-or-less bottom-deck choice.");
    }
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).toEqual([costOneId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costOneId] }, "south");
    engine.asNorth().orderCards("effectReturnToDeckOwnerOrder", [costOneId, costTwoId]);

    expect(engine.getState().players.north.deck).toEqual([originalDeckId, costOneId, costTwoId]);
    expect(engine.getView("south").players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger resolves both target groups without DON payment and lets the owner order", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          eb01Doma005,
          op05BartholomewKuma011,
        ],
        deck: [eb01MountainGod018],
      },
      { life: [op06AmaNoMurakumoSword056], activeDon: 0 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const costOne = engine.findCardInZone("south", "character", eb01Doma005);
    const costTwo = engine.findCardInZone("south", "character", op05BartholomewKuma011);
    const deckTop = engine.findCardInZone("south", "deck", eb01MountainGod018);

    expect(engine.declareAttack(attacker, engine.leader("north"), "south")).toMatchObject({
      accepted: true,
    });
    engine.asNorth().chooseOption("lifeTrigger", "activate");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costTwo] }, "north");
    expect(engine.getState().cards[costTwo]?.zone).toBe("character");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costOne] }, "north");
    expect(engine.getView("north").decisions).toHaveLength(0);
    engine.asSouth().orderCards("effectReturnToDeckOwnerOrder", [costOne, costTwo]);

    expect(engine.getState().players.south.deck).toEqual([deckTop, costOne, costTwo]);
    expect(engine.getState().cards[attacker]?.zone).toBe("character");
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").players.north.trash.map((card) => card.cardId)).toContain(
      "OP06-056",
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
