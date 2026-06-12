import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  IconMinus,
  IconNotebook,
  IconRefresh,
  IconTrophy,
  IconX,
} from "@tabler/icons-react";
import confetti from "canvas-confetti";
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
import { downloadReplayZip } from "../../replay/downloadReplay";
import { decompressReplayBlob, fetchReplayBlob } from "../../replay/fetchReplay";
import {
  ReplayStorageQuotaError,
  isReplaySaved,
  isReplayStoreAvailable,
  saveReplayFromApi,
} from "../../replay/replayStore";
import {
  closePostGameModal,
  createInitialPostGameModalState,
  openPostGameModal,
  syncPostGameModalState,
} from "./postGameModalState";
import classes from "./EndGameModal.module.css";

const PLATFORM_MATCHMAKING_URL = "https://tcg.online/cyberpunk/matchmaking";

const neutralReasons: Readonly<Record<string, string>> = {
  gig_victory: "Gig victory: first to 6 gigs",
  overtime_majority: "Overtime: Street Cred majority",
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

type SectionId = "analytics" | "turns" | "notes";
type SupportDialog = "bug" | "feedback" | null;

const WIN_CONFETTI_COLORS = ["#f5e642", "#66e8ff", "#ff7e76", "#ffffff"];

function fireWinConfetti(): () => void {
  const end = Date.now() + 3 * 1000;
  let frameId: number | null = null;

  const frame = () => {
    if (Date.now() > end) return;

    void confetti({
      angle: 60,
      colors: WIN_CONFETTI_COLORS,
      disableForReducedMotion: true,
      origin: { x: 0, y: 0.5 },
      particleCount: 2,
      spread: 55,
      startVelocity: 60,
      zIndex: 9001,
    });
    void confetti({
      angle: 120,
      colors: WIN_CONFETTI_COLORS,
      disableForReducedMotion: true,
      origin: { x: 1, y: 0.5 },
      particleCount: 2,
      spread: 55,
      startVelocity: 60,
      zIndex: 9001,
    });

    frameId = window.requestAnimationFrame(frame);
  };

  frame();

  return () => {
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }
    confetti.reset();
  };
}

