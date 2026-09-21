import {
  DropEligibilitySchema,
  EngineInteractionView,
  type ClientToServerEvents,
  type PlayableGameSlug,
  type ServerToClientEvents,
} from "@tcg/protocol";
import { PresentationEnvelopeSchema } from "@tcg/protocol/presentation";
import { RawGatewayServerMessageSchema, type RawGatewayServerMessage } from "@tcg/protocol/gateway";
import type { Socket } from "socket.io-client";
import { z } from "zod";

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

const GameJoinedAckSchema = z.object({
  type: z.literal("game_joined"),
  gameId: z.string().min(1),
  role: z.enum(["player", "spectator"]),
  stateVersion: z.number().int().nonnegative(),
  players: z.array(
    z.object({
      id: z.string().min(1),
      connected: z.boolean(),
      disconnectedAt: z.string().optional(),
    }),
  ),
  correlationId: z.string().optional(),
});

const GAME_JOINED_SNAPSHOT_PARSERS = {
  state: z.unknown(),
  resources: z.unknown(),
  cardsMaps: z.unknown(),
  pendingProposal: z.unknown(),
  playerVisualSettings: z.record(z.string(), z.unknown()),
  presentation: PresentationEnvelopeSchema,
  interactionView: EngineInteractionView,
  dropEligibility: DropEligibilitySchema,
  undoable: z.boolean(),
  manualModeEnabled: z.boolean(),
} as const;

function sanitizeJoinedPlayers(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((player) => {
    if (!player || typeof player !== "object") {
      return player;
    }
    const record = player as Record<string, unknown>;
    return {
      id: record.id,
      connected: record.connected,
      ...(typeof record.disconnectedAt === "string"
        ? { disconnectedAt: record.disconnectedAt }
        : {}),
    };
  });
}

function parseGameJoinedEvent(envelope: Record<string, unknown>): GatewayMessage | null {
  const full = RawGatewayServerMessageSchema.safeParse(envelope);
  if (full.success && full.data.type === "game_joined") {
    return full.data;
  }
  const ack = GameJoinedAckSchema.safeParse({
    type: "game_joined",
    gameId: envelope.gameId,
    role: envelope.role,
    stateVersion: envelope.stateVersion,
    players: sanitizeJoinedPlayers(envelope.players),
    ...(typeof envelope.correlationId === "string"
      ? { correlationId: envelope.correlationId }
      : {}),
  });
  if (!ack.success) {
    return null;
  }
  const result: Record<string, unknown> = { ...ack.data };
  const unparsedSnapshot: string[] = [];
  for (const [key, schema] of Object.entries(GAME_JOINED_SNAPSHOT_PARSERS)) {
    if (!(key in envelope) || envelope[key] === undefined) {
      continue;
    }
    const parsedField = schema.safeParse(envelope[key]);
    if (parsedField.success) {
      result[key] = parsedField.data;
    } else {
      unparsedSnapshot.push(key);
    }
  }
  if (unparsedSnapshot.length > 0) {
    result.unparsedSnapshot = unparsedSnapshot;
  }
  return result as GatewayMessage;
}

export function parseGatewayEvent(
  type: keyof ServerToClientEvents,
  payload: unknown,
): GatewayMessage | null {
  const envelope = {
    ...(payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {}),
    type,
  };
  if (type === "game_joined") {
    return parseGameJoinedEvent(envelope);
  }
  const parsed = RawGatewayServerMessageSchema.safeParse(envelope);
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
