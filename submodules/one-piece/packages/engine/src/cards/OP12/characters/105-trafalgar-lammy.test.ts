import { describe, expect, test } from "vite-plus/test";
import { op12TrafalgarLammy105, op12TrafalgarLaw106 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-105 Trafalgar Lammy", () => {
  test("on play gives an own Trafalgar Law 2000 power for the turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12TrafalgarLammy105],
      character: [op12TrafalgarLaw106],
      activeDon: op12TrafalgarLammy105.cost,
    });
    const lawId = engine.findCardInZone("south", "character", op12TrafalgarLaw106);
    engine.playCard(op12TrafalgarLammy105, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lawId] }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === lawId)
        ?.power,
    ).toBe(9000);
  });
});
