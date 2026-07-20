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
import { st03Rewloola015 } from "./015-rewloola.ts";

describe("Rewloola (ST03-015)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Base for free and resolves its Deploy ability", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const otherShield = createMockUnit({ name: "Other Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03Rewloola015, otherShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Rewloola's Burst choice");
      const baseId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const target = p2.getBoardView().pendingChoice;
      if (target?.kind !== "targetSelection") {
        throw new Error("Expected Rewloola's Deploy target choice");
      }
      expect(target.legalTargetIds).toEqual([attackerId]);
      expectSuccess(p2.resolveEffect({ targets: [attackerId] }));

      expect(p2.getCardZone(baseId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(0);
      expect(p2.getHand()).toHaveLength(1);
      expect(p1.getDamage(attackerId)).toBe(1);
    });

    it("moves the revealed Base to trash when its owner declines Burst", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03Rewloola015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Rewloola's Burst choice");
      const baseId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(baseId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.", () => {
    it("adds exactly one Shield to hand, damages an enemy with exactly 5 AP, and occupies the Base section", () => {
      const shield = createMockUnit({ name: "Returned Shield" });
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03Rewloola015],
          shieldArea: [shield],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const handCountBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(baseId, { targets: [enemyId] }));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(handCountBefore);
      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(0);
      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("publishes only enemy Units with 5 or less AP as exact-one targets", () => {
      const friendly = createMockUnit({ ap: 4 });
      const eligible = createMockUnit({ name: "Eligible", ap: 5 });
      const tooStrong = createMockUnit({ name: "Too Strong", ap: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03Rewloola015],
          play: [friendly],
          shieldArea: [createMockUnit({ name: "Shield" })],
          resourceArea: activeResources(3),
        },
        { play: [eligible, tooStrong] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const eligibleId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployBase(st03Rewloola015));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected an eligible enemy choice");
      expect(choice.legalTargetIds).toEqual([eligibleId]);
      expect(choice.minTargets).toBe(1);
      expect(choice.maxTargets).toBe(1);
    });

    it("rejects an enemy Unit with more than 5 AP", () => {
      const eligible = createMockUnit({ ap: 5 });
      const tooStrong = createMockUnit({ ap: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03Rewloola015],
          shieldArea: [createMockUnit({ name: "Shield" })],
          resourceArea: activeResources(3),
        },
        { play: [eligible, tooStrong] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const tooStrongId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[1]!;

      expectFailure(p1.deployBase(st03Rewloola015, { targets: [tooStrongId] }), "INVALID_TARGET");
      expect(p1.getCardZone(st03Rewloola015)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rejects a friendly Unit target", () => {
      const friendly = createMockUnit({ ap: 4 });
      const enemy = createMockUnit({ ap: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03Rewloola015],
          play: [friendly],
          shieldArea: [createMockUnit({ name: "Shield" })],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.deployBase(st03Rewloola015, { targets: [friendlyId] }), "INVALID_TARGET");
      expect(p1.getCardZone(st03Rewloola015)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("still deals damage when there is no Shield to add to hand", () => {
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st03Rewloola015], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployBase(st03Rewloola015, { targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(1);
      expect(p1.getCardZone(st03Rewloola015)).toBe(`baseSection:${PLAYER_ONE}`);
    });

    it("deploys without activating the Deploy effect when no enemy Unit qualifies", () => {
      const shield = createMockUnit({ name: "Returned Shield" });
      const tooStrong = createMockUnit({ ap: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03Rewloola015],
          shieldArea: [shield],
          resourceArea: activeResources(3),
        },
        { play: [tooStrong] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployBase(st03Rewloola015));

      expect(p1.getCardZone(st03Rewloola015)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(1);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("cannot be deployed below its printed Lv.3 requirement", () => {
      const enemy = createMockUnit({ ap: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st03Rewloola015], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st03Rewloola015), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st03Rewloola015)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without two active Resources", () => {
      const enemy = createMockUnit({ ap: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st03Rewloola015], resourceArea: restedResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st03Rewloola015), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03Rewloola015)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed by the standby player during the opponent's Main Phase", () => {
      const enemy = createMockUnit({ ap: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st03Rewloola015], resourceArea: activeResources(3) },
        { play: [enemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st03Rewloola015), "NOT_ACTIVE_PLAYER");
      expect(p1.getCardZone(st03Rewloola015)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