function describeReason(reason: string | null, outcome: "win" | "loss" | "draw"): string {
  if (!reason) return "Match complete.";
  const perspective = reasonsByOutcome[reason]?.[outcome];
  if (perspective) return perspective;
  return neutralReasons[reason] ?? reason.replace(/_/g, " ");
}

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
  const [activeSection, setActiveSection] = useState<SectionId>("analytics");
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
  const [celebratedFinishedGameKey, setCelebratedFinishedGameKey] = useState<string | null>(null);
  const isDeckBuilderPractice = postGameSurface === "deck-builder-practice";
  const canUseReplayStore = isReplayStoreAvailable();
  const canUseReplayActions = !isDeckBuilderPractice && Boolean(postGameContext?.gameId);

  const outcome: "win" | "loss" | "draw" =
    winnerSide === null ? "draw" : winnerSide === humanSide ? "win" : "loss";
  const headline =
    outcome === "win" ? "You win" : outcome === "loss" ? "Rival wins" : "Match ended";
  const finishedGameKey = gameEnded
    ? `${postGameContext?.gameId ?? "local"}:${matchState.ctx.stateID}:${winnerSide ?? "draw"}`
    : null;

  useEffect(() => {
    setModalState((current) => syncPostGameModalState(current, finishedGameKey));
  }, [finishedGameKey]);

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

    isReplaySaved(gameId)
      .then((saved) => {
        if (!cancelled) {
          setReplaySaved(saved);
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
  const topCards = useMemo(() => topCardsByImpact(analytics), [analytics]);
  const viewerPlayerId = resolveViewerPlayerId(matchState.ctx.playerIds, humanSide);

  useEffect(() => {
    if (outcome !== "win" || !finishedGameKey || celebratedFinishedGameKey === finishedGameKey) {
      return;
    }

    setCelebratedFinishedGameKey(finishedGameKey);
    return fireWinConfetti();
  }, [celebratedFinishedGameKey, finishedGameKey, outcome]);

  if (!gameEnded) return null;

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
      await downloadReplayZip(postGameContext.gameId, analytics);
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
      await saveReplayFromApi(
        postGameContext.gameId,
        fetchReplayBlob,
        decompressReplayBlob,
        viewerPlayerId,
      );
      setReplaySaved(true);
      setReplayStatus("Replay saved.");
    } catch (error) {
      console.error("[CyberpunkPostGame] Failed to save replay:", error);
      setReplayStatus(
        error instanceof ReplayStorageQuotaError
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

  return (
    <div
      className={classes.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Match ended"
      data-testid="end-game-modal"
      data-outcome={outcome}
      data-end-reason={winReason ?? undefined}
      data-remote={isRemote ? "true" : "false"}
      data-post-game-surface={postGameSurface}
    >
      <div className={`${classes.card} ${isDeckBuilderPractice ? classes.practiceCard : ""}`}>
        <button
          type="button"
          className={classes.minimizeButton}
          onClick={closeModal}
          aria-label="Minimize post-game summary"
          title="Minimize"
        >
          <IconMinus size={16} />
          <span>Minimize</span>
        </button>

        <header className={classes.header}>
          <p className={classes.eyebrow}>Match ended</p>
          <h2 className={classes.headline} data-testid="end-game-headline">
            {headline}
          </h2>
          <p className={classes.reason} data-testid="end-game-reason">
            {describeReason(winReason, outcome)}
          </p>
          <div className={classes.headerStats}>
            {isDeckBuilderPractice ? (
              <>
                <span>Practice</span>
                <span>Turn {turnNumber}</span>
              </>
            ) : (
              <>
                <span>{bestOfLabel}</span>
                <span>Game {postGameContext?.gameNumber ?? 1}</span>
                {postGameContext?.player1Score !== undefined &&
                  postGameContext.player2Score !== undefined && (
                    <span>
                      Series {postGameContext.player1Score}-{postGameContext.player2Score}
                    </span>
                  )}
              </>
            )}
          </div>
        </header>

        {!isDeckBuilderPractice && (
          <nav className={classes.tabs} aria-label="Post-game sections">
            <TabButton
              active={activeSection === "analytics"}
              icon={<IconTrophy size={16} />}
              label="Analytics"
              onClick={() => setActiveSection("analytics")}
            />
            <TabButton
              active={activeSection === "turns"}
              icon={<IconChartBar size={16} />}
              label="Turns"
              onClick={() => setActiveSection("turns")}
            />
            <TabButton
              active={activeSection === "notes"}
              icon={<IconNotebook size={16} />}
              label="Notes"
              onClick={() => setActiveSection("notes")}
            />
          </nav>
        )}

        <main className={classes.body}>
          {isDeckBuilderPractice && (
            <PracticeSummarySection outcome={outcome} reason={describeReason(winReason, outcome)} />
          )}
          {!isDeckBuilderPractice && activeSection === "analytics" && (
            <AnalyticsSection
              analytics={analytics}
              envelope={analyticsEnvelope}
              loading={recordLoading}
              error={recordError}
              topCards={topCards}
              viewerPlayerId={viewerPlayerId}
            />
          )}
          {!isDeckBuilderPractice && activeSection === "turns" && (
            <TurnsSection analytics={analytics} envelope={analyticsEnvelope} />
          )}
          {!isDeckBuilderPractice && activeSection === "notes" && (
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
          )}
        </main>

        <footer className={classes.footer}>
          <div className={classes.footerSecondary}>
            {canUseReplayActions && (
              <div className={classes.replayActions} aria-label="Replay actions">
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
                    {replaySaved ? "Replay saved" : replaySaving ? "Saving replay" : "Save replay"}
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
        </footer>
      </div>

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
    </div>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${classes.tabButton} ${active ? classes.tabButtonActive : ""}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
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

function AnalyticsSection({
  analytics,
  envelope,
  loading,
  error,
  topCards,
  viewerPlayerId,
}: {
  analytics: CyberpunkGameAnalyticsRecord | undefined;
  envelope: CyberpunkAnalyticsEnvelope | null;
  loading: boolean;
  error: string | null;
  topCards: Array<{ player: string; cardName: string; value: string }>;
  viewerPlayerId?: string;
}) {
  const [deckMatchupOpen, setDeckMatchupOpen] = useState(false);
  if (!analytics) {
    return <AnalyticsStatus envelope={envelope} loading={loading} error={error} />;
  }

  const timing = getAnalyticsTiming(analytics);

  return (
    <section className={classes.panel}>
      <div className={classes.scoreGrid}>
        {analytics.players.map((player) => (
          <PlayerScore key={player.playerId} player={player} analytics={analytics} />
        ))}
      </div>
      <div className={classes.metricGrid}>
        <Metric label="Moves" value={analytics.summary.totalMoves} />
        <Metric label="Turns" value={analytics.summary.totalTurns} />
        <Metric label="Duration" value={formatDuration(timing.totalDurationMs)} />
        <Metric label="End reason" value={formatReason(analytics.summary.endReason)} />
      </div>
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
          <IconChevronDown
            size={17}
            className={deckMatchupOpen ? classes.chevronOpen : undefined}
          />
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
      <div className={classes.panelHeader}>
        <div>
          <h3>Cards that shaped the game</h3>
          <p>Derived from the saved analytics payload.</p>
        </div>
      </div>
      <div className={classes.spotlightList}>
        {topCards.length > 0 ? (
          topCards.map((entry) => (
            <article
              key={`${entry.player}:${entry.cardName}:${entry.value}`}
              className={classes.spotlight}
            >
              <strong>{entry.cardName}</strong>
              <span>{entry.player}</span>
              <em>{entry.value}</em>
            </article>
          ))
        ) : (
          <div className={classes.emptyState}>No standout card activity was recorded.</div>
        )}
      </div>
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
        <span>{getDeckPerspectiveLabel(player, viewerPlayerId)}</span>
        <div className={classes.colorSymbols} aria-label={player.deckColors.join(", ")}>
          {player.deckColors.map((color) => (
            <i key={color} data-color={color} />
          ))}
        </div>
      </div>
      <h3>{player.deckName ?? "Unknown deck"}</h3>
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

function TurnsSection({
  analytics,
  envelope,
}: {
  analytics: CyberpunkGameAnalyticsRecord | undefined;
  envelope: CyberpunkAnalyticsEnvelope | null;
}) {
  if (!analytics) {
    return <AnalyticsStatus envelope={envelope} loading={false} error={null} />;
  }

  const turns = mergeTurnRows(analytics);
  return (
    <section className={classes.panel}>
      <div className={classes.panelHeader}>
        <div>
          <h3>Turn-by-turn pressure</h3>
          <p>Gigs, attacks, blocks, and card velocity by recorded turn.</p>
        </div>
      </div>
      <div className={classes.turnList}>
        {turns.map((turn) => (
          <article key={turn.turn} className={classes.turnRow}>
            <strong>Turn {turn.turn}</strong>
            <span>{turn.cardsPlayed} cards</span>
            <span>{turn.gigsChanged} gigs moved</span>
            <span>{turn.attacks} attacks</span>
            <span>{formatDuration(turn.durationMs)}</span>
          </article>
        ))}
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
  const failed = envelope?.status === "failed" || error;
  return (
    <section className={classes.panel}>
      <div className={failed ? classes.failureState : classes.loadingState}>
        {failed ? (
          <IconAlertTriangle size={22} />
        ) : (
          <IconLoader2 size={22} className={classes.spin} />
        )}
        <div>
          <h3>{failed ? "Analytics unavailable" : "Loading match analytics"}</h3>
          <p>
            {failed
              ? (envelope?.errorMessage ?? error ?? "The analytics job failed.")
              : loading
                ? "Generating the saved Cyberpunk analytics payload for this match."
                : "Waiting for analytics processing to finish."}
          </p>
        </div>
      </div>
    </section>
  );
}

function PlayerScore({
  player,
  analytics,
}: {
  player: CyberpunkPlayerAnalytics;
  analytics: CyberpunkGameAnalyticsRecord;
}) {
  const isWinner = analytics.summary.winnerId === player.playerId;
  const playerTiming = getPlayerTiming(player);
  return (
    <article className={`${classes.scoreCard} ${isWinner ? classes.scoreCardWinner : ""}`}>
      <div className={classes.scoreCardHeader}>
        <span>{player.seat === 1 ? "Runner 1" : "Runner 2"}</span>
        {isWinner && <IconTrophy size={17} />}
      </div>
      <h3>{player.displayName ?? `Player ${player.seat}`}</h3>
      <div className={classes.scoreMetrics}>
        <Metric label="Gigs" value={player.final.gigs} />
        <Metric label="Street Cred" value={player.final.streetCred} />
        <Metric label="Eddies" value={player.final.eddies} />
      </div>
      <div className={classes.thinkingMetrics}>
        <span>
          <strong>{formatDuration(playerTiming.totalThinkingMs)}</strong>
          Thinking
        </span>
        <span>
          <strong>{formatDuration(playerTiming.avgThinkingMs)}</strong>
          Avg / turn
        </span>
        <span>
          <strong>{playerTiming.ownTurns}</strong>
          Own turns
        </span>
      </div>
      <div className={classes.counterLine}>
        <span>{player.counters.cardsPlayed} played</span>
        <span>{player.counters.gigsStolen} stolen</span>
        <span>{player.counters.directAttacks + player.counters.unitAttacks} attacks</span>
      </div>
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

function topCardsByImpact(
  analytics: CyberpunkGameAnalyticsRecord | undefined,
): Array<{ player: string; cardName: string; value: string }> {
  if (!analytics) return [];
  const entries: Array<{ player: string; cardName: string; score: number; value: string }> = [];
  for (const player of analytics.players) {
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
        player: player.displayName ?? `Player ${player.seat}`,
        cardName: card.displayName,
        score,
        value:
          card.gigsStolen > 0
            ? `${card.gigsStolen} gigs stolen`
            : `${card.timesPlayed} plays, ${card.timesSold} sold`,
      });
    }
  }
  return entries
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ player, cardName, value }) => ({ player, cardName, value }));
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
  return `${first.deckName ?? "Unknown deck"} vs ${second.deckName ?? "Unknown deck"} · ${getTotalRam(
    first,
  )}/${getTotalRam(second)} RAM · ${getLegendSummaries(first).length}/${
    getLegendSummaries(second).length
  } legends`;
}

function getDeckPerspectiveLabel(
  player: CyberpunkPlayerAnalytics,
  viewerPlayerId: string | undefined,
): string {
  if (viewerPlayerId) {
    return player.playerId === viewerPlayerId ? "Your deck" : "Opponent deck";
  }
  return `Player ${player.seat}`;
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
  const ownTurns = ownTurnDurations.length;
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

function formatReason(reason: string | undefined): string {
  return reason ? reason.replace(/_/g, " ") : "Complete";
}
