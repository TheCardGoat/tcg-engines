import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { alphaClashServerAdapter } from "./adapter";

export { alphaClashServerAdapter } from "./adapter";
export { AlphaClashServerEngine } from "./alpha-clash-server-engine";
export {
  ALPHA_CLASH_CONTENDER_SECTION_ID,
  ALPHA_CLASH_MAIN_SECTION_ID,
  alphaClashCreateServerEngine,
  alphaClashExtractCardsMapsFromSnapshot,
  alphaClashRestoreEngine,
  alphaClashSerializeEngine,
} from "./alpha-clash-engine-lifecycle";
export {
  alphaClashSubmissionToPayload,
  buildAlphaClashInteractionView,
} from "./interaction-protocol";
export { alphaClashBotCommand } from "./bot";

export function registerAlphaClashServerAdapter(): void {
  registerGameAdapter(alphaClashServerAdapter);
}
