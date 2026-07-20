import type { BotLabAdapter } from "./adapter.ts";

const ADAPTER_LOADERS = {
  cyberpunk: async () => (await import("./adapters/cyberpunk.ts")).cyberpunkBotLabAdapter,
  gundam: async () => (await import("./adapters/gundam.ts")).gundamBotLabAdapter,
  lorcana: async () => (await import("./adapters/lorcana.ts")).lorcanaBotLabAdapter,
  "one-piece": async () => (await import("./adapters/one-piece.ts")).onePieceBotLabAdapter,
} as const satisfies Readonly<Record<string, () => Promise<BotLabAdapter>>>;

export type BotLabGame = keyof typeof ADAPTER_LOADERS;

export async function getBotLabAdapter(game: string): Promise<BotLabAdapter> {
  const loader = ADAPTER_LOADERS[game as BotLabGame];
  if (!loader) throw new Error(`No bot-lab adapter registered for ${game}`);
  return loader();
}

export function listBotLabGames(): readonly BotLabGame[] {
  return Object.keys(ADAPTER_LOADERS).sort() as BotLabGame[];
}
