import type { MatchChatController } from "@/features/match-chat/match-chat-controller.svelte.js";
import type { OpponentPresenceTracker } from "@/features/gateway/opponent-presence.svelte.js";
import type { OpponentAfkTracker } from "@/features/gateway/opponent-afk.svelte.js";
import type { ChatMessage } from "@tcg/shared";

export interface RecentHistory {
  acceptedMoves: Array<{
    actorId: string;
    moveId: string;
    stateVersion: number;
    timestamp: number;
    turnNumber: number;
    input?: unknown;
  }>;
  engineLogs: Array<{
    stateVersion: number;
    log: unknown;
  }>;
}

export interface LiveMatchInfo {
  matchId: string;
  matchStatus: "waiting" | "in_progress" | "completed" | "abandoned";
  matchCompleted: boolean;
  nextGameId?: string;
  player1Score: number;
  player2Score: number;
  winnerId?: string;
}

export interface LiveMovePayload {
  acceptedMove: RecentHistory["acceptedMoves"][number] | undefined;
  engineLogs: RecentHistory["engineLogs"] | undefined;
  /** Full post-move state snapshot */
  state?: unknown;
  /** JSON patches — provided in state_update */
  patches?: unknown[];
  /** Card instance mapping — provided in state_update for client-authority games */
  cardsMaps?: unknown;
  /**
   * Present only on the terminal move that ends a game. Bundled with the
   * engine snapshot that flips the board to "finished" so UI code can
   * update matchContext in the same render pass — no post-game modal
   * flicker between state_update and the follow-up game_ended packet.
   */
  matchInfo?: LiveMatchInfo;
}

export interface ProposalPayload {
  gameId: string;
  matchId: string;
  actionType: string;
  senderPlayerId: string;
  deadline: number;
}

export interface ProposalResolvedPayload {
  gameId: string;
  matchId: string;
  actionType: string;
  resolution: "accepted" | "declined" | "failed";
}

export interface MessageRouterRefs {
  gameId: string;
  getChatController: () => MatchChatController | null;
  getPresenceTracker?: () => OpponentPresenceTracker | null;
  getAfkTracker?: () => OpponentAfkTracker | null;
  /** Filter function for presence_change and player_activity — return true to handle the event. */
  presenceFilter?: (playerId: string) => boolean;
  onError: (msg: Record<string, unknown>) => void;
  onRecentHistory: (history: RecentHistory & { gameId: string }) => void;
  /**
   * Called for move_accepted and state_update with a parsed payload.
   * Includes a constructed `acceptedMove` built from the packet fields.
   * When provided, these message types are NOT forwarded to onUnhandled.
   */
  onLiveMove?: (payload: LiveMovePayload) => void;
  /** Called when the opponent sends a bilateral consent proposal (e.g. undo). */
  onProposalReceived?: (proposal: ProposalPayload) => void;
  /** Called when a pending proposal is accepted, declined, or failed. */
  onProposalResolved?: (proposal: ProposalResolvedPayload) => void;
  /** Called for messages not handled by the router. */
  onUnhandled?: (msg: Record<string, unknown>) => void;
}

/**
 * Construct an acceptedMove entry from raw WS packet fields.
 *
 * - For move_accepted: pass actorId from msg.actorId directly.
 * - For state_update: actorId is absent at the top level — callers should
 *   extract it from engineLogs (log.playerId where log.moveType === moveType).
 * - turnNumber: if any engineLog has moveType "turnStart", the move occurred on
 *   the previous turn. Canonical turnStart logs do not carry a turn field, so
 *   derive it from the post-move state when needed.
 */
