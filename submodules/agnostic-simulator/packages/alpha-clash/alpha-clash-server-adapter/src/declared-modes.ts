import { getCard } from "@tcg/alpha-clash-cards";
import {
  conditionMet,
  resolveEffectTargets,
  type MatchState,
  type PlayerId,
  type ProjectedState,
} from "@tcg/alpha-clash-engine";
import type { InteractionAction, InteractionInput } from "@tcg/protocol";
import { chosenTargetInputs } from "./interaction-protocol";

/** Declare a legal combination first, then collect only that combination's targets. */
export function withDeclaredModes(
  action: InteractionAction,
  state: MatchState,
  view: ProjectedState,
  seat: PlayerId,
): InteractionAction {
  if (!/^(playCard|respond):/.test(action.id) || !action.source?.instanceId) return action;
  const source = state.cards[action.source.instanceId];
  const definition = getCard(source.definitionId);
  const modes = "modes" in definition ? definition.modes : undefined;
  if (!modes?.length) return action;
  const count = "modeCount" in definition ? (definition.modeCount ?? 1) : 1;
  const combinations: number[][] = [];
  function collect(start: number, chosen: number[]) {
    if (chosen.length === count) {
      combinations.push(chosen);
      return;
    }
    for (let index = start; index < modes!.length; index++)
      if (!modes![index].condition || conditionMet(state, modes![index].condition!, source))
        collect(index + 1, [...chosen, index]);
  }
  collect(0, []);
  const inputs: InteractionInput[] = [];
  const options = combinations.map((indices) => {
    const id = indices.join(",");
    const targets = chosenTargetInputs(definition, view, seat, {
      sourceId: source.instanceId,
      abilityIndex: null,
      effects: [
        ...(definition.cardType === "action" && count > 1 ? definition.effects : []),
        ...indices.flatMap((index) => modes[index].effects),
      ],
      resolveTargets: (target) => {
        const selector = target.type === "declared" ? target.selector : target;
        return resolveEffectTargets(
          state,
          "chosen" in selector ? { ...selector, chosen: false } : selector,
          { state, playerId: seat, sourceId: source.instanceId },
        );
      },
    });
    const enabled = targets.every(
      (input) =>
        input.kind !== "entity-selection" ||
        input.candidates.filter((c) => c.enabled).length >= input.min,
    );
    if (enabled)
      inputs.push(
        ...targets.map((input) => ({
          ...input,
          id: `mode:${id}:${input.id}`,
          required: false,
          requiredWhen: [{ all: [{ inputId: "modeSelection", value: [id] }] }],
        })),
      );
    return { id, text: { key: indices.map((index) => modes[index].label).join("; ") }, enabled };
  });
  return {
    ...action,
    enabled: action.enabled && options.some((option) => option.enabled),
    inputs: [
      {
        kind: "option-selection",
        id: "modeSelection",
        text: { key: count === 1 ? "Choose a mode" : `Choose ${count} modes` },
        required: true,
        min: 1,
        max: 1,
        options,
      },
      ...action.inputs.filter((input) => !/^targetId(s)?(:\d+)?$/.test(input.id)),
      ...inputs,
    ],
  };
}
