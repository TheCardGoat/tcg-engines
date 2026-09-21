import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { cyberpunkServerAdapter } from "./adapter";

export { cyberpunkServerAdapter } from "./adapter";
export { cyberpunkAnimationPlan, projectCyberpunkAuthoritativeAnimationPlan } from "./animation";
export { CyberpunkServerEngine } from "./cyberpunk-server-engine";
export { listCyberpunkDeckPresets } from "./deck-presets";
export type { CyberpunkDeckPreset, CyberpunkDeckPresetEntry } from "./deck-presets";

/**
 * Register the Cyberpunk adapter with the global registry. Idempotent.
 */
export function registerCyberpunkServerAdapter(): void {
  registerGameAdapter(cyberpunkServerAdapter);
}
