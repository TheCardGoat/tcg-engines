import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import {
  grandArchiveEndPhaseEvents,
  grandArchiveRecollectionPhaseEvents,
} from "../../procedures/turn-progression.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";

export function handleGrandArchiveSkipMaterialization(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  _command: GrandArchiveCommandFor<"skip-materialization">,
): GrandArchiveCommandTransition {
  const state = context.getState();
  if (
    state.turn.playerId !== playerId ||
    state.turn.phase !== "materialize" ||
    !state.turn.materializeChoicePending
  ) {
    return context.failure(
      "illegal-command",
      "Only the turn player may skip their materialization",
    );
  }
  const additional = state.turn.materializeKind === "additional";
  return context.commit(
    additional
      ? grandArchiveEndPhaseEvents(context, state, playerId, "materialization-declined")
      : grandArchiveRecollectionPhaseEvents(context, state, playerId, "materialization-declined"),
  );
}
