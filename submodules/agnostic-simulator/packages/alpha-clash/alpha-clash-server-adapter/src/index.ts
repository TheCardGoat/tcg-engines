import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { alphaClashServerAdapter } from "./adapter";

export { alphaClashServerAdapter } from "./adapter";
export { AlphaClashServerEngine, alphaClashDecisionSeat } from "./alpha-clash-server-engine";
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
export {
  getAlphaClashDeckBuilderCatalog,
  ALPHA_CLASH_DECK_BUILDER_RULES,
  type AlphaClashDeckBuilderCard,
  type AlphaClashDeckBuilderCatalog,
  type AlphaClashDeckBuilderPrinting,
  type AlphaClashDeckBuilderRules,
} from "./deck-builder-catalog";

export function registerAlphaClashServerAdapter(): void {
  registerGameAdapter(alphaClashServerAdapter);
}
