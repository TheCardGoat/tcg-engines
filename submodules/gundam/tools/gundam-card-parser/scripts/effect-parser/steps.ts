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

export function parseTokenBranchingClause(text: string): ConditionalDirective | undefined {
  // Match three branches separated by ", ... or "
  const branchPattern =
    /deploy\s+\d+\s+(\[[^\]]+\]\([^)]*(?:\([^)]*\)[^)]*)*\))\s+Unit\s+token\s+if\s+(you have\s+\d+[^,]+)/gi;
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
      clauses[i] = clause.replace(/^if you do[,.]?\s*/i, "");
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
        }
        const branch: ConditionalDirective = {
          condition: cond,
          thenDirectives: thenAction ? [wrapAction(thenAction)] : [],
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

    // ── Multi-stat / stat+keyword combo ──────────────────────────────────────
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
        pendingTarget = undefined;
      }
      i++;
      continue;
    }

    const action = parseSingleAction(clause);
    push(wrapAction(action ?? { action: "unparsedText", text: clause }));
    i++;
  }

  return directives;
}
