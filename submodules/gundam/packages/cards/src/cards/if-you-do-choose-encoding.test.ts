/**
 * Catalog lock: printed "If you do, choose …" must be a later segment.
 *
 * Rule 5-20-1: the portion after "If you do" does not run unless the
 * preceding portion resolved. Encode that as `dependsOnPrevious` on the
 * later choose, or as `resolveThenQueue` / a compound whose follow-up
 * only enqueues when the first step resolved.
 */
import { describe, expect, it } from "vite-plus/test";
import type { Card, CardEffect, Directive, EffectDirective } from "@tcg/gundam-types";
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

function hasCountedPublicChoose(directive: EffectDirective): boolean {
  type CountedFilter = { count?: unknown; zone?: string; owner?: string };
  const action = directive.action as {
    target?: CountedFilter;
    unit?: CountedFilter;
    referenceTarget?: CountedFilter;
    filter?: CountedFilter;
  };
  const filters = [action.target, action.unit, action.referenceTarget, action.filter].filter(
    (filter): filter is NonNullable<typeof filter> => filter !== undefined,
  );
  return filters.some((filter) => {
    if (filter.owner === "self") return false;
    const zone = "zone" in filter ? filter.zone : undefined;
    if (zone === "hand" || zone === "deck" || zone === "shieldArea") return false;
    const count = filter.count;
    if (count === undefined || count === "all") return false;
    if (typeof count === "number") return count > 0;
    return (
      typeof count === "object" &&
      count !== null &&
      "min" in count &&
      (count as { min: number }).min > 0
    );
  });
}

function laterChooseIsGated(directive: EffectDirective): boolean {
  if (directive.dependsOnPrevious) return true;
  if (directive.sharesTargetChoiceWithPrevious) return true;
  if (directive.action.action === "resolveThenQueue") return true;
  return false;
}

function collectUngatedIfYouDoChooses(
  directives: readonly Directive[],
  path: string,
  seenPriorAction: boolean,
): string[] {
  const gaps: string[] = [];
  for (const [index, directive] of directives.entries()) {
    const here = `${path}[${index}]`;
    if ("condition" in directive && "thenDirectives" in directive) {
      gaps.push(
        ...collectUngatedIfYouDoChooses(directive.thenDirectives, `${here}.then`, seenPriorAction),
      );
      if (directive.elseDirectives) {
        gaps.push(
          ...collectUngatedIfYouDoChooses(
            directive.elseDirectives,
            `${here}.else`,
            seenPriorAction,
          ),
        );
      }
      seenPriorAction = true;
      continue;
    }
    if ("kind" in directive && directive.kind === "chooseOne") {
      for (const [optionIndex, option] of directive.options.entries()) {
        gaps.push(
          ...collectUngatedIfYouDoChooses(
            option.directives,
            `${here}.options[${optionIndex}]`,
            seenPriorAction,
          ),
        );
      }
      seenPriorAction = true;
      continue;
    }
    if (!isEffectDirective(directive)) continue;
    if (directive.action.action === "resolveThenQueue") {
      seenPriorAction = true;
      continue;
    }
    if (seenPriorAction && hasCountedPublicChoose(directive) && !laterChooseIsGated(directive)) {
      gaps.push(here);
    }
    seenPriorAction = true;
  }
  return gaps;
}

const IF_YOU_DO_CHOOSE = /if you do,\s*choose/i;

const canonicalCards = new Map<string, Card>();
for (const value of Object.values(cardExports)) {
  if (isCard(value)) canonicalCards.set(value.canonicalId, value);
}

const cardsWithPrintedIfYouDoChoose = [...canonicalCards.values()]
  .filter((card) => {
    const printed = [
      card.effect,
      card.rulesText,
      ...(card.effects ?? []).map((effect) => effect.sourceText),
    ];
    return printed.some((text) => typeof text === "string" && IF_YOU_DO_CHOOSE.test(text));
  })
  .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber, "en", { numeric: true }));

describe("If you do, choose encoding", () => {
  it("finds printed If-you-do-choose abilities in the catalog", () => {
    expect(cardsWithPrintedIfYouDoChoose.length).toBeGreaterThan(0);
  });

  it("gates every later choose after If you do", () => {
    const gaps: string[] = [];
    for (const card of cardsWithPrintedIfYouDoChoose) {
      for (const [effectIndex, effect] of ((card.effects ?? []) as CardEffect[]).entries()) {
        const text = effect.sourceText ?? "";
        if (!IF_YOU_DO_CHOOSE.test(text)) {
          const onlyEffect = (card.effects ?? []).length === 1;
          const printed = `${card.effect ?? ""}\n${card.rulesText ?? ""}`;
          if (!onlyEffect || !IF_YOU_DO_CHOOSE.test(printed)) continue;
        }
        for (const gap of collectUngatedIfYouDoChooses(
          effect.directives,
          `${card.cardNumber} effect[${effectIndex}]`,
          false,
        )) {
          gaps.push(`${card.name} (${gap})`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });
});
