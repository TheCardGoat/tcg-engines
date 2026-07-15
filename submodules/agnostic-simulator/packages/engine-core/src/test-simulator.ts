import type { PlayableGameSlug } from "@tcg/protocol/games";

export const TEST_SIMULATOR_SNAPSHOT_VERSION = 1;
export const TEST_SIMULATOR_VISUAL_TEST_FIXTURE_ID = "test-engine-state";
export const DEFAULT_TEST_SIMULATOR_BASE_URL = "http://localhost:5173";
export const DEFAULT_MAX_URL_STATE_LENGTH = 8_000;
const DEFAULT_HANDOFF_TTL_MS = 120_000;
const HANDOFF_PORT_MIN = 49_152;
const HANDOFF_PORT_RANGE = 16_384;

export type TestSimulatorGameSlug = Extract<PlayableGameSlug, "cyberpunk" | "gundam" | "one-piece">;

export interface TestSimulatorSnapshotEnvelope<TPayload = unknown> {
  readonly version: typeof TEST_SIMULATOR_SNAPSHOT_VERSION;
  readonly gameSlug: TestSimulatorGameSlug;
  readonly createdAt: string;
  readonly viewer?: string;
  readonly payload: TPayload;
}

export interface OpenInSimulatorOptions {
  readonly open?: boolean;
  readonly viewer?: string;
  readonly baseUrl?: string;
  readonly maxUrlStateLength?: number;
}

export interface OpenInSimulatorResult {
  readonly url: string;
  readonly transport: "query" | "handoff";
  readonly ready?: Promise<void>;
  readonly dispose?: () => void;
}

export interface CreateTestSimulatorEnvelopeInput<TPayload> {
  readonly gameSlug: TestSimulatorGameSlug;
  readonly payload: TPayload;
  readonly viewer?: string;
}

export function createTestSimulatorEnvelope<TPayload>(
  input: CreateTestSimulatorEnvelopeInput<TPayload>,
): TestSimulatorSnapshotEnvelope<TPayload> {
  return {
    version: TEST_SIMULATOR_SNAPSHOT_VERSION,
    gameSlug: input.gameSlug,
    createdAt: new Date().toISOString(),
    ...(input.viewer ? { viewer: input.viewer } : {}),
    payload: input.payload,
  };
}

export function encodeTestSimulatorEnvelope(envelope: TestSimulatorSnapshotEnvelope): string {
  const { gzipSync } = nodeBuiltin<typeof import("node:zlib")>("node:zlib");
  const json = JSON.stringify(envelope);
  return bytesToBase64Url(gzipSync(Buffer.from(json, "utf8")));
}

export function decodeTestSimulatorEnvelope(value: string): TestSimulatorSnapshotEnvelope {
  const { gunzipSync } = nodeBuiltin<typeof import("node:zlib")>("node:zlib");
  const bytes = base64UrlToBytes(value);
  const json = gunzipSync(bytes).toString("utf8");
  const parsed = JSON.parse(json) as Partial<TestSimulatorSnapshotEnvelope>;
  if (parsed.version !== TEST_SIMULATOR_SNAPSHOT_VERSION) {
    throw new Error(`Unsupported test simulator snapshot version: ${String(parsed.version)}`);
  }
  if (!parsed.gameSlug || typeof parsed.createdAt !== "string" || !("payload" in parsed)) {
    throw new Error("Malformed test simulator snapshot.");
  }
  return parsed as TestSimulatorSnapshotEnvelope;
}

export function openTestSimulatorSnapshot<TPayload>(
  input: CreateTestSimulatorEnvelopeInput<TPayload>,
  options: OpenInSimulatorOptions = {},
): OpenInSimulatorResult {
  const envelope = createTestSimulatorEnvelope({
    ...input,
    viewer: options.viewer ?? input.viewer,
  });
  const encoded = encodeTestSimulatorEnvelope(envelope);
  const baseUrl = normalizeBaseUrl(
    options.baseUrl ?? process.env.TCG_SIMULATOR_URL ?? DEFAULT_TEST_SIMULATOR_BASE_URL,
  );
  const maxUrlStateLength = options.maxUrlStateLength ?? DEFAULT_MAX_URL_STATE_LENGTH;

  const result =
    encoded.length <= maxUrlStateLength
      ? buildQueryResult(baseUrl, envelope.gameSlug, encoded)
      : buildHandoffResult(baseUrl, envelope.gameSlug, encoded);

  if (shouldOpenInSimulator(options)) {
    if (result.ready) {
      result.ready.then(() => openExternalUrl(result.url)).catch(() => {});
    } else {
      openExternalUrl(result.url);
    }
  }

  return result;
}

