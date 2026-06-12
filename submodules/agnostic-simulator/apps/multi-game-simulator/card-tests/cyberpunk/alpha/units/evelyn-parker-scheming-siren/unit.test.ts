import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaEvelynParkerSchemingSiren, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

const evelyn = alphaEvelynParkerSchemingSiren;
const huscle = alphaSwordwiseHuscle;
const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d8" as const, faceValue: 1 },
];

describe("Evelyn Parker - Scheming Siren", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: evelyn, spent: false }],
      });
      expectAttackCandidate(engine, evelyn);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: evelyn, spent: true }],
      });
      expectNotAttackCandidate(engine, evelyn);
    });
  });

  describe("When a rival steals one or more friendly gigs, if this unit is spent, draw a card.", () => {
    /**
     * Helper: set up a game where Evelyn is on P1's field with the given spent
     * state, P2 has a ready attacker (Swordwise Huscle), and P1 has gigs to
     * steal. P1 is the active player at the start.
     */
    function setupGigStealScenario(opts?: {
      evelynSpent?: boolean;
      p1GigArea?: { dieType: "d6" | "d8" | "d10" | "d12" | "d20"; faceValue: number }[];
      evelynInHand?: boolean;
    }) {
      const evelynSpent = opts?.evelynSpent ?? true;
      const gigArea = opts?.p1GigArea ?? [{ dieType: "d6" as const, faceValue: 3 }];

      const p1Fixture: Record<string, unknown> = {
        gigArea,
      };

      if (opts?.evelynInHand) {
        p1Fixture.hand = [evelyn];
      } else {
        p1Fixture.field = [{ card: evelyn, spent: evelynSpent }];
      }

      return CyberpunkTestEngine.createWithFixture(p1Fixture as any, {
        field: [{ card: huscle, spent: false }],
      });
    }

    /**
     * Helper: pass P1's turn and have P2 perform a direct attack that steals
     * gigs, resolving all three attack steps.
     */
    function executeP2DirectAttack(engine: CyberpunkTestEngine) {
      // P1 passes both phases (play + attack) to end their turn.
      engine.completeTurn();

      // P2 attacks P1 directly.
      engine.attackRival(huscle, { as: P2 });

      // Resolve the 3 attack steps:
      // 1) offensive -> defensive
      engine.resolveAttack({ as: P2 });
      // 2) defensive -> steal (P1 passes, no blocker)
      engine.resolveAttack({ as: P1, pass: true });
      // 3) steal: execute steal
      engine.resolveAttack({ as: P2 });
    }

    it("draws 1 card when rival steals a gig and Evelyn is spent", () => {
      const engine = setupGigStealScenario({ evelynSpent: true });
      const handBefore = engine.getHandCount(P1);

      executeP2DirectAttack(engine);

      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("does NOT draw when Evelyn is ready (not spent)", () => {
      const engine = setupGigStealScenario({ evelynSpent: false });
      const handBefore = engine.getHandCount(P1);

      executeP2DirectAttack(engine);

      // Evelyn is not spent, so the condition fails — no draw.
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("does NOT trigger when friendly player steals a gig", () => {
      // Evelyn on P1's field (spent), P1 attacks P2 and steals P2's gig.
      // The stealer is P1 (friendly), not rival — should NOT trigger.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: evelyn, spent: true },
            { card: huscle, spent: false },
          ],
          gigArea: p1LeadGigs,
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );

      const handBefore = engine.getHandCount(P1);

      engine.attackRival(huscle);
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
      engine.resolveAttack(); // steal: steal

      // The stealer is P1 (friendly to Evelyn), not rival — no draw.
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("draws for each gig stolen in a single attack (multi-steal)", () => {
      // Huscle has power 5. Steal count = 1 + floor(power / 10) = 1.
      // To steal 2 gigs, we need a unit with power >= 10.
      // We can boost Evelyn's scenario by giving P1 multiple gigs and using
      // a judge correction to set Huscle's power modifier to 10+ total.
      const engine = setupGigStealScenario({
        evelynSpent: true,
        p1GigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 4 },
        ],
      });

      // Boost Huscle's power so it steals 2 gigs (need power >= 10).
      // Huscle base power is 5, so add +5 modifier.
      engine.judgeSetCardMeta(huscle, { powerModifier: 5 }, { as: P2 });

      const handBefore = engine.getHandCount(P1);

      executeP2DirectAttack(engine);

      // Power 10 → steal 1 + floor(10/10) = 2 gigs → 2 gigStolen events → draw 2 cards.
      expect(engine.getHandCount(P1)).toBe(handBefore + 2);
    });

    it("triggers during rival's attack step (Evelyn is on P1's field, P2 attacks)", () => {
      const engine = setupGigStealScenario({ evelynSpent: true });
      const handBefore = engine.getHandCount(P1);

      executeP2DirectAttack(engine);

      // Verify gig was stolen from P1 to P2.
      expect(engine.getGigCount(P2)).toBeGreaterThanOrEqual(1);
      // Evelyn's trigger fired — P1 drew a card.
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("action log shows the direct attack resolution", () => {
      const engine = setupGigStealScenario({ evelynSpent: true });

      executeP2DirectAttack(engine);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.resolveAttack.direct");
    });

    it("hand count increases by 1 after trigger", () => {
      const engine = setupGigStealScenario({ evelynSpent: true });

      const handBefore = engine.getHandCount(P1);
      expect(handBefore).toBeGreaterThanOrEqual(0);

      executeP2DirectAttack(engine);

      const handAfter = engine.getHandCount(P1);
      expect(handAfter).toBe(handBefore + 1);
      expect(handAfter - handBefore).toBe(1);
    });

    it("does NOT trigger when Evelyn is not on the field (in hand)", () => {
      const engine = setupGigStealScenario({
        evelynSpent: false,
        evelynInHand: true,
      });

      const handBefore = engine.getHandCount(P1);

      executeP2DirectAttack(engine);

      // Evelyn is in hand, not on field — ability does not trigger.
      // Hand count should remain unchanged (no draw from ability).
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("Evelyn stays spent after the trigger (doesn't ready)", () => {
      const engine = setupGigStealScenario({ evelynSpent: true });

      executeP2DirectAttack(engine);

      // Evelyn should still be spent — the draw effect doesn't ready her.
      const evelynCard = engine.getCard(evelyn, "field", P1);
      expect(evelynCard.meta.spent).toBe(true);
    });

    it("does NOT trigger when no gigs are stolen (opponent has no gigs)", () => {
      // P1 has no gigs in gig area — nothing to steal.
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: evelyn, spent: true }], gigArea: [] },
        { field: [{ card: huscle, spent: false }] },
      );

      const handBefore = engine.getHandCount(P1);

      // P1 passes turn.
      engine.completeTurn();

      // P2 attacks directly — but P1 has no gigs to steal.
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 });
      engine.resolveAttack({ as: P1, pass: true });
      engine.resolveAttack({ as: P2 });

      // No gigs stolen → no gigStolen event → no draw.
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });
  });
});
