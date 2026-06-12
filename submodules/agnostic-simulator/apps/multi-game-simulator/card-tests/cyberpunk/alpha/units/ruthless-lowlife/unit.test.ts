import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaRuthlessLowlife, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

const lowlife = alphaRuthlessLowlife;
const huscle = alphaSwordwiseHuscle;
const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d8" as const, faceValue: 1 },
];

/**
 * Helper: P1 has Lowlife on field, P2 has huscle ready.
 * P1 completes their turn, then P2 attacks P1 directly during P2's main phase.
 * Returns the engine after the steal resolves.
 *
 * Note: When P2's turn starts, P2 automatically takes a gig from their fixer area.
 * The stolen gig is always the LAST die in P2's gigArea (index = gigArea.length - 1).
 */
function setupRivalSteals(
  p1Fixture: Parameters<typeof CyberpunkTestEngine.createWithFixture>[0],
  p2Fixture?: Parameters<typeof CyberpunkTestEngine.createWithFixture>[1],
): CyberpunkTestEngine {
  const engine = CyberpunkTestEngine.createWithFixture(p1Fixture, {
    field: [{ card: huscle, spent: false }],
    ...p2Fixture,
  });

  // P1 ends turn → P2 starts in main phase.
  engine.completeTurn();

  // P2 attacks P1 directly.
  engine.attackRival(huscle, { as: P2 });
  engine.resolveAttack({ as: P2 }); // offensive -> defensive
  engine.resolveAttack({ as: P1, pass: true }); // defensive -> steal
  engine.resolveAttack({ as: P2 }); // steal: steal

  return engine;
}

/** Get the face value of the last (most recently added) gig die for a player. */
function getLastStolenGigValue(engine: CyberpunkTestEngine): number {
  const dice = engine.getGigDice(P2);
  return dice[dice.length - 1]?.faceValue ?? 0;
}

describe("Ruthless Lowlife", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: lowlife, spent: false }],
      });
      expectAttackCandidate(engine, lowlife);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: lowlife, spent: true }],
      });
      expectNotAttackCandidate(engine, lowlife);
    });
  });

  describe("When a rival steals one or more friendly gigs, if this unit is spent, the value of those gigs becomes 1.", () => {
    it("sets stolen gig value to 1 when rival steals and Lowlife is spent", () => {
      const engine = setupRivalSteals({
        field: [{ card: lowlife, spent: true }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      });

      // The stolen gig should now have value 1 (was 5).
      expect(getLastStolenGigValue(engine)).toBe(1);
    });

    it("logs both the Lowlife trigger and the direct steal result", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: lowlife, spent: true }],
          gigArea: [{ dieType: "d6", faceValue: 5 }],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 });
      engine.resolveAttack({ as: P1, pass: true });
      const result = engine.resolveAttack({ as: P2 });

      const actionKeys = result.moveLogs.flatMap((log) =>
        log.type === "action" ? [log.messageKey] : [],
      );
      expect(actionKeys).toContain("trigger.autoResolved");
      expect(actionKeys).toContain("move.resolveAttack.direct");
    });

    it("does NOT trigger when Ruthless Lowlife is ready (not spent)", () => {
      const engine = setupRivalSteals({
        field: [{ card: lowlife, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      });

      // Lowlife is ready, so the gig value should remain unchanged at 5.
      expect(getLastStolenGigValue(engine)).toBe(5);
    });

    it("does NOT trigger when friendly player steals a gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: lowlife, spent: true },
            { card: huscle, spent: false },
          ],
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 5 }],
        },
      );

      // P1 attacks P2 directly (friendly steal from P1's perspective).
      engine.attackRival(huscle);
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
      engine.resolveAttack(); // steal: steal

      // Ruthless Lowlife triggers on rival stealing friendly gigs, not on
      // friendly player stealing rival gigs. The stolen gig value stays 5.
      const stolenDice = engine.getGigDice(P1);
      const stolenDie = stolenDice[stolenDice.length - 1]!;
      expect(stolenDie.faceValue).toBe(5);
    });

    it("stolen gig's value changes from original to 1", () => {
      const engine = setupRivalSteals({
        field: [{ card: lowlife, spent: true }],
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      });

      // The gig was 6, now it should be 1.
      expect(getLastStolenGigValue(engine)).toBe(1);
    });

    it("rival's street cred increases by only 1 instead of the original gig value", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: lowlife, spent: true }],
          gigArea: [
            { dieType: "d6", faceValue: 5 },
            { dieType: "d8", faceValue: 1 },
          ],
        },
        {
          field: [{ card: huscle, spent: false }],
          gigArea: [{ dieType: "d4", faceValue: 3 }],
        },
      );

      const p2StreetCredBefore = engine.getStreetCred(P2);
      expect(p2StreetCredBefore).toBe(3);

      engine.completeTurn();

      // P2 gains a fixer die at turn start; capture the new baseline.
      const p2StreetCredAfterTurnStart = engine.getStreetCred(P2);

      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 });
      engine.resolveAttack({ as: P1, pass: true });
      engine.resolveAttack({ as: P2 });

      // The stolen gig's value was set to 1 by Ruthless Lowlife.
      // So P2's street cred increased by 1, not 5.
      expect(engine.getStreetCred(P2)).toBe(p2StreetCredAfterTurnStart + 1);
    });

    it("emits a gigValueChanged event showing the value drop", () => {
      const engine = setupRivalSteals({
        field: [{ card: lowlife, spent: true }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      });

      const gigValueEvents = engine.getEvents("gigValueChanged");
      expect(gigValueEvents.length).toBeGreaterThan(0);
      const last = gigValueEvents[gigValueEvents.length - 1] as {
        type: "gigValueChanged";
        previousValue: number;
        newValue: number;
      };
      expect(last.newValue).toBe(1);
      expect(last.previousValue).toBe(5);
    });

    it("Ruthless Lowlife stays spent after trigger", () => {
      const engine = setupRivalSteals({
        field: [{ card: lowlife, spent: true }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      });

      // Lowlife should remain spent after its trigger fires.
      expect(engine.getCard(lowlife, "field", P1).meta.spent).toBe(true);
    });

    it("works with high-value gig dice (e.g., d12 at faceValue 10)", () => {
      const engine = setupRivalSteals({
        field: [{ card: lowlife, spent: true }],
        gigArea: [{ dieType: "d12", faceValue: 10 }],
      });

      // Even a high-value die should be set to 1.
      expect(getLastStolenGigValue(engine)).toBe(1);
    });
  });
});