function shouldOpenInSimulator(options: OpenInSimulatorOptions): boolean {
  return options.open ?? !globalThis.process?.env?.CI;
}

export function unsupportedTestSimulatorResult(gameSlug: string): never {
  throw new Error(`Simulator not mounted for ${gameSlug} yet`);
}

function buildQueryResult(
  baseUrl: string,
  gameSlug: TestSimulatorGameSlug,
  encoded: string,
): OpenInSimulatorResult {
  return {
    url:
      `${baseUrl}/${gameSlug}/simulator/tests/${TEST_SIMULATOR_VISUAL_TEST_FIXTURE_ID}` +
      `?state=${encodeURIComponent(encoded)}`,
    transport: "query",
  };
}

function buildHandoffResult(
  baseUrl: string,
  gameSlug: TestSimulatorGameSlug,
  encoded: string,
): OpenInSimulatorResult {
  const { randomUUID } = nodeBuiltin<typeof import("node:crypto")>("node:crypto");
  const token = randomUUID();
  const server = createHandoffServer(token, encoded);
  const port = HANDOFF_PORT_MIN + Math.floor(Math.random() * HANDOFF_PORT_RANGE);
  const ready = new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  ready.catch(() => {});
  server.listen(port, "127.0.0.1");

  const from = `http://127.0.0.1:${port}`;
  const timeout = setTimeout(() => {
    server.close();
  }, DEFAULT_HANDOFF_TTL_MS);
  timeout.unref();

  return {
    url:
      `${baseUrl}/${gameSlug}/simulator/tests/${TEST_SIMULATOR_VISUAL_TEST_FIXTURE_ID}` +
      `?handoff=${encodeURIComponent(token)}&from=${encodeURIComponent(from)}`,
    transport: "handoff",
    ready,
    dispose: () => {
      clearTimeout(timeout);
      server.close();
    },
  };
}

function createHandoffServer(token: string, encoded: string): import("node:http").Server {
  const { createServer } = nodeBuiltin<typeof import("node:http")>("node:http");
  return createServer((request, response) => {
    response.setHeader("access-control-allow-origin", "*");
    response.setHeader("access-control-allow-methods", "GET, OPTIONS");
    response.setHeader("access-control-allow-headers", "content-type");
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method !== "GET" || requestUrl.pathname !== `/${token}`) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(JSON.stringify({ state: encoded }));
  });
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/u, "");
}

function bytesToBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/gu, "-")
    .replace(/\//gu, "_")
    .replace(/=+$/u, "");
}

function base64UrlToBytes(value: string): Buffer {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) {
    throw new Error("Invalid base64url test simulator snapshot.");
  }
  const base64 =
    value.replace(/-/gu, "+").replace(/_/gu, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  return Buffer.from(base64, "base64");
}

function openExternalUrl(url: string): void {
  const { platform } = nodeBuiltin<typeof import("node:os")>("node:os");
  const { spawn } = nodeBuiltin<typeof import("node:child_process")>("node:child_process");
  const os = platform();
  const command =
    os === "darwin"
      ? { cmd: "open", args: [url] }
      : os === "win32"
        ? { cmd: "cmd", args: ["/c", "start", "", url] }
        : { cmd: "xdg-open", args: [url] };
  const child = spawn(command.cmd, command.args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

function nodeBuiltin<TModule>(specifier: string): TModule {
  const module = globalThis.process?.getBuiltinModule?.(specifier);
  if (!module) {
    throw new Error("Test simulator helpers that encode or open snapshots must run in Node.");
  }
  return module as TModule;
}
