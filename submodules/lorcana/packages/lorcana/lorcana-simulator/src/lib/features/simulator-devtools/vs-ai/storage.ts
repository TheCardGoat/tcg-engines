import { createDefaultAutomatedMatchConfig } from "../ai-match/config.js";
import { getSafeAutomatedActionStrategyOption } from "@tcg/lorcana-engine";
import type { HumanVsAiMatchConfig } from "./types.js";

export type HumanVsAiStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;

export const HUMAN_VS_AI_STORAGE_KEY = "lorcana.simulator.vsAi.config";

type StoredHumanVsAiConfig = Partial<Record<keyof HumanVsAiMatchConfig, string | undefined>>;

function createDefaultHumanVsAiConfig(): HumanVsAiMatchConfig {
  const base = createDefaultAutomatedMatchConfig();
  return {
    playerOneDeckText: base.playerOneDeckText,
    playerTwoDeckText: base.playerTwoDeckText,
    playerOneFixtureId: base.playerOneFixtureId,
    playerTwoFixtureId: base.playerTwoFixtureId,
    strategyId: base.playerTwoStrategyId,
    seed: base.seed,
  };
}

function normalizeStoredConfig(value: StoredHumanVsAiConfig): HumanVsAiMatchConfig | null {
  const playerOneDeckText = value.playerOneDeckText?.trim();
  const playerTwoDeckText = value.playerTwoDeckText?.trim();
  const strategyId = value.strategyId?.trim();
  const seed = value.seed?.trim();

  if (!playerOneDeckText || !playerTwoDeckText || !strategyId || !seed) {
    return null;
  }

  return {
    playerOneDeckText,
    playerTwoDeckText,
    playerOneFixtureId: value.playerOneFixtureId?.trim() || undefined,
    playerTwoFixtureId: value.playerTwoFixtureId?.trim() || undefined,
    strategyId: getSafeAutomatedActionStrategyOption(strategyId).id,
    seed,
  };
}

function resolveStorage(storage?: HumanVsAiStorage): HumanVsAiStorage | null {
  if (storage) {
    return storage;
  }

  if (typeof localStorage === "undefined") {
    return null;
  }

  return localStorage;
}

export function readStoredHumanVsAiConfig(storage?: HumanVsAiStorage): HumanVsAiMatchConfig | null {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) {
    return null;
  }

  const rawValue = resolvedStorage.getItem(HUMAN_VS_AI_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as StoredHumanVsAiConfig;
    return normalizeStoredConfig(parsedValue);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to parse stored human vs AI config.", error);
    }

    return null;
  }
}

export function loadHumanVsAiConfig(storage?: HumanVsAiStorage): HumanVsAiMatchConfig {
  return readStoredHumanVsAiConfig(storage) ?? createDefaultHumanVsAiConfig();
}

export function saveHumanVsAiConfig(
  config: HumanVsAiMatchConfig,
  storage?: HumanVsAiStorage,
): void {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) {
    return;
  }

  resolvedStorage.setItem(HUMAN_VS_AI_STORAGE_KEY, JSON.stringify(config));
}
