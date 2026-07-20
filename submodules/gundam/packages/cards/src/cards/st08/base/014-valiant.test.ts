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
import { st08Valiant014 } from "./014-valiant.ts";

describe("Valiant (ST08-014)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("flips Valiant from shieldArea into baseSection", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st08Valiant014] },
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

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
    });

    it("puts Valiant in trash when Burst is declined", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit()] },
        { shieldArea: [st08Valiant014] },
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

  describe("【Deploy】Add 1 of your Shields to your hand. Then, choose 1 of your Units. It gets AP+2 during this turn.", () => {
    it("moves a shield to hand and grants AP+2 to the chosen friendly Unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08Valiant014],
          play: [unit],
          resourceArea: activeResources(2),
          shieldArea: [createMockUnit({ name: "Shield" })],
          deck: 4,
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st08Valiant014));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(p1.getHand()).toHaveLength(handBefore);
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(4);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });

    it("publishes an exact-one controller/source choice of all friendly Units", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Valiant014],
        play: [createMockUnit(), createMockUnit()],
        shieldArea: [createMockUnit()],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      const units = p1.getCardsInZone("battleArea");
      expectSuccess(p1.deployBase(baseId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: baseId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: units,
      });
    });

    it("still buffs a Unit when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Valiant014],
        play: [createMockUnit({ ap: 2 })],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.deployBase(st08Valiant014, { targets: [unitId] }));
      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getHand()).toHaveLength(0);
    });

    it("still deploys when there is no Unit to buff", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Valiant014],
        shieldArea: [createMockUnit()],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployBase(st08Valiant014));
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("rejects an enemy Unit target", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08Valiant014],
          play: [createMockUnit({ name: "Friendly", ap: 2, hp: 5 })],
          resourceArea: activeResources(2),
          shieldArea: [createMockUnit({ name: "Shield" })],
          deck: 2,
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployBase(st08Valiant014));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "targetSelection" });
      if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
      expect(choice.legalTargetIds).not.toContain(enemyId);
      expectFailure(p1.resolveEffect({ targets: [enemyId] }), "ILLEGAL_TARGET");
    });

    it("expires the AP+2 at the end of the turn", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st08Valiant014],
          play: [createMockUnit({ ap: 2 })],
          resourceArea: activeResources(2),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.deployBase(st08Valiant014, { targets: [unitId] }));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2 });
    });
  });

  it("deploys with printed 5 HP for Lv.2/cost1", () => {
    const engine = GundamTestEngine.create({
      hand: [st08Valiant014],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployBase(st08Valiant014));
    expect(p1.getVisibleCard(p1.getCardsInZone("baseSection")[0]!)).toMatchObject({
      effectiveHp: 5,
    });
  });

  it("requires Lv.2 and one active resource", () => {
    const low = GundamTestEngine.create({
      hand: [st08Valiant014],
      resourceArea: activeResources(1),
    });
    expectFailure(
      low.asPlayer(PLAYER_ONE).deployBase(st08Valiant014),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    const rested = GundamTestEngine.create({
      hand: [st08Valiant014],
      resourceArea: restedResources(2),
    });
    expectFailure(rested.asPlayer(PLAYER_ONE).deployBase(st08Valiant014), "INSUFFICIENT_RESOURCES");
  });
});
