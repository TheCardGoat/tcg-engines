import { describe, it, expect } from "vite-plus/test";
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
import { st08HathawayNoa010 } from "./010-hathaway-noa.ts";

describe("Hathaway Noa (ST08-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds this card to hand when its shield is destroyed", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st08HathawayNoa010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getHand()).toContain(burst.sourceCardId);
    });

    it("puts the revealed Shield in trash when Burst is declined", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit()] },
        { shieldArea: [st08HathawayNoa010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【When Paired】If this is a (Mafty) Unit, choose 1 of your (Mafty) Units. During this turn, it may choose a damaged active enemy Unit as its attack target.", () => {
    it("lets a friendly Mafty Unit attack a damaged active enemy Unit this turn", () => {
      const host = createMockUnit({ traits: ["mafty"], linkCondition: "[Hathaway Noa]" });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, damage: 1 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [hostId],
      });
      expectSuccess(p1.resolveEffect({ targets: [hostId] }));
      expect(p1.getLegalAttackTargets(hostId)).toContain(enemyId);
      expectSuccess(p1.enterBattle(hostId, enemyId));
    });

    it("does not include an undamaged active enemy Unit in the granted target filter", () => {
      const host = createMockUnit({ traits: ["mafty"], linkCondition: "[Hathaway Noa]" });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [hostId],
      });
      expectSuccess(p1.resolveEffect({ targets: [hostId] }));
      expect(p1.getLegalAttackTargets(hostId)).not.toContain(enemyId);
      expectFailure(p1.enterBattle(hostId, enemyId), "INVALID_TARGET");
    });

    it("does not grant the option when Hathaway is paired to a non-Mafty Unit", () => {
      const host = createMockUnit({
        traits: ["earth federation"],
        linkCondition: "[Hathaway Noa]",
      });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, damage: 1 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getLegalAttackTargets(hostId)).not.toContain(enemyId);
    });

    it("publishes an exact-one controller/source choice of friendly Mafty Units", () => {
      const host = createMockUnit({ traits: ["mafty"] });
      const ally = createMockUnit({ traits: ["mafty"] });
      const nonMafty = createMockUnit({ traits: ["earth federation"] });
      const engine = GundamTestEngine.create({
        hand: [st08HathawayNoa010],
        play: [host, ally, nonMafty],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const pilotId = p1.getHand()[0]!;
      const [hostId, allyId] = p1.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(pilotId, hostId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: pilotId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [hostId, allyId],
      });
    });

    it("grants the permission only to the chosen Mafty Unit", () => {
      const host = createMockUnit({ traits: ["mafty"] });
      const ally = createMockUnit({ traits: ["mafty"] });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08HathawayNoa010], play: [host, ally], resourceArea: activeResources(4) },
        { play: [{ card: enemy, damage: 1 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, allyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId!));
      expectSuccess(p1.resolveEffect({ targets: [allyId!] }));
      expect(p1.getLegalAttackTargets(hostId!)).not.toContain(enemyId);
      expect(p1.getLegalAttackTargets(allyId!)).toContain(enemyId);
    });
  });

  it("pairs for Lv.4/cost1 and grants +2 AP/+1 HP", () => {
    const engine = GundamTestEngine.create({
      hand: [st08HathawayNoa010],
      play: [createMockUnit({ ap: 2, hp: 3 })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st08HathawayNoa010, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
  });

  it("requires Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [st08HathawayNoa010],
      play: [createMockUnit()],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(
      p1.assignPilot(st08HathawayNoa010, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires one active resource", () => {
    const engine = GundamTestEngine.create({
      hand: [st08HathawayNoa010],
      play: [createMockUnit()],
      resourceArea: restedResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(
      p1.assignPilot(st08HathawayNoa010, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
