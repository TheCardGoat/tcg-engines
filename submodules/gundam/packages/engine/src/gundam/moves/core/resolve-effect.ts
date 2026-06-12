/**
 * Resolve Effect Move
 *
 * Resolves a pending entry of G.pendingEffects. The effect's controller
 * commits targets / "you may" choices via this move; the engine executes
 * the underlying CardEffect and pops the queue. Effects that require no
 * choice auto-resolve from the flow's onTransitionCheck drain — this move
 * is the manual entry point for effects that do need input (rules 10-3-3,
 * 10-3-3-1, and the "you may" branch of 10-1-3).
 *
 * Listed in every step's validMoves so it can be called whenever the
 * queue is non-empty. The runtime's active-player gate admits the caller
 * because `drainPendingEffects` shifts `ctx.status.activePlayer` to the
 * priority head's controller when it halts (and restores it when the
 * queue drains). The in-move validation below still enforces
 * controller-match and same-tier (`peersAtHead`) restrictions so rule
 * 10-1-6-5 / 6 / 8 are upheld.
 *
 * PR F.3 adds within-controller ordering (rule 10-1-6-5): when the caller
 * supplies `pendingEffectId`, that entry is resolved instead of the
 * priority head — provided it belongs to the caller and sits at the
 * current minimal tier. When omitted, behaviour is unchanged (resolve
 * the priority head).
 */

import type { ChooseOneDirective, Directive } from "@tcg/gundam-types";
import type { DeepReadonly } from "../../../types/move-types.ts";
import type { GundamMoveDefinition, PendingEffect } from "../../types.ts";
import { executeCardEffect } from "../../effects/executor.ts";
import {
  buildExecCtx,
  evaluateLegalTargets,
  findChoiceDirective,
  peersAtHead,
  priorityHead,
  priorityHeadIndex,
  runPostActions,
  validateDeckLookAnswer,
} from "../../effects/pending-effects.ts";
import { emitGundamLog } from "../../logging.ts";

/**
 * Recursively collect every `chooseOne` directive in `effect.directives`
 * keyed by the **top-level** index of the enclosing directive (matching
 * `executeDirectives`'s `topLevelIndex` semantics). Used by `validate` to
 * confirm the controller's `chooseOneAnswers` reference real directives
 * with in-range option indexes.
 */
function collectChooseOneDirectives(
  directives: readonly DeepReadonly<Directive>[],
): Map<number, DeepReadonly<ChooseOneDirective>> {
  const out = new Map<number, DeepReadonly<ChooseOneDirective>>();
  function walk(list: readonly DeepReadonly<Directive>[], topLevelIdx: number): void {
    for (const d of list) {
      if ("condition" in d) {
        walk(d.thenDirectives, topLevelIdx);
        if (d.elseDirectives) walk(d.elseDirectives, topLevelIdx);
      } else if ("kind" in d && (d as { kind?: string }).kind === "chooseOne") {
        out.set(topLevelIdx, d as DeepReadonly<ChooseOneDirective>);
      }
    }
  }
  for (let i = 0; i < directives.length; i++) {
    walk([directives[i]!], i);
  }
  return out;
}

