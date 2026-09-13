import { redirect } from "@sveltejs/kit";
import { base } from "$app/paths";
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
  opponentFixtureId?: string;
  opponentDeckParam?: string;
  strategyId: string;
  seed: string;
  unknownCards: string[];
  fallbackReason?: string;
  returnTo?: string;
}): string {
  const playParams = new URLSearchParams();
  playParams.set("deck", params.rawDeckParam);
  if (params.opponentFixtureId) playParams.set("opponentFixtureId", params.opponentFixtureId);
  if (params.opponentDeckParam) playParams.set("opponentDeck", params.opponentDeckParam);
  playParams.set("strategyId", params.strategyId);
  playParams.set("seed", params.seed);

  if (params.unknownCards.length > 0) {
    playParams.set("unknownCards", params.unknownCards.join("|"));
  }

  if (params.fallbackReason) {
    playParams.set("fallbackReason", params.fallbackReason);
  }
  if (params.returnTo) {
    playParams.set("returnTo", params.returnTo);
  }

  return `${base}/sandbox/simulator/vs-ai/quick/play?${playParams.toString()}`;
}

export async function load(event: ServerLoadEvent): Promise<QuickMatchErrorData> {
  const { url, request } = event;
  const hasDeckParam = url.searchParams.has("deck");
  const rawDeckParam = url.searchParams.get("deck")?.trim() ?? "";
  const playerFixtureId = url.searchParams.get("playerFixtureId")?.trim() ?? "";
  const returnTo = url.searchParams.get("returnTo")?.trim() ?? "";

  logger.trace("load() called", {
    deckParamLength: rawDeckParam.length,
    hasDeckParam,
    playerFixtureId: playerFixtureId || null,
    pathname: url.pathname,
  });

  // Step 1: Resolve either a supplied deck or a trusted starter fixture.
  const playerFixture = playerFixtureId
    ? DECK_FIXTURES.find((fixture) => fixture.id === playerFixtureId)
    : undefined;
  if (!rawDeckParam && !playerFixture) {
    logger.trace("no player deck resolved", { hasDeckParam, playerFixtureId });
    return {
      status: "deck-error",
      reason: hasDeckParam || playerFixtureId ? "invalid" : "missing",
    };
  }

  const decoded = rawDeckParam ? decodeDeckParam(rawDeckParam) : (playerFixture?.cards ?? null);
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
    playerFixtureId: playerFixture?.id ?? null,
    unknownCardCount: unknownCards.length,
  });

  const fallbackDeckParam =
    rawDeckParam || Buffer.from(sanitizedText, "utf-8").toString("base64url");

  // Step 3: Pick opponent and strategy
  const opponentFixtureIdParam = url.searchParams.get("opponentFixtureId")?.trim() ?? "";
  const opponentDeckParam = url.searchParams.get("opponentDeck")?.trim() ?? "";
  const strategyIdParam = url.searchParams.get("strategyId")?.trim() ?? "";

  const opponentDeck = opponentDeckParam ? decodeDeckParam(opponentDeckParam) : null;
  const sanitizedOpponentDeck = opponentDeck
    ? await sanitizeDeckText(opponentDeck)
    : { sanitizedText: "" };
  if (opponentDeckParam && !sanitizedOpponentDeck.sanitizedText) {
    return { status: "deck-error", reason: "invalid" };
  }
  const opponentFixture = sanitizedOpponentDeck.sanitizedText
    ? undefined
    : ((opponentFixtureIdParam
        ? DECK_FIXTURES.find((f) => f.id === opponentFixtureIdParam)
        : undefined) ?? pickRandom(DECK_FIXTURES));

  const strategy = getSafeAutomatedActionStrategyOption(strategyIdParam);

  if (!opponentFixture && !sanitizedOpponentDeck.sanitizedText) {
    logger.trace("no fixture resolved");
    return { status: "deck-error", reason: "invalid" };
  }
  logger.trace("config resolved", {
    fixture: opponentFixture?.id ?? null,
    customOpponentDeck: Boolean(sanitizedOpponentDeck.sanitizedText),
    strategy: strategy.id,
  });

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
    playerFixtureId: playerFixture?.id ?? null,
    opponentFixtureId: opponentFixture?.id ?? null,
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

    const idempotencyKey = crypto.randomUUID();
    const requestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify({
        gameType: "lorcana",
        playerDeckText: sanitizedText,
        ...(sanitizedOpponentDeck.sanitizedText
          ? { botDeckText: sanitizedOpponentDeck.sanitizedText }
          : { botDeckText: opponentFixture!.cards, botFixtureId: opponentFixture!.id }),
        botStrategyId: strategy.id,
      }),
    } satisfies RequestInit;
    let result: QuickMatchApiResult | null = null;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        result = await serverJsonOrNull<QuickMatchApiResult>(apiUrl, requestInit);
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        logger.warn("quick-match API request failed; retrying idempotently", {
          attempt,
        });
      }
    }

    if (result) {
      serverGameId = result.gameId;
      logger.trace("API success", { gameId: serverGameId, matchId: result.matchId });
    } else {
      fallbackReason = "api-status-error";
      console.warn("[quick-match/create] Falling back to local mode after API error", {
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
    console.warn("[quick-match/create] Falling back to local mode after API request failure", {
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
    const targetUrl = new URL(
      `${base}/sandbox/simulator/vs-ai/quick/play/${encodeURIComponent(serverGameId)}`,
      url.origin,
    );
    if (returnTo) targetUrl.searchParams.set("returnTo", returnTo);
    const target = `${targetUrl.pathname}${targetUrl.search}`;
    logger.trace("redirecting to server match", { target });
    redirect(303, target);
  }

  // Local fallback — pass config via query params
  const target = buildLocalFallbackTarget({
    rawDeckParam: fallbackDeckParam,
    opponentFixtureId: opponentFixture?.id,
    opponentDeckParam: sanitizedOpponentDeck.sanitizedText ? opponentDeckParam : undefined,
    strategyId: strategy.id,
    seed,
    unknownCards,
    fallbackReason,
    returnTo: returnTo || undefined,
  });
  logger.trace("redirecting to local fallback", {
    fallbackReason,
    target: target.slice(0, 120),
  });
  redirect(303, target);
}
