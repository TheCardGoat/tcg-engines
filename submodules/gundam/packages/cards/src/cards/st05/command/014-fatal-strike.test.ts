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
import { st05FatalStrike014 } from "./014-fatal-strike.ts";

describe("Fatal Strike (ST05-014)", () => {
  describe("【Burst】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("asks the Shield controller to damage exactly one enemy Unit", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const otherEnemy = createMockUnit({ name: "Other enemy", hp: 5 });
      const friendly = createMockUnit({ name: "Friendly", hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker, otherEnemy] },
        { shieldArea: [st05FatalStrike014], play: [friendly] },
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
      expect(p2.getDamage(otherEnemyId!)).toBe(1);
      expect(p2.getDamage(friendlyId)).toBe(0);
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does no damage and trashes the Shield when declined", () => {
      const attacker = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05FatalStrike014] },
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

    it("destroys an enemy Unit whose remaining HP is one", () => {
      const attacker = createMockUnit({ hp: 1 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05FatalStrike014] },
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

  describe("【Main】Choose 1 enemy Unit that is Lv.3 or lower. Destroy it.", () => {
    it("destroys exactly one enemy Unit at the Lv.3 boundary", () => {
      const levelThree = createMockUnit({ name: "Lv3", level: 3 });
      const otherLevelThree = createMockUnit({ name: "Other Lv3", level: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st05FatalStrike014], resourceArea: activeResources(4) },
        { play: [levelThree, otherLevelThree] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [chosenId, otherId] = p2.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;

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

      expect(p1.getCardZone(chosenId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(otherId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rejects an enemy Unit above Lv.3", () => {
      const engine = GundamTestEngine.create(
        { hand: [st05FatalStrike014], resourceArea: activeResources(4) },
        { play: [createMockUnit({ level: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(st05FatalStrike014, { targets: [enemyId] }), "INVALID_TARGET");
    });

    it("rejects a friendly Lv.3 Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st05FatalStrike014],
        play: [createMockUnit({ level: 3 })],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st05FatalStrike014, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played without a legal enemy Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st05FatalStrike014],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st05FatalStrike014), "NO_LEGAL_TARGETS");
    });

    it("cannot be played during an Action step", () => {
      const engine = GundamTestEngine.create(
        { hand: [st05FatalStrike014], resourceArea: activeResources(4) },
        { play: [createMockUnit({ level: 3 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.playCommand(st05FatalStrike014), "WRONG_TIMING");
    });
  });

  it("requires Lv.4 resources", () => {
    const engine = GundamTestEngine.create(
      { hand: [st05FatalStrike014], resourceArea: activeResources(3) },
      { play: [createMockUnit({ level: 3 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(st05FatalStrike014), "INSUFFICIENT_RESOURCE_LEVEL");
  });

  it("requires two active resources", () => {
    const engine = GundamTestEngine.create(
      { hand: [st05FatalStrike014], resourceArea: restedResources(4) },
      { play: [createMockUnit({ level: 3 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(st05FatalStrike014), "INSUFFICIENT_RESOURCES");
  });
});
