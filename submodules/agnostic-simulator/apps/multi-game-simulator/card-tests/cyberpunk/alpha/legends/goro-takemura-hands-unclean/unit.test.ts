import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCallableLegend,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaGoroTakemuraHandsUnclean, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d8" as const, faceValue: 1 },
];

describe("Goro Takemura - Hands Unclean", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: alphaGoroTakemuraHandsUnclean, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, alphaGoroTakemuraHandsUnclean);
    });

    it("shows the legend as an attack candidate after entering the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }],
      });
      expectAttackCandidate(engine, alphaGoroTakemuraHandsUnclean);
    });

    it("does NOT show a spent legend as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alphaGoroTakemuraHandsUnclean, spent: true }],
      });
      expectNotAttackCandidate(engine, alphaGoroTakemuraHandsUnclean);
    });
  });

  // ── GO SOLO ──────────────────────────────────────────────────────────

  describe(`GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)`, () => {
    it("enters the field as a ready unit with no summoning sickness", () => {
      // Fixture simulates the outcome of paying GO SOLO: Goro on field, ready (not spent,
      // not playedThisTurn). GO SOLO always enters him as ready — that is the keyword's
      // entire purpose, so playedThisTurn is NOT set.
      // Legends start spent in the initial state, so spent: false is required to mark him as ready.
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }],
      });

      engine.attackRival(alphaGoroTakemuraHandsUnclean);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("spends Goro when he attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }],
      });

      engine.attackRival(alphaGoroTakemuraHandsUnclean);

      expect(engine.getCard(alphaGoroTakemuraHandsUnclean).meta.spent).toBe(true);
    });

    it("cannot attack when spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alphaGoroTakemuraHandsUnclean, spent: true }],
      });

      const failure = engine.expectFailure(() => engine.attackRival(alphaGoroTakemuraHandsUnclean));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("emits a localised action log for the direct attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }],
      });

      engine.attackRival(alphaGoroTakemuraHandsUnclean);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.attackRival");
      expect(log!.params.attackerName).toBe(alphaGoroTakemuraHandsUnclean.displayName);

      // Verify the formatter produces sensible English output.
      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(alphaGoroTakemuraHandsUnclean.displayName);
    });
  });

  // ── BLOCKER ──────────────────────────────────────────────────────────

  describe(`BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to this unit.)`, () => {
    it("redirects a direct attack to itself", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle], gigArea: p1LeadGigs }, // P1 attacker (power 5)
        {
          field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }], // Goro on P2's field, ready (power 7)
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );

      engine.attackRival(alphaSwordwiseHuscle);
      engine.resolveAttack(); // offensive -> defensive

      engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P2 });

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("fight");
      expect(attack!.defenderId).not.toBeNull();
    });

    it("is spent when activated as a blocker", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }] },
      );

      engine.attackRival(alphaSwordwiseHuscle);
      engine.resolveAttack(); // offensive -> defensive

      engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P2 });

      expect(engine.getCard(alphaGoroTakemuraHandsUnclean).meta.spent).toBe(true);
    });

    it("blocking a direct attack steals no gigs on resolution", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle], gigArea: p1LeadGigs }, // power 5
        {
          field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }], // power 7 — wins the fight
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );

      const p1GigsBefore = engine.getGigCount(P1);
      const p2GigsBefore = engine.getGigCount(P2);

      engine.attackRival(alphaSwordwiseHuscle);
      engine.resolveAttack(); // offensive -> defensive
      engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P2 });
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> fight
      engine.resolveAttack(); // fight -> defeat
      engine.resolveAttack(); // defeat -> cleared

      expect(engine.getGigCount(P1)).toBe(p1GigsBefore);
      expect(engine.getGigCount(P2)).toBe(p2GigsBefore);
    });

    it("emits blockerActivated event when Goro blocks", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }] },
      );

      engine.attackRival(alphaSwordwiseHuscle);
      engine.resolveAttack(); // offensive -> defensive

      engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P2 });

      expect(engine.getLastEvent("blockerActivated")).toBeDefined();
    });

    it("emits a localised action log when Goro blocks", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }] },
      );

      engine.attackRival(alphaSwordwiseHuscle);
      engine.resolveAttack(); // offensive -> defensive

      engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P2 });

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.useBlocker");
      expect(log!.params.blockerName).toBe(alphaGoroTakemuraHandsUnclean.displayName);
      expect(log!.params.attackerName).toBe(alphaSwordwiseHuscle.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(alphaGoroTakemuraHandsUnclean.displayName);
      expect(text).toContain(alphaSwordwiseHuscle.displayName);
    });

    it("emits a localised action log when the fight resolves — Goro wins", () => {
      // Goro (power 7) blocks Swordwise Huscle (power 5): defender wins.
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] }, // power 5 — attacker, will lose
        { field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }] }, // power 7 — blocker, will win
      );

      engine.attackRival(alphaSwordwiseHuscle);
      engine.resolveAttack(); // offensive -> defensive
      engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P2 });
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> fight
      engine.resolveAttack(); // fight -> defeat
      engine.resolveAttack(); // defeat -> cleared

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.resolveAttack.fight.defenderWins");
      // Attacker is Swordwise Huscle (P1), defender is Goro (P2 blocker).
      expect(log!.params.attackerName).toBe(alphaSwordwiseHuscle.displayName);
      expect(log!.params.defenderName).toBe(alphaGoroTakemuraHandsUnclean.displayName);

      const text = formatActionLog(log!, enMessages);
      // EN template: "{defenderName} defeated {attackerName}."
      expect(text).toBe(
        `${alphaGoroTakemuraHandsUnclean.displayName} defeated ${alphaSwordwiseHuscle.displayName}.`,
      );
    });

    it("spent Goro cannot block", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaGoroTakemuraHandsUnclean, spent: true }] },
      );

      engine.attackRival(alphaSwordwiseHuscle);
      engine.resolveAttack(); // offensive -> defensive

      const failure = engine.expectFailure(() =>
        engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P2 }),
      );
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("only the defending player can activate Goro as a blocker", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaGoroTakemuraHandsUnclean, spent: false }] },
      );

      engine.attackRival(alphaSwordwiseHuscle);
      engine.resolveAttack(); // offensive -> defensive

      // P1 (attacker) cannot use P2's blocker
      const failure = engine.expectFailure(() =>
        engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P1 }),
      );
      expect(failure.errorCode).toBe("NOT_YOUR_DEFENSE");
    });
  });
});
