import type { RuntimeApiEnv } from "../../../../runtime/gameRuntimeApi";
import { gameApiBaseUrl, normalizeApiBase, playUrl } from "../../../../runtime/gameRuntimeApi";

export const CYBERPUNK_GAME_SLUG = "cyberpunk";

export function cyberpunkApiBaseUrl(env?: RuntimeApiEnv): string {
  return gameApiBaseUrl(CYBERPUNK_GAME_SLUG, env);
}

export function buildCyberpunkQuickMatchUrl(env?: RuntimeApiEnv): string {
  return playUrl(CYBERPUNK_GAME_SLUG, "/quick-match", env);
}

export { normalizeApiBase };