export function buildAcceptedMove(
  actorId: string | undefined,
  moveType: string | undefined,
  stateVersion: number | undefined,
  engineLogs: RecentHistory["engineLogs"] | undefined,
  state: unknown,
  payload?: unknown,
): RecentHistory["acceptedMoves"][number] | undefined {
  if (!actorId || !moveType || stateVersion === undefined) return undefined;
  const timestamp =
    (engineLogs?.[0] as { timestamp?: number } | undefined)?.timestamp ?? Date.now();
  const turnStartLog = engineLogs?.find(
    (e) => (e.log as { moveType?: string } | null)?.moveType === "turnStart",
  );
  const turnStartTurn = (turnStartLog?.log as { turn?: unknown } | undefined)?.turn;
  const stateTurn = (state as { ctx?: { status?: { turn?: number } } } | null)?.ctx?.status?.turn;
  const turnNumber = turnStartLog
    ? Math.max(1, (typeof turnStartTurn === "number" ? turnStartTurn : (stateTurn ?? 2)) - 1)
    : (stateTurn ?? 1);
  // Wrap the wire-format `payload` into MoveInput shape (`{ args }`) so
  // downstream `normalizePersistedMoveParams` treats live and persisted
  // entries identically. Manual moves (which produce no engine logs) rely
  // on this for damage/lore amounts to render in the event log.
  const input = payload !== undefined ? { args: payload } : undefined;
  return {
    actorId,
    moveId: moveType,
    stateVersion,
    timestamp,
    turnNumber,
    ...(input !== undefined ? { input } : {}),
  };
}

function parseMatchInfo(raw: unknown): LiveMatchInfo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const matchId = typeof r.matchId === "string" ? r.matchId : undefined;
  const matchStatus = r.matchStatus;
  if (
    !matchId ||
    (matchStatus !== "waiting" &&
      matchStatus !== "in_progress" &&
      matchStatus !== "completed" &&
      matchStatus !== "abandoned")
  ) {
    return undefined;
  }
  return {
    matchId,
    matchStatus,
    matchCompleted: r.matchCompleted === true,
    nextGameId: typeof r.nextGameId === "string" ? r.nextGameId : undefined,
    player1Score: typeof r.player1Score === "number" ? r.player1Score : 0,
    player2Score: typeof r.player2Score === "number" ? r.player2Score : 0,
    winnerId: typeof r.winnerId === "string" ? r.winnerId : undefined,
  };
}

const ERROR_TYPES = new Set(["game_error", "error", "gateway_error"]);

