import { Hand } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { SimulatorParticipantActionButton } from "../../../../simulator/participant-actions/SimulatorParticipantActions";
import { PLAYER_SIDE_TO_ID, useEngine } from "../../engine";
import classes from "./PaymentSelectionPlayerAction.module.css";

export function CombatPriorityShortcut({ labeled = false }: { labeled?: boolean }) {
  const { matchState, humanSide, dispatch, hasPendingRemoteMove, interactionViews } = useEngine();
  const playerId = PLAYER_SIDE_TO_ID[humanSide];
  const held = matchState.G.players[playerId]?.combatPriority === "hold";
  const available = interactionViews[humanSide].actions.some(
    (action) => action.id === "setCombatPriority" && action.enabled,
  );
  return (
    <SimulatorParticipantActionButton
      type="button"
      className={`${classes.shortcut} ${labeled ? classes.labeled : ""}`}
      aria-label={labeled ? "Hold to react" : "Hold combat priority"}
      aria-pressed={held}
      data-active={held ? "true" : undefined}
      disabled={!available || hasPendingRemoteMove}
      tooltip={
        held
          ? "Combat priority is held until you switch this off. Pass when you are ready to finish reacting."
          : "Hold your React window even with nothing to play. Empty windows otherwise pass automatically."
      }
      onClick={() => {
        const result = dispatch({
          type: "setCombatPriority",
          mode: held ? "automatic" : "hold",
          as: playerId,
        });
        if (!result.success)
          notifications.show({
            title: "Could not change combat priority",
            message: result.error,
            color: "red",
          });
      }}
    >
      <Hand aria-hidden="true" size={18} />
      {labeled && (
        <>
          <span>Hold to react</span>
          <strong>{held ? "On" : "Off"}</strong>
        </>
      )}
    </SimulatorParticipantActionButton>
  );
}
