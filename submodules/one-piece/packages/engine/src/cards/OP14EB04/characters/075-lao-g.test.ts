import { eb01Doma005, op01Shanks120 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04LaoG075 } from "../../../../../cards/src/cards/OP14EB04/characters/075-lao-g.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-075 Lao.G", () => {
  test("on K.O. may add one rested DON then give one opposing Character minus 2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04LaoG075, rested: true }],
        donDeckCount: 1,
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }, eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const laoGId = engine.findCardInZone("south", "character", op14eb04LaoG075);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, laoGId, "north");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Lao.G's rested DON choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Lao.G's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      (eb01Doma005.power ?? 0) - 2000,
    );
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
