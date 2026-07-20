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
import { st04HawkOfEndymion013 } from "./013-hawk-of-endymion.ts";

describe("Hawk of Endymion (ST04-013)", () => {
  describe("【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.", () => {
    it("asks for exactly one eligible enemy Unit, returns only the choice, and moves to trash", () => {
      const firstEnemy = createMockUnit({ name: "First Enemy", hp: 3 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", hp: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(2) },
        { play: [firstEnemy, secondEnemy] },
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

      expect(p2.getCardZone(firstEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getCardZone(secondEnemyId!)).toBe(`hand:${PLAYER_TWO}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("includes an enemy Unit with exactly 3 HP", () => {
      const enemy = createMockUnit({ name: "Boundary Enemy", hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st04HawkOfEndymion013, { targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("can be played in a legally reached Action step", () => {
      const enemy = createMockUnit({ name: "Enemy", hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(st04HawkOfEndymion013, { targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("rejects an enemy Unit with more than 3 HP", () => {
      const eligible = createMockUnit({ name: "Eligible", hp: 3 });
      const tooLarge = createMockUnit({ name: "Too Large", hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(2) },
        { play: [eligible, tooLarge] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, tooLargeId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st04HawkOfEndymion013, { targets: [tooLargeId!] }),
        "INVALID_TARGET",
      );

      expect(p2.getCardZone(tooLargeId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p1.getCardZone(st04HawkOfEndymion013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rejects a friendly Unit even when it has 3 or less HP", () => {
      const friendly = createMockUnit({ name: "Friendly", hp: 3 });
      const enemy = createMockUnit({ name: "Enemy", hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04HawkOfEndymion013],
          play: [friendly],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st04HawkOfEndymion013, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );

      expect(p1.getCardZone(friendlyId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("cannot be played when no eligible enemy Unit exists", () => {
      const tooLarge = createMockUnit({ name: "Too Large", hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(2) },
        { play: [tooLarge] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st04HawkOfEndymion013), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st04HawkOfEndymion013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played during the Block Step before an Action step begins", () => {
      const attacker = createMockUnit({ name: "Attacker", hp: 5 });
      const eligible = createMockUnit({ name: "Eligible", hp: 3 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          hand: [st04HawkOfEndymion013],
          play: [eligible],
          resourceArea: activeResources(2),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(
        p2.playCommand(st04HawkOfEndymion013, { targets: [attackerId] }),
        "WRONG_PHASE",
      );

      expect(p2.getCardZone(st04HawkOfEndymion013)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("cannot be played below its printed Lv.2 requirement", () => {
      const enemy = createMockUnit({ name: "Enemy", hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(1) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st04HawkOfEndymion013), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st04HawkOfEndymion013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const enemy = createMockUnit({ name: "Enemy", hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: restedResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st04HawkOfEndymion013), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st04HawkOfEndymion013)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Pilot】[Mu La Flaga]", () => {
    it("can be paired as Mu La Flaga and grants AP+1/HP+0 instead of resolving the Command", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const enemy = createMockUnit({ name: "Enemy", hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04HawkOfEndymion013],
          play: [host],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
      expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
    });
  });
});
