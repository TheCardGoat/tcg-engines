import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Kurozumi Kanjuro (OP17-067) cost=2 power=3000 counter=1000
describe("OP17-067 Kurozumi Kanjuro", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-067"], activeDon: 4 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-067");
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
      "OP17-067",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-067", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-067",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const kanjuro = "OP17-067";
    const engine = OnePieceTestEngine.create(
      { hand: [kanjuro], activeDon: 4 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(kanjuro);
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      kanjuro,
    );
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("cost-ten Character enables resting an opposing active Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-067"], character: ["OP17-118"], activeDon: 2 },
      { character: ["EB01-005"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.asSouth().play("OP17-067");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(true);
  });

  test.each([false, true])(
    "pays DON but skips the effect when only the opponent can have a cost-ten Character: %s",
    (opponentQualifies) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "ST04-001",
          life: ["ST04-009", "ST04-009", "ST04-009", "ST04-009"],
          hand: ["OP17-067", "ST04-012"],
          character: ["ST04-009"],
          activeDon: 2,
          donDeckCount: 8,
          deck: ["ST04-007", "ST04-012", "ST04-009"],
        },
        {
          leaderCardId: "ST04-001",
          hand: [],
          deck: ["ST04-007", "ST04-009", "ST04-012"],
          life: ["ST04-009", "ST04-009", "ST04-009", "ST04-009"],
          character: opponentQualifies ? ["OP01-094", "ST04-009"] : ["ST04-009"],
        },
      );
      e.asSouth().play("OP17-067");
      e.asSouth().acceptOptional();
      const view = e.getView("south");
      expect(view.players.south.activeDon).toBe(0);
      expect(view.players.south.restedDon).toBe(1);
      expect(view.players.south.donDeckCount).toBe(9);
      expect(
        view.players.north.characters.filter(Boolean).every((card) => card?.rested === false),
      ).toBe(true);
      expect(view.prompts).toHaveLength(0);
    },
  );
});
