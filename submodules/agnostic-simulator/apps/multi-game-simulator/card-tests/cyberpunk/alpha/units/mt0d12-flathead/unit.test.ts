import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaMt0d12Flathead,
  alphaCorpoSecurity,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "@cyberpunk-engine/active-effects/index.ts";

registerMatchers();

const flathead = alphaMt0d12Flathead; // cost 5, power 5
const corpoSec = alphaCorpoSecurity; // cost 2, power 2, keywords: ["blocker"]
const huscle = alphaSwordwiseHuscle; // cost 3, power 5
/** Gig area entries that sum to street cred >= 7. */
const HIGH_CRED_GIGS: { dieType: "d6" | "d8"; faceValue: number }[] = [
  { dieType: "d8", faceValue: 7 },
];

/** Gig area entries that sum to street cred < 7. */
const LOW_CRED_GIGS: { dieType: "d6" | "d8"; faceValue: number }[] = [
  { dieType: "d6", faceValue: 3 },
];

function hasCantBeBlocked(engine: CyberpunkTestEngine, cardId: string): boolean {
  return getEffectiveRules(engine.getState(), cardId).includes("cantBeBlocked");
}

/**
 * Force static effect recomputation after fixture setup.
 * Tests can force static effect recomputation through the judge correction
 * move when they need to inspect static rules before normal commands run.
 */
function recompute(engine: CyberpunkTestEngine): void {
  engine.judgeRecomputeActiveEffects();
}

describe("MT0D12 Flathead", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
      });
      expectAttackCandidate(engine, flathead);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: true }],
      });
      expectNotAttackCandidate(engine, flathead);
    });
  });

  describe("[Static] Can't be blocked when Street Cred >= 7", () => {
    it("has cantBeBlocked rule when street cred >= 7", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
        gigArea: HIGH_CRED_GIGS,
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(true);
    });

    it("does NOT have cantBeBlocked rule when street cred < 7", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
        gigArea: LOW_CRED_GIGS,
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(false);
    });

    it("does NOT have cantBeBlocked rule with no gig dice", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(false);
    });

    it("has cantBeBlocked when street cred is exactly 7", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(true);
    });

    it("has cantBeBlocked when street cred exceeds 7", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
        gigArea: [
          { dieType: "d6", faceValue: 5 },
          { dieType: "d8", faceValue: 8 },
        ],
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(engine.getStreetCred(P1)).toBe(13);
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(true);
    });

    it("rule activates dynamically as street cred changes from below to at/above 7", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
        gigArea: LOW_CRED_GIGS, // street cred = 3
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(false);

      engine.judgeMoveFixerDieToGigArea(P1, { dieType: "d8", faceValue: 5 });

      expect(engine.getStreetCred(P1)).toBeGreaterThanOrEqual(7);
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(true);
    });

    it("rule deactivates dynamically as street cred drops below 7", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
        gigArea: HIGH_CRED_GIGS, // street cred = 7
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(true);

      for (const die of engine.getGigDice(P1)) {
        engine.judgeSetGigValue(die, 2);
      }

      expect(engine.getStreetCred(P1)).toBeLessThan(7);
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(false);
    });

    it("rival blocker cannot block when cantBeBlocked is active", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: flathead, spent: false }],
          gigArea: [...HIGH_CRED_GIGS, { dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: corpoSec, spent: false }],
        },
      );

      // Verify cantBeBlocked is active after a command triggers recomputation

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(true);

      engine.attackRival(flathead);
      engine.resolveAttack(); // offensive -> defensive

      // P2 tries to block with Corpo Security — should fail
      const failure = engine.expectFailure(() => engine.useBlocker(corpoSec, { as: P2 }));
      expect(failure.errorCode).toBeDefined();
    });

    it("rival blocker CAN block when street cred < 7", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: flathead, spent: false }],
          gigArea: LOW_CRED_GIGS,
        },
        {
          field: [{ card: corpoSec, spent: false }],
        },
      );

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(false);

      engine.attackRival(flathead);
      engine.resolveAttack(); // offensive -> defensive

      // P2 blocks with Corpo Security — should succeed
      engine.useBlocker(corpoSec, { as: P2 });

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("fight");
      expect(attack!.defenderId).not.toBeNull();
    });

    it("can attack directly when cantBeBlocked is active (no blocker redirect)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: flathead, spent: false }],
          gigArea: [...HIGH_CRED_GIGS, { dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: corpoSec, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 1 }],
        },
      );

      const p2GigsBefore = engine.getGigCount(P2);

      // P1 attacks rival directly
      engine.attackRival(flathead);

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("direct");

      // Resolve through offensive -> defensive (pass) -> steal
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
      engine.resolveAttack(); // steal: steal gig

      expect(engine.getGigCount(P2)).toBeLessThan(p2GigsBefore);
    });

    it("can still be attacked by rival units normally", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: flathead, spent: true }],
          gigArea: HIGH_CRED_GIGS,
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      expect(hasCantBeBlocked(engine, flatheadId)).toBe(true);

      // P2's turn: P2 attacks the spent flathead
      engine.completeTurn();
      engine.attackUnit(huscle, flathead, { as: P2 });

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });

    it("effective power during attack is base power (5)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: flathead, spent: false }],
        gigArea: HIGH_CRED_GIGS,
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      const state = engine.getState();
      expect(state).toHaveEffectivePower({ card: flatheadId, value: 5 });
    });

    it("does NOT grant cantBeBlocked to other friendly units", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [
          { card: flathead, spent: false },
          { card: huscle, spent: false },
        ],
        gigArea: HIGH_CRED_GIGS,
      });
      recompute(engine);

      const flatheadId = engine.getCard(flathead, "field", P1).instanceId as string;
      const huscleId = engine.getCard(huscle, "field", P1).instanceId as string;

      expect(hasCantBeBlocked(engine, flatheadId)).toBe(true);
      expect(hasCantBeBlocked(engine, huscleId)).toBe(false);
    });
  });
});
