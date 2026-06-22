import { useCallback, useMemo } from "react";

import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import {
  asMoveName,
  useBoardProjection,
  useGundamGame,
  useLogEntries,
  useViewerId,
} from "../../game/index.ts";
import { projectEventLog } from "../../game/simulator-snapshot.ts";
import { MatchSidebar } from "../ui/MatchSidebar.tsx";
import type { MatchInfo, PlayerInfo } from "../ui/types.ts";
import { resolveOpponentId, zoneCount } from "./mappers.ts";
import { useSubmitError } from "./submit-error-context.tsx";
import { VsAiControls } from "../ui/VsAiControls.tsx";

export interface MatchSidebarContainerProps {
  readonly onCollapse?: () => void;
}

export function MatchSidebarContainer({ onCollapse }: MatchSidebarContainerProps = {}) {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();
  const logEntries = useLogEntries();
  const resolvedOpponent = resolveOpponentId(view, viewerId);
  const opponentId = resolvedOpponent ?? viewerId;
  const eventLogEntries: SimulatorEventLogEntry[] = useMemo(
    () => projectEventLog(logEntries),
    [logEntries],
  );

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
      eventLogEntries={eventLogEntries}
      onUndo={onUndo}
      canUndo={canUndo}
      onConcede={onConcede}
      onCollapse={onCollapse}
      // `VsAiControls` short-circuits to null when no `VsAiProvider`
      // is in the tree (i.e. non-AI fixtures). Wiring it here keeps
      // the sidebar presentational and the controls consistently
      // placed above `BATTLE DATA` on AI matches.
      aboveBattleData={<VsAiControls />}
    />
  );
}
