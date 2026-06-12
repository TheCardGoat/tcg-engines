import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaJackieWellesRideOrDieChoom, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";

registerMatchers();

/**
 * Helper: createWithFixture does not call recomputeActiveEffects, so
 * static effects that depend on board state can be refreshed through a judge
 * correction move before assertions.
 */
function createEngine(
  p1: Parameters<typeof CyberpunkTestEngine.createWithFixture>[0],
  p2?: Parameters<typeof CyberpunkTestEngine.createWithFixture>[1],
): CyberpunkTestEngine {
  const engine = CyberpunkTestEngine.createWithFixture(p1, p2);
  engine.judgeRecomputeActiveEffects();
  return engine;
}

describe("Jackie Welles - Ride Or Die Choom", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = createEngine({
        field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
      });
      expectAttackCandidate(engine, alphaJackieWellesRideOrDieChoom);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = createEngine({
        field: [{ card: alphaJackieWellesRideOrDieChoom, spent: true }],
      });
      expectNotAttackCandidate(engine, alphaJackieWellesRideOrDieChoom);
    });
  });

  describe(`[Static] +2 power for each friendly Gig`, () => {
    it("has base power with 0 friendly gigs", () => {
      const engine = createEngine({
        field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
        gigArea: [],
      });

      const jackie = engine.getCard(alphaJackieWellesRideOrDieChoom);
      expect(engine.getState()).toHaveEffectivePower({
        card: jackie.instanceId as string,
        value: 6,
      });
    });

    it("gains +2 power with 1 friendly gig", () => {
      const engine = createEngine({
        field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      const jackie = engine.getCard(alphaJackieWellesRideOrDieChoom);
      expect(engine.getState()).toHaveEffectivePower({
        card: jackie.instanceId as string,
        value: 8,
      });
    });

    it("power scales with multiple gigs (3 gigs = base + 6)", () => {
      const engine = createEngine({
        field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 1 },
          { dieType: "d10", faceValue: 5 },
        ],
      });

      const jackie = engine.getCard(alphaJackieWellesRideOrDieChoom);
      // base 6 + 3 gigs × 2 = 12
      expect(engine.getState()).toHaveEffectivePower({
        card: jackie.instanceId as string,
        value: 12,
      });
    });

    it("power updates when gaining a new gig", () => {
      const engine = createEngine({
        field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      const jackieId = engine.getCard(alphaJackieWellesRideOrDieChoom).instanceId as string;

      // 1 gig → base 6 + 2 = 8
      expect(engine.getState()).toHaveEffectivePower({ card: jackieId, value: 8 });

      engine.judgeMoveFixerDieToGigArea(P1, { dieType: "d8", faceValue: 4 });

      // 2 gigs → base 6 + 4 = 10
      expect(engine.getState()).toHaveEffectivePower({ card: jackieId, value: 10 });
    });

    it("power during attack reflects modifier", () => {
      const engine = createEngine(
        {
          field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
          gigArea: [
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 1 },
          ],
        },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );

      engine.attackUnit(alphaJackieWellesRideOrDieChoom, alphaRuthlessLowlife);

      const jackie = engine.getCard(alphaJackieWellesRideOrDieChoom);
      // base 6 + 2 gigs × 2 = 10
      expect(engine.getState()).toHaveEffectivePower({
        card: jackie.instanceId as string,
        value: 10,
      });
    });

    it("steals two gigs at 14 power", () => {
      const engine = createEngine(
        {
          field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
            { dieType: "d10", faceValue: 4 },
          ],
        },
        {
          gigArea: [
            { dieType: "d4", faceValue: 4 },
            { dieType: "d6", faceValue: 1 },
            { dieType: "d12", faceValue: 10 },
          ],
        },
      );

      engine.attackRival(alphaJackieWellesRideOrDieChoom);
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
      engine.resolveAttack(); // steal: 14 power steals 2 gigs

      expect(engine.getGigCount(P1)).toBe(6);
      expect(engine.getGigCount(P2)).toBe(1);
    });

    it("does NOT gain power from rival's gigs", () => {
      const engine = createEngine(
        {
          field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
          // P1 has no gigs
          gigArea: [],
        },
        {
          gigArea: [
            { dieType: "d6", faceValue: 3 },
            { dieType: "d8", faceValue: 5 },
          ],
        },
      );

      const jackie = engine.getCard(alphaJackieWellesRideOrDieChoom);
      // Only friendly gigs count → 0 gigs → base power 6
      expect(engine.getState()).toHaveEffectivePower({
        card: jackie.instanceId as string,
        value: 6,
      });
    });

    it("idle units on same field are NOT buffed (only Jackie)", () => {
      const engine = createEngine({
        field: [
          { card: alphaJackieWellesRideOrDieChoom, spent: false },
          { card: alphaRuthlessLowlife, spent: false },
        ],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      const jackie = engine.getCard(alphaJackieWellesRideOrDieChoom);
      const lowlife = engine.getCard(alphaRuthlessLowlife);

      // Jackie gets the buff: base 6 + 1 gig × 2 = 8
      expect(engine.getState()).toHaveEffectivePower({
        card: jackie.instanceId as string,
        value: 8,
      });

      // Ruthless Lowlife stays at its base power of 1
      expect(engine.getState()).toHaveEffectivePower({
        card: lowlife.instanceId as string,
        value: 1,
      });
    });

    it("static abilities do not emit action logs", () => {
      const engine = createEngine({
        field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      // Static modifiers are computed, not triggered — no action log expected
      const lastLog = engine.getLastActionLog();
      expect(lastLog).toBeUndefined();
    });

    it("effective power in combat: Jackie defeats a unit it would tie without gigs", () => {
      // Jackie base power 6. With 1 gig → 8.
      // Opponent has a power-6 unit. Without gigs Jackie would tie (mutual destruction).
      // With 1 gig Jackie wins.
      const engine = createEngine(
        {
          field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 2 }],
        },
        {
          // Use another Jackie as a 6-power defender
          field: [{ card: alphaJackieWellesRideOrDieChoom, spent: true }],
        },
      );

      engine.attackUnit(alphaJackieWellesRideOrDieChoom, alphaJackieWellesRideOrDieChoom);
      engine.resolveFullFight();

      // P1's Jackie (8 power) survives
      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field.some((c) => c.definitionId === alphaJackieWellesRideOrDieChoom.id)).toBe(true);

      // P2's Jackie (6 power, no friendly gigs) is defeated
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === alphaJackieWellesRideOrDieChoom.id)).toBe(true);
    });
  });
});
