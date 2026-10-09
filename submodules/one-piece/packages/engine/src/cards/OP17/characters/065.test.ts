import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Queen (OP17-065) cost=9 power=10000 counter=0
describe("OP17-065 Queen", () => {
  test("[On Play] resolves its play effects", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-065"], activeDon: 11 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-065");
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
      "OP17-065",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-065", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-065",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const queen = "OP17-065";
    const engine = OnePieceTestEngine.create(
      { hand: [queen], activeDon: 11 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(queen);
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(queen);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("draws and stops both chosen cost-five-or-less attackers through the next opposing turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-065"], activeDon: 9, deck: ["ST02-002", "ST02-006", "EB01-005", "OP13-013"] },
      {
        character: [
          { cardId: "EB01-005", playedOnTurn: 0 },
          { cardId: "ST02-006", playedOnTurn: 0 },
        ],
      },
    );
    const ids = e
      .getView("north")
      .players.north.characters.flatMap((c) => (c?.instanceId ? [c.instanceId] : []));
    e.asSouth().play("OP17-065");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTargetSelection", { selectedIds: ids }, "south");
    expect(e.getView("south").players.south.handCount).toBe(1);
    e.endTurn("south");
    for (const id of ids) expect(() => e.asNorth().attack(id, e.leader("south"))).toThrow();
    e.endTurn("north");
    e.endTurn("south");
    e.asNorth().attack(ids[0]!, e.leader("south"));
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
  });
  test("Banish trashes the damaged Life without offering its Trigger", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-065", playedOnTurn: 0 }] },
      { life: ["OP17-107", "ST02-002"], hand: [] },
    );
    e.asSouth().attack("OP17-065", e.leader("north"));
    expect(e.getView("south").players.north.trash.some((c) => c.cardId === "OP17-107")).toBe(true);
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
