import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-007 Kouzuki Oden", () => {
  test.each(["OP01-043", "OP17-002", "EB01-005"])(
    "plays either Wano or Whitebeard including Allies: %s",
    (target) => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "OP17-001",
        hand: ["OP17-007", target, "OP17-006", "OP13-013"],
        activeDon: 7,
      });
      const wanted = engine.findCardInZone("south", "hand", target);
      engine.playCard("OP17-007");
      const step = engine.pendingDecision("effectPlaySelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected play selection");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([wanted]);
      engine.resolveDecision("effectPlaySelection", { selectedIds: [wanted] }, "south");
      expect(
        engine.getView("south").players.south.characters.some((c) => c?.instanceId === wanted),
      ).toBe(true);
      expect(engine.getView("south").players.south.activeDon).toBe(0);
    },
  );
  test("declines optional play with an eligible Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "OP17-001",
      hand: ["OP17-007", "OP17-002"],
      activeDon: 7,
    });
    const target = engine.findCardInZone("south", "hand", "OP17-002");
    engine.playCard("OP17-007");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([target]);
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
  test("wrong Leader cannot play an otherwise eligible Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "OP01-001",
      hand: ["OP17-007", "OP17-002"],
      activeDon: 7,
    });
    engine.playCard("OP17-007");
    expect(engine.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["OP17-002"]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
