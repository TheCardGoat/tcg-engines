import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCard,
  expectFailure,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { restUnitsByAttackingDirectly } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd01WingGundamZero024 } from "./024-wing-gundam-zero.ts";
import { gd01GundamLfrith086 } from "./086-gundam-lfrith.ts";

describe("Gundam Lfrith (GD01-086)", () => {
  it("deploys with visible stats and uses Blocker on the opponent's turn", () => {
    const ally = createMockUnit({ hp: 5 });
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamLfrith086],
        play: [ally],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {
        play: [attacker],
        deck: 5,
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [p1.unit(ally).instanceId]);

    p1.must.deployUnit(gd01GundamLfrith086);
    expectPublicLog(engine, "gundam.move.deployUnit", {
      playerId: PLAYER_ONE,
      cost: gd01GundamLfrith086.cost,
    });
    expectCard(p1, gd01GundamLfrith086).toHaveAp(2).toHaveHp(4).toShowKeyword("Blocker");
    p1.must.passPhase();
    p2.must.passActionStep();
    p1.must.passActionStep();
    p2.must.attack(attacker).into(ally);
    p1.must.declareBlock(gd01GundamLfrith086);

    expectPublicLog(engine, "gundam.move.blockDeclared", {
      blockerPlayerId: PLAYER_ONE,
    });
    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(
      p1.unit(gd01GundamLfrith086).instanceId,
    );
    expectCard(p1, gd01GundamLfrith086).toBeRested();
  });

  it("cannot deploy below Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01GundamLfrith086],
      resourceArea: activeResources(2),
      deck: 5,
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd01GundamLfrith086),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("cannot block a High-Maneuver attacker", () => {
    // Use published Wing Gundam Zero (High-Maneuver) as the attacker
    const ally = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamLfrith086],
        play: [ally],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {
        play: [gd01WingGundamZero024],
        deck: 5,
        shieldArea: [createMockUnit({ name: "Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [p1.unit(ally).instanceId]);
    p1.must.deployUnit(gd01GundamLfrith086);
    p1.must.passPhase();
    p2.must.passActionStep();
    p1.must.passActionStep();
    p2.must.attack(gd01WingGundamZero024).into(ally);
    expectFailure(p1.declareBlock(gd01GundamLfrith086), "CANNOT_BLOCK_HIGH_MANEUVER");
    expectCard(p1, gd01GundamLfrith086).toBeReady();
  });
});
