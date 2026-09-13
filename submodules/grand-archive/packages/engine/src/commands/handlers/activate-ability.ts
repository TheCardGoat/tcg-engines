import { proposeGrandArchiveAbilityActivation } from "../../procedures/activation/activation.ts";
import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";
import { grandArchiveActivationFailure } from "./activation-failure.ts";

export function handleGrandArchiveActivateAbility(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  command: GrandArchiveCommandFor<"activate-ability">,
): GrandArchiveCommandTransition {
  const original = context.getState();
  try {
    const proposal = proposeGrandArchiveAbilityActivation(
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
