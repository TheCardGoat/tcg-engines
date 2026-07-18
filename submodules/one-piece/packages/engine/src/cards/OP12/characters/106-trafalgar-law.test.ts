import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op12TrafalgarLaw106 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-106 Trafalgar Law", () => {
  test("can block and protect its Leader from an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12TrafalgarLaw106] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = engine.findCardInZone("south", "character", op12TrafalgarLaw106);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [lawId] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
