import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-052 Monkey.D.Luffy", () => {
  test("[Activate: Main] [Once Per Turn] may give a rested DON!! to the Leader or a Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-052" }, "EB01-005"], restedDon: 2, activeDon: 5 },
      {},
    );
    const domaId = engine.findCardInZone("south", "character", "EB01-005");

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP16-052"),
      "activateMain",
      "south",
    );
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (recipient?.kind !== "selectEntity") throw new Error("Expected the recipient.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.restedDon).toBe(1);
    expect(south.characters.find((card) => card?.instanceId === domaId)?.attachedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("cannot be activated twice in the same turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-052"], restedDon: 2, activeDon: 5 },
      {},
    );
    const luffyId = engine.findCardInZone("south", "character", "OP16-052");

    engine.activateEffect(luffyId, "activateMain", "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    // The once-per-turn key is already consumed this turn.
    expect(() => engine.activateEffect(luffyId, "activateMain", "south")).toThrow();
  });
});
