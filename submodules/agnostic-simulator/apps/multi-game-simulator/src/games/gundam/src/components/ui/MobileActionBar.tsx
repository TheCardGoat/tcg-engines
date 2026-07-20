import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";
import { UndoButton } from "./UndoButton.tsx";

export interface MobileActionBarProps {
  readonly isSelfTurn: boolean;
  readonly onPassTurn: () => void;
  readonly onUndo: () => void;
  readonly canUndo: boolean;
  readonly onConcede: () => void;
  /**
   * When a step-level pass move is available (passBlock, passBattleAction,
   * passActionStep), the primary button replaces the usual PASS TURN with
   * this contextual action. Parallels `BattleControlsContainer` on desktop.
   * `null` when no step-pass applies.
   */
  readonly contextualPass: { readonly label: string; readonly onPress: () => void } | null;
}

/**
 * Bottom action bar for mobile portrait. Replaces the cockpit Pass-Turn
 * button (absolute right-center on desktop) and the sidebar footer actions.
 * Fills the `--mobile-menubar-height` chrome slot plus safe-area inset.
 */
export function MobileActionBar({
  isSelfTurn,
  onPassTurn,
  onUndo,
  canUndo,
  onConcede,
  contextualPass,
}: MobileActionBarProps) {
  // Contextual pass takes priority over turn pass. When a step-level
  // pass is live the viewer always has action to take, regardless of
  // `activePlayer` (e.g. block-step with opponent attacking makes the
  // viewer active for the block decision but not for turn-level
  // moves). Match the desktop `BattleControlsContainer` behaviour.
  const primaryLabel =
    contextualPass?.label ??
    (isSelfTurn ? m["sim.app.passTurn.passLabel"]() : m["sim.app.passTurn.opponentLabel"]());
  const primaryEnabled = contextualPass !== null || isSelfTurn;
  const onPrimaryPress = () => {
    if (contextualPass) contextualPass.onPress();
    else if (isSelfTurn) onPassTurn();
  };

  return (
    <footer
      className="gd-dark-surface grid grid-cols-[1.55fr_1fr_.8fr] items-stretch gap-1.5 border-t border-hud-border bg-hud-deep px-2 py-1 flex-shrink-0 min-w-0 overflow-hidden"
      style={{
        height: `calc(var(--mobile-menubar-height) + var(--safe-bottom))`,
        paddingBottom: "var(--safe-bottom)",
      }}
    >
      <Button
        onClick={onPrimaryPress}
        disabled={!primaryEnabled}
        variant={primaryEnabled ? "cockpit" : "outline"}
        size="md"
        className="h-full min-h-11 rounded-sm px-2 text-[10px] font-extrabold tracking-[.1em]"
        aria-label={primaryLabel}
        style={{ color: primaryEnabled ? "oklch(0.98 0.006 255)" : "var(--color-hud-text-dim)" }}
      >
        {primaryLabel}
      </Button>

      <UndoButton
        onUndo={onUndo}
        canUndo={canUndo}
        compact
        className="h-full min-h-11"
        style={{ color: canUndo ? "var(--color-hud-text)" : "var(--color-hud-text-dim)" }}
      />

      <Button
        onClick={onConcede}
        variant="danger"
        size="md"
        className="h-full min-h-11 rounded-sm px-1 text-[9px] font-bold tracking-[.08em]"
        style={{ color: "oklch(0.98 0.006 255)" }}
      >
        {m["sim.sidebar.footer.concede"]()}
      </Button>
    </footer>
  );
}
