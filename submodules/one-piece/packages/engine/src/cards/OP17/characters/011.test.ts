import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Blamenco (OP17-011) cost=5 power=6000 counter=1000
describe("OP17-011 Blamenco", () => {
  test("[When Attacking] resolves its attack trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-011", attachedDon: 1 }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.asSouth().attack("OP17-011", engine.asNorth().leader());

    // Resolve any target/optional prompts generically.
    for (let i = 0; i < 3; i++) {
      const view = engine.getView("south");
      const remaining = view.prompts;
      if (remaining.length === 0) break;
      const d = (view.decisions ?? [])[0];
      if (!d) break;
      const intent = (d as { extensions?: { resolutionIntent?: any } }).extensions
        ?.resolutionIntent as any;
      if (!intent) break;
      const step = engine.pendingDecision(intent, "south").steps[0];
      if (step?.kind === "selectEntity" && step.candidates.length > 0) {
        engine.resolveDecision(
          intent as Parameters<typeof engine.resolveDecision>[0],
          { selectedIds: [step.candidates[0]!.ref.id] },
          "south",
        );
      } else {
        engine.resolveDecision(
          intent as Parameters<typeof engine.resolveDecision>[0],
          { optionId: "no" },
          "south",
        );
      }
    }

    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-011", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-011",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
