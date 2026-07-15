/**
 * Shared ability primitives for TCG engine cores.
 *
 * Games define their own trigger vocabularies, cost shapes, and effect
 * DSLs, but the ability envelope, builder base, trigger queue ordering,
 * and limit bookkeeping live here.
 */

export interface CoreAbility<TTrigger, TCondition, TCost, TEffect, TTarget> {
  kind: "keyword" | "static" | "triggered" | "activated";
  text: string;
  source?: TTarget;
  trigger?: TTrigger;
  limits?: readonly string[];
  bindings?: readonly { id: string; target: TTarget }[];
  conditions?: readonly TCondition[];
  costs?: readonly TCost[];
  effects: readonly TEffect[];
}

/**
 * Generic trigger queue entry.
 *
 * Games narrow the trigger and event types; the shared layer only
 * manages ordering, deduplication, and queue lifecycle.
 */
export interface TriggerQueueEntry<TTrigger, TAbility> {
  id: string;
  order: number;
  playerId: string;
  sourceCardId: string;
  trigger: TTrigger;
  ability: TAbility;
  /**
   * Pre-resolved binding targets. When absent, the trigger still
   * needs binding resolution before it can fire.
   */
  resolvedBindings?: Record<string, string[]>;
}

/**
 * Pending player choice envelope.
 *
 * When an ability suspends for target selection or optional confirmation,
 * the engine stores the partially-resolved ability in this shape so that
 * the resume path has the exact same context.
 */
export interface PendingChoice<TAbility, TTarget> {
  choiceId: string;
  playerId: string;
  ability: TAbility;
  /** The binding or effect step that is waiting for player input. */
  awaiting: {
    type: "binding" | "optional" | "choose";
    id: string;
    target: TTarget;
    min: number;
    max: number;
  };
}

/**
 * Book-keeping record for once-per-turn / first-time limits.
 */
export interface LimitRecord {
  limitId: string;
  sourceCardId: string;
  turnNumber: number;
  fired: boolean;
}
