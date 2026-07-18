import { describe, expect, test } from "vite-plus/test";
import { op11MonkeyDLuffy118 } from "@tcg/op-cards";
import { op13Makino015 } from "../../../../../cards/src/cards/OP13/characters/015-makino.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-015 Makino", () => {
  test("rests itself to give a chosen Monkey.D.Luffy +2000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13Makino015, op11MonkeyDLuffy118],
    });
    const makinoId = engine.findCardInZone("south", "character", op13Makino015);
    const luffyId = engine.findCardInZone("south", "character", op11MonkeyDLuffy118);
    const basePower = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === luffyId)?.power;

    engine.activateEffect(makinoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === makinoId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.power).toBe(
      (basePower ?? 0) + 2000,
    );
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === luffyId)
        ?.power,
    ).toBe(basePower);
  });
});
