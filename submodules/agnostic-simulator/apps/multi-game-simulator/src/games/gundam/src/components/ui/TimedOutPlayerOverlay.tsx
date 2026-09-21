import { Hourglass } from "lucide-react";
import type { DropEligibility } from "@tcg/protocol";
import { DropClaimControl, isTimeoutDropOverlayVisible } from "@tcg/simulator-ui";

import { cn } from "../../lib/utils.ts";
import { Button, buttonVariants } from "../primitives/index.ts";

export interface TimedOutPlayerOverlayProps {
  readonly canSkip: boolean;
  readonly canDrop: boolean;
  readonly onSkip: () => void;
  readonly onDrop: () => void;
  readonly eligibility?: DropEligibility | null;
  readonly serverNowMs?: number;
}

export function TimedOutPlayerOverlay({
  canSkip,
  canDrop,
  onSkip,
  onDrop,
  eligibility,
  serverNowMs,
}: TimedOutPlayerOverlayProps) {
  const hostedTimeout = isTimeoutDropOverlayVisible({
    canSkip: false,
    canDrop: false,
    eligibility,
    serverNowMs,
  });
  const practiceDrop = !eligibility && canDrop;
  const practiceSkip = !eligibility && canSkip;
  if (!practiceSkip && !hostedTimeout && !practiceDrop) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "absolute inset-0 z-30 grid place-items-center pointer-events-none",
        "bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,.18),rgba(15,23,42,.58))]",
      )}
    >
      <div className="pointer-events-auto flex flex-col items-center gap-2 rounded-[6px] border border-amber-400/35 bg-slate-950/85 px-4 py-3 shadow-hud-glow backdrop-blur-sm">
        <Hourglass className="size-6 text-amber-300" aria-hidden />
        <div className="font-display text-xs font-extrabold tracking-hud-label text-white">
          OPPONENT TIME EXPIRED
        </div>
        <div className="flex items-center gap-2">
          {practiceSkip || (hostedTimeout && canSkip) ? (
            <Button size="lg" variant="outline" data-testid="skip-opponent-turn" onClick={onSkip}>
              Skip Turn
            </Button>
          ) : null}
          {hostedTimeout ? (
            <DropClaimControl
              eligibility={eligibility}
              serverNowMs={serverNowMs ?? eligibility?.projectedAtMs ?? Date.now()}
              onClaim={onDrop}
              label="Drop"
              layout="inline"
              actionClassName={buttonVariants({ variant: "danger", size: "lg" })}
            />
          ) : practiceDrop ? (
            <Button size="lg" variant="danger" data-testid="drop-opponent" onClick={onDrop}>
              Drop
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
