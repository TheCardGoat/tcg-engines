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
import { gd05GundamKyriosFlightMode048 } from "./048-gundam-kyrios-flight-mode.ts";

function deployAgainstRestedEnemy() {
  const enemy = createMockUnit({ name: "Rested Enemy", ap: 0, hp: 6 });
  const engine = GundamTestEngine.create(
    {
      hand: [gd05GundamKyriosFlightMode048],
      resourceArea: activeResources(3),
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
  expectSuccess(p1.deployUnit(gd05GundamKyriosFlightMode048));

  return { p1, p2, enemyId, kyriosId: p1.getCardsInZone("battleArea")[0]! };
}

describe("Gundam Kyrios (Flight Mode) (GD05-048)", () => {
  /** @behavioral-proof complete: deployment-turn permission and every target boundary are public. */
  describe("On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.", () => {
    it("attacks a rested enemy Unit on the turn it is deployed", () => {
      const { p1, enemyId, kyriosId } = deployAgainstRestedEnemy();

      expectSuccess(p1.enterBattle(kyriosId, enemyId));
    });

    it("deals its printed 3 AP as battle damage", () => {
      const { p1, p2, enemyId, kyriosId } = deployAgainstRestedEnemy();

      expectSuccess(p1.enterBattle(kyriosId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(enemyId)).toBe(3);
    });

    it("cannot attack the enemy player on the turn it is deployed", () => {
      const { p1, kyriosId } = deployAgainstRestedEnemy();

      expectFailure(p1.enterBattle(kyriosId, "direct"), "INVALID_TARGET");
      expect(p1.isExhausted(kyriosId)).toBe(false);
    });

    it("cannot choose an active enemy Unit on the turn it is deployed", () => {
      const enemy = createMockUnit({ name: "Active Enemy" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05GundamKyriosFlightMode048],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05GundamKyriosFlightMode048));
      const kyriosId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(kyriosId, enemyId), "INVALID_TARGET");
      expect(p1.isExhausted(kyriosId)).toBe(false);
    });
  });
});
