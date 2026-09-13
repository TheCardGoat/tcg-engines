import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05GundamExiaRepair050 } from "./050-gundam-exia-repair.ts";

describe("Gundam Exia Repair (GD05-050)", () => {
  describe("When this Unit deals battle damage to an enemy Unit that is Lv.4 or lower that has no paired Pilot, destroy that enemy Unit.", () => {
    it("destroys an unpaired Lv.4 enemy after dealing it battle damage", () => {
      const enemy = createMockUnit({ level: 4, ap: 0, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [gd05GundamExiaRepair050] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sourceId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does not destroy an enemy Unit above Lv.4", () => {
      const enemy = createMockUnit({ level: 5, ap: 0, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [gd05GundamExiaRepair050] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sourceId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getDamage(enemyId)).toBe(2);
    });
  });

  it("【Destroyed】 mills exactly the top two cards of its controller's deck", () => {
    const attacker = createMockUnit({ level: 5, ap: 10, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        play: [gd05GundamExiaRepair050],
        deck: [createMockUnit(), createMockUnit(), createMockUnit()],
        shieldArea: [createMockUnit()],
      },
      { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [sourceId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expectSuccess(p2.enterBattle(attackerId, sourceId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(sourceId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    expect(p1.getCardsInZone("trash")).toHaveLength(3);
  });
});
