import { gunzipSync, strFromU8 } from "fflate";
import type { GameSlug } from "@tcg/simulator-contract";

export const TEST_SIMULATOR_SNAPSHOT_VERSION = 1;

export type TestSimulatorGameSlug = Extract<GameSlug, "cyberpunk" | "gundam" | "one-piece">;

export interface TestSimulatorSnapshotEnvelope<TPayload = unknown> {
  readonly version: typeof TEST_SIMULATOR_SNAPSHOT_VERSION;
  readonly gameSlug: TestSimulatorGameSlug;
  readonly createdAt: string;
  readonly viewer?: string;
  readonly payload: TPayload;
}

export type TestStateLoadResult<TPayload> =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly envelope: TestSimulatorSnapshotEnvelope<TPayload> }
  | { readonly status: "error"; readonly message: string };

export async function loadTestSimulatorState<TPayload>(
  gameSlug: TestSimulatorGameSlug,
  search: string,
): Promise<TestSimulatorSnapshotEnvelope<TPayload>> {
  if (!import.meta.env.DEV) {
    throw new Error("Test simulator state routes are only available in development.");
  }

  const params = new URLSearchParams(search);
  const inlineState = params.get("state");
  const encoded = inlineState ?? (await loadHandoffState(params));
  const envelope = decodeTestSimulatorEnvelope<TPayload>(encoded);
  if (envelope.gameSlug !== gameSlug) {
    throw new Error(`Test simulator payload is for ${envelope.gameSlug}, not ${gameSlug}.`);
  }
  return envelope;
}

export function decodeTestSimulatorEnvelope<TPayload>(
  value: string,
): TestSimulatorSnapshotEnvelope<TPayload> {
  const bytes = base64UrlToBytes(value);
  const json = strFromU8(gunzipSync(bytes));
  const parsed = JSON.parse(json) as Partial<TestSimulatorSnapshotEnvelope<TPayload>>;
  if (parsed.version !== TEST_SIMULATOR_SNAPSHOT_VERSION) {
    throw new Error(`Unsupported test simulator snapshot version: ${String(parsed.version)}`);
  }
  if (!parsed.gameSlug || !parsed.createdAt || !("payload" in parsed)) {
    throw new Error("Malformed test simulator snapshot.");
  }
  return parsed as TestSimulatorSnapshotEnvelope<TPayload>;
}

async function loadHandoffState(params: URLSearchParams): Promise<string> {
  const handoff = params.get("handoff");
  const from = params.get("from");
  if (!handoff || !from) {
    throw new Error("Missing test simulator state payload.");
  }

  const cacheKey = `tcg.test-simulator-state.${handoff}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return cached;
  }

  const origin = new URL(from);
  if (origin.protocol !== "http:" || origin.hostname !== "127.0.0.1") {
    throw new Error("Test simulator handoff must come from localhost.");
  }
  const response = await fetch(`${origin.origin}/${encodeURIComponent(handoff)}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Test simulator handoff failed with HTTP ${response.status}.`);
  }
  const body = (await response.json()) as { state?: unknown };
  if (typeof body.state !== "string") {
    throw new Error("Test simulator handoff response did not include state.");
  }
  sessionStorage.setItem(cacheKey, body.state);
  return body.state;
}

function base64UrlToBytes(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) {
    throw new Error("Invalid base64url test simulator snapshot.");
  }
  const base64 =
    value.replace(/-/gu, "+").replace(/_/gu, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}
