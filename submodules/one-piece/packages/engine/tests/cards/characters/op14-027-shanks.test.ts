import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op14eb04Shanks027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-027 Shanks", () => {
  test("rests an eligible opposing Character when it becomes rested to attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04Shanks027, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shanksId = engine.findCardInZone("south", "character", op14eb04Shanks027);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(shanksId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().cards[shanksId]?.rested).toBe(true);
    expect(engine.getState().cards[targetId]?.rested).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
