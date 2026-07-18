import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Bepo071 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-071 Bepo", () => {
  test("when attacking with fewer field DON!!, gives an opposing Character -2000 power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Bepo071, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01Doma005], activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bepoId = engine.findCardInZone("south", "character", op05Bepo071);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(bepoId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Bepo's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      1000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not reduce power when both players have the same number of field DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Bepo071, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01Doma005], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bepoId = engine.findCardInZone("south", "character", op05Bepo071);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(bepoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
