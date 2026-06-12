import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectCallableLegend,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerGoroTakemuraVengefulBodyguard,
  alphaCorpoSecurity,
  alphaSwordwiseHuscle,
  alphaRuthlessLowlife,
  alphaArmoredMinotaur,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

registerMatchers();

const goro = spoilerGoroTakemuraVengefulBodyguard;
const corpoSec = alphaCorpoSecurity; // cost 2, power 2 — eligible target
const huscle = alphaSwordwiseHuscle; // cost 3, power 5 — eligible target / P1 attacker
const lowlife = alphaRuthlessLowlife; // cost 2, power 1 — P2 attacker
const minotaur = alphaArmoredMinotaur; // cost 6, power 9 — ineligible (cost > 4)

const CALL_COST = 1;
const PAIRED_GIGS: { dieType: "d6" | "d8"; faceValue: number }[] = [
  { dieType: "d6", faceValue: 3 },
  { dieType: "d8", faceValue: 3 },
];

/** Check if a card has Goro's triggered effects (powerModifier or blocker grantRule with imperative origin). */
function hasGoroEffects(engine: CyberpunkTestEngine, cardId: string): boolean {
  return engine
    .getState()
    .G.activeEffects.some(
      (e) =>
        (e.targetCardId as string) === cardId &&
        e.origin === "imperative" &&
        (e.kind === "powerModifier" || (e.kind === "grantRule" && e.rule === "blocker")),
    );
}

