import { registerCards } from "../../cards/src/runtime-catalog.ts";
import { allCards } from "../../cards/src/index.ts";

registerCards(allCards);

export { applyCommand, createMatch, getLegalCommands } from "./core.ts";
export { commandFromDescriptor, greedyStrategy } from "./automation/bot-strategies.ts";
export {
  createSt01MirrorPracticeConfig,
  createSt01PlayerConfig,
  ST01_LEADER_CARD_ID,
  ST01_MAIN_DECK,
} from "./starter-decks.ts";

export type { LegalCommandDescriptor, MatchState } from "./types.ts";
