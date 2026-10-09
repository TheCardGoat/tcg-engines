import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  MatchSessionSchema,
  acceptSession,
  sessionGameId,
  type MatchSession,
} from "@tcg/game-page-contract";
import { isPlayableGameSlug } from "@tcg/protocol";
import { RawGatewayMatchStateMessageSchema } from "@tcg/protocol/gateway";
import {
  PreparationCommandSchema,
  PreparationCommandResultSchema,
  PreparationSnapshotSchema,
  type PreparationCommand,
  type PreparationCommandResult,
  type PreparationSnapshot,
} from "@tcg/protocol/preparation";
import {
  sendPreparationCommand,
  synchronizePreparation,
  type GatewayHandle,
} from "@tcg/gateway-client";
import {
  acquireRootGatewayHandle,
  initRootSocket,
  destroyRootSocket,
} from "../lib/gateway/root-socket";
import { playUrl } from "../runtime/gameRuntimeApi";
import type { GameSlug } from "@tcg/simulator-contract";
import { preparationRecoveryReason, recordPreparationMeasurement } from "./preparation-telemetry";

type PreparationAction =
  | { type: "confirm_preparation"; selection: unknown }
  | { type: "choose_preparation_first_player"; firstPlayerId: string };
interface SessionController {
  session: MatchSession | null;
  refresh: (reason?: string) => Promise<void>;
  submitPreparation: (action: PreparationAction) => Promise<PreparationCommandResult>;
  error: string | null;
  /** Manual retry only. Background work never drives a visible loading state. */
  refreshing: boolean;
}
const Context = createContext<SessionController | null>(null);
export function useMatchSession() {
  const value = useContext(Context);
  if (!value) throw new Error("MatchSessionProvider is required.");
  return value;
}
const READ_TIMEOUT_MS = 10_000;
const FAILURE_GRACE_MS = 8_000;
const RECONCILE_MS = 30_000;

