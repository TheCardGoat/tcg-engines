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
import { gd04Backup115 } from "./115-backup.ts";

describe("Backup (GD04-115)", () => {
  describe("【Burst】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    function revealBurst() {
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [gd04Backup115] },
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

    it("deals 1 damage to the chosen enemy Unit when accepted", () => {
      const { p1, p2, shieldId, attackerId } = revealBurst();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: shieldId,
        directiveIndex: 0,
      });
      expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

      expect(p2.getDamage(attackerId)).toBe(1);
      expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not damage the enemy Unit when the Burst is declined", () => {
      const { p1, p2, shieldId, attackerId } = revealBurst();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: false } }));

      expect(p2.getDamage(attackerId)).toBe(0);
      expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });

  describe("【Main】Choose 1 of your Units. When it deals battle damage to an enemy Unit that is Lv.5 or lower during this turn, destroy that enemy Unit.", () => {
    function setup({ enemyLevel = 5, canPay = true } = {}) {
      const chosen = createMockUnit({ name: "Chosen Attacker", ap: 3, hp: 6 });
      const otherFriendly = createMockUnit({ name: "Other Friendly", ap: 3, hp: 6 });
      const enemy = createMockUnit({ name: "Enemy Target", level: enemyLevel, ap: 0, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04Backup115],
          play: [chosen, otherFriendly],
          resourceArea: canPay ? activeResources(3) : restedResources(3),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [chosenId, otherFriendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      return {
        p1,
        p2,
        chosenId: chosenId!,
        otherFriendlyId: otherFriendlyId!,
        enemyId,
        commandId,
      };
    }

    function battle(
      p1: ReturnType<GundamTestEngine["asPlayer"]>,
      p2: ReturnType<GundamTestEngine["asPlayer"]>,
      attackerId: string,
      enemyId: string,
    ) {
      expectSuccess(p1.enterBattle(attackerId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
    }

    it("destroys an enemy Lv.5 or lower Unit damaged by the chosen Unit", () => {
      const { p1, p2, chosenId, enemyId, commandId } = setup();

      expectSuccess(p1.playCommand(commandId, { targets: [chosenId] }));
      battle(p1, p2, chosenId, enemyId);

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not destroy an enemy Lv.6 Unit", () => {
      const { p1, p2, chosenId, enemyId, commandId } = setup({ enemyLevel: 6 });

      expectSuccess(p1.playCommand(commandId, { targets: [chosenId] }));
      battle(p1, p2, chosenId, enemyId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
      expect(p2.getDamage(enemyId)).toBe(3);
    });

    it("does not apply when a different friendly Unit deals the battle damage", () => {
      const { p1, p2, otherFriendlyId, chosenId, enemyId, commandId } = setup();

      expectSuccess(p1.playCommand(commandId, { targets: [chosenId] }));
      battle(p1, p2, otherFriendlyId, enemyId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
      expect(p2.getDamage(enemyId)).toBe(3);
    });

    it("cannot be played without enough active resources", () => {
      const { p1, chosenId, commandId } = setup({ canPay: false });

      expectFailure(p1.playCommand(commandId, { targets: [chosenId] }), "INSUFFICIENT_RESOURCES");
    });

    it("cannot choose an enemy Unit as the delayed trigger source", () => {
      const { p1, enemyId, commandId } = setup();

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");
    });
  });
});
