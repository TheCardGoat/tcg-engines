import type {
  ConditionalDirective,
  Directive,
  EffectAction,
  KeywordEffect,
  TargetFilter,
} from "@tcg/gundam-types";
import { parseDuration, parseKeywordEffectName } from "./helpers.ts";
import { parseCondition } from "./conditions.ts";
import { parseSingleAction, patchActionTarget, splitClauses } from "./actions.ts";
import { parseTargetFilter } from "./target-filter.ts";
import { parseTokenSpec } from "./token-spec.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Token branching
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the complex White Base-style token branching:
 * "deploy [A] if you have 0 Units, deploy [B] if only 1, or deploy [C] if 2+"
 */
function wrapAction(action: EffectAction): Directive {
  return { action };
}

function parseTokenChoice(text: string): Directive | undefined {
  const tokenPattern = `(\\[[^\\]]+\\]\\([^)]*(?:\\([^)]*\\)[^)]*)*\\))`;
  const match = text.match(
    new RegExp(
      `deploy\\s+1\\s+${tokenPattern}\\s+(?:Unit\\s+token\\s+)?or\\s+1\\s+${tokenPattern}\\s+Unit\\s+token`,
      "i",
    ),
  );
  if (!match) return undefined;
  const first = parseTokenSpec(match[1]);
  const second = parseTokenSpec(match[2]);
  if (!first || !second) return undefined;
  return {
    kind: "chooseOne",
    options: [first, second].map((token) => ({
      label: token.name,
      directives: [wrapAction({ action: "deployToken", token })],
    })),
  };
}

