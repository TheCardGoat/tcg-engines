import { type RawGatewayMatchInfo } from "@tcg/protocol/gateway";
import type { ServerToClientEvents } from "@tcg/protocol";
import type { GameSlug } from "@tcg/simulator-contract";
import {
  openSimulatorGateway,
  parseGatewayEvent,
  parseGatewayMessage,
  requestGatewayTicket as requestSharedGatewayTicket,
  shouldRefreshAnonymousWelcome,
  type GatewayAuthMode,
  type GatewayMessage,
  type GatewaySocket,
  type GatewayTicket,
} from "@tcg/simulator-runtime/gateway";
import { primeAuthSession } from "../../auth/auth-store";
import {
  gatewaySocketUrl,
  gatewayTicketUrl,
  gameApiBaseUrl,
} from "../../../../runtime/gameRuntimeApi";
import { CYBERPUNK_GAME_SLUG } from "./apiOrigin";
import { createLiveHttpError } from "./httpFeedback";

export { shouldRefreshAnonymousWelcome };
export type { GatewayAuthMode, GatewayTicket } from "@tcg/simulator-runtime/gateway";

export interface LiveGatewayOptions {
  getAuth?: () => GatewayTicket;
  authMode?: GatewayAuthMode;
  gameSlug?: GameSlug;
}

export type LiveGatewayMessage = GatewayMessage;
export type LiveGatewaySocket = GatewaySocket;

export type MatchInfo = Partial<Pick<RawGatewayMatchInfo, "matchCompleted" | "nextGameId">>;

export interface RequestGatewayTicketOptions {
  gameSlug?: GameSlug;
  matchId?: string;
  playerId?: string;
}

export async function requestGatewayTicket(
  opts: RequestGatewayTicketOptions = {},
  fetcher: typeof fetch = fetch,
): Promise<GatewayTicket> {
  const gameSlug = opts.gameSlug ?? CYBERPUNK_GAME_SLUG;
  return requestSharedGatewayTicket({
    apiBaseUrl: gameApiBaseUrl(gameSlug),
    matchId: opts.matchId,
    playerId: opts.playerId,
    fetcher,
    primeAuthSession,
    createHttpError: createLiveHttpError,
  });
}

export function openLiveGateway(
  ticket: GatewayTicket,
  options: LiveGatewayOptions = {},
): LiveGatewaySocket {
  const gameSlug = options.gameSlug ?? CYBERPUNK_GAME_SLUG;
  return openSimulatorGateway(ticket, {
    gameSlug,
    gatewayOrigin: gatewaySocketOrigin(gameSlug),
    debugSlug: gameSlug,
    getAuth: options.getAuth,
    authMode: options.authMode,
  });
}

export function parseLiveGatewayMessage(data: unknown): LiveGatewayMessage | null {
  return parseGatewayMessage(data);
}

export function parseLiveGatewayEvent(
  type: keyof ServerToClientEvents,
  payload: unknown,
): LiveGatewayMessage | null {
  return parseGatewayEvent(type, payload);
}

export function buildGatewayTicketUrl(gameSlug: GameSlug = CYBERPUNK_GAME_SLUG): string {
  return gatewayTicketUrl(gameSlug);
}

export function buildGatewaySocketIoUrl(gameSlug: GameSlug = CYBERPUNK_GAME_SLUG): string {
  return gatewaySocketUrl(gameSlug);
}

function gatewaySocketOrigin(gameSlug: GameSlug): string {
  const socketUrl = gatewaySocketUrl(gameSlug);
  const suffix = `/${gameSlug}`;
  const origin = socketUrl.endsWith(suffix) ? socketUrl.slice(0, -suffix.length) : socketUrl;
  return origin || socketUrl;
}
