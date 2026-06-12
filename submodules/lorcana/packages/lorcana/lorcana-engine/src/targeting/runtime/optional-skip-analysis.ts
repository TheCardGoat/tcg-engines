import type {
  CardInstanceId,
  MoveEnumerationContext,
  MoveExecutionContext,
  MoveInput,
  MoveValidationContext,
  PlayerId,
} from "#core";
import {
  hasReturnFromDiscardCandidates,
  isReturnFromDiscardEffect,
} from "../../runtime-moves/resolution/action-effects/return-from-discard-effect";
import { analyzeEffectTargets } from "./target-analysis";
import { analyzeTargetSelectionAvailabilityFromAnalysis } from "./target-availability";
import {
  normalizeTargetDescriptor,
  passesFilter,
  resolveCandidateTargets,
} from "./target-resolver";
import { validateBasicCost } from "../../runtime-moves/rules/play-card-rules";

export type OptionalSkipContext = Pick<
  MoveValidationContext<MoveInput> | MoveEnumerationContext,
  "framework" | "cards"
>;

// hasReturnFromDiscardCandidates requires FrameworkWriteAPI (from MoveExecutionContext),
// but only reads from it (getCards). Both callers provide the full runtime object at
// runtime — the TypeScript type is just narrowed to a read-only view.
type HasReturnFromDiscardCtx = Pick<MoveExecutionContext<never>, "framework" | "cards">;

/**
 * Returns true if a triggered ability's effect should be silently skipped because
 * its target-requiring step has no valid candidates on the current board.
 *
 * Used at two call sites:
 *  - Trigger-fire time (triggered-abilities/index.ts): suppress bag entries before they are created.
 *    Pass `callSite: "trigger-fire"` (the default).
 *  - Bag-decision time (lorcana-engine-base.ts): auto-resolve bag entries without prompting the player.
 *    Pass `callSite: "bag-decision"`.
 *
 * The two call sites differ in how `owner: "any"` targets are handled:
 *  - At trigger-fire time, the analysis context may not enumerate both players' cards correctly
 *    during opponent action resolution (false-zero counts). To avoid incorrectly suppressing bag
 *    entries (which would violate CR 6.2.3 — triggers enter the bag regardless of target availability),
 *    `owner: "any"` targets are excluded from analysis and the effect is not skipped.
 *  - At bag-decision time, the board context is stable (player-scoped projection) so `owner: "any"`
 *    targets are correctly enumerated. When all candidates are filtered out (e.g. no damaged
 *    characters for a "damaged" filter), the bag auto-resolves without prompting the player,
 *    preventing a stuck target-selection prompt.
 *
 * Handles three patterns:
 *
 * 1. `optional { effect }` — skip if the inner effect has no valid targets.
 *
 * 2. `optional { sequence { [mandatory-first-step, ...] } }` — skip if the first step of the
 *    inner sequence is a return-from-discard effect with no valid discard candidates, or a discard
 *    effect with filters and no matching hand cards. Other first-step patterns return `false`.
 *
 * 3. `sequence { [mandatory-first-step, ...] }` (no optional wrapper) — skip if the first step
 *    is a return-from-discard with no valid discard candidates AND every subsequent step is
 *    gated on a `returned-card-*` condition (so the whole sequence would fizzle). Multi-step
 *    sequences with at least one returned-card-independent step (e.g. Syndrome's
 *    "Then, you may play or shift a Robot for free") are NOT skipped — per CR 1.2.3 the
 *    independent step must still resolve. The sequence resolver itself skips the empty
 *    step 1 at runtime.
 *
 * Mill sequences are intentionally not skipped here: mill does not require explicit target
 * selection in this helper's analysis model, and resolving as much of the mill as possible is
 * treated as best-effort rather than a reason to suppress the whole effect up front.
 *
 * Note: effects with `chosenBy: "opponent"` are NOT handled here — those are mandatory effects
 * where the opponent picks the target via a pendingEffect. They have `canAutoResolve = true` in
 * `analyzeResolutionRequirements`, so `bagEffectNeedsPlayerDecision` already returns `false` and
 * the bag drains before this helper is ever consulted. See `resolution-requirements.ts`.
 */
