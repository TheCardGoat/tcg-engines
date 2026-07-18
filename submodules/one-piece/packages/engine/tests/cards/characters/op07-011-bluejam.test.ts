import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Nami016, op07Bluejam011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-011 Bluejam", () => {
  test("with DON!! x1, K.O.s only an opposing Character with 2000 power or less when attacking", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op07Bluejam011, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [op01Nami016, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bluejamId = engine.findCardInZone("south", "character", op07Bluejam011);
    const eligibleId = engine.findCardInZone("north", "character", op01Nami016);
    const ineligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(bluejamId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Bluejam's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(ineligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("without an attached DON!!, does not offer the When Attacking K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op07Bluejam011, playedOnTurn: 0 }] },
      { character: [op01Nami016] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bluejamId = engine.findCardInZone("south", "character", op07Bluejam011);
    const targetId = engine.findCardInZone("north", "character", op01Nami016);

    engine.declareAttack(bluejamId, engine.leader("north"), "south");

    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(targetId);
  });
});
