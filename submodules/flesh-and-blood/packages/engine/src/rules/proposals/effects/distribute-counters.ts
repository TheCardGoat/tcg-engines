import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, resolveLayerAmount, unsupported } from "../shared.ts";

/**
 * CR 8.5.30 Distribute N counters among targets — when selection is
 * unresolved, put all counters on the first legal target (leaf default).
 * Named and numeric counters share the same even-distribution policy.
 */
export function proposeDistributeCounters(
  ctx: ProposalContext,
  effect: FabEffect & { type: "distribute-counters" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const count =
    typeof effect.count === "number"
      ? effect.count
      : resolveLayerAmount(state, layer, effect.count);
  if (count === null || count < 1) {
    return unsupported(effect, "distribute-counters count is not positive");
  }
  const objects = objectTargets(state, layer, effect.among, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "distribute-counters among is unresolved");
  if (objects.length === 0) return { supported: true, events: [] };

  // Even distribution with remainder on the first target.
  const base = Math.floor(count / objects.length);
  let remainder = count % objects.length;
  const events = [];
  for (const object of objects) {
    const amount = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
    if (amount < 1) continue;
    if (effect.counter.kind === "numeric") {
      events.push({
        ...baseEvent(layer, processId),
        name: "numeric-counter-added" as const,
        affected: [object],
        data: {
          object,
          property: effect.counter.property,
          value: effect.counter.value,
          count: amount,
        },
      });
    } else {
      events.push({
        ...baseEvent(layer, processId),
        name: "counter-added" as const,
        affected: [object],
        data: { object, counter: effect.counter.name, amount },
      });
    }
  }
  return { supported: true, events };
}
