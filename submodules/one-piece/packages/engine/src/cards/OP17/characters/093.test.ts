import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Monkey.D.Luffy (OP17-093) cost=8 power=8000 counter=0
describe("OP17-093 Monkey.D.Luffy", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-093"], activeDon: 10 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-093");
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
      "OP17-093",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-093", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-093",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("draws then revives a cost-two Character and its live cost grants this card Rush", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-079",
        hand: ["OP17-093"],
        trash: ["OP17-094", "EB01-005"],
        activeDon: 10,
        deck: ["ST02-002", "ST02-006"],
      },
      {},
    );
    const target = e.findCardInZone("south", "trash", "OP17-094");
    e.asSouth().play("OP17-093");
    e.resolveDecision("effectPlaySelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    const life = e.getView("south").players.north.lifeCount;
    e.asSouth().attack("OP17-093", e.leader("north"));
    expect(e.getView("south").players.north.lifeCount).toBe(life - 1);
  });
  test.each([false, true])(
    "cannot attack on its play turn after cost-twelve enabler removed=%s",
    (remove) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "OP05-001",
          character: remove ? ["OP06-015", "OP17-089"] : [],
          hand: ["OP17-093"],
          activeDon: 8,
          deck: ["ST06-006", "ST06-006"],
        },
        {},
      );
      e.asSouth().play("OP17-093");
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST06-006"]);
      if (remove) {
        const beforeRemoval = OnePieceTestEngine.fromState(
          JSON.parse(JSON.stringify(e.getState())),
        );
        const life = beforeRemoval.getView("south").players.north.lifeCount;
        beforeRemoval.asSouth().attack("OP17-093", beforeRemoval.leader("north"));
        expect(beforeRemoval.getView("south").players.north.lifeCount).toBe(life - 1);
        const enabler = e.findCardInZone("south", "character", "OP17-089");
        e.asSouth().activateMain("OP06-015");
        e.asSouth().acceptOptional();
        e.resolveDecision("effectCostTrashCharacter", { selectedIds: [enabler] }, "south");
        expect(e.getView("south").players.south.trash.some((c) => c.instanceId === enabler)).toBe(
          true,
        );
      }
      const luffy = e.findCardInZone("south", "character", "OP17-093");
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: luffy,
        targetId: e.leader("north"),
      });
      expect(
        e.getView("south").players.south.characters.find((c) => c?.instanceId === luffy)?.rested,
      ).toBe(false);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
