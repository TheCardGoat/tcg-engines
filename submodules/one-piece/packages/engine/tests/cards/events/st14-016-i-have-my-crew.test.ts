import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, prb02IHaveMyCrewPirateFoil016 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("ST14-016 I Have My Crew!! reprint", () => {
  test("Main draws one and gives a chosen Character +3 cost through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [prb02IHaveMyCrewPirateFoil016],
      character: [eb01Doma005],
      activeDon: 1,
    });
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.playCard(prb02IHaveMyCrewPirateFoil016);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(1);
  });

  test("Life Trigger K.O.s an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { life: [prb02IHaveMyCrewPirateFoil016] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});
