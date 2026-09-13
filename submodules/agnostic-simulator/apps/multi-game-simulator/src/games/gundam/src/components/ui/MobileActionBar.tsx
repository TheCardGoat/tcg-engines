import { SimulatorMatchActionDock } from "@tcg/simulator-ui";
import { useEffect, useState } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";
import { ConcedeButton } from "./ConcedeButton.tsx";
import { UndoButton } from "./UndoButton.tsx";
import { PassTurnConfirmationDialog } from "./PassTurnConfirmationDialog.tsx";

export interface MobileActionBarProps {
  readonly canPassTurn: boolean;
  readonly passTurnNeedsConfirmation: boolean;
  readonly onPassTurn: () => void;
  readonly onUndo: () => void;
  readonly onConcede: () => void;
  readonly canUndo: boolean;
  readonly interactionLocked: boolean;
  /**
   * When a step-level pass move is available (passBlock, passBattleAction,
   * passActionStep), the primary button replaces the usual PASS TURN with
   * this contextual action. Parallels `BattleControlsContainer` on desktop.
   * `null` when no step-pass applies.
   */
  readonly contextualPass: { readonly label: string; readonly onPress: () => void } | null;
  /** Flow-blocking choice that the player must open before play can continue. */
  readonly requiredAction: { readonly label: string; readonly onPress: () => void } | null;
}

/**
 * Bottom action bar for mobile portrait. Replaces the cockpit Pass-Turn
 * button (absolute right-center on desktop) and the sidebar footer actions.
 * Fills the `--mobile-menubar-height` chrome slot plus safe-area inset.
 */
export function MobileActionBar({
  canPassTurn,
  passTurnNeedsConfirmation,
  onPassTurn,
  onUndo,
  onConcede,
  canUndo,
  interactionLocked,
  contextualPass,
  requiredAction,
}: MobileActionBarProps) {
  const [confirmPassTurnOpen, setConfirmPassTurnOpen] = useState(false);
  // Contextual pass takes priority over turn pass. When a step-level
  // pass is live the viewer always has action to take, regardless of
  // `activePlayer` (e.g. block-step with opponent attacking makes the
  // viewer active for the block decision but not for turn-level
  // moves). Match the desktop `BattleControlsContainer` behaviour.
  const primaryLabel =
    requiredAction?.label ??
    contextualPass?.label ??
    (canPassTurn ? m["sim.app.passTurn.passLabel"]() : m["sim.app.action.waitingLabel"]());
  const primaryEnabled =
    !interactionLocked && (requiredAction !== null || contextualPass !== null || canPassTurn);
  const onPrimaryPress = () => {
    if (requiredAction) requiredAction.onPress();
    else if (contextualPass) contextualPass.onPress();
    else if (canPassTurn && passTurnNeedsConfirmation) setConfirmPassTurnOpen(true);
    else if (canPassTurn) onPassTurn();
  };

  useEffect(() => {
    if (confirmPassTurnOpen && (interactionLocked || !canPassTurn || !passTurnNeedsConfirmation)) {
      setConfirmPassTurnOpen(false);
    }
  }, [canPassTurn, confirmPassTurnOpen, interactionLocked, passTurnNeedsConfirmation]);

  const confirmPassTurn = () => {
    setConfirmPassTurnOpen(false);
    onPassTurn();
  };

  return (
    <>
      <SimulatorMatchActionDock
        className="gd-dark-surface min-w-0 border-l border-hud-border bg-hud-deep [--match-sidebar-type-action:var(--text-hud-md)]"
        undo={
          <UndoButton
            onUndo={onUndo}
            canUndo={canUndo}
            compact
            className="h-full min-h-11"
            style={{ color: canUndo ? "var(--color-hud-text)" : "var(--color-hud-text-dim)" }}
          />
        }
        primary={
          <Button
            onClick={onPrimaryPress}
            disabled={!primaryEnabled}
            variant={primaryEnabled ? "cockpit" : "outline"}
            size="md"
            className="h-full min-h-11 rounded-sm px-2 text-[11px] font-extrabold tracking-[.06em]"
            aria-label={primaryLabel}
            data-testid="primary-action"
            style={{
              color: primaryEnabled ? "oklch(0.98 0.006 255)" : "var(--color-hud-text-dim)",
            }}
          >
            {primaryLabel}
          </Button>
        }
        danger={
          <ConcedeButton
            onConcede={onConcede}
            size="sm"
            className="h-full min-h-11 px-1 text-[11px] font-bold uppercase tracking-[.04em]"
          />
        }
      />
      <PassTurnConfirmationDialog
        open={confirmPassTurnOpen}
        onOpenChange={setConfirmPassTurnOpen}
        onConfirm={confirmPassTurn}
      />
    </>
  );
}
