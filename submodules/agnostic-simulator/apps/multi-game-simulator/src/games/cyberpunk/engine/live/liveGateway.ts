import { type RawGatewayMatchInfo } from "@tcg/protocol/gateway";
import type { ServerToClientEvents } from "@tcg/protocol";
import type { GameSlug } from "@tcg/simulator-contract";
import {
  parseGatewayEvent,
  parseGatewayMessage,
  requestGatewayTicket as requestSharedGatewayTicket,
  type GatewayMessage,
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

export type { GatewayTicket } from "@tcg/simulator-runtime/gateway";

export type LiveGatewayMessage = GatewayMessage;

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
