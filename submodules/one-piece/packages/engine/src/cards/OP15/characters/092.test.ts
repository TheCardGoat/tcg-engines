import { op11Zephyr006 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-092", () => {
  test("is present on the field", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP15-092"], activeDon: 5 }, {});
    const cardId = engine.findCardInZone("south", "character", "OP15-092");
    expect(cardId).toBeDefined();
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-092", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-092",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("printed Special attribute lets Zephyr select it, excluding a Strike Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP15-092", "EB01-025"] },
      { character: [{ card: op11Zephyr006, playedOnTurn: 0 }], activeDon: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const target = engine.findCardInZone("south", "character", "OP15-092");
    const strike = engine.findCardInZone("south", "character", "EB01-025");
    const attacker = engine.findCardInZone("north", "character", "OP11-006");
    engine.attachDon(attacker, 1, "north");
    engine.declareAttack(attacker, engine.leader("south"), "north");
    const selection = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (selection?.kind !== "selectEntity") throw new Error("Expected Special Character choice");
    expect(selection.candidates.map((card) => card.ref.id)).toContain(target);
    expect(selection.candidates.map((card) => card.ref.id)).not.toContain(strike);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === target)
        ?.power,
    ).toBe(2000);
  });
});
