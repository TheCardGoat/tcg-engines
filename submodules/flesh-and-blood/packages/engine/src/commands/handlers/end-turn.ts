import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { beginFabEndTurnProcedure } from "../../procedures/turn/index.ts";

export function handleEndTurn(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"end-turn">,
): FabCommandHandlerResult {
  const result = beginFabEndTurnProcedure(
    context.state,
    actorId,
    command.arsenalInstanceId ?? null,
    context.transactionOptions(),
    command.traverse === true,
    command.chooseArsenal === true,
  );
  if (!result.accepted) return result;
  return {
    accepted: true,
    move: "end-turn",
    actorId,
    state: context.state,
    outcome: { kind: "applied" },
  };
}
