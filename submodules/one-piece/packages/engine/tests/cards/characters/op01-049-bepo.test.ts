import { describe, expect, test } from "vite-plus/test";
import { op01Bepo049, op01JeanBart045, op01Shinobu043 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-049 Bepo", () => {
  test("with DON!! attached plays a low-cost included Heart Pirates card other than Bepo", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01JeanBart045, op01Bepo049, op01Shinobu043],
        character: [{ card: op01Bepo049, attachedDon: 1, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op01Bepo049);
    const jeanBartId = engine.findCardInZone("south", "hand", op01JeanBart045);
    const excludedBepoId = engine.findCardInZone("south", "hand", op01Bepo049);
    const unrelatedId = engine.findCardInZone("south", "hand", op01Shinobu043);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Bepo's hand-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([jeanBartId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedBepoId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [jeanBartId] }, "south");

    expect(engine.findCardInZone("south", "character", op01JeanBart045)).toBe(jeanBartId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