export const resolveEffect: GundamMoveDefinition<"resolveEffect"> = {
  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;

    if (g.pendingEffects.length === 0) {
      return {
        valid: false,
        error: "No pending effect to resolve",
        errorCode: "NO_PENDING_EFFECT",
      };
    }

    const activePlayerId = framework.state.status.activePlayer as unknown as string;
    const requestedId = args?.pendingEffectId;

    let target: DeepReadonly<PendingEffect> | undefined;
    if (requestedId !== undefined) {
      target = g.pendingEffects.find((pe) => pe.id === requestedId);
      if (!target) {
        return {
          valid: false,
          error: `Pending effect ${requestedId} not found`,
          errorCode: "PENDING_EFFECT_NOT_FOUND",
        };
      }
      if (target.controllerId !== playerId) {
        return {
          valid: false,
          error: "Only the effect's controller can resolve it",
          errorCode: "NOT_EFFECT_CONTROLLER",
        };
      }
      // Rule 10-1-6-5: within a single controller's tier, the controller
      // picks order. They may NOT skip past:
      //  - a higher-priority tier (e.g. 【Burst】 must resolve before
      //    triggered per rule 10-1-6-8), and
      //  - another controller whose head sits at the same tier (rule
      //    10-1-6-6: active player's entries resolve before standby's
      //    within triggered effects).
      // Restrict to `peersAtHead` — same-tier, same-controller-as-head
      // entries. That's exactly the set surfaced by the `ordering` prompt.
      const peerIds = new Set(peersAtHead(g, activePlayerId).map((pe) => pe.id));
      if (!peerIds.has(target.id)) {
        return {
          valid: false,
          error: "Pending effect is not at the current priority tier",
          errorCode: "NOT_PRIORITY_TIER",
        };
      }
    } else {
      // Non-mutating head lookup so validate honours DeepReadonly<G>.
      target = priorityHead(g, activePlayerId);
      if (!target) {
        return {
          valid: false,
          error: "No pending effect to resolve",
          errorCode: "NO_PENDING_EFFECT",
        };
      }
      if (target.controllerId !== playerId) {
        return {
          valid: false,
          error: "Only the effect's controller can resolve it",
          errorCode: "NOT_EFFECT_CONTROLLER",
        };
      }
    }

    // Rule 10-1-8-1-1: targets pre-committed by the triggering move (e.g.
    // play-command / activate-ability validating at play time) are
    // immutable. resolveEffect may not overwrite them with a different
    // set — that would bypass the play-time validation.
    const suppliedTargets = args?.targets;
    if (suppliedTargets !== undefined && target.chosenTargets !== undefined) {
      return {
        valid: false,
        error: "Pending effect already has committed targets — cannot overwrite",
        errorCode: "TARGETS_ALREADY_COMMITTED",
      };
    }

    // Reject a no-op resolveEffect when the target still needs target
    // selection but the caller supplied no targets / no pre-committed
    // chosenTargets. Only targetSelection triggers MISSING_TARGETS —
    // pure-optional heads ("you may draw 1") don't need targets, and a
    // no-arg resolveEffect against them means "accept the default".
    // Evaluate the directive hypothetically (chosenTargets: undefined) so
    // a pre-committed effect still reports its directive kind correctly.
    const committedTargets = suppliedTargets ?? target.chosenTargets;
    const choice = findChoiceDirective({ ...target, chosenTargets: undefined }, { g, framework });
    if (committedTargets === undefined && choice?.kind === "targetSelection") {
      return {
        valid: false,
        error: "Pending effect requires target selection",
        errorCode: "MISSING_TARGETS",
      };
    }

    // Validate submitted chooseOne answers reference real directives and
    // in-range option indexes. Modal "do A or B" effects (rule-less; pure
    // card-text construct) — see `ChooseOneDirective`.
    const chooseOneAnswers = args?.chooseOneAnswers;
    if (chooseOneAnswers) {
      const chooseOnes = collectChooseOneDirectives(target.effect.directives);
      for (const [k, v] of Object.entries(chooseOneAnswers)) {
        const idx = Number(k);
        const directive = chooseOnes.get(idx);
        if (!directive) {
          return {
            valid: false,
            error: `chooseOneAnswers[${idx}] does not reference a chooseOne directive`,
            errorCode: "INVALID_CHOOSE_ONE_INDEX",
          };
        }
        if (!Number.isInteger(v) || v < 0 || v >= directive.options.length) {
          return {
            valid: false,
            error: `chooseOneAnswers[${idx}] = ${v} is out of range (0..${directive.options.length - 1})`,
            errorCode: "INVALID_CHOOSE_ONE_OPTION",
          };
        }
      }
    }

    // Reject a bare resolveEffect against a pending chooseOne head that
    // didn't come with an answer for that prompt's directiveIndex. The
    // executor would otherwise silently fall back to option 0, letting
    // an API client (or a buggy UI) bypass the controller's modal pick
    // — surfacing it as a validation failure forces an explicit choice.
    // The executor's option-0 default is preserved for triggered/burst
    // auto-drain (which never runs through resolveEffect).
    if (choice?.kind === "chooseOne") {
      const answeredIdx = chooseOneAnswers?.[choice.directiveIndex];
      if (typeof answeredIdx !== "number") {
        return {
          valid: false,
          error: "Pending effect requires a chooseOne answer",
          errorCode: "MISSING_CHOOSE_ONE_ANSWER",
        };
      }
    }

    if (choice?.kind === "deckLook") {
      if (
        choice.acceptOptionalDirectiveIndex !== undefined &&
        args?.optionalAnswers?.[choice.acceptOptionalDirectiveIndex] === false
      ) {
        // Declining the prerequisite optional skips the dependent deck-look
        // directive, so no deck routing answer is required.
      } else {
        if (
          choice.acceptOptionalDirectiveIndex !== undefined &&
          args?.optionalAnswers?.[choice.acceptOptionalDirectiveIndex] !== true
        ) {
          return {
            valid: false,
            error: "Pending deck-look effect requires accepting its optional prerequisite",
            errorCode: "MISSING_DECK_LOOK_OPTIONAL_ACCEPT",
          };
        }
        const answer = args?.deckLookAnswers?.[choice.directiveIndex];
        const validation = validateDeckLookAnswer(
          target,
          choice.directiveIndex,
          answer,
          g,
          framework,
        );
        if (!validation.valid) return validation;
      }
    }

    // Validate submitted targets against the effect's target filter (rule
    // 10-3-3). Only runs when the caller supplied targets — a no-target
    // resolve (e.g. answering only an optional directive) is unaffected.
    // Evaluate legality ignoring `target.chosenTargets` so the legal set
    // is the filter's natural candidate list, not the already-committed
    // subset (which would always pass trivially).
    if (suppliedTargets !== undefined) {
      // Reject duplicate IDs — the executor preserves duplicates when
      // intersecting chosenTargets with candidates, so a repeated ID could
      // apply an action multiple times to the same card.
      if (new Set(suppliedTargets).size !== suppliedTargets.length) {
        return {
          valid: false,
          error: "Targets must be unique",
          errorCode: "DUPLICATE_TARGETS",
        };
      }
      const resolution = evaluateLegalTargets(
        { ...target, chosenTargets: undefined },
        g,
        framework,
      );
      if (resolution) {
        const { legalTargetIds, minTargets, maxTargets } = resolution;
        const legalSet = new Set<string>(legalTargetIds);
        for (const id of suppliedTargets) {
          if (!legalSet.has(id)) {
            return {
              valid: false,
              error: `Target ${id} is not legal for this effect`,
              errorCode: "ILLEGAL_TARGET",
            };
          }
        }
        if (suppliedTargets.length < minTargets || suppliedTargets.length > maxTargets) {
          return {
            valid: false,
            error: `Expected between ${minTargets} and ${maxTargets} targets, got ${suppliedTargets.length}`,
            errorCode: "WRONG_TARGET_COUNT",
          };
        }
        for (const group of resolution.groups) {
          const groupLegalSet = new Set<string>(group.legalTargetIds);
          const groupCount = suppliedTargets.filter((id) => groupLegalSet.has(id)).length;
          if (groupCount < group.minTargets || groupCount > group.maxTargets) {
            return {
              valid: false,
              error: `Expected between ${group.minTargets} and ${group.maxTargets} targets for one target group, got ${groupCount}`,
              errorCode: "WRONG_TARGET_COUNT",
            };
          }
        }
      }
    }

    return { valid: true };
  },

  describeProcedure({ G, playerId, partialInput, framework }) {
    const g = G;
    if (g.pendingEffects.length === 0) return [{ kind: "confirm" as const }];

    const activePlayerId = framework.state.status.activePlayer as unknown as string;
    const requestedId = (partialInput as DeepReadonly<Record<string, unknown>>).pendingEffectId as
      | string
      | undefined;

    let target: DeepReadonly<PendingEffect> | undefined;
    if (requestedId !== undefined) {
      target = g.pendingEffects.find((pe) => pe.id === requestedId);
    } else {
      target = priorityHead(g, activePlayerId);
    }

    if (!target || target.controllerId !== playerId) {
      return [{ kind: "confirm" as const }];
    }

    if (target.chosenTargets !== undefined) {
      return [{ kind: "confirm" as const }];
    }

    const choice = findChoiceDirective({ ...target, chosenTargets: undefined }, { g, framework });
    if (choice?.kind === "targetSelection") {
      const resolution = evaluateLegalTargets(
        { ...target, chosenTargets: undefined },
        g,
        framework,
      );
      if (!resolution || resolution.legalTargetIds.length === 0) {
        return [{ kind: "confirm" as const }];
      }

      return [
        {
          kind: "selectTarget" as const,
          role: "targetSelection",
          candidateIds: resolution.legalTargetIds,
          minTargets: resolution.minTargets,
          maxTargets: resolution.maxTargets,
        },
      ];
    }

    return [{ kind: "confirm" as const }];
  },

  execute({ G, playerId, args, framework, cards }) {
    const g = G;
    const activePlayerId = framework.state.status.activePlayer as unknown as string;
    const requestedId = args?.pendingEffectId;

    let idx: number;
    if (requestedId !== undefined) {
      idx = g.pendingEffects.findIndex((pe) => pe.id === requestedId);
    } else {
      idx = priorityHeadIndex(g, activePlayerId);
    }
    if (idx < 0) return;

    const [pending] = g.pendingEffects.splice(idx, 1);
    if (!pending) return;

    // Prefer `pending.chosenTargets` over `args.targets` when both
    // are present — the triggering move pre-committed these at play time
    // (rule 10-1-8-1-1), and `validate` has already rejected any attempt
    // to overwrite them with `TARGETS_ALREADY_COMMITTED`. This is
    // defensive: if a caller somehow bypasses validate, honour the
    // committed set rather than the user override.
    const committed = pending.chosenTargets ?? args?.targets;
    const optionalAnswers = args?.optionalAnswers;
    const chooseOneAnswers = args?.chooseOneAnswers;
    const deckLookAnswers = args?.deckLookAnswers;

    const lifecycleCtx = { G: g, framework, cards };
    // Stash the resolving entry's originatingMoveId on G for the
    // duration of the executor + postActions so any nested enqueue
    // (rule 10-1-6-7 preempts, cascading triggers from inside the
    // effect body) inherits the same move group. Mirrors the stash in
    // `drainPendingEffects` — without this, the manual resolve path
    // (the common case: target selection, optional / chooseOne
    // prompts) would drop moveGroupId on every cascading trigger,
    // while the auto-drain path would keep it. Restored in a finally
    // block so peer heads don't leak the id.
    const prevMoveId = g.pendingEffectCurrentMoveId;
    g.pendingEffectCurrentMoveId = pending.originatingMoveId;
    try {
      executeCardEffect(
        pending.effect,
        {
          ...buildExecCtx(
            lifecycleCtx,
            { ...pending, chosenTargets: committed },
            { optionalAnswers, chooseOneAnswers, deckLookAnswers },
          ),
          sourcePlayerId: playerId,
        },
        { skipPairLinkRecheck: true },
      );
      runPostActions(pending.postActions, lifecycleCtx);
    } finally {
      g.pendingEffectCurrentMoveId = prevMoveId;
    }

    emitGundamLog(framework, {
      type: "gundam.pending.resolved",
      values: {
        effectId: pending.id,
        sourceCardId: pending.sourceCardId,
        moveGroupId: pending.originatingMoveId,
      },
      visibility: { mode: "PUBLIC" },
      category: "system",
    });
  },
};
