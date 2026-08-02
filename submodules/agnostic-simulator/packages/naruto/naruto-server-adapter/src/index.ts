import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { narutoServerAdapter } from "./adapter";

export { narutoServerAdapter } from "./adapter";
export {
  NarutoServerEngine,
  narutoActionFromPayload,
  narutoCreateServerEngine,
  narutoExtractCardsMapsFromSnapshot,
  narutoRestoreEngine,
  narutoSerializeEngine,
} from "./engine";
export {
  NARUTO_ACTION_IDS,
  buildNarutoInteractionView,
  narutoSubmissionToAction,
} from "./interaction";
export type { NarutoInteractionActionId } from "./interaction";
export {
  actorIdForPlayer,
  parseSnapshotState,
  playerIdForActor,
  toSnapshotState,
} from "./state-mapper";
export type { NarutoSeatMap, NarutoSnapshotState } from "./state-mapper";

/**
 * Register the Naruto adapter with the global registry. Idempotent.
 */
export function registerNarutoServerAdapter(): void {
  registerGameAdapter(narutoServerAdapter);
}
