import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, unsupported } from "../shared.ts";

/**
 * CR 8.5.42 Move a counter from one object to another — emit remove then add.
 */
export function proposeMoveCounter(
  ctx: ProposalContext,
  effect: FabEffect & { type: "move-counter" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const fromObjects = objectTargets(
    state,
    layer,
    effect.from,
    `${targetPath}:from`,
    effectTargets,
    effectPath,
  );
  const toObjects = objectTargets(
    state,
    layer,
    effect.to,
    `${targetPath}:to`,
    effectTargets,
    effectPath,
  );
  if (!fromObjects) return unsupported(effect, "move-counter from target is unresolved");
  if (!toObjects) return unsupported(effect, "move-counter to target is unresolved");
  // Empty from (no other aura, 0 counters) is a no-op, not unresolved.
  if (fromObjects.length === 0) return { supported: true, events: [] };
  const movesAnyNumber = typeof effect.count === "object" && effect.count.type === "any-number";
  if (!movesAnyNumber && fromObjects.length !== 1) {
    return unsupported(effect, "move-counter from target is unresolved");
  }
  if (toObjects.length !== 1) {
    return unsupported(effect, "move-counter to target is unresolved");
  }
  const to = toObjects[0]!;
  if (effect.counter.kind === "numeric") {
    const { property, value } = effect.counter;
    if (typeof value !== "number") {
      return unsupported(effect, "numeric counter value must be constant");
    }
    const selected = movesAnyNumber
      ? (ctx.effectPartitions[ctx.effectPath.join(".")]?.selected ?? [])
      : [];
    const selectedBySource = new Map<string, number>();
    for (const id of selected) {
      try {
        const parsed: unknown = JSON.parse(id);
        if (
          Array.isArray(parsed) &&
          typeof parsed[0] === "string" &&
          typeof parsed[1] === "number" &&
          fromObjects.some((object) => object.instanceId === parsed[0])
        ) {
          selectedBySource.set(parsed[0], (selectedBySource.get(parsed[0]) ?? 0) + 1);
        }
      } catch {
        return unsupported(effect, "move-counter selection is malformed");
      }
    }
    const moveCounts = fromObjects.flatMap((from) => {
      const live = state.objects[from.instanceId];
      const available =
        live?.counters.reduce((sum, counter) => {
          return counter.kind === "numeric" &&
            counter.property === property &&
            counter.value === value
            ? sum + counter.count
            : sum;
        }, 0) ?? 0;
      const count = movesAnyNumber
        ? Math.min(selectedBySource.get(from.instanceId) ?? 0, available)
        : Math.min(1, available);
      return count > 0 ? [{ from, count }] : [];
    });
    if (moveCounts.length === 0) return { supported: true, events: [] };
    return {
      supported: true,
      events: moveCounts.flatMap(({ from, count }) => [
        {
          ...baseEvent(layer, processId),
          name: "numeric-counter-removed" as const,
          affected: [from],
          data: { object: from, property, value, count },
        },
        {
          ...baseEvent(layer, processId),
          name: "numeric-counter-added" as const,
          affected: [to],
          data: { object: to, property, value, count },
        },
      ]),
    };
  }
  if (effect.counter.kind !== "named") {
    return unsupported(effect, "move-counter only supports named or numeric counters");
  }
  const counter = effect.counter.name;
  const from = fromObjects[0]!;
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "counter-removed",
        affected: [from],
        data: { object: from, counter, amount: 1 },
      },
      {
        ...baseEvent(layer, processId),
        name: "counter-added",
        affected: [to],
        data: { object: to, counter, amount: 1 },
      },
    ],
  };
}
