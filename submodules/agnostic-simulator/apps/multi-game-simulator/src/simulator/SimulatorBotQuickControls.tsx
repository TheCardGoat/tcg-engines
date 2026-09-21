import { IconPlayerPause, IconPlayerPlay, IconPlayerTrackNext } from "@tabler/icons-react";

import classes from "./SimulatorBotQuickControls.module.css";

export type SimulatorBotPacing = "auto" | "step";
export type SimulatorBotSpeed = "fast" | "balanced" | "slow";

/** Shared pacing buckets used by local browser-controlled bot loops. */
export const SIMULATOR_BOT_SPEED_MS: Readonly<Record<SimulatorBotSpeed, number>> = {
  fast: 250,
  balanced: 600,
  slow: 1400,
};

export interface SimulatorBotQuickControlsProps {
  readonly practiceMode?: "bot" | "self";
  readonly pacing: SimulatorBotPacing;
  readonly takeoverActive: boolean;
  readonly canTakeover?: boolean;
  readonly canStep: boolean;
  readonly disabled?: boolean;
  readonly testIdPrefix: string;
  readonly onToggleTakeover: () => void;
  readonly onChangePacing: (pacing: SimulatorBotPacing) => void;
  readonly onStep: () => void;
}

/**
 * Always-visible bot controls shared by local simulator sidebars.
 *
 * The configuration disclosure remains owned by SimulatorMatchSidebar. This
 * strip keeps the frequent controls available without opening that disclosure.
 */
export function SimulatorBotQuickControls({
  practiceMode = "bot",
  pacing,
  takeoverActive,
  canTakeover = true,
  canStep,
  disabled = false,
  testIdPrefix,
  onToggleTakeover,
  onChangePacing,
  onStep,
}: SimulatorBotQuickControlsProps) {
  const automationDisabled = disabled || takeoverActive;

  return (
    <div className={classes.root} data-pacing={pacing} data-takeover={takeoverActive}>
      <button
        type="button"
        className={classes.takeover}
        data-testid={`${testIdPrefix}-take-control`}
        aria-label={
          takeoverActive
            ? practiceMode === "self"
              ? "Switch to your seat"
              : "Return opponent to bot"
            : "Control opponent"
        }
        title={
          takeoverActive
            ? practiceMode === "self"
              ? "Switch perspective and control your original seat"
              : "Return to your seat and resume the bot"
            : practiceMode === "self"
              ? "Switch perspective and control the opponent seat"
              : "Pause the bot and control its seat"
        }
        disabled={disabled || !canTakeover}
        onClick={onToggleTakeover}
      >
        {takeoverActive
          ? practiceMode === "self"
            ? "Switch to your seat"
            : "Return to bot"
          : "Control opponent"}
      </button>

      {practiceMode === "self" ? null : pacing === "auto" ? (
        <button
          type="button"
          className={classes.iconButton}
          data-testid={`${testIdPrefix}-pause`}
          aria-label="Pause automatic bot playback"
          title="Pause bot playback and advance one move at a time"
          disabled={automationDisabled}
          onClick={() => onChangePacing("step")}
        >
          <IconPlayerPause size={15} stroke={2.3} aria-hidden="true" />
        </button>
      ) : (
        <>
          <button
            type="button"
            className={classes.nextButton}
            data-testid={`${testIdPrefix}-next`}
            aria-label="Run next bot move"
            title="Run the bot's next legal move"
            disabled={automationDisabled || !canStep}
            onClick={onStep}
          >
            <IconPlayerTrackNext size={14} stroke={2.2} aria-hidden="true" />
            <span>Next</span>
          </button>
          <button
            type="button"
            className={classes.iconButton}
            data-testid={`${testIdPrefix}-play`}
            aria-label="Resume automatic bot playback"
            title="Resume automatic bot playback"
            disabled={automationDisabled}
            onClick={() => onChangePacing("auto")}
          >
            <IconPlayerPlay size={15} stroke={2.3} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
