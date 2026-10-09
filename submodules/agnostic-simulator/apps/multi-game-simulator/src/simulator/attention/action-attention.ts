import type { EngineInteractionView } from "@tcg/protocol";

/** A viewer-relative decision which still needs a player action. */
export interface ActionAttention {
  readonly key: string;
  readonly label: string;
}

const NON_GAMEPLAY_INTENTS = new Set<EngineInteractionView["actions"][number]["intent"]>([
  "concede",
  "undo",
]);

export function actionAttentionFromInteraction(input: {
  readonly view: EngineInteractionView | null | undefined;
  readonly viewerId: string | null | undefined;
  readonly stateVersion: number | null | undefined;
  readonly canAct: boolean;
  readonly submitting?: boolean;
  readonly label?: string;
}): ActionAttention | null {
  const { view, viewerId, stateVersion } = input;
  if (!input.canAct || input.submitting || !view || !viewerId || stateVersion == null) return null;
  if (view.projectionFailure || view.stateVersion !== stateVersion) return null;
  if (
    view.actorId !== viewerId ||
    (view.resolution?.actingPlayerId !== undefined && view.resolution.actingPlayerId !== viewerId)
  )
    return null;
  if (view.status !== "ready" && view.status !== "choosing") return null;

  const actions = view.actions.filter(
    (action) => action.enabled && !NON_GAMEPLAY_INTENTS.has(action.intent),
  );
  if (actions.length === 0) return null;

  const resolution = view.resolution;
  const decisionId = resolution
    ? `resolution:${resolution.currentEffect.id}:${resolution.currentStep.index}`
    : `actions:${actions
        .map((action) => `${action.intent}:${action.id}`)
        .sort()
        .join("|")}`;
  return {
    key: `${viewerId}:${stateVersion}:${decisionId}`,
    label: input.label ?? (resolution ? "Your decision" : "Your move"),
  };
}
