import type { TriggerQueueEntry, LimitRecord, PendingChoice } from "../types/index.ts";

// ── Trigger Queue Ordering ───────────────────────────────────────────────────

/**
 * Sort trigger queue entries by the standard priority rules:
 * 1. Active player's triggers before opponent's
 * 2. Lower `order` value fires first (stable sort)
 */
export function sortTriggerQueue<TTrigger, TAbility>(
  entries: readonly TriggerQueueEntry<TTrigger, TAbility>[],
  activePlayerId: string,
): TriggerQueueEntry<TTrigger, TAbility>[] {
  return [...entries].sort((a, b) => {
    const aActive = a.playerId === activePlayerId ? 0 : 1;
    const bActive = b.playerId === activePlayerId ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return a.order - b.order;
  });
}

/**
 * Remove a trigger entry from the queue by id.
 */
export function removeTriggerById<TTrigger, TAbility>(
  queue: TriggerQueueEntry<TTrigger, TAbility>[],
  entryId: string,
): TriggerQueueEntry<TTrigger, TAbility>[] {
  return queue.filter((e) => e.id !== entryId);
}

// ── Limit Bookkeeping ────────────────────────────────────────────────────────

/**
 * Check whether a limit has already been consumed this turn.
 */
export function isLimitConsumed(
  records: readonly LimitRecord[],
  limitId: string,
  sourceCardId: string,
  turnNumber: number,
): boolean {
  return records.some(
    (r) =>
      r.limitId === limitId &&
      r.sourceCardId === sourceCardId &&
      r.turnNumber === turnNumber &&
      r.fired,
  );
}

/**
 * Consume a limit for the current turn.
 */
export function consumeLimit(
  records: LimitRecord[],
  limitId: string,
  sourceCardId: string,
  turnNumber: number,
): void {
  records.push({ limitId, sourceCardId, turnNumber, fired: true });
}

/**
 * Clear all limit records for a given turn.
 */
export function clearLimitsForTurn(records: LimitRecord[], turnNumber: number): void {
  records.splice(
    0,
    records.length,
    ...records.filter((record) => record.turnNumber !== turnNumber),
  );
}

/**
 * Clear every limit record regardless of turn.
 */
export function clearAllLimits(records: LimitRecord[]): void {
  records.length = 0;
}

// ── Selectable Binding Detection ─────────────────────────────────────────────

/**
 * Returns true when a binding target requires player choice.
 *
 * A binding is "selectable" when the game layer marks it as
 * explicitly selectable via the provided predicate function.
 */
export function isSelectableBinding<TTarget>(
  binding: { id: string; target: TTarget },
  isExplicitlySelectable: (target: TTarget) => boolean,
): boolean {
  return isExplicitlySelectable(binding.target);
}

// ── Pending Choice Envelope ──────────────────────────────────────────────────

/**
 * Build a PendingChoice envelope for a binding that needs player input.
 */
export function buildBindingChoice<TAbility, TTarget>(
  choiceId: string,
  playerId: string,
  ability: TAbility,
  bindingId: string,
  target: TTarget,
  min: number,
  max: number,
): PendingChoice<TAbility, TTarget> {
  return {
    choiceId,
    playerId,
    ability,
    awaiting: {
      type: "binding",
      id: bindingId,
      target,
      min,
      max,
    },
  };
}

/**
 * Build a PendingChoice envelope for an optional effect step.
 */
export function buildOptionalChoice<TAbility, TTarget>(
  choiceId: string,
  playerId: string,
  ability: TAbility,
  stepId: string,
  target: TTarget,
  min: number,
  max: number,
): PendingChoice<TAbility, TTarget> {
  return {
    choiceId,
    playerId,
    ability,
    awaiting: {
      type: "optional",
      id: stepId,
      target,
      min,
      max,
    },
  };
}

/**
 * Build a PendingChoice envelope for a choose-one effect step.
 */
export function buildChooseChoice<TAbility, TTarget>(
  choiceId: string,
  playerId: string,
  ability: TAbility,
  stepId: string,
  target: TTarget,
  min: number,
  max: number,
): PendingChoice<TAbility, TTarget> {
  return {
    choiceId,
    playerId,
    ability,
    awaiting: {
      type: "choose",
      id: stepId,
      target,
      min,
      max,
    },
  };
}
