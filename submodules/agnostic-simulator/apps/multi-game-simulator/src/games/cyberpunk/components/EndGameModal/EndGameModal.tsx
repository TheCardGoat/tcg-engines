import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBug,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconCpu,
  IconDeviceFloppy,
  IconDownload,
  IconLoader2,
  IconMessage2,
  IconNotebook,
  IconRefresh,
  IconSwords,
  IconTrophy,
  IconX,
} from "@tabler/icons-react";
import { PostGameModal } from "@tcg/simulator-ui";
import { useSimulatorAudio } from "../../../../simulator/audio";
import {
  isBrowserReplayStorageAvailable,
  listDeviceReplays,
} from "@tcg/simulator-runtime/replay-library";
import { downloadHostedReplay, saveHostedReplayOnDevice } from "../../../../runtime/replayActions";
import { useEngine } from "../../engine";
import { PLAYER_SIDE_TO_ID } from "../../engine/sides";
import { useGameState } from "../GameBoard/gameStateContext";
import {
  fetchCyberpunkPostGameRecord,
  saveCyberpunkPostGameNote,
  submitCyberpunkBugReport,
  submitCyberpunkFeedback,
  type CyberpunkAnalyticsEnvelope,
  type CyberpunkGameAnalyticsRecord,
  type CyberpunkPlayerAnalytics,
} from "./postGameApi";
import {
  closePostGameModal,
  createInitialPostGameModalState,
  openPostGameModal,
  syncPostGameModalState,
} from "./postGameModalState";
import classes from "./EndGameModal.module.css";
import { cyberpunkSimulatorPath } from "../../pages/simulatorPaths";

const PLATFORM_MATCHMAKING_URL = "https://tcg.online/cyberpunk/matchmaking";

const neutralReasons: Readonly<Record<string, string>> = {
  gig_victory: "Gig victory: start your turn with 7 gigs",
  overtime_majority: "Overtime: first to 7 Gig dice",
};

const reasonsByOutcome: Readonly<
  Record<string, Readonly<Partial<Record<"win" | "loss" | "draw", string>>>>
> = {
  concede: {
    win: "Opponent conceded",
    loss: "You conceded",
    draw: "Conceded",
  },
  deck_out_victory: {
    win: "Opponent ran out of cards",
    loss: "You ran out of cards",
    draw: "Deck out",
  },
};

type SupportDialog = "bug" | "feedback" | null;