export function shouldSkipEffectWithNoValidTargets(
  effect: unknown,
  playerId: PlayerId,
  ctx: OptionalSkipContext,
  sourceCardId?: CardInstanceId,
  callSite: "trigger-fire" | "bag-decision" = "trigger-fire",
): boolean {
  const effectRecord = effect as Record<string, unknown> | null | undefined;
  if (!effectRecord || typeof effectRecord !== "object") return false;

  const effectType = effectRecord.type as string | undefined;

  // --- Mandatory sequence whose first step is return-from-discard ---
  // Skip before creating a bag entry that would immediately fizzle.
  if (effectType === "sequence") {
    return shouldSkipMandatoryReturnFromDiscardSequence(effectRecord, playerId, ctx, sourceCardId);
  }

  if (effectType !== "optional") return false;

  const innerEffect = effectRecord.effect;
  if (innerEffect == null) return false;
  const innerRecord = innerEffect as Record<string, unknown>;

  // --- optional → pay-cost ---
  // If the player cannot pay the nested cost, accepting the optional cannot
  // produce a legal resolution. Only auto-drain at bag-decision time to
  // preserve ordering windows where a prior simultaneous trigger may change
  // resources before this one resolves (e.g. Mama Odie adding ink before
  // Ursula's Shell Necklace cost is checked).
  if (
    callSite === "bag-decision" &&
    innerRecord.type === "pay-cost" &&
    !canPayNestedCost(innerRecord, playerId, ctx, sourceCardId)
  ) {
    return true;
  }

  // --- optional → return-from-discard (direct) ---
  if (isReturnFromDiscardEffect(innerEffect)) {
    return !hasReturnFromDiscardCandidates(
      ctx as unknown as HasReturnFromDiscardCtx,
      playerId,
      innerEffect,
      sourceCardId,
    );
  }

  // --- optional → sequence ---
  if (innerRecord.type === "sequence") {
    const steps = Array.isArray(innerRecord.steps) ? innerRecord.steps : [];
    const firstStep = steps[0];
    if (!firstStep || typeof firstStep !== "object") return false;

    // Sequence whose first step is return-from-discard
    if (isReturnFromDiscardEffect(firstStep)) {
      return !hasReturnFromDiscardCandidates(
        ctx as unknown as HasReturnFromDiscardCtx,
        playerId,
        firstStep,
        sourceCardId,
      );
    }

    // If any step in the sequence has a chosen target exclusively in discard or
    // hand zones and those zones have no matching candidates, the optional cannot
    // be meaningfully accepted. Unlike play-zone chosen targets (where trigger-fire
    // time enumeration may be incomplete — CR 6.2.3), the controller's discard and
    // hand are correctly enumerated at both call sites.
    if (hasUnfillableNonPlayZoneChosenSlot(innerEffect, playerId, ctx, sourceCardId)) {
      return true;
    }

    // Triggered optional chosen-target abilities enter the bag even when no
    // legal target is currently available. Source-pool optionals such as
    // return-from-discard are checked above before this short-circuit.
    if (callSite === "trigger-fire" && containsChosenTargetSlot(innerEffect)) {
      return false;
    }

    // Sequence whose first step is a discard-from-hand with filters (e.g. STEALTH MODE)
    const firstStepRecord = firstStep as Record<string, unknown>;
    if (firstStepRecord.type === "discard") {
      return shouldSkipDiscardFirstStep(ctx, playerId, firstStepRecord);
    }

    // Other sequence patterns (mill, draw, etc.): do not skip
    return false;
  }

  // Triggered optional chosen-target abilities enter the bag even when no
  // legal target is currently available. At bag-decision time the same analysis
  // may still auto-drain impossible entries before prompting the player.
  if (callSite === "trigger-fire" && containsChosenTargetSlot(innerEffect)) {
    return false;
  }

  // --- Generic analysis for non-sequence, non-return-from-discard optionals ---
  // At trigger-fire time, skip owner:"any" targets: the analysis context may produce false-zero
  // counts during opponent action resolution (both sides' cards may not be visible simultaneously).
  // Skipping would suppress the bag entry in violation of CR 6.2.3. At bag-decision time the
  // board context is player-scoped and correctly enumerates all characters, so we analyse fully
  // and allow the optional to auto-resolve when no valid targets exist.
  if (callSite === "trigger-fire") {
    const innerTarget = innerRecord.target as Record<string, unknown> | undefined;
    if ((innerTarget?.owner as string | undefined) === "any") return false;
  }

  const analysis = analyzeEffectTargets(innerEffect, playerId, ctx, sourceCardId);
  const availability = analyzeTargetSelectionAvailabilityFromAnalysis(innerEffect, analysis);

  if (
    availability.requiresExplicitTargetSelection &&
    !availability.allowsExplicitEmptyTargetSelection &&
    availability.candidateCount === 0
  ) {
    return true;
  }

  // Multi-slot effects (e.g. move-damage with `from` + `to`) report an
  // aggregated candidate count: one slot's valid pool can mask another slot's
  // empty pool. If any individual "chosen" slot has zero candidates, accepting
  // the optional cannot produce a legal selection — force the skip so the bag
  // drains instead of opening an unresolvable picker.
  return hasUnfillableChosenSlot(innerEffect, playerId, ctx, sourceCardId);
}