/** WebSocket owns preparation. HTTP bootstraps gameplay and recovers unavailable transport. */
export function MatchSessionProvider({
  initial,
  gameSlug,
  children,
}: {
  initial: MatchSession | null;
  gameSlug: GameSlug | null;
  children: ReactNode;
}) {
  const [session, setSession] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [socketHealthy, setSocketHealthy] = useState(false);
  const current = useRef(initial);
  const handle = useRef<GatewayHandle | null>(null);
  const connected = useRef(false);
  const generation = useRef(0);
  const running = useRef<Promise<void> | null>(null);
  const synchronizing = useRef<Promise<void> | null>(null);
  const abort = useRef<AbortController | null>(null);
  const failureTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failures = useRef(0);
  const seededScope = useRef<string | null>(null);
  const targetGameId = useRef<string | null>(null);
  const unresolvedCommand = useRef<{ key: string; command: PreparationCommand } | null>(null);
  const disconnectedAt = useRef<number | null>(null);
  const receivedSnapshot = useRef<{ revision: number; receivedAt: number } | null>(null);
  const terminal =
    session?.phase === "cancelled" ||
    (session?.phase === "finished" && session.match.status === "completed");
  const pending = session?.phase === "preparation" || session?.phase === "starting";

  const clearFailure = useCallback(() => {
    failures.current = 0;
    if (failureTimer.current) clearTimeout(failureTimer.current);
    failureTimer.current = null;
    setError(null);
  }, []);
  const noteFailure = useCallback(() => {
    failures.current++;
    if (failureTimer.current) return;
    failureTimer.current = setTimeout(() => {
      setError(
        "The match connection is interrupted. Your current view is retained. Retry to synchronize.",
      );
    }, FAILURE_GRACE_MS);
  }, []);
  const accept = useCallback((incoming: MatchSession) => {
    const next = current.current ? acceptSession(current.current, incoming) : incoming;
    current.current = next;
    setSession(next);
  }, []);
  useEffect(() => {
    if (initial) accept(initial);
  }, [initial, accept]);

  const readHttp = useCallback(
    (reason: string): Promise<void> => {
      const present = current.current;
      if (!present || !gameSlug) return Promise.resolve();
      if (running.current) return running.current;
      const requestGeneration = generation.current;
      const matchId = present.match.matchId;
      const gameId = targetGameId.current ?? sessionGameId(present);
      const request = new AbortController();
      abort.current = request;
      const timeout = setTimeout(() => request.abort(), READ_TIMEOUT_MS);
      const startedAt = performance.now();
      const promise = (async () => {
        try {
          const response = await fetch(
            playUrl(
              gameSlug,
              `/matches/${encodeURIComponent(matchId)}/games/${encodeURIComponent(gameId)}/session`,
            ),
            {
              credentials: "include",
              headers: { Accept: "application/json" },
              signal: request.signal,
            },
          );
          if (!response.ok) throw new Error(`Match synchronization failed (${response.status}).`);
          const incoming = MatchSessionSchema.parse(await response.json());
          if (requestGeneration !== generation.current) return;
          accept(incoming);
          if (targetGameId.current === sessionGameId(incoming)) targetGameId.current = null;
          clearFailure();
          recordPreparationMeasurement({
            type: "http_read",
            reason: preparationRecoveryReason(reason),
            outcome: "ok",
            duration_ms: performance.now() - startedAt,
          });
        } catch (cause) {
          if (requestGeneration !== generation.current) return;
          recordPreparationMeasurement({
            type: "http_read",
            reason: preparationRecoveryReason(reason),
            outcome: "error",
            duration_ms: performance.now() - startedAt,
          });
          console.warn("[match-session] background recovery failed", {
            matchId,
            gameId,
            reason,
            cause,
          });
          noteFailure();
        } finally {
          clearTimeout(timeout);
        }
      })().finally(() => {
        if (running.current === promise) running.current = null;
      });
      running.current = promise;
      return promise;
    },
    [gameSlug, accept, clearFailure, noteFailure],
  );

  const acceptSnapshot = useCallback(
    async (snapshot: PreparationSnapshot) => {
      const present = current.current;
      if (
        !present ||
        snapshot.matchId !== present.match.matchId ||
        snapshot.revision < present.revision
      )
        return;
      if (snapshot.gameId !== sessionGameId(present)) {
        if (snapshot.revision <= present.revision) return;
        targetGameId.current = snapshot.gameId;
        setSocketHealthy(false);
        await readHttp("new_game_credentials");
        return;
      }
      if (snapshot.state === "preparation") {
        if (
          present.viewer.role !== "player" ||
          present.viewer.actorId !== snapshot.preparation.playerId ||
          (present.phase !== "preparation" && present.phase !== "starting")
        )
          return;
      }
      clearFailure();
      setSocketHealthy(true);
      if (disconnectedAt.current !== null) {
        recordPreparationMeasurement({
          type: "socket_recovery",
          duration_ms: performance.now() - disconnectedAt.current,
        });
        disconnectedAt.current = null;
      }
      if (snapshot.state === "unchanged") return;
      if (snapshot.state === "preparation") {
        receivedSnapshot.current = { revision: snapshot.revision, receivedAt: performance.now() };
        accept(
          MatchSessionSchema.parse({
            ...present,
            phase: "preparation",
            revision: snapshot.revision,
            preparation: snapshot.preparation,
          }),
        );
      } else if (snapshot.status !== "waiting") {
        await readHttp("gameplay_bootstrap");
      } else if (present.phase === "preparation") {
        const { preparation: _preparation, ...common } = present;
        accept({ ...common, phase: "starting", revision: snapshot.revision });
      }
    },
    [accept, clearFailure, readHttp],
  );

  // React has committed the snapshot to the view. This measures browser work,
  // not cross-clock commit latency or physical screen paint.
  useEffect(() => {
    const received = receivedSnapshot.current;
    if (!session || !received || session.revision < received.revision) return;
    receivedSnapshot.current = null;
    recordPreparationMeasurement({
      type: "snapshot_render",
      duration_ms: performance.now() - received.receivedAt,
    });
  }, [session]);

  const synchronize = useCallback(
    (reason: string): Promise<void> => {
      if (synchronizing.current) return synchronizing.current;
      const present = current.current;
      if (!present) return Promise.resolve();
      const requestGeneration = generation.current;
      const promise = (async () => {
        if (
          connected.current &&
          handle.current &&
          (present.phase === "preparation" || present.phase === "starting")
        ) {
          try {
            const snapshot = await synchronizePreparation(handle.current, {
              matchId: present.match.matchId,
              gameId: sessionGameId(present),
              revision: present.revision,
            });
            if (requestGeneration !== generation.current) return;
            await acceptSnapshot(snapshot);
            return;
          } catch {
            if (requestGeneration !== generation.current) return;
            setSocketHealthy(false);
          }
        }
        await readHttp(reason);
      })().finally(() => {
        if (synchronizing.current === promise) synchronizing.current = null;
      });
      synchronizing.current = promise;
      return promise;
    },
    [acceptSnapshot, readHttp],
  );
  const refresh = useCallback(
    async (reason = "manual") => {
      const manual = reason === "retry" || reason === "manual";
      if (manual) setRefreshing(true);
      try {
        await synchronize(reason);
      } finally {
        if (manual) setRefreshing(false);
      }
    },
    [synchronize],
  );

  const submitPreparation = useCallback(
    async (action: PreparationAction): Promise<PreparationCommandResult> => {
      const present = current.current;
      if (!present || present.phase !== "preparation" || !gameSlug)
        throw new Error("Preparation is no longer open.");
      const requestGeneration = generation.current;
      const key = JSON.stringify([
        present.match.matchId,
        present.gameId,
        present.preparation.phaseToken,
        action,
      ]);
      const command =
        unresolvedCommand.current?.key === key
          ? unresolvedCommand.current.command
          : PreparationCommandSchema.parse({
              ...action,
              matchId: present.match.matchId,
              gameId: present.gameId,
              phaseToken: present.preparation.phaseToken,
              commandId: crypto.randomUUID(),
              correlationId: crypto.randomUUID(),
            });
      unresolvedCommand.current = { key, command };
      const startedAt = performance.now();
      let transport: "websocket" | "http" = "websocket";
      let fallbackReason: "disconnected" | "socket_reply_failed" = "disconnected";
      let result: PreparationCommandResult | undefined;
      try {
        if (connected.current && handle.current) {
          try {
            result = await sendPreparationCommand(handle.current, command);
          } catch {
            if (requestGeneration !== generation.current)
              throw new DOMException("Preparation view closed.", "AbortError");
            setSocketHealthy(false);
            fallbackReason = "socket_reply_failed";
          }
        }
        if (!result) {
          transport = "http";
          recordPreparationMeasurement({ type: "command_fallback", reason: fallbackReason });
          const { type, matchId, ...body } = command;
          const suffix = type === "choose_preparation_first_player" ? "/first-player" : "";
          const response = await fetch(
            playUrl(gameSlug, `/matches/${encodeURIComponent(matchId)}/pregame${suffix}`),
            {
              method: "PUT",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
              signal: AbortSignal.timeout(READ_TIMEOUT_MS),
            },
          );
          result = PreparationCommandResultSchema.parse(await response.json());
          if (
            result.matchId !== command.matchId ||
            result.gameId !== command.gameId ||
            result.commandId !== command.commandId
          ) {
            throw new Error("Preparation response does not match this command.");
          }
        }
        if (requestGeneration !== generation.current)
          throw new DOMException("Preparation view closed.", "AbortError");
      } catch (error) {
        if (requestGeneration === generation.current)
          recordPreparationMeasurement({
            type: "command_reply",
            command: command.type,
            transport,
            outcome: "transport_error",
            duration_ms: performance.now() - startedAt,
          });
        throw error;
      }
      recordPreparationMeasurement({
        type: "command_reply",
        command: command.type,
        transport,
        outcome: result.status === "accepted" ? "accepted" : result.code,
        duration_ms: performance.now() - startedAt,
      });
      if (result.status === "accepted" || result.code !== "temporarily_unavailable")
        unresolvedCommand.current = null;
      await synchronize("preparation_command");
      return result;
    },
    [gameSlug, synchronize],
  );

  useEffect(() => {
    if (!initial || !gameSlug || !isPlayableGameSlug(gameSlug) || terminal) return;
    const socket = acquireRootGatewayHandle(gameSlug);
    handle.current = socket;
    const subscriptions = [
      socket.on("preparation_state", (message) => {
        const parsed = PreparationSnapshotSchema.safeParse(message.snapshot);
        if (parsed.success) void acceptSnapshot(parsed.data);
      }),
      socket.on("match_session_changed", (event) => {
        if (
          event.matchId === current.current?.match.matchId &&
          event.revision > current.current.revision
        )
          void synchronize("lifecycle_revision");
      }),
      socket.on("match_state", (payload) => {
        const parsed = RawGatewayMatchStateMessageSchema.safeParse({
          ...payload,
          type: "match_state",
        });
        const present = current.current;
        if (!parsed.success || !present || parsed.data.matchId !== present.match.matchId) return;
        const event = parsed.data;
        const match = present.match;
        if (
          event.status !== match.status ||
          event.currentGameId !== match.currentGameId ||
          event.gameIds.join("\0") !== match.gameIds.join("\0") ||
          event.winnerId !== match.winnerId ||
          match.participants.some(
            (player) =>
              match.scores?.[player.id] !== undefined &&
              match.scores[player.id] !==
                (player.seat === 1 ? event.player1Score : event.player2Score),
          )
        ) {
          void synchronize("match_state");
        }
      }),
      socket.onAuthenticated(() => {
        connected.current = true;
        void synchronize("authenticated");
      }),
      socket.onDisconnected(() => {
        connected.current = false;
        disconnectedAt.current ??= performance.now();
        setSocketHealthy(false);
      }),
    ];
    const visibility = () => {
      if (document.visibilityState === "visible") void synchronize("visibility");
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      document.removeEventListener("visibilitychange", visibility);
      if (handle.current === socket) handle.current = null;
      connected.current = false;
      socket.release();
    };
  }, [initial, gameSlug, terminal, acceptSnapshot, synchronize]);

  useEffect(() => {
    if (!pending) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = socketHealthy
        ? RECONCILE_MS
        : Math.min(30_000, 3_000 * 2 ** Math.min(failures.current, 3)) *
          (0.85 + Math.random() * 0.3);
      timer = setTimeout(async () => {
        await synchronize(socketHealthy ? "revision_check" : "transport_fallback");
        if (!stopped) schedule();
      }, delay);
    };
    schedule();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [pending, socketHealthy, synchronize]);
  const deadline = session?.phase === "preparation" ? session.preparation.deadlineAt : null;
  const serverTime = session?.phase === "preparation" ? session.preparation.serverTime : null;
  useEffect(() => {
    if (!deadline || !serverTime) return;
    const timer = setTimeout(
      () => void synchronize("preparation_deadline"),
      Math.max(0, Date.parse(deadline) - Date.parse(serverTime)) + 250,
    );
    return () => clearTimeout(timer);
  }, [deadline, serverTime, synchronize]);

  useEffect(() => {
    if (!session?.realtime || !gameSlug || !isPlayableGameSlug(gameSlug)) {
      if (!initial && seededScope.current === null) return;
      seededScope.current = null;
      destroyRootSocket();
      return;
    }
    const viewer =
      session.viewer.role === "player"
        ? `player:${session.viewer.userId}:${session.viewer.actorId}`
        : `spectator:${session.viewer.userId ?? "anonymous"}:${session.viewer.spectatorId}`;
    const scope = `${gameSlug}:${session.match.matchId}:${sessionGameId(session)}:${viewer}`;
    if (seededScope.current === scope) return;
    seededScope.current = scope;
    setSocketHealthy(false);
    initRootSocket({
      session: null,
      gameSlug,
      ticket: session.realtime.ticket,
      expiresAt: session.realtime.expiresAt,
      authToken: session.realtime.reconnectToken,
      requireAuth: true,
      matchId: session.match.matchId,
      gameId: sessionGameId(session),
      playerId: session.viewer.role === "player" ? session.viewer.actorId : undefined,
    });
  }, [gameSlug, session, initial]);
  useEffect(
    () => () => {
      generation.current++;
      abort.current?.abort();
      if (failureTimer.current) clearTimeout(failureTimer.current);
    },
    [],
  );
  return (
    <Context.Provider value={{ session, refresh, submitPreparation, error, refreshing }}>
      {children}
    </Context.Provider>
  );
}
