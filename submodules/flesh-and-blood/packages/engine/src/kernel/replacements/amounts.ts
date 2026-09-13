import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabObjectSnapshot } from "../../rules/events.ts";
import type { FabReplacementCandidate } from "../../rules/process.ts";
import { buildFabRulesViewWithLki } from "../../rules/state-rules-view.ts";
import type { FabRulesSnapshot } from "../transaction-kernel.ts";

/**
 * Resolve a keyword value that may be a fixed number or a live FabAmount
 * (Spellvoid X / Arcane Barrier X where X is a count). Type placeholders
 * (`x`/`y`/`z` without a bound variable) and non-positive results yield null.
 */
export function resolvePreventionKeywordAmount(
  state: FabRulesSnapshot,
  object: FabObjectSnapshot,
  raw: unknown,
): number | null {
  if (typeof raw === "number") return raw > 0 ? raw : null;
  if (raw === null || raw === undefined || typeof raw !== "object") return null;
  try {
    const controllerId = object.controllerId ?? object.ownerId;
    const resolved = buildFabRulesViewWithLki(state, [object]).evaluateAmount(raw as FabAmount, {
      controllerId,
      source: object.ref,
      bindings: { objects: {}, numbers: {}, strings: {} },
    });
    return resolved.value > 0 ? resolved.value : null;
  } catch {
    // Unbound type-x / unsupported amount — keyword is not yet usable.
    return null;
  }
}

/**
 * A prevention/boost amount the canonical gates admit and the apply path can
 * resolve: a literal number, or any evaluatable FabAmount object (a `{ type }`
 * discriminant the rules evaluator dispatches on). CR 6.4.10 admits dynamic
 * prevention/boost amounts — count-amounts (Dissipation Shield's "X = steam
 * counters on Dissipation Shield"), event-amounts, conditionals, sums — and the
 * apply path resolves them via the same {@link evaluateAmount} the keyword
 * resolver uses. Genuinely malformed shapes (no `type` discriminant) are still
 * rejected, preserving the canonical-gate spirit.
 */
export function isAdmissibleCanonicalAmount(amount: unknown): boolean {
  return (
    typeof amount === "number" ||
    (typeof amount === "object" && amount !== null && "type" in amount)
  );
}

/**
 * Resolve a canonical prevention/boost amount at apply time. Mirrors
 * {@link resolvePreventionKeywordAmount}: literal numbers are returned directly;
 * an `event-amount` FabAmount resolves to the amount of the triggering event
 * (`eventAmount` — the damage event being prevented or boosted); any other
 * FabAmount is evaluated via the rules view with the candidate's controller +
 * source as context, so CR 6.4.10 count-amounts (Dissipation Shield steam
 * counters) and deal-damage boost amounts (Aether Flare arcane-dealt-this-turn)
 * resolve. Resolution failure (unbound variable, missing facts) yields `null`
 * ("couldn't resolve") — each apply path then chooses its own fallback, so the
 * helper cannot smuggle event-amount semantics into a path where they would be
 * wrong (a damage boost falling back to the event amount would double it).
 */
export function resolveCanonicalAmount(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  amount: FabAmount | undefined,
  eventAmount: number,
): number | null {
  if (typeof amount === "number") return amount;
  // Missing amount or an explicit event-amount: the triggering event's amount
  // (the legacy literal apply-path semantics for event-amount preventions).
  if (amount === undefined || amount.type === "event-amount") return eventAmount;
  try {
    const resolved = buildFabRulesViewWithLki(state, [candidate.source]).evaluateAmount(amount, {
      controllerId: candidate.controllerId,
      source: candidate.source.ref,
      bindings: { objects: {}, numbers: { "event-amount": eventAmount }, strings: {} },
    });
    return resolved.value;
  } catch {
    return null;
  }
}

/** Enter-arena counter count, including play-layer this-way stamps on the event. */
export function resolveEnterArenaCounterCount(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  count: FabAmount,
  event: { readonly bindings?: Readonly<Record<string, unknown>> },
): number | null {
  if (typeof count === "number") return count;
  const strings: Record<string, string> = {};
  const numbers: Record<string, number> = {};
  for (const [key, value] of Object.entries(event.bindings ?? {})) {
    if (typeof value === "string") strings[key] = value;
    if (typeof value === "number") numbers[key] = value;
  }
  try {
    const resolved = buildFabRulesViewWithLki(state, [candidate.source]).evaluateAmount(count, {
      controllerId: candidate.controllerId,
      source: candidate.source.ref,
      bindings: { objects: {}, numbers, strings },
    });
    return typeof resolved.value === "number" && Number.isFinite(resolved.value)
      ? resolved.value
      : null;
  } catch {
    return null;
  }
}
