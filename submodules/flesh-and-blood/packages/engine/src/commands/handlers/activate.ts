import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { beginFabActivationProcedure } from "../../procedures/activate-ability/index.ts";

export function handleActivate(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"activate">,
): FabCommandHandlerResult {
  if (actorId !== context.state.priority?.holderPlayerId) {
    return {
      accepted: false,
      error: "Only the player with priority may activate an ability.",
      errorCode: "not_priority_player",
    };
  }

  const result = beginFabActivationProcedure(
    context.state,
    actorId,
    command.instanceId,
    command.ability ?? null,
    context.transactionOptions(),
    command.target ?? null,
    command.alternativeCostIndex ?? null,
  );
  switch (result.kind) {
    case "advanced":
      return {
        accepted: true,
        move: "activate",
        actorId,
        state: context.state,
        outcome: { kind: "applied" },
      };
    case "reversed":
      return {
        accepted: true,
        move: "activate",
        actorId,
        state: context.state,
        outcome: {
          kind: "rules-action-reversed",
          action: "activate",
          reason: result.reason,
        },
      };
    case "failed":
      return { accepted: false, error: result.error, errorCode: result.errorCode };
  }
}
