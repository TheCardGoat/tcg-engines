import {
  chooseAutomatedAction,
  FabMatchRuntime,
  restoreFabMatchSnapshot,
  createFabMatchContext,
  getSafeFabAutomatedActionStrategyOption,
  nextRandom,
  type FabMatchSnapshotV21,
} from "@tcg/flesh-and-blood-engine/simulator";
export type FabBotContext = ReturnType<typeof createFabMatchContext>;
export interface FabBotInput {
  snapshot: FabMatchSnapshotV21;
  player: string;
  strategyId: string;
  rngState: Parameters<typeof nextRandom>[0];
}
export function decideFabBot(input: FabBotInput, context: FabBotContext) {
  const runtime = new FabMatchRuntime(restoreFabMatchSnapshot(input.snapshot, context));
  let rngState = input.rngState;
  const choice = chooseAutomatedAction(
    runtime,
    input.player,
    getSafeFabAutomatedActionStrategyOption(input.strategyId).strategy,
    {
      random: () => {
        const next = nextRandom(rngState);
        rngState = next.state;
        return next.value;
      },
    },
  );
  return { choice, rngState };
}
