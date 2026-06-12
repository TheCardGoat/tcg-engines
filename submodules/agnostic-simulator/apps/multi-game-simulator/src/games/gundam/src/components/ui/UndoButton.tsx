import { useEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils.ts";
import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";

const PULSE_MS = 1400;

export interface UndoButtonProps {
  readonly canUndo: boolean;
  readonly onUndo: () => void;
  readonly className?: string;
  readonly compact?: boolean;
}

/**
 * Always-rendered undo affordance shared by the desktop sidebar footer
 * and the mobile action bar. Visually swaps between three states driven
 * entirely by `canUndo` from the engine:
 *
 *   - disabled: muted, low-opacity, `aria-disabled` — clearly inert.
 *   - ready:    cyan `hud-info` accent, full opacity, pointer cursor.
 *   - fresh:    ready styles + a one-shot 1.4s border pulse fired on
 *               the false → true edge to grab the eye right after the
 *               viewer makes an undoable move (replaces the old
 *               disappearing toast affordance).
 *
 * Uses `aria-disabled` instead of the native `disabled` attribute so the
 * `title` tooltip ("Nothing to undo") still shows on hover — most
 * browsers swallow pointer events on truly-disabled buttons.
 */
export function UndoButton({ canUndo, onUndo, className, compact = false }: UndoButtonProps) {
  const [pulsing, setPulsing] = useState(false);
  // Seed with the initial value so the first effect run is a no-op when
  // `canUndo` is already true at mount (mid-game reload, layout switch,
  // or floating/sidebar instances mounting independently). The pulse
  // should only fire on a real false → true transition after mount.
  const prevCanUndo = useRef(canUndo);

  useEffect(() => {
    if (!prevCanUndo.current && canUndo) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), PULSE_MS);
      prevCanUndo.current = canUndo;
      return () => clearTimeout(t);
    }
    prevCanUndo.current = canUndo;
  }, [canUndo]);

  const title = canUndo ? m["sim.app.undo.readyTitle"]() : m["sim.app.undo.disabledTitle"]();
  const onClick = () => {
    if (canUndo) onUndo();
  };

  return (
    <Button
      onClick={onClick}
      aria-disabled={!canUndo}
      variant="outline"
      size="md"
      title={title}
      aria-label={title}
      data-testid="undo-button"
      data-state={canUndo ? (pulsing ? "fresh" : "ready") : "disabled"}
      className={cn(
        "clip-hud-6 tracking-hud-label transition-[opacity,background,border-color,color] duration-150",
        compact ? "px-1 text-hud-xs" : "text-hud-md",
        canUndo
          ? "bg-hud-info/25 border-hud-info text-hud-text hover:bg-hud-info/35 hover:border-hud-info"
          : "bg-hud-surface/30 border-hud-border text-hud-text-muted opacity-50 cursor-not-allowed hover:bg-hud-surface/30 hover:border-hud-border",
        pulsing && canUndo && "gd-pulse-info-once",
        className,
      )}
    >
      {m["sim.sidebar.footer.undo"]()}
    </Button>
  );
}
