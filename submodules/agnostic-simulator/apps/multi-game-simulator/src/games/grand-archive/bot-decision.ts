import {
  chooseGrandArchiveAutomatedAction,
  getSafeGrandArchiveAutomatedActionStrategyOption,
} from "@tcg/grand-archive-engine/automation/decision";
export type GrandArchiveBotContext = Parameters<typeof chooseGrandArchiveAutomatedAction>[0];
export interface GrandArchiveBotInput {
  state: Parameters<typeof chooseGrandArchiveAutomatedAction>[1];
  player: Parameters<typeof chooseGrandArchiveAutomatedAction>[2];
  strategyId: string;
}
export function decideGrandArchiveBot(
  input: GrandArchiveBotInput,
  program: GrandArchiveBotContext,
) {
  return {
    choice: chooseGrandArchiveAutomatedAction(
      program,
      input.state,
      input.player,
      getSafeGrandArchiveAutomatedActionStrategyOption(input.strategyId).strategy,
    ),
  };
}
