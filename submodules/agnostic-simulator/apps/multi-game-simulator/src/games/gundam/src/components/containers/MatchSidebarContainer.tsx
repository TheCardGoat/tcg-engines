// SETTINGS PARITY: keep in sync with the platform web app's GameSettingsFields.svelte (Gundam).
import { useMemo, useState, type ReactNode } from "react";
import { SimulatorActivityTabs, type SimulatorMatchActions } from "@tcg/simulator-ui";
import { useSimulatorPlayers, useSimulatorRoute } from "../../../../../simulator/providers";
import { SimulatorOpponentParticipantActions } from "../../../../../simulator/participant-actions";

import {
  useBoardProjection,
  useGundamControlState,
  useGundamGame,
  useLogEntries,
  useViewerId,
} from "../../game/index.ts";
import { useMoveLogs } from "../../game/hooks.ts";
import { m } from "../../lib/i18n/messages.ts";
import { CardLink } from "../ui/CardLink.tsx";
import { MatchEventLog, MatchSidebar } from "../ui/MatchSidebar.tsx";
import { DeferredGundamChatPanel } from "../ui/DeferredGundamChatPanel.tsx";
import type { LogTurn, PlayerInfo } from "../ui/types.ts";
import { toLogTurns } from "./log-mapper.tsx";
import { toStructuredLogTurns } from "./move-log-mapper.tsx";
import {
  orderGundamEventLogEntries,
  projectGundamLegacyEventLogEntries,
  projectGundamMoveLogEntries,
} from "./move-log-projection.ts";
import {
  countActiveResources,
  resolveOpponentId,
  resolvePlayerDisplayName,
  zoneCount,
} from "./mappers.ts";
import { VsAiControls, VsAiSummary } from "../ui/VsAiControls.tsx";
import { AnimationSpeedControl, SoundVolumeControl } from "../../../../../simulator/settings";
import { useVsAi } from "../../game/bot/bot-context.tsx";
import { ConcedeButton } from "../ui/ConcedeButton.tsx";
import { AutoPassPriorityControl } from "../ui/AutoPassPriorityControl.tsx";
import { useGundamMatchActions } from "./MobileChromeContainer.tsx";
import { buildBugReportContext } from "../../../../../runtime/bugReportApi.ts";
import { useLayoutMode } from "../../lib/use-layout-mode.ts";
import { GundamBugReportDialog } from "../ui/GundamBugReportDialog.tsx";

export interface MatchSidebarContainerProps {
  readonly connectionPanel?: ReactNode;
  readonly connectionIndicator?: ReactNode;
  readonly selfActions: ReactNode;
}

export function MatchSidebarContainer({
  connectionPanel,
  connectionIndicator,
  selfActions,
}: MatchSidebarContainerProps) {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const route = useSimulatorRoute();
  const controlState = useGundamControlState();
  const { log, eventLogEntries } = useMatchLogData();
  const vsAi = useVsAi();
  const matchActions = useGundamMatchActions();
  const players = useSimulatorPlayers();
  const resolvedOpponent = resolveOpponentId(view, viewerId);
  const opponentId = resolvedOpponent ?? viewerId;
  const actions: SimulatorMatchActions = {
    controls: null,
    danger: (
      <ConcedeButton
        onConcede={matchActions.onConcede}
        className="h-full min-h-11 px-1 text-hud-xs font-bold uppercase tracking-[.04em]"
      />
    ),
  };

  const opponent: PlayerInfo = {
    id: opponentId,
    name: resolvePlayerDisplayName(opponentId, route.matchPageData?.match.participants, "Rival"),
    clock: "—",
    timer: view.timerView.players?.[opponentId],
    isOwnClock: false,
    colors: [],
    deck: zoneCount(view, "deck", opponentId),
    discard: zoneCount(view, "trash", opponentId),
    shields: zoneCount(view, "shieldArea", opponentId),
    resourcesAvailable: countActiveResources(view, opponentId),
    resourcesTotal: zoneCount(view, "resourceArea", opponentId),
  };
  const self: PlayerInfo = {
    id: viewerId,
    name: resolvePlayerDisplayName(
      String(viewerId),
      route.matchPageData?.match.participants,
      "You",
    ),
    clock: "—",
    timer: view.timerView.players?.[String(viewerId)],
    isOwnClock: true,
    colors: [],
    deck: zoneCount(view, "deck", viewerId),
    discard: zoneCount(view, "trash", viewerId),
    shields: zoneCount(view, "shieldArea", viewerId),
    resourcesAvailable: countActiveResources(view, viewerId),
    resourcesTotal: zoneCount(view, "resourceArea", viewerId),
  };

  return (
    <MatchSidebar
      players={[opponent, self]}
      controlState={controlState}
      log={log}
      eventLogEntries={eventLogEntries}
      connectionIndicator={connectionIndicator}
      opponentActions={
        players.opponentPlayer.participant && route.matchId && route.gameId ? (
          <SimulatorOpponentParticipantActions
            participant={
              players.opponentPlayer.participant.isBot
                ? {
                    kind: "bot" as const,
                    displayName: players.opponentPlayer.participant.displayName,
                  }
                : {
                    kind: "human" as const,
                    gameProfileId: players.opponentPlayer.participant.id,
                    userId: players.opponentPlayer.participant.userId,
                    displayName: players.opponentPlayer.participant.displayName,
                  }
            }
            match={{
              matchId: route.matchId,
              gameId: route.gameId,
              gameSlug: "gundam",
            }}
          />
        ) : undefined
      }
      selfActions={selfActions}
      automation={
        vsAi
          ? {
              summary: <VsAiSummary />,
              details: <VsAiControls />,
              label: "Opponent controls",
              panelLabel: "Bot strategy and pacing controls",
            }
          : undefined
      }
      secondaryActivity={
        <div className="grid gap-3 p-3">
          {connectionPanel}
          <GundamLiveBugReportControl />
          <AutoPassPriorityControl className="text-hud-text-muted" />
          <AnimationSpeedControl className="text-hud-text-muted" />
          <SoundVolumeControl className="text-hud-text-muted" />
        </div>
      }
      actions={actions}
    />
  );
}

