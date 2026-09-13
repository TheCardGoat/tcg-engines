import { mutateInPlace } from "../../copy-on-write.ts";
import type { FabMatchState } from "../../state.ts";
import { executeFabEventTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";

export type FabConcedeResult =
  | { readonly accepted: true; readonly state: FabMatchState }
  | {
      readonly accepted: false;
      readonly state: FabMatchState;
      readonly error: string;
      readonly errorCode: string;
    };

/** Ends the game through the canonical lose-game event transaction. */
export function concedeFabGame(
  current: FabMatchState,
  actorId: string,
  reason: string,
  options: FabEventTransactionOptions,
): FabConcedeResult {
  const state = mutateInPlace(current, (draft) => {
    draft.stateID += 1;
  });
  const result = executeFabEventTransaction(
    state,
    (processId) => [
      {
        name: "lose-game",
        processId,
        cause: { kind: "player-command", actorId, command: "concede" },
        controllerId: actorId,
        source: null,
        affected: [],
        bindings: {},
        data: { playerId: actorId, reason },
      },
    ],
    options,
  );
  return { accepted: true, state: result.state };
}
