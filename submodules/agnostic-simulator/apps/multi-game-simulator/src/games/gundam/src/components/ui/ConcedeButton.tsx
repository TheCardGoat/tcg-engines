import { useState } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { cn } from "../../lib/utils.ts";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../primitives/index.ts";

export interface ConcedeButtonProps {
  readonly onConcede: () => void;
  readonly className?: string;
  readonly size?: "sm" | "md";
  /** Compact square trigger for the collapsed sidebar rail. */
  readonly icon?: boolean;
  readonly testId?: string;
}

/**
 * Concede trigger with a blocking confirm step. Conceding ends the match on
 * the spot, so the raw submit must never sit one misclick away from the
 * player; the trigger itself stays visually quiet (danger-tinted outline)
 * and the filled danger style is reserved for the in-dialog confirmation.
 */
export function ConcedeButton({
  onConcede,
  className,
  size = "sm",
  icon,
  testId,
}: ConcedeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size={icon ? "icon" : size}
        title={m["sim.sidebar.footer.concede"]()}
        aria-label={icon ? m["sim.sidebar.rail.concedeLabel"]() : undefined}
        data-testid={testId}
        className={cn(
          "rounded-sm border-hud-danger/35 text-hud-danger hover:border-hud-danger/70 hover:bg-hud-danger/10 hover:text-hud-danger",
          className,
        )}
      >
        {icon ? "!" : m["sim.sidebar.footer.concede"]()}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gd-dark-surface w-[calc(100vw-2rem)] max-w-sm border border-hud-border-hot bg-hud-surface-raised p-5 clip-hud-8 shadow-[0_0_40px_rgba(45,107,255,.25),0_8px_30px_rgba(0,0,0,.55)]">
          <DialogHeader>
            <DialogTitle className="text-hud-lg text-hud-text">
              {m["sim.sidebar.concede.title"]()}
            </DialogTitle>
            <DialogDescription className="text-hud-sm text-hud-text-muted">
              {m["sim.sidebar.concede.body"]()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-0"
              onClick={() => setOpen(false)}
            >
              {m["sim.sidebar.concede.cancel"]()}
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="w-full min-w-0"
              data-testid={testId ? `${testId}-confirm` : undefined}
              onClick={() => {
                setOpen(false);
                onConcede();
              }}
            >
              {m["sim.sidebar.concede.confirm"]()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
