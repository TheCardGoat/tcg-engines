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
import { st04AegisGundam006 } from "./006-aegis-gundam.ts";

describe("Aegis Gundam (ST04-006)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("deploys from hand to the battle area and rests exactly 3 Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AegisGundam006],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const aegisId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(aegisId));

      expect(p1.getCardZone(aegisId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    });

    it("stays in hand below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AegisGundam006],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const aegisId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(aegisId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(aegisId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("stays in hand when a legal deployment leaves only 2 active Resources", () => {
      const spender = createMockUnit({ name: "Resource Spender", level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, st04AegisGundam006],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [spenderId, aegisId] = p1.getHand();

      expectSuccess(p1.deployUnit(spenderId!));
      expectFailure(p1.deployUnit(aegisId!), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(aegisId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AegisGundam006],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getHand()[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(aegisId), "WRONG_PHASE");

      expect(p1.getCardZone(aegisId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("Link Condition: [Athrun Zala]", () => {
    it("can attack on its deploy turn after Athrun Zala is paired", () => {
      const athrun = createMockPilot({ name: "Athrun Zala", level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AegisGundam006, athrun],
          resourceArea: activeResources(4),
        },
        { shieldArea: [createMockUnit({ name: "Shield" })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st04AegisGundam006));
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(athrun, aegisId));
      expectSuccess(p1.enterBattle(aegisId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: aegisId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const otherPilot = createMockPilot({ name: "Kira Yamato", level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AegisGundam006, otherPilot],
          resourceArea: activeResources(4),
        },
        { shieldArea: [createMockUnit({ name: "Shield" })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st04AegisGundam006));
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(otherPilot, aegisId));
      expectFailure(p1.enterBattle(aegisId, "direct"), "CANNOT_ATTACK");

      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【Attack】If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.", () => {
    it("offers only opposing Lv.5-or-higher Units when Aegis has exactly 5 AP", () => {
      const pilot = createMockPilot({ name: "AP Pilot", level: 1, cost: 1, apBonus: 1 });
      const friendlyLevelFive = createMockUnit({ name: "Friendly Lv.5", level: 5, hp: 6 });
      const enemyLevelFour = createMockUnit({ name: "Enemy Lv.4", level: 4, hp: 6 });
      const enemyLevelFive = createMockUnit({ name: "Enemy Lv.5", level: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AegisGundam006, friendlyLevelFive],
          resourceArea: activeResources(1),
        },
        {
          play: [
            { card: enemyLevelFour, exhausted: true },
            { card: enemyLevelFive, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [aegisId, friendlyId] = p1.getCardsInZone("battleArea");
      const [levelFourId, levelFiveId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, aegisId!));
      expect(p1.getVisibleCard(aegisId!)?.effectiveAp).toBe(5);
      expectSuccess(p1.enterBattle(aegisId!, levelFourId!));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: aegisId,
        legalTargetIds: [levelFiveId],
        minTargets: 1,
        maxTargets: 1,
      });
      expect(p1.getBoardView().pendingChoice).not.toMatchObject({
        legalTargetIds: expect.arrayContaining([friendlyId]),
      });
    });

    it("deals exactly 3 effect damage to the chosen Lv.5 enemy Unit", () => {
      const pilot = createMockPilot({ name: "AP Pilot", level: 1, cost: 1, apBonus: 1 });
      const enemy = createMockUnit({ name: "Enemy Lv.5", level: 5, ap: 0, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AegisGundam006],
          resourceArea: activeResources(1),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, aegisId));
      expectSuccess(p1.enterBattle(aegisId, enemyId));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(3);
      expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("rejects a Lv.4 Unit submitted outside the visible target filter", () => {
      const pilot = createMockPilot({ name: "AP Pilot", level: 1, cost: 1, apBonus: 1 });
      const enemyLevelFour = createMockUnit({ name: "Enemy Lv.4", level: 4, hp: 6 });
      const enemyLevelFive = createMockUnit({ name: "Enemy Lv.5", level: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AegisGundam006],
          resourceArea: activeResources(1),
        },
        {
          play: [
            { card: enemyLevelFour, exhausted: true },
            { card: enemyLevelFive, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const [levelFourId, levelFiveId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, aegisId));
      expectSuccess(p1.enterBattle(aegisId, levelFourId!));
      expectFailure(p1.resolveEffect({ targets: [levelFourId!] }), "ILLEGAL_TARGET");

      expect(p1.getBoardView().pendingChoice).toMatchObject({ legalTargetIds: [levelFiveId] });
      expect(p2.getDamage(levelFourId!)).toBe(0);
    });

    it("does not activate when Aegis has only its printed 4 AP", () => {
      const enemy = createMockUnit({ name: "Enemy Lv.5", level: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [st04AegisGundam006] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(aegisId, enemyId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("resolves without a prompt when no opposing Unit is Lv.5 or higher", () => {
      const pilot = createMockPilot({ name: "AP Pilot", level: 1, cost: 1, apBonus: 1 });
      const enemy = createMockUnit({ name: "Enemy Lv.4", level: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AegisGundam006],
          resourceArea: activeResources(1),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, aegisId));
      expectSuccess(p1.enterBattle(aegisId, enemyId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });
  });
});
