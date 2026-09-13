import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { matchHistoryUrl } from "../../../../../runtime/gameRuntimeApi.ts";
import { useSimulatorRoute } from "../../../../../simulator/providers";
import {
  useBoardProjection,
  useGundamGame,
  useMoveLogs,
  useViewerId,
  displayTurn,
} from "../../game/index.ts";
import { MatchOverviewModal } from "../ui/MatchOverviewModal.tsx";
import type { MatchResult, NotesSaveResult, PlayerRecap } from "../ui/MatchOverviewModal.tsx";
import {
  countActiveResources,
  replacePlayerIdsWithDisplayNames,
  resolveOpponentId,
  resolvePlayerDisplayName,
  zoneCount,
} from "./mappers.ts";
import { projectGundamMoveLogEntries } from "./move-log-projection.ts";
import { gundamRuntimeRequestHeaders } from "../../engine/live/runtimeHeaders.ts";
import { buildGundamReplayHref, getMatchmakingReturnUrl } from "../../engine/live/matchContext.ts";
import { buildGundamPracticeRematchPath } from "../../engine/practice/deckPayload.ts";
import { buildBugReportContext } from "../../../../../runtime/bugReportApi.ts";
import {
  downloadHostedReplay,
  saveHostedReplayOnDevice,
} from "../../../../../runtime/replayActions.ts";
import { useLayoutMode } from "../../lib/use-layout-mode.ts";
import { GundamBugReportDialog } from "../ui/GundamBugReportDialog.tsx";
import { decompressReplayBlob, fetchReplayBlob } from "../../../replay/fetchReplay.ts";
import {
  projectGundamPostMatchReplay,
  type GundamPostMatchReplaySummary,
} from "./post-match-replay.ts";

