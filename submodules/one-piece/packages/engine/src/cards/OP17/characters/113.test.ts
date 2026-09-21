import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Streusen (OP17-113) cost=1 power=2000 counter=2000
describe("OP17-113 Streusen", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-113"], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-113");
    engine.acceptLeadingOptional("south");

    // Resolve all pending prompts generically.
    for (let i = 0; i < 4; i++) {
      const remaining = engine.getView("south").prompts;
      if (remaining.length === 0) break;
      const d = (engine.getView("south").decisions ?? [])[0];
      if (!d) break;
      const intent = (d as { extensions?: { resolutionIntent?: any } }).extensions
        ?.resolutionIntent as any;
      if (!intent) break;
      const step = engine.pendingDecision(intent, "south").steps[0];
      if (step?.kind === "selectEntity" && step.candidates && step.candidates.length > 0) {
        const legalCands = step.candidates.filter((c) => c.legal);
        if (legalCands.length > 0) {
          engine.resolveDecision(
            intent as Parameters<typeof engine.resolveDecision>[0],
            { selectedIds: [legalCands[0]!.ref.id] },
            "south",
          );
        } else {
          engine.resolveDecision(
            intent as Parameters<typeof engine.resolveDecision>[0],
            { selectedIds: [] },
            "south",
          );
        }
      } else if (step?.kind === "chooseOption") {
        engine.resolveDecision(
          intent as Parameters<typeof engine.resolveDecision>[0],
          { optionId: step.options?.[0]?.id ?? "no" },
          "south",
        );
      } else if (step?.kind === "payCost") {
        const cands = step.candidates ?? [];
        if (cands.length > 0) {
          engine.resolveDecision(
            intent as Parameters<typeof engine.resolveDecision>[0],
            { selectedIds: [cands[0]!.ref.id] },
            "south",
          );
        } else {
          break;
        }
      } else if (step?.kind === "orderItems") {
        engine.resolveDecision(
          intent as Parameters<typeof engine.resolveDecision>[0],
          { selectedIds: step.candidates?.map((c: { ref: { id: string } }) => c.ref.id) ?? [] },
          "south",
        );
      } else if (step?.kind === "confirm") {
        engine.resolveDecision(
          intent as Parameters<typeof engine.resolveDecision>[0],
          { optionId: "no" },
          "south",
        );
      } else {
        break;
      }
    }

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-113",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-113", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-113",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
