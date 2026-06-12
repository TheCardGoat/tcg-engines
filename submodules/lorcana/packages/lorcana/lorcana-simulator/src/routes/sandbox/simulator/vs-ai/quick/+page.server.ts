import { redirect } from "@sveltejs/kit";
import type { ServerLoadEvent } from "@sveltejs/kit";
import { sanitizeDeckText } from "@/features/simulator-devtools/fixtures/fixture-factory.js";
import { DECK_FIXTURES } from "@/features/simulator-devtools/deck-fixtures/index.js";
import { createAutomatedMatchSeed } from "@/features/simulator-devtools/ai-match/config.js";
import { getSafeAutomatedActionStrategyOption } from "@tcg/lorcana-engine";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { configureCoreSimulatorLogging } from "$lib/logtape/logger.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import { serverJsonOrNull } from "$lib/data/server/server-json.js";
import { getLogger } from "@logtape/logtape";

configureCoreSimulatorLogging();

const logger = getLogger(["tcg", "simulator", "quick-ai-match"]);

function pickRandom<T>(arr: readonly T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function decodeDeckParam(value: string): string | null {
  if (!value) return null;
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

interface QuickMatchApiResult {
  matchId: string;
  gameId: string;
  playerId: string;
  botPlayerId: string;
  wsTicket: string;
}

export interface QuickMatchErrorData {
  status: "deck-error";
  reason: "missing" | "invalid";
}

interface SerializedErrorDetails {
  name: string;
  message: string;
  code?: string;
  errno?: number | string;
  syscall?: string;
  address?: string;
  port?: number;
  stack?: string[];
  cause?: SerializedErrorDetails;
  errors?: SerializedErrorDetails[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringProperty(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function getNumberProperty(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  return typeof value === "number" ? value : undefined;
}

function splitStackLines(stack: string | undefined): string[] | undefined {
  if (!stack) return undefined;
  const lines = stack
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);
  return lines.length > 0 ? lines : undefined;
}

function serializeErrorDetails(error: unknown): SerializedErrorDetails {
  if (error instanceof Error) {
    const errorRecord = error as Error & {
      code?: string;
      errno?: number | string;
      syscall?: string;
      address?: string;
      port?: number;
      cause?: unknown;
      errors?: unknown[];
    };

    const serialized: SerializedErrorDetails = {
      name: error.name,
      message: error.message,
      stack: splitStackLines(error.stack),
    };

    if (errorRecord.code !== undefined) serialized.code = errorRecord.code;
    if (errorRecord.errno !== undefined) serialized.errno = errorRecord.errno;
    if (errorRecord.syscall !== undefined) serialized.syscall = errorRecord.syscall;
    if (errorRecord.address !== undefined) serialized.address = errorRecord.address;
    if (errorRecord.port !== undefined) serialized.port = errorRecord.port;
    if (errorRecord.cause !== undefined) {
      serialized.cause = serializeErrorDetails(errorRecord.cause);
    }
    if (Array.isArray(errorRecord.errors) && errorRecord.errors.length > 0) {
      serialized.errors = errorRecord.errors.slice(0, 5).map(serializeErrorDetails);
    }

    return serialized;
  }

  if (isRecord(error)) {
    const serialized: SerializedErrorDetails = {
      name: getStringProperty(error, "name") ?? "UnknownError",
      message: getStringProperty(error, "message") ?? String(error),
      stack: splitStackLines(getStringProperty(error, "stack")),
    };

    const code = getStringProperty(error, "code");
    const errno = error.errno;
    const syscall = getStringProperty(error, "syscall");
    const address = getStringProperty(error, "address");
    const port = getNumberProperty(error, "port");
    const cause = error.cause;
    const nestedErrors = error.errors;

    if (code !== undefined) serialized.code = code;
    if (typeof errno === "string" || typeof errno === "number") serialized.errno = errno;
    if (syscall !== undefined) serialized.syscall = syscall;
    if (address !== undefined) serialized.address = address;
    if (port !== undefined) serialized.port = port;
    if (cause !== undefined) serialized.cause = serializeErrorDetails(cause);
    if (Array.isArray(nestedErrors) && nestedErrors.length > 0) {
      serialized.errors = nestedErrors.slice(0, 5).map(serializeErrorDetails);
    }

    return serialized;
  }

  return {
    name: typeof error,
    message: String(error),
  };
}

function truncateText(value: string, maxLength = 1200): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...<truncated>`;
}

function collectRequestDebugContext(event: ServerLoadEvent): Record<string, unknown> {
  const { request, url } = event;

  return {
    requestMethod: request.method,
    requestPath: url.pathname,
    requestOrigin: url.origin,
    requestHost: request.headers.get("host") ?? undefined,
    forwardedHost: request.headers.get("x-forwarded-host") ?? undefined,
    forwardedProto: request.headers.get("x-forwarded-proto") ?? undefined,
    forwardedPort: request.headers.get("x-forwarded-port") ?? undefined,
    requestId: request.headers.get("x-request-id") ?? undefined,
    traceparent: request.headers.get("traceparent") ?? undefined,
    cfRay: request.headers.get("cf-ray") ?? undefined,
    flyRequestId: request.headers.get("fly-request-id") ?? undefined,
    vercelId: request.headers.get("x-vercel-id") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    referer: request.headers.get("referer") ?? undefined,
  };
}

function buildLocalFallbackTarget(params: {
  rawDeckParam: string;
  opponentFixtureId: string;
  strategyId: string;
  seed: string;
  unknownCards: string[];
  fallbackReason?: string;
}): string {
  const playParams = new URLSearchParams();
  playParams.set("deck", params.rawDeckParam);
  playParams.set("opponentFixtureId", params.opponentFixtureId);
  playParams.set("strategyId", params.strategyId);
  playParams.set("seed", params.seed);

  if (params.unknownCards.length > 0) {
    playParams.set("unknownCards", params.unknownCards.join("|"));
  }

  if (params.fallbackReason) {
    playParams.set("fallbackReason", params.fallbackReason);
  }

  return `/sandbox/simulator/vs-ai/quick/play?${playParams.toString()}`;
}

export async function load(event: ServerLoadEvent): Promise<QuickMatchErrorData> {
  const { url, request } = event;
  const hasDeckParam = url.searchParams.has("deck");
  const rawDeckParam = url.searchParams.get("deck")?.trim() ?? "";

  logger.trace("load() called", {
    deckParamLength: rawDeckParam.length,
    hasDeckParam,
    pathname: url.pathname,
  });

  // Step 1: Decode deck param
  if (!rawDeckParam) {
    logger.trace("no deck param", { hasDeckParam });
    return { status: "deck-error", reason: hasDeckParam ? "invalid" : "missing" };
  }

  const decoded = decodeDeckParam(rawDeckParam);
  if (!decoded) {
    logger.trace("decode failed");
    return { status: "deck-error", reason: "invalid" };
  }
  logger.trace("deck decoded", { length: decoded.length, lineCount: decoded.split("\n").length });

  // Step 2: Sanitize deck text
  const { sanitizedText, unknownCards } = await sanitizeDeckText(decoded);
  if (!sanitizedText) {
    logger.trace("sanitize produced empty text");
    return { status: "deck-error", reason: "invalid" };
  }
  logger.trace("deck sanitized", {
    cardCount: sanitizedText.split("\n").length,
    unknownCardCount: unknownCards.length,
  });

  // Step 3: Pick opponent and strategy
  const opponentFixtureIdParam = url.searchParams.get("opponentFixtureId")?.trim() ?? "";
  const strategyIdParam = url.searchParams.get("strategyId")?.trim() ?? "";

  const opponentFixture =
    (opponentFixtureIdParam
      ? DECK_FIXTURES.find((f) => f.id === opponentFixtureIdParam)
      : undefined) ?? pickRandom(DECK_FIXTURES);

  const strategy = getSafeAutomatedActionStrategyOption(strategyIdParam);

  if (!opponentFixture) {
    logger.trace("no fixture resolved");
    return { status: "deck-error", reason: "invalid" };
  }
  logger.trace("config resolved", { fixture: opponentFixture.id, strategy: strategy.id });

  const seed = createAutomatedMatchSeed();
  let fallbackReason: string | undefined;

  // Step 4: Try to create match on the server
  let serverGameId: string | undefined;
  const publicApiOrigin = getApiOrigin();
  const apiOrigin = getServerApiOrigin(publicApiOrigin);
  const apiUrl = `${apiOrigin}/v1/games/lorcana/play/quick-match`;
  const requestDebugContext = collectRequestDebugContext(event);
  const cookie = request.headers.get("cookie") ?? "";
  const startedAt = Date.now();
  const matchDebugContext = {
    deckEntryCount: sanitizedText.split("\n").length,
    decodedDeckLength: decoded.length,
    firstDeckLine: sanitizedText.split("\n")[0] ?? "",
    hasDeckParam,
    opponentFixtureId: opponentFixture.id,
    publicApiOrigin,
    rawDeckParamLength: rawDeckParam.length,
    sanitizedDeckLength: sanitizedText.length,
    strategyId: strategy.id,
    unknownCardCount: unknownCards.length,
    unknownCards,
    usingPrivateApiOrigin: apiOrigin !== publicApiOrigin,
  };
  try {
    logger.trace("calling API", { apiOrigin, hasCookie: !!cookie });

    const result = await serverJsonOrNull<QuickMatchApiResult>(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify({
        gameType: "lorcana",
        playerDeckText: sanitizedText,
        botDeckText: opponentFixture.cards,
        botFixtureId: opponentFixture.id,
        botStrategyId: strategy.id,
      }),
    });

    if (result) {
      serverGameId = result.gameId;
      logger.trace("API success", { gameId: serverGameId, matchId: result.matchId });
    } else {
      fallbackReason = "api-status-error";
      console.error("[quick-match/create] Falling back to local mode after API error", {
        ...matchDebugContext,
        fallbackReason,
        apiDurationMs: Date.now() - startedAt,
        apiUrl,
        hasCookie: !!cookie,
        cookieByteLength: cookie.length,
        request: requestDebugContext,
        response: {
          status: "unknown",
          bodyPreview: "Request returned a non-OK response",
        },
      });
    }
  } catch (error) {
    fallbackReason = "api-unavailable";
    console.error("[quick-match/create] Falling back to local mode after API request failure", {
      ...matchDebugContext,
      fallbackReason,
      apiDurationMs: Date.now() - startedAt,
      apiUrl,
      hasCookie: !!cookie,
      cookieByteLength: cookie.length,
      request: requestDebugContext,
      error: serializeErrorDetails(error),
    });
  }

  // Step 5: Redirect to the appropriate play route
  if (serverGameId) {
    const target = `/sandbox/simulator/vs-ai/quick/play/${serverGameId}`;
    logger.trace("redirecting to server match", { target });
    redirect(303, target);
  }

  // Local fallback — pass config via query params
  const target = buildLocalFallbackTarget({
    rawDeckParam,
    opponentFixtureId: opponentFixture.id,
    strategyId: strategy.id,
    seed,
    unknownCards,
    fallbackReason,
  });
  logger.trace("redirecting to local fallback", {
    fallbackReason,
    target: target.slice(0, 120),
  });
  redirect(303, target);
}
