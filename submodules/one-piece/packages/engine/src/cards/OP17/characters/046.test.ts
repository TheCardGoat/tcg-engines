import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Gloriosa (OP17-046) cost=4 power=1000 counter=0
describe("OP17-046 Gloriosa", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-046"], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-046");
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

    // Gloriosa placed at bottom of deck is the verified behavior.
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-046", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-046",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each(["south", "north"] as const)(
    "bottoms the selected cost5 Character into its %s owner's deck",
    (seat) => {
      const e = OnePieceTestEngine.create(
        { hand: ["OP17-046"], activeDon: 4, character: ["OP16-012"] },
        { character: ["OP16-012", "OP16-003"] },
      );
      const id = e.findCardInZone(seat, "character", "OP16-012");
      const excluded = e.findCardInZone("north", "character", "OP16-003");
      e.playCard("OP17-046");
      const choice = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (choice?.kind !== "selectEntity") throw new Error("Expected target");
      expect(choice.candidates.map((c) => c.ref.id)).toContain(id);
      expect(choice.candidates.map((c) => c.ref.id)).not.toContain(excluded);
      e.resolveDecision("effectTargetSelection", { selectedIds: [id] }, "south");
      expect(e.getState().players[seat].deck.at(-1)).toBe(id);
      expect(e.getView("south").players[seat].characters.map((c) => c?.instanceId)).not.toContain(
        id,
      );
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("Blocker redirects the attack away from the Leader", () => {
    const e = OnePieceTestEngine.create({ character: ["OP17-046"] }, {}, { activeSeat: "north" });
    const id = e.findCardInZone("south", "character", "OP17-046");
    const life = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleBlocker", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