const NOOP = () => {};

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "—";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function MatchOverviewModalContainer() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const route = useSimulatorRoute();
  const { adapter } = useGundamGame();
  const moveLogs = useMoveLogs();
  const [dismissed, setDismissed] = useState(false);
  const [replayStatus, setReplayStatus] = useState<string | null>(null);
  const [bugReportOpen, setBugReportOpen] = useState(false);
  const [hostedSummary, setHostedSummary] = useState<GundamPostMatchReplaySummary | null>(null);
  const layoutMode = useLayoutMode();
  const navigate = useNavigate();
  const params = useParams<{ matchId?: string; gameId?: string }>();
  const [search] = useSearchParams();
  const gameId = route.gameId ?? params.gameId ?? search.get("gameId") ?? undefined;
  const matchId = params.matchId ?? search.get("matchId");
  const matchPageData = route.matchPageData;
  const rematchPath = buildGundamPracticeRematchPath({
    matchType: matchPageData?.match.matchType,
    viewerRole: matchPageData?.viewer.role,
    liveMatchSearch: search,
  });
  const bugReportContext = buildBugReportContext({
    gameSlug: "gundam",
    ...(gameId ? { gameId } : {}),
    ...(matchId ? { matchId } : {}),
    playerCount: view.players.length,
    turn: view.status.turn,
    stateVersion: view.stateID,
    platform: layoutMode === "mobile" ? "mobile" : "desktop",
  });

  const gameEnded = view.status.gameEnded;

  // Reset dismissal whenever the end-state flips (e.g. new game).
  useEffect(() => {
    setDismissed(false);
  }, [gameEnded]);

  useEffect(() => {
    setHostedSummary(null);
    if (!gameEnded || !gameId || !matchPageData) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;
    const load = async () => {
      attempt += 1;
      try {
        const replay = await decompressReplayBlob(await fetchReplayBlob(gameId));
        if (!cancelled) setHostedSummary(projectGundamPostMatchReplay(replay));
      } catch (error) {
        if (cancelled) return;
        if (attempt < 60) {
          retryTimer = setTimeout(load, 2_000);
          return;
        }
        console.error("[GundamPostGame] Failed to load authoritative summary:", error);
        setReplayStatus("Authoritative match summary is still unavailable.");
      }
    };
    void load();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [gameEnded, gameId, matchPageData]);

  if (!gameEnded || dismissed) return null;

  const winner = hostedSummary?.metadata.winnerId
    ? String(hostedSummary.metadata.winnerId)
    : view.status.winner
      ? String(view.status.winner)
      : undefined;
  const opponentId = resolveOpponentId(view, viewerId) ?? viewerId;
  const selfDisplayName = resolvePlayerDisplayName(
    String(viewerId),
    route.matchPageData?.match.participants,
    "You",
  );
  const opponentDisplayName = resolvePlayerDisplayName(
    opponentId,
    route.matchPageData?.match.participants,
    "Rival",
  );
  const reason = replacePlayerIdsWithDisplayNames(
    hostedSummary?.metadata.endReason ?? view.status.winReason,
    [
      { id: String(viewerId), displayName: selfDisplayName },
      { id: opponentId, displayName: opponentDisplayName },
    ],
  );

  const outcome: MatchResult["outcome"] =
    winner === String(viewerId) ? "victory" : winner ? "defeat" : "draw";

  const history = adapter.moveHistory();
  const firstTs = history[0]?.timestamp ?? 0;
  const lastTs = history[history.length - 1]?.timestamp ?? 0;
  const duration = hostedSummary?.metadata.durationMs
    ? formatDuration(hostedSummary.metadata.durationMs)
    : firstTs && lastTs
      ? formatDuration(lastTs - firstTs)
      : "—";
  const resultMoveLogs = hostedSummary?.moveLogs ?? moveLogs;
  const phase = view.status.phase ?? view.status.gameSegment ?? "game-end";
  const timeline = projectGundamMoveLogEntries(
    resultMoveLogs,
    String(viewerId),
    phase,
    adapter.cardDefinitionOf,
    { moveHistory: history },
  ).map((entry) => {
    const cardRefs = [
      ...(entry.cardRefs ?? []),
      ...(entry.entityIds ?? []).flatMap((cardId) => {
        const definition = adapter.cardDefinitionOf(cardId);
        return definition ? [{ id: cardId, name: definition.name }] : [];
      }),
    ];
    return {
      turn: entry.turn,
      who: entry.seatId === "opponent" ? ("opp" as const) : ("self" as const),
      text: entry.message,
      ...(cardRefs.length > 0 ? { cardRefs } : {}),
    };
  });

  const result: MatchResult = {
    outcome,
    reason,
    turn: hostedSummary?.metadata.totalTurns ?? displayTurn(view.status.turn),
    duration,
    moves: hostedSummary?.metadata.totalMoves ?? history.length,
    self: buildRecap(
      view,
      viewerId,
      selfDisplayName,
      hostedSummary?.movesByPlayerId[String(viewerId)] ??
        history.filter((entry) => String(entry.playerId) === String(viewerId)).length,
      resultMoveLogs,
    ),
    opponent: buildRecap(
      view,
      opponentId,
      opponentDisplayName,
      hostedSummary?.movesByPlayerId[opponentId] ??
        history.filter((entry) => String(entry.playerId) === opponentId).length,
      resultMoveLogs,
    ),
    timeline,
  };

  const onBackToMatchmaking = () => {
    if (matchPageData) {
      window.location.assign(getMatchmakingReturnUrl(`?${search.toString()}`));
      return;
    }
    void navigate("/vs-ai");
  };

  const onRematch = rematchPath
    ? () => {
        void navigate(rematchPath, { replace: true });
      }
    : undefined;

  const onDownloadReplay = () => {
    if (!gameId) {
      setReplayStatus("Replay is available after a hosted match.");
      return;
    }
    void downloadHostedReplay("gundam", gameId).catch((error) => {
      console.error("[GundamPostGame] Failed to download replay:", error);
      setReplayStatus("Replay download failed.");
    });
  };

  const onSaveReplay = () => {
    if (!gameId) {
      setReplayStatus("Replay is available after a hosted match.");
      return;
    }
    void saveHostedReplayOnDevice("gundam", gameId).then(
      () => setReplayStatus("Replay saved on this device. Browser storage has no set expiry."),
      (error) => {
        console.error("[GundamPostGame] Failed to save replay:", error);
        setReplayStatus("Replay save failed.");
      },
    );
  };

  const onSaveNotes = async (note: string): Promise<NotesSaveResult> => {
    if (!gameId) {
      return { ok: false, error: "failed" };
    }

    const response = await fetch(
      matchHistoryUrl("gundam", `/games/${encodeURIComponent(gameId)}/notes`),
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...gundamRuntimeRequestHeaders(),
        },
        body: JSON.stringify({ note }),
      },
    );
    if (!response.ok) {
      return { ok: false, error: response.status === 401 ? "unauthenticated" : "failed" };
    }
    return { ok: true };
  };

  return (
    <>
      <MatchOverviewModal
        result={result}
        onClose={() => setDismissed(true)}
        onBackToMatchmaking={onBackToMatchmaking}
        {...(onRematch ? { onRematch } : {})}
        onDownloadReplay={onDownloadReplay}
        onSaveReplay={onSaveReplay}
        onWatchReplay={() => {
          if (gameId) {
            window.location.assign(buildGundamReplayHref(gameId));
          }
        }}
        onSaveNotes={onSaveNotes}
        canSaveNotes={Boolean(gameId)}
        onReportBug={() => setBugReportOpen(true)}
        onShareFeedback={NOOP}
      />
      <GundamBugReportDialog
        open={bugReportOpen}
        onOpenChange={setBugReportOpen}
        context={bugReportContext}
      />
      {replayStatus ? (
        <div className="fixed bottom-20 left-1/2 z-[90] -translate-x-1/2 rounded-md bg-black/85 px-3 py-2 font-mono text-xs text-white">
          {replayStatus}
        </div>
      ) : null}
    </>
  );
}

type BoardView = ReturnType<typeof useBoardProjection>;
type MoveLogEntry = ReturnType<typeof useMoveLogs>[number];

function buildRecap(
  view: BoardView,
  playerId: string,
  displayName: string,
  moves: number,
  moveLogs: readonly MoveLogEntry[],
): PlayerRecap {
  const battleArea = view.zones.zones[`battleArea:${playerId}`];
  const units = battleArea?.cards ?? [];
  const ready = units.filter((c) => !(c.meta?.exhausted === true)).length;
  const exerted = units.length - ready;
  const resourcesTotal = zoneCount(view, "resourceArea", playerId);
  const resourcesActive = countActiveResources(view, playerId);
  const playerLogs = moveLogs
    .map((entry) => entry.log)
    .filter((log) => String(log.playerId) === playerId);
  const countMoves = (type: MoveLogEntry["log"]["type"]): number =>
    playerLogs.filter((log) => log.type === type).length;

  return {
    name: displayName,
    shields: zoneCount(view, "shieldArea", playerId),
    deck: zoneCount(view, "deck", playerId),
    hand: zoneCount(view, "hand", playerId),
    trash: zoneCount(view, "trash", playerId),
    resourcesActive,
    resourcesTotal,
    unitsInPlay: units.length,
    activeUnits: ready,
    restedUnits: exerted,
    unitsDeployed: countMoves("deployUnit"),
    basesDeployed: countMoves("deployBase"),
    commandsPlayed: countMoves("playCommand"),
    pilotsPaired: countMoves("assignPilot"),
    attacks: countMoves("attack"),
    blocks: countMoves("block"),
    moves,
    effectsResolved: countMoves("resolveEffect"),
  };
}
