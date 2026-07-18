import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Sugar065, op11Zephyr006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-006 Zephyr", () => {
  test("with DON!! x1 reduces only an opposing Special Character by 5000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op11Zephyr006, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [op10Sugar065, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zephyrId = engine.findCardInZone("south", "character", op11Zephyr006);
    const specialId = engine.findCardInZone("north", "character", op10Sugar065);
    const nonSpecialId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(zephyrId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Zephyr's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(specialId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonSpecialId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [specialId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === specialId)?.power,
    ).toBe(-4000);
    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === specialId)?.power,
    ).toBe(1000);
  });

  test("does not offer the effect without DON!! attached", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op11Zephyr006, playedOnTurn: 0 }] },
      { character: [op10Sugar065] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zephyrId = engine.findCardInZone("south", "character", op11Zephyr006);

    engine.declareAttack(zephyrId, engine.leader("north"), "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
