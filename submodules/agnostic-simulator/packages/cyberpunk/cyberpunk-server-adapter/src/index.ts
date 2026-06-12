import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { cyberpunkServerAdapter } from "./adapter";

export { cyberpunkServerAdapter } from "./adapter";
export { CyberpunkServerEngine } from "./cyberpunk-server-engine";

/**
 * Register the Cyberpunk adapter with the global registry. Idempotent.
 */
export function registerCyberpunkServerAdapter(): void {
  registerGameAdapter(cyberpunkServerAdapter);
}
