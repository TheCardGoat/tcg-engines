import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd01StrategicArms108 } from "./108-strategic-arms.ts";

describe("Strategic Arms (GD01-108)", () => {
  describe("【Main】Deal 2 damage to all Units with <Blocker>.", () => {
    it("deals 2 damage to every unit with the Blocker keyword on both sides", () => {
      const friendlyBlocker = createMockUnit({
        ap: 2,
        hp: 5,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const friendlyPlain = createMockUnit({ ap: 2, hp: 5 });
      const enemyBlocker = createMockUnit({
        ap: 2,
        hp: 5,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const enemyPlain = createMockUnit({ ap: 2, hp: 5 });

      const engine = GundamTestEngine.create(
        {
          hand: [gd01StrategicArms108],
          play: [friendlyBlocker, friendlyPlain],
          resourceArea: activeResources(7),
        },
        { play: [enemyBlocker, enemyPlain] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [friendlyBlockerId, friendlyPlainId] = p1.getCardsInZone("battleArea");
      const [enemyBlockerId, enemyPlainId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01StrategicArms108));

      expect(getDamageCounter(engine, friendlyBlockerId!)).toBe(2);
      expect(getDamageCounter(engine, enemyBlockerId!)).toBe(2);
      expect(getDamageCounter(engine, friendlyPlainId!)).toBe(0);
      expect(getDamageCounter(engine, enemyPlainId!)).toBe(0);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("leaves non-Blocker units untouched when no blockers are in play", () => {
      const friendlyPlain = createMockUnit({ ap: 2, hp: 5 });
      const enemyPlain = createMockUnit({ ap: 2, hp: 5 });

      const engine = GundamTestEngine.create(
        {
          hand: [gd01StrategicArms108],
          play: [friendlyPlain],
          resourceArea: activeResources(7),
        },
        { play: [enemyPlain] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [friendlyPlainId] = p1.getCardsInZone("battleArea");
      const [enemyPlainId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01StrategicArms108));

      expect(getDamageCounter(engine, friendlyPlainId!)).toBe(0);
      expect(getDamageCounter(engine, enemyPlainId!)).toBe(0);
    });

    it("moves the command card to trash after resolution", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd01StrategicArms108],
          resourceArea: activeResources(7),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01StrategicArms108));

      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot be played during action-phase (timing is main only)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01StrategicArms108],
        resourceArea: activeResources(7),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01StrategicArms108), "WRONG_TIMING");
    });
  });
});
