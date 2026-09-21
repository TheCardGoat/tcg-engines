import { useEffect, useState } from "react";
import type { DropEligibility, DropReasonCode } from "@tcg/protocol";
import { deriveDropControl } from "@tcg/protocol";

import { cx } from "../class-names";
import classes from "./DropClaimControl.module.css";

const VISIBLE_DROP_REASONS: ReadonlySet<DropReasonCode> = new Set([
  "timeout_grace_pending",
  "disconnect_countdown",
  "disconnect_timestamp_missing",
  "timeout_first_decision",
  "timeout_allowed",
  "disconnect_allowed",
]);

const TIMEOUT_OVERLAY_REASONS: ReadonlySet<DropReasonCode> = new Set([
  "timeout_grace_pending",
  "timeout_allowed",
  "timeout_first_decision",
]);

export function anchoredServerNowMs(
  serverNowMs: number,
  originLocalMs: number,
  localNowMs: number,
): number {
  return serverNowMs + (localNowMs - originLocalMs);
}

export function shouldTickDropControl(eligibility: DropEligibility | null | undefined): boolean {
  if (!eligibility || eligibility.allowed) return false;
  if (
    eligibility.reason === "disconnect_countdown" ||
    eligibility.timeout.reason === "timeout_grace_pending"
  ) {
    return true;
  }
  return (
    eligibility.timeout.reason === "timeout_within_limit" &&
    (eligibility.timeout.eligibleAtMs !== undefined ||
      eligibility.timeout.remainingMs !== undefined)
  );
}

export function isDropControlVisible(
  eligibility: DropEligibility | null | undefined,
  serverNowMs?: number,
): boolean {
  if (!eligibility) return false;
  const view = deriveDropControl(eligibility, serverNowMs ?? eligibility.projectedAtMs);
  return view.enabled || VISIBLE_DROP_REASONS.has(view.reason);
}

export function isTimeoutDropOverlayVisible(input: {
  canSkip: boolean;
  canDrop: boolean;
  eligibility?: DropEligibility | null;
  serverNowMs?: number;
}): boolean {
  if (input.eligibility) {
    const view = deriveDropControl(
      input.eligibility,
      input.serverNowMs ?? input.eligibility.projectedAtMs,
    );
    return TIMEOUT_OVERLAY_REASONS.has(view.reason);
  }
  return input.canSkip || input.canDrop;
}

export function useDropControlClock(
  eligibility: DropEligibility | null | undefined,
  serverNowMs: number,
): number {
  const [nowMs, setNowMs] = useState(serverNowMs);
  useEffect(() => {
    setNowMs(serverNowMs);
    if (!shouldTickDropControl(eligibility)) return;
    const originLocalMs = performance.now();
    const interval = setInterval(() => {
      const next = anchoredServerNowMs(serverNowMs, originLocalMs, performance.now());
      setNowMs(next);
      if (eligibility && deriveDropControl(eligibility, next).enabled) {
        clearInterval(interval);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [eligibility, serverNowMs]);
  return nowMs;
}

export interface DropClaimControlProps {
  eligibility: DropEligibility | null | undefined;
  serverNowMs: number;
  disabled?: boolean;
  onClaim: () => void;
  label?: string;
  className?: string;
  messageClassName?: string;
  actionClassName?: string;
  layout?: "stack" | "inline";
  actionRole?: "menuitem";
}

/**
 * Shared Drop control. Enablement and copy come from server-projected
 * eligibility interpolated with a server-anchored clock. Visuals inherit
 * `[data-game]` tokens so each simulator can restyle the same control.
 */
export function DropClaimControl({
  eligibility,
  serverNowMs,
  disabled = false,
  onClaim,
  label = "Drop",
  className,
  messageClassName,
  actionClassName,
  layout = "stack",
  actionRole,
}: DropClaimControlProps) {
  const nowMs = useDropControlClock(eligibility, serverNowMs);
  if (!eligibility) return null;
  const view = deriveDropControl(eligibility, nowMs);
  if (!view.enabled && !VISIBLE_DROP_REASONS.has(view.reason)) return null;

  if (actionRole === "menuitem") {
    return (
      <button
        type="button"
        role="menuitem"
        data-layout={layout}
        data-drop-enabled={view.enabled ? "true" : "false"}
        className={cx("drop-claim-control", classes.root, className)}
        disabled={disabled || !view.enabled}
        onClick={onClaim}
        aria-label={`${label}. ${view.label}`}
        data-testid="drop-opponent"
      >
        <span className={cx("drop-claim-control__message", classes.message, messageClassName)}>
          {view.label}
        </span>
        <span className={cx("drop-claim-control__action", classes.action, actionClassName)}>
          {label}
        </span>
      </button>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      data-layout={layout}
      data-drop-enabled={view.enabled ? "true" : "false"}
      className={cx("drop-claim-control", classes.root, className)}
    >
      <p className={cx("drop-claim-control__message", classes.message, messageClassName)}>
        {view.label}
      </p>
      <button
        type="button"
        className={cx("drop-claim-control__action", classes.action, actionClassName)}
        disabled={disabled || !view.enabled}
        onClick={onClaim}
        aria-label={label}
        data-testid="drop-opponent"
      >
        {label}
      </button>
    </div>
  );
}
