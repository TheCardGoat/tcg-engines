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
  acquireRootGatewayHandle,
  initRootSocket,
  destroyRootSocket,
} from "../lib/gateway/root-socket";
import { logDebugPayload } from "../lib/debug-logging";
import { playUrl } from "../runtime/gameRuntimeApi";
import type { GameSlug } from "@tcg/simulator-contract";

interface SessionController {
  session: MatchSession | null;
  refresh: (reason?: string) => Promise<void>;
  error: string | null;
  refreshing: boolean;
}
const Context = createContext<SessionController | null>(null);

export function useMatchSession() {
  const value = useContext(Context);
  if (!value) throw new Error("MatchSessionProvider is required.");
  return value;
}

/** Mirror of the provider's HTTP deadline. When it fires, the player sees the
 * "Match synchronization interrupted" toast — always log that moment, with the
 * request context, so a hung session read is diagnosable from the console. */
const REFRESH_TIMEOUT_MS = 10_000;

/** Owns HTTP lifecycle recovery. Game renderers own only versioned gameplay updates. */
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
  const failures = useRef(0);
  const current = useRef(session);
  const generation = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const running = useRef<Promise<void> | null>(null);
  const dirty = useRef(false);
  const seededScope = useRef<string | null>(null);
  const terminal =
    session?.phase === "cancelled" ||
    (session?.phase === "finished" && session.match.status === "completed");
  useEffect(() => {
    if (!initial) return;
    const accepted = current.current ? acceptSession(current.current, initial) : initial;
    current.current = accepted;
    setSession(accepted);
  }, [initial]);
  const refresh = useCallback(
    (reason?: string): Promise<void> => {
      if (!initial || !gameSlug) return Promise.resolve();
      if (running.current) {
        dirty.current = true;
        return running.current;
      }
      const matchId = initial.match.matchId;
      const gameId = sessionGameId(initial);
      const requestGeneration = generation.current;
      setRefreshing(true);
      const load = async () => {
        do {
          dirty.current = false;
          const abort = new AbortController();
          controller.current = abort;
          let timedOut = false;
          const timeout = window.setTimeout(() => {
            timedOut = true;
            // Always surfaced: this timer firing is what shows the player the
            // synchronization-interrupted toast.
            console.warn("[match-session] refresh timed out", {
              gameSlug,
              matchId,
              gameId,
              reason,
              timeoutMs: REFRESH_TIMEOUT_MS,
              attempt: failures.current + 1,
            });
            abort.abort();
          }, REFRESH_TIMEOUT_MS);
          const startedAt = performance.now();
          logDebugPayload("[match-session] refresh start", {
            gameSlug,
            matchId,
            gameId,
            reason,
            attempt: failures.current + 1,
            phase: current.current?.phase ?? null,
          });
          try {
            const response = await fetch(playUrl(gameSlug, `/matches/${encodeURIComponent(matchId)}/games/${encodeURIComponent(gameId)}/session`), {
              credentials: "include",
              headers: { Accept: "application/json" },
              signal: abort.signal,
            });
            if (!response.ok) throw new Error(`Match synchronization failed (${response.status}).`);
            const incoming = MatchSessionSchema.parse(await response.json());
            if (requestGeneration !== generation.current) return;
            const accepted = current.current ? acceptSession(current.current, incoming) : incoming;
            current.current = accepted;
            setSession(accepted);
            failures.current = 0;
            setError(null);
            logDebugPayload("[match-session] refresh ok", {
              gameSlug,
              matchId,
              gameId,
              reason,
              durationMs: Math.round(performance.now() - startedAt),
              revision: accepted.revision,
              phase: accepted.phase,
            });
          } catch (cause) {
            if (requestGeneration !== generation.current) return;
            failures.current++;
            // Retry on the recovery schedule, not in an immediate dirty loop.
            dirty.current = false;
            const durationMs = Math.round(performance.now() - startedAt);
            const message =
              timedOut
                ? "Refreshing the match timed out. The match server may be restarting — try again in a moment."
                : cause instanceof Error
                  ? cause.message
                  : "Could not synchronize the match.";
            // Always surfaced: failures are rare and are the browser-side
            // fingerprint of a game-server outage or restart herd.
            console.warn("[match-session] refresh failed", {
              gameSlug,
              matchId,
              gameId,
              reason,
              durationMs,
              attempt: failures.current,
              timedOut,
              aborted: abort.signal.aborted,
              message,
            });
            setError(message);
          } finally {
            window.clearTimeout(timeout);
          }
        } while (dirty.current && requestGeneration === generation.current);
      };
      const promise = load().finally(() => {
        if (running.current === promise) {
          running.current = null;
          setRefreshing(false);
        }
      });
      running.current = promise;
      return promise;
    },
    [initial, gameSlug],
  );

  useEffect(
    () => () => {
      generation.current++;
      controller.current?.abort();
      running.current = null;
      dirty.current = false;
    },
    [],
  );

  const pending = session?.phase === "preparation" || session?.phase === "starting";
  const deadline = session?.phase === "preparation" ? session.preparation.deadlineAt : null;

  // Notifications are the fast path. A response-paced safety read recovers lost
  // events and transient failures without overlapping requests or polling play.
  useEffect(() => {
    if (!pending) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = Math.min(30_000, 3_000 * 2 ** Math.min(failures.current, 4));
      timer = setTimeout(async () => {
        await (running.current ?? refresh("recovery_schedule"));
        if (!stopped) schedule();
      }, delay);
    };
    schedule();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [pending, refresh]);

  // The browser never resolves a game rule. It only reads the server after
  // each deadline; an unchanged/expired reply continues on the paced schedule.
  useEffect(() => {
    if (!deadline) return;
    const timer = setTimeout(
      () => {
        if (!running.current) void refresh("preparation_deadline");
      },
      Math.max(0, Date.parse(deadline) - Date.now()) + 250,
    );
    return () => clearTimeout(timer);
  }, [deadline, refresh]);

  useEffect(() => {
    if (!initial || !gameSlug || !isPlayableGameSlug(gameSlug) || terminal) return;
    const handle = acquireRootGatewayHandle(gameSlug);
    const unsubscribers = [
      handle.on("match_session_changed", (event) => {
        if (
          event.matchId === initial.match.matchId &&
          event.revision > (current.current?.revision ?? -1)
        )
          void refresh("match_session_changed");
      }),
      handle.on("match_state", (payload) => {
        const parsed = RawGatewayMatchStateMessageSchema.safeParse({
          ...payload,
          type: "match_state",
        });
        if (!parsed.success) return;
        const event = parsed.data;
        const match = current.current?.match;
        if (!match || event.matchId !== match.matchId) return;
        // join_game replies include match_state even when nothing changed.
        if (
          event.status !== match.status ||
          event.currentGameId !== match.currentGameId ||
          event.winnerId !== match.winnerId ||
          event.gameIds.join("\0") !== match.gameIds.join("\0") ||
          match.participants.some(
            (player) =>
              match.scores?.[player.id] !== undefined &&
              match.scores[player.id] !==
                (player.seat === 1 ? event.player1Score : event.player2Score),
          )
          )
          void refresh("match_state");
      }),
      // Subscriptions precede this recovery read, closing the SSR-to-connection gap.
      handle.onAuthenticated(() => {
        void refresh("authenticated");
      }),
    ];
    const onFocus = () => {
      if (document.visibilityState === "visible") void refresh("visibility");
    };
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      document.removeEventListener("visibilitychange", onFocus);
      handle.release();
    };
  }, [initial, gameSlug, refresh, terminal]);

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
    const scope = `${gameSlug}:${session.match.matchId}:${sessionGameId(session)}:${viewer}:${session.phase}`;
    if (seededScope.current === scope) return;
    seededScope.current = scope;
    // Keep the same socket. A preparation-to-game transition does not unmount
    // the connection owner or expose another viewer's resources.
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

  return (
    <Context.Provider value={{ session, refresh, error, refreshing }}>{children}</Context.Provider>
  );
}
