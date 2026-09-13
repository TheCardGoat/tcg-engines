import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { advanceFabPassCycle } from "../../procedures/advance/index.ts";

/**
 * Commit that the priority player passed (CR 1.11.4a) and let the advance
 * procedure run whatever a full pass cycle triggers: top-of-stack resolution,
 * combat-step advance, or the end of the Action Phase. This handler owns no
 * advance logic itself.
 */
export function handlePass(
  context: FabCommandHandlerContext,
  actorId: string,
  _command: FabCommandFor<"pass">,
): FabCommandHandlerResult {
  const state = context.state;
  if (actorId !== state.priority?.holderPlayerId) {
    return {
      accepted: false,
      error: "Only the player with priority can pass.",
      errorCode: "not_priority_player",
    };
  }

  const result = advanceFabPassCycle(state, actorId, context.transactionOptions());
  if (!result.accepted) {
    return { accepted: false, error: result.error, errorCode: result.errorCode };
  }
  return {
    accepted: true,
    move: "pass",
    actorId,
    state: context.state,
    outcome: { kind: "applied" },
  };
}
