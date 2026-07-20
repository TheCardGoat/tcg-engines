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
import { st05GrazeCommanderType008 } from "./008-graze-commander-type.ts";

describe("Graze Commander Type (ST05-008)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests, redirects an attack, and protects the original friendly target", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st05GrazeCommanderType008] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectSuccess(p2.declareBlock(blockerId!));

      expect(p2.isExhausted(blockerId!)).toBe(true);
      expectAttackRedirectedTo(engine, blockerId!);

      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(blockerId!)).toBe(1);
      expect(p2.getDamage(originalTargetId!)).toBe(0);
    });

    it("can intercept a direct attack", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [st05GrazeCommanderType008],
          shieldArea: [createMockUnit({ name: "Shield" })],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));

      expectAttackRedirectedTo(engine, blockerId);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
    });

    it("cannot block while rested", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [{ card: st05GrazeCommanderType008, exhausted: true }],
          shieldArea: [createMockUnit({ name: "Shield" })],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK");

      expect(p2.isExhausted(blockerId)).toBe(true);
    });

    it("cannot block an attack that originally targeted itself", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st05GrazeCommanderType008, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, blockerId));
      expectFailure(p2.declareBlock(blockerId), "BLOCKER_IS_TARGET");
    });
  });

  describe("playing Graze Commander Type", () => {
    it("pays 2 Resources and deploys it to the battle area", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GrazeCommanderType008],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(unitId));

      expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("cannot be deployed below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GrazeCommanderType008],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st05GrazeCommanderType008), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st05GrazeCommanderType008)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost after another legal card leaves only 1 active Resource", () => {
      const setup = createMockCommand({
        name: "Resource Setup",
        level: 0,
        cost: 2,
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
        hand: [setup, st05GrazeCommanderType008],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [setupId, unitId] = p1.getHand();

      expectSuccess(p1.playCommand(setupId!));
      expectFailure(p1.deployUnit(unitId!), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(unitId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GrazeCommanderType008],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(st05GrazeCommanderType008), "WRONG_PHASE");

      expect(p1.getCardZone(st05GrazeCommanderType008)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
