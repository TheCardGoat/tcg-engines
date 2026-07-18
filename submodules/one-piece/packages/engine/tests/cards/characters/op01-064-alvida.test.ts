import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Alvida064 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-064 Alvida", () => {
  test("with DON!! attached trashes a chosen hand card before returning a low-cost opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: op01Alvida064, attachedDon: 1, playedOnTurn: 0 }],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const alvidaId = engine.findCardInZone("south", "character", op01Alvida064);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const retainedId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(alvidaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Alvida's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([discardedId, retainedId]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Alvida's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      false,
    );
    expect(engine.findCardInZone("north", "hand", eb01Doma005)).toBe(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
