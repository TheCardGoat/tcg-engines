import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Charlotte Oven (OP17-102) cost=4 power=4000 counter=1000
describe("OP17-102 Charlotte Oven", () => {
  test("[On K.O.] resolves when this Character is K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-102", rested: true }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-102");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP17-102");

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

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-102", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-102",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
