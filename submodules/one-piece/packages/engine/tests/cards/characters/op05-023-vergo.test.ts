import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op05Vergo023 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-023 Vergo", () => {
  test("with DON!! x1, K.O.s only an opposing rested cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Vergo023, attachedDon: 1, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01MountainGod018, rested: true, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const vergoId = engine.findCardInZone("south", "character", op05Vergo023);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const activeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(vergoId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Vergo's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([activeId, highCostId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([activeId, highCostId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("without attached DON!!, does not offer the When Attacking K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Vergo023, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const vergoId = engine.findCardInZone("south", "character", op05Vergo023);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(vergoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
