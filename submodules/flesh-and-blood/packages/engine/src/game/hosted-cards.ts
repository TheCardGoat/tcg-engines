import type { FabObjectInstanceId } from "./identity.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

/**
 * Ordered, authoritative host-to-subcard topology (CR 3.0.14).
 *
 * A reverse subcard-to-host index is deliberately not part of this model. It
 * is derived when needed so host membership cannot acquire a second writer.
 */
export type FabHostedCardTopology = Readonly<Record<string, readonly FabObjectInstanceId[]>>;

export type FabTransformDestination =
  | {
      readonly kind: "existing-permanent";
      readonly hostId: FabObjectInstanceId;
    }
  | {
      /** The resolving physical card becomes the top-card (Evo / Invocation). */
      readonly kind: "resolving-card";
      readonly hostId: FabObjectInstanceId;
    }
  | {
      /** A token is created first and becomes the top-card (CR 8.5.36c). */
      readonly kind: "created-token";
      readonly hostId: FabObjectInstanceId;
    };

export interface FabHostTopologyContext {
  readonly objectIds: ReadonlySet<string>;
  /** Objects with ordinary container membership, excluding every sub-card. */
  readonly topLevelObjectIds: ReadonlySet<string>;
}

export interface FabTransformTopologyPlan {
  readonly topology: FabHostedCardTopology;
  /** Former top-cards that become new sub-cards under CR 3.0.14b. */
  readonly newSubcardIds: readonly FabObjectInstanceId[];
}

export type FabHostDeparturePlan =
  | {
      /** The top-card remains the same object; its whole tree follows it. */
      readonly kind: "preserve";
      readonly topology: FabHostedCardTopology;
    }
  | {
      /** The top-card ceases; every descendant is cleared in this order. */
      readonly kind: "clear";
      readonly topology: FabHostedCardTopology;
      readonly clearSubcardIds: readonly FabObjectInstanceId[];
    };

/**
 * Validate the complete topology, not only the edge currently being changed.
 * This makes malformed restored or transition-produced state fail closed.
 */
export function validateFabHostedCardTopology(
  topology: FabHostedCardTopology,
  context: FabHostTopologyContext,
): void {
  const hostBySubcard = deriveFabHostBySubcardId(topology);

  for (const [hostId, subcardIds] of Object.entries(topology)) {
    if (!context.objectIds.has(hostId)) {
      throw new Error(`FAB hosted-card topology references missing host ${hostId}.`);
    }
    if (subcardIds.length === 0) {
      throw new Error(`FAB hosted-card topology contains empty host ${hostId}.`);
    }
    for (const subcardId of subcardIds) {
      if (!context.objectIds.has(subcardId)) {
        throw new Error(`FAB hosted-card topology references missing sub-card ${subcardId}.`);
      }
      if (context.topLevelObjectIds.has(subcardId)) {
        throw new Error(`FAB sub-card ${subcardId} also has top-level container membership.`);
      }
    }
  }

  for (const hostId of Object.keys(topology)) {
    const ancestors = new Set<string>();
    let cursor: string | undefined = hostId;
    const ancestorGuard = createFabLoopGuard({ label: "hosted-cards: ancestor walk" });
    while (cursor !== undefined) {
      ancestorGuard.tick();
      if (ancestors.has(cursor)) {
        throw new Error(`FAB hosted-card topology contains a cycle at ${cursor}.`);
      }
      ancestors.add(cursor);
      cursor = hostBySubcard[cursor];
    }
  }
}

/** Derive the unique reverse index; duplicate membership is rejected. */
export function deriveFabHostBySubcardId(
  topology: FabHostedCardTopology,
): Readonly<Record<string, FabObjectInstanceId>> {
  const result: Record<string, FabObjectInstanceId> = {};
  for (const [hostId, subcardIds] of Object.entries(topology)) {
    for (const subcardId of subcardIds) {
      if (result[subcardId] !== undefined) {
        throw new Error(
          `FAB sub-card ${subcardId} is hosted by both ${result[subcardId]} and ${hostId}.`,
        );
      }
      result[subcardId] = hostId as FabObjectInstanceId;
    }
  }
  return result;
}

/**
 * Plan one atomic transform. Nested source trees are flattened under the new
 * top-card in source order, as required by CR 3.0.14c and 8.5.36d.
 */
