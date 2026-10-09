import { useCallback, useLayoutEffect, useRef } from "react";
import type { DomCardPose } from "./DomCardMotion";

/** Presentation order only; adapters provide legal targets and resolved destinations. */
export function nextTargetedBeat(phase: string) {
  if (phase === "standby" || phase === "stack") return "disclose";
  if (phase === "disclose") return "resolve";
  if (phase === "resolve") return "outcome";
  if (phase === "outcome") return "targets";
  return undefined;
}
export function targetedHoldMs(phase: string, reduced: boolean) {
  const duration =
    phase === "standby" || phase === "stack"
      ? 900
      : phase === "disclose"
        ? 900
        : phase === "outcome"
          ? 420
          : 0;
  return duration && reduced ? 80 : duration;
}
export function resolutionFocusPose(width = 1280, height = 650): DomCardPose {
  const w = Math.min(210, width * 0.18, height * 0.36);
  return {
    left: width - w - 58,
    top: height * 0.46 - w * 0.7,
    width: w,
    height: w * 1.4,
    rotation: 0,
    face: true,
  };
}
export const isResolutionFocus = (phase: string) =>
  ["flight", "standby", "stack", "disclose", "resolve", "outcome", "targets"].includes(phase);

/** Arrival barrier ignores duplicate, unrelated and stale animation completions. */
export class TargetArrivalBarrier {
  private remaining: Set<string>;
  private complete = false;
  constructor(
    readonly eventKey: unknown,
    ids: readonly string[],
  ) {
    this.remaining = new Set(ids);
  }
  arrive(eventKey: unknown, id: string) {
    if (eventKey !== this.eventKey || this.complete || !this.remaining.delete(id)) return false;
    if (this.remaining.size) return false;
    this.complete = true;
    return true;
  }
}
export function useTargetArrivals(
  active: boolean,
  eventKey: unknown,
  ids: readonly string[],
  onDone: () => void,
) {
  const idsKey = JSON.stringify(ids);
  const barrier = useRef<TargetArrivalBarrier | null>(null);
  const emptyCompletion = useRef<{ key: unknown } | null>(null);
  const callback = useRef(onDone);
  callback.current = onDone;
  useLayoutEffect(() => {
    barrier.current = active ? new TargetArrivalBarrier(eventKey, ids) : null;
    if (!active) emptyCompletion.current = null;
    if (
      active &&
      ids.length === 0 &&
      (!emptyCompletion.current || emptyCompletion.current.key !== eventKey)
    ) {
      emptyCompletion.current = { key: eventKey };
      callback.current();
    }
  }, [active, eventKey, idsKey]);
  return useCallback(
    (id: string) => {
      if (active && barrier.current?.arrive(eventKey, id)) callback.current();
    },
    [active, eventKey],
  );
}
