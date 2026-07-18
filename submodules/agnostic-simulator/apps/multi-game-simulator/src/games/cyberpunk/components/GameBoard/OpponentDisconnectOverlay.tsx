import { useCallback, useState } from "react";
import { IconClockPause, IconMaximize, IconMinus, IconWifiOff } from "@tabler/icons-react";
import { useOpponentPresence } from "../../engine/live/useOpponentPresence";
import { connectionUiStatus } from "../../engine/live/playerConnectionState";
import type { PlayerConnectionInfo } from "../../engine/sides";
import classes from "./OpponentDisconnectOverlay.module.css";

interface OpponentDisconnectOverlayProps {
  variant: "opponent" | "self";
  connection?: PlayerConnectionInfo;
  onClaimDrop?: () => void;
  claimAvailable?: boolean;
  timeoutExpired?: boolean;
}

const RING_RADIUS = 38;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const MAX_SECONDS = 30;

export function OpponentDisconnectOverlay({
  variant,
  connection,
  onClaimDrop,
  claimAvailable = false,
  timeoutExpired = false,
}: OpponentDisconnectOverlayProps) {
  const status = connectionUiStatus(connection);
  const { secondsRemaining, canDrop } = useOpponentPresence(connection);
  const [minimized, setMinimized] = useState(false);
  const [confirmingDrop, setConfirmingDrop] = useState(false);
  const opponentDisconnected = variant === "opponent" && status === "disconnected";
  const timeoutMode = variant === "opponent" && !opponentDisconnected && timeoutExpired;
  const dropReady = opponentDisconnected ? canDrop : timeoutMode;
  const canShowDropAction = dropReady && claimAvailable && Boolean(onClaimDrop);

  const handleDropClick = useCallback(() => {
    if (confirmingDrop) {
      setConfirmingDrop(false);
      onClaimDrop?.();
    } else {
      setConfirmingDrop(true);
    }
  }, [confirmingDrop, onClaimDrop]);

  const handleCancelDrop = useCallback(() => {
    setConfirmingDrop(false);
  }, []);

  const handleMinimize = useCallback(() => {
    setMinimized(true);
    setConfirmingDrop(false);
  }, []);

  const handleExpand = useCallback(() => {
    setMinimized(false);
  }, []);

  if (variant === "opponent" && !opponentDisconnected && !timeoutMode) {
    return null;
  }
  if (variant === "self" && status !== "disconnected" && status !== "reconnecting") {
    return null;
  }

  const ringProgress =
    variant === "opponent"
      ? RING_CIRCUMFERENCE * (1 - Math.min(secondsRemaining, MAX_SECONDS) / MAX_SECONDS)
      : 0;

  if (variant === "opponent" && minimized) {
    return (
      <button
        type="button"
        className={`${classes.pill} ${dropReady ? classes.pillReady : ""}`}
        onClick={handleExpand}
        data-mobile-field-overlay
        aria-label={
          timeoutMode
            ? "Opponent time expired - expand options"
            : "Opponent disconnected - expand options"
        }
      >
        <span className={classes.pillIcon}>
          {timeoutMode ? (
            <IconClockPause size={14} stroke={2} />
          ) : canDrop ? (
            <IconWifiOff size={14} stroke={2} />
          ) : (
            <span className={classes.pillCount}>{secondsRemaining}</span>
          )}
        </span>
        <span className={classes.pillLabel}>
          {timeoutMode ? "Time expired" : canDrop ? "Disconnected" : "Disconnecting"}
        </span>
        <span className={classes.pillExpand} aria-hidden="true">
          <IconMaximize size={12} stroke={2} />
        </span>
      </button>
    );
  }

  return (
    <div
      className={`${classes.overlay} ${dropReady && variant === "opponent" ? classes.overlayCanDrop : ""} ${
        timeoutMode ? classes.overlayTimeout : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={classes.content}>
        {variant === "opponent" ? (
          <>
            <button
              type="button"
              className={classes.minimize}
              onClick={handleMinimize}
              aria-label="Minimize"
            >
              <IconMinus size={14} stroke={2.2} />
            </button>

            {timeoutMode ? (
              <div className={classes.timeoutIcon}>
                <IconClockPause size={30} stroke={1.8} />
              </div>
            ) : (
              <div className={classes.ring}>
                <svg viewBox="0 0 96 96" className={classes.ringSvg}>
                  <circle
                    cx="48"
                    cy="48"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={RING_RADIUS}
                    fill="none"
                    stroke={canDrop ? "#ff3d8a" : "#f5e642"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={ringProgress}
                    className={classes.ringProgress}
                    transform="rotate(-90 48 48)"
                  />
                </svg>
                <span className={`${classes.ringValue} ${canDrop ? classes.ringValueReady : ""}`}>
                  {canDrop ? <IconWifiOff size={24} stroke={2} /> : secondsRemaining}
                </span>
              </div>
            )}

            <span className={classes.label}>
              {timeoutMode
                ? "Opponent time expired"
                : canDrop
                  ? "Opponent has disconnected"
                  : "Opponent disconnected"}
            </span>

            {canShowDropAction ? (
              <div className={classes.actions}>
                {confirmingDrop ? (
                  <>
                    <button
                      type="button"
                      className={`${classes.actionButton} ${classes.confirmButton}`}
                      onClick={handleDropClick}
                    >
                      Confirm Drop
                    </button>
                    <button
                      type="button"
                      className={`${classes.actionButton} ${classes.cancelButton}`}
                      onClick={handleCancelDrop}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={`${classes.actionButton} ${classes.claimButton}`}
                    onClick={handleDropClick}
                  >
                    Drop Opponent
                  </button>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className={classes.selfIcon}>
              <IconWifiOff size={28} stroke={1.8} />
            </div>
            <span className={classes.label}>Connection lost</span>
            <span className={classes.sublabel}>Reconnecting...</span>
          </>
        )}
      </div>
    </div>
  );
}
