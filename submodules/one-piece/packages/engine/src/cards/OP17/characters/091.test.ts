import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Brook (OP17-091) cost=2 power=2000 counter=1000
describe("OP17-091 Brook", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-091"], activeDon: 4 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-091");
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
      "OP17-091",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-091", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-091",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("opponent chooses the discard when an opposing cost-twelve Character enables the effect", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-091"], activeDon: 10 },
      { character: ["OP17-089"], hand: ["ST02-002", "ST02-006"] },
    );
    const target = e.findCardInZone("north", "hand", "ST02-006");
    e.asSouth().play("OP17-091");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "OP17-091")?.power,
    ).toBe(5000);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [target] }, "north");
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
  });

  test("without a cost-twelve Character, On Play does nothing and power stays at 2000", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-091"], activeDon: 2 },
      { character: ["OP01-094", "EB01-005"], hand: ["OP17-089", "ST02-006"] },
    );
    e.asSouth().play("OP17-091");
    expect(
      e.getView("south").players.south.characters.find((card) => card?.cardId === "OP17-091")
        ?.power,
    ).toBe(2000);
    expect(e.getView("south").players.north.characters.map((card) => card?.cardId)).toContain(
      "EB01-005",
    );
    expect(e.getView("north").players.north.hand.map((card) => card.cardId)).toEqual([
      "OP17-089",
      "ST02-006",
    ]);
    expect(e.getView("south").players.north.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("loses the continuous bonus when the last cost-twelve Character leaves", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-091"], activeDon: 2 },
      { character: [{ cardId: "OP17-089", rested: true }], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const saul = e.findCardInZone("north", "character", "OP17-089");
    expect(
      e.getView("south").players.south.characters.find((card) => card?.cardId === "OP17-091")
        ?.power,
    ).toBe(5000);
    e.attachDon(e.leader("south"), 2);
    e.declareAttack(e.leader("south"), saul);
    expect(e.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(saul);
    expect(
      e.getView("south").players.south.characters.find((card) => card?.cardId === "OP17-091")
        ?.power,
    ).toBe(2000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
