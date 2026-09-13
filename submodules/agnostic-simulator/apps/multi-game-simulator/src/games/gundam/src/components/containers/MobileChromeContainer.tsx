import { useCallback, useMemo, type CSSProperties, type ReactNode } from "react";
import { MobilePlayerRail } from "@tcg/simulator-ui";
import { useSimulatorRoute } from "../../../../../simulator/providers";

import {
  asMoveName,
  displayTurn,
  useBoardProjection,
  useGundamControlState,
  useGundamGame,
  useInteractionView,
  useViewerId,
  type MoveName,
} from "../../game/index.ts";
import { MobileActionBar } from "../ui/MobileActionBar.tsx";
import { MobileTopHud } from "../ui/MobileTopHud.tsx";
import { PlayerTimer } from "../ui/PlayerTimer.tsx";
import { requiredPrimaryAction } from "../ui/required-action.ts";
import { hasOpenTurnActions } from "../../lib/pass-turn-confirmation.ts";
import type { MatchInfo } from "../ui/types.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import { useSubmitError } from "./submit-error-context.tsx";
import { resolveOpponentId, resolvePlayerDisplayName, zoneCount } from "./mappers.ts";

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
  const route = useSimulatorRoute();
  const controlState = useGundamControlState();
  const matchInfo: MatchInfo = {
    format: view.status.gameSegment ?? "setup",
    turn: displayTurn(view.status.turn),
    phase: view.status.phase ?? "—",
    mode: "hot-seat",
  };
  const opponentId = resolveOpponentId(view, viewerId) ?? "Opponent";
  const opponentTimer = view.timerView.players?.[String(opponentId)];
  return (
    <MobileTopHud
      matchInfo={matchInfo}
      controlState={controlState}
      onOpenLog={onOpenLog}
      connectionIndicator={connectionIndicator}
      opponentName={resolvePlayerDisplayName(
        opponentId,
        route.matchPageData?.match.participants,
        "Rival",
      )}
      opponentShields={zoneCount(view, "shieldArea", String(opponentId))}
      opponentClock={
        opponentTimer ? <PlayerTimer snapshot={opponentTimer} isOwnClock={false} /> : undefined
      }
    />
  );
}

// Labels for the step-level pass moves that can take over the mobile
// primary-action slot. Mirrors the desktop `BattleControlsContainer`
// mapping — keep in sync with that file. Values are plain strings so
// the mobile button stays compact and scannable without the two-line
// HUD stack that the desktop cockpit button uses.
const PASS_MOVE_LABELS: Readonly<Record<string, string>> = {
  passBlock: "SKIP BLOCK",
  passBattleAction: "PASS ACTION",
  passActionStep: "PASS STEP",
};

export function useGundamMatchActions() {
  useBoardProjection();
  const { adapter } = useGundamGame();
  const interactionView = useInteractionView();
  const draft = useGundamInteractionDraft();
  const { report } = useSubmitError();
  const canPassTurn =
    interactionView.status === "ready" &&
    interactionView.actions.some((action) => action.id === "passTurn" && action.enabled);
  const passTurnNeedsConfirmation = canPassTurn && hasOpenTurnActions(interactionView.actions);

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
  const required = useMemo(() => requiredPrimaryAction(interactionView), [interactionView]);
  const onRequiredAction = useCallback(() => {
    if (!required) return;
    draft.begin(required.id, {});
  }, [draft, required]);
  const requiredAction = required ? { label: required.label, onPress: onRequiredAction } : null;

  // `useBoardProjection` above subscribes us to runtime state updates,
  // so this re-reads on every state transition.
  const canUndo = adapter.canUndo();

  const onConcede = useCallback(() => {
    report(adapter.submit(asMoveName("concede"), {}));
  }, [adapter, report]);

  return {
    canPassTurn,
    passTurnNeedsConfirmation,
    onPassTurn,
    onUndo,
    onConcede,
    canUndo,
    contextualPass,
    requiredAction,
    interactionLocked: draft.active,
  } as const;
}

export function MobileActionBarContainer() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const route = useSimulatorRoute();
  const actions = useGundamMatchActions();
  const selfTimer = view.timerView.players?.[String(viewerId)];

  return (
    <MobilePlayerRail
      side="player"
      className="gd-dark-surface h-[var(--mobile-menubar-height)] border-t border-hud-border bg-hud-deep"
      style={
        {
          "--mobile-portrait-surface": "var(--color-hud-deep)",
          "--mobile-portrait-text": "var(--color-hud-text)",
          "--mobile-portrait-border": "var(--color-hud-border)",
          gridTemplateColumns: "minmax(60px,.5fr) 0 minmax(0,3fr)",
        } as CSSProperties
      }
      left={
        <div className="grid min-w-0 place-content-center px-0.5">
          <strong className="whitespace-nowrap text-center text-hud-xs leading-tight text-hud-text">
            {resolvePlayerDisplayName(
              String(viewerId),
              route.matchPageData?.match.participants,
              "You",
            )}
          </strong>
          <span className="text-[11px] tabular-nums text-hud-text-muted">
            {selfTimer ? <PlayerTimer snapshot={selfTimer} isOwnClock /> : "—"}
          </span>
        </div>
      }
      center={null}
      right={<MobileActionBar {...actions} />}
    />
  );
}
