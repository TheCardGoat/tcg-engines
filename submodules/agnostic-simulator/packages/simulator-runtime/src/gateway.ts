import type { ClientToServerEvents, PlayableGameSlug, ServerToClientEvents } from "@tcg/protocol";
import { RawGatewayServerMessageSchema, type RawGatewayServerMessage } from "@tcg/protocol/gateway";
import type { Socket } from "socket.io-client";

export interface GatewayTicket {
  ticket?: string;
  authToken?: string;
}

export type GatewayAuthMode = "optional" | "required";
export type GatewayMessage = RawGatewayServerMessage;
export type GatewaySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface OpenGatewayOptions {
  gameSlug: string;
  gatewayOrigin: string;
}

export interface RequestGatewayTicketOptions {
  apiBaseUrl: string;
  gameSlug: PlayableGameSlug;
  matchId?: string;
  playerId?: string;
  fetcher?: typeof fetch;
  primeAuthSession?: () => Promise<void>;
  createHttpError?: (response: Response, fallbackMessage: string) => Promise<Error>;
}

export async function requestGatewayTicket({
  apiBaseUrl,
  gameSlug,
  matchId,
  playerId,
  fetcher = fetch,
  primeAuthSession,
  createHttpError,
}: RequestGatewayTicketOptions): Promise<GatewayTicket> {
  if (fetcher === fetch) {
    await primeAuthSession?.();
  }
  const hasMatchParams = Boolean(matchId) && Boolean(playerId);
  const url = buildGatewayTicketUrl(apiBaseUrl);
  logGatewayDebug("[live-gateway] requesting gateway ticket", {
    url,
    gameSlug,
    hasMatchParams,
    matchId,
    playerId,
  });

  const init: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      gameSlug,
      ...(matchId ? { matchId } : {}),
      ...(playerId ? { playerId } : {}),
    }),
  };

  const response = await fetcher(url, init);
  if (!response.ok) {
    console.warn("[live-gateway] gateway ticket request failed", {
      status: response.status,
      hasMatchParams,
    });
    throw createHttpError
      ? await createHttpError(response, "Gateway ticket request failed")
      : new Error("Gateway ticket request failed");
  }

  const body = (await response.json()) as {
    ticket?: string | null;
    authToken?: string | null;
  };
  if (!body.ticket && !body.authToken) {
    console.warn("[live-gateway] gateway ticket response had no credentials", {
      hasMatchParams,
    });
    throw new Error("Gateway ticket response did not include a ticket or auth token.");
  }
  logGatewayDebug("[live-gateway] gateway ticket request succeeded", {
    hasMatchParams,
    hasTicket: Boolean(body.ticket),
    hasAuthToken: Boolean(body.authToken),
  });
  return {
    ticket: body.ticket ?? undefined,
    authToken: body.authToken ?? undefined,
  };
}

export function shouldRefreshAnonymousWelcome(
  authMode: GatewayAuthMode,
  payload: { authenticated?: boolean },
): boolean {
  return authMode === "required" && payload.authenticated !== true;
}

export function parseGatewayEvent(
  type: keyof ServerToClientEvents,
  payload: unknown,
): GatewayMessage | null {
  const parsed = RawGatewayServerMessageSchema.safeParse({
    ...(payload && typeof payload === "object" ? payload : {}),
    type,
  });
  return parsed.success ? parsed.data : null;
}

export function buildGatewayTicketUrl(apiBaseUrl: string): string {
  return `${normalizeHttpOrigin(apiBaseUrl)}/v1/gateway/ticket`;
}

export function buildGatewaySocketIoUrl({
  gameSlug,
  gatewayOrigin,
}: Pick<OpenGatewayOptions, "gameSlug" | "gatewayOrigin">): string {
  return `${normalizeOrigin(gatewayOrigin)}/${gameSlug}`;
}

export function normalizeHttpOrigin(input: string): string {
  return input
    .trim()
    .replace(/\/v1\/?$/i, "")
    .replace(/\/$/, "");
}

export function normalizeOrigin(input: string): string {
  try {
    const url = new URL(input);
    return `${url.protocol}//${url.host}`;
  } catch {
    return input.replace(/\/$/, "");
  }
}

const GATEWAY_LOG_STORAGE_KEY = "tcg:gateway-log";
const GATEWAY_LOG_QUERY_PARAMS = ["gatewayLog", "gatewayDebug"];

function logGatewayDebug(message: string, details?: Record<string, unknown>): void {
  if (!shouldLogGatewayMessages()) return;
  if (details) {
    console.info(message, details);
    return;
  }
  console.info(message);
}

function shouldLogGatewayMessages(): boolean {
  if (isDevEnv()) return true;
  if (typeof window === "undefined") return false;

  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of GATEWAY_LOG_QUERY_PARAMS) {
      const value = params.get(key);
      if (value == null) continue;
      const normalized = value.toLowerCase();
      if (normalized === "1" || normalized === "true" || normalized === "on") {
        window.localStorage.setItem(GATEWAY_LOG_STORAGE_KEY, "1");
        return true;
      }
      if (normalized === "0" || normalized === "false" || normalized === "off") {
        window.localStorage.removeItem(GATEWAY_LOG_STORAGE_KEY);
        return false;
      }
    }
    return window.localStorage.getItem(GATEWAY_LOG_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function isDevEnv(): boolean {
  const meta = import.meta as ImportMeta & { env?: { DEV?: boolean } };
  return meta.env?.DEV === true;
}