export function planFabTransformTopology(input: {
  readonly topology: FabHostedCardTopology;
  readonly context: FabHostTopologyContext;
  readonly sourceIds: readonly [FabObjectInstanceId, ...FabObjectInstanceId[]];
  readonly destination: FabTransformDestination;
}): FabTransformTopologyPlan {
  validateFabHostedCardTopology(input.topology, input.context);
  const uniqueSources = new Set(input.sourceIds);
  if (uniqueSources.size !== input.sourceIds.length) {
    throw new Error("FAB transform sources must be unique.");
  }
  const { hostId } = input.destination;
  if (!input.context.objectIds.has(hostId) || !input.context.topLevelObjectIds.has(hostId)) {
    throw new Error(`FAB transform destination ${hostId} is not a top-level card object.`);
  }
  const hostBySubcard = deriveFabHostBySubcardId(input.topology);
  if (hostBySubcard[hostId] !== undefined) {
    throw new Error(`FAB transform destination ${hostId} is already a sub-card.`);
  }

  const newSubcardIds: FabObjectInstanceId[] = [];
  const flattenedSubcardIds: FabObjectInstanceId[] = [];
  const next: Record<string, readonly FabObjectInstanceId[]> = Object.fromEntries(
    Object.entries(input.topology).map(([id, children]) => [id, [...children]]),
  );
  for (const sourceId of input.sourceIds) {
    if (!input.context.objectIds.has(sourceId) || !input.context.topLevelObjectIds.has(sourceId)) {
      throw new Error(`FAB transform source ${sourceId} is not a top-level card object.`);
    }
    if (sourceId === hostId) throw new Error("FAB transform source cannot be its destination.");
    const descendants = collectFabHostedDescendants(input.topology, sourceId);
    if (descendants.includes(hostId)) {
      throw new Error(`FAB transform destination ${hostId} is below source ${sourceId}.`);
    }
    newSubcardIds.push(sourceId);
    flattenedSubcardIds.push(sourceId, ...descendants);
    delete next[sourceId];
  }
  if (new Set(flattenedSubcardIds).size !== flattenedSubcardIds.length) {
    throw new Error("FAB transform source trees overlap.");
  }
  next[hostId] = [...(next[hostId] ?? []), ...flattenedSubcardIds];

  const topology = next as FabHostedCardTopology;
  const nextTopLevel = new Set(input.context.topLevelObjectIds);
  for (const id of newSubcardIds) nextTopLevel.delete(id);
  validateFabHostedCardTopology(topology, {
    objectIds: input.context.objectIds,
    topLevelObjectIds: nextTopLevel,
  });
  return { topology, newSubcardIds };
}

/** Plan the CR 3.0.14c/3.0.14e consequence of a top-card departure. */
export function planFabHostDeparture(input: {
  readonly topology: FabHostedCardTopology;
  readonly context: FabHostTopologyContext;
  readonly hostId: FabObjectInstanceId;
  readonly hostRemainsSameObject: boolean;
}): FabHostDeparturePlan {
  validateFabHostedCardTopology(input.topology, input.context);
  if (!input.context.objectIds.has(input.hostId)) {
    throw new Error(`FAB hosted-card departure references missing host ${input.hostId}.`);
  }
  if (input.hostRemainsSameObject) return { kind: "preserve", topology: input.topology };

  const clearSubcardIds = collectFabHostedDescendants(input.topology, input.hostId);
  const removed = new Set(clearSubcardIds);
  const topology: Record<string, readonly FabObjectInstanceId[]> = {};
  for (const [hostId, subcardIds] of Object.entries(input.topology)) {
    if (hostId === input.hostId || removed.has(hostId as FabObjectInstanceId)) continue;
    const retained = subcardIds.filter((id) => !removed.has(id));
    if (retained.length > 0) topology[hostId] = retained;
  }
  return { kind: "clear", topology, clearSubcardIds };
}

export function collectFabHostedDescendants(
  topology: FabHostedCardTopology,
  hostId: string,
): readonly FabObjectInstanceId[] {
  const result: FabObjectInstanceId[] = [];
  const visit = (id: string, ancestors: ReadonlySet<string>) => {
    if (ancestors.has(id)) throw new Error(`FAB hosted-card topology contains a cycle at ${id}.`);
    const nextAncestors = new Set(ancestors).add(id);
    for (const childId of topology[id] ?? []) {
      result.push(childId);
      visit(childId, nextAncestors);
    }
  };
  visit(hostId, new Set());
  return result;
}
