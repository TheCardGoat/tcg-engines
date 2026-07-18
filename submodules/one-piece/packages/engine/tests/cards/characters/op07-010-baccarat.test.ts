import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op07Baccarat010 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-010 Baccarat", () => {
  test("trashes a hand card to give an own card +2000 for one battle only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Baccarat010], hand: [eb01Doma005, eb01Fourtricks025] },
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const baccaratId = engine.findCardInZone("south", "character", op07Baccarat010);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const otherHandId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const secondAttackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Baccarat's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardId, otherHandId]),
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Baccarat's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), baccaratId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      engine.leader("north"),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);

    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
  });

  test("declining pays nothing and leaves the once-per-turn effect available", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Baccarat010], hand: [eb01Doma005] },
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondAttackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      discardId,
    );

    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("rests as a Blocker and protects the attacked Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Baccarat010] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const baccaratId = engine.findCardInZone("south", "character", op07Baccarat010);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Baccarat as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(baccaratId);
    engine.resolveDecision("battleBlocker", { selectedIds: [baccaratId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === baccaratId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
