import { createCardCatalog } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, setCardRegistry, type MatchState } from "@tcg/cyberpunk-engine";

const liveMatchCatalog = createCardCatalog();

export function createLiveMatchViewerEngine(state: MatchState): CyberpunkTestEngine {
  // Server-authored Cyberpunk states store card instance definitions by the
  // stable card UUID. Register the production bundle before hydrating the
  // local viewer engine so render-time lookups resolve ids from Redis
  // snapshots instead of relying on prior practice setup.
  setCardRegistry(liveMatchCatalog);
  return CyberpunkTestEngine.fromState(state, { autoGainGig: false });
}
