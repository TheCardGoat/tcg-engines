import { deriveClockView, type ClockSnapshot } from "@tcg/gundam-engine";

import { useClockNow } from "../../game/use-clock-now.ts";
import { TimedOutPlayerOverlay } from "../ui/TimedOutPlayerOverlay.tsx";

export interface OpponentTimeoutOverlayContainerProps {
  readonly snapshot: ClockSnapshot;
  readonly onSkip: () => void;
  readonly onDrop: () => void;
}

/**
 * Keep the interpolated clock subscription at the smallest UI boundary.
 *
 * The complete player seat is expensive to project and render. Subscribing
 * there made the unchanged board rerender every 100 ms just to determine
 * whether these two timeout actions should be visible.
 */
export function OpponentTimeoutOverlayContainer({
  snapshot,
  onSkip,
  onDrop,
}: OpponentTimeoutOverlayContainerProps) {
  const clockNow = useClockNow();
  const clockView = deriveClockView(snapshot, clockNow);

  return (
    <TimedOutPlayerOverlay
      canSkip={clockView.canSkipOpponent}
      canDrop={clockView.canDropOpponent}
      onSkip={onSkip}
      onDrop={onDrop}
    />
  );
}
