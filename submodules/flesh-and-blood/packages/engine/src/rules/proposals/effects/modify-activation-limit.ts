import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, resolveLayerAmount, unsupported } from "../shared.ts";
import { findObjectZone } from "../../state-rules-view.ts";
import { snapshotObject } from "../../snapshots.ts";

export function proposeModifyActivationLimit(
  ctx: ProposalContext,
  effect: FabEffect & { type: "modify-activation-limit" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "activation-limit target is unresolved");
  // "You may attack with each X an additional time" over an empty bound set
  // is a vacuous grant, not a rules gap (CR 5.2.3c allowance with no subject).
  if (objects.length === 0) return { supported: true, events: [] };
  const count =
    typeof effect.count === "number"
      ? effect.count
      : resolveLayerAmount(state, layer, effect.count);
  if (count === null || !Number.isInteger(count) || count < 1)
    return unsupported(effect, "activation-limit count is not a positive integer");

  const events = objects.flatMap((object, objectIndex) => {
    const proxy = state.attackProxies[object.instanceId];
    const physical = proxy ? state.objects[proxy.sourceId] : state.objects[object.instanceId];
    const zone = physical ? findObjectZone(state, physical.instanceId) : null;
    const attackSource =
      physical && zone
        ? snapshotObject(
            state,
            physical.instanceId,
            proxy?.controllerId ?? layer.controllerId,
            zone.zone,
          )
        : object;
    // LIMIT exhaustion may remove an ability from the current functional view;
    // the grant exists precisely to make that authored active-face ability
    // usable again. Inspect stable active-face/base abilities at generation.
    const attackAbilityIds = attackSource.base.abilities.flatMap((ability) =>
      ability.kind === "activated" &&
      (ability.abilityType === "attack" ||
        ability.effect.type === "attack-with" ||
        ability.limit?.per === "turn")
        ? [ability.id]
        : [],
    );
    return attackAbilityIds.length === 0
      ? []
      : [
          {
            ...baseEvent(layer, processId),
            bindings: effect.outputBinding
              ? { ...layer.bindings, [effect.outputBinding]: attackSource }
              : layer.bindings,
            name: "activation-limit-modifier-generated" as const,
            affected: [attackSource],
            data: {
              object: attackSource,
              modifierId: `${processId}:${layer.layerId}:${effectPath.join(".")}:${objectIndex}`,
              attackAbilityIds,
              operation: effect.operation,
              count,
              turnNumber: state.turnNumber,
            },
          },
        ];
  });
  if (events.length === 0)
    return unsupported(effect, "activation-limit target has no attack activated ability");
  return { supported: true, events };
}
