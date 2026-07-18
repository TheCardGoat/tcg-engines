import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02ForbiddenGundam006 } from "./006-forbidden-gundam.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02OrgaCrotAndShani087 } from "../pilot/087-orga-crot-and-shani.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Forbidden Gundam (GD02-006)", () => {
  describe("Printed Lv.5 and cost 3", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02ForbiddenGundam006],
        resourceArea: activeResources(4),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02ForbiddenGundam006],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: (Biological CPU) Trait", () => {
    it("can attack on its deploy turn after a Biological CPU Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02ForbiddenGundam006, gd02OrgaCrotAndShani087],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02ForbiddenGundam006));
      const forbiddenId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02OrgaCrotAndShani087, forbiddenId));
      expectSuccess(p1.enterBattle(forbiddenId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: forbiddenId });
    });

    it("cannot attack on its deploy turn after a non-Biological CPU Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02ForbiddenGundam006, gd02JeridMessa086],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02ForbiddenGundam006));
      const forbiddenId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, forbiddenId));

      expectFailure(p1.enterBattle(forbiddenId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  it("prevents battle damage from a Lv.2 enemy Unit during its controller's turn", () => {
    const lowLevelEnemy = createMockUnit({ level: 2, ap: 3, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd02ForbiddenGundam006], shieldArea: [createMockUnit()], deck: 5 },
      { play: [lowLevelEnemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const forbiddenId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    resolveUnitBattle(engine, PLAYER_ONE, forbiddenId, enemyId);

    expect(p1.getDamage(forbiddenId)).toBe(0);
    expect(p2.getDamage(enemyId)).toBe(4);
  });

  it("receives battle damage from a Lv.3 enemy Unit", () => {
    const highLevelEnemy = createMockUnit({ level: 3, ap: 3, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd02ForbiddenGundam006], shieldArea: [createMockUnit()], deck: 5 },
      { play: [highLevelEnemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const forbiddenId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    resolveUnitBattle(engine, PLAYER_ONE, forbiddenId, enemyId);

    expect(p1.getDamage(forbiddenId)).toBe(3);
  });

  it("uses <Blocker> to intercept an attack on its controller", () => {
    const attacker = createMockUnit({ ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        play: [gd02ForbiddenGundam006],
        deck: 5,
      },
      {
        play: [attacker],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const forbiddenId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.declareBlock(forbiddenId));
    expect(p1.isExhausted(forbiddenId)).toBe(true);
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(forbiddenId)).toBe(2);
  });
});
