export { createMatchState, createEmptyPlayerState, getOpponentId } from "./initial-state.ts";
export type { CreateMatchStateOptions } from "./initial-state.ts";
export { SeededRNG } from "./rng.ts";
export {
  setCardRegistry,
  clearCardRegistry,
  getCardRegistry,
  getDefinition,
  tryGetDefinition,
  overrideDefinition,
  clearDefinitionOverride,
} from "./card-registry.ts";
export { getInstance, tryGetInstance, getDefinitionFor, defOf, tryDefOf } from "./lookups.ts";
export { getEffectiveActivePlayerId } from "./turn-info.ts";
