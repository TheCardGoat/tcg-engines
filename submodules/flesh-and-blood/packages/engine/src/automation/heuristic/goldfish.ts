import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import type { FabBotStrategy } from "../bot-strategies.ts";
import { rulesViewForLegalCommands } from "../legal-commands.ts";
import { chooseCompiledLineCommand, compileTurnLine } from "./line-compiler.ts";
import { buildHeuristicSnapshot } from "./snapshot.ts";
import type { FabGoldfishPersona, FabLineRankingHint } from "./types.ts";

function goldfishStrategy(persona: FabGoldfishPersona): FabBotStrategy {
  return (runtime, actorId, legalCommands, context) => {
    const stateID = runtime.getStateID();
    const view =
      rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
    const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
    const line = compileTurnLine(snapshot, legalCommands, {
      onRanked: context?.onRanked,
      persona,
      hint: context?.ranking,
    });
    return chooseCompiledLineCommand(line, legalCommands);
  };
}

/** Unknown-hero default: extract the most value from the current hand + arsenal. */
export const valueExtractStrategy: FabBotStrategy = goldfishStrategy("value-extract");

/** Only defends / blocks; never opens an attack when a pass or end-turn exists. */
export const defendOnlyStrategy: FabBotStrategy = goldfishStrategy("defend-only");

/** Never spends cards on defense. */
export const neverDefendStrategy: FabBotStrategy = goldfishStrategy("never-defend");

export function goldfishWithHint(
  persona: FabGoldfishPersona,
  hint: FabLineRankingHint,
): FabBotStrategy {
  const inner = goldfishStrategy(persona);
  return (runtime, actorId, legalCommands, context) =>
    inner(runtime, actorId, legalCommands, { ...context, ranking: hint });
}
