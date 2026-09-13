import type { FabLkiId, FabMoveLkiSnapshot, FabObjectRecord } from "./objects.ts";

export interface FabLkiStore {
  readonly objects: Readonly<Record<string, Pick<FabObjectRecord, "history">>>;
  lkiArena: Record<FabLkiId, FabMoveLkiSnapshot>;
  readonly rulesStack?: readonly unknown[];
  readonly rulesProcess?: unknown;
  readonly decision?: unknown;
  readonly delayedTriggers?: readonly unknown[];
  readonly replacementEffects?: readonly unknown[];
  readonly continuousEffectInstances?: readonly unknown[];
  readonly attackProxies?: Readonly<Record<string, unknown>>;
  readonly combat?: unknown;
  readonly lastClosedCombat?: unknown;
}

/** Retain exactly the move LKI referenced by current bounded rules facts. */
export function collectReachableFabLki(state: FabLkiStore): void {
  const reachable = collectReachableFabLkiIds(state);
  for (const lkiId of Object.keys(state.lkiArena) as FabLkiId[]) {
    if (!reachable.has(lkiId)) delete state.lkiArena[lkiId];
  }
}

/**
 * LKI is reachable when a live object's move history names it, or when a
 * still-pending rules fact (stack, process, combat, delayed/replacement/
 * continuous) still names that exact instance+incarnation. Token cease
 * (Bloodrot Pox) deletes the live record while the resolving layer keeps
 * the source; that identity must stay interned until the layer leaves.
 */
export function collectReachableFabLkiIds(state: FabLkiStore): Set<FabLkiId> {
  const reachable = new Set<FabLkiId>();
  const namedRefs = new Set<string>();
  for (const object of Object.values(state.objects)) {
    for (const move of object.history.moves) {
      if (!move.lki) continue;
      if (!state.lkiArena[move.lki]) {
        throw new Error(`FAB move history references missing LKI ${move.lki}.`);
      }
      reachable.add(move.lki);
    }
  }
  // Object records are scanned field-by-field so a record's own top-level
  // instanceId+incarnation never self-anchors its LKI (a live identity is
  // resolvable through the object map itself; arena entries for it would
  // never prune). Nested refs inside records — e.g. a created token's
  // frozen-copy baseSource.source naming its origin incarnation — still
  // anchor, because that origin may no longer be live.
  for (const object of Object.values(state.objects)) {
    for (const entry of Object.values(object)) {
      collectNamedObjectRefs(entry, namedRefs);
    }
  }
  collectNamedObjectRefs(state.rulesStack, namedRefs);
  collectNamedObjectRefs(state.rulesProcess, namedRefs);
  collectNamedObjectRefs(state.decision, namedRefs);
  collectNamedObjectRefs(state.delayedTriggers, namedRefs);
  collectNamedObjectRefs(state.replacementEffects, namedRefs);
  collectNamedObjectRefs(state.continuousEffectInstances, namedRefs);
  collectNamedObjectRefs(state.attackProxies, namedRefs);
  collectNamedObjectRefs(state.combat, namedRefs);
  collectNamedObjectRefs(state.lastClosedCombat, namedRefs);
  for (const [lkiId, snapshot] of Object.entries(state.lkiArena) as [
    FabLkiId,
    FabMoveLkiSnapshot,
  ][]) {
    if (namedRefs.has(objectRefKey(snapshot.ref.instanceId, snapshot.ref.incarnation))) {
      reachable.add(lkiId);
    }
  }
  return reachable;
}

/**
 * Turn-rollover companion to {@link collectReachableFabLki}: object move
 * histories are cleared at the boundary, but pending rules facts (an in-flight
 * end-turn process carrying pre-rollover resolution groups, or a surviving
 * triggered layer) may still reference pre-rollover incarnations, and
 * persistence requires every such reference to stay anchored to a live record
 * or an LKI snapshot. Retain exactly the arena entries those facts still
 * name; everything else retires with the turn.
 */
export function pruneFabLkiToPendingFacts(state: FabLkiStore): void {
  const reachable = collectReachableFabLkiIds(state);
  for (const lkiId of Object.keys(state.lkiArena) as FabLkiId[]) {
    if (!reachable.has(lkiId)) delete state.lkiArena[lkiId];
  }
}

function objectRefKey(instanceId: string, incarnation: number): string {
  return `${instanceId}#${incarnation}`;
}

function collectNamedObjectRefs(value: unknown, named: Set<string>): void {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) {
    for (const entry of value) collectNamedObjectRefs(entry, named);
    return;
  }
  if (typeof value !== "object") {
    return;
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.instanceId === "string" &&
    typeof record.incarnation === "number" &&
    Number.isInteger(record.incarnation)
  ) {
    named.add(objectRefKey(record.instanceId, record.incarnation));
  }
  if (
    record.ref &&
    typeof record.ref === "object" &&
    !Array.isArray(record.ref) &&
    typeof (record.ref as { instanceId?: unknown }).instanceId === "string" &&
    Number.isInteger((record.ref as { incarnation?: unknown }).incarnation)
  ) {
    named.add(
      objectRefKey(
        (record.ref as { instanceId: string }).instanceId,
        (record.ref as { incarnation: number }).incarnation,
      ),
    );
  }
  for (const entry of Object.values(record)) {
    collectNamedObjectRefs(entry, named);
  }
}
