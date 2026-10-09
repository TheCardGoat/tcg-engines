import { Bot, Pause, Play, SkipForward, UserRound } from "lucide-react";
import { useTableBotControls } from "../AiControlPanel/useTableBotControls";
import classes from "./MatchViewportV2.module.css";

/** Frequent bot actions remain available while the Match drawer is closed. */
export function BotShortcuts({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const { engine, botOn, automationDisabled, canStep, toggleTakeover, setMode } =
    useTableBotControls();
  if (!botOn && !alwaysVisible) return null;
  const pacingLabel = !botOn
    ? "Start bot autoplay"
    : engine.aiMode === "auto"
      ? "Pause bot"
      : "Resume bot";
  const controlLabel = !botOn
    ? "Switch player"
    : engine.aiTakeover
      ? "Return opponent to bot"
      : "Take over opponent";
  return (
    <div className={classes.botShortcuts} role="group" aria-label="Bot shortcuts">
      {alwaysVisible && (
        <button
          type="button"
          className={classes.undo}
          aria-label={botOn ? "Disable bot" : "Enable bot in step mode"}
          title={
            botOn ? "Disable bot · control both players" : "Enable bot · one decision at a time"
          }
          aria-pressed={botOn}
          disabled={
            engine.matchState.G.gameEnded || engine.isRemote || engine.boardCorrectionEnabled
          }
          onClick={() => setMode(botOn ? "off" : "step")}
        >
          <Bot size={18} aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        className={classes.undo}
        aria-label={pacingLabel}
        title={engine.isRemote ? "Bot playback is controlled by the server" : pacingLabel}
        disabled={automationDisabled}
        onClick={() => setMode(botOn && engine.aiMode === "auto" ? "step" : "auto")}
      >
        {botOn && engine.aiMode === "auto" ? (
          <Pause size={18} aria-hidden="true" />
        ) : (
          <Play size={18} aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        className={classes.undo}
        aria-label="Next bot decision"
        title="Run one bot decision"
        disabled={!canStep}
        onClick={engine.stepOnce}
      >
        <SkipForward size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={classes.undo}
        aria-label={controlLabel}
        title={controlLabel}
        aria-pressed={engine.aiTakeover !== null}
        disabled={engine.matchState.G.gameEnded}
        onClick={toggleTakeover}
      >
        <UserRound size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
