import type { ServerToClientEvents } from "@tcg/protocol";
import type { GameSlug } from "@tcg/simulator-contract";
import {
  openSimulatorGateway,
  parseGatewayEvent,
  parseGatewayMessage,
  requestGatewayTicket as requestSharedGatewayTicket,
  type GatewayMessage,
  type GatewaySocket,
  type GatewayTicket,
} from "@tcg/simulator-runtime/gateway";
import {
  apiUrl,
  gatewaySocketUrl,
  gatewayTicketUrl,
  gameApiBaseUrl,
  playUrl,
} from "../../../../../runtime/gameRuntimeApi";

export type { GatewayAuthMode, GatewayTicket } from "@tcg/simulator-runtime/gateway";

export const GUNDAM_GAME_SLUG = "gundam" satisfies GameSlug;

export type LiveGatewayMessage = GatewayMessage;
export type LiveGatewaySocket = GatewaySocket;

export interface MatchInfo {
  matchCompleted?: boolean;
  nextGameId?: string;
}

export async function requestGatewayTicket(fetcher: typeof fetch = fetch): Promise<GatewayTicket> {
  return requestSharedGatewayTicket({
    apiBaseUrl: gameApiBaseUrl(GUNDAM_GAME_SLUG),
    fetcher,
  });
}

export async function requestQuickMatchGatewayTicket(
  input: { matchId: string; playerId: string },
  fetcher: typeof fetch = fetch,
): Promise<GatewayTicket> {
  const response = await fetcher(playUrl(GUNDAM_GAME_SLUG, "/quick-match/ticket"), {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(`Quick match gateway ticket request failed with HTTP ${response.status}.`);
  }
  const body = (await response.json()) as {
    object?: unknown;
    ticket?: string | null;
    authToken?: string | null;
  };
  if (body.object !== "ticket" || !body.ticket) {
    throw new Error("Quick match gateway ticket response did not include a ticket.");
  }
  return { ticket: body.ticket, authToken: body.authToken ?? undefined };
}

export function openLiveGateway(ticket: GatewayTicket): LiveGatewaySocket {
  return openSimulatorGateway(ticket, {
    gameSlug: GUNDAM_GAME_SLUG,
    gatewayOrigin: gatewaySocketOrigin(GUNDAM_GAME_SLUG),
    debugSlug: GUNDAM_GAME_SLUG,
  });
}

export function parseLiveGatewayMessage(data: unknown): LiveGatewayMessage | null {
  return parseGatewayMessage(data);
}

export function parseLiveGatewayEvent(type: string, payload: unknown): LiveGatewayMessage | null {
  return parseGatewayEvent(type as keyof ServerToClientEvents, payload);
}

export function buildGatewayTicketUrl(): string {
  return gatewayTicketUrl(GUNDAM_GAME_SLUG);
}

export function buildDiscordActivityTokenUrl(): string {
  return apiUrl(GUNDAM_GAME_SLUG, "/discord/activity-token");
}

export function buildGatewaySocketIoUrl(): string {
  return gatewaySocketUrl(GUNDAM_GAME_SLUG);
}

function gatewaySocketOrigin(gameSlug: GameSlug): string {
  const socketUrl = gatewaySocketUrl(gameSlug);
  const suffix = `/${gameSlug}`;
  const origin = socketUrl.endsWith(suffix) ? socketUrl.slice(0, -suffix.length) : socketUrl;
  return origin || socketUrl;
}
