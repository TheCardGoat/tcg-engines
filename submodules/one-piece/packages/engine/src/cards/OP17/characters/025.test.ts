import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Building Snake (OP17-025) cost=4 power=5000 counter=1000
describe("OP17-025 Building Snake", () => {
  test("[Activate: Main] resolves its activated ability", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-025", "EB01-005"], activeDon: 8 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-025");

    engine.activateEffect(cardId, "activateMain", "south");
    engine.acceptLeadingOptional("south");

    for (let i = 0; i < 3; i++) {
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

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On K.O.] resolves when this Character is K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-025", rested: true }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-025");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP17-025");

    // Resolve any follow-up prompts generically.
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

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      cardId,
    );
  });
});
