import { describe, expect, it } from "vite-plus/test";
import {
  alphaSecondhandBombus,
  alphaJackieWellesRideOrDieChoom,
  alphaArmoredMinotaur,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import { getEffectivePower, getEffectiveRules } from "../src/active-effects/index.ts";
import { defOf } from "../src/state/lookups.ts";

// ── recomputeActiveEffects ────────────────────────────────────────────────────
//
// Tests can force a recompute through the same command pipeline used by moves.

describe("recomputeActiveEffects", () => {
  it("generates a static grantRule entry for a card with a static ability", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [alphaSecondhandBombus],
    });

    engine.judgeRecomputeActiveEffects();

    const card = engine.getCard(alphaSecondhandBombus, "field", P1);
    const state = engine.getState();
    const entry = state.G.activeEffects.find(
      (e) =>
        e.origin === "static" &&
        e.kind === "grantRule" &&
        (e.targetCardId as string) === (card.instanceId as string),
    );

    expect(entry).toBeDefined();
    expect(entry!.rule).toBe("cantAttack");
  });

  it("getEffectiveRules includes rules granted by static abilities", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [alphaSecondhandBombus],
    });

    engine.judgeRecomputeActiveEffects();

    const card = engine.getCard(alphaSecondhandBombus, "field", P1);
    const rules = getEffectiveRules(engine.getState(), card.instanceId as string);

    expect(rules).toContain("cantAttack");
    expect(rules).toContain("blocker");
  });

  it("reflects static power modifier in getEffectivePower", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [alphaJackieWellesRideOrDieChoom],
    });

    engine.judgeRecomputeActiveEffects();

    const card = engine.getCard(alphaJackieWellesRideOrDieChoom, "field", P1);
    const gigCount = engine.getGigCount(P1);

    // Jackie gets +2 per gig; base power is 6
    expect(getEffectivePower(engine.getState(), card.instanceId as string)).toBe(6 + gigCount * 2);
  });

  it("updates static power modifier when gig count changes", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [alphaJackieWellesRideOrDieChoom],
    });

    const card = engine.getCard(alphaJackieWellesRideOrDieChoom, "field", P1);

    engine.judgeRecomputeActiveEffects();
    const gigsBefore = engine.getGigCount(P1);
    const powerBefore = getEffectivePower(engine.getState(), card.instanceId as string);
    expect(powerBefore).toBe(6 + gigsBefore * 2);

    // Simulate gaining a gig by ending P1's turn (P2 starts, P1 gains a gig next turn).
    // The command processor calls recomputeActiveEffects after each move automatically.
    engine.passPhase({ as: P1 }); // end turn (P2 draws a gig on their turn start)

    const gigsAfter = engine.getGigCount(P1);
    const powerAfter = getEffectivePower(engine.getState(), card.instanceId as string);
    expect(powerAfter).toBe(6 + gigsAfter * 2);
  });

  it("is idempotent — calling twice produces the same static entry set", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [alphaSecondhandBombus, alphaArmoredMinotaur],
    });

    engine.judgeRecomputeActiveEffects();
    const signature1 = engine
      .getState()
      .G.activeEffects.filter((e) => e.origin === "static")
      .map((e) => `${e.kind}:${e.targetCardId as string}:${e.rule ?? e.powerModifier ?? ""}`)
      .sort()
      .join("|");

    // Second recompute — should produce identical results.
    engine.judgeRecomputeActiveEffects();
    const signature2 = engine
      .getState()
      .G.activeEffects.filter((e) => e.origin === "static")
      .map((e) => `${e.kind}:${e.targetCardId as string}:${e.rule ?? e.powerModifier ?? ""}`)
      .sort()
      .join("|");

    expect(signature1).toBe(signature2);
    expect(signature1.length).toBeGreaterThan(0);
  });

  it("does not generate static entries for face-down legends", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [alphaArmoredMinotaur],
    });

    engine.judgeRecomputeActiveEffects();

    const state = engine.getState();
    const legends = engine.getCardsInZone("legendArea", P1);
    const legendId = legends.find((c) => c.definitionId === alphaArmoredMinotaur.id)?.instanceId;

    const staticEntries = state.G.activeEffects.filter(
      (e) => e.origin === "static" && (e.sourceCardId as string) === (legendId as string),
    );
    expect(staticEntries).toHaveLength(0);
  });
});

