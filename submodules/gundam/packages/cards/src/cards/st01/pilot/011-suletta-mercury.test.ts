import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st02Tallgeese006 } from "../../st02/unit/006-tallgeese.ts";
import { st01SulettaMercury011 } from "./011-suletta-mercury.ts";

describe("Suletta Mercury (ST01-011)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Suletta Mercury to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st01SulettaMercury011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        directiveIndex: -1,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      const sulettaId = p2.getHand()[0]!;
      expect(p2.getCardZone(sulettaId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });

    it("puts Suletta Mercury into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st01SulettaMercury011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

      expect(p2.getHand()).toHaveLength(0);
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(1);
    });
  });

  describe("【Attack】【Once per Turn】Choose 1 of your Resources. Set it as active.", () => {
    // A paired Lv.4/cost-1 Pilot necessarily leaves at least one friendly Resource in play,
    // so this ability has no reachable no-legal-target branch.
    it("offers friendly Resources and sets the chosen rested Resource active", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st01SulettaMercury011],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const sulettaId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(sulettaId, hostId));
      const restedResourceId = p1.getCardsInZone("resourceArea").find((id) => p1.isExhausted(id));
      if (!restedResourceId) throw new Error("Expected Pilot payment to rest one Resource");

      expectSuccess(p1.enterBattle(hostId, enemyId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: sulettaId,
        legalTargetIds: expect.arrayContaining(p1.getCardsInZone("resourceArea")),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [restedResourceId] }));

      expect(p1.isExhausted(restedResourceId)).toBe(false);
    });

    it("cannot choose an opponent's Resource", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy", ap: 0, hp: 8 });
      const enemyResource = createMockResource({ name: "Enemy Resource" });
      const engine = GundamTestEngine.create(
        {
          hand: [st01SulettaMercury011],
          play: [host],
          resourceArea: activeResources(4),
        },
        {
          play: [{ card: enemy, exhausted: true }],
          resourceArea: [{ card: enemyResource, exhausted: true }],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const enemyResourceId = p2.getCardsInZone("resourceArea")[0]!;

      expectSuccess(p1.assignPilot(st01SulettaMercury011, hostId));
      expectSuccess(p1.enterBattle(hostId, enemyId));
      expectFailure(p1.resolveEffect({ targets: [enemyResourceId] }), "ILLEGAL_TARGET");

      expect(p2.isExhausted(enemyResourceId)).toBe(true);
    });

    it("may choose a Resource that is already active", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st01SulettaMercury011],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st01SulettaMercury011, hostId));
      const activeResourceId = p1.getCardsInZone("resourceArea").find((id) => !p1.isExhausted(id));
      if (!activeResourceId) throw new Error("Expected an active Resource");

      expectSuccess(p1.enterBattle(hostId, enemyId));
      expectSuccess(p1.resolveEffect({ targets: [activeResourceId] }));

      expect(p1.isExhausted(activeResourceId)).toBe(false);
    });

    it("does not activate more than once in the same turn", () => {
      const firstEnemy = createMockUnit({ name: "First Enemy", ap: 0, hp: 20 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", ap: 0, hp: 20 });
      const engine = GundamTestEngine.create(
        {
          hand: [st01SulettaMercury011],
          play: [st02Tallgeese006],
          resourceArea: activeResources(8),
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
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st01SulettaMercury011, tallgeeseId));
      const paidResourceId = p1.getCardsInZone("resourceArea").find((id) => p1.isExhausted(id));
      if (!paidResourceId) throw new Error("Expected Pilot payment to rest one Resource");

      expectSuccess(p1.enterBattle(tallgeeseId, firstEnemyId!));
      expectSuccess(p1.resolveEffect({ targets: [paidResourceId] }));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.activateAbility(tallgeeseId, 0));
      expectSuccess(p1.enterBattle(tallgeeseId, secondEnemyId!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
    });
  });

  describe("pairing Suletta Mercury", () => {
    it("pays 1 Resource, pairs beneath the Unit, and grants AP+1/HP+2", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st01SulettaMercury011],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const sulettaId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(sulettaId, hostId));

      expect(p1.getPilotId(hostId)).toBe(sulettaId);
      expect(p1.getCardZone(sulettaId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 5 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("cannot pair Suletta below her printed Lv.4 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st01SulettaMercury011],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st01SulettaMercury011, hostId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st01SulettaMercury011)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay Suletta's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st01SulettaMercury011],
        play: [host],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st01SulettaMercury011, hostId), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st01SulettaMercury011)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pair Suletta during a legally reached Action step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st01SulettaMercury011],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.assignPilot(st01SulettaMercury011, hostId), "WRONG_PHASE");

      expect(p1.getCardZone(st01SulettaMercury011)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
