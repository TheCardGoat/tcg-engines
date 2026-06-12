/**
 * Regression coverage for PR #73 (merge of targeting.ts into derived-state.ts).
 *
 * Verifies that a Constant effect applying an AP statModifier is reflected in
 *   (a) getEffectiveStats(...) when called with `framework`, and
 *   (b) TargetResolutionContext.getCardAP, so that attributeFilters on `ap`
 *       see modified AP values during target resolution.
 *
 * Also exercises the recursion-guard path: `getEffectiveStats` uses
 * `buildTargetResolutionContext(..., { recursionGuard: true })` when evaluating
 * a Constant effect's own target filter. If the guard were missing, evaluating
 * an ap-based attributeFilter on a Constant effect's target would recurse
 * indefinitely (ap lookup → Constant-effect scan → ap lookup → ...). This
 * test completing without a stack overflow is the recursion-termination check.
 */

import { describe, it, expect } from "vite-plus/test";
import "../testing/register-matchers.ts";
import type { CardEffect } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockResource,
  getEffectiveStats,
  buildTargetResolutionContext,
} from "../../index.ts";
import { evaluateTargetFilter } from "../../runtime/target-dsl.ts";
import type { TestCardEntry } from "../../index.ts";

function active(card: ReturnType<typeof createMockResource>): TestCardEntry {
  return { card, exhausted: false };
}
function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(createMockResource()));
}

describe("Constant-effect AP modifiers are visible to target-DSL filters", () => {
  // Buffer: Constant effect — friendly units get AP+2
  const apBuffEffect: CardEffect = {
    type: "constant",
    activation: {},
    directives: [
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 2,
          duration: "permanent",
          target: { owner: "friendly", cardType: "unit" },
        },
      },
    ],
    sourceText: "All friendly Units get AP+2.",
  };

  function setupEngine() {
    const buffer = createMockUnit({ name: "Buffer", ap: 1, hp: 3, effects: [apBuffEffect] });
    const target = createMockUnit({ name: "Target", ap: 3, hp: 3 });
    const enemy = createMockUnit({ name: "Enemy", ap: 3, hp: 3 });

    const engine = GundamTestEngine.create(
      { play: [buffer, target], resourceArea: resources(3) },
      { play: [enemy] },
    );

    const runtime = engine.getRuntime();
    const bufferId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, buffer.cardNumber)!;
    const targetId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, target.cardNumber)!;
    const enemyId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemy.cardNumber)!;

    return { engine, runtime, bufferId, targetId, enemyId };
  }

  it("getEffectiveStats includes the Constant AP modifier when framework is passed", () => {
    const { engine, runtime, targetId } = setupEngine();
    const framework = runtime.getFrameworkReadAPI();
    const G = engine.getG();

    // Base AP is 3; buff grants +2 → effective AP should be 5.
    const stats = getEffectiveStats(targetId, G, framework.cards, framework);
    expect(stats.ap).toBe(5);

    // Without `framework`, Constant effects are skipped → base AP only.
    const baseStats = getEffectiveStats(targetId, G, framework.cards);
    expect(baseStats.ap).toBe(3);
  });

  it("evaluateTargetFilter with an ap attributeFilter reflects Constant-modified AP", () => {
    const { engine, runtime, bufferId, targetId, enemyId } = setupEngine();
    const framework = runtime.getFrameworkReadAPI();
    const G = engine.getG();

    // Build context from p1's perspective. recursionGuard omitted →
    // getCardAP must include Constant-effect modifiers.
    const ctx = buildTargetResolutionContext(G, PLAYER_ONE, framework);

    const allCards = [
      ...framework.zones.getCards({ zone: "battleArea", playerId: PLAYER_ONE }),
      ...framework.zones.getCards({ zone: "battleArea", playerId: PLAYER_TWO }),
    ]
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    // Buffed target (AP 3+2=5) matches ap>=5; unbuffed enemy (AP 3) does not.
    // Friendly-side filter: from p1's perspective, buffer & target are friendly.
    const matchedGte5 = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [{ attribute: "ap", comparison: "gte", value: 5 }],
      },
      allCards,
      ctx,
    );
    expect(matchedGte5).toContain(targetId);
    // Buffer itself also gets AP+2 (1+2=3) — should NOT match gte 5.
    expect(matchedGte5).not.toContain(bufferId);
    // Enemy unit is opponent-owned; friendly filter excludes it regardless.
    expect(matchedGte5).not.toContain(enemyId);

    // Enemy is not buffed by p1's Constant (different owner) → AP still 3.
    // Filter over any-owned units with ap<=3 should include the enemy but not target.
    const matchedLte3 = evaluateTargetFilter(
      {
        owner: "any",
        cardType: "unit",
        attributeFilters: [{ attribute: "ap", comparison: "lte", value: 3 }],
      },
      allCards,
      ctx,
    );
    expect(matchedLte3).toContain(enemyId);
    expect(matchedLte3).toContain(bufferId); // base 1 + buff 2 = 3, matches lte 3
    expect(matchedLte3).not.toContain(targetId); // 5 does not satisfy lte 3
  });

  it("does not infinitely recurse when a Constant effect's target filter is evaluated", () => {
    // Setup alone exercises the recursion-guarded path: getEffectiveStats is
    // called, which evaluates the Constant effect's target filter, which must
    // not trigger another round of Constant-effect evaluation. If the guard
    // regressed, this test would crash with a stack overflow.
    const { engine, runtime, targetId } = setupEngine();
    const framework = runtime.getFrameworkReadAPI();
    const G = engine.getG();

    // Just call getEffectiveStats — the assertion is that it returns.
    const stats = getEffectiveStats(targetId, G, framework.cards, framework);
    expect(stats.ap).toBe(5);
  });
});
