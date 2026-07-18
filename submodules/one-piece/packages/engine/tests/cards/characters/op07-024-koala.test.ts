import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06Arlong023, op07Koala024, op13Hack090 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-024 Koala", () => {
  test("rests itself on an opposing attack to grant this-turn Blocker to an included low-cost Fish-Man", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [op07Koala024, op06Arlong023, op13Hack090, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const koalaId = engine.findCardInZone("north", "character", op07Koala024);
    const eligibleId = engine.findCardInZone("north", "character", op06Arlong023);
    const tooExpensiveId = engine.findCardInZone("north", "character", op13Hack090);
    const wrongTraitId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Koala's Blocker recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected the granted Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    engine.resolveDecision("battleBlocker", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(4);
    expect(view.players.north.characters.find((card) => card?.instanceId === koalaId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });

  test("may decline without resting itself or granting Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [op07Koala024] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const koalaId = engine.findCardInZone("north", "character", op07Koala024);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === koalaId)?.rested).toBe(
      false,
    );
    expect(view.decisions).toHaveLength(0);
  });

  test("removes the granted Blocker after the turn ends", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [op07Koala024, op06Arlong023] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", op06Arlong023);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [eligibleId] }, "north");

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    expect(() => engine.pendingDecision("battleBlocker", "north")).toThrow(
      "Could not find a pending battleBlocker prompt for north.",
    );
  });
});