// ── cleanupTurnEffects (turn-duration imperative effects) ─────────────────────

describe("cleanupTurnEffects", () => {
  it("removes turn-duration imperative effects at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [alphaArmoredMinotaur],
    });

    const card = engine.getCard(alphaArmoredMinotaur, "field", P1);

    // Judge correction: add a turn-duration imperative effect.
    engine.judgeAddActiveEffect({
      id: "test-turn-effect",
      sourceCardId: card.instanceId,
      targetCardId: card.instanceId,
      kind: "powerModifier",
      powerModifier: 3,
      duration: "turn",
      origin: "imperative",
      abilityIndex: 0,
    });

    const powerBefore = getEffectivePower(engine.getState(), card.instanceId as string);
    // base 9 + injected 3 = 12
    expect(powerBefore).toBe((defOf(card).power ?? 0) + 3);

    // End P1's turn; cleanupTurnEffects runs at the turn boundary.
    engine.passPhase({ as: P1 }); // end turn

    const stateAfter = engine.getState();
    const turnEffect = stateAfter.G.activeEffects.find((e) => e.id === "test-turn-effect");
    expect(turnEffect).toBeUndefined();

    const powerAfter = getEffectivePower(stateAfter, card.instanceId as string);
    expect(powerAfter).toBe(defOf(card).power ?? 0);
  });

  it("preserves continuous imperative effects across turn boundaries", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [alphaArmoredMinotaur],
    });

    const card = engine.getCard(alphaArmoredMinotaur, "field", P1);

    engine.judgeAddActiveEffect({
      id: "test-continuous-effect",
      sourceCardId: card.instanceId,
      targetCardId: card.instanceId,
      kind: "powerModifier",
      powerModifier: 5,
      duration: "continuous",
      origin: "imperative",
      abilityIndex: 0,
    });

    const powerBefore = getEffectivePower(engine.getState(), card.instanceId as string);
    expect(powerBefore).toBe((defOf(card).power ?? 0) + 5);

    // End P1's turn — continuous effects must survive.
    engine.passPhase({ as: P1 });

    const stateAfter = engine.getState();
    const continuousEffect = stateAfter.G.activeEffects.find(
      (e) => e.id === "test-continuous-effect",
    );
    expect(continuousEffect).toBeDefined();

    const powerAfter = getEffectivePower(stateAfter, card.instanceId as string);
    expect(powerAfter).toBe(powerBefore);
  });

  it("does not remove turn-duration effects belonging to the opponent's turn", () => {
    // Turn-duration effects should survive until *their* turn ends.
    // After P1's turn ends, P2's turn starts. A turn-duration effect added at
    // the start of P2's turn should still be present during P2's turn.
    const engine = CyberpunkTestEngine.createWithFixture({}, { field: [alphaArmoredMinotaur] });

    // End P1's turn so P2 becomes active.
    engine.passPhase({ as: P1 });

    const card = engine.getCard(alphaArmoredMinotaur, "field", P2);

    // Judge correction: add a turn-duration effect for P2's card.
    engine.judgeAddActiveEffect({
      id: "test-p2-turn-effect",
      sourceCardId: card.instanceId,
      targetCardId: card.instanceId,
      kind: "powerModifier",
      powerModifier: 2,
      duration: "turn",
      origin: "imperative",
      abilityIndex: 0,
    });

    // Effect should still be present during P2's turn.
    const effectDuringTurn = engine
      .getState()
      .G.activeEffects.find((e) => e.id === "test-p2-turn-effect");
    expect(effectDuringTurn).toBeDefined();

    // End P2's turn — effect is cleaned up.
    engine.passPhase({ as: P2 });

    const effectAfterTurn = engine
      .getState()
      .G.activeEffects.find((e) => e.id === "test-p2-turn-effect");
    expect(effectAfterTurn).toBeUndefined();
  });
});
