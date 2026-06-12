import { useCallback, useState } from "react";
import { IconMaximize, IconMinus, IconWifiOff } from "@tabler/icons-react";
import { useOpponentPresence } from "../../engine/live/useOpponentPresence";
import type { PlayerConnectionInfo } from "../../engine/sides";
import classes from "./OpponentDisconnectOverlay.module.css";

interface OpponentDisconnectOverlayProps {
  variant: "opponent" | "self";
  connection?: PlayerConnectionInfo;
  onClaimDrop?: () => void;
  claimAvailable?: boolean;
}

const RING_RADIUS = 38;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const MAX_SECONDS = 30;

export function OpponentDisconnectOverlay({
  variant,
  connection,
  onClaimDrop,
  claimAvailable = false,
}: OpponentDisconnectOverlayProps) {
  const { opponentConnected, secondsRemaining, canDrop } = useOpponentPresence(connection);
  const [minimized, setMinimized] = useState(false);
  const [confirmingDrop, setConfirmingDrop] = useState(false);

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

  // Don't render if opponent is connected (or self is connected)
  if (variant === "opponent" && opponentConnected) {
    return null;
  }
  if (variant === "self" && opponentConnected) {
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
        className={`${classes.pill} ${canDrop ? classes.pillReady : ""}`}
        onClick={handleExpand}
        aria-label="Opponent disconnected - expand options"
      >
        <span className={classes.pillIcon}>
          {canDrop ? (
            <IconWifiOff size={14} stroke={2} />
          ) : (
            <span className={classes.pillCount}>{secondsRemaining}</span>
          )}
        </span>
        <span className={classes.pillLabel}>{canDrop ? "Disconnected" : "Disconnecting"}</span>
        <span className={classes.pillExpand} aria-hidden="true">
          <IconMaximize size={12} stroke={2} />
        </span>
      </button>
    );
  }

  return (
    <div
      className={`${classes.overlay} ${canDrop && variant === "opponent" ? classes.overlayCanDrop : ""}`}
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

            <span className={classes.label}>
              {canDrop ? "Opponent has disconnected" : "Opponent disconnected"}
            </span>

            {canDrop && claimAvailable && onClaimDrop ? (
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
                    Claim Match
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
