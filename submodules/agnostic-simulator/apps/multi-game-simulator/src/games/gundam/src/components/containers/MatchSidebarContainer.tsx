import { useCallback, useMemo } from "react";

import {
  asMoveName,
  useBoardProjection,
  useGundamGame,
  useLogEntries,
  useViewerId,
} from "../../game/index.ts";
import { useMoveLogs } from "../../game/hooks.ts";
import { m } from "../../lib/i18n/messages.ts";
import { CardLink } from "../ui/CardLink.tsx";
import { MatchSidebar } from "../ui/MatchSidebar.tsx";
import type { LogTurn, MatchInfo, PlayerInfo } from "../ui/types.ts";
import { toLogTurns } from "./log-mapper.tsx";
import { toStructuredLogTurns } from "./move-log-mapper.tsx";
import {
  projectGundamLegacyEventLogEntries,
  projectGundamMoveLogEntries,
} from "./move-log-projection.ts";
import { resolveOpponentId, zoneCount } from "./mappers.ts";
import { useSubmitError } from "./submit-error-context.tsx";
import { VsAiControls } from "../ui/VsAiControls.tsx";
import { SoundVolumeControl } from "../../../../../simulator/settings";

export interface MatchSidebarContainerProps {
  readonly onCollapse?: () => void;
}

export function MatchSidebarContainer({ onCollapse }: MatchSidebarContainerProps = {}) {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();
  const logEntries = useLogEntries();
  const moveLogs = useMoveLogs();
  const resolvedOpponent = resolveOpponentId(view, viewerId);
  const opponentId = resolvedOpponent ?? viewerId;
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
      { revealPrivateFields: adapter.revealsPrivateMoveLogFields === true },
    );
    if (projectedMoveEntries.length === 0) return [];

    return [
      ...projectedMoveEntries,
      ...projectGundamLegacyEventLogEntries(
        logEntries,
        String(viewerId),
        phase,
        adapter.cardDefinitionOf,
      ),
    ].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  }, [logEntries, moveLogs, viewerId, view.status.phase, view.status.gameSegment, adapter]);

  const matchInfo: MatchInfo = {
    format: view.status.gameSegment ?? "setup",
    turn: view.status.turn,
    phase: view.status.phase ?? "—",
    mode: "hot-seat",
  };

  const opponent: PlayerInfo = {
    name: opponentId,
    clock: "—",
    timer: view.timerView.players?.[opponentId],
    isOwnClock: false,
    colors: [],
    deck: zoneCount(view, "deck", opponentId),
    discard: zoneCount(view, "trash", opponentId),
    shields: zoneCount(view, "shieldArea", opponentId),
  };
  const self: PlayerInfo = {
    name: viewerId,
    clock: "—",
    timer: view.timerView.players?.[String(viewerId)],
    isOwnClock: true,
    colors: [],
    deck: zoneCount(view, "deck", viewerId),
    discard: zoneCount(view, "trash", viewerId),
    shields: zoneCount(view, "shieldArea", viewerId),
  };

  const turnPlayerId = view.status.turnPlayer ?? view.status.activePlayer;
  const currentTurn: "opponent" | "self" =
    String(turnPlayerId) === String(viewerId) ? "self" : "opponent";
  const priorityHolder: "opponent" | "self" =
    String(view.status.activePlayer) === String(viewerId) ? "self" : "opponent";

  const onConcede = useCallback(() => {
    report(adapter.submit(asMoveName("concede"), {}));
  }, [adapter, report]);
  const onUndo = useCallback(() => {
    adapter.undo();
  }, [adapter]);
  // `useBoardProjection` above subscribes us to runtime state updates,
  // so this re-reads on every state transition.
  const canUndo = adapter.canUndo();

  return (
    <MatchSidebar
      matchInfo={matchInfo}
      players={[opponent, self]}
      currentTurn={currentTurn}
      priorityHolder={priorityHolder}
      log={log}
      eventLogEntries={eventLogEntries}
      onUndo={onUndo}
      canUndo={canUndo}
      onConcede={onConcede}
      onCollapse={onCollapse}
      // `VsAiControls` short-circuits to null when no `VsAiProvider`
      // is in the tree (i.e. non-AI fixtures). Wiring it here keeps
      // the sidebar presentational and the controls consistently
      // placed above `BATTLE DATA` on AI matches.
      aboveBattleData={
        <>
          <VsAiControls />
          <div className="border-b border-hud-border px-hud-md py-2.5">
            <SoundVolumeControl className="text-hud-text-muted" />
          </div>
        </>
      }
    />
  );
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
