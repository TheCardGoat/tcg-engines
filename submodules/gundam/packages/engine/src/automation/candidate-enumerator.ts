import type { PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { GundamMoveName } from "../gundam/moves/move-name.ts";
import {
  enumerateAvailableMovesDetailed,
  type AvailableMove,
} from "../runtime/match-runtime.queries.ts";
import { getMoveProcedure } from "../runtime/match-runtime.procedure.ts";
import type { MatchStaticResources } from "../runtime/static-resources.ts";

import { commandToCandidate, type GundamBotCandidate } from "./candidate-types.ts";
import { seedPrimaryCardInput, selectTargetInputBinding } from "./move-binding.ts";
import {
  buildPendingChoicePrompt,
  findChoiceDirective,
  priorityHead,
} from "../gundam/effects/pending-effects.ts";
import type { DeckLookAnswer, GundamG } from "../gundam/types.ts";
import { buildReadAPI } from "../runtime/match-runtime.queries.ts";

/**
 * Inspect the pending-effect priority head for the given player; if its
 * choice is an `optional` "you may" directive, return the directive's
 * index so the enumerator can fan out the accept and decline candidate
 * forms. Returns `null` for any other prompt kind (target-selection /
 * ordering / no choice / not this player's priority).
 */
function findOptionalHeadDirectiveIndex(state: MatchState, playerId: PlayerId): number | null {
  const g = state.G as unknown as GundamG;
  if (!g.pendingEffects || g.pendingEffects.length === 0) return null;
  const activePlayerId = state.ctx.status.activePlayer as unknown as string;
  const head = priorityHead(g, activePlayerId);
  if (!head) return null;
  if (head.controllerId !== (playerId as unknown as string)) return null;
  const choice = findChoiceDirective(head);
  if (!choice || choice.kind !== "optional") return null;
  return choice.directiveIndex;
}

/**
 * Mirror of `findOptionalHeadDirectiveIndex` for `chooseOne` modal
 * prompts. When the priority head asks the given player to pick one of
 * N options, return `{ directiveIndex, optionCount }` so the enumerator
 * can fan out one candidate per option. Returns `null` otherwise.
 */
function findChooseOneHeadShape(
  state: MatchState,
  playerId: PlayerId,
): { directiveIndex: number; optionCount: number } | null {
  const g = state.G as unknown as GundamG;
  if (!g.pendingEffects || g.pendingEffects.length === 0) return null;
  const activePlayerId = state.ctx.status.activePlayer as unknown as string;
  const head = priorityHead(g, activePlayerId);
  if (!head) return null;
  if (head.controllerId !== (playerId as unknown as string)) return null;
  const choice = findChoiceDirective(head);
  if (!choice || choice.kind !== "chooseOne") return null;
  return { directiveIndex: choice.directiveIndex, optionCount: choice.directive.options.length };
}

function findDeckLookHeadAnswer(
  state: MatchState,
  staticResources: MatchStaticResources,
  playerId: PlayerId,
): {
  directiveIndex: number;
  acceptOptionalDirectiveIndex?: number;
  answer: DeckLookAnswer;
} | null {
  const g = state.G as unknown as GundamG;
  const prompt = buildPendingChoicePrompt(
    g,
    buildReadAPI(state, staticResources),
    state.ctx.status.activePlayer as unknown as string,
  );
  if (!prompt || prompt.kind !== "deckLook") return null;
  if (prompt.controllerId !== (playerId as unknown as string)) return null;

  const tutorCardId = prompt.legalTutorCardIds[0];
  const remaining = prompt.revealedCardIds.filter((id) => id !== tutorCardId);
  const answer: DeckLookAnswer = tutorCardId ? { tutorCardId } : {};

  if (prompt.returnMode === "topOrTrash") {
    answer.toTrash = remaining;
  } else if (prompt.returnMode === "topAndBottom") {
    if (remaining.length === 1) {
      answer.toBottom = remaining;
    } else {
      const topHalf = Math.ceil(remaining.length / 2);
      answer.toTop = remaining.slice(0, topHalf);
      answer.toBottom = remaining.slice(topHalf);
    }
  } else if (prompt.remainingDestination) {
    answer.toTop = remaining.slice(0, 1);
    const rest = remaining.slice(1);
    if (prompt.remainingDestination === "trash") answer.toTrash = rest;
    else answer.toBottom = rest;
  } else {
    answer.toBottom = remaining;
  }

  return {
    directiveIndex: prompt.directiveIndex,
    acceptOptionalDirectiveIndex: prompt.acceptOptionalDirectiveIndex,
    answer,
  };
}

/**
 * Safety caps that bound the enumerator's DFS when a move's
 * `describeProcedure` produces permutations (select-target, select-mode).
 * These mirror Lorcana's approach — the bot picks the first N candidates
 * in procedure-order and skips the rest. A move with more combinations
 * than the cap still generates N legal candidates, so the bot can at
 * least try one; it just doesn't enumerate exhaustively.
 */
export interface GundamCandidateSearchCaps {
  /** Max different card-ids seeded as the primary input per move. */
  readonly primarySeeds: number;
  /** Max candidates emitted for any single-target `selectTarget` step. */
  readonly singleTargetOptions: number;
  /** Max modes expanded from a `selectMode` step. */
  readonly modeOptions: number;
}

export const DEFAULT_GUNDAM_CANDIDATE_SEARCH_CAPS: GundamCandidateSearchCaps = {
  primarySeeds: 8,
  singleTargetOptions: 8,
  modeOptions: 8,
};

interface WalkContext {
  readonly state: MatchState;
  readonly staticResources: MatchStaticResources;
  readonly playerId: PlayerId;
  readonly caps: GundamCandidateSearchCaps;
  readonly out: GundamBotCandidate[];
  /** Depth guard — describeProcedure shouldn't recurse more than a handful of times in practice. */
  readonly maxDepth: number;
}

/**
 * DFS the move's procedure, expanding each step into concrete
 * partial-input permutations until we hit a `confirm` (or an empty
 * step array — some moves skip straight to execute-time validation).
 * Emits one candidate per terminal partial-input.
 */
function walkProcedure(
  ctx: WalkContext,
  moveName: GundamMoveName,
  partialInput: Readonly<Record<string, unknown>>,
  depth: number,
): void {
  if (depth > ctx.maxDepth) return;

  const steps = getMoveProcedure(
    ctx.state,
    ctx.staticResources,
    ctx.playerId,
    moveName,
    partialInput,
  );

  // No procedure registered (default single-confirm) OR explicit confirm
  // step: we've reached a terminal. Emit a candidate.
  if (!steps || steps.length === 0 || steps[0]?.kind === "confirm") {
    const candidate = commandToCandidate(moveName, partialInput);
    if (candidate !== null) ctx.out.push(candidate);
    return;
  }

  const step = steps[0];
  if (!step) return;

  if (step.kind === "selectTarget") {
    const { key, multi } = selectTargetInputBinding(moveName, step);
    const candidateIds = step.candidateIds;

    if (multi) {
      // Multi-select: build a deterministic combination.
      // If partialInput already has selections for this key (from
      // seedPrimaryCardInput), incorporate them and fill up to minTargets
      // with new candidates. Otherwise pick the first minTargets from
      // candidateIds. This avoids the duplicate-candidate bug where
      // every per-card seed overwrites to the same picked array.
      const existing = Array.isArray(partialInput[key])
        ? (partialInput[key] as readonly string[])
        : [];
      if (existing.length >= step.minTargets) {
        walkProcedure(ctx, moveName, partialInput, depth + 1);
      } else {
        const fillIds = candidateIds.filter((id) => !existing.includes(id));
        const needed = Math.max(step.minTargets - existing.length, 0);
        const picked = [...existing, ...fillIds.slice(0, needed)];
        if (picked.length < step.minTargets) return;
        walkProcedure(ctx, moveName, { ...partialInput, [key]: picked }, depth + 1);
      }
      return;
    }

    // Single-target: enumerate each candidate id, up to the cap.
    const slice = candidateIds.slice(0, ctx.caps.singleTargetOptions);
    for (const id of slice) {
      walkProcedure(ctx, moveName, { ...partialInput, [key]: id }, depth + 1);
    }
    return;
  }

  if (step.kind === "selectMode") {
    // Each mode's `id` is a string-encoded effectIndex (see
    // `activateAbility.describeProcedure`). `effectIndex` is always a
    // number in the move's input shape, so we coerce here.
    const slice = step.modes.slice(0, ctx.caps.modeOptions);
    for (const mode of slice) {
      const asNumber = Number(mode.id);
      const value = Number.isFinite(asNumber) ? asNumber : mode.id;
      walkProcedure(ctx, moveName, { ...partialInput, effectIndex: value }, depth + 1);
    }
    return;
  }

  if (step.kind === "selectCost") {
    // Cost selection is rare in the current Gundam move set and each
    // shape needs bespoke enumeration. Skip for MVP — the bot will
    // just not submit moves that require it. Logged through the
    // diagnostic sink once that's wired.
    return;
  }
}

export interface EnumerateCandidatesOptions {
  readonly caps?: Partial<GundamCandidateSearchCaps>;
  /**
   * When provided, restricts enumeration to this subset of moves —
   * useful for focused tests that only want candidates for one move.
   */
  readonly moveNameFilter?: readonly GundamMoveName[];
}

/**
 * Build the full list of legal candidates the given player could submit
 * from the current engine state. Wraps `enumerateAvailableMovesDetailed`
 * and fans out each move via `describeProcedure`, collapsing the sim's
 * `pending` input-collection loop into a head-less DFS.
 *
 * Not exhaustive by design: combinatorial shapes (multi-target with
 * many candidates, `selectCost`) are capped or skipped to keep the
 * planner quick. A strategy that wants richer sampling can post-process
 * the output or bypass this helper.
 */
export function enumerateGundamBotCandidates(
  state: MatchState,
  playerId: PlayerId,
  staticResources: MatchStaticResources,
  options: EnumerateCandidatesOptions = {},
): readonly GundamBotCandidate[] {
  if (state.ctx.status.gameEnded) return [];

  const caps: GundamCandidateSearchCaps = {
    ...DEFAULT_GUNDAM_CANDIDATE_SEARCH_CAPS,
    ...options.caps,
  };
  const out: GundamBotCandidate[] = [];
  const ctx: WalkContext = {
    state,
    staticResources,
    playerId,
    caps,
    out,
    maxDepth: 6,
  };

  const available: AvailableMove[] = enumerateAvailableMovesDetailed(
    state,
    playerId,
    staticResources,
  );

  // `resolveEffect` is listed in every step's `validMoves` because the
  // pending-effect queue can halt at any time, but its own validator
  // rejects when the queue is empty. Skip enumeration in that case so
  // the bot doesn't waste a fallback attempt on a guaranteed-to-fail
  // submission.
  const hasPendingEffects =
    ((state.G as { pendingEffects?: readonly unknown[] }).pendingEffects?.length ?? 0) > 0;

  for (const move of available) {
    if (options.moveNameFilter && !options.moveNameFilter.includes(move.moveName)) {
      continue;
    }
    if (move.moveName === "resolveEffect" && !hasPendingEffects) {
      continue;
    }

    // Setup moves (`chooseFirstPlayer`, `alterHand`) have no
    // `describeProcedure` — their input shape is a simple discrete
    // choice the UI collects via dedicated buttons. Without this
    // special case the generic walker reaches `commandToCandidate`
    // with an empty partial input, which returns null because the
    // required field (`playerId` / `wantsRedraw`) is missing. That
    // silently drops every setup-phase candidate, so the bot
    // plays through `chooseFirstPlayer` when the viewer picks but
    // stalls forever in `mulligan` because its own decision never
    // makes it into the candidate list. Fan out both choices here.
    if (move.moveName === "chooseFirstPlayer") {
      for (const id of state.ctx.playerIds) {
        const candidate = commandToCandidate("chooseFirstPlayer", { playerId: id });
        if (candidate !== null) out.push(candidate);
      }
      continue;
    }
    if (move.moveName === "alterHand") {
      for (const wantsRedraw of [false, true] as const) {
        const candidate = commandToCandidate("alterHand", { wantsRedraw });
        if (candidate !== null) out.push(candidate);
      }
      continue;
    }

    // Optional pending-effect prompts ("you may ...", rule 10-1-3) come
    // through `resolveEffect` with a `confirm` step — `describeProcedure`
    // doesn't fan out the boolean choice, so the generic walker emits a
    // single no-arg candidate. Fan out both the accept and decline forms
    // here so policies can rank them (the default policy runs a
    // directive-intent classifier; bespoke strategies can override).
    if (move.moveName === "resolveEffect" && hasPendingEffects) {
      const optionalDirectiveIndex = findOptionalHeadDirectiveIndex(state, playerId);
      if (optionalDirectiveIndex !== null) {
        for (const accepted of [true, false] as const) {
          const candidate = commandToCandidate("resolveEffect", {
            optionalAnswers: { [optionalDirectiveIndex]: accepted },
          });
          if (candidate !== null) out.push(candidate);
        }
        continue;
      }
      // Fan out one candidate per option for `chooseOne` modal prompts —
      // policies pick which one to keep (default ranks via
      // directive-intent on each option's first action).
      const chooseOneShape = findChooseOneHeadShape(state, playerId);
      if (chooseOneShape !== null) {
        for (let optIdx = 0; optIdx < chooseOneShape.optionCount; optIdx++) {
          const candidate = commandToCandidate("resolveEffect", {
            chooseOneAnswers: { [chooseOneShape.directiveIndex]: optIdx },
          });
          if (candidate !== null) out.push(candidate);
        }
        continue;
      }
      const deckLook = findDeckLookHeadAnswer(state, staticResources, playerId);
      if (deckLook !== null) {
        const candidate = commandToCandidate("resolveEffect", {
          deckLookAnswers: { [deckLook.directiveIndex]: deckLook.answer },
          ...(deckLook.acceptOptionalDirectiveIndex !== undefined
            ? { optionalAnswers: { [deckLook.acceptOptionalDirectiveIndex]: true } }
            : {}),
        });
        if (candidate !== null) out.push(candidate);
        continue;
      }
      // Fall through to the generic walker for non-optional / non-chooseOne
      // prompts (target-selection / ordering / no prompt at all).
    }

    if (!move.requiresCardSelection) {
      // No card selection → walk from empty partial input.
      walkProcedure(ctx, move.moveName, {}, 0);
      continue;
    }

    // Card-selection move: seed each selectable card id and walk.
    const seeds = move.selectableCardIds.slice(0, caps.primarySeeds);
    for (const cardId of seeds) {
      const seeded = seedPrimaryCardInput(move.moveName, cardId);
      walkProcedure(ctx, move.moveName, seeded, 0);
    }
  }

  return out;
}
