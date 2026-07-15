import type { DeepReadonly, MatchState } from "../runtime";
import type { GameEngine } from "./contracts";

function assertReadonlyState(engine: GameEngine) {
  const state = engine.getState();
  const readonlyState: DeepReadonly<MatchState> = state;

  void readonlyState;

  // @ts-expect-error returned engine state must be deep-readonly
  state.G.lore = {};
}

void assertReadonlyState;
