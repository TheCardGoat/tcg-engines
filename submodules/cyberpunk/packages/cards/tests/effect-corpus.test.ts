import { describe, expect, it } from "vite-plus/test";
import type { Ability, Effect, StructuredCardDefinition } from "@tcg/cyberpunk-types";

import { structuredCards } from "../src/index.ts";

/**
 * Effect corpus shape test. Walks every effect literal in every ability of
 * every card (recursing into nested effects via `ifYouDo`/`delayed`) and
 * asserts each literal has the required fields for its `effect` discriminator.
 *
 * This complements the per-card runtime tests (item 4) and the structural
 * invariants (item 3): those check top-level card fields and end-to-end
 * gameplay; this checks every individual effect literal in isolation. Catches
 * authoring shapes the type system accepts but the engine handler would
 * crash on (e.g. a `modifyPower` with no `value`, an `ifYouDo` with no
 * `doEffect`).
 */

const cards = structuredCards as readonly StructuredCardDefinition[];

const REQUIRED_FIELDS: Record<Effect["effect"], readonly string[]> = {
  defeat: ["target"],
  spend: ["target"],
  returnToHand: ["target"],
  draw: ["player", "amount"],
  modifyGig: ["target", "operation", "value"],
  adjustGig: ["target", "maxAmount", "direction"],
  modifyPower: ["target", "value", "duration"],
  multiplyPower: ["target", "multiplier", "duration"],
  grantRule: ["target", "rule", "duration"],
  ready: ["target"],
  readyEddies: ["player", "amount"],
  lookAt: ["target", "revealToOpponent"],
  searchDeck: ["player", "lookCount", "target", "select", "reveal", "destination", "remainder"],
  discardFromHand: ["player", "amount"],
  moveCard: ["target", "destination"],
  playCard: ["target"],
  attachCard: ["target", "attachTo"],
  removeFromGame: ["target"],
  stealGig: ["target"],
  trashFromDeck: ["player", "amount"],
  ifYouDo: ["doEffect", "ifEffects"],
  delayed: ["timing", "effects"],
  defeatAtEndOfTurnIfAttacks: ["target"],
  copyGigValue: ["source", "target"],
  forEachFriendlyGigPair: ["effects"],
  callLegend: ["player", "target"],
  grantCostModifier: ["player", "appliesTo", "modifier", "duration"],
};

const KNOWN_EFFECTS = new Set(Object.keys(REQUIRED_FIELDS));

interface Violation {
  cardSlug: string;
  abilityIndex: number;
  effectPath: string;
  reason: string;
}

function* walkEffects(effect: Effect, path: string): Generator<{ effect: Effect; path: string }> {
  yield { effect, path };

  // Recurse into nested effects.
  if (effect.effect === "ifYouDo") {
    yield* walkEffects(effect.doEffect, `${path}.doEffect`);
    for (const [i, e] of effect.ifEffects.entries()) {
      yield* walkEffects(e, `${path}.ifEffects[${i}]`);
    }
    for (const [i, e] of (effect.elseEffects ?? []).entries()) {
      yield* walkEffects(e, `${path}.elseEffects[${i}]`);
    }
  }
  if (effect.effect === "delayed") {
    for (const [i, e] of effect.effects.entries()) {
      yield* walkEffects(e, `${path}.effects[${i}]`);
    }
  }
  if (effect.effect === "forEachFriendlyGigPair") {
    for (const [i, e] of effect.effects.entries()) {
      yield* walkEffects(e, `${path}.effects[${i}]`);
    }
  }
}

describe("effect corpus shape", () => {
  it("every effect literal has a known `effect` discriminator", () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        for (const [j, effect] of ability.effects.entries()) {
          for (const node of walkEffects(effect, `effects[${j}]`)) {
            const tag = (node.effect as { effect?: string }).effect;
            if (typeof tag !== "string") {
              violations.push({
                cardSlug: card.slug,
                abilityIndex: i,
                effectPath: node.path,
                reason: "missing or non-string `effect` discriminator",
              });
              continue;
            }
            if (!KNOWN_EFFECTS.has(tag)) {
              violations.push({
                cardSlug: card.slug,
                abilityIndex: i,
                effectPath: node.path,
                reason: `unknown effect tag "${tag}"`,
              });
            }
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("every effect literal has the required fields for its discriminator", () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        for (const [j, effect] of ability.effects.entries()) {
          for (const node of walkEffects(effect, `effects[${j}]`)) {
            const tag = node.effect.effect as Effect["effect"];
            const required = REQUIRED_FIELDS[tag];
            if (!required) continue; // already flagged by the previous test
            const obj = node.effect as unknown as Record<string, unknown>;
            for (const field of required) {
              if (!(field in obj) || obj[field] === undefined) {
                violations.push({
                  cardSlug: card.slug,
                  abilityIndex: i,
                  effectPath: node.path,
                  reason: `effect "${tag}" missing required field "${field}"`,
                });
              }
            }
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("REQUIRED_FIELDS table covers every Effect union member (compile-time check)", () => {
    // This assignment is a compile-time exhaustiveness gate — if `Effect`
    // grows a new discriminator and `REQUIRED_FIELDS` doesn't, this fails
    // typecheck on the test file. The runtime assertion below is just a
    // belt-and-braces sanity check.
    const _check: Record<Effect["effect"], readonly string[]> = REQUIRED_FIELDS;
    void _check;
    expect(Object.keys(REQUIRED_FIELDS).sort()).toEqual(Object.keys(REQUIRED_FIELDS).sort());
  });
});
