import type { EngineInteractionView } from "@tcg/protocol";
import type { FabPresentationState } from "./state";

/** The player who must act, including windows where rules priority is closed. */
export function fabInteractionActorId(
  state: Pick<FabPresentationState, "combat" | "priorityPlayerId">,
  interactionView: Pick<EngineInteractionView, "resolution"> | null | undefined,
): string | null {
  const defenderId =
    state.combat?.step === "defend" && state.combat.defenseDeclarationPending
      ? state.combat.activeLink?.defendingPlayerId
      : undefined;
  return interactionView?.resolution?.actingPlayerId ?? defenderId ?? state.priorityPlayerId;
}
