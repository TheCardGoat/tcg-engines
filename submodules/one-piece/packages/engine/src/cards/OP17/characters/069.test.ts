import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Jack (OP17-069) cost=9 power=10000 counter=0
describe("OP17-069 Jack", () => {
  test("[On Play] resolves its play effects", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-069"], activeDon: 11 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-069");
    engine.acceptLeadingOptional("south");
    // Resolve any give-DON or return-DON cost payments.
    for (let ci = 0; ci < 3; ci++) {
      const cv = engine.getView("south");
      const cd = (cv.decisions ?? [])[0];
      if (!cd) break;
      const ci2 = (cd as { extensions?: { resolutionIntent?: string } }).extensions
        ?.resolutionIntent;
      if (ci2 === "effectCostGiveDon" || ci2 === "effectCostReturnDon") {
        const cstep = engine.pendingDecision(ci2, "south").steps[0];
        if (cstep?.kind === "payCost" && cstep.candidates && cstep.candidates.length > 0) {
          const amt = (cstep as unknown as { min?: number }).min ?? 1;
          engine.resolveDecision(
            ci2,
            {
              selectedIds: cstep.candidates
                .slice(0, amt)
                .map((c: { ref: { id: string } }) => c.ref.id),
            },
            "south",
          );
        } else {
          engine.resolveDecision(ci2, { optionId: "1" }, "south");
        }
      } else if (ci2 === "effectOptional") {
        engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      } else {
        break;
      }
    }

    // Resolve any remaining prompts generically.
    for (let i = 0; i < 4; i++) {
      const remaining = engine.getView("south").prompts;
      if (remaining.length === 0) break;
      const d = (engine.getView("south").decisions ?? [])[0];
      if (!d) break;
      const intent = (d as { extensions?: { resolutionIntent?: any } }).extensions
        ?.resolutionIntent as any;
      if (intent === "effectTargetSelection" || intent === "effectPlaySelection") {
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
            { selectedIds: [] },
            "south",
          );
        }
      } else {
        engine.resolveDecision(
          intent as Parameters<typeof engine.resolveDecision>[0],
          { optionId: "no" },
          "south",
        );
      }
    }

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-069",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-069", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-069",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const jack = "OP17-069";
    const engine = OnePieceTestEngine.create(
      { hand: [jack], activeDon: 11 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(jack);
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(jack);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
