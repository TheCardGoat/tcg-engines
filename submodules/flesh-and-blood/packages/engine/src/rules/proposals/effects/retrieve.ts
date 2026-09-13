import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { objectTargets, unsupported } from "../shared.ts";
import { proposePay } from "../asset-effects.ts";
import { proposeEquip } from "./equip.ts";

/**
 * CR 8.5.51 Retrieve: pay {cost} then equip the target. If the target cannot
 * be equipped (no legal empty slot / unsuitable object), the effect fails
 * (8.5.51a) and no payment is produced. Composes the existing pay + equip
 * proposers, ordering pay first then equip.
 *
 * NAMING NOTE: this is the Retrieve *effect keyword* (`type: "retrieve"`,
 * pay-to-equip). It is distinct from the Retrieve *label keyword* used by
 * cards that move a card graveyard→hand — those model the action as a
 * `move-card` effect with `label: { name: "retrieve" }`, NOT this proposer.
 * No card currently emits `type: "retrieve"`, so this proposer is forward
 * coverage until one does; add the first consuming card alongside a test.
 */
export function proposeRetrieve(
  ctx: ProposalContext,
  effect: FabEffect & { type: "retrieve" },
): FabEffectProposalResult {
  const { state, layer, effectTargets, effectPath, targetPath } = ctx;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "retrieve target is unresolved");
  // 8.5.51a: the card must exist and be equippable before payment is allowed.
  if (objects.length === 0) return unsupported(effect, "retrieve target does not exist (8.5.51a)");

  // Gate equippability via the equip proposer with the same target; if it
  // cannot equip, retrieve fails and no resources are spent.
  const equipProbe = proposeEquip(ctx, { type: "equip", target: effect.target, zone: effect.zone });
  if (!equipProbe.supported) {
    return unsupported(effect, "retrieve target cannot be equipped (8.5.51a)");
  }

  const pay = proposePay(ctx, { type: "pay", cost: effect.cost, payer: "controller" });
  if (!pay.supported) return unsupported(effect, "retrieve cost cannot be paid");

  return {
    supported: true,
    events: [...pay.events, ...equipProbe.events],
    eventGroups: [
      ...(pay.eventGroups ?? [pay.events]),
      ...(equipProbe.eventGroups ?? [equipProbe.events]),
    ],
  };
}
