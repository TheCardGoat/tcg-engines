import { EngineInteractionView, type ServerToClientEvents } from "@tcg/protocol";
import { parseLiveGatewayEvent, type LiveGatewayMessage, type MatchInfo } from "./liveGateway";
import {
  buildLiveMatchGameHref,
  projectLiveStateForSimulator,
  projectLiveValueForSimulator,
  type LiveMatchContext,
} from "./matchContext";
import {
  isFilteredMatchView,
  isMatchState,
  viewerProjectionToMatchState,
  type CyberpunkViewerState,
} from "./liveState";

export type LiveMessageEffect =
  | { type: "ignore" }
  | { type: "state"; context: LiveMatchContext }
  | { type: "redirect"; href: string };

export function prepareLiveContext(context: LiveMatchContext): LiveMatchContext {
  if (!context.game.state) {
    return context;
  }
  const projectedState = projectLiveStateForSimulator(context.game.state, context.game.actorIds);
  const state = reconcileAuthoritativeTerminalState(context, projectedState);
  return {
    ...context,
    game: {
      ...context.game,
      state,
      ...(context.game.viewerProjection
        ? {
            viewerProjection: projectLiveValueForSimulator(
              context.game.viewerProjection,
              context.game.state,
              context.game.actorIds,
            ),
          }
        : {}),
      ...(context.game.interactionView
        ? {
            interactionView: projectLiveValueForSimulator(
              context.game.interactionView,
              context.game.state,
              context.game.actorIds,
            ),
          }
        : {}),
    },
  };
}

export function reduceLiveGatewayMessage(
  context: LiveMatchContext,
  message: LiveGatewayMessage,
  options: { matchId: string; gameId: string; search: string; basename?: string },
): LiveMessageEffect {
  const redirect = redirectForMessage(message, options);
  if (redirect) {
    return { type: "redirect", href: redirect };
  }

  const state = stateFromMessage(message);
  if (!state || !("gameId" in message) || message.gameId !== options.gameId) {
    const terminalContext = terminalContextFromMessage(context, message, options.gameId);
    if (terminalContext) {
      return { type: "state", context: prepareLiveContext(terminalContext) };
    }
    return { type: "ignore" };
  }

  const version =
    ("stateVersion" in message && typeof message.stateVersion === "number"
      ? message.stateVersion
      : viewerStateVersion(state)) ?? context.game.version;
  const isTerminalState = viewerStateGameEnded(state);
  const viewerProjection = isFilteredMatchView(state) ? state : undefined;
  const rendererState = isMatchState(state)
    ? state
    : viewerProjectionToMatchState(state, context.match.matchId);
  const interactionView =
    "interactionView" in message ? parseInteractionView(message.interactionView) : undefined;
  const matchInfo = matchInfoFromMessage(message);
  return {
    type: "state",
    context: prepareLiveContext({
      ...context,
      match: matchInfo
        ? {
            ...context.match,
            status: matchInfo.matchCompleted ? "completed" : context.match.status,
            currentGameId: matchInfo.nextGameId ?? context.match.currentGameId,
          }
        : context.match,
      game: {
        ...context.game,
        status:
          message.type === "game_ended" || matchInfo?.matchCompleted || isTerminalState
            ? "completed"
            : context.game.status,
        state: rendererState,
        ...(viewerProjection ? { viewerProjection } : {}),
        version,
        ...(interactionView ? { interactionView } : {}),
      },
    }),
  };
}

function reconcileAuthoritativeTerminalState(
  context: LiveMatchContext,
  state: NonNullable<LiveMatchContext["game"]["state"]>,
): NonNullable<LiveMatchContext["game"]["state"]> {
  if (
    (context.game.status !== "completed" && context.match.status !== "completed") ||
    state.G.gameEnded
  ) {
    return state;
  }

  const projectedWinner = context.match.winnerId
    ? projectLiveValueForSimulator(
        context.match.winnerId,
        context.game.state!,
        context.game.actorIds,
      )
    : null;
  const winnerId =
    state.ctx.playerIds.find((playerId) => String(playerId) === projectedWinner) ??
    state.G.winnerId;

  return {
    ...state,
    G: {
      ...state.G,
      gameEnded: true,
      winnerId,
    },
  };
}

export function parseGatewayEvent(
  type: keyof ServerToClientEvents,
  payload: unknown,
): LiveGatewayMessage | null {
  return parseLiveGatewayEvent(type, payload);
}

export type LiveGatewayJoin = {
  gameId: string;
  role: "player" | "spectator";
};

