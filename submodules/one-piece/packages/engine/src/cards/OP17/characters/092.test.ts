import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Brogy (OP17-092) cost=5 power=5000 counter=1000
describe("OP17-092 Brogy", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-092"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-092");
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
      "OP17-092",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-092", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-092",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("replays its named partner from trash then prevents another Character play", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-079",
        hand: ["OP17-092", "ST02-002"],
        trash: ["OP17-085"],
        activeDon: 10,
      },
      {},
    );
    const partner = e.findCardInZone("south", "trash", "OP17-085");
    e.asSouth().play("OP17-092");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "OP17-092")?.cost,
    ).toBe(17);
    e.resolveDecision("effectPlaySelection", { selectedIds: [partner] }, "south");
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      partner,
    );
    expect(() => e.asSouth().play("ST02-002")).toThrow();
    expect(e.getView("south").players.south.activeDon).toBe(5);
  });
  test.each([true, false])(
    "hand partner selected=%s still locks Character plays only for this turn",
    (select) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "OP17-079", hand: ["OP17-092", "OP17-085", "ST06-006"], activeDon: 10 },
        {},
      );
      const partner = e.findCardInZone("south", "hand", "OP17-085");
      const later = e.findCardInZone("south", "hand", "ST06-006");
      e.asSouth().play("OP17-092");
      e.resolveDecision("effectPlaySelection", { selectedIds: select ? [partner] : [] }, "south");
      expect(
        e.getView("south").players.south.characters.some((c) => c?.instanceId === partner),
      ).toBe(select);
      expect(e.getView("south").players.south.hand.some((c) => c.instanceId === partner)).toBe(
        !select,
      );
      e.expectFailure({ type: "playCard", seat: "south", instanceId: later });
      expect(e.getView("south").players.south.activeDon).toBe(5);
      e.endTurn("south");
      e.endTurn("north");
      e.asSouth().play("ST06-006");
      expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === later)).toBe(
        true,
      );
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("a non-Elbaph Leader gets neither partner play nor Character restriction", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST06-001", hand: ["OP17-092", "OP17-085", "ST06-006"], activeDon: 10 },
      {},
    );
    const partner = e.findCardInZone("south", "hand", "OP17-085");
    e.asSouth().play("OP17-092");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.hand.some((c) => c.instanceId === partner)).toBe(true);
    e.asSouth().play("ST06-006");
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "ST06-006")).toBe(
      true,
    );
  });
});
