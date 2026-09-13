/**
 * Intent-level harness drain policy.
 *
 * Types and forced-answer helpers only — the loop lives on {@link FabTestEngine}
 * so this module does not import the engine class.
 */
import type { FabDecision, FabDecisionAnswer } from "../rules/process.ts";
import type { FabWaitState } from "../game/wait-state.ts";

/** Named stop points for {@link FabTestEngine.advanceUntil}. */
export type FabDrainStop =
  | "on-attack"
  | "defend"
  | "reaction"
  | "resolution"
  | "combat-close"
  | "idle";

/**
 * CR 8.5.22 Opt partition. Look entries are original-top-first; both groups
 * are bottom-first for the opt reducer (`push` last = deck top).
 */
export function fabOptPartitionGroups(
  entries: readonly { readonly id: string }[],
  bottomCount = 0,
): { readonly top: readonly string[]; readonly bottom: readonly string[] } {
  const ids = entries.map((entry) => entry.id);
  const n = Math.max(0, Math.min(bottomCount, ids.length));
  return { bottom: ids.slice(0, n), top: ids.slice(n).reverse() };
}

/**
 * Partition groups that keep every entry where the engine presented it.
 * Single-group decisions (reorder-deck) take all entries in that group,
 * flipped when the group is bottom-first; CR 8.5.22 Opt top/bottom decisions
 * keep the `optBottom` split.
 */
export function fabListedPartitionGroups(
  decision: Extract<FabDecision, { readonly kind: "partition" }>,
  optBottom = 0,
): Readonly<Record<string, readonly string[]>> {
  if (decision.groups.length === 1) {
    const group = decision.groups[0]!;
    const ids = decision.entries.map((entry) => entry.id);
    return {
      [group.id]: group.orderDirection === "bottom-first" ? [...ids].reverse() : ids,
    };
  }
  return fabOptPartitionGroups(decision.entries, optBottom);
}

/**
 * How the drain answers intervening decisions.
 *
 * `throw` is the default for new intent verbs: the test must name the choice.
 * Legacy `attackWith` / `resolveUntilIdle` keep their own policies.
 */
export interface FabDrainPolicy {
  readonly stopAt: FabDrainStop;
  /** Optional boolean / pay-decline. Default `"throw"`. */
  readonly optionals?: "decline" | "accept" | "throw";
  /**
   * Multi-entry ordering and CR 8.5.22 Opt partitions. Default `"throw"`.
   * `"listed"` keeps engine order (Opt: leave looked cards on top).
   */
  readonly ordering?: "listed" | "throw";
  /** CR 8.5.22: number of looked cards put on the bottom during drain. */
  readonly optBottom?: number;
  /**
   * Non-forced entity-target. Default `"throw"` (never first-candidate).
   * `"pause"` stops the drain so the test can `.target` / `.targetRequired`.
   */
  readonly entityTargets?: "minimum" | "maximum" | "throw" | "pause";
  readonly maxSteps?: number;
}

/** True when the wait-state satisfies `stopAt`. */
export function fabWaitStateMatchesStop(wait: FabWaitState, stopAt: FabDrainStop): boolean {
  switch (stopAt) {
    case "defend":
      return (
        (wait.kind === "priority" && wait.combatStep === "defend") ||
        wait.kind === "defense-declaration"
      );
    case "reaction":
      return wait.kind === "priority" && wait.combatStep === "reaction";
    case "resolution":
      return (
        (wait.kind === "priority" || wait.kind === "resolving") && wait.combatStep === "resolution"
      );
    case "combat-close":
      return wait.kind === "game-over" || (wait.kind === "priority" && wait.window === "action");
    case "idle":
      return (
        wait.kind === "game-over" ||
        (wait.kind === "priority" && wait.window === "action" && wait.combatStep === undefined)
      );
    case "on-attack":
      return (
        wait.kind === "decision" ||
        (wait.kind === "priority" && wait.combatStep === "defend") ||
        wait.kind === "defense-declaration"
      );
  }
}

