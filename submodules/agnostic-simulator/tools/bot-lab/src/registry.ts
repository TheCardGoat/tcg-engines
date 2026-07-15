import type { BotLabAdapter } from "./adapter.ts";

const ADAPTERS = new Map<string, BotLabAdapter>();

export function registerBotLabAdapter(adapter: BotLabAdapter): void {
  if (ADAPTERS.has(adapter.game)) throw new Error(`Duplicate bot-lab adapter: ${adapter.game}`);
  ADAPTERS.set(adapter.game, adapter);
}

export function getBotLabAdapter(game: string): BotLabAdapter {
  const adapter = ADAPTERS.get(game);
  if (!adapter) throw new Error(`No bot-lab adapter registered for ${game}`);
  return adapter;
}

export function listBotLabAdapters(): readonly BotLabAdapter[] {
  return [...ADAPTERS.values()].sort((left, right) => left.game.localeCompare(right.game));
}