function canPayNestedCost(
  effectRecord: Record<string, unknown>,
  playerId: PlayerId,
  ctx: OptionalSkipContext,
  sourceCardId?: CardInstanceId,
): boolean {
  const rawCost = effectRecord.cost;
  if (!rawCost || typeof rawCost !== "object" || Array.isArray(rawCost)) {
    return true;
  }

  const cost = rawCost as Record<string, unknown>;
  const ink = typeof cost.ink === "number" && Number.isFinite(cost.ink) ? cost.ink : 0;
  const exertCards =
    cost.exert && sourceCardId ? [{ cardId: sourceCardId, subject: "source" as const }] : undefined;

  return validateBasicCost(
    {
      framework: ctx.framework,
      cards: ctx.cards,
      playerId,
    },
    { ink, exertCards },
  ).valid;
}

function containsChosenTargetSlot(effect: unknown): boolean {
  if (!effect || typeof effect !== "object") return false;
  const record = effect as Record<string, unknown>;

  for (const key of CHOSEN_SLOT_KEYS) {
    const raw = record[key];
    if (
      raw === undefined ||
      raw === null ||
      raw === "chosen-for-effect" ||
      (typeof raw === "object" &&
        !Array.isArray(raw) &&
        ("ref" in (raw as object) || "reference" in (raw as object)))
    ) {
      continue;
    }
    const descriptor = normalizeTargetDescriptor(raw);
    if (descriptor?.selector === "chosen") {
      return true;
    }
  }

  const nested: unknown[] = [
    record.effect,
    ...(Array.isArray(record.effects) ? record.effects : []),
    ...(Array.isArray(record.steps) ? record.steps : []),
    ...(Array.isArray(record.options) ? record.options : []),
    ...(Array.isArray(record.choices) ? record.choices : []),
    record.trueEffect,
    record.falseEffect,
    record.ifTrue,
    record.ifFalse,
    record.then,
    record.else,
  ];

  return nested.some((next) => containsChosenTargetSlot(next));
}

const CHOSEN_SLOT_KEYS = [
  "target",
  "from",
  "to",
  "character",
  "location",
  "source",
  "under",
  "underTarget",
] as const;

function hasUnfillableChosenSlot(
  effect: unknown,
  playerId: PlayerId,
  ctx: OptionalSkipContext,
  sourceCardId?: CardInstanceId,
): boolean {
  if (!effect || typeof effect !== "object") return false;
  const record = effect as Record<string, unknown>;

  for (const key of CHOSEN_SLOT_KEYS) {
    const raw = record[key];
    if (
      raw === undefined ||
      raw === null ||
      raw === "chosen-for-effect" ||
      (typeof raw === "object" &&
        !Array.isArray(raw) &&
        ("ref" in (raw as object) || "reference" in (raw as object)))
    ) {
      continue;
    }
    const descriptor = normalizeTargetDescriptor(raw);
    if (!descriptor || descriptor.selector !== "chosen") {
      continue;
    }
    const candidates = resolveCandidateTargets(
      ctx as Parameters<typeof resolveCandidateTargets>[0],
      descriptor,
      {
        controllerId: playerId,
        sourceCardId,
      },
    );
    if (candidates.length === 0) {
      return true;
    }
  }

  // For choice effects the player picks one option — only skip if ALL options are unfillable.
  // ChoiceEffect supports both `options` and `choices` alias fields.
  const effectType = record.type as string | undefined;
  if (effectType === "choice") {
    const options = [
      ...(Array.isArray(record.options) ? record.options : []),
      ...(Array.isArray(record.choices) ? record.choices : []),
    ];
    if (options.length === 0) return false;
    return options.every(
      (opt) =>
        !opt ||
        typeof opt !== "object" ||
        hasUnfillableChosenSlot(opt, playerId, ctx, sourceCardId),
    );
  }

  const nested: unknown[] = [
    record.effect,
    ...(Array.isArray(record.effects) ? record.effects : []),
    ...(Array.isArray(record.steps) ? record.steps : []),
    ...(Array.isArray(record.options) ? record.options : []),
    ...(Array.isArray(record.choices) ? record.choices : []),
    record.trueEffect,
    record.falseEffect,
    record.ifTrue,
    record.ifFalse,
    record.then,
    record.else,
  ];
  for (const next of nested) {
    if (next && typeof next === "object") {
      if (hasUnfillableChosenSlot(next, playerId, ctx, sourceCardId)) {
        return true;
      }
    }
  }
  return false;
}