export function createMessageRouter(
  refs: MessageRouterRefs,
): (msg: Record<string, unknown>) => void {
  return (msg) => {
    if (ERROR_TYPES.has(msg.type as string)) {
      const gid = typeof msg.gameId === "string" ? msg.gameId : undefined;
      if (gid && gid !== refs.gameId) return;
      refs.onError(msg);
      return;
    }

    if (msg.type === "game_recent_history") {
      const history = msg as { gameId: string; acceptedMoves: unknown[]; engineLogs: unknown[] };
      if (history.gameId !== refs.gameId) return;
      refs.onRecentHistory(history as RecentHistory & { gameId: string });
      return;
    }

    if (msg.type === "move_accepted" && refs.onLiveMove) {
      const engineLogs = Array.isArray(msg.engineLogs)
        ? (msg.engineLogs as RecentHistory["engineLogs"])
        : undefined;
      const acceptedMove = buildAcceptedMove(
        typeof msg.actorId === "string" ? msg.actorId : undefined,
        typeof msg.moveType === "string" ? msg.moveType : undefined,
        typeof msg.stateVersion === "number" ? msg.stateVersion : undefined,
        engineLogs,
        msg.state,
        msg.payload,
      );
      refs.onLiveMove({
        acceptedMove,
        engineLogs,
        state: msg.state,
        matchInfo: parseMatchInfo(msg.matchInfo),
      });
      return;
    }

    if (msg.type === "state_update" && refs.onLiveMove) {
      const engineLogs = Array.isArray(msg.engineLogs)
        ? (msg.engineLogs as RecentHistory["engineLogs"])
        : undefined;
      const moveType = typeof msg.moveType === "string" ? msg.moveType : undefined;
      // state_update may or may not carry a top-level actorId. When present, use it
      // (the dispatcher is authoritative). Otherwise fall back to the first engineLog
      // that carries a playerId — the first log belongs to the initiating player.
      const actorId = (() => {
        if (typeof msg.actorId === "string") return msg.actorId;
        for (const entry of engineLogs ?? []) {
          const pid = (entry.log as { playerId?: string } | null)?.playerId;
          if (typeof pid === "string") return pid;
        }
        return undefined;
      })();
      const acceptedMove = buildAcceptedMove(
        actorId,
        moveType,
        typeof msg.stateVersion === "number" ? msg.stateVersion : undefined,
        engineLogs,
        msg.state,
        msg.payload,
      );
      refs.onLiveMove({
        acceptedMove,
        engineLogs,
        state: msg.state,
        patches: Array.isArray(msg.patches) ? msg.patches : undefined,
        cardsMaps: msg.cardsMaps && typeof msg.cardsMaps === "object" ? msg.cardsMaps : undefined,
        matchInfo: parseMatchInfo(msg.matchInfo),
      });
      return;
    }

    if (msg.type === "game_chat_history") {
      const chat = refs.getChatController();
      if (chat) {
        chat.hydrateHistory(
          String(msg.matchId ?? ""),
          Array.isArray(msg.messages) ? (msg.messages as ChatMessage[]) : [],
          { freeTextEnabled: msg.freeTextEnabled === true },
        );
      }
      return;
    }

    if (msg.type === "chat_message") {
      const chat = refs.getChatController();
      if (chat && msg.message) {
        chat.receiveMessage(String(msg.matchId ?? ""), msg.message as ChatMessage);
      }
      return;
    }

    if (msg.type === "presence_change") {
      const pid = String(msg.playerId ?? "");
      if (!pid) return;
      const shouldHandle = refs.presenceFilter ? refs.presenceFilter(pid) : true;
      if (shouldHandle) {
        refs
          .getPresenceTracker?.()
          ?.handlePresenceChange(
            msg.status as "connected" | "disconnected",
            msg.disconnectedAt as string | undefined,
          );
      }
      return;
    }

    if (msg.type === "player_activity") {
      const pid = String(msg.playerId ?? "");
      if (!pid) return;
      const shouldHandle = refs.presenceFilter ? refs.presenceFilter(pid) : true;
      if (shouldHandle) {
        refs.getAfkTracker?.()?.handleActivityUpdate({
          isAfk: Boolean(msg.isAfk),
          idle: Boolean(msg.idle),
          tabVisible: msg.tabVisible !== false,
        });
      }
      return;
    }

    if (msg.type === "proposal_received" && refs.onProposalReceived) {
      const gid = typeof msg.gameId === "string" ? msg.gameId : undefined;
      if (gid && gid !== refs.gameId) return;
      refs.onProposalReceived({
        gameId: String(msg.gameId ?? ""),
        matchId: String(msg.matchId ?? ""),
        actionType: String(msg.actionType ?? ""),
        senderPlayerId: String(msg.senderPlayerId ?? ""),
        deadline: typeof msg.deadline === "number" ? msg.deadline : 0,
      });
      return;
    }

    if (
      (msg.type === "proposal_resolved" || msg.type === "proposal_expired") &&
      refs.onProposalResolved
    ) {
      const gid = typeof msg.gameId === "string" ? msg.gameId : undefined;
      if (gid && gid !== refs.gameId) return;
      refs.onProposalResolved({
        gameId: String(msg.gameId ?? ""),
        matchId: String(msg.matchId ?? ""),
        actionType: String(msg.actionType ?? ""),
        resolution:
          msg.type === "proposal_expired"
            ? "declined"
            : ((msg.resolution as "accepted" | "declined" | "failed") ?? "failed"),
      });
      return;
    }

    if (msg.type === "timeout_notification") {
      // Clock timeout state is derived client-side from the projected ClockSnapshot
      // plus the shared reactive `now` tick (see clock-ticker.svelte.ts and
      // deriveClockView in @tcg/lorcana-engine). The server-pushed notification
      // is redundant for UI affordances and is intentionally ignored here.
      return;
    }

    refs.onUnhandled?.(msg);
  };
}
