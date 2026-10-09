import type { Action } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

// No catalog unavoidable loop is established. This synthetic rules fixture
// isolates a compulsory two-player cycle without choices or resource costs.
for (const mode of ["unavoidable", "oncePerTurn", "targetChoice"] as const) {
  const finite = mode === "oncePerTurn";
  test(`11-1-1-1: unique opposing targets ${mode}`, () => {
    const a = getCard("EB01-005");
    const b = getCard("EB01-018");
    const originalA = a.effects;
    const originalB = b.effects;
    const rest: Action = {
      action: "rest",
      target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
    };
    const active: Action = {
      action: "setActive",
      target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
    };
    try {
      a.effects = {
        effects: [
          { trigger: "activateMain", actions: [rest] },
          {
            trigger: "whenBecomesRested",
            eventFilter: { targetSelf: true },
            oncePerTurn: finite,
            actions: [active, rest],
          },
        ],
      };
      b.effects = {
        effects: [
          {
            trigger: "whenBecomesRested",
            eventFilter: { targetSelf: true },
            actions: [active, rest],
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { character: [a] },
        { character: mode === "targetChoice" ? [b, "EB01-023"] : [b] },
      );
      engine.activateEffect(
        engine.findCardInZone("south", "character", a),
        "activateMain",
        "south",
      );
      if (mode === "targetChoice") {
        expect(engine.pendingDecision("effectTargetSelection", "south")).toBeDefined();
        expect(engine.getView("south").status).toBe("active");
        expect(engine.getView("south").finishReason).toBe(null);
        return;
      }
      expect(engine.getView("south").status).toBe(finite ? "active" : "finished");
      expect(engine.getView("south").finishReason).toBe(finite ? null : "draw");
    } finally {
      a.effects = originalA;
      b.effects = originalB;
    }
  });
}
