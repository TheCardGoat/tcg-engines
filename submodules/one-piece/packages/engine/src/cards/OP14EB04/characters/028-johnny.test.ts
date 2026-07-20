import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Johnny028 } from "../../../../../cards/src/cards/OP14EB04/characters/028-johnny.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-028 Johnny", () => {
  test("only its own rest on its turn offers an optional rested cost-2-or-less opponent target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op14eb04Johnny028, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        character: [
          { card: op14eb04Johnny028, rested: true },
          eb01Doma005,
          { card: eb01Fourtricks025, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const johnnyId = engine.findCardInZone("south", "character", op14eb04Johnny028);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", op14eb04Johnny028);
    const activeId = engine.findCardInZone("north", "character", eb01Doma005);
    const overCostId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(allyId, engine.leader("north"), "south");
    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();

    engine.declareAttack(johnnyId, engine.leader("north"), "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Johnny's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(overCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(allyId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(eligibleId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(activeId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(overCostId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no eligible Character without K.O.'ing it", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04Johnny028, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const johnnyId = engine.findCardInZone("south", "character", op14eb04Johnny028);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(johnnyId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
