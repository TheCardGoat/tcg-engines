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
import { st05Isaribi015 } from "./015-isaribi.ts";

describe("Isaribi (ST05-015)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Shield as the controller's Base when accepted", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05Isaribi015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expect(burst).toMatchObject({ controllerId: PLAYER_TWO });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getVisibleCard(burst.sourceCardId)).toMatchObject({ effectiveHp: 5 });
    });

    it("puts the revealed Shield in trash when declined", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05Isaribi015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("deploys and moves one Shield into hand", () => {
      const shield = createMockUnit({ name: "Shield card" });
      const engine = GundamTestEngine.create({
        hand: [st05Isaribi015],
        shieldArea: [shield],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
      expect(p1.getHand()).toHaveLength(1);
    });

    it("still deploys when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st05Isaribi015],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(0);
    });

    it("requires Lv.3 resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st05Isaribi015],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st05Isaribi015), "INSUFFICIENT_RESOURCE_LEVEL");
    });

    it("requires one active resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st05Isaribi015],
        resourceArea: restedResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st05Isaribi015), "INSUFFICIENT_RESOURCES");
    });
  });

  describe("【Activate･Main】Rest this Base: choose a damaged friendly Unit; it gets AP+2 this turn.", () => {
    it("publishes an exact-one choice of damaged friendly Units and buffs only the chosen Unit", () => {
      const first = createMockUnit({ name: "First damaged", ap: 2, hp: 5 });
      const second = createMockUnit({ name: "Second damaged", ap: 3, hp: 5 });
      const healthy = createMockUnit({ name: "Healthy", ap: 4, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy damaged", ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [st05Isaribi015],
          play: [{ card: first, damage: 1 }, { card: second, damage: 2 }, healthy],
        },
        { play: [{ card: enemy, damage: 1 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const [chosenId, otherDamagedId, healthyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(baseId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: baseId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [chosenId, otherDamagedId],
      });
      expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));

      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.getVisibleCard(chosenId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(otherDamagedId!)).toMatchObject({ effectiveAp: 3 });
      expect(p1.getVisibleCard(healthyId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(enemyId)).toMatchObject({ effectiveAp: 5 });
    });

    it("rejects a healthy friendly Unit", () => {
      const damaged = createMockUnit({ hp: 5 });
      const healthy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create({
        baseSection: [st05Isaribi015],
        play: [{ card: damaged, damage: 1 }, healthy],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const healthyId = p1.getCardsInZone("battleArea")[1]!;

      expectFailure(
        p1.activateBaseAbility(st05Isaribi015, { targets: [healthyId] }),
        "ILLEGAL_TARGET",
      );
    });

    it("rejects a damaged enemy Unit", () => {
      const friendly = createMockUnit({ hp: 5 });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { baseSection: [st05Isaribi015], play: [{ card: friendly, damage: 1 }] },
        { play: [{ card: enemy, damage: 1 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(st05Isaribi015, { targets: [enemyId] }),
        "ILLEGAL_TARGET",
      );
    });

    it("cannot be activated when the Base is already rested", () => {
      const target = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create({
        baseSection: [{ card: st05Isaribi015, exhausted: true }],
        play: [{ card: target, damage: 1 }],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.activateBaseAbility(st05Isaribi015), "CARD_EXHAUSTED");
    });

    it("cannot be activated outside the Main phase", () => {
      const target = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create({
        baseSection: [st05Isaribi015],
        play: [{ card: target, damage: 1 }],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.activateBaseAbility(st05Isaribi015), "WRONG_PHASE");
    });

    it("expires the AP bonus at the end of the turn", () => {
      const target = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        baseSection: [st05Isaribi015],
        play: [{ card: target, damage: 1 }],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(st05Isaribi015, { targets: [targetId] }));
      expect(p1.getVisibleCard(targetId)).toMatchObject({ effectiveAp: 4 });
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(targetId)).toMatchObject({ effectiveAp: 2 });
    });
  });
});
