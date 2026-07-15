import { createDefaultAutomatedMatchConfig } from "./config.js";
import { getSafeAutomatedActionStrategyOption } from "@tcg/lorcana-engine";
import type { AutomatedMatchConfig } from "./types.js";

export type AutomatedMatchStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;

export const AUTOMATED_MATCH_STORAGE_KEY = "lorcana.simulator.aiMatch.config";

type StoredAutomatedMatchConfig = Partial<Record<keyof AutomatedMatchConfig, string | undefined>>;

function getDefaultConfig(): AutomatedMatchConfig {
  return createDefaultAutomatedMatchConfig();
}

function normalizeStoredAutomatedMatchConfig(
  value: StoredAutomatedMatchConfig,
): AutomatedMatchConfig | null {
  const playerOneDeckText = value.playerOneDeckText?.trim();
  const playerTwoDeckText = value.playerTwoDeckText?.trim();
  const playerOneStrategyId = value.playerOneStrategyId?.trim();
  const playerTwoStrategyId = value.playerTwoStrategyId?.trim();
  const seed = value.seed?.trim();

  if (
    !playerOneDeckText ||
    !playerTwoDeckText ||
    !playerOneStrategyId ||
    !playerTwoStrategyId ||
    !seed
  ) {
    return null;
  }

  return {
    playerOneDeckText,
    playerTwoDeckText,
    playerOneFixtureId: value.playerOneFixtureId?.trim() || undefined,
    playerTwoFixtureId: value.playerTwoFixtureId?.trim() || undefined,
    playerOneStrategyId: getSafeAutomatedActionStrategyOption(playerOneStrategyId).id,
    playerTwoStrategyId: getSafeAutomatedActionStrategyOption(playerTwoStrategyId).id,
    seed,
  };
}

function resolveAutomatedMatchStorage(
  storage?: AutomatedMatchStorage,
): AutomatedMatchStorage | null {
  if (storage) {
    return storage;
  }

  if (typeof localStorage === "undefined") {
    return null;
  }

  return localStorage;
}

export function readStoredAutomatedMatchConfig(
  storage?: AutomatedMatchStorage,
): AutomatedMatchConfig | null {
  const resolvedStorage = resolveAutomatedMatchStorage(storage);
  if (!resolvedStorage) {
    return null;
  }

  const rawValue = resolvedStorage.getItem(AUTOMATED_MATCH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as StoredAutomatedMatchConfig;
    return normalizeStoredAutomatedMatchConfig(parsedValue);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to parse stored automated match config.", error);
    }

    return null;
  }
}

export function loadAutomatedMatchConfig(storage?: AutomatedMatchStorage): AutomatedMatchConfig {
  return readStoredAutomatedMatchConfig(storage) ?? getDefaultConfig();
}

export function saveAutomatedMatchConfig(
  config: AutomatedMatchConfig,
  storage?: AutomatedMatchStorage,
): void {
  const resolvedStorage = resolveAutomatedMatchStorage(storage);
  if (!resolvedStorage) {
    return;
  }

  resolvedStorage.setItem(AUTOMATED_MATCH_STORAGE_KEY, JSON.stringify(config));
}

export function clearAutomatedMatchConfig(storage?: AutomatedMatchStorage): void {
  const resolvedStorage = resolveAutomatedMatchStorage(storage);
  if (!resolvedStorage) {
    return;
  }

  resolvedStorage.removeItem(AUTOMATED_MATCH_STORAGE_KEY);
}
