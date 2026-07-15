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
import { gd04GracefulDemeanor117 } from "./117-graceful-demeanor.ts";
import { gd04PalaSys094 } from "../pilot/094-pala-sys.ts";

describe("Graceful Demeanor (GD04-117)", () => {
  describe("【Burst】Activate this card's 【Action】.", () => {
    function revealBurst() {
      const attacker = createMockUnit({ name: "Enemy Attacker", level: 3, ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [gd04GracefulDemeanor117] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldId = p1.getCardsInZone("shieldArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: shieldId,
        directiveIndex: -1,
      });

      return { p1, p2, shieldId, attackerId };
    }

    it("returns a Lv.3 enemy Unit through the activated Action when accepted", () => {
      const { p1, p2, shieldId, attackerId } = revealBurst();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: shieldId,
      });
      expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

      expect(p2.getHand()).toContain(attackerId);
      expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("leaves the enemy Unit in play when the Burst is declined", () => {
      const { p1, p2, shieldId, attackerId } = revealBurst();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: false } }));

      expect(p2.getCardsInZone("battleArea")).toContain(attackerId);
      expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not offer Burst when the replayed Action has no legal target", () => {
      const highLevelAttacker = createMockUnit({
        name: "Level 4 Attacker",
        level: 4,
        ap: 1,
        hp: 4,
      });
      const engine = GundamTestEngine.create(
        { shieldArea: [gd04GracefulDemeanor117] },
        { play: [highLevelAttacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldId = p1.getCardsInZone("shieldArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(attackerId)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("finishes its replayed Action before an older simultaneous Burst", () => {
      const attacker = createMockUnit({
        name: "Suppression Attacker",
        level: 3,
        ap: 2,
        hp: 5,
        keywordEffects: [{ keyword: "Suppression" }],
      });
      const engine = GundamTestEngine.create(
        { shieldArea: [gd04GracefulDemeanor117, gd04PalaSys094] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [gracefulId, palaId] = p1.getCardsInZone("shieldArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      const ordering = p1.getBoardView().pendingChoice;
      if (ordering?.kind !== "ordering") throw new Error("Expected simultaneous Burst choice");
      const gracefulBurst = ordering.candidates.find(
        (candidate) => candidate.sourceCardId === gracefulId,
      );
      expectSuccess(p1.resolveEffect({ pendingEffectId: gracefulBurst!.effectId }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: gracefulId,
      });

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

      // The Action replay was created during Burst resolution, so it must
      // be completed before the older Pala Sys Burst can be chosen.
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: gracefulId,
        legalTargetIds: expect.arrayContaining([attackerId]),
      });
      expectSuccess(p1.resolveEffect({ targets: [attackerId] }));
      expect(p2.getHand()).toContain(attackerId);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: palaId,
      });
    });
  });

  describe("【Action】Choose 1 to 2 enemy Units that are Lv.3 or lower. Return them to their owners' hands.", () => {
    function setup(canPay = true) {
      const enemyA = createMockUnit({ name: "Level 3 Unit", level: 3 });
      const enemyB = createMockUnit({ name: "Level 2 Unit", level: 2 });
      const enemyHigh = createMockUnit({ name: "Level 4 Unit", level: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04GracefulDemeanor117],
          resourceArea: canPay ? activeResources(4) : restedResources(4),
          deck: 3,
        },
        { play: [enemyA, enemyB, enemyHigh], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [enemyAId, enemyBId, enemyHighId] = p2.getCardsInZone("battleArea");

      return {
        p1,
        p2,
        commandId,
        enemyAId: enemyAId!,
        enemyBId: enemyBId!,
        enemyHighId: enemyHighId!,
      };
    }

    it("returns two chosen Lv.3-or-lower enemy Units through the end-phase Action window", () => {
      const { p1, p2, commandId, enemyAId, enemyBId, enemyHighId } = setup();

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId, { targets: [enemyAId, enemyBId] }));

      expect(p2.getHand()).toEqual(expect.arrayContaining([enemyAId, enemyBId]));
      expect(p2.getCardsInZone("battleArea")).toContain(enemyHighId);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot choose an enemy Unit above Lv.3", () => {
      const { p1, p2, commandId, enemyHighId } = setup();

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());

      expectFailure(p1.playCommand(commandId, { targets: [enemyHighId] }), "INVALID_TARGET");
    });

    it("cannot be played during Main timing", () => {
      const { p1, commandId, enemyAId } = setup();

      expectFailure(p1.playCommand(commandId, { targets: [enemyAId] }), "WRONG_TIMING");
    });

    it("cannot be played without two active Resources for its cost", () => {
      const { p1, p2, commandId, enemyAId } = setup(false);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());

      expectFailure(p1.playCommand(commandId, { targets: [enemyAId] }), "INSUFFICIENT_RESOURCES");
    });
  });
});
