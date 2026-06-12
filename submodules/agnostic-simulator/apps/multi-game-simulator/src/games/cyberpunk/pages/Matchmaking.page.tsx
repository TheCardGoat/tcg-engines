import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IconDownload, IconPlayerPlay, IconTrash, IconUpload } from "@tabler/icons-react";
import {
  AI_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  getStrategyById,
  type StrategyDescriptor,
} from "../engine";
import { downloadReplayZipFromBlob } from "../replay/downloadReplay";
import {
  deleteReplay,
  importReplayArchive,
  isReplayStoreAvailable,
  listSavedReplays,
  loadReplayData,
  ReplayImportError,
  type SavedReplayMeta,
} from "../replay/replayStore";
import classes from "./Practice.module.css";

export function MatchmakingPage() {
  const [botStrategyId, setBotStrategyId] = useState<StrategyDescriptor["id"]>(
    DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  );
  const [savedReplays, setSavedReplays] = useState<SavedReplayMeta[]>([]);
  const [replaysLoading, setReplaysLoading] = useState(true);
  const [replayStoreAvailable, setReplayStoreAvailable] = useState(false);
  const [replayImporting, setReplayImporting] = useState(false);
  const [replayImportError, setReplayImportError] = useState<string | null>(null);
  const strategyDescription = useMemo(
    () => getStrategyById(botStrategyId)?.description ?? "Pick how the AI decides each turn.",
    [botStrategyId],
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const available = isReplayStoreAvailable();
      setReplayStoreAvailable(available);
      if (!available) {
        setReplaysLoading(false);
        return;
      }

      try {
        const replays = await listSavedReplays();
        if (!cancelled) {
          setSavedReplays(replays);
        }
      } catch (error) {
        console.error("[CyberpunkReplays] Failed to load saved replays:", error);
      } finally {
        if (!cancelled) {
          setReplaysLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDownloadReplay(gameId: string): Promise<void> {
    try {
      const blob = await loadReplayData(gameId);
      if (!blob) {
        console.error("[CyberpunkReplays] Replay data not found in IndexedDB");
        setSavedReplays((current) => current.filter((replay) => replay.gameId !== gameId));
        return;
      }
      await downloadReplayZipFromBlob(gameId, blob);
    } catch (error) {
      console.error("[CyberpunkReplays] Failed to download saved replay:", error);
    }
  }

  async function refreshSavedReplays(): Promise<void> {
    setSavedReplays(await listSavedReplays());
  }

  async function handleImportReplay(file: File): Promise<void> {
    if (replayImporting) {
      return;
    }

    setReplayImporting(true);
    setReplayImportError(null);
    try {
      await importReplayArchive(file);
      await refreshSavedReplays();
    } catch (error) {
      setReplayImportError(
        error instanceof ReplayImportError ? error.message : "Failed to import replay.",
      );
    } finally {
      setReplayImporting(false);
    }
  }

  async function handleDeleteReplay(gameId: string): Promise<void> {
    try {
      await deleteReplay(gameId);
      setSavedReplays((current) => current.filter((replay) => replay.gameId !== gameId));
    } catch (error) {
      console.error("[CyberpunkReplays] Failed to delete saved replay:", error);
    }
  }

  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · matchmaking</p>
          <h1 className={classes.title}>Find a game</h1>
          <p className={classes.lead}>
            Practice locally against the AI while ranked queues and private lobbies stay on The Card
            Goat matchmaking surface.
          </p>
        </header>

        <section className={classes.panel} aria-label="Cyberpunk play options">
          <div>
            <p className={classes.eyebrow}>Local play</p>
            <h2 className={classes.sectionTitle}>Practice match</h2>
            <p className={classes.help}>
              Choose fixture decks for both seats, pick a bot strategy, and launch the simulator
              setup flow.
            </p>
          </div>

          <label className={classes.field}>
            <span className={classes.label}>Bot strategy</span>
            <select
              className={classes.select}
              value={botStrategyId}
              onChange={(event) =>
                setBotStrategyId(event.currentTarget.value as StrategyDescriptor["id"])
              }
            >
              {AI_STRATEGIES.map((strategy) => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.label}
                </option>
              ))}
            </select>
          </label>

          <p className={classes.help}>{strategyDescription}</p>

          <Link className={classes.buttonLink} to={`/practice?botStrategyId=${botStrategyId}`}>
            Open practice
          </Link>
        </section>

        <section
          className={`${classes.panel} ${classes.savedReplayPanel}`}
          aria-label="Saved replays"
        >
          <div>
            <p className={classes.eyebrow}>Local archive</p>
            <h2 className={classes.sectionTitle}>Saved replays</h2>
          </div>

          {!replayStoreAvailable ? (
            <p className={classes.help}>Replay saving is unavailable in this browser.</p>
          ) : savedReplays.length === 0 ? (
            <>
              <ReplayImportControl
                disabled={replayImporting}
                error={replayImportError}
                onImport={(file) => void handleImportReplay(file)}
              />
              {replaysLoading ? (
                <p className={classes.help}>Loading saved replays...</p>
              ) : (
                <p className={classes.help}>
                  Save a replay from the post-game summary to keep it here.
                </p>
              )}
            </>
          ) : (
            <>
              <ReplayImportControl
                disabled={replayImporting}
                error={replayImportError}
                onImport={(file) => void handleImportReplay(file)}
              />
              <div className={classes.savedReplayList}>
                {savedReplays.map((replay) => (
                  <article className={classes.savedReplayRow} key={replay.gameId}>
                    <div className={classes.savedReplayMain}>
                      <strong>{replay.players?.[0]?.displayName ?? replay.playerIds[0]}</strong>
                      <span>vs {replay.players?.[1]?.displayName ?? replay.playerIds[1]}</span>
                      <small>
                        {formatReplayDate(replay.createdAt)} - {replay.totalMoves} moves -{" "}
                        {formatBytes(replay.sizeBytes)}
                      </small>
                    </div>
                    <div className={classes.savedReplayActions}>
                      <Link
                        className={classes.replayIconButton}
                        to={`/replay/${encodeURIComponent(replay.gameId)}`}
                        title="Open replay"
                        aria-label="Open replay"
                      >
                        <IconPlayerPlay size={16} />
                      </Link>
                      <button
                        type="button"
                        className={classes.replayIconButton}
                        onClick={() => void handleDownloadReplay(replay.gameId)}
                        title="Download replay"
                        aria-label="Download replay"
                      >
                        <IconDownload size={16} />
                      </button>
                      <button
                        type="button"
                        className={classes.replayIconButton}
                        onClick={() => void handleDeleteReplay(replay.gameId)}
                        title="Delete replay"
                        aria-label="Delete replay"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

interface ReplayImportControlProps {
  disabled: boolean;
  error: string | null;
  onImport: (file: File) => void;
}

function ReplayImportControl({ disabled, error, onImport }: ReplayImportControlProps) {
  return (
    <div className={classes.replayImport}>
      <label className={classes.importButton}>
        <IconUpload size={16} />
        <span>{disabled ? "Importing..." : "Import replay"}</span>
        <input
          type="file"
          accept=".zip"
          disabled={disabled}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) {
              onImport(file);
              event.currentTarget.value = "";
            }
          }}
        />
      </label>
      {error ? <p className={classes.importError}>{error}</p> : null}
    </div>
  );
}

function formatReplayDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
