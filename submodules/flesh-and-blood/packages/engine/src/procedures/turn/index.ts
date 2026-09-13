import type { FabMatchState } from "../../state.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { advanceFabEndTurnProcedure } from "./advance.ts";
import { advanceFabInitialTurnProcedure } from "./start.ts";

export type { FabEndTurnResult } from "./types.ts";
export { beginFabEndTurnProcedure } from "./begin.ts";
export { beginFabInitialTurnProcedure } from "./start.ts";
export { advanceFabEndTurnProcedure } from "./advance.ts";
export { resumeFabTurnPitchOrder, resumeFabTurnHeave, resumeFabTurnArsenal } from "./resume.ts";

export function advanceFabTurnProcedure(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): void {
  switch (state.rulesProcess?.procedure?.kind) {
    case "start-turn":
      advanceFabInitialTurnProcedure(state, options);
      return;
    case "end-turn":
      advanceFabEndTurnProcedure(state, options);
      return;
    default:
      return;
  }
}
