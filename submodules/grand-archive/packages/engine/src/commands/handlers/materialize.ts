import { proposeGrandArchiveMaterialization } from "../../procedures/activation/activation.ts";
import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";
import { grandArchiveActivationFailure } from "./activation-failure.ts";

export function handleGrandArchiveMaterialize(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  command: GrandArchiveCommandFor<"materialize">,
): GrandArchiveCommandTransition {
  const original = context.getState();
  try {
    const proposal = proposeGrandArchiveMaterialization(
      context.getProgram(),
      context.getState(),
      playerId,
      command,
    );
    return context.commit(proposal.events);
  } catch (error) {
    context.replaceState(original);
    return grandArchiveActivationFailure(context, error);
  }
}
