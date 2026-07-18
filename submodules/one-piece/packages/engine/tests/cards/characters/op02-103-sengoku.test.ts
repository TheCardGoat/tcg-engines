import { describe, expect, test } from "vite-plus/test";
import { op02Minokoala086, op02Sengoku103, op02Tashigi105 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-103 Sengoku", () => {
  test("with DON!! attached, gives an opposing Character -2 cost until turn end", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Sengoku103, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [op02Tashigi105, op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sengokuId = engine.findCardInZone("south", "character", op02Sengoku103);
    const targetId = engine.findCardInZone("north", "character", op02Tashigi105);

    engine.declareAttack(sengokuId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Sengoku's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(1);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(3);
  });

  test("without DON!! attached, does not offer or apply a cost reduction", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Sengoku103, playedOnTurn: 0 }] },
      { character: [op02Tashigi105, op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sengokuId = engine.findCardInZone("south", "character", op02Sengoku103);
    const targetId = engine.findCardInZone("north", "character", op02Tashigi105);

    engine.declareAttack(sengokuId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no opposing Character after attacking with DON!! attached", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Sengoku103, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [op02Tashigi105, op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sengokuId = engine.findCardInZone("south", "character", op02Sengoku103);
    const targetId = engine.findCardInZone("north", "character", op02Tashigi105);

    engine.declareAttack(sengokuId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
