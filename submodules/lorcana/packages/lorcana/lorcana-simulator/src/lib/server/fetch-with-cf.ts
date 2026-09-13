import { env } from "$env/dynamic/private";
import { getLogger } from "@logtape/logtape";
import { serializeErrorDetails } from "./error-details.js";
import { validateAndNormalizePrivateApiOrigin } from "./fetch-with-cf-utils.js";

const SERVER_FETCH_TIMEOUT_MS = 5_000;
const SERVER_FETCH_RETRY_DELAY_MS = 100;
const RETRYABLE_STATUSES = new Set([502, 503, 504]);
const serverFetchLogger = getLogger(["tcg", "core-simulator", "server-fetch"]);

export class ServerFetchError extends Error {
  constructor(
    readonly url: string,
    readonly attempts: number,
    options: ErrorOptions,
  ) {
    super(`Server request failed after ${attempts} attempt${attempts === 1 ? "" : "s"}`, options);
    this.name = "ServerFetchError";
  }
}

function getClientId(): string | undefined {
  return env.CF_ACCESS_CLIENT_ID ?? env["CF-ACCESS-CLIENT-ID"];
}

function getClientSecret(): string | undefined {
  return env.CF_ACCESS_CLIENT_SECRET ?? env["CF-ACCESS-CLIENT-SECRET"];
}

function getInternalServiceToken(): string | undefined {
  return env.INTERNAL_SERVICE_TOKEN;
}

export function getServerApiOrigin(publicOrigin: string): string {
  const privateOrigin = env.PRIVATE_API_URL?.trim();
  return privateOrigin ? validateAndNormalizePrivateApiOrigin(privateOrigin) : publicOrigin;
}

export function getServerGameServerOrigin(publicOrigin: string): string {
  const privateOrigin = env.PRIVATE_GAME_SERVER_URL?.trim();
  return privateOrigin ? validateAndNormalizePrivateApiOrigin(privateOrigin) : publicOrigin;
}

function isRetryableMethod(method: string | undefined): boolean {
  return method === undefined || method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD";
}

function createRequestSignal(callerSignal: AbortSignal | null | undefined): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(SERVER_FETCH_TIMEOUT_MS);
  return callerSignal ? AbortSignal.any([callerSignal, timeoutSignal]) : timeoutSignal;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function serverFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = init?.headers ? new Headers(init.headers) : new Headers();
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  const internalToken = getInternalServiceToken();

  if (clientId && clientSecret) {
    headers.set("CF-Access-Client-Id", clientId);
    headers.set("CF-Access-Client-Secret", clientSecret);
  }

  if (internalToken) {
    headers.set("X-Internal-Token", internalToken);
  }

  const retryable = isRetryableMethod(init?.method);
  const maxAttempts = retryable ? 2 : 1;
  const signal = createRequestSignal(init?.signal);
  const method = init?.method?.toUpperCase() ?? "GET";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        headers,
        signal,
      });

      if (attempt < maxAttempts && RETRYABLE_STATUSES.has(response.status)) {
        await response.body?.cancel();
        await delay(SERVER_FETCH_RETRY_DELAY_MS);
        continue;
      }

      if (RETRYABLE_STATUSES.has(response.status)) {
        serverFetchLogger.error(
          "serverFetch upstream response failed method={method} url={url} status={status} attempts={attempts}",
          {
            method,
            url,
            status: response.status,
            statusText: response.statusText,
            attempts: attempt,
          },
        );
      }

      return response;
    } catch (cause) {
      if (signal.aborted || attempt === maxAttempts) {
        serverFetchLogger.error(
          "serverFetch request failed method={method} url={url} attempts={attempts} aborted={aborted} error={error}",
          {
            method,
            url,
            attempts: attempt,
            aborted: signal.aborted,
            callerAborted: init?.signal?.aborted ?? false,
            timedOut: signal.aborted && !init?.signal?.aborted,
            error: serializeErrorDetails(cause),
          },
        );
        throw new ServerFetchError(url, attempt, { cause });
      }
      await delay(SERVER_FETCH_RETRY_DELAY_MS);
    }
  }

  throw new ServerFetchError(url, maxAttempts, {
    cause: new Error("Server request exhausted without a response"),
  });
}
