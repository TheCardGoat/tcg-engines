import { Hourglass } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import { Button } from "../primitives/index.ts";

export interface TimedOutPlayerOverlayProps {
  readonly canSkip: boolean;
  readonly canDrop: boolean;
  readonly onSkip: () => void;
  readonly onDrop: () => void;
}

export function TimedOutPlayerOverlay({
  canSkip,
  canDrop,
  onSkip,
  onDrop,
}: TimedOutPlayerOverlayProps) {
  if (!canSkip && !canDrop) return null;

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
          {canSkip ? (
            <Button size="sm" variant="outline" data-testid="skip-opponent-turn" onClick={onSkip}>
              Skip Turn
            </Button>
          ) : null}
          {canDrop ? (
            <Button size="sm" variant="danger" data-testid="drop-opponent" onClick={onDrop}>
              Drop
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