function shouldSkipMandatoryReturnFromDiscardSequence(
  sequenceRecord: Record<string, unknown>,
  playerId: PlayerId,
  ctx: OptionalSkipContext,
  sourceCardId?: CardInstanceId,
): boolean {
  const steps = Array.isArray(sequenceRecord.steps) ? sequenceRecord.steps : [];
  const firstStep = steps[0];
  if (!firstStep || typeof firstStep !== "object") return false;
  if (!isReturnFromDiscardEffect(firstStep)) return false;
  // Per CR 1.2.3 ("do as much as you can"), a multi-step sequence whose first
  // step (return-from-discard) has no legal candidates must still perform
  // later steps that are independent of that step. We only suppress the bag
  // entry when every subsequent step is gated on the returned card itself
  // (e.g. `conditional` with a `returned-card-*` condition) — those steps can
  // never produce an effect when nothing was returned, so the trigger as a
  // whole would fizzle, and suppressing it avoids a no-op bag entry.
  const subsequentSteps = steps.slice(1);
  if (
    subsequentSteps.length > 0 &&
    !subsequentSteps.every((step) => isStepDependentOnReturnedCard(step))
  ) {
    return false;
  }
  return !hasReturnFromDiscardCandidates(
    ctx as unknown as HasReturnFromDiscardCtx,
    playerId,
    firstStep,
    sourceCardId,
  );
}

function isStepDependentOnReturnedCard(step: unknown): boolean {
  if (!step || typeof step !== "object") return false;
  const record = step as Record<string, unknown>;
  if (record.type !== "conditional") return false;
  const condition = record.condition as Record<string, unknown> | undefined;
  if (!condition || typeof condition !== "object") return false;
  const conditionType = condition.type as string | undefined;
  return typeof conditionType === "string" && conditionType.startsWith("returned-card-");
}

function shouldSkipDiscardFirstStep(
  ctx: OptionalSkipContext,
  playerId: PlayerId,
  discardStep: Record<string, unknown>,
): boolean {
  const filters = Array.isArray(discardStep.filters) ? discardStep.filters : [];
  // No filters means any hand card is valid — only skip if hand is completely empty
  if (filters.length === 0) return false;

  const handCards = ctx.framework.zones.getCards({
    zone: "hand",
    playerId,
  }) as CardInstanceId[];

  for (const cardId of handCards) {
    const allPass = filters.every(
      (f) =>
        f &&
        typeof f === "object" &&
        passesFilter(
          ctx as Parameters<typeof passesFilter>[0],
          cardId,
          f as Parameters<typeof passesFilter>[2],
          playerId,
        ),
    );
    if (allPass) return false; // at least one valid discard target exists
  }

  return true; // no valid discard targets — suppress the effect
}

/**
 * Returns true if any "chosen" target slot in the effect (or its nested steps/effects)
 * exclusively targets the discard zone and has zero candidates.
 *
 * Intentionally limited to discard (not hand): hand can be replenished by prior steps
 * in a sequence (e.g. draw then put-on-bottom), so an empty hand at trigger-fire time
 * does not mean the step will have no targets when it actually executes.
 */
function hasUnfillableNonPlayZoneChosenSlot(
  effect: unknown,
  playerId: PlayerId,
  ctx: OptionalSkipContext,
  sourceCardId?: CardInstanceId,
): boolean {
  if (!effect || typeof effect !== "object") return false;
  const record = effect as Record<string, unknown>;

  for (const key of CHOSEN_SLOT_KEYS) {
    const raw = record[key];
    if (
      raw === undefined ||
      raw === null ||
      raw === "chosen-for-effect" ||
      (typeof raw === "object" &&
        !Array.isArray(raw) &&
        ("ref" in (raw as object) || "reference" in (raw as object)))
    ) {
      continue;
    }
    const descriptor = normalizeTargetDescriptor(raw);
    if (!descriptor || descriptor.selector !== "chosen") {
      continue;
    }
    // Only check slots that exclusively target the discard zone.
    const rawZones = (raw as Record<string, unknown>).zones;
    if (!Array.isArray(rawZones) || rawZones.length === 0) {
      continue;
    }
    const isDiscardOnly = rawZones.every((z: unknown) => z === "discard");
    if (!isDiscardOnly) {
      continue;
    }

    const candidates = resolveCandidateTargets(
      ctx as Parameters<typeof resolveCandidateTargets>[0],
      descriptor,
      { controllerId: playerId, sourceCardId },
    );
    const requiredCount =
      typeof descriptor.count === "number" && descriptor.count > 0 ? descriptor.count : 1;
    if (candidates.length < requiredCount) {
      return true;
    }
  }

  const nested: unknown[] = [
    record.effect,
    ...(Array.isArray(record.effects) ? record.effects : []),
    ...(Array.isArray(record.steps) ? record.steps : []),
    ...(Array.isArray(record.options) ? record.options : []),
    ...(Array.isArray(record.choices) ? record.choices : []),
    record.trueEffect,
    record.falseEffect,
    record.ifTrue,
    record.ifFalse,
    record.then,
    record.else,
  ];

  for (const next of nested) {
    if (next && typeof next === "object") {
      if (hasUnfillableNonPlayZoneChosenSlot(next, playerId, ctx, sourceCardId)) {
        return true;
      }
    }
  }
  return false;
}
