import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Miss Buckingham Stussy (OP17-054) cost=3 power=5000 counter=0
describe("OP17-054 Miss Buckingham Stussy", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-054"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-054");
    engine.acceptLeadingOptional("south");

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
      "OP17-054",
    );
  });
  test("[Activate: Main] resolves its activated ability", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-054", "EB01-005"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-054");

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
  test("On Play uses basecost and prevents attack through the next opponent turn, then expires", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-054"], activeDon: 3 },
      { character: ["OP17-119", "EB01-005"] },
    );
    const id = e.findCardInZone("north", "character", "OP17-119");
    e.playCard("OP17-054");
    e.resolveDecision("effectTargetSelection", { selectedIds: [id] }, "south");
    e.endTurn("south");
    expect(() => e.declareAttack(id, e.leader("south"), "north")).toThrow();
    e.endTurn("north");
    e.endTurn("south");
    e.declareAttack(id, e.leader("south"), "north");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
  });
  test("Activate Main pays three DON and rests Stussy to stop a high-basecost Character", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-054"], activeDon: 3 },
      { character: ["OP16-003"] },
    );
    const source = e.findCardInZone("south", "character", "OP17-054"),
      target = e.findCardInZone("north", "character", "OP16-003");
    e.activateEffect(source, "activateMain", "south");
    e.acceptLeadingOptional("south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    e.endTurn("south");
    expect(() => e.declareAttack(target, e.leader("south"), "north")).toThrow();
    e.endTurn("north");
    e.endTurn("south");
    e.declareAttack(target, e.leader("south"), "north");
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(true);
  });
  test("declining Activate Main preserves all DON and the active source", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-054"], activeDon: 3 },
      { character: ["OP16-003"] },
    );
    const source = e.findCardInZone("south", "character", "OP17-054");
    e.activateEffect(source, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
    e.endTurn("south");
    e.asNorth().attack("OP16-003", e.leader("south"));
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(true);
  });
});
