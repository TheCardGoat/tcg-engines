import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { gundamServerAdapter } from "./adapter.js";

export { gundamServerAdapter } from "./adapter.js";
export { GundamServerEngine } from "./gundam-server-engine.js";
export {
  buildGundamInteractionView,
  describeGundamInteractionProcedure,
  gundamSubmissionToPayload,
  gundamTargetInputBinding,
  seedGundamInteractionSource,
  type GundamInteractionPayload,
  type GundamPendingChoice,
  type GundamPendingMoveStep,
} from "./interaction-protocol.js";

/**
 * Register the Gundam adapter with the global registry. Idempotent.
 */
export function registerGundamServerAdapter(): void {
  registerGameAdapter(gundamServerAdapter);
}
