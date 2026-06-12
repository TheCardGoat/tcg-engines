import { describe, expect, it } from "vite-plus/test";
import type { Ability, StructuredCardDefinition } from "@tcg/cyberpunk-types";

import { structuredCards } from "../src/index.ts";

// Iterating `structuredCards` narrows each card to its concrete literal type,
// which loses access to optional fields (like `attachment` on non-gear cards)
// and widens `reminderText` from `never[]` back to `string[]`. Cast to the
// declared discriminated-union type at the iteration boundary.
const cards = structuredCards as readonly StructuredCardDefinition[];

/**
 * Authoring-convention checks over `structuredCards`. Each rule encodes a
 * convention that exists today but is not enforced by the type system, so a
 * future card could land breaking the convention without any compile error.
 *
 * Catching these at authoring time keeps card files uniform and prevents
 * silent gameplay drift (e.g. missing reminder text, ability shape mismatches
 * the ability kind).
 */

const PROGRAM_REMINDER = "Discard programs after they resolve.";

interface Violation {
  cardSlug: string;
  rule: string;
  detail: string;
}

describe("card authoring conventions", () => {
  it('every `kind: "keyword"` ability has a non-empty `keyword` field', () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        if (ability.kind !== "keyword") continue;
        if (!ability.keyword) {
          violations.push({
            cardSlug: card.slug,
            rule: "keyword-ability-has-keyword",
            detail: `abilities[${i}] kind="keyword" but keyword field is missing`,
          });
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('every `kind: "keyword"` and `kind: "triggered"` ability has a `source`', () => {
    // Why: matchTriggers' broadcast pass uses `source.selector === "host"` to
    // detect gear-attached abilities. Triggered abilities without `source`
    // would never fire as host-sourced. Keyword abilities don't currently
    // depend on source for dispatch but the convention keeps the shape
    // uniform — every non-static ability declares its source explicitly.
    const violations: Violation[] = [];
    for (const card of cards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        if (ability.kind !== "keyword" && ability.kind !== "triggered") continue;
        if (!ability.source) {
          violations.push({
            cardSlug: card.slug,
            rule: "keyword-or-triggered-ability-has-source",
            detail: `abilities[${i}] kind="${ability.kind}" but source field is missing`,
          });
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('every `kind: "triggered"` ability has a `trigger` field', () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        if (ability.kind !== "triggered") continue;
        if (!ability.trigger) {
          violations.push({
            cardSlug: card.slug,
            rule: "triggered-ability-has-trigger",
            detail: `abilities[${i}] kind="triggered" but trigger field is missing`,
          });
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("non-keyword abilities have implemented effects or a card-level cost modifier", () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        if (ability.kind === "keyword") continue;
        if (ability.effects.length > 0) continue;
        if (card.costModifier) continue;
        violations.push({
          cardSlug: card.slug,
          rule: "non-keyword-ability-has-effect",
          detail: `abilities[${i}] kind="${ability.kind}" has printed text but no effects`,
        });
      }
    }
    expect(violations).toEqual([]);
  });

  it('`kind: "static"` abilities do not have a `trigger` field', () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        if (ability.kind !== "static") continue;
        if (ability.trigger !== undefined) {
          violations.push({
            cardSlug: card.slug,
            rule: "static-ability-no-trigger",
            detail: `abilities[${i}] kind="static" but has a trigger — use kind="triggered"`,
          });
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("every gear card has a non-null attachment", () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      if (card.type !== "gear") continue;
      if (!card.attachment) {
        violations.push({
          cardSlug: card.slug,
          rule: "gear-has-attachment",
          detail: "type='gear' but attachment is missing or null",
        });
      }
    }
    expect(violations).toEqual([]);
  });

  it("non-gear cards have no attachment (it would be ignored)", () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      if (card.type === "gear") continue;
      if (card.attachment) {
        violations.push({
          cardSlug: card.slug,
          rule: "non-gear-no-attachment",
          detail: `type='${card.type}' should not have an attachment`,
        });
      }
    }
    expect(violations).toEqual([]);
  });

  it("every program card includes the standard 'Discard programs after they resolve.' reminder", () => {
    const violations: Violation[] = [];
    for (const card of cards) {
      if (card.type !== "program") continue;
      if (!card.reminderText.includes(PROGRAM_REMINDER)) {
        violations.push({
          cardSlug: card.slug,
          rule: "program-has-discard-reminder",
          detail: `program is missing reminderText="${PROGRAM_REMINDER}"`,
        });
      }
    }
    expect(violations).toEqual([]);
  });
});
