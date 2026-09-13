import type { GrandArchiveCommittedEvent } from "./events.ts";
import type { GrandArchiveObjectId } from "../game/identity.ts";
import type { GrandArchiveActivationPaymentRecord, GrandArchiveStackItem } from "../game/model.ts";
import type { GrandArchiveExecutionBinding } from "../procedures/effects/evaluation.ts";

function substitutionMap(
  events: readonly GrandArchiveCommittedEvent[],
): ReadonlyMap<GrandArchiveObjectId, GrandArchiveObjectId> {
  const substitutions = new Map<GrandArchiveObjectId, GrandArchiveObjectId>();
  for (const event of events) {
    if (event.type === "object-reference-substituted") {
      substitutions.set(event.originalObjectId, event.substituteObjectId);
    }
  }
  return substitutions;
}

function finalSubstitute(
  objectId: GrandArchiveObjectId,
  substitutions: ReadonlyMap<GrandArchiveObjectId, GrandArchiveObjectId>,
): GrandArchiveObjectId {
  let current = objectId;
  const visited = new Set<GrandArchiveObjectId>();
  while (!visited.has(current)) {
    visited.add(current);
    const substitute = substitutions.get(current);
    if (!substitute) return current;
    current = substitute;
  }
  throw new Error("Reference substitution cycle detected");
}

export function applyGrandArchiveReferenceSubstitutions(
  bindings: Readonly<Record<string, GrandArchiveExecutionBinding>>,
  events: readonly GrandArchiveCommittedEvent[],
): Readonly<Record<string, GrandArchiveExecutionBinding>> {
  const substitutions = substitutionMap(events);
  if (substitutions.size === 0) return bindings;
  return Object.fromEntries(
    Object.entries(bindings).map(([binding, value]) => [
      binding,
      Array.isArray(value)
        ? value.map((entry) =>
            typeof entry === "string"
              ? finalSubstitute(entry as GrandArchiveObjectId, substitutions)
              : entry,
          )
        : value,
    ]),
  );
}

export function applyGrandArchivePaymentReferenceSubstitutions(
  payment: readonly GrandArchiveActivationPaymentRecord[],
  events: readonly GrandArchiveCommittedEvent[],
): readonly GrandArchiveActivationPaymentRecord[] {
  const substitutions = substitutionMap(events);
  if (substitutions.size === 0) return payment;
  return payment.map((record) => ({
    ...record,
    objectId: finalSubstitute(record.objectId, substitutions),
  }));
}

export function applyGrandArchiveStackItemReferenceSubstitutions(
  item: GrandArchiveStackItem,
  events: readonly GrandArchiveCommittedEvent[],
): GrandArchiveStackItem {
  const bindings = applyGrandArchiveReferenceSubstitutions(item.bindings, events);
  const activationPayment = applyGrandArchivePaymentReferenceSubstitutions(
    item.activationPayment,
    events,
  );
  return bindings === item.bindings && activationPayment === item.activationPayment
    ? item
    : { ...item, bindings, activationPayment };
}
