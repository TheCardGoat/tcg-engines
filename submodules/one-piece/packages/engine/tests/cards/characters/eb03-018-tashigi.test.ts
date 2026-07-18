import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Tashigi018,
  op10RadioKnife041,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const ownKoCounter: EventCard = {
  ...op10RadioKnife041,
  id: "TEST-EB03-018-OWN-KO",
  canonicalId: "TEST-EB03-018-OWN-KO",
  name: "Tashigi Own-Effect Review",
  cost: 0,
  effect: "[Counter] K.O. up to 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "ko",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([ownKoCounter]);

describe("EB03-018 Tashigi", () => {
  test("pays both end-of-turn costs before setting itself active", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: eb03Tashigi018, rested: true }],
      hand: [eb01Doma005, eb01Fourtricks025],
      activeDon: 1,
    });
    const tashigiId = engine.findCardInZone("south", "character", eb03Tashigi018);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Tashigi's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(discardedId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tashigiId)?.rested,
    ).toBe(false);
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      restedDon: 1,
    });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("gains Blocker and survives an opponent effect K.O. during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb03Tashigi018, { card: eb01Fourtricks025, rested: true }],
      },
      {
        hand: [op10RadioKnife041],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        activeDon: 4,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const tashigiId = engine.findCardInZone("south", "character", eb03Tashigi018);
    const eligibleId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op10RadioKnife041);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Tashigi's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", tashigiId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [tashigiId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === tashigiId)?.rested,
    ).toBe(true);

    engine.playCard(op10RadioKnife041, "north");
    const rest = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(rest?.kind).toBe("selectEntity");
    if (rest?.kind !== "selectEntity") throw new Error("Expected Radio Knife's rest target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(tashigiId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    const ko = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected Radio Knife's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(tashigiId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === tashigiId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("during the opponent's turn its controller's own effect can K.O. it", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [ownKoCounter], character: [eb03Tashigi018] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const tashigiId = engine.findCardInZone("south", "character", eb03Tashigi018);
    const counterId = engine.findCardInZone("south", "hand", ownKoCounter);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [counterId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the own-effect K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(tashigiId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [tashigiId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      tashigiId,
    );
  });
});
