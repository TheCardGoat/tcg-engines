import { m } from "../../lib/i18n/messages.ts";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../primitives/index.ts";

export function PassTurnConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gd-dark-surface w-[calc(100vw-2rem)] max-w-sm border border-hud-border-hot bg-hud-surface-raised p-5 clip-hud-8 shadow-[0_0_40px_rgba(45,107,255,.25),0_8px_30px_rgba(0,0,0,.55)]"
        onKeyDownCapture={(event) => {
          if (event.code !== "Space" && event.key !== " ") return;
          if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          onConfirm();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-hud-lg text-hud-text">
            {m["sim.app.passTurn.confirm.title"]()}
          </DialogTitle>
          <DialogDescription className="text-hud-sm leading-relaxed text-hud-text-muted">
            {m["sim.app.passTurn.confirm.body"]()}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="md"
            className="w-full min-w-0 gap-1 px-2 text-hud-sm tracking-hud-body"
            autoFocus
            aria-keyshortcuts="Escape"
            onClick={() => onOpenChange(false)}
          >
            <span>{m["sim.app.passTurn.confirm.cancel"]()}</span>
            <kbd
              aria-hidden="true"
              className="gd-mono hidden rounded-sm border border-hud-border/70 bg-hud-deep/70 px-1 py-0.5 text-hud-2xs font-semibold leading-none tracking-hud-label text-hud-text-muted md:inline-flex"
            >
              ESC
            </kbd>
          </Button>
          <Button
            variant="cockpit"
            size="md"
            className="w-full min-w-0 gap-1 px-2 text-hud-sm tracking-hud-body"
            style={{ color: "white", fontWeight: 800 }}
            aria-keyshortcuts="Space"
            data-testid="confirm-pass-turn"
            onClick={onConfirm}
          >
            <span>{m["sim.app.passTurn.confirm.accept"]()}</span>
            <kbd
              aria-hidden="true"
              className="gd-mono hidden rounded-sm border border-white/40 bg-black/20 px-1 py-0.5 text-hud-2xs font-semibold leading-none tracking-hud-label text-white md:inline-flex"
            >
              SPACE
            </kbd>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
