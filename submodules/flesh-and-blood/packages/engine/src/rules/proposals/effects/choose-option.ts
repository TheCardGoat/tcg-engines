import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, playersForFabPlayer, unsupported } from "../shared.ts";

/** Shared option-binding key for one chooser on a choose-option leaf. */
export function chooseOptionBindingKey(path: readonly number[], chooserId: string): string {
  return `${path.join(".")}:${chooserId}`;
}

/** In 1v1, an "each hero chooses" effect starts with the opponent. */
export function orderChooseOptionChoosers(
  controllerId: string,
  chooserIds: readonly string[],
): string[] {
  return [
    ...chooserIds.filter((id) => id !== controllerId),
    ...chooserIds.filter((id) => id === controllerId),
  ];
}

/**
 * CR free choice among named options (e.g. war/peace). Binds the choice and
 * stamps `chose-<option>` status on the chooser hero so later conditionals
 * can branch. Does **not** invent damage or other option-specific effects —
 * those are separate sequence/conditional steps.
 */
export function proposeChooseOption(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choose-option" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  if (effect.options.length === 0) {
    return unsupported(effect, "choose-option has no options");
  }
  const chooserIds = playersForFabPlayer(
    state,
    layer.controllerId,
    effect.chooser ?? "controller",
    layer.bindings,
  );
  if (!chooserIds || chooserIds.length === 0) {
    return unsupported(effect, "choose-option chooser is unresolved");
  }

  const events = [];
  const ordered = orderChooseOptionChoosers(layer.controllerId, chooserIds);
  for (const chooserId of ordered) {
    const key = chooseOptionBindingKey(ctx.effectPath, chooserId);
    const chosen = ctx.effectOptions[key];
    if (!chosen || !effect.options.includes(chosen)) {
      return unsupported(effect, "choose-option selection is not among printed options");
    }
    const heroId = state.containers.zonesByPlayerId[chooserId]?.heroZone[0];
    if (!heroId) return unsupported(effect, "choose-option chooser has no hero");
    const hero = snapshotObject(state, heroId, chooserId, "heroZone");
    events.push({
      ...baseEvent(layer, processId),
      name: "set-status" as const,
      affected: [hero],
      bindings: {
        ...layer.bindings,
        "chosen-option": chosen,
        chosenOption: chosen,
        chosen,
        "named-card": chosen,
        namedCard: chosen,
        [`chose-${chosen}`]: true,
      },
      data: { object: hero, status: `chose-${chosen}` },
    });
  }

  return { supported: true, events };
}
