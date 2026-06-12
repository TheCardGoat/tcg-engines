import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd04PenelopeFlightForm002 } from "./002-penelope-flight-form.ts";

describe("Penelope (Flight Form) (GD04-002)", () => {
  it("during your turn, all friendly (Earth Federation) Units get AP+1", () => {
    const ef = createMockUnit({ ap: 2, hp: 3, traits: ["earth federation"] });
    const nonEf = createMockUnit({ ap: 2, hp: 3, traits: ["zeon"] });

    const engine = GundamTestEngine.create({
      play: [gd04PenelopeFlightForm002, ef, nonEf],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [penelopeId, efId, nonEfId] = p1.getCardsInZone("battleArea");
    const framework = engine.getRuntime().getFrameworkReadAPI();

    // Penelope itself is (Earth Federation) and benefits from the AP+1.
    expect(getEffectiveStats(penelopeId!, engine.getG(), framework.cards, framework).ap).toBe(
      gd04PenelopeFlightForm002.ap + 1,
    );
    // Friendly EF unit also gets +1.
    expect(getEffectiveStats(efId!, engine.getG(), framework.cards, framework).ap).toBe(ef.ap + 1);
    // Non-EF unit unaffected.
    expect(getEffectiveStats(nonEfId!, engine.getG(), framework.cards, framework).ap).toBe(
      nonEf.ap,
    );
  });

  it("on the opponent's turn, the AP+1 buff does NOT apply", () => {
    const ef = createMockUnit({ ap: 2, hp: 3, traits: ["earth federation"] });
    const engine = GundamTestEngine.create({}, { play: [gd04PenelopeFlightForm002, ef] });
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [penelopeId, efId] = p2.getCardsInZone("battleArea");
    const framework = engine.getRuntime().getFrameworkReadAPI();

    // It's PLAYER_ONE's turn; Penelope (controlled by P2) does not see
    // its `isTurn whose: friendly` predicate satisfied, so no AP+1.
    expect(getEffectiveStats(penelopeId!, engine.getG(), framework.cards, framework).ap).toBe(
      gd04PenelopeFlightForm002.ap,
    );
    expect(getEffectiveStats(efId!, engine.getG(), framework.cards, framework).ap).toBe(ef.ap);
  });

  describe("【Deploy】During this turn, when one of your (Earth Federation) Units destroys an enemy Unit with battle damage, choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    it("rests an active enemy HP<=5 Unit after a friendly Earth Federation Unit destroys an enemy Unit with battle damage", () => {
      const attacker = createMockUnit({
        name: "EF Attacker",
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
      expectSuccess(engine.resolveCombat({ attackerId, target: defenderId! }));

      expect(isCardExhausted(engine, restTargetId!)).toBe(true);
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
      expectSuccess(engine.resolveCombat({ attackerId, target: defenderId! }));

      expect(isCardExhausted(engine, restTargetId!)).toBe(false);
    });

    it("does not rest an enemy Unit with more than 5 HP", () => {
      const attacker = createMockUnit({
        name: "EF Attacker",
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
      expectSuccess(engine.resolveCombat({ attackerId, target: defenderId! }));

      expect(isCardExhausted(engine, sturdyTargetId!)).toBe(false);
    });
  });
});
