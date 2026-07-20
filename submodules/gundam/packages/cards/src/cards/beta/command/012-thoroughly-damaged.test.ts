import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { betaThoroughlyDamaged012 } from "./012-thoroughly-damaged.ts";

describe("Thoroughly Damaged (ST01-012)", () => {
  describe("【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.", () => {
    it("asks which rested enemy Unit takes 1 damage and moves the resolved Command to trash", () => {
      const firstEnemy = createMockUnit({ name: "First Enemy", hp: 4 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaThoroughlyDamaged012],
          resourceArea: activeResources(2),
        },
        {
          play: [
            { card: firstEnemy, exhausted: true },
            { card: secondEnemy, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

      expect(p2.getDamage(firstEnemyId!)).toBe(0);
      expect(p2.getDamage(secondEnemyId!)).toBe(1);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("destroys a rested enemy Unit whose remaining HP is 1", () => {
      const enemy = createMockUnit({ name: "Fragile Enemy", hp: 1 });
      const engine = GundamTestEngine.create(
        { hand: [betaThoroughlyDamaged012], resourceArea: activeResources(2) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rejects an active enemy Unit", () => {
      const enemy = createMockUnit({ name: "Active Enemy", hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [betaThoroughlyDamaged012], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(betaThoroughlyDamaged012, { targets: [enemyId] }),
        "INVALID_TARGET",
      );

      expect(p2.getDamage(enemyId)).toBe(0);
      expect(p1.getCardZone(betaThoroughlyDamaged012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rejects a rested friendly Unit", () => {
      const friendly = createMockUnit({ name: "Friendly Unit", hp: 4 });
      const enemy = createMockUnit({ name: "Enemy Unit", hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaThoroughlyDamaged012],
          play: [{ card: friendly, exhausted: true }],
          resourceArea: activeResources(2),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(betaThoroughlyDamaged012, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );

      expect(p1.getDamage(friendlyId)).toBe(0);
    });

    it("cannot be played when no rested enemy Unit can be chosen", () => {
      const activeEnemy = createMockUnit({ name: "Active Enemy", hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [betaThoroughlyDamaged012], resourceArea: activeResources(2) },
        { play: [activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(betaThoroughlyDamaged012), "NO_LEGAL_TARGETS");

      expect(p1.getCardZone(betaThoroughlyDamaged012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played during a legally reached Action step", () => {
      const enemy = createMockUnit({ name: "Enemy", hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [betaThoroughlyDamaged012], resourceArea: activeResources(2) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.playCommand(betaThoroughlyDamaged012), "WRONG_TIMING");

      expect(p1.getCardZone(betaThoroughlyDamaged012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.2 requirement", () => {
      const enemy = createMockUnit({ name: "Enemy", hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [betaThoroughlyDamaged012], resourceArea: activeResources(1) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(betaThoroughlyDamaged012), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(betaThoroughlyDamaged012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const enemy = createMockUnit({ name: "Enemy", hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [betaThoroughlyDamaged012], resourceArea: restedResources(2) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(betaThoroughlyDamaged012), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(betaThoroughlyDamaged012)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Pilot】[Hayato Kobayashi]", () => {
    it("can be played as Hayato Kobayashi and grants AP+0/HP+1 to the paired Unit", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [betaThoroughlyDamaged012],
        play: [host],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
    });
  });
});
