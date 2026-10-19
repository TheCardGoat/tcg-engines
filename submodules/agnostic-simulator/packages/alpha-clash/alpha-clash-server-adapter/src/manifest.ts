import { getCard } from "@tcg/alpha-clash-cards";
import type { MatchState, PlayerId } from "@tcg/alpha-clash-engine";
import type { InteractionAction } from "@tcg/protocol";

export function withManifestRoute(
  action: InteractionAction,
  state: MatchState,
  seat: PlayerId,
): InteractionAction {
  if (!action.id.startsWith("playCard:") || !action.source?.instanceId) return action;
  const source = state.cards[action.source.instanceId];
  const definition = getCard(source.definitionId);
  const cost = "manifestDiminishCost" in definition ? definition.manifestDiminishCost : undefined;
  if (cost === undefined) return action;
  return {
    ...action,
    inputs: [
      {
        kind: "option-selection",
        id: "manifestRoute",
        text: { key: "Choose how to play" },
        required: true,
        min: 1,
        max: 1,
        options: [
          { id: "normal", text: { key: "Pay the resource cost" }, enabled: true },
          {
            id: "manifest",
            text: { key: `Manifest: diminish ${cost} cards` },
            enabled: !state.manifestedThisTurn[seat] && state.deckOrder[seat].length >= cost,
          },
        ],
      },
      ...action.inputs.map((input) =>
        input.id === "resourcePayment"
          ? {
              ...input,
              required: false,
              requiredWhen: [{ all: [{ inputId: "manifestRoute", value: ["normal"] }] }],
            }
          : input,
      ),
    ],
  };
}
