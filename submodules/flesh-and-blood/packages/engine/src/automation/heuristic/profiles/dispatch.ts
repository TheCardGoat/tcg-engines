import type { FabBotStrategy } from "../../bot-strategies.ts";
import { valueExtractStrategy } from "../goldfish.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import { rulesViewForLegalCommands } from "../../legal-commands.ts";
import { buildHeuristicSnapshot } from "../snapshot.ts";
import { FAB_HERO_PROFILE_BINDINGS } from "./hero-strategy-table.ts";

/**
 * Dispatch a seated-hero profile; unknown heroes fall back to value-extract.
 *
 * Dispatch order and the set of hero profiles are defined by the single source
 * of truth in {@link FAB_HERO_PROFILE_BINDINGS} (first matcher wins).
 */
export const heroProfileStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const heroIdentity = {
    heroName: snapshot.heroName,
    heroCanonicalId: snapshot.heroCanonicalId,
  };
  for (const binding of FAB_HERO_PROFILE_BINDINGS) {
    if (binding.heroMatch(heroIdentity)) {
      return binding.strategy(runtime, actorId, legalCommands, context);
    }
  }
  return valueExtractStrategy(runtime, actorId, legalCommands, context);
};
