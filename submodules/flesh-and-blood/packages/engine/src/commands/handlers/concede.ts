import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { concedeFabGame } from "../../procedures/game-end/concede.ts";

export function handleConcede(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"concede">,
): FabCommandHandlerResult {
  // Canonical machine token (consumed by termination classification and
  // platform persistence); player-facing wording is derived at the log and
  // presentation boundaries.
  const reason = command.reason ?? "concede";
  const result = concedeFabGame(context.state, actorId, reason, context.transactionOptions());
  if (!result.accepted) return result;
  return {
    accepted: true,
    move: "concede",
    actorId,
    state: context.state,
    outcome: { kind: "applied" },
  };
}
