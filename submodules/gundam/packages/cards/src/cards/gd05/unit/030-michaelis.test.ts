import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05Michaelis030 } from "./030-michaelis.ts";
import { gd03BridgeCrew105 } from "../../gd03/command/105-bridge-crew.ts";

function deployAgainstRestedEnemy() {
  const enemy = createMockUnit({ name: "Rested Enemy", ap: 0, hp: 6 });
  const engine = GundamTestEngine.create(
    {
      hand: [gd05Michaelis030],
      resourceArea: activeResources(4),
      shieldArea: [createMockUnit({ name: "Opening Shield" })],
      deck: 5,
    },
    { play: [enemy], deck: 5 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const enemyId = p2.getCardsInZone("battleArea")[0]!;

  restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  expectSuccess(p1.deployUnit(gd05Michaelis030));

  return { engine, p1, p2, enemyId, michaelisId: p1.getCardsInZone("battleArea")[0]! };
}

describe("Michaelis (GD05-030)", () => {
  /** @behavioral-proof complete: deploy-turn permission, target limit, expiry, and combat are public. */
  describe("On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.", () => {
    it("attacks a rested enemy Unit on the turn it is deployed", () => {
      const { p1, enemyId, michaelisId } = deployAgainstRestedEnemy();

      expectSuccess(p1.enterBattle(michaelisId, enemyId));
    });

    it("deals its printed 3 AP as battle damage in that deployment-turn attack", () => {
      const { p1, p2, enemyId, michaelisId } = deployAgainstRestedEnemy();

      expectSuccess(p1.enterBattle(michaelisId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(enemyId)).toBe(3);
    });

    it("cannot attack the enemy player on the turn it is deployed", () => {
      const { p1, michaelisId } = deployAgainstRestedEnemy();

      expectFailure(p1.enterBattle(michaelisId, "direct"), "INVALID_TARGET");
      expect(p1.isExhausted(michaelisId)).toBe(false);
    });

    it("cannot choose an active enemy Unit on the turn it is deployed", () => {
      const activeEnemy = createMockUnit({ name: "Active Enemy" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05Michaelis030],
          resourceArea: activeResources(4),
        },
        { play: [activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const activeEnemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05Michaelis030));
      const michaelisId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(michaelisId, activeEnemyId), "INVALID_TARGET");
      expect(p1.isExhausted(michaelisId)).toBe(false);
    });

    it("has no deployment-turn permission before it is actually deployed", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05Michaelis030],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
      expectSuccess(p1.deployUnit(gd05Michaelis030));
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });

    it("can attack the enemy player normally on a later turn", () => {
      const engine = GundamTestEngine.create({ play: [gd05Michaelis030], deck: 5 }, { deck: 5 });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const michaelisId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(michaelisId, "direct"));
    });

    it("keeps ordinary deployment-turn attack freedom after becoming a Link Unit", () => {
      const shaddiq = createMockPilot({ name: "Shaddiq Zenelli", level: 0, cost: 0 });
      const engine = GundamTestEngine.create({
        hand: [gd05Michaelis030, shaddiq],
        resourceArea: activeResources(4),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd05Michaelis030));
      const michaelisId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(shaddiq, michaelisId));

      expectSuccess(p1.enterBattle(michaelisId, "direct"));
    });

    it("does not let a target grant widen its restricted deployment-turn permission", () => {
      const restedEnemy = createMockUnit({ name: "Rested Enemy" });
      const activeEnemy = createMockUnit({ name: "Active Enemy" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05Michaelis030, gd03BridgeCrew105],
          resourceArea: activeResources(5),
        },
        { play: [{ card: restedEnemy, exhausted: true }, activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [restedEnemyId, activeEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd05Michaelis030));
      const michaelisId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.playCommand(gd03BridgeCrew105, { targets: [michaelisId] }));

      expect(p1.getLegalAttackTargets(michaelisId)).toEqual([restedEnemyId]);
      expectFailure(p1.enterBattle(michaelisId, activeEnemyId!), "INVALID_TARGET");
      expectFailure(p1.enterBattle(michaelisId, "direct"), "INVALID_TARGET");
    });
  });
});
