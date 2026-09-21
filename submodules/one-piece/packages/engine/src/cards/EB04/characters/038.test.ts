import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-038", () => {
  test("[On Play] with equal DON!! draws 1 and adds up to 1 active DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-038"], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 6 },
    );

    engine.playCard("EB04-038");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected the DON!! count choice.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] draws nothing when your DON!! count is higher, but still offers the DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-038"], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 1 },
    );

    engine.playCard("EB04-038");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected the DON!! count choice.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
