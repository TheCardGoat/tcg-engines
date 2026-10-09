import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-035 Roronoa Zoro", () => {
  test.each([true, false])(
    "[On Play] rest choice %s resolves before optional discard and giving DON!!",
    (restTarget) => {
      const engine = OnePieceTestEngine.create(
        { hand: ["OP16-035", "OP13-013"], activeDon: 10, restedDon: 3 },
        { character: ["OP16-004"] },
      );
      const northLeaderId = engine.getView("south").players.north.leader?.instanceId;

      engine.playCard("OP16-035");
      expect(() => engine.pendingDecision("readyEffectOrder", "south")).toThrow();

      const rest = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
      if (rest?.kind !== "payCost") throw new Error("Expected the rest selection.");
      engine.resolveDecision(
        "effectMixedRestSelection",
        { selectedIds: restTarget ? [northLeaderId!] : [] },
        "south",
      );

      engine.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
      // The sole hand card is automatically trashed after accepting this nested action.
      const give = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
      if (give?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
      engine.resolveDecision("effectGiveDonCount", { optionId: "3" }, "south");

      const south = engine.getView("south").players.south;
      expect(engine.getView("south").players.north.leader?.rested).toBe(restTarget);
      expect(south.leader?.attachedDon).toBe(3);
      expect(south.trash.map((card) => card.cardId)).toContain("OP13-013");
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("declining keeps the rested DON!! in the cost area", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-035", "OP13-013"], activeDon: 10, restedDon: 3 },
      { character: ["OP16-004"] },
    );

    engine.playCard("OP16-035");
    expect(() => engine.pendingDecision("readyEffectOrder", "south")).toThrow();

    const rest = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected the rest selection.");
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [] }, "south");
    engine.resolveDecision("effectActionOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.restedDon).toBe(10);
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP13-013",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
