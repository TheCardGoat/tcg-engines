import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaSecondhandBombus,
  alphaSwordwiseHuscle,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "@cyberpunk-engine/active-effects/index.ts";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const bombus = alphaSecondhandBombus; // cost 2, power 2 — blocker + cantAttack
const huscle = alphaSwordwiseHuscle; // cost 3, power 5 — P2 attacker
const lowlife = alphaRuthlessLowlife; // cost 2, power 1 — attacker

describe("Secondhand Bombus", () => {
  describe("UI prompt", () => {
    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: bombus, spent: true }],
      });
      expectNotAttackCandidate(engine, bombus);
    });
  });

  // ── BLOCKER ──────────────────────────────────────────────────────────

  describe("BLOCKER", () => {
    it("can block a rival's direct attack on the rival player", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: bombus, spent: false }],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive -> defensive

      engine.useBlocker(bombus, { as: P1 });

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("fight");
      expect(attack!.defenderId).not.toBeNull();
    });

    it("can block a rival's attack on a spent friendly unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: bombus, spent: false },
            { card: lowlife, spent: true },
          ],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackUnit(huscle, lowlife, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive -> defensive

      engine.useBlocker(bombus, { as: P1 });

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("fight");
      expect(attack!.defenderId).not.toBeNull();
    });

    it("must be ready to block (fails when spent)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: bombus, spent: true }],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive -> defensive

      const failure = engine.expectFailure(() => engine.useBlocker(bombus, { as: P1 }));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("spends after blocking", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: bombus, spent: false }],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive -> defensive

      engine.useBlocker(bombus, { as: P1 });

      expect(engine.getCard(bombus, "field", P1).meta.spent).toBe(true);
    });

    it("emits a localised action log when blocking", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: bombus, spent: false }],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive -> defensive

      engine.useBlocker(bombus, { as: P1 });

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.useBlocker");
      expect(log!.params.blockerName).toBe(bombus.displayName);
      expect(log!.params.attackerName).toBe(huscle.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(bombus.displayName);
      expect(text).toContain(huscle.displayName);
    });
  });

  // ── Can't Attack ────────────────────────────────────────────────────

  describe("Can't Attack", () => {
    it("has the cantAttack rule granted by its static ability", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: bombus, spent: false }],
      });

      engine.judgeRecomputeActiveEffects();

      const card = engine.getCard(bombus, "field", P1);
      const rules = getEffectiveRules(engine.getState(), card.instanceId as string);

      expect(rules).toContain("cantAttack");
    });

    it("has a static grantRule activeEffect with origin static", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: bombus, spent: false }],
      });

      engine.judgeRecomputeActiveEffects();

      const card = engine.getCard(bombus, "field", P1);
      const state = engine.getState();
      const entry = state.G.activeEffects.find(
        (e) =>
          e.origin === "static" &&
          e.kind === "grantRule" &&
          e.rule === "cantAttack" &&
          (e.targetCardId as string) === (card.instanceId as string),
      );

      expect(entry).toBeDefined();
    });

    it("also has the blocker rule alongside cantAttack", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: bombus, spent: false }],
      });

      engine.judgeRecomputeActiveEffects();

      const card = engine.getCard(bombus, "field", P1);
      const rules = getEffectiveRules(engine.getState(), card.instanceId as string);

      expect(rules).toContain("blocker");
      expect(rules).toContain("cantAttack");
    });

    it("can still be on field and block despite not being able to attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: bombus, spent: false }],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      // After completeTurn (which runs command processor), activeEffects are recomputed
      engine.completeTurn();

      // Verify bombus has both rules
      const card = engine.getCard(bombus, "field", P1);
      const rules = getEffectiveRules(engine.getState(), card.instanceId as string);
      expect(rules).toContain("blocker");
      expect(rules).toContain("cantAttack");

      // Verify it can still block
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive -> defensive

      engine.useBlocker(bombus, { as: P1 });

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("fight");
    });

    it("emits blockerActivated event when blocking — confirming defensive utility despite cantAttack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: bombus, spent: false }],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      engine.completeTurn();
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive -> defensive

      engine.useBlocker(bombus, { as: P1 });

      expect(engine.getLastEvent("blockerActivated")).toBeDefined();
    });

    it("cannot attack a spent rival unit (cantAttack rule blocks the move)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: bombus, spent: false }],
        },
        {
          field: [{ card: lowlife, spent: true }],
        },
      );

      const failure = engine.expectFailure(() => engine.attackUnit(bombus, lowlife));
      expect(failure.errorCode).toBe("CANT_ATTACK");
    });

    it("cannot attack the rival directly (cantAttack rule blocks the move)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: bombus, spent: false }],
      });

      const failure = engine.expectFailure(() => engine.attackRival(bombus));
      expect(failure.errorCode).toBe("CANT_ATTACK");
    });
  });
});
