import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-065 Sakazuki", () => {
  test("[On Play] may decline DON!! -1 without reducing power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-065"], activeDon: 8 },
      { character: ["OP13-013"] },
    );
    const deckBefore = engine.getView("south").players.south.donDeckCount;
    engine.asSouth().play("OP16-065");
    engine.asSouth().declineOptional();
    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(deckBefore);
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.restedDon).toBe(7);
    expect(view.players.north.characters[0]?.power).toBe(3000);
    expect(view.prompts).toHaveLength(0);
  });

  test("[On Play] DON!! -1 pays for up to -6000 power on an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-065"], activeDon: 8 },
      { character: ["OP13-013"] },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP16-065");
    engine.asSouth().acceptOptional();
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
  test("shares Sakazuki's printed name with other printings for Luffy's name count", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP16-034", "OP16-065", "OP02-099"], activeDon: 1 },
      {},
    );
    const luffy = e.findCardInZone("south", "character", "OP16-034");
    e.attachDon(luffy, 1, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === luffy)?.power,
    ).toBe(3000);
  });
});
