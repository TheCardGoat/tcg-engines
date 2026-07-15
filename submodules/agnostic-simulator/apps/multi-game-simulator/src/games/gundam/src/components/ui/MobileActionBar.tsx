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
      className="grid grid-cols-[1.5fr_1fr_1fr] items-stretch gap-1.5 px-2 border-t border-hud-border flex-shrink-0 min-w-0 overflow-hidden"
      style={{
        height: `calc(var(--mobile-menubar-height) + var(--safe-bottom))`,
        paddingBottom: "var(--safe-bottom)",
        background: "linear-gradient(180deg, rgba(248,250,254,.2), rgba(248,250,254,.92))",
      }}
    >
      <Button
        onClick={onPrimaryPress}
        disabled={!primaryEnabled}
        variant={primaryEnabled ? "cockpit" : "outline"}
        size="md"
        className="hud-corner clip-hud-8 font-display font-extrabold tracking-hud-display px-2"
        aria-label={primaryLabel}
      >
        {primaryLabel}
      </Button>

      <UndoButton onUndo={onUndo} canUndo={canUndo} compact />

      <Button
        onClick={onConcede}
        variant="danger"
        size="md"
        className="clip-hud-6 tracking-hud-label px-1 text-hud-xs"
      >
        {m["sim.sidebar.footer.concede"]()}
      </Button>
    </footer>
  );
}