export function GundamMobileActivityContainer({
  connectionPanel,
}: {
  readonly connectionPanel?: ReactNode;
}) {
  const { log, eventLogEntries } = useMatchLogData();
  const vsAi = useVsAi();

  return (
    <div className="gd-dark-surface gd-mobile-activity grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] text-hud-text">
      <header className="border-b border-hud-border px-3 py-2">
        <strong className="text-xs uppercase tracking-[.12em]">Match activity</strong>
        <p className="mt-0.5 text-hud-xs text-hud-text-muted">
          Battle log, chat, and game controls
        </p>
      </header>
      <SimulatorActivityTabs
        log={<MatchEventLog log={log} eventLogEntries={eventLogEntries} />}
        chat={<DeferredGundamChatPanel />}
        secondary={
          <div className="grid gap-3 p-3">
            {vsAi ? <VsAiControls /> : null}
            {connectionPanel}
            <GundamLiveBugReportControl />
            <AutoPassPriorityControl className="text-hud-text-muted" />
            <AnimationSpeedControl className="text-hud-text-muted" />
            <SoundVolumeControl className="text-hud-text-muted" />
          </div>
        }
      />
    </div>
  );
}

function GundamLiveBugReportControl() {
  const [open, setOpen] = useState(false);
  const view = useBoardProjection();
  const route = useSimulatorRoute();
  const layoutMode = useLayoutMode();
  const context = buildBugReportContext({
    gameSlug: "gundam",
    ...(route.gameId ? { gameId: route.gameId } : {}),
    ...(route.matchId ? { matchId: route.matchId } : {}),
    playerCount: view.players.length,
    turn: view.status.turn,
    stateVersion: view.stateID,
    platform: layoutMode === "mobile" ? "mobile" : "desktop",
  });

  return (
    <>
      <button
        type="button"
        className="gd-support-action min-h-11 w-full rounded border border-hud-danger/40 bg-hud-danger/5 px-3 py-2 text-left hover:bg-hud-danger/10"
        onClick={() => setOpen(true)}
      >
        {m["sim.support.bugReport.liveAction"]()}
      </button>
      <GundamBugReportDialog open={open} onOpenChange={setOpen} context={context} />
    </>
  );
}

export function useMatchLogData() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const { adapter } = useGundamGame();
  const logEntries = useLogEntries();
  const moveLogs = useMoveLogs();
  const resolvedOpponent = resolveOpponentId(view, viewerId);
  const log = useMemo(() => {
    const prettyNames = {
      self: m["sim.log.prettyName.self"](),
      opponent: m["sim.log.prettyName.opponent"](),
    };
    const renderCardLink = (cardId: string, name: string, key: string) => (
      <CardLink key={key} cardId={cardId} name={name} />
    );
    const legacy = toLogTurns(
      logEntries,
      String(viewerId),
      resolvedOpponent,
      adapter.cardDefinitionOf,
      prettyNames,
      renderCardLink,
    );
    const structured =
      moveLogs.length > 0
        ? toStructuredLogTurns(
            moveLogs,
            String(viewerId),
            adapter.cardDefinitionOf,
            prettyNames,
            renderCardLink,
          )
        : [];
    return mergeLogTurns(legacy, structured);
  }, [logEntries, moveLogs, viewerId, resolvedOpponent, adapter]);
  const eventLogEntries = useMemo(() => {
    const phase = view.status.phase ?? view.status.gameSegment ?? "setup";
    const projectedMoveEntries = projectGundamMoveLogEntries(
      moveLogs,
      String(viewerId),
      phase,
      adapter.cardDefinitionOf,
      { moveHistory: adapter.moveHistory() },
    );
    if (projectedMoveEntries.length === 0) return [];

    return orderGundamEventLogEntries(
      dedupeSystemEntries([
        ...projectedMoveEntries,
        ...projectGundamLegacyEventLogEntries(
          logEntries,
          String(viewerId),
          phase,
          adapter.cardDefinitionOf,
        ),
      ]),
    );
  }, [logEntries, moveLogs, viewerId, view.status.phase, view.status.gameSegment, adapter]);

  return { log, eventLogEntries } as const;
}

function dedupeSystemEntries<T extends { turn: number; message: string; tags: readonly string[] }>(
  entries: readonly T[],
): T[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const isTurnLifecycle = / (?:started|ended) the turn\.$/.test(entry.message);
    if (!entry.tags.includes("system") && !isTurnLifecycle) return true;
    const key = `${entry.turn}:${entry.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mergeLogTurns(
  legacyTurns: readonly LogTurn[],
  structuredTurns: readonly LogTurn[],
): LogTurn[] {
  const byTurn = new Map<number, LogTurn>();

  for (const turn of [...legacyTurns, ...structuredTurns]) {
    const existing = byTurn.get(turn.turn);
    byTurn.set(
      turn.turn,
      existing
        ? {
            turn: turn.turn,
            groups: [...existing.groups, ...turn.groups],
          }
        : turn,
    );
  }

  return [...byTurn.values()].sort((a, b) => a.turn - b.turn);
}
