import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCallableLegend,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d8" as const, faceValue: 1 },
];

describe("Goro Takemura - Hands Unclean", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
        ],
        eddies: 2,
      });
      expectCallableLegend(engine, embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean);
    });

    it("shows the legend as an attack candidate after entering the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
      });
      expectAttackCandidate(engine, embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean);
    });

    it("does NOT show a spent legend as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: true }],
      });
      expectNotAttackCandidate(engine, embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean);
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
        field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
      });

      engine.attackRival(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("spends Goro when he attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
      });

      engine.attackRival(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean);

      expect(
        engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean).meta.spent,
      ).toBe(true);
    });

    it("cannot attack when spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: true }],
      });

      const failure = engine.expectFailure(() =>
        engine.attackRival(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean),
      );
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("emits a localised action log for the direct attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
      });

      engine.attackRival(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.attackRival");
      expect(log!.params.attackerName).toBe(
        embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.displayName,
      );

      // Verify the formatter produces sensible English output.
      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.displayName);
    });
  });

  // ── BLOCKER ──────────────────────────────────────────────────────────

  describe(`BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to this unit.)`, () => {
    it("redirects a direct attack to itself", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [welcomeToNightCityRetailSwordwiseHuscle], gigArea: p1LeadGigs }, // P1 attacker (power 5)
        {
          field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }], // Goro on P2's field, ready (power 7)
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );

      engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle);
      engine.resolveAttack(); // attack -> react

      engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P2 });

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("fight");
      expect(attack!.defenderId).not.toBeNull();
    });

    it("is spent when activated as a blocker", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [welcomeToNightCityRetailSwordwiseHuscle] },
        {
          field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
        },
      );

      engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle);
      engine.resolveAttack(); // attack -> react

      engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P2 });

      expect(
        engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean).meta.spent,
      ).toBe(true);
    });

    it("blocking a direct attack steals no gigs on resolution", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [welcomeToNightCityRetailSwordwiseHuscle], gigArea: p1LeadGigs }, // power 5
        {
          field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }], // power 7 — wins the fight
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );

      const p1GigsBefore = engine.getGigCount(P1);
      const p2GigsBefore = engine.getGigCount(P2);

      engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle);
      engine.resolveAttack(); // attack -> react
      engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P2 });
      engine.resolveAttack({ as: P2, pass: true }); // react -> fight
      engine.resolveAttack(); // fight -> defeat

      expect(engine.getGigCount(P1)).toBe(p1GigsBefore);
      expect(engine.getGigCount(P2)).toBe(p2GigsBefore);
    });

    it("emits blockerActivated event when Goro blocks", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [welcomeToNightCityRetailSwordwiseHuscle] },
        {
          field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
        },
      );

      engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle);
      engine.resolveAttack(); // attack -> react

      engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P2 });

      expect(engine.getLastEvent("blockerActivated")).toBeDefined();
    });

    it("emits a localised action log when Goro blocks", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [welcomeToNightCityRetailSwordwiseHuscle] },
        {
          field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
        },
      );

      engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle);
      engine.resolveAttack(); // attack -> react

      engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P2 });

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.useBlocker");
      expect(log!.params.blockerName).toBe(
        embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.displayName,
      );
      expect(log!.params.attackerName).toBe(welcomeToNightCityRetailSwordwiseHuscle.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.displayName);
      expect(text).toContain(welcomeToNightCityRetailSwordwiseHuscle.displayName);
    });

    it("emits a localised action log when the fight resolves — Goro wins", () => {
      // Goro (power 7) blocks Swordwise Huscle (power 5): defender wins.
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [welcomeToNightCityRetailSwordwiseHuscle] }, // power 5 — attacker, will lose
        {
          field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
        }, // power 7 — blocker, will win
      );

      engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle);
      engine.resolveAttack(); // attack -> react
      engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P2 });
      engine.resolveAttack({ as: P2, pass: true }); // react -> fight
      engine.resolveAttack(); // fight -> defeat

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.resolveAttack.fight.defenderWins");
      // Attacker is Swordwise Huscle (P1), defender is Goro (P2 blocker).
      expect(log!.params.attackerName).toBe(welcomeToNightCityRetailSwordwiseHuscle.displayName);
      expect(log!.params.defenderName).toBe(
        embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.displayName,
      );

      const text = formatActionLog(log!, enMessages);
      // EN template: "{defenderName} ({defenderPower}) defeated {attackerName} ({attackerPower})."
      expect(text).toBe(
        `Fight: ${embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.displayName} (7) defeated ${welcomeToNightCityRetailSwordwiseHuscle.displayName} (5).`,
      );
    });

    it("spent Goro cannot block", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [welcomeToNightCityRetailSwordwiseHuscle] },
        { field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: true }] },
      );

      engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle);
      engine.resolveAttack(); // attack -> react

      const failure = engine.expectFailure(() =>
        engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P2 }),
      );
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("only the defending player can activate Goro as a blocker", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [welcomeToNightCityRetailSwordwiseHuscle] },
        {
          field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: false }],
        },
      );

      engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle);
      engine.resolveAttack(); // attack -> react

      // P1 (attacker) cannot use P2's blocker
      const failure = engine.expectFailure(() =>
        engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P1 }),
      );
      expect(failure.errorCode).toBe("NOT_YOUR_REACT");
    });
  });
});