describe("Goro Takemura - Vengeful Bodyguard", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: goro, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, goro);
    });

    it("has no pending choice after calling (CALL Ready auto-applies)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [goro],
        eddies: CALL_COST,
      });
      engine.callLegend(goro);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });
  });

  // ── CALL ──────────────────────────────────────────────────────────────

  describe(`CALL Ready this Legend.`, () => {
    it("Goro is face-up after being called", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [goro],
        eddies: CALL_COST,
      });

      engine.callLegend(goro);

      expect(engine.getCard(goro, "legendArea", P1).meta.faceDown).toBe(false);
    });

    it("Goro is readied (not spent) after being called", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [goro],
        eddies: CALL_COST,
      });

      engine.callLegend(goro);

      // Call normally spends the legend; the CALL Ready effect un-spends it
      expect(engine.getCard(goro, "legendArea", P1).meta.spent).toBe(false);
    });

    it("calling Goro costs 1 eddie", () => {
      const startEddies = 5;
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [goro],
        eddies: startEddies,
      });

      engine.callLegend(goro);

      expect(engine.getEddies(P1)).toBe(startEddies - CALL_COST);
    });

    it("emits a callLegend action log", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [goro],
        eddies: CALL_COST,
      });

      engine.callLegend(goro);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.callLegend");
      expect(log!.params.legendName).toBe(goro.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(goro.displayName);
    });
  });

  // ── ATTACK TRIGGER ────────────────────────────────────────────────────

  describe(`When a rival Unit attacks, [Spend Icon]: If you have a sided-pair of Gigs, give a friendly Unit with cost 4 or less +1 power and BLOCKER this turn.`, () => {
    it("rival attack grants +1 power and BLOCKER to eligible friendly unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: goro, faceDown: false }],
          field: [{ card: corpoSec, spent: false }],
          gigArea: PAIRED_GIGS,
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(lowlife, { as: P2 });
      // Single valid target is auto-selected for mandatory abilities.

      // Goro should have spent
      expect(engine.getCard(goro, "legendArea", P1).meta.spent).toBe(true);

      // corpoSec should have +1 power (base 2 → 3)
      const state = engine.getState();
      expect(state).toHaveEffectivePower({
        card: engine.getCard(corpoSec, "field", P1).instanceId as string,
        value: 3,
      });

      // BLOCKER active effect should exist
      const corpoSecId = engine.getCard(corpoSec, "field", P1).instanceId;
      const blockerEffect = state.G.activeEffects.find(
        (e) => (e.targetCardId as string) === (corpoSecId as string) && e.kind === "grantRule",
      );
      expect(blockerEffect).toBeDefined();
      expect(blockerEffect!.rule).toBe("blocker");
    });

    it("presents a target choice when multiple friendly units are eligible", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: goro, faceDown: false }],
          field: [
            { card: corpoSec, spent: false },
            { card: lowlife, spent: false },
          ],
          gigArea: PAIRED_GIGS,
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(huscle, { as: P2 });

      // Two valid targets → prompt is shown
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseTarget");
      if (choice && choice.type === "chooseTarget" && choice.payload.type === "effectTarget") {
        expect(choice.payload.eligibleIds).toHaveLength(2);
      }
    });

    it("granted BLOCKER is functional — unit can block the attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: goro, faceDown: false }],
          field: [{ card: corpoSec, spent: false }],
          gigArea: PAIRED_GIGS,
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(huscle, { as: P2 }); // triggers Goro → corpoSec gets BLOCKER
      // Single valid target is auto-selected for mandatory abilities.
      engine.resolveAttack({ as: P2 }); // offensive → defensive step

      engine.useBlocker(corpoSec, { as: P1 });

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("fight");
      expect(attack!.defenderId).not.toBeNull();
    });

    it("effects are temporary — cleared after turn ends", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: goro, faceDown: false }],
          field: [{ card: corpoSec, spent: false }],
          gigArea: PAIRED_GIGS,
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(lowlife, { as: P2 });
      // Single valid target is auto-selected for mandatory abilities.

      // Confirm Goro's effects are active
      const corpoSecId = engine.getCard(corpoSec, "field", P1).instanceId as string;
      expect(hasGoroEffects(engine, corpoSecId)).toBe(true);

      // Resolve the attack then end P2's turn so turn-duration effects clean up
      engine.resolveAttack({ as: P2 }); // offensive → defensive
      engine.resolveAttack({ as: P1, pass: true }); // defensive → resolve (P1 passes)
      engine.resolveAttack({ as: P2 }); // steal: direct attack steals gig

      // P2 is in main phase — pass once to end P2's turn
      engine.passPhase({ as: P2 });

      // Turn-duration effects should now be cleaned up
      expect(hasGoroEffects(engine, corpoSecId)).toBe(false);
    });

    it("does not trigger when Goro is already spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: goro, faceDown: false }],
          field: [{ card: corpoSec, spent: false }],
          gigArea: PAIRED_GIGS,
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      engine.judgeSpendCard(goro, { as: P1 });

      engine.completeTurn();
      engine.attackRival(lowlife, { as: P2 });

      // No Goro-specific effects on corpoSec
      const corpoSecId = engine.getCard(corpoSec, "field", P1).instanceId as string;
      expect(hasGoroEffects(engine, corpoSecId)).toBe(false);
    });

    it("does not trigger when Goro is face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [goro], // default: faceDown = true
          field: [{ card: corpoSec, spent: false }],
          gigArea: PAIRED_GIGS,
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(lowlife, { as: P2 });

      // Goro should not have been spent
      expect(engine.getCard(goro, "legendArea", P1).meta.spent).toBe(false);
      // No Goro-specific effects on corpoSec
      const corpoSecId = engine.getCard(corpoSec, "field", P1).instanceId as string;
      expect(hasGoroEffects(engine, corpoSecId)).toBe(false);
    });

    it("does not trigger when no friendly unit with cost 4 or less exists", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: goro, faceDown: false }],
          field: [{ card: minotaur, spent: false }], // cost 6, ineligible
          gigArea: PAIRED_GIGS,
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(lowlife, { as: P2 });

      // Binding fails → ability skipped → Goro not spent
      expect(engine.getCard(goro, "legendArea", P1).meta.spent).toBe(false);
    });

    it("Goro spends but effects are skipped without a sided-pair of Gigs", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: goro, faceDown: false }],
          field: [{ card: corpoSec, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 3 }], // single die, no pair
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(lowlife, { as: P2 });
      // Single valid target is auto-selected for mandatory abilities.

      // Goro spends (cost paid before effects are evaluated)
      expect(engine.getCard(goro, "legendArea", P1).meta.spent).toBe(true);

      // But corpoSec gets no Goro effects (hasGigPair condition fails)
      const corpoSecId = engine.getCard(corpoSec, "field", P1).instanceId as string;
      expect(hasGoroEffects(engine, corpoSecId)).toBe(false);
    });

    it("does not trigger on friendly unit attacks — only rival attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: goro, faceDown: false }],
        field: [
          { card: huscle, spent: false },
          { card: corpoSec, spent: false },
        ],
        gigArea: PAIRED_GIGS,
      });

      engine.attackRival(huscle); // P1 attacks — not a rival attack from Goro's perspective

      // Goro should not have triggered
      expect(engine.getCard(goro, "legendArea", P1).meta.spent).toBe(false);
    });

    it("emits an action log for the rival's attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: goro, faceDown: false }],
          field: [{ card: corpoSec, spent: false }],
          gigArea: PAIRED_GIGS,
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(lowlife, { as: P2 });
      // Single valid target is auto-selected for mandatory abilities.

      const log = engine
        .getEvents("actionLog")
        .findLast(
          (event) =>
            event.type === "actionLog" &&
            (event.messageKey === "trigger.autoResolved" ||
              event.messageKey === "trigger.resolved" ||
              event.messageKey === "trigger.targetResolved"),
        );
      expect(log).toBeDefined();

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(goro.displayName);
    });
  });
});
