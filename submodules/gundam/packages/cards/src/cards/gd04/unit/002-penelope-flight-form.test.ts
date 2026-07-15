import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04PenelopeFlightForm002 } from "./002-penelope-flight-form.ts";

describe("Penelope (Flight Form) (GD04-002)", () => {
  describe("During your turn, all your (Earth Federation) Units get AP+1.", () => {
    it("increases battle damage from Penelope and other Earth Federation Units by 1", () => {
      const earthFederationUnit = createMockUnit({
        name: "Earth Federation Unit",
        ap: 2,
        hp: 6,
        traits: ["earth federation"],
      });
      const zeonUnit = createMockUnit({ name: "Zeon Unit", ap: 2, hp: 6, traits: ["zeon"] });
      const defenders = Array.from({ length: 3 }, (_, index) => ({
        card: createMockUnit({ name: `Defender ${index + 1}`, ap: 0, hp: 10 }),
        exhausted: true,
      }));
      const engine = GundamTestEngine.create(
        { play: [gd04PenelopeFlightForm002, earthFederationUnit, zeonUnit] },
        { play: defenders },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [penelopeId, earthFederationId, zeonId] = p1.getCardsInZone("battleArea");
      const [penelopeTargetId, earthFederationTargetId, zeonTargetId] =
        p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(penelopeId!, penelopeTargetId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expectSuccess(p1.enterBattle(earthFederationId!, earthFederationTargetId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expectSuccess(p1.enterBattle(zeonId!, zeonTargetId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(penelopeTargetId!)).toBe(4);
      expect(p2.getDamage(earthFederationTargetId!)).toBe(3);
      expect(p2.getDamage(zeonTargetId!)).toBe(2);
    });

    it("does not increase Earth Federation AP during the opponent's turn", () => {
      const earthFederationUnit = createMockUnit({
        name: "Earth Federation Unit",
        ap: 2,
        hp: 6,
        traits: ["earth federation"],
      });
      const attackers = [
        createMockUnit({ name: "Attacker 1", ap: 0, hp: 10 }),
        createMockUnit({ name: "Attacker 2", ap: 0, hp: 10 }),
      ];
      const engine = GundamTestEngine.create(
        { play: attackers },
        {
          play: [
            { card: gd04PenelopeFlightForm002, exhausted: true },
            { card: earthFederationUnit, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstAttackerId, secondAttackerId] = p1.getCardsInZone("battleArea");
      const [penelopeId, earthFederationId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(firstAttackerId!, penelopeId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expectSuccess(p1.enterBattle(secondAttackerId!, earthFederationId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(firstAttackerId!)).toBe(3);
      expect(p1.getDamage(secondAttackerId!)).toBe(2);
    });
  });

  describe("【Deploy】During this turn, when one of your (Earth Federation) Units destroys an enemy Unit with battle damage, choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    it("rests an active enemy Unit with 5 HP after a friendly Earth Federation Unit destroys a Unit in battle", () => {
      const attacker = createMockUnit({
        name: "Earth Federation Attacker",
        traits: ["earth federation"],
        ap: 4,
        hp: 4,
      });
      const defender = {
        card: createMockUnit({ name: "Fragile Enemy", ap: 0, hp: 1 }),
        exhausted: true,
      };
      const restTarget = createMockUnit({ name: "Rest Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04PenelopeFlightForm002],
          play: [attacker],
          resourceArea: activeResources(6),
        },
        { play: [defender, restTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, restTargetId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd04PenelopeFlightForm002));
      expectSuccess(p1.enterBattle(attackerId, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.resolveEffect({ targets: [restTargetId!] }));

      expect(p2.isExhausted(restTargetId!)).toBe(true);
    });

    it("does not trigger when the battle-destroying friendly Unit is not Earth Federation", () => {
      const attacker = createMockUnit({ name: "Zeon Attacker", traits: ["zeon"], ap: 4, hp: 4 });
      const defender = {
        card: createMockUnit({ name: "Fragile Enemy", ap: 0, hp: 1 }),
        exhausted: true,
      };
      const restTarget = createMockUnit({ name: "Rest Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04PenelopeFlightForm002],
          play: [attacker],
          resourceArea: activeResources(6),
        },
        { play: [defender, restTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, restTargetId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd04PenelopeFlightForm002));
      expectSuccess(p1.enterBattle(attackerId, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.isExhausted(restTargetId!)).toBe(false);
    });

    it("does not rest an enemy Unit with more than 5 HP", () => {
      const attacker = createMockUnit({
        name: "Earth Federation Attacker",
        traits: ["earth federation"],
        ap: 4,
        hp: 4,
      });
      const defender = {
        card: createMockUnit({ name: "Fragile Enemy", ap: 0, hp: 1 }),
        exhausted: true,
      };
      const sturdyTarget = createMockUnit({ name: "Sturdy Target", ap: 1, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04PenelopeFlightForm002],
          play: [attacker],
          resourceArea: activeResources(6),
        },
        { play: [defender, sturdyTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, sturdyTargetId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd04PenelopeFlightForm002));
      expectSuccess(p1.enterBattle(attackerId, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.isExhausted(sturdyTargetId!)).toBe(false);
    });
  });
});
