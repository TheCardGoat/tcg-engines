import { afterEach, beforeAll, describe, expect, it, mock } from "bun:test";

const privateEnv: Record<string, string | undefined> = {};
const errorLogMock = mock();
const noopLogMock = mock();
mock.module("$env/dynamic/private", () => ({ env: privateEnv }));
mock.module("@logtape/logtape", () => ({
  getLogger: () => ({
    trace: noopLogMock,
    debug: noopLogMock,
    info: noopLogMock,
    warn: noopLogMock,
    warning: noopLogMock,
    error: errorLogMock,
    fatal: noopLogMock,
  }),
}));

let serverFetch: typeof import("./fetch-with-cf.js").serverFetch;
let ServerFetchError: typeof import("./fetch-with-cf.js").ServerFetchError;
const originalFetch = globalThis.fetch;
const originalAbortSignalTimeout = AbortSignal.timeout;

beforeAll(async () => {
  ({ serverFetch, ServerFetchError } = await import("./fetch-with-cf.js"));
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  AbortSignal.timeout = originalAbortSignalTimeout;
  errorLogMock.mockClear();
  noopLogMock.mockClear();
});

describe("serverFetch", () => {
  it("retries an idempotent request after a network failure", async () => {
    let attempts = 0;
    globalThis.fetch = mock(async () => {
      attempts += 1;
      if (attempts === 1) throw new TypeError("fetch failed");
      return new Response("ok");
    }) as unknown as typeof fetch;

    const response = await serverFetch("http://api.internal/health");

    expect(await response.text()).toBe("ok");
    expect(attempts).toBe(2);
  });

  it("retries a transient upstream response", async () => {
    let attempts = 0;
    globalThis.fetch = mock(async () => {
      attempts += 1;
      return attempts === 1 ? new Response(null, { status: 503 }) : new Response("ok");
    }) as unknown as typeof fetch;

    const response = await serverFetch("http://api.internal/health");

    expect(response.status).toBe(200);
    expect(attempts).toBe(2);
    expect(errorLogMock).not.toHaveBeenCalled();
  });

  it("logs a transient upstream status after retries are exhausted", async () => {
    globalThis.fetch = mock(
      async () => new Response(null, { status: 503, statusText: "Busy" }),
    ) as unknown as typeof fetch;

    const response = await serverFetch("http://api.internal/context");

    expect(response.status).toBe(503);
    expect(errorLogMock).toHaveBeenCalledTimes(1);
    expect(errorLogMock.mock.calls[0]?.[1]).toMatchObject({
      method: "GET",
      url: "http://api.internal/context",
      status: 503,
      statusText: "Busy",
      attempts: 2,
    });
  });

  it("does not retry mutations", async () => {
    let attempts = 0;
    globalThis.fetch = mock(async () => {
      attempts += 1;
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    await expect(
      serverFetch("http://api.internal/matches", { method: "POST" }),
    ).rejects.toBeInstanceOf(ServerFetchError);
    expect(attempts).toBe(1);
  });

  it("does not retry after the effective timeout signal aborts", async () => {
    let attempts = 0;
    AbortSignal.timeout = mock(() =>
      AbortSignal.abort(new DOMException("Timed out", "TimeoutError")),
    );
    globalThis.fetch = mock(async (_input, init) => {
      attempts += 1;
      if (init?.signal?.aborted) {
        throw init.signal.reason;
      }
      return new Response("unexpected");
    }) as unknown as typeof fetch;

    let thrown: unknown;
    try {
      await serverFetch("http://api.internal/hung");
    } catch (cause) {
      thrown = cause;
    }

    expect(thrown).toBeInstanceOf(ServerFetchError);
    expect(thrown).toMatchObject({ attempts: 1 });
    expect(attempts).toBe(1);
  });

  it("logs the request and original cause after the final failure", async () => {
    const socketError = Object.assign(new Error("other side closed"), {
      code: "UND_ERR_SOCKET",
    });
    globalThis.fetch = mock(async () => {
      throw new TypeError("fetch failed", { cause: socketError });
    }) as unknown as typeof fetch;

    await expect(
      serverFetch("http://api.internal/context", { method: "POST" }),
    ).rejects.toBeInstanceOf(ServerFetchError);

    expect(errorLogMock).toHaveBeenCalledTimes(1);
    expect(errorLogMock.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
      url: "http://api.internal/context",
      attempts: 1,
      aborted: false,
      timedOut: false,
      error: {
        name: "TypeError",
        message: "fetch failed",
        cause: {
          name: "Error",
          message: "other side closed",
          code: "UND_ERR_SOCKET",
        },
      },
    });
  });
});
