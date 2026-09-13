import type { PlayAdapter } from "./types.ts";

/**
 * Lazy loaders keep unused game engines out of the process until selected.
 * Register additional games here without changing the CLI dispatch surface.
 */
const ADAPTER_LOADERS = {
  "one-piece": async () => (await import("./adapters/one-piece.ts")).onePiecePlayAdapter,
} as const satisfies Readonly<Record<string, () => Promise<PlayAdapter>>>;

export type PlayCliGame = keyof typeof ADAPTER_LOADERS;

export async function getPlayAdapter(game: string): Promise<PlayAdapter> {
  const loader = ADAPTER_LOADERS[game as PlayCliGame];
  if (!loader) {
    throw new Error(
      `No play-cli adapter registered for ${game}. Registered: ${listPlayGames().join(", ") || "none"}`,
    );
  }
  return loader();
}

export function listPlayGames(): readonly PlayCliGame[] {
  return Object.keys(ADAPTER_LOADERS).sort() as PlayCliGame[];
}

export function isPlayGame(game: string): game is PlayCliGame {
  return Object.hasOwn(ADAPTER_LOADERS, game);
}
