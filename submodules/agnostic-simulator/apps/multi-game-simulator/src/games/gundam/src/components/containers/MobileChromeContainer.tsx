import { useCallback, useMemo, type ReactNode } from "react";

import {
  asMoveName,
  useBoardProjection,
  useGundamGame,
  useInteractionView,
  useViewerId,
  type MoveName,
} from "../../game/index.ts";
import { MobileActionBar } from "../ui/MobileActionBar.tsx";
import { MobileTopHud } from "../ui/MobileTopHud.tsx";
import type { MatchInfo } from "../ui/types.ts";
import { useSubmitError } from "./submit-error-context.tsx";

export interface MobileChromeContainerProps {
  readonly onOpenLog: () => void;
  readonly connectionIndicator?: ReactNode;
}

export function MobileTopHudContainer({
  onOpenLog,
  connectionIndicator,
}: MobileChromeContainerProps) {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const matchInfo: MatchInfo = {
    format: view.status.gameSegment ?? "setup",
    turn: view.status.turn,
    phase: view.status.phase ?? "—",
    mode: "hot-seat",
  };
  const turnPlayerId = view.status.turnPlayer ?? view.status.activePlayer;
  const isSelfTurn = String(turnPlayerId) === String(viewerId);
  const isSelfPriority = String(view.status.activePlayer) === String(viewerId);
  return (
    <MobileTopHud
      matchInfo={matchInfo}
      isSelfTurn={isSelfTurn}
      isSelfPriority={isSelfPriority}
      onOpenLog={onOpenLog}
      connectionIndicator={connectionIndicator}
    />
  );
}

// Labels for the step-level pass moves that can take over the mobile
// primary-action slot. Mirrors the desktop `BattleControlsContainer`
// mapping — keep in sync with that file. Values are plain strings so
// the mobile button stays compact and scannable without the two-line
// HUD stack that the desktop cockpit button uses.
const PASS_MOVE_LABELS: Readonly<Record<string, string>> = {
  passBlock: "PASS BLOCK",
  passBattleAction: "PASS ACTION",
  passActionStep: "PASS STEP",
};

export function MobileActionBarContainer() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const { adapter } = useGundamGame();
  const interactionView = useInteractionView();
  const { report } = useSubmitError();
  const turnPlayerId = view.status.turnPlayer ?? view.status.activePlayer;
  const isSelfTurn = String(turnPlayerId) === String(viewerId);

  // Contextual step-pass move (if any) — same picker as the desktop
  // `BattleControlsContainer`.
  const passMove: MoveName | null = useMemo(() => {
    if (interactionView.status !== "ready") {
      return null;
    }
    for (const action of interactionView.actions) {
      if (action.enabled && Object.hasOwn(PASS_MOVE_LABELS, action.id)) {
        return asMoveName(action.id);
      }
    }
    return null;
  }, [interactionView]);

  const onPassTurn = useCallback(() => {
    report(adapter.submit(asMoveName("passTurn"), {}));
  }, [adapter, report]);
  const onConcede = useCallback(() => {
    report(adapter.submit(asMoveName("concede"), {}));
  }, [adapter, report]);
  const onUndo = useCallback(() => {
    adapter.undo();
  }, [adapter]);
  const onContextualPass = useCallback(() => {
    if (!passMove) return;
    report(adapter.submit(passMove, {}));
  }, [adapter, passMove, report]);

  const contextualPass = passMove
    ? { label: PASS_MOVE_LABELS[String(passMove)] ?? "PASS", onPress: onContextualPass }
    : null;

  // `useBoardProjection` above subscribes us to runtime state updates,
  // so this re-reads on every state transition.
  const canUndo = adapter.canUndo();

  return (
    <MobileActionBar
      isSelfTurn={isSelfTurn}
      onPassTurn={onPassTurn}
      onUndo={onUndo}
      canUndo={canUndo}
      onConcede={onConcede}
      contextualPass={contextualPass}
    />
  );
}
