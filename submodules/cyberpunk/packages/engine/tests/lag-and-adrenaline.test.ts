import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  registerMatchers,
} from "../src/testing/index.ts";
import "../src/testing/matchers.d.ts";

beforeAll(() => {
  registerMatchers();
});

/**
 * Lag and Adrenaline — start-of-turn readiness and attack permissions.
 *
 * Rules:
 *   - All Units enter the field with Lag, which lasts until the end of the turn.
 *   - Units with Lag can't attack or activate self-spend effects.
 *   - ADRENALINE: This Unit can attack the turn it's played.
 */

describe("Lag and Adrenaline", () => {
  describe("Lag — summoning sickness", () => {
    it("prevents a fresh unit from attacking a spent rival unit", () => {
      const freshUnit = createMockUnit({ id: "fresh", name: "Fresh Unit", cost: 1, power: 3 });
      const target = createMockUnit({ id: "target", name: "Target", cost: 1, power: 1 });

      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [freshUnit], eddies: 5 },
        { field: [target], eddies: 5 },
      );

      // Spend the target so it can be attacked.
      engine.judgeSpendCard(engine.getCard(target, "field", P2).instanceId);

      // The unit was placed via fixture with playedThisTurn already false,
      // so to test Lag we need a unit that was actually played this turn.
      engine.playCard(freshUnit, { as: P1 });
      const played = engine.getCard(freshUnit, "field", P1);
      expect(played.meta.playedThisTurn).toBe(true);

      const failure = engine.expectFailure(() => engine.attackUnit(freshUnit, target, { as: P1 }));
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });

    it("prevents a fresh unit from attacking the rival directly", () => {
      const freshUnit = createMockUnit({ id: "fresh2", name: "Fresh Unit 2", cost: 1, power: 3 });

      const engine = CyberpunkTestEngine.createWithFixture({ hand: [freshUnit], eddies: 5 }, {});

      engine.playCard(freshUnit, { as: P1 });
      const played = engine.getCard(freshUnit, "field", P1);
      expect(played.meta.playedThisTurn).toBe(true);

      const failure = engine.expectFailure(() => engine.attackRival(freshUnit, { as: P1 }));
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });

    it("clears at the start of the next turn", () => {
      const freshUnit = createMockUnit({ id: "fresh3", name: "Fresh Unit 3", cost: 1, power: 3 });
      const target = createMockUnit({ id: "target2", name: "Target 2", cost: 1, power: 1 });

      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [freshUnit], eddies: 5 },
        { field: [target], eddies: 5 },
      );

      engine.playCard(freshUnit, { as: P1 });
      expect(engine.getCard(freshUnit, "field", P1).meta.playedThisTurn).toBe(true);

      // End P1's turn, then P2's turn, then back to P1.
      engine.passPhase({ as: P1 });
      engine.completeTurn({ as: P2 });

      // Now it's P1's turn 2. The unit's Lag should be cleared.
      expect(engine.getCard(freshUnit, "field", P1).meta.playedThisTurn).toBe(false);

      // Spend the target so it can be attacked.
      engine.judgeSpendCard(engine.getCard(target, "field", P2).instanceId);

      // Should be able to attack now.
      expect(engine.attackUnit(freshUnit, target, { as: P1 })).toBeSuccessfulCommand();
    });
  });

  describe("ADRENALINE keyword", () => {
    it("allows a unit to attack a spent rival unit on the turn it's played", () => {
      const adrenalineUnit = createMockUnit({
        id: "adrenaline-unit",
        name: "Adrenaline Unit",
        cost: 1,
        power: 3,
        keywords: ["adrenaline"],
      });
      const target = createMockUnit({ id: "target3", name: "Target 3", cost: 1, power: 1 });

      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [adrenalineUnit], eddies: 5 },
        { field: [target], eddies: 5 },
      );

      // Spend the target so it can be attacked.
      engine.judgeSpendCard(engine.getCard(target, "field", P2).instanceId);

      engine.playCard(adrenalineUnit, { as: P1 });
      expect(engine.getCard(adrenalineUnit, "field", P1).meta.playedThisTurn).toBe(true);

      // Adrenaline lets it attack despite Lag.
      expect(engine.attackUnit(adrenalineUnit, target, { as: P1 })).toBeSuccessfulCommand();
    });

    it("allows a unit to attack the rival directly on the turn it's played", () => {
      const adrenalineUnit = createMockUnit({
        id: "adrenaline-unit2",
        name: "Adrenaline Unit 2",
        cost: 1,
        power: 3,
        keywords: ["adrenaline"],
      });

      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [adrenalineUnit], eddies: 5 },
        { gigArea: [{ dieType: "d6", faceValue: 2 }], eddies: 5 },
      );

      engine.playCard(adrenalineUnit, { as: P1 });
      expect(engine.getCard(adrenalineUnit, "field", P1).meta.playedThisTurn).toBe(true);

      // Adrenaline lets it attack rival directly despite Lag.
      expect(engine.attackRival(adrenalineUnit, { as: P1 })).toBeSuccessfulCommand();
    });

    it("is advertised in attackRival candidates on the played turn", () => {
      const adrenalineUnit = createMockUnit({
        id: "adrenaline-unit3",
        name: "Adrenaline Unit 3",
        cost: 1,
        power: 3,
        keywords: ["adrenaline"],
      });
      const normalUnit = createMockUnit({
        id: "normal-unit",
        name: "Normal Unit",
        cost: 1,
        power: 3,
      });

      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [adrenalineUnit, normalUnit], eddies: 10 },
        {},
      );

      engine.playCard(adrenalineUnit, { as: P1 });
      engine.playCard(normalUnit, { as: P1 });

      const prompt = engine.getPrompt(P1);
      const attackRivalMove = prompt.availableMoves.find((m) => m.moveId === "attackRival");
      expect(attackRivalMove).toBeDefined();

      const candidates = (
        attackRivalMove!.inputSpec as { type: "selectCard"; candidates: string[] }
      ).candidates;
      const adrenalineInstance = engine.getCard(adrenalineUnit, "field", P1).instanceId;
      const normalInstance = engine.getCard(normalUnit, "field", P1).instanceId;

      expect(candidates).toContain(adrenalineInstance);
      expect(candidates).not.toContain(normalInstance);
    });

    it("is advertised in attackUnit candidates on the played turn", () => {
      const adrenalineUnit = createMockUnit({
        id: "adrenaline-unit4",
        name: "Adrenaline Unit 4",
        cost: 1,
        power: 3,
        keywords: ["adrenaline"],
      });
      const normalUnit = createMockUnit({
        id: "normal-unit2",
        name: "Normal Unit 2",
        cost: 1,
        power: 3,
      });
      const target = createMockUnit({ id: "target4", name: "Target 4", cost: 1, power: 1 });

      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [adrenalineUnit, normalUnit], eddies: 10 },
        { field: [{ card: target, spent: true }], eddies: 5 },
      );

      engine.playCard(adrenalineUnit, { as: P1 });
      engine.playCard(normalUnit, { as: P1 });

      const prompt = engine.getPrompt(P1);
      const attackUnitMove = prompt.availableMoves.find((m) => m.moveId === "attackUnit");
      expect(attackUnitMove).toBeDefined();

      const fromCandidates = (
        attackUnitMove!.inputSpec as { type: "selectPair"; fromCandidates: string[] }
      ).fromCandidates;
      const adrenalineInstance = engine.getCard(adrenalineUnit, "field", P1).instanceId;
      const normalInstance = engine.getCard(normalUnit, "field", P1).instanceId;

      expect(fromCandidates).toContain(adrenalineInstance);
      expect(fromCandidates).not.toContain(normalInstance);
    });
  });
});
