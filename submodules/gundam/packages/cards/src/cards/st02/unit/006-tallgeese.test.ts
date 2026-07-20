import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { st02Tallgeese006 } from "./006-tallgeese.ts";

describe("Tallgeese (ST02-006)", () => {
  describe("【Activate･Main】【Once per Turn】④：Set this Unit as active.", () => {
    it("pays 4 Resources and sets rested Tallgeese active", () => {
      const engine = GundamTestEngine.create({
        play: [{ card: st02Tallgeese006, exhausted: true }],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateAbility(tallgeeseId, 0));

      expect(p1.isExhausted(tallgeeseId)).toBe(false);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
    });

    it("cannot activate without 4 active Resources", () => {
      const engine = GundamTestEngine.create({
        play: [{ card: st02Tallgeese006, exhausted: true }],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateAbility(tallgeeseId, 0), "INSUFFICIENT_RESOURCES");

      expect(p1.isExhausted(tallgeeseId)).toBe(true);
      expect(p1.getCardsInZone("resourceArea").every((id) => !p1.isExhausted(id))).toBe(true);
    });

    it("cannot activate during the End Phase Action Step", () => {
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st02Tallgeese006, exhausted: true }],
          resourceArea: activeResources(4),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.activateAbility(tallgeeseId, 0), "WRONG_PHASE");

      expect(p1.isExhausted(tallgeeseId)).toBe(true);
      expect(p1.getCardsInZone("resourceArea").every((id) => !p1.isExhausted(id))).toBe(true);
    });

    it("cannot activate more than once in the same turn", () => {
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st02Tallgeese006, exhausted: true }],
          resourceArea: activeResources(8),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateAbility(tallgeeseId, 0));
      expectSuccess(p1.enterBattle(tallgeeseId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectFailure(p1.activateAbility(tallgeeseId, 0), "ABILITY_LIMIT_REACHED");

      expect(p1.isExhausted(tallgeeseId)).toBe(true);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
    });

    it("pays its cost but leaves an already-active Tallgeese active", () => {
      const engine = GundamTestEngine.create({
        play: [st02Tallgeese006],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateAbility(tallgeeseId, 0));

      expect(p1.isExhausted(tallgeeseId)).toBe(false);
      expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
    });
  });
});
