import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Lucky.Roux (OP17-033) cost=4 power=5000 counter=1000
describe("OP17-033 Lucky.Roux", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-033"], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-033");
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
      "OP17-033",
    );
  });
  test("[On Opponent's Attack] resolves its trigger during an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-033"], hand: ["EB01-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-033");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    // Decline Lucky Roux's optional trigger to keep it on the field.
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      cardId,
    );
  });
});
