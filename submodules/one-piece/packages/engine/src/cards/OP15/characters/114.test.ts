import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-114", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-114"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    engine.playCard("OP15-114");
    engine.acceptLeadingOptional("south");
    const view = engine.getView("south");
    for (let i = 0; i < 4; i++) {
      if (view.prompts.length === 0) break;
      const d = (view.decisions ?? [])[0];
      if (!d) break;
      const intent = (d as { extensions?: { resolutionIntent?: string } }).extensions
        ?.resolutionIntent;
      if (!intent) break;
      const step = engine.pendingDecision(intent as any, "south").steps[0];
      if (step?.kind === "selectEntity" && step.candidates && step.candidates.length > 0) {
        const legal = step.candidates.filter((c: any) => c.legal);
        engine.resolveDecision(
          intent as any,
          { selectedIds: legal.length > 0 ? [legal[0].ref.id] : [] },
          "south",
        );
      } else {
        engine.resolveDecision(intent as any, { optionId: "no" }, "south");
      }
    }
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] resolves its activated ability", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-114", rested: false }], activeDon: 9 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP15-114");
    engine.activateEffect(cardId, "activateMain", "south");
    engine.acceptLeadingOptional("south");
    for (let i = 0; i < 3; i++) {
      const v = engine.getView("south");
      if (v.prompts.length === 0) break;
    }
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
