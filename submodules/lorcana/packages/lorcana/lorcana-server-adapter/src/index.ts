import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { lorcanaServerAdapter } from "./adapter";

export { lorcanaServerAdapter } from "./adapter";
export { validateDeckForLorcanaFormat } from "./deck-format-legality";
export { getLorcanaCardFormatLookup } from "./card-format-lookup";
export { LorcanaServerEngine } from "./lorcana-server-engine";

/**
 * Register the Lorcana adapter with the global registry. Idempotent — safe
 * to call multiple times (e.g. once per process plus once per test suite).
 */
export function registerLorcanaServerAdapter(): void {
  registerGameAdapter(lorcanaServerAdapter);
}
