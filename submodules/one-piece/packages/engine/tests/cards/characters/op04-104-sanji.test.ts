import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Napoleon117, op04Sanji104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-104 Sanji", () => {
  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Sanji104] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op04Sanji104);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Sanji's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(sanjiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [sanjiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger trashes a chosen hand card and plays the resolving physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04Sanji104], hand: [op03Napoleon117, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sanjiId = engine.findCardInZone("north", "life", op04Sanji104);
    const discardId = engine.findCardInZone("north", "hand", op03Napoleon117);
    const otherId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Sanji's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([discardId, otherId]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === sanjiId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(sanjiId);
    expect(view.prompts).toHaveLength(0);
  });
});
