import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectAttackRedirectedTo,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st01Zowort009 } from "./009-zowort.ts";

describe("Zowort (ST01-009)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests Zowort, redirects an attack, and protects the original target", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 3 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [st01Zowort009, { card: originalTarget, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [zowortId, originalTargetId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectSuccess(p2.declareBlock(zowortId!));

      expect(p2.isExhausted(zowortId!)).toBe(true);
      expectAttackRedirectedTo(engine, zowortId!);

      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(zowortId!)).toBe(1);
      expect(p2.getDamage(originalTargetId!)).toBe(0);
    });

    it("can intercept a direct attack", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [st01Zowort009], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const zowortId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(zowortId));

      expectAttackRedirectedTo(engine, zowortId);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
    });

    it("cannot block while rested", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st01Zowort009, exhausted: true }], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const zowortId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(zowortId), "CANNOT_BLOCK");

      expect(p2.isExhausted(zowortId)).toBe(true);
    });

    it("cannot block an attack that originally targeted Zowort", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st01Zowort009, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const zowortId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, zowortId));
      expectFailure(p2.declareBlock(zowortId), "BLOCKER_IS_TARGET");
    });
  });

  describe("This Unit can't choose the enemy player as its attack target.", () => {
    it("rejects a direct attack", () => {
      const engine = GundamTestEngine.create(
        { play: [st01Zowort009] },
        { shieldArea: [createMockUnit({ name: "Shield" })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zowortId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(zowortId, "direct"), "CANNOT_TARGET_PLAYER");

      expect(p1.isExhausted(zowortId)).toBe(false);
    });

    it("still allows Zowort to attack a rested enemy Unit", () => {
      const enemy = createMockUnit({ name: "Enemy Unit", ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st01Zowort009] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zowortId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(zowortId, enemyId));

      expect(p1.isExhausted(zowortId)).toBe(true);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: zowortId });
    });
  });

  describe("playing Zowort", () => {
    it("pays 2 Resources and deploys Zowort to the battle area", () => {
      const engine = GundamTestEngine.create({
        hand: [st01Zowort009],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zowortId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(zowortId));

      expect(p1.getCardZone(zowortId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("cannot be deployed below its printed Lv.2 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st01Zowort009],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st01Zowort009), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st01Zowort009)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost when only 1 Resource remains active", () => {
      const setup = createMockCommand({
        name: "Resource Setup",
        level: 0,
        cost: 1,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [],
            sourceText: "【Main】Do nothing.",
          },
        ],
      });
      const engine = GundamTestEngine.create({
        hand: [setup, st01Zowort009],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [setupId, zowortId] = p1.getHand();

      expectSuccess(p1.playCommand(setupId!));
      expectFailure(p1.deployUnit(zowortId!), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(zowortId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st01Zowort009],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(st01Zowort009), "WRONG_PHASE");

      expect(p1.getCardZone(st01Zowort009)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
