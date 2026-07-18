import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06JigoroOfTheWind084 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-084 Jigoro of the Wind", () => {
  test("when K.O.'d in battle, resolves from trash and gives an own card +1000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [{ card: op06JigoroOfTheWind084, rested: true }, eb01Doma005],
        hand: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const jigoroId = engine.findCardInZone("north", "character", op06JigoroOfTheWind084);
    const supportingCharacterId = engine.findCardInZone("north", "character", eb01Doma005);
    const leaderId = engine.leader("north");
    const leaderPowerBefore = engine.getView("north").players.north.leader.power;
    if (leaderPowerBefore === null) throw new Error("Expected the Leader's projected power.");

    engine.declareAttack(attackerId, jigoroId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Jigoro's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([leaderId, supportingCharacterId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(jigoroId);
    expect(view.players.north.leader.power).toBe(leaderPowerBefore + 1000);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(engine.getView("north").players.north.leader.power).toBe(leaderPowerBefore);
  });
});
