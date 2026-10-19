import {
  abilitiesForActivation,
  activationRequiresX,
  activationSendCostCandidates,
  type MatchState,
  type PlayerId,
} from "@tcg/alpha-clash-engine";
import type { AcAbilityCost } from "@tcg/alpha-clash-types";
import type { InteractionAction, InteractionInput } from "@tcg/protocol";

import { destination } from "./card-destination";

function costLabel(cost: AcAbilityCost | undefined, index: number): string {
  if (cost?.kind === "engage" && cost.target.type === "self") return "Engage this card";
  if (cost?.kind === "resources") {
    const pips = Object.entries(cost.cost.pips ?? {});
    const specific = pips.reduce((sum, [, amount]) => sum + amount, 0);
    const parts = pips.map(([color, amount]) => `${amount} ${color}`);
    const generic = cost.cost.total - specific;
    if (generic > 0) parts.push(`${generic} of any color`);
    if (cost.cost.x) parts.push("X of any color");
    return `Pay ${parts.join(" + ")} resources`;
  }
  return index === 0 ? "Printed cost" : `Alternative cost ${index}`;
}

/** Keep rule eligibility in the native engine; expose each printed payment route. */
export function withActivationCosts(
  action: InteractionAction,
  state: MatchState,
  seat: PlayerId,
): InteractionAction[] {
  const [type, sourceId, index] = action.id.split(":");
  if (type !== "activateAbility" || !sourceId || !state.cards[sourceId]) return [action];
  const ability = abilitiesForActivation(state, sourceId)[Number(index)];
  if (ability?.kind !== "activated") return [action];
  const inputs: InteractionInput[] = [...action.inputs];
  let enabled = action.enabled;
  if (ability.sendCost) {
    const ids = activationSendCostCandidates(state, seat, sourceId, ability.sendCost.target);
    enabled &&= ids.length >= ability.sendCost.amount;
    inputs.push({
      kind: "entity-selection",
      id: "sendCostCardIds",
      cardDestination: destination("Oblivion", "Send card"),
      text: { key: "Choose cards to send to Oblivion as the activation cost" },
      role: "cost",
      required: true,
      entityKinds: ["card"],
      min: ability.sendCost.amount,
      max: ability.sendCost.amount,
      ordered: false,
      candidates: ids.map((instanceId) => ({
        entity: { kind: "card", instanceId },
        enabled: true,
      })),
    });
  }
  return [ability.cost, ...(ability.alternateCosts ?? [])].map((cost, costIndex) => ({
    ...action,
    id: costIndex ? `${action.id}:${costIndex}` : action.id,
    requestId: costIndex ? `${action.requestId}:${costIndex}` : action.requestId,
    text: ability.alternateCosts?.length
      ? { key: `${action.text.key} (${costLabel(cost, costIndex)})` }
      : action.text,
    enabled,
    inputs: activationRequiresX(ability, cost)
      ? [
          ...inputs,
          {
            kind: "number",
            id: "xValue",
            text: { key: "Declare X" },
            required: true,
            min: 0,
            step: 1,
          },
        ]
      : inputs,
  }));
}
