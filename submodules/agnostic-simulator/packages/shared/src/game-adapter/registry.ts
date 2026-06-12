import type { GameAdapter, ServerGameAdapter } from "./types.js";

const adapters = new Map<string, GameAdapter>();

/**
 * Register a {@link GameAdapter}. Idempotent — calling twice with the same
 * slug overwrites the prior registration. Apps register their adapters at
 * startup before any match/queue traffic flows.
 */
export function registerGameAdapter(adapter: GameAdapter): void {
  adapters.set(adapter.slug, adapter);
}

/**
 * Look up an adapter by slug. Throws when no adapter is registered for the
 * slug — call sites should rely on the `requireGameCapability` middleware to
 * 404 unknown games before reaching service code.
 */
export function getGameAdapter(slug: string): GameAdapter {
  const adapter = adapters.get(slug);
  if (!adapter) {
    throw new Error(
      `No GameAdapter registered for slug "${slug}". Did the host app forget to call registerGameAdapter on startup?`,
    );
  }
  return adapter;
}

export function hasGameAdapter(slug: string): boolean {
  return adapters.has(slug);
}

export function listGameAdapters(): GameAdapter[] {
  return [...adapters.values()];
}

/**
 * Look up an adapter by slug and assert it implements the server-engine
 * methods. Throws when the adapter is missing or doesn't support hosting
 * authoritative play. Use this from game-server code paths so the type
 * system carries the non-optional engine methods.
 */
export function requireServerGameAdapter(slug: string): ServerGameAdapter {
  const adapter = getGameAdapter(slug);
  if (
    !adapter.createServerEngine ||
    !adapter.serializeEngine ||
    !adapter.restoreEngine ||
    !adapter.extractCardsMapsFromSnapshot
  ) {
    throw new Error(
      `GameAdapter "${slug}" does not implement the server-engine methods required to host authoritative play.`,
    );
  }
  return adapter as ServerGameAdapter;
}

/**
 * Test-only: clear the registry between test runs so adapters from a prior
 * suite don't leak into the next.
 */
export function __resetGameAdapterRegistryForTests(): void {
  adapters.clear();
}