/**
 * Mathematically unique answer, or `null`.
 *
 * Trigger ordering (`options.length > max`) is **not** forced — the legacy
 * `answerForcedDecision` helper still auto-picks the first `min` options.
 */
export function forcedFabDecisionAnswer(decision: FabDecision): FabDecisionAnswer | null {
  switch (decision.kind) {
    case "entity-target":
      if (decision.min === decision.max && decision.candidates.length === decision.min) {
        return {
          kind: "entity-target",
          instanceIds: decision.candidates.map((candidate) => candidate.instanceId),
        };
      }
      return null;
    case "option":
      if (decision.min === decision.max && decision.options.length === decision.min) {
        return {
          kind: "option",
          optionIds: decision.options.map((option) => option.id),
        };
      }
      return null;
    case "numeric":
      if (decision.min === decision.max && decision.requiresExplicitAnswer !== true) {
        return { kind: "numeric", value: decision.min };
      }
      return null;
    case "ordering":
      if (decision.entries.length <= 1) {
        return { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) };
      }
      return null;
    case "effect-resolution":
      if (decision.options.length === 1) {
        return { kind: "effect-resolution", optionId: decision.options[0]!.id };
      }
      return null;
    case "boolean":
    case "payment":
    case "partition":
    case "group-choice":
      return null;
  }
}

/** Human-readable pending-decision line for drain failures. */
export function describeFabDecision(decision: FabDecision): string {
  switch (decision.kind) {
    case "boolean":
      return `boolean (${decision.acceptLabel}/${decision.declineLabel}) for ${decision.actorId}: ${decision.label}`;
    case "option":
      return `option [${decision.options.map((option) => option.id).join(", ")}] for ${decision.actorId}: ${decision.label}`;
    case "effect-resolution":
      return `effect-resolution [${decision.options
        .map((option) => `${option.id}="${option.label}"`)
        .join(", ")}] for ${decision.actorId}: ${decision.label}`;
    case "entity-target":
      return `entity-target min=${decision.min} candidates=${decision.candidates.length} for ${decision.actorId}: ${decision.label}`;
    case "ordering":
      return `ordering (${decision.entries.length} entries) for ${decision.actorId}: ${decision.label}`;
    case "payment":
      return `payment ${decision.amount} for ${decision.actorId}: ${decision.label}`;
    case "numeric":
      return `numeric ${decision.min}..${decision.max} for ${decision.actorId}: ${decision.label}`;
    case "partition":
      return `partition (${decision.entries.length} entries) for ${decision.actorId}: ${decision.label}`;
    case "group-choice":
      return `group-choice for ${decision.actorId}: ${decision.label}`;
  }
}

/** Pay/decline option pair, or null when the prompt is not that shape. */
export function fabPayDeclineOptionIds(
  decision: Extract<FabDecision, { readonly kind: "option" }>,
): { readonly pay: string; readonly decline: string } | null {
  const pay = decision.options.find((option) => option.id === "pay" || /pay/i.test(option.label));
  const decline = decision.options.find(
    (option) => option.id === "decline" || /decline/i.test(option.label),
  );
  if (!pay || !decline) return null;
  return { pay: pay.id, decline: decline.id };
}

/** Format a wait-state for drain error messages. */
export function describeFabWaitState(wait: FabWaitState): string {
  switch (wait.kind) {
    case "game-over":
      return `game-over (${wait.endReason ?? "ended"})`;
    case "decision":
      return describeFabDecision(wait.decision);
    case "defense-declaration":
      return `defense-declaration for ${wait.defenderId}`;
    case "priority":
      return `priority ${wait.window}${wait.combatStep ? `/${wait.combatStep}` : ""} (${wait.playerId})`;
    case "resolving":
      return `resolving${wait.combatStep ? `/${wait.combatStep}` : ""}`;
  }
}