/** Seat from the raw envelope so a nested schema miss cannot unseat a player. */
export function liveGatewayJoinFromEvent(type: string, payload: unknown): LiveGatewayJoin | null {
  if (type !== "game_joined" || payload === null || typeof payload !== "object") {
    return null;
  }
  const record = payload as { gameId?: unknown; role?: unknown };
  if (typeof record.gameId !== "string" || record.gameId.length === 0) {
    return null;
  }
  if (record.role !== "player" && record.role !== "spectator") {
    return null;
  }
  return { gameId: record.gameId, role: record.role };
}

function redirectForMessage(
  message: LiveGatewayMessage,
  options: { matchId: string; gameId: string; search: string; basename?: string },
): string | null {
  const matchInfo = matchInfoFromMessage(message);
  const terminalState =
    message.type === "game_ended" || viewerStateGameEnded(stateFromMessage(message));
  if (matchInfo?.nextGameId && matchInfo.nextGameId !== options.gameId && !terminalState) {
    return nextGameHref(options.matchId, matchInfo.nextGameId, options.search, options.basename);
  }

  if (message.type === "match_state") {
    const record = message as Record<string, unknown>;
    const completed =
      readBoolean(record, "matchCompleted") || readString(record, "status") === "completed";
    const currentGameId = readString(record, "currentGameId");
    // Completed matches intentionally stay on the final board. The end-game
    // modal owns the explicit "back to matchmaking" navigation.
    if (!completed && currentGameId && currentGameId !== options.gameId) {
      return nextGameHref(options.matchId, currentGameId, options.search, options.basename);
    }
  }

  return null;
}

function matchInfoFromMessage(message: LiveGatewayMessage): MatchInfo | undefined {
  if ("matchInfo" in message && message.matchInfo && typeof message.matchInfo === "object") {
    const value = message.matchInfo as MatchInfo;
    return {
      matchCompleted: value.matchCompleted,
      nextGameId: value.nextGameId,
    };
  }
  if (message.type === "game_ended") {
    const record = message as Record<string, unknown>;
    return {
      matchCompleted: readBoolean(record, "matchCompleted"),
      nextGameId: readString(record, "nextGameId"),
    };
  }
  return undefined;
}

function terminalContextFromMessage(
  context: LiveMatchContext,
  message: LiveGatewayMessage,
  gameId: string,
): LiveMatchContext | null {
  if (message.type === "game_ended" && message.gameId === gameId) {
    return {
      ...context,
      match: {
        ...context.match,
        status: message.matchCompleted ? "completed" : context.match.status,
        currentGameId: message.matchCompleted
          ? context.match.currentGameId
          : (message.nextGameId ?? context.match.currentGameId),
        winnerId: message.winnerId ?? context.match.winnerId,
        player1Score: message.player1Score ?? context.match.player1Score,
        player2Score: message.player2Score ?? context.match.player2Score,
      },
      game: {
        ...context.game,
        status: "completed",
      },
    };
  }

  if (message.type !== "match_state") {
    return null;
  }

  const record = message as Record<string, unknown>;
  const status = readString(record, "status");
  if (status !== "completed" && status !== "abandoned") {
    return null;
  }

  return {
    ...context,
    match: {
      ...context.match,
      status,
      currentGameId: readString(record, "currentGameId"),
      gameIds: Array.isArray(record.gameIds)
        ? record.gameIds.filter(isString)
        : context.match.gameIds,
      winnerId: readString(record, "winnerId") ?? context.match.winnerId,
      player1Score: readNumber(record, "player1Score") ?? context.match.player1Score,
      player2Score: readNumber(record, "player2Score") ?? context.match.player2Score,
    },
  };
}

function stateFromMessage(message: LiveGatewayMessage): CyberpunkViewerState | null {
  if (!("state" in message) || !message.state || typeof message.state !== "object") {
    return null;
  }
  if (isMatchState(message.state) || isFilteredMatchView(message.state)) {
    return message.state;
  }
  return null;
}

function viewerStateVersion(state: CyberpunkViewerState): number {
  return isMatchState(state) ? state.ctx.stateID : state.stateID;
}

function viewerStateGameEnded(state: CyberpunkViewerState | null): boolean {
  if (!state) return false;
  return isMatchState(state) ? state.G.gameEnded : state.gameEnded;
}

function parseInteractionView(value: unknown): LiveMatchContext["game"]["interactionView"] {
  const parsed = EngineInteractionView.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

function nextGameHref(matchId: string, gameId: string, search: string, basename?: string): string {
  return buildLiveMatchGameHref(matchId, gameId, search, basename);
}

function readString(value: Record<string, unknown>, key: string): string | undefined {
  const raw = value[key];
  return typeof raw === "string" ? raw : undefined;
}

function readBoolean(value: Record<string, unknown>, key: string): boolean | undefined {
  const raw = value[key];
  return typeof raw === "boolean" ? raw : undefined;
}

function readNumber(value: Record<string, unknown>, key: string): number | undefined {
  const raw = value[key];
  return typeof raw === "number" ? raw : undefined;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
