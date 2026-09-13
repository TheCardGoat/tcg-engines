import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05GundamDeathscytheHellEw078 } from "./078-gundam-deathscythe-hell-ew.ts";

function deployAgainstRestedEnemy() {
  const enemy = createMockUnit({ name: "Rested Enemy", ap: 0, hp: 8 });
  const engine = GundamTestEngine.create(
    {
      hand: [gd05GundamDeathscytheHellEw078],
      resourceArea: activeResources(5),
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
  expectSuccess(p1.deployUnit(gd05GundamDeathscytheHellEw078));

  return { p1, p2, enemyId, deathscytheId: p1.getCardsInZone("battleArea")[0]! };
}

describe("Gundam Deathscythe Hell (EW) (GD05-078)", () => {
  /** @behavioral-proof complete: deployment-turn permission and every target boundary are public. */
  describe("On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.", () => {
    it("attacks a rested enemy Unit on the turn it is deployed", () => {
      const { p1, enemyId, deathscytheId } = deployAgainstRestedEnemy();

      expectSuccess(p1.enterBattle(deathscytheId, enemyId));
    });

    it("deals its printed 5 AP as battle damage", () => {
      const { p1, p2, enemyId, deathscytheId } = deployAgainstRestedEnemy();

      expectSuccess(p1.enterBattle(deathscytheId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(enemyId)).toBe(5);
    });

    it("cannot attack the enemy player on the turn it is deployed", () => {
      const { p1, deathscytheId } = deployAgainstRestedEnemy();

      expectFailure(p1.enterBattle(deathscytheId, "direct"), "INVALID_TARGET");
      expect(p1.isExhausted(deathscytheId)).toBe(false);
    });

    it("cannot choose an active enemy Unit on the turn it is deployed", () => {
      const enemy = createMockUnit({ name: "Active Enemy" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05GundamDeathscytheHellEw078],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05GundamDeathscytheHellEw078));
      const deathscytheId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(deathscytheId, enemyId), "INVALID_TARGET");
      expect(p1.isExhausted(deathscytheId)).toBe(false);
    });
  });
});
