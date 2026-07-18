import { describe, expect, test } from "vite-plus/test";
import { op11MonkeyDLuffy118 } from "@tcg/op-cards";
import { op13WoopSlap006 } from "../../../../../cards/src/cards/OP13/characters/006-woop-slap.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-006 Woop Slap", () => {
  test("gives a chosen count of rested DON!! only to an own Monkey.D.Luffy", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13WoopSlap006],
      character: [op11MonkeyDLuffy118],
      activeDon: op13WoopSlap006.cost,
      restedDon: 2,
    });
    const luffyId = engine.findCardInZone("south", "character", op11MonkeyDLuffy118);

    engine.playCard(op13WoopSlap006, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Woop Slap's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Woop Slap's Luffy target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      luffyId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === luffyId)?.attachedDon,
    ).toBe(2);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
