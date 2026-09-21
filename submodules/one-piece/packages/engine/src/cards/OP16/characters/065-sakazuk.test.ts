import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-065 Sakazuki", () => {
  test("[On Play] DON!! -1 pays for up to -6000 power on an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-065"], activeDon: 8 },
      { character: ["OP13-013"] },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP16-065");
    // Pay the DON!! -1 cost; the lone target is auto-selected.
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(-3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] [Once Per Turn] resting a DON!! adds up to 2 active DON!! for a Navy Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-060", character: ["OP16-065"], activeDon: 5, donDeckCount: 4 },
      {},
    );
    const sakazukiId = engine.findCardInZone("south", "character", "OP16-065");

    engine.activateEffect(sakazukiId, "activateMain", "south");
    engine.acceptLeadingOptional("south");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "2" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(6);
    expect(south.donDeckCount).toBe(2);
    expect(() => engine.activateEffect(sakazukiId, "activateMain", "south")).toThrow();
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-065", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP16-065"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
