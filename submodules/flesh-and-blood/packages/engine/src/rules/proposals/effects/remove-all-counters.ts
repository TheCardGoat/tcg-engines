import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, unsupported } from "../shared.ts";

/**
 * CR 8.5.16 Remove all [named] counters from target objects.
 * When no counter kind is specified, removes every named counter present.
 */
export function proposeRemoveAllCounters(
  ctx: ProposalContext,
  effect: FabEffect & { type: "remove-all-counters" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "remove-all-counters target is unresolved");
  if (objects.length === 0) return { supported: true, events: [] };

  const events = [];
  let countersRemoved =
    typeof layer.bindings["counters-removed"] === "number" ? layer.bindings["counters-removed"] : 0;
  for (const object of objects) {
    const live = state.objects[object.instanceId];
    if (!live) continue;
    if (effect.counter?.kind === "named") {
      const counterName = effect.counter.name;
      const amount =
        live.counters
          .filter((c) => c.kind === "named" && c.name === counterName)
          .reduce((sum, c) => sum + (c.kind === "named" ? c.count : 0), 0) || 0;
      if (amount < 1) continue;
      countersRemoved += amount;
      events.push({
        ...baseEvent(layer, processId),
        name: "counter-removed" as const,
        affected: [object],
        bindings: {
          ...layer.bindings,
          "counters-removed": countersRemoved,
          ...(effect.outputBinding ? { [effect.outputBinding]: object } : {}),
        },
        data: { object, counter: counterName, amount },
      });
      continue;
    }
    if (effect.counter?.kind === "numeric") {
      const numeric = effect.counter;
      const amount = live.counters
        .filter(
          (c) =>
            c.kind === "numeric" && c.property === numeric.property && c.value === numeric.value,
        )
        .reduce((sum, c) => sum + (c.kind === "numeric" ? c.count : 0), 0);
      if (amount < 1) continue;
      countersRemoved += amount;
      events.push({
        ...baseEvent(layer, processId),
        name: "numeric-counter-removed" as const,
        affected: [object],
        bindings: {
          ...layer.bindings,
          "counters-removed": countersRemoved,
          ...(effect.outputBinding ? { [effect.outputBinding]: object } : {}),
        },
        data: {
          object,
          property: numeric.property,
          value: numeric.value,
          count: amount,
        },
      });
      continue;
    }
    // Remove every named counter stack.
    for (const counter of live.counters) {
      if (counter.kind !== "named" || counter.count < 1) continue;
      countersRemoved += counter.count;
      events.push({
        ...baseEvent(layer, processId),
        name: "counter-removed" as const,
        affected: [object],
        bindings: {
          ...layer.bindings,
          "counters-removed": countersRemoved,
          ...(effect.outputBinding ? { [effect.outputBinding]: object } : {}),
        },
        data: { object, counter: counter.name, amount: counter.count },
      });
    }
  }
  return { supported: true, events };
}