export function parseTokenBranchingClause(text: string): ConditionalDirective | undefined {
  // Match three branches separated by ", ... or "
  const branchPattern =
    /deploy\s+\d+\s+(\[[^\]]+\]\([^)]*(?:\([^)]*\)[^)]*)*\))\s+Unit\s+token\s+if\s+(you have\s+(?:no|only\s+\d+|\d+\s+or\s+more)\s+Units?\s+in\s+play)/gi;
  const matches = [...text.matchAll(branchPattern)];
  if (matches.length < 2) return undefined;

  interface ParsedBranch {
    condText: string;
    tokenText: string;
  }

  const parsed: ParsedBranch[] = matches.map((m) => ({
    condText: m[2],
    tokenText: m[1],
  }));

  function buildBranch(idx: number): ConditionalDirective | undefined {
    if (idx >= parsed.length) return undefined;
    const { condText, tokenText } = parsed[idx];
    const cond = parseCondition(condText);
    if (!cond) return undefined;
    const spec = parseTokenSpec(tokenText);
    if (!spec) return undefined;
    const thenDirectives: Directive[] = [wrapAction({ action: "deployToken", token: spec })];
    const elseBranch = buildBranch(idx + 1);
    return {
      condition: cond,
      thenDirectives,
      ...(elseBranch ? { elseDirectives: [elseBranch] } : {}),
    };
  }

  return buildBranch(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Steps parsing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse an action body string into ordered EffectSteps.
 * Handles:
 *  - "if you do, X" conditional chaining
 *  - bare "Choose N [target]" → pending target propagated to next action clause
 *  - multi-stat: "it gets AP+1 and HP+1" → two statModifier steps
 *  - stat+keyword combo: "it gets AP+1 and <Blocker>" → statModifier + grantKeyword
 */
export function parseSteps(body: string): Directive[] {
  if (!body) return [];
  const directives: Directive[] = [];
  const clauses = splitClauses(body);
  let i = 0;
  /** Target from a preceding bare "Choose N [target]" clause; applied to the next action. */
  let pendingTarget: TargetFilter | undefined;
  /** Most recent explicit Choose target for later “it” continuations. */
  let selectedTarget: TargetFilter | undefined;
  /**
   * True when the previous clause was "If you do, ...": the next emitted
   * directive is tagged with `dependsOnPrevious: true`. Cleared
   * as soon as a directive is emitted, so a single "If you do" only
   * gates a single follow-up directive.
   */
  let pendingDependsOnPrev = false;

  /** Push a directive, applying `pendingDependsOnPrev` if set. */
  function push(d: Directive): void {
    if (pendingDependsOnPrev && "action" in d) {
      directives.push({ ...d, dependsOnPrevious: true });
      pendingDependsOnPrev = false;
    } else {
      directives.push(d);
      if (pendingDependsOnPrev) pendingDependsOnPrev = false;
    }
  }

  while (i < clauses.length) {
    const clause = clauses[i].trim();
    if (!clause || clause.match(/^\(.*\)$/)) {
      i++;
      continue;
    } // skip explanations

    // “Draw N. Then, discard M.” is one staged action so the legal discard
    // candidates include the cards that were just drawn.
    const drawThenDiscardM = clause.match(/^draw (\d+)$/i);
    const discardAfterDrawM = clauses[i + 1]?.match(/^then,?\s+discard (\d+)\.?$/i);
    if (drawThenDiscardM && discardAfterDrawM) {
      push(
        wrapAction({
          action: "drawThenDiscard",
          drawCount: parseInt(drawThenDiscardM[1]),
          discardCount: parseInt(discardAfterDrawM[1]),
        }),
      );
      i += 2;
      continue;
    }

    if (/^then,?\s+/i.test(clause)) {
      clauses[i] = clause.replace(/^then,?\s+/i, "");
      continue;
    }

    if (
      /^if .*reveal \d+ .* card from your hand$/i.test(clause) &&
      /^return it to the bottom of your deck/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    // Tutor-style deck looks commonly print the reveal and random-bottom
    // routing as following sentences. They are one atomic deck-look action,
    // so parse them together instead of preserving the continuations as
    // unrelated unparsedText directives.
    if (/^look at the top (?:\d+ cards?|card) of your deck/i.test(clause)) {
      const revealClause = clauses[i + 1];
      if (
        revealClause &&
        /^(?:you may reveal \d+ |if it is .*you may reveal it and add it to your hand)/i.test(
          revealClause,
        )
      ) {
        const returnClause = clauses[i + 2];
        const consumesReturn = Boolean(
          returnClause && /^return (?:the|any) remaining cards?/i.test(returnClause),
        );
        const combined = [clause, revealClause, ...(consumesReturn ? [returnClause] : [])].join(
          ". ",
        );
        const action = parseSingleAction(combined);
        if (action) {
          push(wrapAction(action));
          i += consumesReturn ? 3 : 2;
          continue;
        }
      }
    }

    // A one-card look followed by its top-or-bottom routing is one action,
    // including when the look is the body of an If clause.
    if (
      /look at the top (?:\d+ cards?|card) of your deck/i.test(clause) &&
      /^return it to the top or bottom of your deck/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    if (
      /look at the top (?:\d+ cards?|card) of your deck/i.test(clause) &&
      /^place the remaining cards? into your trash/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    // "If you do, X" — mark the next emitted directive with
    // `dependsOnPrevious: true`. This encodes the card-text
    // connective as an inter-directive dependency; the executor evaluates
    // it left-to-right against whether the preceding directive actually
    // resolved — including optional-declined and targeted-without-targets
    // misses (see `packages/engine/src/gundam/effects/executor.ts`).
    //
    // splitClauses preserves the "If you do," marker on the clause that
    // follows the connective. Three shapes show up in the catalog:
    //   (a) "If you do, <action>." — single-clause, action inline.
    //   (b) "If you do, choose 1 X. <action> it." — bare Choose on this
    //       clause + action on the NEXT clause (bare-Choose propagation).
    //   (c) "If you do, <action>. <follow-up>." — action inline, another
    //       independent clause after.
    // For (a) / (c) we strip the marker, let the normal clause path emit
    // the directive, then patch `dependsOnPrevious` onto it.
    // For (b) the marker also propagates through the bare-Choose → next
    // clause chain via `pendingDependsOnPrev`.
    if (/^if you do[,.]/i.test(clause)) {
      const stripped = clause.replace(/^if you do[,.]?\s*/i, "");
      const previous = directives[directives.length - 1];
      const inlineAction = parseSingleAction(stripped);
      if (previous && "condition" in previous && inlineAction) {
        previous.thenDirectives.push({ action: inlineAction, dependsOnPrevious: true });
        i++;
        continue;
      }
      clauses[i] = stripped;
      pendingDependsOnPrev = true;
      // Do NOT increment `i`: re-process the stripped clause so its
      // action (or bare-Choose → next-clause chain) is emitted normally,
      // then patched with the dependency flag via `push()`.
      continue;
    }

    // Conditional "if" clause that introduces a branch — clear any pending target
    const ifM = clause.match(/^[Ii]f\s+(?!you do)(.*?)[,.]\s*(?:then\s+)?(.*)/s);
    if (ifM) {
      pendingTarget = undefined;
      const condText = ifM[1];
      let thenText = ifM[2];
      const isInstead = /\binstead\.?\s*$/i.test(thenText);
      if (isInstead) thenText = thenText.replace(/\s*instead\.?\s*$/i, "");
      const cond = parseCondition(condText);
      const tokenChoice = thenText ? parseTokenChoice(thenText) : undefined;
      const thenAction = thenText ? parseSingleAction(thenText) : undefined;
      if (cond) {
        // "instead" clause: merge with the previous conditional branch.
        // "If A, do X. If A and B, do Y instead." → if (A) { if (B) { Y } else { X } }
        if (isInstead && thenAction) {
          const prevBranch = directives.length > 0 ? directives[directives.length - 1] : undefined;
          if (prevBranch && "condition" in prevBranch) {
            const subConditions =
              cond.type === "and"
                ? cond.conditions.filter(
                    (c) => JSON.stringify(c) !== JSON.stringify(prevBranch.condition),
                  )
                : [cond];
            const innerCond =
              subConditions.length === 1
                ? subConditions[0]
                : { type: "and" as const, conditions: subConditions };
            directives[directives.length - 1] = {
              condition: prevBranch.condition,
              thenDirectives: [
                {
                  condition: innerCond,
                  thenDirectives: [wrapAction(thenAction)],
                  elseDirectives: prevBranch.thenDirectives,
                },
              ],
            };
            i++;
            continue;
          }
          if (prevBranch && "action" in prevBranch) {
            const previousAction = prevBranch.action;
            const inheritedAction =
              thenAction.action === "statModifier" && previousAction.action === "statModifier"
                ? { ...thenAction, duration: previousAction.duration }
                : thenAction.action === "dealDamage" && previousAction.action === "dealDamage"
                  ? { ...thenAction, target: previousAction.target }
                  : thenAction;
            directives[directives.length - 1] = {
              condition: cond,
              thenDirectives: [wrapAction(inheritedAction)],
              elseDirectives: [prevBranch],
            };
            i++;
            continue;
          }
        }
        const branch: ConditionalDirective = {
          condition: cond,
          thenDirectives: tokenChoice ? [tokenChoice] : thenAction ? [wrapAction(thenAction)] : [],
        };
        push(branch);
        i++;
        continue;
      }
    }

    // Token branching: "deploy X if you have 0 Units, deploy Y if only 1, or deploy Z if 2+"
    if (/deploy.*\[/.test(clause) && /if you have/.test(clause)) {
      const tokenBranch = parseTokenBranchingClause(clause);
      if (tokenBranch) {
        push(tokenBranch);
        i++;
        continue;
      }
    }

    // One unconditional self modifier followed by a Link-only keyword in the
    // same sentence. The qualification applies only after “if”, not to the
    // preceding stat modifier.
    const selfStatThenLinkKeywordM = clause.match(
      /this Unit gets (AP|HP)([+-]\d+) and,? if it is a Link Unit, it gains <([\w\s-]+?)(?:\s+(\d+))?>/i,
    );
    if (selfStatThenLinkKeywordM) {
      const keyword = parseKeywordEffectName(selfStatThenLinkKeywordM[3]);
      if (keyword) {
        const duration = parseDuration(clause);
        push(
          wrapAction({
            action: "statModifier",
            stat: selfStatThenLinkKeywordM[1].toLowerCase() as "ap" | "hp",
            amount: parseInt(selfStatThenLinkKeywordM[2]),
            duration,
            target: { owner: "self", cardType: "unit" },
          }),
        );
        push(
          wrapAction({
            action: "grantKeyword",
            keyword,
            ...(selfStatThenLinkKeywordM[4]
              ? { keywordValue: parseInt(selfStatThenLinkKeywordM[4]) }
              : {}),
            duration,
            target: { owner: "self", cardType: "unit", isLinkUnit: true },
          }),
        );
        i++;
        continue;
      }
    }

    // ── Multi-stat / stat+keyword combo ──────────────────────────────────────
    const handReductionM = clause.match(
      /this card in your hand gets Lv\.?\s*-(\d+) and cost -(\d+) for each enemy Unit in play/i,
    );
    if (handReductionM) {
      const countFilter: TargetFilter = {
        owner: "opponent",
        cardType: "unit",
        zone: "battleArea",
      };
      const target: TargetFilter = {
        owner: "self",
        cardType: "unit",
        zone: "hand",
      };
      push(
        wrapAction({
          action: "levelReductionByCount",
          amountPerMatch: parseInt(handReductionM[1]),
          countFilter,
          target,
        }),
      );
      push(
        wrapAction({
          action: "costReductionByCount",
          amountPerMatch: parseInt(handReductionM[2]),
          countFilter,
          target,
        }),
      );
      i++;
      continue;
    }

    const allStatMs = [...clause.matchAll(/\b(AP|HP|cost)\s*([+-])\s*(\d+)/gi)];
    const allKwMs: Array<{ kw: KeywordEffect; val: number | undefined }> = [];
    for (const m of clause.matchAll(/<([\w\s-]+?)(?:\s+(\d+))?>/g)) {
      const kw = parseKeywordEffectName(m[1]);
      if (kw) allKwMs.push({ kw, val: m[2] !== undefined ? parseInt(m[2]) : undefined });
    }
    if (
      /gets?\b/i.test(clause) &&
      (allStatMs.length > 1 || (allStatMs.length >= 1 && allKwMs.length >= 1))
    ) {
      const clauseForTarget = clause.replace(/<[\w\s-]+?(?:\s+\d+)?>/g, "").trim();
      const target = pendingTarget ?? parseTargetFilter(clauseForTarget);
      pendingTarget = undefined;
      const duration = parseDuration(clause);
      for (const m of allStatMs) {
        push(
          wrapAction({
            action: "statModifier",
            stat: m[1].toLowerCase() as "ap" | "hp" | "cost",
            amount: parseInt(m[2] + m[3]),
            duration,
            target,
          }),
        );
      }
      for (const { kw, val } of allKwMs) {
        push(
          wrapAction({
            action: "grantKeyword",
            keyword: kw,
            ...(val !== undefined ? { keywordValue: val } : {}),
            duration,
            target,
          }),
        );
      }
      i++;
      continue;
    }

    // ── Bare "Choose N [target]" — no embedded action ────────────────────────
    if (/^[Cc]hoose\b/.test(clause)) {
      const action = parseSingleAction(clause);
      if (action) {
        push(wrapAction(action));
      } else {
        const chooseM = clause.match(/^[Cc]hoose (\d+)(?:\s+to\s+(\d+))?\s+(.*)/);
        if (chooseM) {
          pendingTarget = parseTargetFilter(chooseM[3].trim());
          if (chooseM[2]) {
            pendingTarget.count = { min: parseInt(chooseM[1]), max: parseInt(chooseM[2]) };
          } else {
            pendingTarget.count = parseInt(chooseM[1]);
          }
        }
      }
      i++;
      continue;
    }

    // ── Pending target: apply to the next action clause ──────────────────────
    if (pendingTarget) {
      const action = parseSingleAction(clause);
      if (action) {
        push(wrapAction(patchActionTarget(action, pendingTarget)));
        selectedTarget = pendingTarget;
        pendingTarget = undefined;
      }
      i++;
      continue;
    }

    if (selectedTarget && /^it\b/i.test(clause)) {
      const action = parseSingleAction(clause);
      if (action) {
        push(wrapAction(patchActionTarget(action, selectedTarget)));
        i++;
        continue;
      }
    }

    const action = parseSingleAction(clause) ?? { action: "unparsedText" as const, text: clause };
    push(/^you may\b/i.test(clause) ? { action, optional: true } : wrapAction(action));
    i++;
  }

  return directives;
}
