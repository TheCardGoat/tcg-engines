import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import { determineGrandArchivePassOutcome } from "../../procedures/game-flow/opportunity.ts";
import { completeGrandArchiveEmptyStackPassCycle } from "../../procedures/turn-progression.ts";
import { resolveTopGrandArchiveStackItem } from "../../procedures/effects/stack-resolution.ts";
import { GrandArchiveUnsupportedRuleError } from "../../procedures/effects/evaluation.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";

export function handleGrandArchivePass(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  _command: GrandArchiveCommandFor<"pass">,
): GrandArchiveCommandTransition {
  const state = context.getState();
  if (state.opportunity?.holderId !== playerId) {
    return context.failure("not-opportunity-holder", "Player does not have Opportunity");
  }
  const outcome = determineGrandArchivePassOutcome(state, playerId);
  if (!outcome.cycleComplete) {
    return context.commit([
      {
        type: "opportunity-passed",
        playerId,
        nextPlayerId: outcome.nextPlayerId,
        actorId: playerId,
        cause: { kind: "command", move: "pass" },
      },
    ]);
  }
  if (state.stack.length > 0) {
    const original = state;
    try {
      const closed = context.commit([
        {
          type: "opportunity-passed",
          playerId,
          actorId: playerId,
          cause: { kind: "command", move: "pass" },
        },
        {
          type: "opportunity-closed",
          cause: { kind: "rule", rule: "opportunity-cycle-complete" },
        },
      ]);
      if (context.getState().decision || context.getState().status === "finished") return closed;
      const resolution = resolveTopGrandArchiveStackItem(
        context.getProgram(),
        context.getState(),
        context.getKernel(),
      );
      context.replaceState(resolution.state);
      if (resolution.paused) {
        return {
          ok: true,
          state: resolution.state,
          events: [...closed.events, ...resolution.events],
        };
      }
      return context.stabilize([...closed.events, ...resolution.events], resolution.triggerEvents);
    } catch (error) {
      context.replaceState(original);
      if (error instanceof GrandArchiveUnsupportedRuleError) {
        return context.failure("not-implemented", error.message);
      }
      throw error;
    }
  }
  const original = state;
  try {
    return completeGrandArchiveEmptyStackPassCycle(context, playerId);
  } catch (error) {
    context.replaceState(original);
    if (error instanceof GrandArchiveUnsupportedRuleError) {
      return context.failure("not-implemented", error.message);
    }
    throw error;
  }
}
