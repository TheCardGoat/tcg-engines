/**
 * Catalog lock for ranged and joint chooses.
 *
 *  - "Choose 1 to N" must be `{ min: 1, max: N }`, not exact N.
 *  - "You may choose 1 to N" / "up to N" is optional + that range
 *    (decline = zero; accept still needs at least one).
 *  - "Choose 1 A and 1 B" later sibling must share the first printed
 *    selection so both groups gate activation together (Mikazuki-style).
 */
import { describe, expect, it } from "vite-plus/test";
import type { Card, CardEffect, Directive, EffectDirective, TargetFilter } from "@tcg/gundam-types";
import * as cardExports from "./index.ts";

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    "canonicalId" in value &&
    "type" in value
  );
}

function isEffectDirective(directive: Directive): directive is EffectDirective {
  return typeof directive === "object" && directive !== null && "action" in directive;
}

function collectActions(directives: readonly Directive[]): EffectDirective[] {
  const out: EffectDirective[] = [];
  for (const directive of directives) {
    if ("condition" in directive && "thenDirectives" in directive) {
      out.push(...collectActions(directive.thenDirectives));
      if (directive.elseDirectives) out.push(...collectActions(directive.elseDirectives));
      continue;
    }
    if ("kind" in directive && directive.kind === "chooseOne") {
      for (const option of directive.options) out.push(...collectActions(option.directives));
      continue;
    }
    if (isEffectDirective(directive)) out.push(directive);
  }
  return out;
}

function targetCount(filter: TargetFilter | undefined): unknown {
  return filter?.count;
}

const canonicalCards = new Map<string, Card>();
for (const value of Object.values(cardExports)) {
  if (isCard(value)) canonicalCards.set(value.canonicalId, value);
}

const cards = [...canonicalCards.values()].sort((a, b) =>
  a.cardNumber.localeCompare(b.cardNumber, "en", { numeric: true }),
);

describe("ranged and joint choose encodings", () => {
  it("encodes printed Choose 1 to N as a min/max range", () => {
    const rangeRe = /choose\s+1\s+to\s+(\d+)/i;
    const gaps: string[] = [];
    for (const card of cards) {
      for (const [effectIndex, effect] of ((card.effects ?? []) as CardEffect[]).entries()) {
        const text = effect.sourceText ?? "";
        const match = rangeRe.exec(text);
        if (!match) continue;
        const max = Number(match[1]);
        const actions = collectActions(effect.directives);
        const ranged = actions.some((directive) => {
          const action = directive.action as {
            target?: TargetFilter;
            unit?: TargetFilter;
            eventSourceFilter?: TargetFilter;
            exResourceUnitCount?: { min: number; max: number };
          };
          const counts = [
            targetCount(action.target),
            targetCount(action.unit),
            targetCount(action.eventSourceFilter),
            action.exResourceUnitCount,
          ];
          return counts.some(
            (count) =>
              typeof count === "object" &&
              count !== null &&
              "min" in count &&
              (count as { min: number; max: number }).min === 1 &&
              (count as { min: number; max: number }).max === max,
          );
        });
        if (!ranged) {
          gaps.push(`${card.name} (${card.cardNumber}) effect[${effectIndex}]: ${text}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it("marks the later group of a printed choose-A-and-B as the same selection", () => {
    const jointRe = /choose 1 .+ and 1 /i;
    const gaps: string[] = [];
    for (const card of cards) {
      for (const [effectIndex, effect] of ((card.effects ?? []) as CardEffect[]).entries()) {
        const text = effect.sourceText ?? "";
        if (!jointRe.test(text)) continue;
        const actions = collectActions(effect.directives).filter((directive) => {
          const action = directive.action as { target?: TargetFilter; unit?: TargetFilter };
          const counts = [targetCount(action.target), targetCount(action.unit)];
          return counts.some(
            (count) => count === 1 || (typeof count === "object" && count !== null),
          );
        });
        if (actions.length < 2) continue;
        const later = actions.slice(1);
        if (
          later.some(
            (directive) => !directive.sharesTargetChoiceWithPrevious && !directive.optional,
          )
        ) {
          gaps.push(`${card.name} (${card.cardNumber}) effect[${effectIndex}]: ${text}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });
});
