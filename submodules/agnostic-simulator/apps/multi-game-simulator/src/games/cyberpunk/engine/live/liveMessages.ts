import type { MatchState } from "@tcg/cyberpunk-engine";
import { EngineInteractionView, type ServerToClientEvents } from "@tcg/protocol";
import {
  parseLiveGatewayEvent,
  parseLiveGatewayMessage,
  type LiveGatewayMessage,
  type MatchInfo,
} from "./liveGateway";
import {
  buildLiveMatchGameHref,
  projectLiveStateForSimulator,
  projectLiveValueForSimulator,
  type LiveMatchContext,
} from "./matchContext";

export type LiveMessageEffect =
  | { type: "ignore" }
  | { type: "state"; context: LiveMatchContext }
  | { type: "redirect"; href: string };

export function prepareLiveContext(context: LiveMatchContext): LiveMatchContext {
  if (!context.game.state) {
    return context;
  }
  return {
    ...context,
    game: {
      ...context.game,
      state: projectLiveStateForSimulator(context.game.state),
      ...(context.game.interactionView
        ? {
            interactionView: projectLiveValueForSimulator(
              context.game.interactionView,
              context.game.state,
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
      return { type: "state", context: terminalContext };
    }
    return { type: "ignore" };
  }

  const version =
    ("stateVersion" in message && typeof message.stateVersion === "number"
      ? message.stateVersion
      : state.ctx.stateID) ?? context.game.version;
  const isTerminalState = state.G.gameEnded === true;
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
        state,
        version,
        ...(interactionView ? { interactionView } : {}),
      },
    }),
  };
}

export function parseGatewayMessage(data: unknown): LiveGatewayMessage | null {
  return parseLiveGatewayMessage(data);
}

export function parseGatewayEvent(
  type: keyof ServerToClientEvents,
  payload: unknown,
): LiveGatewayMessage | null {
  return parseLiveGatewayEvent(type, payload);
}

function redirectForMessage(
  message: LiveGatewayMessage,
  options: { matchId: string; gameId: string; search: string; basename?: string },
): string | null {
  const matchInfo = matchInfoFromMessage(message);
  const terminalState = message.type === "game_ended" || stateFromMessage(message)?.G.gameEnded;
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

function stateFromMessage(message: LiveGatewayMessage): MatchState | null {
  if (!("state" in message) || !message.state || typeof message.state !== "object") {
    return null;
  }
  const state = message.state as Partial<MatchState>;
  return state.G && state.ctx ? (message.state as MatchState) : null;
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
