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
import { st06CloseCombat013 } from "./013-close-combat.ts";

describe("Close Combat (ST03-013-p3 / ST06 reprint)", () => {
  describe("【Burst】Activate this card's 【Main】.", () => {
    it("offers the Shield controller the Main effect and damages exactly one enemy Unit", () => {
      const attacker = createMockUnit({ name: "Attacker", hp: 5 });
      const otherEnemy = createMockUnit({ name: "Other enemy", hp: 5 });
      const friendly = createMockUnit({ name: "Friendly", hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker, otherEnemy] },
        { shieldArea: [st06CloseCombat013], play: [friendly] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, otherEnemyId] = p1.getCardsInZone("battleArea");
      const friendlyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expect(burst).toMatchObject({ controllerId: PLAYER_TWO });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_TWO,
        sourceCardId: burst.sourceCardId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [attackerId, otherEnemyId],
      });
      expectSuccess(p2.resolveEffect({ targets: [otherEnemyId!] }));

      expect(p2.getDamage(attackerId!)).toBe(0);
      expect(p2.getDamage(otherEnemyId!)).toBe(2);
      expect(p2.getDamage(friendlyId)).toBe(0);
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does no damage and trashes the Shield when declined", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ hp: 5 })] },
        { shieldArea: [st06CloseCombat013] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getDamage(attackerId)).toBe(0);
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("destroys an enemy Unit with two remaining HP", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ hp: 2 })] },
        { shieldArea: [st06CloseCombat013] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      expectSuccess(p2.resolveEffect({ targets: [attackerId] }));

      expect(p2.getCardZone(attackerId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });

  describe("【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.", () => {
    it("publishes an exact-one enemy choice, deals two damage, and trashes the Command", () => {
      const first = createMockUnit({ hp: 5 });
      const second = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st06CloseCombat013], resourceArea: activeResources(2) },
        { play: [first, second] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [chosenId, otherId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: commandId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [chosenId, otherId],
      });
      expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));

      expect(p1.getDamage(chosenId!)).toBe(2);
      expect(p1.getDamage(otherId!)).toBe(0);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("can be played in a legally reached Action step", () => {
      const engine = GundamTestEngine.create(
        { hand: [st06CloseCombat013], resourceArea: activeResources(2) },
        { play: [createMockUnit({ hp: 5 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(st06CloseCombat013, { targets: [enemyId] }));

      expect(p1.getDamage(enemyId)).toBe(2);
    });

    it("rejects a friendly Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st06CloseCombat013],
        play: [createMockUnit()],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(
        p1.playCommand(st06CloseCombat013, { targets: [p1.getCardsInZone("battleArea")[0]!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played without an enemy Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st06CloseCombat013],
        resourceArea: activeResources(2),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(st06CloseCombat013),
        "NO_LEGAL_TARGETS",
      );
    });
  });

  it("requires Lv.2 resources", () => {
    const engine = GundamTestEngine.create(
      { hand: [st06CloseCombat013], resourceArea: activeResources(1) },
      { play: [createMockUnit()] },
    );
    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(st06CloseCombat013),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires two active resources", () => {
    const engine = GundamTestEngine.create(
      { hand: [st06CloseCombat013], resourceArea: restedResources(2) },
      { play: [createMockUnit()] },
    );
    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(st06CloseCombat013),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
