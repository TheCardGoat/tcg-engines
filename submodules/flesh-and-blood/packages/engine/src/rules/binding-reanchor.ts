import { FAB_ZONE_KINDS } from "../state.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import type {
  CommittedEvent,
  FabEventBindings,
  FabObjectContinuationBinding,
  FabObjectSnapshot,
} from "./events.ts";
import type { FabObjectRef } from "./continuous/ir.ts";

interface FabCommittedObjectTransition {
  readonly object: FabObjectSnapshot;
  readonly destinationRef: FabObjectRef | null;
}

/**
 * Re-anchor object bindings through exact committed zone transitions.
 *
 * Event and layer bindings are immutable LKI by default. A later clause may
 * follow the same physical card only when this causal event stream proves an
 * exact transition from the bound ref to the live destination ref. Instance-id
 * equality alone is deliberately insufficient: a forged or unrelated newer
 * incarnation remains stale and therefore retains its original LKI.
 */
export function reanchorFabBindingsThroughCommittedMoves(
  state: FabRulesSnapshot,
  bindings: FabEventBindings,
  events: readonly CommittedEvent[],
): FabEventBindings {
  return Object.fromEntries(
    Object.entries(bindings).map(([key, value]) => {
      if (isFabObjectSnapshot(value)) {
        return [key, reanchorSnapshotThroughCommittedMoves(state, value, events)];
      }
      if (Array.isArray(value) && value.every(isFabObjectSnapshot)) {
        return [
          key,
          value.map((entry) => reanchorSnapshotThroughCommittedMoves(state, entry, events)),
        ];
      }
      // Exact-attack bindings intentionally retain their declared attack ref;
      // a zone reset must make them stale rather than silently follow a card.
      return [key, value];
    }),
  );
}

function reanchorSnapshotThroughCommittedMoves(
  state: FabRulesSnapshot,
  original: FabObjectSnapshot,
  events: readonly CommittedEvent[],
): FabObjectSnapshot {
  let ref = fabBindingContinuationRef(original);
  let followedExactTransition = false;

  for (const event of events) {
    const transition = committedObjectTransition(event.data);
    if (!transition || !sameRef(transition.object.ref, ref)) continue;
    followedExactTransition = true;
    if (transition.destinationRef) ref = transition.destinationRef;
  }

  if (!followedExactTransition) return original;
  const live = state.objects[ref.instanceId];
  if (!live || live.incarnation !== ref.incarnation) return original;
  for (const playerId of state.playerIds) {
    for (const zone of FAB_ZONE_KINDS) {
      if (!state.containers.zonesByPlayerId[playerId]![zone].includes(ref.instanceId)) continue;
      const continuation: FabObjectContinuationBinding = { ...original, continuationRef: ref };
      return continuation;
    }
  }
  return original;
}

/** The action handle for a binding; its snapshot fields remain original LKI. */
export function fabBindingContinuationRef(binding: FabObjectSnapshot): FabObjectRef {
  if ("continuationRef" in binding && isFabObjectRef(binding.continuationRef)) {
    return binding.continuationRef;
  }
  return binding.ref;
}

function committedObjectTransition(value: unknown): FabCommittedObjectTransition | null {
  if (typeof value !== "object" || value === null) return null;
  if ("transition" in value && typeof value.transition === "object" && value.transition !== null) {
    const transition = value.transition as Record<string, unknown>;
    if (
      isFabObjectSnapshot(transition.before) &&
      (transition.after === null || isFabObjectSnapshot(transition.after))
    ) {
      return {
        object: transition.before,
        destinationRef: transition.after === null ? null : transition.after.ref,
      };
    }
    return null;
  }
  if (!("object" in value) || !("destinationRef" in value)) return null;
  const object = value.object;
  const destinationRef = value.destinationRef;
  if (!isFabObjectSnapshot(object)) return null;
  if (destinationRef !== null && !isFabObjectRef(destinationRef)) return null;
  return { object, destinationRef };
}

function isFabObjectSnapshot(value: unknown): value is FabObjectSnapshot {
  return (
    typeof value === "object" &&
    value !== null &&
    "ref" in value &&
    isFabObjectRef(value.ref) &&
    "base" in value &&
    "current" in value &&
    "zone" in value
  );
}

function isFabObjectRef(value: unknown): value is FabObjectRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "instanceId" in value &&
    typeof value.instanceId === "string" &&
    "incarnation" in value &&
    typeof value.incarnation === "number"
  );
}

function sameRef(left: FabObjectRef, right: FabObjectRef): boolean {
  return left.instanceId === right.instanceId && left.incarnation === right.incarnation;
}
