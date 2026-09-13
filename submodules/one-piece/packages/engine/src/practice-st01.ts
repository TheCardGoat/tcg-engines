import { registerCards } from "../../cards/src/runtime-catalog.ts";
import { allCards } from "../../cards/src/index.ts";

registerCards(allCards);

export { applyCommand, createMatch, getLegalCommands, getPotentialCardCommands } from "./core.ts";
export {
  commandFromDescriptor,
  greedyStrategy,
  passOnlyStrategy,
} from "./automation/bot-strategies.ts";
export {
  createSt01MirrorPracticeConfig,
  createSt01PlayerConfig,
  ST01_LEADER_CARD_ID,
  ST01_MAIN_DECK,
} from "./starter-decks.ts";
export { placeStartingLife } from "./state.ts";

export type {
  ApplyCommandResult,
  EngineAnimation,
  LegalCommandDescriptor,
  MatchState,
  PotentialCardCommandDescriptor,
} from "./types.ts";