export function EndGameModal() {
  const { gameEnded, winnerSide, winReason, turnNumber } = useGameState();
  const {
    humanSide,
    resetScenario,
    canResetScenario,
    isRemote,
    remoteReturnUrl,
    postGameContext,
    postGameSurface,
    matchState,
  } = useEngine();
  const [modalState, setModalState] = useState(createInitialPostGameModalState);
  const [recordLoading, setRecordLoading] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [analyticsEnvelope, setAnalyticsEnvelope] = useState<CyberpunkAnalyticsEnvelope | null>(
    null,
  );
  const [noteValue, setNoteValue] = useState("");
  const [savedNoteValue, setSavedNoteValue] = useState("");
  const [canSaveNote, setCanSaveNote] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [supportDialog, setSupportDialog] = useState<SupportDialog>(null);
  const [supportText, setSupportText] = useState("");
  const [supportStatus, setSupportStatus] = useState<string | null>(null);
  const [replayDownloading, setReplayDownloading] = useState(false);
  const [replaySaving, setReplaySaving] = useState(false);
  const [replaySaved, setReplaySaved] = useState(false);
  const [replayStatus, setReplayStatus] = useState<string | null>(null);
  const celebratedAudioKeyRef = useRef<string | null>(null);
  const { playCue } = useSimulatorAudio();
  const isDeckBuilderPractice = postGameSurface === "deck-builder-practice";
  const canUseReplayStore = isBrowserReplayStorageAvailable();
  const canUseReplayActions = !isDeckBuilderPractice && Boolean(postGameContext?.gameId);

  const outcome: "win" | "loss" | "draw" =
    winnerSide === null ? "draw" : winnerSide === humanSide ? "win" : "loss";
  const finishedGameKey = gameEnded
    ? `${postGameContext?.gameId ?? "local"}:${matchState.ctx.stateID}:${winnerSide ?? "draw"}`
    : null;

  useEffect(() => {
    setModalState((current) => syncPostGameModalState(current, finishedGameKey));
  }, [finishedGameKey]);

  useEffect(() => {
    if (!finishedGameKey) {
      celebratedAudioKeyRef.current = null;
      return;
    }
    if (finishedGameKey === celebratedAudioKeyRef.current) return;
    celebratedAudioKeyRef.current = finishedGameKey;
    if (outcome === "draw") return;
    playCue(outcome === "win" ? "game.win" : "game.loss");
  }, [finishedGameKey, outcome, playCue]);

  useEffect(() => {
    if (postGameContext?.analytics) {
      setAnalyticsEnvelope(postGameContext.analytics);
      setCanSaveNote(false);
      setNoteValue("");
      setSavedNoteValue("");
      setRecordError(null);
      setRecordLoading(false);
      return;
    }

    if (isDeckBuilderPractice || !modalState.open || !postGameContext?.gameId) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const loadRecord = async () => {
      setRecordLoading(true);
      setRecordError(null);
      try {
        const record = await fetchCyberpunkPostGameRecord(postGameContext.gameId);
        if (cancelled) return;
        setAnalyticsEnvelope(record.analytics ?? { status: "processing" });
        setCanSaveNote(record.canSaveNote);
        setNoteValue(record.note);
        setSavedNoteValue(record.note);
        if (record.analytics?.status === "processing" || record.analytics?.status === "missing") {
          timer = setTimeout(loadRecord, 2500);
        }
      } catch (error) {
        if (!cancelled) {
          setRecordError(
            error instanceof Error ? error.message : "Unable to load match analytics.",
          );
          setAnalyticsEnvelope({
            status: "failed",
            errorMessage: "Unable to load match analytics.",
          });
        }
      } finally {
        if (!cancelled) {
          setRecordLoading(false);
        }
      }
    };

    void loadRecord();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [isDeckBuilderPractice, modalState.open, postGameContext?.analytics, postGameContext?.gameId]);

  useEffect(() => {
    if (
      !modalState.open ||
      !canUseReplayActions ||
      !postGameContext?.gameId ||
      !canUseReplayStore
    ) {
      setReplaySaved(false);
      setReplayStatus(null);
      setReplayDownloading(false);
      setReplaySaving(false);
      return;
    }

    let cancelled = false;
    const gameId = postGameContext.gameId;

    listDeviceReplays("cyberpunk")
      .then((savedReplays) => {
        if (!cancelled) {
          setReplaySaved(savedReplays.some((replay) => replay.gameId === gameId));
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("[CyberpunkPostGame] Failed to check replay save state:", error);
          setReplaySaved(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [canUseReplayActions, canUseReplayStore, modalState.open, postGameContext?.gameId]);

  const analytics = analyticsEnvelope?.payload;
  const noteDirty = noteValue.trim() !== savedNoteValue.trim();
  const bestOfLabel = postGameContext?.format === "best_of_3" ? "Best of 3" : "Best of 1";
  const nextGameHref =
    postGameContext?.nextGameId && postGameContext.matchId
      ? `/matches/${encodeURIComponent(postGameContext.matchId)}/games/${encodeURIComponent(
          postGameContext.nextGameId,
        )}${window.location.search}`
      : null;
  const viewerPlayerId = resolveViewerPlayerId(matchState.ctx.playerIds, humanSide);
  const sides = useMemo(
    () => (analytics ? resolveSides(analytics, viewerPlayerId) : null),
    [analytics, viewerPlayerId],
  );

  if (!gameEnded) return null;

  const closeModal = () => {
    setModalState((current) => closePostGameModal(current));
  };

  async function saveNote(): Promise<void> {
    if (!postGameContext?.gameId || !noteDirty || noteSaving) return;
    setNoteSaving(true);
    setNoteError(null);
    try {
      const record = await saveCyberpunkPostGameNote({
        gameId: postGameContext.gameId,
        note: noteValue,
      });
      setSavedNoteValue(record.note);
      setNoteValue(record.note);
      setCanSaveNote(record.canSaveNote);
    } catch (error) {
      setNoteError(error instanceof Error ? error.message : "Failed to save notes.");
    } finally {
      setNoteSaving(false);
    }
  }

  async function downloadReplay(): Promise<void> {
    if (!postGameContext?.gameId || replayDownloading) return;
    setReplayDownloading(true);
    setReplayStatus(null);
    try {
      await downloadHostedReplay("cyberpunk", postGameContext.gameId);
    } catch (error) {
      console.error("[CyberpunkPostGame] Failed to download replay:", error);
      setReplayStatus("Replay download failed.");
    } finally {
      setReplayDownloading(false);
    }
  }

  async function saveReplay(): Promise<void> {
    if (!postGameContext?.gameId || replaySaving || replaySaved) return;
    setReplaySaving(true);
    setReplayStatus(null);
    try {
      await saveHostedReplayOnDevice("cyberpunk", postGameContext.gameId);
      setReplaySaved(true);
      setReplayStatus("Replay saved.");
    } catch (error) {
      console.error("[CyberpunkPostGame] Failed to save replay:", error);
      setReplayStatus(
        error instanceof DOMException && error.name === "QuotaExceededError"
          ? "Replay storage is full. Delete older saved replays and try again."
          : "Replay save failed.",
      );
    } finally {
      setReplaySaving(false);
    }
  }

  async function submitSupport(): Promise<void> {
    if (!supportDialog || supportText.trim().length === 0 || !postGameContext?.gameId) return;
    setSupportStatus("Sending...");
    try {
      if (supportDialog === "bug") {
        await submitCyberpunkBugReport({
          description: supportText,
          source: "cyberpunk-post-game",
          context: {
            gameId: postGameContext.gameId,
            gameSlug: "cyberpunk",
            matchId: postGameContext.matchId,
            playerCount: analytics?.players?.length ?? 2,
            stateVersion: matchState.ctx.stateID,
            winnerId: analytics?.summary.winnerId,
            endReason: analytics?.summary.endReason ?? winReason ?? undefined,
            turn: turnNumber,
            platform: window.innerWidth < 768 ? "mobile" : "desktop",
          },
        });
      } else {
        await submitCyberpunkFeedback({
          message: supportText,
          source: isDeckBuilderPractice ? "cyberpunk-practice-post-game" : "cyberpunk-post-game",
        });
      }
      setSupportStatus("Sent.");
      setSupportText("");
      setTimeout(() => {
        setSupportDialog(null);
        setSupportStatus(null);
      }, 700);
    } catch (error) {
      setSupportStatus(error instanceof Error ? error.message : "Could not send this right now.");
    }
  }

  const reasonText = describeReason(winReason, outcome);
  const timing = analytics ? getAnalyticsTiming(analytics) : null;
  const metaChips = isDeckBuilderPractice ? (
    <>
      <span>Practice</span>
      <span>Turn {turnNumber}</span>
    </>
  ) : (
    <>
      <span>{bestOfLabel}</span>
      {postGameContext?.gameNumber !== undefined && <span>Game {postGameContext.gameNumber}</span>}
      {postGameContext?.player1Score !== undefined &&
        postGameContext.player2Score !== undefined && (
          <span>
            Series {postGameContext.player1Score}-{postGameContext.player2Score}
          </span>
        )}
      <span>Turn {analytics?.summary.totalTurns ?? turnNumber}</span>
      {timing && timing.totalDurationMs > 0 && (
        <span>{formatDuration(timing.totalDurationMs)}</span>
      )}
    </>
  );
  const participants =
    sides && !isDeckBuilderPractice
      ? {
          left: (
            <ParticipantCard
              player={sides.viewer}
              sideLabel={sides.viewerLabel}
              isWinner={analytics?.summary.winnerId === sides.viewer.playerId}
            />
          ),
          right: (
            <ParticipantCard
              player={sides.opponent}
              sideLabel={sides.opponentLabel}
              isWinner={analytics?.summary.winnerId === sides.opponent.playerId}
            />
          ),
        }
      : undefined;

  const sections = isDeckBuilderPractice
    ? [
        {
          id: "practice",
          label: "Practice",
          icon: <IconTrophy size={16} />,
          content: <PracticeSummarySection outcome={outcome} reason={reasonText} />,
        },
      ]
    : [
        {
          id: "overview",
          label: "Overview",
          icon: <IconTrophy size={16} />,
          content: sides ? (
            <OverviewSection
              analytics={analytics}
              sides={sides}
              envelope={analyticsEnvelope}
              loading={recordLoading}
              error={recordError}
              viewerPlayerId={viewerPlayerId}
            />
          ) : (
            <AnalyticsStatus
              envelope={analyticsEnvelope}
              loading={recordLoading}
              error={recordError}
            />
          ),
        },
        {
          id: "turns",
          label: "Turns",
          icon: <IconChartBar size={16} />,
          content: (
            <TurnsBreakdown analytics={analytics} sides={sides} envelope={analyticsEnvelope} />
          ),
        },
        {
          id: "notes",
          label: "Notes",
          icon: <IconNotebook size={16} />,
          content: (
            <section className={classes.panel}>
              <div className={classes.panelHeader}>
                <div>
                  <h3>Match notes</h3>
                  <p>Private notes are saved to the whole match, not only this game.</p>
                </div>
              </div>
              {!canSaveNote ? (
                <div className={classes.emptyState}>
                  Sign in to save notes for this Cyberpunk match.
                </div>
              ) : (
                <>
                  <textarea
                    className={classes.notesArea}
                    value={noteValue}
                    onChange={(event) => setNoteValue(event.currentTarget.value)}
                    placeholder="Add matchup reads, misplays, sideboarding thoughts, or bug context."
                  />
                  <div className={classes.notesFooter}>
                    <span className={noteError ? classes.errorText : classes.mutedText}>
                      {noteError ?? (noteDirty ? "Unsaved changes" : "Notes saved")}
                    </span>
                    <button
                      type="button"
                      className={`${classes.btn} ${classes.btnPrimary}`}
                      onClick={() => void saveNote()}
                      disabled={!noteDirty || noteSaving}
                    >
                      {noteSaving ? (
                        <IconLoader2 size={15} className={classes.spin} />
                      ) : (
                        <IconDeviceFloppy size={15} />
                      )}
                      Save notes
                    </button>
                  </div>
                </>
              )}
            </section>
          ),
        },
      ];

  const actions = (
    <>
      {canUseReplayActions && (
        <div className={classes.replayActions} aria-label="Replay actions">
          <button
            type="button"
            className={classes.replayButton}
            onClick={() =>
              window.location.assign(
                cyberpunkSimulatorPath(
                  `/replay/${encodeURIComponent(postGameContext?.gameId ?? "")}`,
                ),
              )
            }
          >
            Watch replay
          </button>
          <button
            type="button"
            className={classes.replayButton}
            onClick={() => void downloadReplay()}
            disabled={replayDownloading}
          >
            {replayDownloading ? (
              <IconLoader2 size={15} className={classes.spin} />
            ) : (
              <IconDownload size={15} />
            )}
            Download replay
          </button>
          {canUseReplayStore && (
            <button
              type="button"
              className={classes.replayButton}
              onClick={() => void saveReplay()}
              disabled={replaySaving || replaySaved}
            >
              {replaySaved ? (
                <IconCheck size={15} />
              ) : replaySaving ? (
                <IconLoader2 size={15} className={classes.spin} />
              ) : (
                <IconDeviceFloppy size={15} />
              )}
              {replaySaved
                ? "Saved on this device"
                : replaySaving
                  ? "Saving replay"
                  : "Save on this device"}
            </button>
          )}
          {replayStatus && <span className={classes.replayStatus}>{replayStatus}</span>}
        </div>
      )}
      <div className={classes.supportActions}>
        {!isDeckBuilderPractice && (
          <button
            type="button"
            className={classes.supportButton}
            onClick={() => {
              setSupportDialog("bug");
              setSupportText("");
              setSupportStatus(null);
            }}
          >
            <IconBug size={15} />
            Report bug
          </button>
        )}
        <button
          type="button"
          className={classes.supportButton}
          onClick={() => {
            setSupportDialog("feedback");
            setSupportText("");
            setSupportStatus(null);
          }}
        >
          <IconMessage2 size={15} />
          Feedback
        </button>
      </div>
      <div className={classes.actions}>
        {isDeckBuilderPractice ? (
          <button
            type="button"
            className={`${classes.btn} ${classes.btnPrimary}`}
            data-testid="end-game-start-over"
            onClick={resetScenario}
            disabled={!canResetScenario}
          >
            <IconRefresh size={16} />
            Start over
          </button>
        ) : isRemote ? (
          <>
            {nextGameHref ? (
              <button
                type="button"
                className={`${classes.btn} ${classes.btnPrimary}`}
                data-testid="end-game-next-game"
                onClick={() => {
                  window.location.href = nextGameHref;
                }}
              >
                Go to next game
                <IconArrowRight size={16} />
              </button>
            ) : postGameContext?.matchStatus === "completed" ? (
              <button
                type="button"
                className={`${classes.btn} ${classes.btnPrimary}`}
                data-testid="end-game-lobby"
                onClick={() => {
                  if (remoteReturnUrl) {
                    window.location.href = remoteReturnUrl;
                    return;
                  }
                  window.location.href = PLATFORM_MATCHMAKING_URL;
                }}
              >
                Back to matchmaking
              </button>
            ) : (
              <button type="button" className={classes.btn} disabled>
                <IconLoader2 size={15} className={classes.spin} />
                Finalizing match
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className={`${classes.btn} ${classes.btnPrimary}`}
              data-testid="end-game-rematch"
              onClick={() => {
                resetScenario();
              }}
              disabled={!canResetScenario}
            >
              Rematch
            </button>
            <a
              className={classes.btn}
              data-testid="end-game-back-to-setup"
              href={PLATFORM_MATCHMAKING_URL}
            >
              Back to matchmaking
            </a>
          </>
        )}
      </div>
    </>
  );

  if (!modalState.open) {
    return (
      <button
        type="button"
        className={classes.launcher}
        onClick={() => setModalState((current) => openPostGameModal(current))}
      >
        <IconChartBar size={16} />
        View summary
      </button>
    );
  }

  return (
    <>
      <PostGameModal
        open={modalState.open}
        outcome={outcome}
        reason={reasonText}
        participants={participants}
        meta={metaChips}
        returnUrl={
          isRemote ? (remoteReturnUrl ?? PLATFORM_MATCHMAKING_URL) : PLATFORM_MATCHMAKING_URL
        }
        sections={sections}
        actions={actions}
        onClose={closeModal}
        testId="end-game-modal"
        dataEndReason={winReason ?? undefined}
        dataRemote={isRemote ? "true" : "false"}
        dataPostGameSurface={postGameSurface}
        celebrationKey={finishedGameKey ?? undefined}
      />

      {supportDialog && (
        <div className={classes.supportDialog} role="dialog" aria-modal="true">
          <div className={classes.supportDialogCard}>
            <div className={classes.panelHeader}>
              <div>
                <h3>{supportDialog === "bug" ? "Report a bug" : "Share feedback"}</h3>
                <p>
                  {supportDialog === "bug"
                    ? "This includes the match and game context automatically."
                    : isDeckBuilderPractice
                      ? "Tell us what would make the practice flow more useful."
                      : "Tell us what would make the post-game flow more useful."}
                </p>
              </div>
              <button
                type="button"
                className={classes.iconButton}
                onClick={() => setSupportDialog(null)}
                aria-label="Close support dialog"
              >
                <IconX size={16} />
              </button>
            </div>
            <textarea
              className={classes.notesArea}
              value={supportText}
              onChange={(event) => setSupportText(event.currentTarget.value)}
              placeholder={supportDialog === "bug" ? "What happened?" : "What should we improve?"}
            />
            <div className={classes.notesFooter}>
              <span
                className={
                  supportStatus?.includes("Failed") ? classes.errorText : classes.mutedText
                }
              >
                {supportStatus ?? " "}
              </span>
              <button
                type="button"
                className={`${classes.btn} ${classes.btnPrimary}`}
                onClick={() => void submitSupport()}
                disabled={supportText.trim().length === 0 || supportStatus === "Sending..."}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function describeReason(reason: string | null, outcome: "win" | "loss" | "draw"): string {
  if (!reason) return "Match complete.";
  const perspective = reasonsByOutcome[reason]?.[outcome];
  if (perspective) return perspective;
  return neutralReasons[reason] ?? reason.replace(/_/g, " ");
}
function PracticeSummarySection({
  outcome,
  reason,
}: {
  outcome: "win" | "loss" | "draw";
  reason: string;
}) {
  const result = outcome === "win" ? "Practice win" : outcome === "loss" ? "Practice loss" : "Draw";
  return (
    <section className={classes.panel}>
      <div className={classes.practiceState}>
        <IconTrophy size={22} />
        <div>
          <h3>{result}</h3>
          <p>{reason}</p>
          <p>Start over replays this deck against the same practice bot.</p>
        </div>
      </div>
    </section>
  );
}

function OverviewSection({
  analytics,
  sides,
  envelope,
  loading,
  error,
  viewerPlayerId,
}: {
  analytics: CyberpunkGameAnalyticsRecord | undefined;
  sides: SideAssignment;
  envelope: CyberpunkAnalyticsEnvelope | null;
  loading: boolean;
  error: string | null;
  viewerPlayerId?: string;
}) {
  if (!analytics) {
    return <AnalyticsStatus envelope={envelope} loading={loading} error={error} />;
  }

  return (
    <section className={classes.panel}>
      <div className={classes.panelHeader}>
        <div>
          <h3>Head-to-head</h3>
          <p>The numbers that decided this game.</p>
        </div>
      </div>
      <ComparisonTable sides={sides} rows={buildComparisonRows(sides)} />
      <ProgressionChart sides={sides} />
      <ClosingTurnCallout analytics={analytics} sides={sides} />
      <MatchHighlights sides={sides} />
      <DeckMatchup analytics={analytics} viewerPlayerId={viewerPlayerId} />
      <CardsBreakdown sides={sides} />
    </section>
  );
}

interface SideAssignment {
  viewer: CyberpunkPlayerAnalytics;
  opponent: CyberpunkPlayerAnalytics;
  viewerLabel: string;
  opponentLabel: string;
}

function resolveSides(
  analytics: CyberpunkGameAnalyticsRecord,
  viewerPlayerId: string | undefined,
): SideAssignment {
  const [first, second] = analytics.players;
  const viewer =
    viewerPlayerId !== undefined && first.playerId === viewerPlayerId
      ? first
      : viewerPlayerId !== undefined && second.playerId === viewerPlayerId
        ? second
        : null;
  if (viewer) {
    const opponent = viewer === first ? second : first;
    return { viewer, opponent, viewerLabel: "You", opponentLabel: "Rival" };
  }
  return {
    viewer: first,
    opponent: second,
    viewerLabel: `Player ${first.seat}`,
    opponentLabel: `Player ${second.seat}`,
  };
}

interface ComparisonRow {
  id: string;
  label: string;
  viewer: string | number;
  opponent: string | number;
  emphasis?: boolean;
}

function buildComparisonRows(sides: SideAssignment): Array<ComparisonRow> {
  const attacks = (player: CyberpunkPlayerAnalytics) =>
    player.counters.directAttacks + player.counters.unitAttacks;
  return [
    {
      id: "gigs",
      label: "Gigs",
      viewer: sides.viewer.final.gigs,
      opponent: sides.opponent.final.gigs,
      emphasis: true,
    },
    {
      id: "street-cred",
      label: "Street Cred",
      viewer: sides.viewer.final.streetCred,
      opponent: sides.opponent.final.streetCred,
      emphasis: true,
    },
    {
      id: "eddies",
      label: "Eddies remaining",
      viewer: sides.viewer.final.eddies,
      opponent: sides.opponent.final.eddies,
    },
    {
      id: "cards-played",
      label: "Cards played",
      viewer: sides.viewer.counters.cardsPlayed,
      opponent: sides.opponent.counters.cardsPlayed,
    },
    {
      id: "gigs-stolen",
      label: "Gigs stolen",
      viewer: sides.viewer.counters.gigsStolen,
      opponent: sides.opponent.counters.gigsStolen,
    },
    {
      id: "attacks",
      label: "Attacks",
      viewer: attacks(sides.viewer),
      opponent: attacks(sides.opponent),
    },
    {
      id: "blocks",
      label: "Blocks",
      viewer: sides.viewer.counters.blockersUsed,
      opponent: sides.opponent.counters.blockersUsed,
    },
    {
      id: "abilities",
      label: "Abilities activated",
      viewer: sides.viewer.counters.abilitiesActivated,
      opponent: sides.opponent.counters.abilitiesActivated,
    },
    {
      id: "deck",
      label: "Deck remaining",
      viewer: sides.viewer.final.deckCount,
      opponent: sides.opponent.final.deckCount,
    },
    {
      id: "avg-think",
      label: "Avg think / turn",
      viewer: formatDuration(getPlayerTiming(sides.viewer).avgThinkingMs),
      opponent: formatDuration(getPlayerTiming(sides.opponent).avgThinkingMs),
    },
  ];
}

function ComparisonTable({ sides, rows }: { sides: SideAssignment; rows: Array<ComparisonRow> }) {
  return (
    <div className={classes.comparisonScroll}>
      <table className={classes.comparisonTable}>
        <thead>
          <tr>
            <th scope="col" className={classes.comparisonViewer}>
              {sides.viewerLabel}
            </th>
            <th scope="col" className={classes.comparisonStat}>
              <span aria-hidden="true">vs</span>
            </th>
            <th scope="col" className={classes.comparisonOpponent}>
              {sides.opponentLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} data-emphasis={row.emphasis || undefined}>
              <td className={classes.comparisonViewer}>{row.viewer}</td>
              <th scope="row" className={classes.comparisonStat}>
                {row.label}
              </th>
              <td className={classes.comparisonOpponent}>{row.opponent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ProgressionMetric = "gigs" | "streetCred" | "lead";

function ProgressionChart({ sides }: { sides: SideAssignment }) {
  const [metric, setMetric] = useState<ProgressionMetric>("gigs");
  const turns = useMemo(() => {
    const turnSet = new Set<number>();
    for (const player of [sides.viewer, sides.opponent]) {
      for (const turn of player.perTurn) turnSet.add(turn.turn);
    }
    return [...turnSet].sort((a, b) => a - b);
  }, [sides]);

  if (turns.length === 0) {
    return <div className={classes.emptyState}>No turn-by-turn progression was recorded.</div>;
  }

  const isLead = metric === "lead";
  const rawMetric: "gigs" | "streetCred" = metric === "streetCred" ? "streetCred" : "gigs";
  const rawSeries = {
    viewer: progressionValues(sides.viewer, turns, rawMetric),
    opponent: progressionValues(sides.opponent, turns, rawMetric),
  };
  const values = isLead
    ? {
        viewer: rawSeries.viewer.map((value, index) => value - (rawSeries.opponent[index] ?? 0)),
        opponent: [] as number[],
      }
    : rawSeries;
  const maxValue = isLead
    ? Math.max(1, ...values.viewer.map((value) => Math.abs(value)))
    : Math.max(1, ...values.viewer, ...values.opponent);
  const yMax = Math.max(4, Math.ceil(maxValue / 4) * 4);
  const pointCount = turns.length + 1;
  const width = Math.max(320, pointCount * 56 + 64);
  const xFor = (index: number) => 44 + (index / Math.max(1, turns.length)) * (width - 72);
  const yFor = (value: number) => (isLead ? 121 - (value / yMax) * 78 : 200 - (value / yMax) * 156);
  const pathFor = (series: number[]) =>
    series
      .map((value, index) =>
        index === 0 ? `M ${xFor(index)} ${yFor(value)}` : `H ${xFor(index)} V ${yFor(value)}`,
      )
      .join(" ");
  const metricLabel =
    metric === "gigs" ? "Gigs" : metric === "streetCred" ? "Street Cred" : "Gig lead";
  const axisTicks = isLead
    ? [-yMax, -yMax / 2, 0, yMax / 2, yMax]
    : [0, 1, 2, 3, 4].map((tick) => (yMax / 4) * tick);

  return (
    <figure className={classes.chartFigure}>
      <figcaption className={classes.chartHead}>
        <span>
          <strong>{metricLabel} progression</strong>
          <small>
            {isLead
              ? "Gig advantage per turn (You minus Rival)"
              : "Board state at the end of each turn"}
          </small>
        </span>
        <div className={classes.chartToggle} role="group" aria-label="Charted statistic">
          {(["gigs", "streetCred", "lead"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={metric === option}
              onClick={() => setMetric(option)}
            >
              {option === "gigs" ? "Gigs" : option === "streetCred" ? "Street Cred" : "Lead"}
            </button>
          ))}
        </div>
      </figcaption>
      <div className={classes.chartScroll}>
        <svg
          viewBox={`0 0 ${width} 254`}
          style={{ minWidth: turns.length > 5 ? width : undefined }}
          role="img"
          aria-label={`${metricLabel} progression by turn`}
        >
          {axisTicks.map((value) => (
            <g key={value}>
              <line
                x1="44"
                x2={width - 28}
                y1={yFor(value)}
                y2={yFor(value)}
                className={value === 0 && isLead ? classes.chartZero : classes.chartGrid}
              />
              <text x="30" y={yFor(value) + 4} textAnchor="end" className={classes.chartAxis}>
                {value}
              </text>
            </g>
          ))}
          {["Start", ...turns].map((turn, index) => (
            <g key={turn}>
              <line
                x1={xFor(index)}
                x2={xFor(index)}
                y1="36"
                y2="206"
                className={classes.chartGrid}
              />
              <text x={xFor(index)} y="230" textAnchor="middle" className={classes.chartAxis}>
                {turn === "Start" ? "Start" : `T${turn}`}
              </text>
            </g>
          ))}
          <path d={pathFor(values.viewer)} className={classes.chartLineViewer} />
          {isLead ? null : (
            <path d={pathFor(values.opponent)} className={classes.chartLineOpponent} />
          )}
          {(isLead ? (["viewer"] as const) : (["viewer", "opponent"] as const)).map((seriesName) =>
            values[seriesName].map((value, index) => {
              const otherValue =
                values[seriesName === "viewer" ? "opponent" : "viewer"][index] ?? value;
              const labelAbove = isLead
                ? value >= 0
                : value > otherValue || (value === otherValue && seriesName === "viewer");
              return (
                <g key={`${seriesName}-${index}`}>
                  <circle
                    cx={xFor(index)}
                    cy={yFor(value)}
                    r={seriesName === "viewer" ? 4.5 : 3.5}
                    className={
                      seriesName === "viewer" ? classes.chartDotViewer : classes.chartDotOpponent
                    }
                  />
                  <text
                    x={xFor(index)}
                    y={yFor(value) + (labelAbove ? -11 : 18)}
                    textAnchor="middle"
                    className={
                      seriesName === "viewer"
                        ? classes.chartValueViewer
                        : classes.chartValueOpponent
                    }
                  >
                    {value}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
      </div>
      <div className={classes.chartLegend}>
        {isLead ? (
          <span>
            <i data-series="viewer" />
            {sides.viewerLabel} − {sides.opponentLabel}
          </span>
        ) : (
          <>
            <span>
              <i data-series="viewer" />
              {sides.viewerLabel}
            </span>
            <span>
              <i data-series="opponent" />
              {sides.opponentLabel}
            </span>
          </>
        )}
      </div>
    </figure>
  );
}

function progressionValues(
  player: CyberpunkPlayerAnalytics,
  turns: number[],
  metric: "gigs" | "streetCred",
): number[] {
  const byTurn = new Map(player.perTurn.map((turn) => [turn.turn, turn]));
  const values: number[] = [0];
  let carried = 0;
  for (const turn of turns) {
    const entry = byTurn.get(turn);
    const value = entry ? entry[metric === "gigs" ? "runningGigs" : "runningStreetCred"] : null;
    if (value !== null) carried = value;
    values.push(carried);
  }
  return values;
}

function ClosingTurnCallout({
  analytics,
  sides,
}: {
  analytics: CyberpunkGameAnalyticsRecord;
  sides: SideAssignment;
}) {
  const last = mergeTurnRows(analytics).at(-1);
  if (!last) return null;
  const winner =
    analytics.summary.winnerId === sides.viewer.playerId
      ? sides.viewer
      : analytics.summary.winnerId === sides.opponent.playerId
        ? sides.opponent
        : null;
  return (
    <section className={classes.turningPoint}>
      <span className={classes.turningPointIcon}>
        <IconSwords aria-hidden="true" size={19} />
      </span>
      <span>
        <strong>Closing turn</strong>
        <p>
          Turn {last.turn} saw {last.cardsPlayed} cards played, {last.gigsChanged}{" "}
          {last.gigsChanged === 1 ? "gig" : "gigs"} moved, and {last.attacks} attacks across both
          runners.
          {winner
            ? ` ${getPlayerName(winner)} closed at ${winner.final.gigs} gigs and ${winner.final.streetCred} Street Cred.`
            : ""}
        </p>
      </span>
    </section>
  );
}

interface HighlightChip {
  id: string;
  label: string;
  value: string;
}

/**
 * Rules-derived story beats: biggest single steal (rule 9.23), turns with the
 * seven-gig win already on the board (rules 1.10 + 8.6.1), fight record
 * (rules 9.16-9.19), deck-out proximity (rule 1.14), eddie discipline, and
 * mulligans. Chips render only when the saved payload carries the signal.
 */
function MatchHighlights({ sides }: { sides: SideAssignment }) {
  const chips: HighlightChip[] = [];
  const [viewer, opponent] = [sides.viewer, sides.opponent];

  const biggestSteal = Math.max(
    viewer.metrics.biggestSteal ?? 0,
    opponent.metrics.biggestSteal ?? 0,
  );
  if (biggestSteal > 0) {
    const thief =
      (viewer.metrics.biggestSteal ?? 0) >= (opponent.metrics.biggestSteal ?? 0)
        ? viewer
        : opponent;
    chips.push({
      id: "biggest-steal",
      label: "Biggest steal",
      value: `${getPlayerName(thief)} · ${biggestSteal} ${biggestSteal === 1 ? "gig" : "gigs"}`,
    });
  }

  const winThreats = Math.max(
    viewer.metrics.turnsAtSevenGigs ?? 0,
    opponent.metrics.turnsAtSevenGigs ?? 0,
  );
  if (winThreats > 0) {
    const player =
      (viewer.metrics.turnsAtSevenGigs ?? 0) >= (opponent.metrics.turnsAtSevenGigs ?? 0)
        ? viewer
        : opponent;
    chips.push({
      id: "win-threat",
      label: "Win on the board",
      value: `${getPlayerName(player)} · ${winThreats} ${winThreats === 1 ? "turn" : "turns"} at 7 gigs`,
    });
  }

  const fightsWon = Math.max(viewer.counters.fightsWon ?? 0, opponent.counters.fightsWon ?? 0);
  if (fightsWon > 0) {
    const fighter =
      (viewer.counters.fightsWon ?? 0) >= (opponent.counters.fightsWon ?? 0) ? viewer : opponent;
    chips.push({
      id: "fights",
      label: "Fights won",
      value: `${getPlayerName(fighter)} · ${fightsWon}`,
    });
  }

  const lowestDeck = Math.min(
    ...[viewer.metrics.lowestDeckCount, opponent.metrics.lowestDeckCount].filter(
      (count): count is number => typeof count === "number" && count > 0,
    ),
  );
  if (Number.isFinite(lowestDeck) && lowestDeck <= 5) {
    const player = viewer.metrics.lowestDeckCount === lowestDeck ? viewer : opponent;
    chips.push({
      id: "deck-pressure",
      label: "Closest to decking out",
      value: `${getPlayerName(player)} · ${lowestDeck} ${lowestDeck === 1 ? "card" : "cards"} left`,
    });
  }

  const floating = Math.max(
    viewer.metrics.eddiesFloating ?? 0,
    opponent.metrics.eddiesFloating ?? 0,
  );
  if (floating > 0) {
    const player =
      (viewer.metrics.eddiesFloating ?? 0) >= (opponent.metrics.eddiesFloating ?? 0)
        ? viewer
        : opponent;
    chips.push({
      id: "eddies-floating",
      label: "Eddies left unspent",
      value: `${getPlayerName(player)} · ${floating}`,
    });
  }

  const mulligans = Math.max(viewer.counters.mulligans ?? 0, opponent.counters.mulligans ?? 0);
  if (mulligans > 0) {
    const player =
      (viewer.counters.mulligans ?? 0) >= (opponent.counters.mulligans ?? 0) ? viewer : opponent;
    chips.push({
      id: "mulligans",
      label: "Mulligans",
      value: `${getPlayerName(player)} · ${mulligans}`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <section className={classes.panel}>
      <div className={classes.panelHeader}>
        <div>
          <h3>Match highlights</h3>
          <p>The moments and margins that defined this game.</p>
        </div>
      </div>
      <div className={classes.highlightsGrid}>
        {chips.map((chip) => (
          <article key={chip.id} className={classes.highlight}>
            <span>{chip.label}</span>
            <strong>{chip.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function DeckMatchup({
  analytics,
  viewerPlayerId,
}: {
  analytics: CyberpunkGameAnalyticsRecord;
  viewerPlayerId?: string;
}) {
  const [deckMatchupOpen, setDeckMatchupOpen] = useState(false);
  return (
    <div className={classes.deckMatchup}>
      <button
        type="button"
        className={classes.deckMatchupToggle}
        aria-expanded={deckMatchupOpen}
        onClick={() => setDeckMatchupOpen((open) => !open)}
      >
        <span>
          <IconCpu size={16} />
          Deck matchup
        </span>
        <strong>{formatDeckMatchupSummary(analytics)}</strong>
        <IconChevronDown size={17} className={deckMatchupOpen ? classes.chevronOpen : undefined} />
      </button>
      {deckMatchupOpen && (
        <div className={classes.deckMatchupGrid}>
          {analytics.players.map((player) => (
            <DeckMatchupPlayer
              key={player.playerId}
              player={player}
              viewerPlayerId={viewerPlayerId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type CardOwnerFilter = "viewer" | "opponent" | "all";

interface CardUsageRow {
  key: string;
  name: string;
  type: string;
  played: number;
  sold: number;
  stolen: number;
  attacks: number;
  abilities: number;
}

function CardsBreakdown({ sides }: { sides: SideAssignment }) {
  const [filter, setFilter] = useState<CardOwnerFilter>("viewer");
  const rows = useMemo(() => {
    const players =
      filter === "viewer"
        ? [sides.viewer]
        : filter === "opponent"
          ? [sides.opponent]
          : [sides.viewer, sides.opponent];
    const entries: Array<CardUsageRow & { score: number }> = [];
    for (const player of players) {
      for (const card of Object.values(player.cardEvents)) {
        const score =
          card.timesPlayed +
          card.timesSold +
          card.timesCalled * 2 +
          card.timesAttackedDirectly * 2 +
          card.gigsStolen * 3 +
          card.timesAbilityActivated;
        if (score <= 0) continue;
        entries.push({
          key: `${player.playerId}:${card.cardPublicId}`,
          name: card.displayName,
          type: card.type,
          played: card.timesPlayed,
          sold: card.timesSold,
          stolen: card.gigsStolen,
          attacks: card.timesAttackedDirectly + card.timesAttackedUnits,
          abilities: card.timesAbilityActivated,
          score,
        });
      }
    }
    return entries.sort((a, b) => b.score - a.score);
  }, [sides, filter]);

  const filterLabels: Record<CardOwnerFilter, string> = {
    viewer: sides.viewerLabel,
    opponent: sides.opponentLabel,
    all: "Both",
  };

  return (
    <section className={classes.panel}>
      <div className={classes.panelHeader}>
        <div>
          <h3>Cards that shaped the game</h3>
          <p>Ranked by recorded impact on the board.</p>
        </div>
        <div className={classes.cardFilter} role="group" aria-label="Card owner">
          {(["viewer", "opponent", "all"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
            >
              {filterLabels[option]}
            </button>
          ))}
        </div>
      </div>
      {rows.length === 0 ? (
        <div className={classes.emptyState}>No standout card activity was recorded.</div>
      ) : (
        <div className={classes.tableScroll}>
          <table className={classes.cardsTable}>
            <thead>
              <tr>
                <th scope="col">Card</th>
                <th scope="col">Type</th>
                <th scope="col">Played</th>
                <th scope="col">Sold</th>
                <th scope="col">Stolen</th>
                <th scope="col">Attacks</th>
                <th scope="col">Abilities</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row">{row.name}</th>
                  <td>
                    <span className={classes.cardType} data-type={row.type}>
                      {row.type}
                    </span>
                  </td>
                  <td>{row.played}</td>
                  <td>{row.sold}</td>
                  <td>{row.stolen}</td>
                  <td>{row.attacks}</td>
                  <td>{row.abilities}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function DeckMatchupPlayer({
  player,
  viewerPlayerId,
}: {
  player: CyberpunkPlayerAnalytics;
  viewerPlayerId?: string;
}) {
  const legends = getLegendSummaries(player);
  return (
    <article className={classes.deckMatchupPlayer}>
      <div className={classes.deckMatchupPlayerHeader}>
        <span>{getPlayerPerspectiveLabel(player, viewerPlayerId)}</span>
        <div className={classes.colorSymbols} aria-label={player.deckColors.join(", ")}>
          {player.deckColors.map((color) => (
            <i key={color} data-color={color} />
          ))}
        </div>
      </div>
      <h3>{getPlayerName(player)}</h3>
      <div className={classes.deckStats}>
        <Metric label="RAM" value={getTotalRam(player)} />
        <Metric label="Legends" value={legends.length} />
        <Metric label="Final" value={`${player.final.gigs}G / ${player.final.streetCred}SC`} />
      </div>
      <div className={classes.legendList}>
        {legends.length > 0 ? (
          legends.map((legend) => (
            <span key={legend.name}>
              {legend.name}
              {legend.ram !== null ? ` · ${legend.ram} RAM` : ""}
            </span>
          ))
        ) : (
          <span>No legends recorded</span>
        )}
      </div>
      <p className={classes.finalLine}>
        {player.final.gigs} gigs, {player.final.streetCred} Street Cred, {player.final.eddies}{" "}
        eddies
      </p>
    </article>
  );
}

function TurnsBreakdown({
  analytics,
  sides,
  envelope,
}: {
  analytics: CyberpunkGameAnalyticsRecord | undefined;
  sides: SideAssignment | null;
  envelope: CyberpunkAnalyticsEnvelope | null;
}) {
  if (!analytics || !sides) {
    return <AnalyticsStatus envelope={envelope} loading={false} error={null} />;
  }

  const turnSet = new Set<number>();
  for (const turn of sides.viewer.perTurn) turnSet.add(turn.turn);
  for (const turn of sides.opponent.perTurn) turnSet.add(turn.turn);
  const turnNumbers = [...turnSet].sort((a, b) => a - b);
  const viewerByTurn = new Map(sides.viewer.perTurn.map((turn) => [turn.turn, turn]));
  const opponentByTurn = new Map(sides.opponent.perTurn.map((turn) => [turn.turn, turn]));
  const sideColumns: Array<{ label: string; kind: "viewer" | "opponent" }> = [
    { label: sides.viewerLabel, kind: "viewer" },
    { label: sides.opponentLabel, kind: "opponent" },
  ];
  const valueFor = (
    kind: "viewer" | "opponent",
    turn: number,
    field: "cards" | "gained" | "stolen",
  ) => {
    const entry = (kind === "viewer" ? viewerByTurn : opponentByTurn).get(turn);
    if (!entry) return "—";
    if (field === "cards") return entry.cardsPlayedThisTurn;
    if (field === "gained") return entry.gigsGainedThisTurn;
    return entry.gigsStolenThisTurn;
  };
  const attacksFor = (kind: "viewer" | "opponent", turn: number) => {
    const entry = (kind === "viewer" ? viewerByTurn : opponentByTurn).get(turn);
    if (!entry) return "—";
    return entry.directAttacksThisTurn + entry.unitAttacksThisTurn;
  };
  const eddiesFor = (kind: "viewer" | "opponent", turn: number) => {
    const entry = (kind === "viewer" ? viewerByTurn : opponentByTurn).get(turn);
    if (!entry || entry.eddies === undefined) return "—";
    return entry.eddies;
  };
  const eddiesTracked =
    sides.viewer.perTurn.some((turn) => turn.eddies !== undefined) ||
    sides.opponent.perTurn.some((turn) => turn.eddies !== undefined);

  return (
    <section className={classes.panel}>
      <div className={classes.panelHeader}>
        <div>
          <h3>Turn breakdown</h3>
          <p>
            {analytics.summary.totalMoves} moves recorded across {analytics.summary.totalTurns}{" "}
            turns.
          </p>
        </div>
      </div>
      <div className={classes.tableScroll}>
        <table className={classes.turnsTable}>
          <thead>
            <tr>
              <th scope="col" rowSpan={2}>
                Turn
              </th>
              <th scope="colgroup" colSpan={2}>
                Cards played
              </th>
              <th scope="colgroup" colSpan={2}>
                Gigs gained
              </th>
              <th scope="colgroup" colSpan={2}>
                Gigs stolen
              </th>
              <th scope="colgroup" colSpan={2}>
                Attacks
              </th>
              {eddiesTracked ? (
                <th scope="colgroup" colSpan={2}>
                  Eddies left
                </th>
              ) : null}
              <th scope="col" rowSpan={2}>
                Duration
              </th>
            </tr>
            <tr>
              {sideColumns.map((side) => (
                <th key={`cards-${side.kind}`} scope="col" className={classes.turnsSideCol}>
                  {side.label}
                </th>
              ))}
              {sideColumns.map((side) => (
                <th key={`gained-${side.kind}`} scope="col" className={classes.turnsSideCol}>
                  {side.label}
                </th>
              ))}
              {sideColumns.map((side) => (
                <th key={`stolen-${side.kind}`} scope="col" className={classes.turnsSideCol}>
                  {side.label}
                </th>
              ))}
              {sideColumns.map((side) => (
                <th key={`attacks-${side.kind}`} scope="col" className={classes.turnsSideCol}>
                  {side.label}
                </th>
              ))}
              {eddiesTracked
                ? sideColumns.map((side) => (
                    <th key={`eddies-${side.kind}`} scope="col" className={classes.turnsSideCol}>
                      {side.label}
                    </th>
                  ))
                : null}
            </tr>
          </thead>
          <tbody>
            {turnNumbers.map((turn) => {
              const viewerEntry = viewerByTurn.get(turn);
              const opponentEntry = opponentByTurn.get(turn);
              const durationMs = Math.max(
                viewerEntry?.durationMs ?? 0,
                opponentEntry?.durationMs ?? 0,
              );
              return (
                <tr key={turn}>
                  <th scope="row">{turn}</th>
                  <td>{valueFor("viewer", turn, "cards")}</td>
                  <td>{valueFor("opponent", turn, "cards")}</td>
                  <td>{valueFor("viewer", turn, "gained")}</td>
                  <td>{valueFor("opponent", turn, "gained")}</td>
                  <td>{valueFor("viewer", turn, "stolen")}</td>
                  <td>{valueFor("opponent", turn, "stolen")}</td>
                  <td>{attacksFor("viewer", turn)}</td>
                  <td>{attacksFor("opponent", turn)}</td>
                  {eddiesTracked ? (
                    <>
                      <td>{eddiesFor("viewer", turn)}</td>
                      <td>{eddiesFor("opponent", turn)}</td>
                    </>
                  ) : null}
                  <td>{durationMs > 0 ? formatDuration(durationMs) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AnalyticsStatus({
  envelope,
  loading,
  error,
}: {
  envelope: CyberpunkAnalyticsEnvelope | null;
  loading: boolean;
  error: string | null;
}) {
  // "skipped" is terminal: the server will never produce analytics for this
  // game (e.g. replay data was unavailable), so show it as unavailable
  // instead of spinning on a job that has already ended.
  const unavailable =
    envelope?.status === "failed" || envelope?.status === "skipped" || Boolean(error);
  const message =
    envelope?.status === "skipped"
      ? "Analytics were not generated for this game."
      : (envelope?.errorMessage ?? error ?? "The analytics job failed.");
  return (
    <section className={classes.panel}>
      <div className={unavailable ? classes.failureState : classes.loadingState}>
        {unavailable ? (
          <IconAlertTriangle size={22} />
        ) : (
          <IconLoader2 size={22} className={classes.spin} />
        )}
        <div>
          <h3>{unavailable ? "Analytics unavailable" : "Loading match analytics"}</h3>
          <p>
            {unavailable
              ? message
              : loading
                ? "Generating the saved Cyberpunk analytics payload for this match."
                : "Waiting for analytics processing to finish."}
          </p>
        </div>
      </div>
    </section>
  );
}

function ParticipantCard({
  player,
  sideLabel,
  isWinner,
}: {
  player: CyberpunkPlayerAnalytics;
  sideLabel: string;
  isWinner: boolean;
}) {
  return (
    <article className={classes.participant} data-winner={isWinner || undefined}>
      <header className={classes.participantHeader}>
        <span>{sideLabel}</span>
        {isWinner ? <IconTrophy size={15} aria-label="Winner" /> : null}
      </header>
      <h3 className={classes.participantName}>{getPlayerName(player)}</h3>
      <p className={classes.participantScore}>
        <strong>{player.final.gigs}</strong> gigs
        <span aria-hidden="true"> · </span>
        <strong>{player.final.streetCred}</strong> Street Cred
      </p>
      {player.deckColors.length > 0 ? (
        <div className={classes.colorSymbols} aria-label={player.deckColors.join(", ")}>
          {player.deckColors.map((color) => (
            <i key={color} data-color={color} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={classes.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function resolveViewerPlayerId(playerIds: unknown, humanSide: "player" | "opponent"): string {
  if (Array.isArray(playerIds)) {
    const index = humanSide === "player" ? 0 : 1;
    const playerId = playerIds[index];
    if (typeof playerId === "string" && playerId.length > 0) {
      return playerId;
    }
  }
  return PLAYER_SIDE_TO_ID[humanSide];
}

function formatDeckMatchupSummary(analytics: CyberpunkGameAnalyticsRecord): string {
  const [first, second] = analytics.players;
  return `${getPlayerName(first)} vs ${getPlayerName(second)} · ${getTotalRam(
    first,
  )}/${getTotalRam(second)} RAM · ${getLegendSummaries(first).length}/${
    getLegendSummaries(second).length
  } legends`;
}

function getPlayerPerspectiveLabel(
  player: CyberpunkPlayerAnalytics,
  viewerPlayerId: string | undefined,
): string {
  if (viewerPlayerId) {
    return player.playerId === viewerPlayerId ? "You" : "Opponent";
  }
  return `Player ${player.seat}`;
}

function getPlayerName(player: CyberpunkPlayerAnalytics): string {
  return player.displayName ?? player.username ?? `Player ${player.seat}`;
}

function getTotalRam(player: CyberpunkPlayerAnalytics): number {
  return Object.values(player.cardEvents).reduce((sum, card) => {
    const ram = typeof card.ram === "number" ? card.ram : 0;
    return sum + ram * card.copiesInDeck;
  }, 0);
}

function getLegendSummaries(
  player: CyberpunkPlayerAnalytics,
): Array<{ name: string; ram: number | null; color: string | null }> {
  return Object.values(player.cardEvents)
    .filter((card) => card.type === "legend")
    .map((card) => ({
      name: card.displayName,
      ram: card.ram,
      color: card.color,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getAnalyticsTiming(analytics: CyberpunkGameAnalyticsRecord): {
  totalDurationMs: number;
  totalThinkingMs: number;
} {
  const totalThinkingMs = analytics.players.reduce(
    (sum, player) => sum + getPlayerTiming(player).totalThinkingMs,
    0,
  );
  return {
    totalDurationMs: firstPositiveNumber(
      analytics.summary.durationMs,
      durationFromIsoRange(analytics.summary.createdAt, analytics.summary.completedAt),
      totalThinkingMs,
    ),
    totalThinkingMs,
  };
}

function getPlayerTiming(player: CyberpunkPlayerAnalytics): {
  totalThinkingMs: number;
  avgThinkingMs: number;
  ownTurns: number;
} {
  const ownTurnDurations = player.perTurn
    .map((turn) => turn.durationMs)
    .filter((duration) => Number.isFinite(duration) && duration > 0);
  const totalThinkingMs = ownTurnDurations.reduce((sum, duration) => sum + duration, 0);
  const ownTurns = player.perTurn.length;
  return {
    totalThinkingMs,
    avgThinkingMs: ownTurns > 0 ? totalThinkingMs / ownTurns : 0,
    ownTurns,
  };
}

function firstPositiveNumber(...values: Array<number | undefined>): number {
  return (
    values.find(
      (value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0,
    ) ?? 0
  );
}

function durationFromIsoRange(start: string | undefined, end: string | undefined): number {
  if (!start || !end) return 0;
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  return Number.isFinite(startMs) && Number.isFinite(endMs) ? Math.max(0, endMs - startMs) : 0;
}

function mergeTurnRows(analytics: CyberpunkGameAnalyticsRecord) {
  const byTurn = new Map<
    number,
    { turn: number; cardsPlayed: number; gigsChanged: number; attacks: number; durationMs: number }
  >();
  for (const player of analytics.players) {
    for (const turn of player.perTurn) {
      const existing = byTurn.get(turn.turn) ?? {
        turn: turn.turn,
        cardsPlayed: 0,
        gigsChanged: 0,
        attacks: 0,
        durationMs: 0,
      };
      existing.cardsPlayed += turn.cardsPlayedThisTurn;
      existing.gigsChanged += turn.gigsGainedThisTurn + turn.gigsStolenThisTurn;
      existing.attacks += turn.directAttacksThisTurn + turn.unitAttacksThisTurn;
      existing.durationMs = Math.max(existing.durationMs, turn.durationMs);
      byTurn.set(turn.turn, existing);
    }
  }
  return [...byTurn.values()].sort((a, b) => a.turn - b.turn);
}

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
}

const ILLUSTRATIVE_FIXTURE_ANALYTICS: CyberpunkGameAnalyticsRecord = {
  version: 1,
  gameSlug: "cyberpunk",
  gameId: "fixture-endgame-preview",
  matchId: "fixture-endgame-preview",
  dimensions: {
    matchType: "fixture",
    format: "best_of_1",
    authority: "server",
    gameNumber: 1,
  },
  summary: {
    winnerId: "fixture-player-1",
    endReason: "gig_victory",
    totalTurns: 9,
    totalMoves: 87,
    durationMs: 26 * 60_000,
    createdAt: "2026-09-18T10:00:00Z",
    completedAt: "2026-09-18T10:26:00Z",
    onThePlay: "fixture-player-1",
    finalGigs: { player1: 7, player2: 5 },
    finalStreetCred: { player1: 31, player2: 24 },
    finalEddies: { player1: 3, player2: 0 },
    finalDeckCount: { player1: 24, player2: 27 },
  },
  players: [
    {
      playerId: "fixture-player-1",
      displayName: "Fixture Runner",
      username: null,
      seat: 1,
      onThePlay: true,
      deckColors: ["yellow", "green"],
      deckCardIds: [],
      final: {
        gigs: 7,
        streetCred: 31,
        eddies: 3,
        spentEddies: 18,
        deckCount: 24,
        handCount: 4,
        fieldCount: 5,
        legendCount: 1,
        trashCount: 9,
      },
      counters: {
        cardsPlayed: 31,
        unitsPlayed: 14,
        gearPlayed: 5,
        programsPlayed: 9,
        cardsSold: 6,
        legendsCalled: 3,
        gigsGained: 11,
        gigsStolen: 4,
        directAttacks: 7,
        unitAttacks: 12,
        blockersUsed: 6,
        abilitiesActivated: 14,
        effectsResolved: 22,
        phasesPassed: 34,
        turnsEnded: 9,
        fightsWon: 4,
        unitsLost: 1,
        mulligans: 0,
        conceded: false,
      },
      metrics: {
        avgCardsPlayedPerTurn: 3.4,
        avgGigsGainedPerTurn: 1.2,
        avgTurnDurationMs: 41_000,
        firstPlayTurn: 1,
        firstGigTurn: 2,
        firstDirectAttackTurn: 3,
        firstStolenGigTurn: 5,
        firstLegendCallTurn: 6,
        biggestSteal: 2,
        stealEvents: 3,
        eddiesFloating: 9,
        lowestDeckCount: 24,
        turnsAtSevenGigs: 1,
      },
      cardEvents: {
        f1: {
          cardPublicId: "f1",
          displayName: "Street Samurai",
          type: "unit",
          color: "red",
          cost: 3,
          power: 5,
          ram: null,
          copiesInDeck: 3,
          timesPlayed: 3,
          timesSold: 0,
          timesCalled: 0,
          timesAttackedUnits: 4,
          timesAttackedDirectly: 3,
          timesDefended: 2,
          timesBlocked: 1,
          timesAbilityActivated: 2,
          gigsStolen: 2,
        },
        f2: {
          cardPublicId: "f2",
          displayName: "Chrome Deck Mk IV",
          type: "program",
          color: "blue",
          cost: 2,
          power: null,
          ram: 2,
          copiesInDeck: 2,
          timesPlayed: 2,
          timesSold: 1,
          timesCalled: 0,
          timesAttackedUnits: 0,
          timesAttackedDirectly: 0,
          timesDefended: 0,
          timesBlocked: 0,
          timesAbilityActivated: 6,
          gigsStolen: 0,
        },
        f3: {
          cardPublicId: "f3",
          displayName: "Rogue Netrunner",
          type: "unit",
          color: "green",
          cost: 4,
          power: 4,
          ram: 1,
          copiesInDeck: 2,
          timesPlayed: 2,
          timesSold: 0,
          timesCalled: 0,
          timesAttackedUnits: 1,
          timesAttackedDirectly: 2,
          timesDefended: 0,
          timesBlocked: 0,
          timesAbilityActivated: 1,
          gigsStolen: 2,
        },
        f4: {
          cardPublicId: "f4",
          displayName: "Subliminal Radiance",
          type: "legend",
          color: "yellow",
          cost: 6,
          power: 7,
          ram: 2,
          copiesInDeck: 1,
          timesPlayed: 1,
          timesSold: 0,
          timesCalled: 3,
          timesAttackedUnits: 0,
          timesAttackedDirectly: 0,
          timesDefended: 0,
          timesBlocked: 0,
          timesAbilityActivated: 3,
          gigsStolen: 0,
        },
      },
      perTurn: [
        {
          turn: 1,
          cardsPlayedThisTurn: 2,
          cardsSoldThisTurn: 0,
          legendCallsThisTurn: 0,
          gigsGainedThisTurn: 0,
          gigsStolenThisTurn: 0,
          directAttacksThisTurn: 0,
          unitAttacksThisTurn: 0,
          blockersUsedThisTurn: 0,
          abilitiesActivatedThisTurn: 1,
          effectsResolvedThisTurn: 1,
          runningGigs: 0,
          runningStreetCred: 0,
          durationMs: 38_000,
          eddies: 3,
          eddiesSpentThisTurn: 0,
          handCount: 6,
          deckCount: 34,
          fieldCount: 2,
          readyUnitCount: 2,
          spentUnitCount: 0,
        },
        {
          turn: 3,
          cardsPlayedThisTurn: 3,
          cardsSoldThisTurn: 1,
          legendCallsThisTurn: 0,
          gigsGainedThisTurn: 1,
          gigsStolenThisTurn: 0,
          directAttacksThisTurn: 1,
          unitAttacksThisTurn: 1,
          blockersUsedThisTurn: 0,
          abilitiesActivatedThisTurn: 2,
          effectsResolvedThisTurn: 3,
          runningGigs: 1,
          runningStreetCred: 4,
          durationMs: 52_000,
          eddies: 0,
          eddiesSpentThisTurn: 5,
          handCount: 5,
          deckCount: 31,
          fieldCount: 3,
          readyUnitCount: 2,
          spentUnitCount: 1,
        },
        {
          turn: 5,
          cardsPlayedThisTurn: 4,
          cardsSoldThisTurn: 1,
          legendCallsThisTurn: 0,
          gigsGainedThisTurn: 2,
          gigsStolenThisTurn: 2,
          directAttacksThisTurn: 2,
          unitAttacksThisTurn: 3,
          blockersUsedThisTurn: 1,
          abilitiesActivatedThisTurn: 3,
          effectsResolvedThisTurn: 5,
          runningGigs: 5,
          runningStreetCred: 17,
          durationMs: 61_000,
          eddies: 2,
          eddiesSpentThisTurn: 6,
          handCount: 4,
          deckCount: 28,
          fieldCount: 5,
          readyUnitCount: 3,
          spentUnitCount: 2,
        },
        {
          turn: 7,
          cardsPlayedThisTurn: 3,
          cardsSoldThisTurn: 0,
          legendCallsThisTurn: 1,
          gigsGainedThisTurn: 1,
          gigsStolenThisTurn: 0,
          directAttacksThisTurn: 1,
          unitAttacksThisTurn: 2,
          blockersUsedThisTurn: 2,
          abilitiesActivatedThisTurn: 4,
          effectsResolvedThisTurn: 6,
          runningGigs: 6,
          runningStreetCred: 24,
          durationMs: 44_000,
          eddies: 1,
          eddiesSpentThisTurn: 4,
          handCount: 5,
          deckCount: 26,
          fieldCount: 4,
          readyUnitCount: 2,
          spentUnitCount: 2,
        },
        {
          turn: 9,
          cardsPlayedThisTurn: 4,
          cardsSoldThisTurn: 0,
          legendCallsThisTurn: 0,
          gigsGainedThisTurn: 1,
          gigsStolenThisTurn: 0,
          directAttacksThisTurn: 2,
          unitAttacksThisTurn: 3,
          blockersUsedThisTurn: 1,
          abilitiesActivatedThisTurn: 2,
          effectsResolvedThisTurn: 4,
          runningGigs: 7,
          runningStreetCred: 31,
          durationMs: 39_000,
          eddies: 3,
          eddiesSpentThisTurn: 3,
          handCount: 4,
          deckCount: 24,
          fieldCount: 5,
          readyUnitCount: 3,
          spentUnitCount: 2,
        },
      ],
    },
    {
      playerId: "fixture-player-2",
      displayName: "Fixture Rival",
      username: null,
      seat: 2,
      onThePlay: false,
      deckColors: ["blue"],
      deckCardIds: [],
      final: {
        gigs: 5,
        streetCred: 24,
        eddies: 0,
        spentEddies: 15,
        deckCount: 27,
        handCount: 3,
        fieldCount: 4,
        legendCount: 1,
        trashCount: 11,
      },
      counters: {
        cardsPlayed: 26,
        unitsPlayed: 12,
        gearPlayed: 3,
        programsPlayed: 8,
        cardsSold: 5,
        legendsCalled: 2,
        gigsGained: 9,
        gigsStolen: 1,
        directAttacks: 5,
        unitAttacks: 9,
        blockersUsed: 9,
        abilitiesActivated: 10,
        effectsResolved: 18,
        phasesPassed: 30,
        turnsEnded: 8,
        fightsWon: 1,
        unitsLost: 4,
        mulligans: 1,
        conceded: false,
      },
      metrics: {
        avgCardsPlayedPerTurn: 3.1,
        avgGigsGainedPerTurn: 1.1,
        avgTurnDurationMs: 47_000,
        firstPlayTurn: 2,
        firstGigTurn: 2,
        firstDirectAttackTurn: 4,
        firstStolenGigTurn: null,
        firstLegendCallTurn: 8,
        biggestSteal: 1,
        stealEvents: 1,
        eddiesFloating: 14,
        lowestDeckCount: 4,
        turnsAtSevenGigs: 0,
      },
      cardEvents: {
        r1: {
          cardPublicId: "r1",
          displayName: "Ncpd Patrol Cruiser",
          type: "unit",
          color: "blue",
          cost: 4,
          power: 6,
          ram: null,
          copiesInDeck: 2,
          timesPlayed: 2,
          timesSold: 0,
          timesCalled: 0,
          timesAttackedUnits: 3,
          timesAttackedDirectly: 2,
          timesDefended: 1,
          timesBlocked: 2,
          timesAbilityActivated: 1,
          gigsStolen: 1,
        },
        r2: {
          cardPublicId: "r2",
          displayName: "Militech Ops Contract",
          type: "gear",
          color: "red",
          cost: 1,
          power: 2,
          ram: null,
          copiesInDeck: 3,
          timesPlayed: 3,
          timesSold: 0,
          timesCalled: 0,
          timesAttackedUnits: 0,
          timesAttackedDirectly: 0,
          timesDefended: 3,
          timesBlocked: 0,
          timesAbilityActivated: 0,
          gigsStolen: 0,
        },
      },
      perTurn: [
        {
          turn: 2,
          cardsPlayedThisTurn: 2,
          cardsSoldThisTurn: 0,
          legendCallsThisTurn: 0,
          gigsGainedThisTurn: 1,
          gigsStolenThisTurn: 0,
          directAttacksThisTurn: 0,
          unitAttacksThisTurn: 0,
          blockersUsedThisTurn: 0,
          abilitiesActivatedThisTurn: 0,
          effectsResolvedThisTurn: 1,
          runningGigs: 1,
          runningStreetCred: 3,
          durationMs: 55_000,
          eddies: 4,
          eddiesSpentThisTurn: 0,
          handCount: 5,
          deckCount: 30,
          fieldCount: 2,
          readyUnitCount: 2,
          spentUnitCount: 0,
        },
        {
          turn: 4,
          cardsPlayedThisTurn: 3,
          cardsSoldThisTurn: 1,
          legendCallsThisTurn: 0,
          gigsGainedThisTurn: 2,
          gigsStolenThisTurn: 0,
          directAttacksThisTurn: 1,
          unitAttacksThisTurn: 2,
          blockersUsedThisTurn: 2,
          abilitiesActivatedThisTurn: 1,
          effectsResolvedThisTurn: 3,
          runningGigs: 3,
          runningStreetCred: 10,
          durationMs: 67_000,
          eddies: 0,
          eddiesSpentThisTurn: 6,
          handCount: 4,
          deckCount: 18,
          fieldCount: 3,
          readyUnitCount: 2,
          spentUnitCount: 1,
        },
        {
          turn: 6,
          cardsPlayedThisTurn: 3,
          cardsSoldThisTurn: 0,
          legendCallsThisTurn: 0,
          gigsGainedThisTurn: 2,
          gigsStolenThisTurn: 1,
          directAttacksThisTurn: 2,
          unitAttacksThisTurn: 2,
          blockersUsedThisTurn: 3,
          abilitiesActivatedThisTurn: 2,
          effectsResolvedThisTurn: 4,
          runningGigs: 5,
          runningStreetCred: 18,
          durationMs: 49_000,
          eddies: 5,
          eddiesSpentThisTurn: 2,
          handCount: 6,
          deckCount: 9,
          fieldCount: 4,
          readyUnitCount: 2,
          spentUnitCount: 2,
        },
        {
          turn: 8,
          cardsPlayedThisTurn: 2,
          cardsSoldThisTurn: 0,
          legendCallsThisTurn: 1,
          gigsGainedThisTurn: 1,
          gigsStolenThisTurn: 0,
          directAttacksThisTurn: 0,
          unitAttacksThisTurn: 1,
          blockersUsedThisTurn: 2,
          abilitiesActivatedThisTurn: 1,
          effectsResolvedThisTurn: 2,
          runningGigs: 5,
          runningStreetCred: 24,
          durationMs: 41_000,
          eddies: 5,
          eddiesSpentThisTurn: 4,
          handCount: 3,
          deckCount: 4,
          fieldCount: 4,
          readyUnitCount: 1,
          spentUnitCount: 3,
        },
      ],
    },
  ],
};

/**
 * Visual fixture for the post-game modal (`/tests/endgame-preview`). Renders
 * the exact production sections over an explicitly illustrative analytics
 * payload so layout and data density can be inspected without playing a
 * hosted match. All names and numbers are synthetic.
 */
export function EndGameModalFixture() {
  const analytics = ILLUSTRATIVE_FIXTURE_ANALYTICS;
  const sides = resolveSides(analytics, analytics.players[0].playerId);
  const timing = getAnalyticsTiming(analytics);
  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: <IconTrophy size={16} />,
      content: (
        <OverviewSection
          analytics={analytics}
          sides={sides}
          envelope={null}
          loading={false}
          error={null}
          viewerPlayerId={analytics.players[0].playerId}
        />
      ),
    },
    {
      id: "turns",
      label: "Turns",
      icon: <IconChartBar size={16} />,
      content: <TurnsBreakdown analytics={analytics} sides={sides} envelope={null} />,
    },
    {
      id: "notes",
      label: "Notes",
      icon: <IconNotebook size={16} />,
      content: (
        <section className={classes.panel}>
          <div className={classes.emptyState}>
            Fixture preview — notes render here on real matches.
          </div>
        </section>
      ),
    },
  ];
  return (
    <PostGameModal
      open
      outcome="win"
      reason={describeReason("gig_victory", "win")}
      participants={{
        left: (
          <ParticipantCard
            player={sides.viewer}
            sideLabel={sides.viewerLabel}
            isWinner={analytics.summary.winnerId === sides.viewer.playerId}
          />
        ),
        right: (
          <ParticipantCard
            player={sides.opponent}
            sideLabel={sides.opponentLabel}
            isWinner={analytics.summary.winnerId === sides.opponent.playerId}
          />
        ),
      }}
      meta={
        <>
          <span>{bestOfLabelForFixture(analytics)}</span>
          <span>Game 1</span>
          <span>Series 1–0</span>
          <span>Turn {analytics.summary.totalTurns}</span>
          <span>{formatDuration(timing.totalDurationMs)}</span>
        </>
      }
      sections={sections}
      actions={
        <span className={classes.mutedText}>Visual fixture — all numbers are illustrative.</span>
      }
      testId="end-game-modal-fixture"
      dataEndReason="gig_victory"
      dataPostGameSurface="fixture-preview"
    />
  );
}

function bestOfLabelForFixture(analytics: CyberpunkGameAnalyticsRecord): string {
  return analytics.dimensions.format === "best_of_3" ? "Best of 3" : "Best of 1";
}
