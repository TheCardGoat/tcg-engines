import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, resolveLayerAmount, unsupported } from "../shared.ts";

/**
 * CR 8.5.58 Sharpen: put a +1{p} counter on the target sword and mark it as
 * sharpened this turn. `times` allows "sharpen an additional time" replacements
 * (extra counters beyond the base one).
 */
export function proposeSharpen(
  ctx: ProposalContext,
  effect: FabEffect & { type: "sharpen" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "sharpen target is unresolved");

  const timesRaw = effect.times ?? 1;
  const resolved =
    typeof timesRaw === "number" ? timesRaw : resolveLayerAmount(state, layer, timesRaw);
  if (resolved === null) return unsupported(effect, "sharpen count could not be resolved");
  // `times` is the total number of sharpen applications (printed "Sharpen" =
  // 1; "for each token destroyed this way" = that count). Additional-time
  // replacements bump event.data.count via additionalSharpenExtra, not here.
  const totalCounters = Math.max(0, resolved);
  if (totalCounters === 0) return { supported: true, events: [] };

  const controllerId = layer.controllerId;
  const events: ProposedEvent[] = [];
  for (const object of objects) {
    // Emit a single replaceable `sharpen` event. Replacements (swordmaster
    // path, Reverent Rerebrace) may boost `count` or attach pay/destroy
    // sub-events before the reducer applies counters + status.
    events.push({
      ...baseEvent(layer, processId),
      name: "sharpen",
      affected: [object],
      // Bind the sharpened sword for follow-up steps ("If it has 1 or more
      // +1{p} counters..." — same LKI staging look/reveal use for sequences).
      bindings: {
        ...layer.bindings,
        ...("outputBinding" in effect && typeof effect.outputBinding === "string"
          ? { [effect.outputBinding]: objects.length === 1 ? object : objects }
          : {}),
      },
      data: {
        object,
        playerId: controllerId,
        count: totalCounters,
      },
    });
  }
  return { supported: true, events };
}
